import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface AvatarMeshProps {
  state?: 'idle' | 'focus' | 'complete' | 'levelup' | 'victory'
  animState?: 'idle' | 'focus' | 'complete' | 'levelup' | 'victory'
  theme?: string
  skinColor?: string
}

export function CyberArmoredModel({ state, animState, theme = 'neon-cyan' }: AvatarMeshProps) {
  const activeState = animState || state || 'idle'
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const visorRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const auraRingRef = useRef<THREE.Mesh>(null)

  const themeColors = useMemo(() => {
    switch (theme) {
      case 'magenta':
      case 'th-2':
        return { primary: '#ff007f', secondary: '#a855f7', core: '#ff00aa', metal: '#180f24' }
      case 'amber':
      case 'th-3':
        return { primary: '#facc15', secondary: '#ea580c', core: '#fbbf24', metal: '#20160a' }
      case 'matrix':
      case 'th-4':
        return { primary: '#10b981', secondary: '#059669', core: '#34d399', metal: '#0a1e16' }
      case 'neon-cyan':
      default:
        return { primary: '#00f0ff', secondary: '#a855f7', core: '#00f0ff', metal: '#0d1527' }
    }
  }, [theme])

  useFrame((stateContext, delta) => {
    const t = stateContext.clock.getElapsedTime()
    const { pointer } = stateContext

    if (groupRef.current) {
      // Floating & breathing motion
      const floatAmp = activeState === 'levelup' ? 0.35 : activeState === 'focus' ? 0.08 : 0.14
      const floatFreq = activeState === 'focus' ? 1.0 : 1.8
      groupRef.current.position.y = Math.sin(t * floatFreq) * floatAmp

      // Subtle rotation
      const rotBase = activeState === 'levelup' ? t * 1.5 : activeState === 'focus' ? 0 : Math.sin(t * 0.5) * 0.12
      groupRef.current.rotation.y = rotBase + pointer.x * 0.3
    }

    // Mouse tracking for head
    if (headRef.current) {
      headRef.current.rotation.y = pointer.x * 0.4
      headRef.current.rotation.x = -pointer.y * 0.25
    }

    // Visor scanline pulse
    if (visorRef.current) {
      const mat = visorRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 1.8 + Math.sin(t * 6) * 0.6
    }

    // Core pulsing reactor
    if (coreRef.current) {
      const scaleBase = activeState === 'levelup' ? 1.4 + Math.sin(t * 12) * 0.3 : 1 + Math.sin(t * 3) * 0.15
      coreRef.current.scale.set(scaleBase, scaleBase, scaleBase)
      const mat = coreRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 2.8 + Math.sin(t * 4) * 0.8
    }

    // Arm animations based on state
    if (leftArmRef.current && rightArmRef.current) {
      if (activeState === 'victory' || activeState === 'levelup') {
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.8, delta * 5)
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.8, delta * 5)
      } else if (activeState === 'focus') {
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.3, delta * 3)
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.3, delta * 3)
      } else {
        leftArmRef.current.rotation.z = 0.15 + Math.sin(t * 1.5) * 0.05
        rightArmRef.current.rotation.z = -0.15 - Math.sin(t * 1.5) * 0.05
      }
    }

    // Rotating outer aura ring
    if (auraRingRef.current) {
      auraRingRef.current.rotation.z = t * 0.8
      auraRingRef.current.rotation.x = 1.2 + Math.sin(t * 0.5) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head Group */}
      <group ref={headRef} position={[0, 1.45, 0]}>
        {/* Cyber Helmet */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.55, 0.58, 0.55]} />
          <meshStandardMaterial
            color={themeColors.metal}
            roughness={0.25}
            metalness={0.85}
          />
        </mesh>

        {/* Tactical Glowing Visor */}
        <mesh ref={visorRef} position={[0, 0.04, 0.29]}>
          <boxGeometry args={[0.48, 0.16, 0.05]} />
          <meshStandardMaterial
            color={themeColors.primary}
            emissive={themeColors.primary}
            emissiveIntensity={2.2}
            roughness={0.1}
          />
        </mesh>

        {/* Neural Antenna Fins */}
        <mesh position={[-0.32, 0.15, 0]}>
          <boxGeometry args={[0.06, 0.35, 0.15]} />
          <meshStandardMaterial color={themeColors.primary} emissive={themeColors.primary} emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0.32, 0.15, 0]}>
          <boxGeometry args={[0.06, 0.35, 0.15]} />
          <meshStandardMaterial color={themeColors.primary} emissive={themeColors.primary} emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* Torso / Exosuit Armor */}
      <group position={[0, 0.65, 0]}>
        {/* Chest Armor Plate */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.85, 0.9, 0.5]} />
          <meshStandardMaterial
            color={themeColors.metal}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* Arc Reactor Chest Core */}
        <mesh ref={coreRef} position={[0, 0.22, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
          <meshStandardMaterial
            color={themeColors.core}
            emissive={themeColors.core}
            emissiveIntensity={3.0}
          />
        </mesh>

        {/* Glowing Energy Conduits / Stripes */}
        <mesh position={[0, -0.15, 0.26]}>
          <boxGeometry args={[0.5, 0.04, 0.02]} />
          <meshStandardMaterial color={themeColors.secondary} emissive={themeColors.secondary} emissiveIntensity={1.6} />
        </mesh>
        <mesh position={[0, -0.26, 0.26]}>
          <boxGeometry args={[0.35, 0.03, 0.02]} />
          <meshStandardMaterial color={themeColors.secondary} emissive={themeColors.secondary} emissiveIntensity={1.6} />
        </mesh>

        {/* Shoulder Plasma Guards */}
        <mesh position={[-0.55, 0.45, 0]}>
          <boxGeometry args={[0.3, 0.25, 0.38]} />
          <meshStandardMaterial color={themeColors.primary} emissive={themeColors.primary} emissiveIntensity={0.9} />
        </mesh>
        <mesh position={[0.55, 0.45, 0]}>
          <boxGeometry args={[0.3, 0.25, 0.38]} />
          <meshStandardMaterial color={themeColors.primary} emissive={themeColors.primary} emissiveIntensity={0.9} />
        </mesh>
      </group>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.58, 0.95, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.09, 0.08, 0.75, 12]} />
          <meshStandardMaterial color={themeColors.metal} roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Gauntlet Light */}
        <mesh position={[0, -0.65, 0.08]}>
          <boxGeometry args={[0.12, 0.2, 0.04]} />
          <meshStandardMaterial color={themeColors.primary} emissive={themeColors.primary} emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.58, 0.95, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.09, 0.08, 0.75, 12]} />
          <meshStandardMaterial color={themeColors.metal} roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Gauntlet Light */}
        <mesh position={[0, -0.65, 0.08]}>
          <boxGeometry args={[0.12, 0.2, 0.04]} />
          <meshStandardMaterial color={themeColors.primary} emissive={themeColors.primary} emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* Cybernetic Waist & Thruster Legs */}
      <group position={[0, -0.2, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.65, 0.25, 0.4]} />
          <meshStandardMaterial color={themeColors.metal} roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Left Leg Thruster */}
        <mesh position={[-0.22, -0.55, 0]}>
          <cylinderGeometry args={[0.11, 0.08, 0.9, 12]} />
          <meshStandardMaterial color={themeColors.metal} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[-0.22, -1.02, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.08, 0.15, 12]} />
          <meshStandardMaterial color={themeColors.primary} emissive={themeColors.primary} emissiveIntensity={2.5} />
        </mesh>

        {/* Right Leg Thruster */}
        <mesh position={[0.22, -0.55, 0]}>
          <cylinderGeometry args={[0.11, 0.08, 0.9, 12]} />
          <meshStandardMaterial color={themeColors.metal} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0.22, -1.02, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.08, 0.15, 12]} />
          <meshStandardMaterial color={themeColors.primary} emissive={themeColors.primary} emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* Floating Hologram Energy Ring */}
      <mesh ref={auraRingRef} position={[0, 0.6, 0]}>
        <torusGeometry args={[1.25, 0.02, 16, 64]} />
        <meshStandardMaterial
          color={themeColors.primary}
          emissive={themeColors.primary}
          emissiveIntensity={2.0}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

export const CyberpunkAvatar3D: React.FC<{
  state?: 'idle' | 'focus' | 'complete' | 'levelup' | 'victory'
  animState?: 'idle' | 'focus' | 'complete' | 'levelup' | 'victory'
  theme?: string
  enableBloom?: boolean
  className?: string
}> = ({ state = 'idle', animState, theme = 'neon-cyan', className = 'h-64 sm:h-80 w-full' }) => {
  return (
    <div className={`relative ${className} filter drop-shadow-[0_0_20px_rgba(0,240,255,0.35)]`}>
      <Canvas
        camera={{ position: [0, 0.5, 3.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#00f0ff" />
        <pointLight position={[-5, -2, -3]} intensity={2.2} color="#ff007f" />
        <pointLight position={[0, 2, 2]} intensity={1.2} color="#a855f7" />

        <CyberArmoredModel state={state} animState={animState} theme={theme} />
      </Canvas>
    </div>
  )
}
