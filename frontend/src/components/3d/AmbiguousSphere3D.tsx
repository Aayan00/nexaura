import { useMemo, useRef, forwardRef, useImperativeHandle } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'

export type ColorMode = 'cyan' | 'neotokyo' | 'emerald' | 'amber'
export type DensityMode = 'low' | 'med' | 'high'

export interface AmbiguousSphere3DHandle {
  resetCamera: () => void
}

interface AmbiguousSphere3DProps {
  speed?: number
  direction?: number
  isPaused?: boolean
  colorMode?: ColorMode
  density?: DensityMode
  reducedMotion?: boolean
  className?: string
}

// Generate circular particle texture with soft falloff for glowing neon dots
function createCircleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.85)')
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.25)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// Color palettes for perception modes
const PALETTES: Record<ColorMode, { primary: THREE.Color; secondary: THREE.Color; accent: THREE.Color; glowHex: string }> = {
  cyan: {
    primary: new THREE.Color('#00f0ff'), // Electric Cyan
    secondary: new THREE.Color('#8b5cf6'), // Violet
    accent: new THREE.Color('#ff007f'), // Magenta micro-accent
    glowHex: '#00f0ff',
  },
  neotokyo: {
    primary: new THREE.Color('#ff007f'), // Magenta
    secondary: new THREE.Color('#a855f7'), // Deep Purple
    accent: new THREE.Color('#00f0ff'), // Electric Cyan
    glowHex: '#ff007f',
  },
  emerald: {
    primary: new THREE.Color('#10b981'), // Matrix Emerald
    secondary: new THREE.Color('#06b6d4'), // Cyan
    accent: new THREE.Color('#84cc16'), // Lime
    glowHex: '#10b981',
  },
  amber: {
    primary: new THREE.Color('#f59e0b'), // Amber Terminal
    secondary: new THREE.Color('#eab308'), // Gold
    accent: new THREE.Color('#f97316'), // Bright Orange
    glowHex: '#f59e0b',
  },
}

function SpherePointCloud({
  speed = 1.0,
  direction = 1,
  isPaused = false,
  colorMode = 'cyan',
  density = 'med',
  reducedMotion = false,
}: {
  speed: number
  direction: number
  isPaused: boolean
  colorMode: ColorMode
  density: DensityMode
  reducedMotion: boolean
}) {
  const pointsRef = useRef<THREE.Points>(null)
  const sphereGroupRef = useRef<THREE.Group>(null)
  const currentDirRef = useRef<number>(direction)
  const scanSweepRef = useRef<THREE.Mesh>(null)
  const guideRingsRef = useRef<THREE.Group>(null)

  // Determine count based on density and screen width
  const particleCount = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    if (isMobile) {
      if (density === 'low') return 1200
      if (density === 'high') return 2800
      return 2000
    }
    if (density === 'low') return 3000
    if (density === 'high') return 8000
    return 5500
  }, [density])

  const circleTexture = useMemo(() => createCircleTexture(), [])

  // Procedural uniform spherical point cloud using Fibonacci sphere projection
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const col = new Float32Array(particleCount * 3)
    const palette = PALETTES[colorMode]
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    const phi = 2 * Math.PI * (1 - 1 / goldenRatio)
    const radius = 1.85

    for (let i = 0; i < particleCount; i++) {
      // Latitude distribution
      const y = 1 - (i / (particleCount - 1)) * 2
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = phi * i

      // Subtle organic surface variation (+/- 0.04)
      const jitter = (Math.random() - 0.5) * 0.06
      const r = radius + jitter

      pos[i * 3] = Math.cos(theta) * radiusAtY * r
      pos[i * 3 + 1] = y * r
      pos[i * 3 + 2] = Math.sin(theta) * radiusAtY * r

      // Distribution: 62% primary, 28% secondary, 10% accent
      const rand = Math.random()
      let c: THREE.Color
      if (rand < 0.62) {
        c = palette.primary
      } else if (rand < 0.9) {
        c = palette.secondary
      } else {
        c = palette.accent
      }

      // Subtle brightness modulation
      const brightness = 0.72 + Math.random() * 0.45
      col[i * 3] = Math.min(1, c.r * brightness)
      col[i * 3 + 1] = Math.min(1, c.g * brightness)
      col[i * 3 + 2] = Math.min(1, c.b * brightness)
    }

    return [pos, col]
  }, [particleCount, colorMode])

  // Continuous infinite animation loop with delta-time (Frame-rate independent)
  useFrame((state, delta) => {
    if (isPaused) return

    // Smoothly interpolate directional change (prevents jarring snaps, creates authentic ambiguous bistable flip)
    const lerpRate = reducedMotion ? 1.5 : 3.5
    currentDirRef.current = THREE.MathUtils.lerp(currentDirRef.current, direction, delta * lerpRate)

    const effectiveSpeed = speed * (reducedMotion ? 0.35 : 1.0) * 0.62

    // Primary Y-axis rotation causing kinetic depth effect
    if (sphereGroupRef.current) {
      sphereGroupRef.current.rotation.y += currentDirRef.current * effectiveSpeed * delta
      // Gentle secondary pitch tilt to reveal latitude/longitude curvature
      sphereGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.09
      sphereGroupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.25) * 0.04
    }

    // Holographic radar sweep beam rotation
    if (scanSweepRef.current) {
      scanSweepRef.current.rotation.y += delta * 1.2
    }

    // Guide rings counter-rotation
    if (guideRingsRef.current) {
      guideRingsRef.current.rotation.y -= delta * 0.15
    }
  })

  const palette = PALETTES[colorMode]

  return (
    <group>
      {/* Central Rotating Particle Cloud Sphere */}
      <group ref={sphereGroupRef}>
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[colors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.046}
            map={circleTexture}
            vertexColors
            transparent
            opacity={0.88}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            sizeAttenuation
          />
        </points>

        {/* Thin Futuristic Latitude & Longitude Guide Lines */}
        <group ref={guideRingsRef}>
          {/* Equator Guide Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.86, 0.006, 8, 64]} />
            <meshBasicMaterial
              color={palette.primary}
              transparent
              opacity={0.25}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Meridian Ring 0° */}
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[1.86, 0.005, 8, 64]} />
            <meshBasicMaterial
              color={palette.secondary}
              transparent
              opacity={0.18}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Meridian Ring 90° */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[1.86, 0.005, 8, 64]} />
            <meshBasicMaterial
              color={palette.accent}
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Northern Latitude 45° */}
          <mesh position={[0, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.31, 0.004, 8, 48]} />
            <meshBasicMaterial
              color={palette.primary}
              transparent
              opacity={0.18}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Southern Latitude 45° */}
          <mesh position={[0, -1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.31, 0.004, 8, 48]} />
            <meshBasicMaterial
              color={palette.primary}
              transparent
              opacity={0.18}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      </group>

      {/* Holographic Circular Radar Scanning Beam */}
      <mesh ref={scanSweepRef} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.05, 2.15, 32, 1, 0, Math.PI * 0.28]} />
        <meshBasicMaterial
          color={palette.primary}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Holographic Gimbal Ring 1 */}
      <mesh rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[2.28, 0.012, 12, 80]} />
        <meshBasicMaterial
          color={palette.primary}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Holographic Gimbal Ring 2 (Dashed/Segmented feel) */}
      <mesh rotation={[-0.3, -0.4, 0.2]}>
        <torusGeometry args={[2.48, 0.008, 12, 80]} />
        <meshBasicMaterial
          color={palette.secondary}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

export const AmbiguousSphere3D = forwardRef<AmbiguousSphere3DHandle, AmbiguousSphere3DProps>(
  (
    {
      speed = 1.0,
      direction = 1,
      isPaused = false,
      colorMode = 'cyan',
      density = 'med',
      reducedMotion = false,
      className = 'h-80 sm:h-96 w-full',
    },
    ref
  ) => {
    const controlsRef = useRef<OrbitControlsType>(null)

    useImperativeHandle(ref, () => ({
      resetCamera: () => {
        if (controlsRef.current) {
          controlsRef.current.reset()
        }
      },
    }))

    return (
      <div className={`relative ${className} select-none`}>
        <Canvas
          camera={{ position: [0, 0, 4.9], fov: 48 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
        >
          {/* Subtle Ambient & Tint Lights */}
          <ambientLight intensity={0.4} />
          <pointLight position={[4, 5, 4]} intensity={1.5} color={PALETTES[colorMode].glowHex} />
          <pointLight position={[-4, -5, -3]} intensity={1.2} color="#8b5cf6" />

          {/* Ambiguous Kinetic Depth Point Cloud */}
          <SpherePointCloud
            speed={speed}
            direction={direction}
            isPaused={isPaused}
            colorMode={colorMode}
            density={density}
            reducedMotion={reducedMotion}
          />

          {/* Interactive Mouse & Touch Camera Controls */}
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            minDistance={3.2}
            maxDistance={7.5}
            enableDamping={true}
            dampingFactor={0.06}
            rotateSpeed={0.8}
          />
        </Canvas>
      </div>
    )
  }
)

AmbiguousSphere3D.displayName = 'AmbiguousSphere3D'
