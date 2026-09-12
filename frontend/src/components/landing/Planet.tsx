import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const Planet: React.FC = () => {
  const planetRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  // Infinite celestial rotation
  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.018
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.012
    }
  })

  return (
    <group position={[32, 46, -135]}>
      {/* 1. Outer Deep Cosmic Halo Glow */}
      <mesh scale={[19.5, 19.5, 19.5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 2. Inner Cyan Ionosphere Glow */}
      <mesh scale={[18.2, 18.2, 18.2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 3. Main Giant Celestial Planet Body */}
      <group ref={planetRef}>
        <mesh scale={[17, 17, 17]}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial
            color="#131038"
            roughness={0.65}
            metalness={0.25}
            emissive="#2e1065"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Planet Surface Cloud / Atmospheric Flow Bands */}
        <mesh scale={[17.06, 17.06, 17.06]} rotation={[0.25, 0.35, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#00f0ff"
            wireframe
            transparent
            opacity={0.07}
          />
        </mesh>
      </group>

      {/* 4. Giant Holographic Planetary Rings */}
      <mesh
        ref={ringRef}
        rotation={[Math.PI / 2.7, -Math.PI / 7, 0]}
        scale={[30, 30, 1]}
      >
        <ringGeometry args={[0.76, 1.05, 64]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.24}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer Magenta Secondary Ring */}
      <mesh
        rotation={[Math.PI / 2.7, -Math.PI / 7, 0]}
        scale={[34, 34, 1]}
      >
        <ringGeometry args={[0.94, 0.99, 64]} />
        <meshBasicMaterial
          color="#ff007f"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Soft Moonlight Casting from Celestial Planet */}
      <pointLight color="#a855f7" intensity={2.8} distance={180} decay={2} />
    </group>
  )
}

export default Planet
