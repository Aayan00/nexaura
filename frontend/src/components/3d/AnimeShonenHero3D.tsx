import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'

export type AnimePose = 'idle' | 'ready' | 'focus' | 'victory' | 'meditation'
export type AuraPowerMode = 'normal' | 'focus' | 'overdrive'
export type AnimeTheme = 'default' | 'cyan_void' | 'neo_tokyo' | 'amber_terminal' | 'matrix_emerald'
export type CameraPreset = 'full' | 'portrait' | 'action'

interface AnimeShonenHeroProps {
  pose?: AnimePose
  powerMode?: AuraPowerMode
  theme?: AnimeTheme
  cameraPreset?: CameraPreset
  autoRotate?: boolean
  wireframe?: boolean
  resetTrigger?: number
  zoomLevel?: number
  modelUrl?: string
  showVisor?: boolean
}

// Color palettes for themes
const THEME_PALETTES: Record<AnimeTheme, {
  skin: string
  hairBase: string
  hairTip: string
  hairHighlight: string
  jacket: string
  jacketLining: string
  armor: string
  carbon: string
  neonPrimary: string
  neonSecondary: string
  neonAccent: string
  auraPrimary: THREE.Color
  auraSecondary: THREE.Color
}> = {
  default: {
    skin: '#fcd3b8',
    hairBase: '#121622',
    hairTip: '#00f0ff',
    hairHighlight: '#8b5cf6',
    jacket: '#0a0e1a',
    jacketLining: '#7c3aed',
    armor: '#e2e8f0', // Pearl White Titanium
    carbon: '#060912',
    neonPrimary: '#00f0ff', // Electric Cyan
    neonSecondary: '#8b5cf6', // Violet
    neonAccent: '#ff007f', // Magenta micro-accent
    auraPrimary: new THREE.Color('#00f0ff'),
    auraSecondary: new THREE.Color('#8b5cf6'),
  },
  cyan_void: {
    skin: '#fcd3b8',
    hairBase: '#080c16',
    hairTip: '#38bdf8',
    hairHighlight: '#0284c7',
    jacket: '#040814',
    jacketLining: '#0369a1',
    armor: '#f1f5f9',
    carbon: '#020617',
    neonPrimary: '#00f0ff',
    neonSecondary: '#0284c7',
    neonAccent: '#38bdf8',
    auraPrimary: new THREE.Color('#00f0ff'),
    auraSecondary: new THREE.Color('#0284c7'),
  },
  neo_tokyo: {
    skin: '#fde0ce',
    hairBase: '#16091e',
    hairTip: '#ff007f',
    hairHighlight: '#c084fc',
    jacket: '#110519',
    jacketLining: '#a21caf',
    armor: '#1e1028',
    carbon: '#0d0314',
    neonPrimary: '#ff007f',
    neonSecondary: '#a855f7',
    neonAccent: '#00f0ff',
    auraPrimary: new THREE.Color('#ff007f'),
    auraSecondary: new THREE.Color('#a855f7'),
  },
  amber_terminal: {
    skin: '#fbd7c2',
    hairBase: '#1c1308',
    hairTip: '#f59e0b',
    hairHighlight: '#f97316',
    jacket: '#120d05',
    jacketLining: '#c2410c',
    armor: '#292524',
    carbon: '#0c0803',
    neonPrimary: '#f59e0b',
    neonSecondary: '#ea580c',
    neonAccent: '#fbbf24',
    auraPrimary: new THREE.Color('#f59e0b'),
    auraSecondary: new THREE.Color('#ea580c'),
  },
  matrix_emerald: {
    skin: '#fcd5be',
    hairBase: '#07160f',
    hairTip: '#10b981',
    hairHighlight: '#06b6d4',
    jacket: '#04130c',
    jacketLining: '#047857',
    armor: '#0f291e',
    carbon: '#020d07',
    neonPrimary: '#10b981',
    neonSecondary: '#06b6d4',
    neonAccent: '#84cc16',
    auraPrimary: new THREE.Color('#10b981'),
    auraSecondary: new THREE.Color('#06b6d4'),
  },
}

// 1. External GLB / GLTF Model Component with safe centering and fallback
function ExternalGLBModel({ url, pose }: { url: string; pose: AnimePose }) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [scene])

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime()
      const floatAmp = pose === 'meditation' ? 0.09 : 0.02
      groupRef.current.position.y = Math.sin(t * 1.8) * floatAmp - 0.95
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.95, 0]}>
      <primitive object={scene} scale={[1.05, 1.05, 1.05]} position={[0, 0, 0]} />
    </group>
  )
}

// 2. High-Tech Holographic Stage Platform
function HolographicAnimePlatform({ theme = 'default' }: { theme: AnimeTheme }) {
  const innerRingRef = useRef<THREE.Group>(null)
  const outerRingRef = useRef<THREE.Group>(null)
  const runesRef = useRef<THREE.Mesh>(null)
  const palette = THEME_PALETTES[theme]

  useFrame((_, delta) => {
    if (innerRingRef.current) innerRingRef.current.rotation.y += delta * 0.4
    if (outerRingRef.current) outerRingRef.current.rotation.y -= delta * 0.25
    if (runesRef.current) runesRef.current.rotation.z += delta * 0.15
  })

  return (
    <group position={[0, -1.02, 0]}>
      {/* Heavy Cylindrical Base Floor */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <cylinderGeometry args={[1.75, 1.9, 0.24, 48]} />
        <meshStandardMaterial
          color="#060914"
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>

      {/* Titanium Stage Top Surface with Mirror Reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <circleGeometry args={[1.74, 48]} />
        <meshStandardMaterial
          color="#0b1226"
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>

      {/* Outer Cyan Neon Ring */}
      <mesh ref={outerRingRef} position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.62, 1.68, 48]} />
        <meshBasicMaterial
          color={palette.neonPrimary}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner Violet Neon Ring */}
      <mesh ref={innerRingRef} position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.25, 1.29, 36]} />
        <meshBasicMaterial
          color={palette.neonSecondary}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rotating Cyber Hologram Rune Ring */}
      <mesh ref={runesRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.75, 1.05, 8, 1]} />
        <meshBasicMaterial
          color={palette.neonPrimary}
          transparent
          opacity={0.35}
          wireframe
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4 Corner Holographic Beacon Projectors */}
      {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, i) => {
        const x = Math.cos(angle) * 1.55
        const z = Math.sin(angle) * 1.55
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.06, 0.09, 0.16, 16]} />
              <meshStandardMaterial
                color="#0f172a"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            {/* Vertical Laser Light Beam */}
            <mesh position={[0, 0.9, 0]}>
              <cylinderGeometry args={[0.008, 0.012, 1.6, 8]} />
              <meshBasicMaterial
                color={palette.neonPrimary}
                transparent
                opacity={0.4}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// 3. Power Aura Component (Normal, Focus, Overdrive)
function PowerAura({
  powerMode = 'normal',
  theme = 'default',
}: {
  powerMode: AuraPowerMode
  theme: AnimeTheme
}) {
  const auraGroupRef = useRef<THREE.Group>(null)
  const ribbon1Ref = useRef<THREE.Mesh>(null)
  const ribbon2Ref = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const palette = THEME_PALETTES[theme]

  const particleCount = powerMode === 'overdrive' ? 240 : powerMode === 'focus' ? 120 : 60

  // Floating Chi/Aura Particles
  const [positions, pColors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const cols = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const radius = 0.4 + Math.random() * 0.9
      const theta = Math.random() * Math.PI * 2
      pos[i * 3] = Math.cos(theta) * radius
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.2 + 0.3
      pos[i * 3 + 2] = Math.sin(theta) * radius

      const isSec = Math.random() > 0.6
      const c = isSec ? palette.auraSecondary : palette.auraPrimary
      cols[i * 3] = c.r
      cols[i * 3 + 1] = c.g
      cols[i * 3 + 2] = c.b
    }
    return [pos, cols]
  }, [particleCount, palette])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // Upward floating particles
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute
      const arr = posAttr.array as Float32Array
      const speed = powerMode === 'overdrive' ? 1.6 : powerMode === 'focus' ? 1.1 : 0.6
      for (let i = 0; i < particleCount; i++) {
        arr[i * 3 + 1] += delta * speed
        // Wrap around vertically
        if (arr[i * 3 + 1] > 2.2) {
          arr[i * 3 + 1] = -0.8
        }
      }
      posAttr.needsUpdate = true
    }

    // Spiraling Energy Ribbons in Overdrive / Focus
    if (ribbon1Ref.current) {
      ribbon1Ref.current.rotation.y += delta * (powerMode === 'overdrive' ? 3.2 : 1.8)
      ribbon1Ref.current.scale.setScalar(1 + Math.sin(t * 4) * 0.06)
    }
    if (ribbon2Ref.current) {
      ribbon2Ref.current.rotation.y -= delta * (powerMode === 'overdrive' ? 2.6 : 1.4)
      ribbon2Ref.current.scale.setScalar(1 + Math.cos(t * 4) * 0.06)
    }
  })

  return (
    <group ref={auraGroupRef} position={[0, 0.4, 0]}>
      {/* Floating Ascending Chi Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[pColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={powerMode === 'overdrive' ? 0.055 : 0.042}
          vertexColors
          transparent
          opacity={powerMode === 'overdrive' ? 0.95 : 0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Energy Flame Spirals (Focus & Overdrive) */}
      {powerMode !== 'normal' && (
        <>
          <mesh ref={ribbon1Ref} position={[0, 0.3, 0]}>
            <torusGeometry args={[0.78, 0.016, 8, 48]} />
            <meshBasicMaterial
              color={palette.neonPrimary}
              transparent
              opacity={powerMode === 'overdrive' ? 0.85 : 0.45}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh ref={ribbon2Ref} position={[0, 0.65, 0]} rotation={[0.4, 0, 0.3]}>
            <torusGeometry args={[0.92, 0.018, 8, 48]} />
            <meshBasicMaterial
              color={palette.neonSecondary}
              transparent
              opacity={powerMode === 'overdrive' ? 0.75 : 0.35}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </>
      )}

      {/* Overdrive Lightning Arcs Outer Orbit */}
      {powerMode === 'overdrive' && (
        <mesh rotation={[0.2, 0, -0.4]}>
          <ringGeometry args={[1.08, 1.15, 6, 1]} />
          <meshBasicMaterial
            color="#00f0ff"
            wireframe
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}

// 4. Stylized Spiky Anime Hair Component
function AnimeSpikyHair({ palette }: { palette: typeof THEME_PALETTES['default'] }) {
  return (
    <group position={[0, 0.22, 0]}>
      {/* Base Scalp Cap */}
      <mesh position={[0, 0.02, -0.02]}>
        <sphereGeometry args={[0.25, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
        <meshStandardMaterial color={palette.hairBase} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Central Swept Bangs (Over Forehead) */}
      <mesh position={[0, 0.06, 0.22]} rotation={[0.4, 0, 0.1]}>
        <coneGeometry args={[0.075, 0.28, 4]} />
        <meshStandardMaterial color={palette.hairBase} roughness={0.3} emissive={palette.hairTip} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.08, 0.04, 0.2]} rotation={[0.35, 0.2, -0.2]}>
        <coneGeometry args={[0.065, 0.24, 4]} />
        <meshStandardMaterial color={palette.hairBase} roughness={0.3} emissive={palette.hairTip} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0.08, 0.05, 0.2]} rotation={[0.35, -0.2, 0.2]}>
        <coneGeometry args={[0.065, 0.24, 4]} />
        <meshStandardMaterial color={palette.hairBase} roughness={0.3} emissive={palette.hairHighlight} emissiveIntensity={0.25} />
      </mesh>

      {/* Left Framing Cheek Bangs */}
      <mesh position={[-0.19, -0.05, 0.12]} rotation={[0.2, 0.3, -0.4]}>
        <coneGeometry args={[0.06, 0.32, 4]} />
        <meshStandardMaterial color={palette.hairBase} roughness={0.3} emissive={palette.hairTip} emissiveIntensity={0.35} />
      </mesh>

      {/* Right Framing Cheek Bangs */}
      <mesh position={[0.19, -0.05, 0.12]} rotation={[0.2, -0.3, 0.4]}>
        <coneGeometry args={[0.06, 0.32, 4]} />
        <meshStandardMaterial color={palette.hairBase} roughness={0.3} emissive={palette.hairTip} emissiveIntensity={0.35} />
      </mesh>

      {/* Tall Iconic Shonen Crown Spikes */}
      <mesh position={[0, 0.24, -0.02]} rotation={[-0.15, 0, 0]}>
        <coneGeometry args={[0.09, 0.38, 4]} />
        <meshStandardMaterial color={palette.hairBase} roughness={0.3} emissive={palette.hairTip} emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-0.12, 0.2, -0.04]} rotation={[-0.2, 0.1, -0.35]}>
        <coneGeometry args={[0.08, 0.34, 4]} />
        <meshStandardMaterial color={palette.hairBase} roughness={0.3} emissive={palette.hairHighlight} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.12, 0.2, -0.04]} rotation={[-0.2, -0.1, 0.35]}>
        <coneGeometry args={[0.08, 0.34, 4]} />
        <meshStandardMaterial color={palette.hairBase} roughness={0.3} emissive={palette.hairTip} emissiveIntensity={0.35} />
      </mesh>

      {/* Flared Angular Side Spikes */}
      <mesh position={[-0.24, 0.08, -0.05]} rotation={[-0.1, 0.2, -0.7]}>
        <coneGeometry args={[0.07, 0.32, 4]} />
        <meshStandardMaterial color={palette.hairBase} roughness={0.3} emissive={palette.hairHighlight} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.24, 0.08, -0.05]} rotation={[-0.1, -0.2, 0.7]}>
        <coneGeometry args={[0.07, 0.32, 4]} />
        <meshStandardMaterial color={palette.hairBase} roughness={0.3} emissive={palette.hairTip} emissiveIntensity={0.35} />
      </mesh>

      {/* Rear Nape Spikes */}
      <mesh position={[0, -0.04, -0.22]} rotation={[-0.6, 0, 0]}>
        <coneGeometry args={[0.08, 0.28, 4]} />
        <meshStandardMaterial color={palette.hairBase} roughness={0.3} emissive={palette.hairHighlight} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[-0.12, -0.06, -0.2]} rotation={[-0.5, 0.2, -0.3]}>
        <coneGeometry args={[0.07, 0.26, 4]} />
        <meshStandardMaterial color={palette.hairBase} roughness={0.3} emissive={palette.hairTip} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.12, -0.06, -0.2]} rotation={[-0.5, -0.2, 0.3]}>
        <coneGeometry args={[0.07, 0.26, 4]} />
        <meshStandardMaterial color={palette.hairBase} roughness={0.3} emissive={palette.hairTip} emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

// 5. High-Quality Procedural Anime Shonen Hero Mesh
function AnimeHeroModel({
  pose = 'idle',
  powerMode = 'normal',
  theme = 'default',
  showVisor = true,
}: {
  pose: AnimePose
  powerMode: AuraPowerMode
  theme: AnimeTheme
  showVisor: boolean
}) {
  const masterGroupRef = useRef<THREE.Group>(null)
  const headGroupRef = useRef<THREE.Group>(null)
  const chestGroupRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const leftForearmRef = useRef<THREE.Group>(null)
  const rightForearmRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Group>(null)
  const rightLegRef = useRef<THREE.Group>(null)
  const scarf1Ref = useRef<THREE.Mesh>(null)
  const scarf2Ref = useRef<THREE.Mesh>(null)
  const chestCoreRef = useRef<THREE.Mesh>(null)
  const eyesGlowRef = useRef<THREE.MeshBasicMaterial>(null)

  const palette = THEME_PALETTES[theme]

  // Continuous frame-rate independent animation loop
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    const windMultiplier = powerMode === 'overdrive' ? 2.5 : powerMode === 'focus' ? 1.6 : 1.0

    // Rhythmic Hero Breathing (Chest rise and subtle shoulder dip)
    if (chestGroupRef.current) {
      const breathScale = 1 + Math.sin(t * 2.2) * 0.018
      chestGroupRef.current.scale.set(breathScale, breathScale, breathScale)
    }

    // Gentle Head scanning
    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = Math.sin(t * 0.9) * 0.06
      headGroupRef.current.rotation.x = Math.cos(t * 1.3) * 0.03
    }

    // Dynamic Flowing Scarf / Coat Flutter
    if (scarf1Ref.current) {
      scarf1Ref.current.rotation.z = Math.sin(t * 3.5 * windMultiplier) * 0.18 - 0.25
      scarf1Ref.current.rotation.x = Math.cos(t * 2.8 * windMultiplier) * 0.12 + 0.3
    }
    if (scarf2Ref.current) {
      scarf2Ref.current.rotation.z = Math.cos(t * 3.2 * windMultiplier) * 0.16 + 0.25
      scarf2Ref.current.rotation.x = Math.sin(t * 3.0 * windMultiplier) * 0.14 + 0.32
    }

    // Pulsing Chest Core Energy
    if (chestCoreRef.current) {
      const coreMat = chestCoreRef.current.material as THREE.MeshStandardMaterial
      const pulseSpeed = powerMode === 'overdrive' ? 6 : powerMode === 'focus' ? 4 : 2
      coreMat.emissiveIntensity = 2.0 + Math.sin(t * pulseSpeed) * (powerMode === 'overdrive' ? 1.5 : 0.8)
    }

    // Pulsing Eye Glow
    if (eyesGlowRef.current) {
      eyesGlowRef.current.opacity = 0.85 + Math.sin(t * 3) * 0.15
    }

    // Smooth Pose Target Rotations
    const lerpSpeed = delta * 4.0

    // 1. IDLE POSE
    if (pose === 'idle') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.35, lerpSpeed)
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.05, lerpSpeed)
      }
      if (rightForearmRef.current) {
        rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, -0.2, lerpSpeed)
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.38, lerpSpeed)
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.15, lerpSpeed)
      }
      if (leftForearmRef.current) {
        leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(leftForearmRef.current.rotation.x, -0.55, lerpSpeed) // Hand on hip
      }
      if (leftLegRef.current) {
        leftLegRef.current.rotation.z = THREE.MathUtils.lerp(leftLegRef.current.rotation.z, -0.08, lerpSpeed)
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, lerpSpeed)
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.z = THREE.MathUtils.lerp(rightLegRef.current.rotation.z, 0.08, lerpSpeed)
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, lerpSpeed)
      }
      if (masterGroupRef.current) {
        masterGroupRef.current.position.y = THREE.MathUtils.lerp(masterGroupRef.current.position.y, 0, lerpSpeed)
      }
    }
    // 2. READY POSE (Lowered Ninja Combat Stance)
    else if (pose === 'ready') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.5, lerpSpeed)
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.7, lerpSpeed)
      }
      if (rightForearmRef.current) {
        rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, -0.9, lerpSpeed)
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.5, lerpSpeed)
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.5, lerpSpeed)
      }
      if (leftForearmRef.current) {
        leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(leftForearmRef.current.rotation.x, -1.1, lerpSpeed)
      }
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, -0.35, lerpSpeed)
        leftLegRef.current.rotation.z = THREE.MathUtils.lerp(leftLegRef.current.rotation.z, -0.25, lerpSpeed)
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0.25, lerpSpeed)
        rightLegRef.current.rotation.z = THREE.MathUtils.lerp(rightLegRef.current.rotation.z, 0.25, lerpSpeed)
      }
      if (masterGroupRef.current) {
        masterGroupRef.current.position.y = THREE.MathUtils.lerp(masterGroupRef.current.position.y, -0.1, lerpSpeed)
      }
    }
    // 3. FOCUS POSE (Right Hand Raised Chakra Gathering)
    else if (pose === 'focus') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -1.35, lerpSpeed)
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, lerpSpeed)
      }
      if (rightForearmRef.current) {
        rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, -0.6, lerpSpeed)
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0.4, lerpSpeed)
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.45, lerpSpeed)
      }
      if (leftForearmRef.current) {
        leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(leftForearmRef.current.rotation.x, -0.3, lerpSpeed)
      }
      if (masterGroupRef.current) {
        masterGroupRef.current.position.y = THREE.MathUtils.lerp(masterGroupRef.current.position.y, 0, lerpSpeed)
      }
    }
    // 4. VICTORY POSE (Heroic Arms Crossed with Pride)
    else if (pose === 'victory') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.9, lerpSpeed)
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.85, lerpSpeed)
      }
      if (rightForearmRef.current) {
        rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, -0.7, lerpSpeed)
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.9, lerpSpeed)
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.85, lerpSpeed)
      }
      if (leftForearmRef.current) {
        leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(leftForearmRef.current.rotation.x, -0.7, lerpSpeed)
      }
      if (masterGroupRef.current) {
        masterGroupRef.current.position.y = THREE.MathUtils.lerp(masterGroupRef.current.position.y, 0, lerpSpeed)
      }
    }
    // 5. MEDITATION POSE (Floating Focused Shonen Zen)
    else if (pose === 'meditation') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.65, lerpSpeed)
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.4, lerpSpeed)
      }
      if (rightForearmRef.current) {
        rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, -0.9, lerpSpeed)
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.65, lerpSpeed)
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.4, lerpSpeed)
      }
      if (leftForearmRef.current) {
        leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(leftForearmRef.current.rotation.x, -0.9, lerpSpeed)
      }
      // Floating altitude oscillation
      if (masterGroupRef.current) {
        const floatY = Math.sin(t * 2) * 0.08 + 0.12
        masterGroupRef.current.position.y = THREE.MathUtils.lerp(masterGroupRef.current.position.y, floatY, lerpSpeed)
      }
    }
  })

  return (
    <group ref={masterGroupRef} position={[0, 0, 0]}>
      {/* Dynamic Power Aura Field */}
      <PowerAura powerMode={powerMode} theme={theme} />

      {/* ========================================================
          1. ANIME HEAD & DETAILED HEROIC FACE
         ======================================================== */}
      <group position={[0, 1.34, 0]}>
        <group ref={headGroupRef}>
          {/* Tapered Anime Cranium and Jaw */}
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshStandardMaterial color={palette.skin} roughness={0.5} metalness={0.05} />
          </mesh>

          {/* Sharp Anime Jawline and Chin */}
          <mesh position={[0, -0.14, 0.06]} rotation={[-0.2, 0, 0]}>
            <coneGeometry args={[0.13, 0.22, 4]} />
            <meshStandardMaterial color={palette.skin} roughness={0.5} metalness={0.05} />
          </mesh>

          {/* Expressive Sharp Anime Eyes */}
          {/* Left Eye */}
          <group position={[-0.08, -0.02, 0.185]} rotation={[0.05, -0.1, 0.05]}>
            {/* Eye Sclera (White) */}
            <mesh>
              <planeGeometry args={[0.065, 0.038]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Cyan Glowing Iris */}
            <mesh position={[0, 0, 0.002]}>
              <planeGeometry args={[0.038, 0.034]} />
              <meshBasicMaterial ref={eyesGlowRef} color={palette.neonPrimary} transparent />
            </mesh>
            {/* Pupil */}
            <mesh position={[0, 0, 0.004]}>
              <planeGeometry args={[0.016, 0.02]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
            {/* Top Eyelash / Anime Eye Outline */}
            <mesh position={[0, 0.018, 0.005]}>
              <planeGeometry args={[0.068, 0.008]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            {/* Heroic Eyebrow */}
            <mesh position={[0.01, 0.036, 0.005]} rotation={[0, 0, 0.15]}>
              <planeGeometry args={[0.075, 0.008]} />
              <meshBasicMaterial color={palette.hairBase} />
            </mesh>
          </group>

          {/* Right Eye */}
          <group position={[0.08, -0.02, 0.185]} rotation={[0.05, 0.1, -0.05]}>
            {/* Eye Sclera (White) */}
            <mesh>
              <planeGeometry args={[0.065, 0.038]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Cyan Glowing Iris */}
            <mesh position={[0, 0, 0.002]}>
              <planeGeometry args={[0.038, 0.034]} />
              <meshBasicMaterial color={palette.neonPrimary} />
            </mesh>
            {/* Pupil */}
            <mesh position={[0, 0, 0.004]}>
              <planeGeometry args={[0.016, 0.02]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
            {/* Top Eyelash / Anime Eye Outline */}
            <mesh position={[0, 0.018, 0.005]}>
              <planeGeometry args={[0.068, 0.008]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            {/* Heroic Eyebrow */}
            <mesh position={[-0.01, 0.036, 0.005]} rotation={[0, 0, -0.15]}>
              <planeGeometry args={[0.075, 0.008]} />
              <meshBasicMaterial color={palette.hairBase} />
            </mesh>
          </group>

          {/* Subtle Cybernetic Mark Near Left Temple */}
          <mesh position={[-0.175, -0.01, 0.12]} rotation={[0, -0.8, 0]}>
            <planeGeometry args={[0.04, 0.012]} />
            <meshBasicMaterial color={palette.neonPrimary} />
          </mesh>

          {/* Futuristic Ninja Headband / Forehead Protector */}
          <group position={[0, 0.08, 0.04]}>
            {/* Fabric Band */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.225, 0.028, 8, 32]} />
              <meshStandardMaterial color="#090d18" roughness={0.7} />
            </mesh>
            {/* Titanium Metal Plate */}
            <mesh position={[0, 0.02, 0.205]}>
              <boxGeometry args={[0.18, 0.065, 0.018]} />
              <meshStandardMaterial color={palette.armor} metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Engraved Nexaura Apex Chevron Emblem */}
            <mesh position={[0, 0.02, 0.218]}>
              <coneGeometry args={[0.022, 0.035, 3]} />
              <meshBasicMaterial color={palette.neonPrimary} />
            </mesh>
          </group>

          {/* Optional Tactical Holographic Visor */}
          {showVisor && (
            <mesh position={[0, -0.02, 0.2]}>
              <boxGeometry args={[0.24, 0.05, 0.015]} />
              <meshStandardMaterial
                color={palette.neonPrimary}
                emissive={palette.neonPrimary}
                emissiveIntensity={1.8}
                transparent
                opacity={0.65}
                roughness={0.1}
              />
            </mesh>
          )}

          {/* Spiky Layered Anime Hair */}
          <AnimeSpikyHair palette={palette} />
        </group>
      </group>

      {/* ========================================================
          2. TORSO, HIGH-COLLAR JACKET & NINJA HARNESS
         ======================================================== */}
      <group position={[0, 0.9, 0]}>
        <group ref={chestGroupRef}>
          {/* High Ninja Standing Collar (Frames Jawline) */}
          <mesh position={[0, 0.26, 0.02]}>
            <cylinderGeometry args={[0.16, 0.19, 0.16, 24, 1, true]} />
            <meshStandardMaterial
              color={palette.jacket}
              roughness={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Inner Violet Collar Trim */}
          <mesh position={[0, 0.32, 0.02]}>
            <torusGeometry args={[0.16, 0.008, 8, 24]} />
            <meshBasicMaterial color={palette.neonSecondary} />
          </mesh>

          {/* Athletic Torso / Tactical Jacket */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.26, 0.19, 0.44, 24]} />
            <meshStandardMaterial color={palette.jacket} roughness={0.6} metalness={0.15} />
          </mesh>

          {/* Titanium Chest Armor Harness Plates */}
          <mesh position={[0, 0.08, 0.11]}>
            <boxGeometry args={[0.28, 0.22, 0.06]} />
            <meshStandardMaterial
              color={palette.armor}
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>

          {/* Pulsating Glowing Chest Reactor Emblem (Nexaura Core) */}
          <mesh ref={chestCoreRef} position={[0, 0.1, 0.145]}>
            <circleGeometry args={[0.045, 16]} />
            <meshStandardMaterial
              color={palette.neonPrimary}
              emissive={palette.neonPrimary}
              emissiveIntensity={2.2}
              roughness={0.1}
            />
          </mesh>

          {/* Cyber Utility Belt */}
          <group position={[0, -0.19, 0]}>
            <mesh>
              <cylinderGeometry args={[0.205, 0.205, 0.08, 24]} />
              <meshStandardMaterial color="#080c16" roughness={0.7} metalness={0.4} />
            </mesh>
            {/* Belt Buckle Plate */}
            <mesh position={[0, 0, 0.21]}>
              <boxGeometry args={[0.08, 0.06, 0.02]} />
              <meshStandardMaterial color={palette.armor} metalness={0.9} roughness={0.2} />
            </mesh>
            {/* 2 Cylindrical Power Scrolls / Energy Cartridges */}
            <mesh position={[-0.16, 0, 0.13]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.022, 0.022, 0.08, 12]} />
              <meshBasicMaterial color={palette.neonPrimary} />
            </mesh>
            <mesh position={[0.16, 0, 0.13]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.022, 0.022, 0.08, 12]} />
              <meshBasicMaterial color={palette.neonSecondary} />
            </mesh>
          </group>

          {/* Flowing Dual Ninja Scarf / Coat Tails */}
          <mesh
            ref={scarf1Ref}
            position={[-0.09, -0.22, -0.12]}
            rotation={[0.3, 0, -0.2]}
          >
            <planeGeometry args={[0.13, 0.65]} />
            <meshStandardMaterial
              color={palette.jacketLining}
              roughness={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh
            ref={scarf2Ref}
            position={[0.09, -0.22, -0.12]}
            rotation={[0.3, 0, 0.2]}
          >
            <planeGeometry args={[0.13, 0.65]} />
            <meshStandardMaterial
              color={palette.jacket}
              roughness={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* ========================================================
            3. ARMS, TITANIUM PAULDRONS & CYBER GLOVES
           ======================================================== */}
        {/* Left Arm */}
        <group position={[-0.32, 0.16, 0]} ref={leftArmRef}>
          {/* Pearl White Titanium Shoulder Pauldron */}
          <mesh position={[0, 0.02, 0]} rotation={[0, 0, 0.2]}>
            <sphereGeometry args={[0.13, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color={palette.armor} metalness={0.88} roughness={0.2} />
          </mesh>
          {/* Glowing Border Trim on Pauldron */}
          <mesh position={[0, -0.04, 0]}>
            <torusGeometry args={[0.125, 0.008, 8, 24]} />
            <meshBasicMaterial color={palette.neonPrimary} />
          </mesh>

          {/* Bicep Sleeve */}
          <mesh position={[0, -0.14, 0]}>
            <cylinderGeometry args={[0.075, 0.068, 0.2, 16]} />
            <meshStandardMaterial color={palette.jacket} roughness={0.6} />
          </mesh>

          {/* Forearm and Bracer */}
          <group position={[0, -0.24, 0]} ref={leftForearmRef}>
            <mesh position={[0, -0.12, 0]}>
              <cylinderGeometry args={[0.068, 0.058, 0.24, 16]} />
              <meshStandardMaterial color="#080c18" roughness={0.5} metalness={0.5} />
            </mesh>
            {/* Holographic Emitter Band on Forearm */}
            <mesh position={[0, -0.06, 0]}>
              <torusGeometry args={[0.07, 0.008, 8, 16]} />
              <meshBasicMaterial color={palette.neonSecondary} />
            </mesh>

            {/* Fingerless Cyber Ninja Glove */}
            <mesh position={[0, -0.27, 0]}>
              <boxGeometry args={[0.075, 0.09, 0.05]} />
              <meshStandardMaterial color="#050812" roughness={0.6} metalness={0.3} />
            </mesh>
            {/* Glowing Knuckle Nodes */}
            <mesh position={[0, -0.28, 0.028]}>
              <boxGeometry args={[0.06, 0.015, 0.01]} />
              <meshBasicMaterial color={palette.neonPrimary} />
            </mesh>
          </group>
        </group>

        {/* Right Arm */}
        <group position={[0.32, 0.16, 0]} ref={rightArmRef}>
          {/* Pearl White Titanium Shoulder Pauldron */}
          <mesh position={[0, 0.02, 0]} rotation={[0, 0, -0.2]}>
            <sphereGeometry args={[0.13, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color={palette.armor} metalness={0.88} roughness={0.2} />
          </mesh>
          {/* Glowing Border Trim */}
          <mesh position={[0, -0.04, 0]}>
            <torusGeometry args={[0.125, 0.008, 8, 24]} />
            <meshBasicMaterial color={palette.neonPrimary} />
          </mesh>

          {/* Bicep Sleeve */}
          <mesh position={[0, -0.14, 0]}>
            <cylinderGeometry args={[0.075, 0.068, 0.2, 16]} />
            <meshStandardMaterial color={palette.jacket} roughness={0.6} />
          </mesh>

          {/* Forearm and Bracer */}
          <group position={[0, -0.24, 0]} ref={rightForearmRef}>
            <mesh position={[0, -0.12, 0]}>
              <cylinderGeometry args={[0.068, 0.058, 0.24, 16]} />
              <meshStandardMaterial color="#080c18" roughness={0.5} metalness={0.5} />
            </mesh>
            {/* Holographic Emitter Band on Forearm */}
            <mesh position={[0, -0.06, 0]}>
              <torusGeometry args={[0.07, 0.008, 8, 16]} />
              <meshBasicMaterial color={palette.neonPrimary} />
            </mesh>

            {/* Fingerless Cyber Ninja Glove */}
            <mesh position={[0, -0.27, 0]}>
              <boxGeometry args={[0.075, 0.09, 0.05]} />
              <meshStandardMaterial color="#050812" roughness={0.6} metalness={0.3} />
            </mesh>
            {/* Glowing Knuckle Nodes */}
            <mesh position={[0, -0.28, 0.028]}>
              <boxGeometry args={[0.06, 0.015, 0.01]} />
              <meshBasicMaterial color={palette.neonPrimary} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ========================================================
          4. LEGS, TACTICAL SHIN GUARDS & CYBER BOOTS
         ======================================================== */}
      <group position={[0, 0.65, 0]}>
        {/* Left Leg */}
        <group position={[-0.13, 0, 0]} ref={leftLegRef}>
          {/* Thigh (Tactical Pants) */}
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.095, 0.08, 0.36, 16]} />
            <meshStandardMaterial color={palette.carbon} roughness={0.65} />
          </mesh>

          {/* Articulated Knee Armor */}
          <mesh position={[0, -0.38, 0.05]}>
            <boxGeometry args={[0.09, 0.09, 0.04]} />
            <meshStandardMaterial color={palette.armor} metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Shin & Guard */}
          <mesh position={[0, -0.56, 0]}>
            <cylinderGeometry args={[0.08, 0.068, 0.34, 16]} />
            <meshStandardMaterial color="#0b101e" roughness={0.5} />
          </mesh>
          {/* Shin Guard Plate */}
          <mesh position={[0, -0.56, 0.04]}>
            <boxGeometry args={[0.085, 0.26, 0.03]} />
            <meshStandardMaterial color={palette.armor} metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Cyan Shin Piping */}
          <mesh position={[0, -0.56, 0.058]}>
            <cylinderGeometry args={[0.006, 0.006, 0.22, 8]} />
            <meshBasicMaterial color={palette.neonPrimary} />
          </mesh>

          {/* Cyber Ninja Boot */}
          <group position={[0, -0.74, 0.04]}>
            <mesh>
              <boxGeometry args={[0.085, 0.09, 0.19]} />
              <meshStandardMaterial color="#050814" roughness={0.5} metalness={0.6} />
            </mesh>
            {/* Glowing Energy Sole */}
            <mesh position={[0, -0.048, 0]}>
              <boxGeometry args={[0.088, 0.015, 0.195]} />
              <meshBasicMaterial color={palette.neonPrimary} />
            </mesh>
          </group>
        </group>

        {/* Right Leg */}
        <group position={[0.13, 0, 0]} ref={rightLegRef}>
          {/* Thigh (Tactical Pants) */}
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.095, 0.08, 0.36, 16]} />
            <meshStandardMaterial color={palette.carbon} roughness={0.65} />
          </mesh>

          {/* Articulated Knee Armor */}
          <mesh position={[0, -0.38, 0.05]}>
            <boxGeometry args={[0.09, 0.09, 0.04]} />
            <meshStandardMaterial color={palette.armor} metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Shin & Guard */}
          <mesh position={[0, -0.56, 0]}>
            <cylinderGeometry args={[0.08, 0.068, 0.34, 16]} />
            <meshStandardMaterial color="#0b101e" roughness={0.5} />
          </mesh>
          {/* Shin Guard Plate */}
          <mesh position={[0, -0.56, 0.04]}>
            <boxGeometry args={[0.085, 0.26, 0.03]} />
            <meshStandardMaterial color={palette.armor} metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Cyan Shin Piping */}
          <mesh position={[0, -0.56, 0.058]}>
            <cylinderGeometry args={[0.006, 0.006, 0.22, 8]} />
            <meshBasicMaterial color={palette.neonPrimary} />
          </mesh>

          {/* Cyber Ninja Boot */}
          <group position={[0, -0.74, 0.04]}>
            <mesh>
              <boxGeometry args={[0.085, 0.09, 0.19]} />
              <meshStandardMaterial color="#050814" roughness={0.5} metalness={0.6} />
            </mesh>
            {/* Glowing Energy Sole */}
            <mesh position={[0, -0.048, 0]}>
              <boxGeometry args={[0.088, 0.015, 0.195]} />
              <meshBasicMaterial color={palette.neonPrimary} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}

// 6. Camera Controller Supporting Presets and Smooth Reset
function CameraRig({
  preset = 'full',
  resetTrigger = 0,
  zoomLevel = 0,
  autoRotate = false,
}: {
  preset: CameraPreset
  resetTrigger: number
  zoomLevel: number
  autoRotate: boolean
}) {
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsType>(null)

  // Target camera configuration based on preset
  const targetConfig = useMemo(() => {
    const zoomOffset = zoomLevel * -0.4
    if (preset === 'portrait') {
      return {
        pos: new THREE.Vector3(0, 1.36, Math.max(1.5, 1.8 + zoomOffset)),
        look: new THREE.Vector3(0, 1.34, 0),
      }
    }
    if (preset === 'action') {
      return {
        pos: new THREE.Vector3(0.8, 0.25, Math.max(2.0, 2.9 + zoomOffset)),
        look: new THREE.Vector3(0, 0.7, 0),
      }
    }
    // 'full' body preset
    return {
      pos: new THREE.Vector3(0, 0.85, Math.max(2.2, 3.3 + zoomOffset)),
      look: new THREE.Vector3(0, 0.45, 0),
    }
  }, [preset, zoomLevel])

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.copy(targetConfig.look)
      camera.position.copy(targetConfig.pos)
      controlsRef.current.update()
    }
  }, [preset, resetTrigger, targetConfig, camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={1.8}
      maxDistance={6.5}
      minPolarAngle={Math.PI * 0.15}
      maxPolarAngle={Math.PI * 0.55}
      enableDamping
      dampingFactor={0.06}
      autoRotate={autoRotate}
      autoRotateSpeed={1.8}
    />
  )
}

// 7. Master AnimeShonenHero3D Component
export const AnimeShonenHero3D: React.FC<AnimeShonenHeroProps> = ({
  pose = 'idle',
  powerMode = 'normal',
  theme = 'default',
  cameraPreset = 'full',
  autoRotate = false,
  resetTrigger = 0,
  zoomLevel = 0,
  modelUrl,
  showVisor = true,
}) => {
  const palette = THEME_PALETTES[theme]

  return (
    <>
      {/* Cinematic Cyberpunk Lighting Rig */}
      <ambientLight color="#0e172e" intensity={0.8} />
      <directionalLight position={[4, 8, 5]} color="#ffffff" intensity={1.8} castShadow />
      <pointLight position={[-4, 3, -3]} color={palette.neonSecondary} intensity={2.2} distance={15} />
      <pointLight position={[3, 1, 3]} color={palette.neonPrimary} intensity={2.4} distance={12} />
      {/* Subtle Rim Backlight */}
      <pointLight position={[0, 4, -4]} color={palette.neonPrimary} intensity={2.0} distance={10} />

      {/* Holographic Stage Platform */}
      <HolographicAnimePlatform theme={theme} />

      {/* 3D Anime Shonen Hero Model */}
      {modelUrl ? (
        <ExternalGLBModel url={modelUrl} pose={pose} />
      ) : (
        <AnimeHeroModel
          pose={pose}
          powerMode={powerMode}
          theme={theme}
          showVisor={showVisor}
        />
      )}

      {/* Smooth Camera Rig Controller */}
      <CameraRig
        preset={cameraPreset}
        resetTrigger={resetTrigger}
        zoomLevel={zoomLevel}
        autoRotate={autoRotate}
      />
    </>
  )
}

export default AnimeShonenHero3D
