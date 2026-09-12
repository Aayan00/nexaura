import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface ParticleProps {
  count?: number
  color?: string
  spread?: number
  speed?: number
}

export function PointsCloud({ count = 120, color = '#00f0ff', spread = 8, speed = 0.5 }: ParticleProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const scl = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread * 2
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread
      scl[i] = Math.random() * 0.8 + 0.2
    }
    return [pos, scl]
  }, [count, spread])

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05 * speed
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export const ParticleField: React.FC<ParticleProps & { className?: string }> = ({
  count = 120,
  color = '#00f0ff',
  spread = 8,
  speed = 0.5,
  className = 'absolute inset-0 pointer-events-none',
}) => {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true }}>
        <PointsCloud count={count} color={color} spread={spread} speed={speed} />
      </Canvas>
    </div>
  )
}
