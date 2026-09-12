import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const PlanetMoon: React.FC = () => {
  const planetRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.02
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.015
    }
  })

  return (
    <group position={[35, 45, -120]}>
      {/* Outer Atmosphere Glow Halo */}
      <mesh scale={[18.5, 18.5, 18.5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh scale={[17.2, 17.2, 17.2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main Giant Planet Body */}
      <group ref={planetRef}>
        <mesh scale={[16, 16, 16]}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial
            color="#1e1b4b"
            roughness={0.7}
            metalness={0.2}
            emissive="#312e81"
            emissiveIntensity={0.35}
          />
        </mesh>

        {/* Planet Surface Cloud / Texture Banding */}
        <mesh scale={[16.05, 16.05, 16.05]} rotation={[0.2, 0.4, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#00f0ff"
            wireframe
            transparent
            opacity={0.06}
          />
        </mesh>
      </group>

      {/* Planet Orbital Planetary Rings */}
      <mesh
        ref={ringRef}
        rotation={[Math.PI / 2.8, -Math.PI / 8, 0]}
        scale={[28, 28, 1]}
      >
        <ringGeometry args={[0.75, 1.0, 64]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh
        rotation={[Math.PI / 2.8, -Math.PI / 8, 0]}
        scale={[32, 32, 1]}
      >
        <ringGeometry args={[0.92, 0.98, 64]} />
        <meshBasicMaterial
          color="#ff007f"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Soft Light Casting from Moon */}
      <pointLight color="#a855f7" intensity={2.5} distance={150} decay={2} />
    </group>
  )
}

export default PlanetMoon
