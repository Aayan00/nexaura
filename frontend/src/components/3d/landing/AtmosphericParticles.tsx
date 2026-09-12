import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AtmosphericParticlesProps {
  speedMultiplier?: number
}

export const AtmosphericParticles: React.FC<AtmosphericParticlesProps> = ({ speedMultiplier = 1 }) => {
  const count = 160
  const dustCount = 200

  // 1. High Speed Motion Streaks (Stream past camera along Z)
  const streakPoints = useRef<THREE.Points>(null)
  const [streakPositions, streakSpeeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 36
      pos[i * 3 + 1] = Math.random() * 12 + 0.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120
      spd[i] = Math.random() * 25 + 35
    }
    return [pos, spd]
  }, [count])

  // 2. Ambient Cyber Dust Particles
  const dustPoints = useRef<THREE.Points>(null)
  const dustPositions = useMemo(() => {
    const pos = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 80
      pos[i * 3 + 1] = Math.random() * 30 + 1
      pos[i * 3 + 2] = (Math.random() - 0.5) * 140
    }
    return pos
  }, [dustCount])

  useFrame((_, delta) => {
    // Animate high-speed streaks
    if (streakPoints.current) {
      const positions = streakPoints.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 2] += streakSpeeds[i] * delta * speedMultiplier
        if (positions[i * 3 + 2] > 30) {
          positions[i * 3 + 2] = -90
          positions[i * 3 + 0] = (Math.random() - 0.5) * 36
          positions[i * 3 + 1] = Math.random() * 10 + 0.5
        }
      }
      streakPoints.current.geometry.attributes.position.needsUpdate = true
    }

    // Animate ambient dust slowly
    if (dustPoints.current) {
      dustPoints.current.rotation.y += delta * 0.015
    }
  })

  return (
    <group>
      {/* High-speed road light streaks */}
      <points ref={streakPoints}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[streakPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          color="#00f0ff"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Atmospheric neon ambient dust */}
      <points ref={dustPoints}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#d946ef"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export default AtmosphericParticles
