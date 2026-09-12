import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface PlatformMeshProps {
  theme?: string
  color?: string
  radius?: number
  ringCount?: number
}

export function PlatformModel({
  theme = 'neon-cyan',
  color,
  radius = 1.3,
}: PlatformMeshProps) {
  const outerRingRef = useRef<THREE.Mesh>(null)
  const innerRingRef = useRef<THREE.Mesh>(null)
  const discRef = useRef<THREE.Mesh>(null)

  const primaryColor = color || (
    theme === 'magenta' || theme === 'th-2'
      ? '#ff007f'
      : theme === 'amber' || theme === 'th-3'
      ? '#facc15'
      : theme === 'matrix' || theme === 'th-4'
      ? '#10b981'
      : '#00f0ff'
  )

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.4
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.6
    }
    if (discRef.current) {
      const mat = discRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.35 + Math.sin(t * 3) * 0.15
    }
  })

  return (
    <group position={[0, -1.2, 0]} rotation={[-Math.PI / 2.3, 0, 0]}>
      {/* Outer Rotating Cyber Ring */}
      <mesh ref={outerRingRef} position={[0, 0, 0]}>
        <ringGeometry args={[radius * 1.3, radius * 1.38, 32]} />
        <meshStandardMaterial
          color={primaryColor}
          emissive={primaryColor}
          emissiveIntensity={2}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Middle Runes Ring */}
      <mesh ref={innerRingRef} position={[0, 0, 0.02]}>
        <ringGeometry args={[radius * 0.95, radius * 1.05, 24]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={1.8}
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Center Holographic Disc */}
      <mesh ref={discRef} position={[0, 0, -0.02]}>
        <circleGeometry args={[radius * 0.9, 32]} />
        <meshStandardMaterial
          color="#0a152e"
          emissive={primaryColor}
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}

export const HolographicPlatform: React.FC<PlatformMeshProps & { className?: string }> = ({
  theme = 'neon-cyan',
  color,
  radius = 1.3,
  ringCount = 4,
  className = 'h-40 w-full',
}) => {
  return (
    <div className={`relative ${className}`}>
      <Canvas camera={{ position: [0, 1.5, 3], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1} />
        <PlatformModel theme={theme} color={color} radius={radius} ringCount={ringCount} />
      </Canvas>
    </div>
  )
}
