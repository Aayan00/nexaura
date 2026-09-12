import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DigitalRain } from './DigitalRain'

interface CyberCityBackgroundProps {
  environment?: 'city' | 'space' | 'matrix' | 'neon' | 'amber' | 'void'
  className?: string
}

function SpaceEnvironment() {
  const planetRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.1
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15
    }
  })

  return (
    <group position={[3.5, 1.2, -4]}>
      {/* Holographic Planet */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[1.6, 24, 24]} />
        <meshStandardMaterial
          color="#0f1738"
          emissive="#00f0ff"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Planet Orbit Ring */}
      <mesh ref={ringRef} rotation={[1.2, 0.4, 0]}>
        <torusGeometry args={[2.4, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#ff007f"
          emissive="#ff007f"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

function CitySkyline() {
  const gridRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.getElapsedTime() * 0.8) % 4
    }
  })

  return (
    <group ref={gridRef} position={[0, -2.5, -6]} rotation={[-Math.PI / 2.5, 0, 0]}>
      <gridHelper args={[30, 30, '#00f0ff', '#a855f7']} />
    </group>
  )
}

export const CyberCityBackground: React.FC<CyberCityBackgroundProps> = ({
  environment = 'city',
  className = 'fixed inset-0 pointer-events-none z-0',
}) => {
  if (environment === 'matrix') {
    return <DigitalRain color="#10b981" opacity={0.3} className={className} />
  }

  if (environment === 'amber') {
    return <DigitalRain color="#facc15" opacity={0.25} className={className} />
  }

  if (environment === 'void') {
    return null
  }

  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        {environment === 'space' ? <SpaceEnvironment /> : <CitySkyline />}
      </Canvas>
    </div>
  )
}
