import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NeonParticlesProps {
  speedMultiplier?: number
  nitro?: boolean
}

export const NeonParticles: React.FC<NeonParticlesProps> = ({
  speedMultiplier = 1,
  nitro = false,
}) => {
  const streakCount = 180
  const dustCount = 220

  // Deterministic seed helper
  const pseudoRand = (seed: number) => {
    const x = Math.sin(seed * 12.9898) * 43758.5453
    return x - Math.floor(x)
  }

  // 1. High Speed Road Motion Streaks
  const streakPointsRef = useRef<THREE.Points>(null)
  const [streakPositions, streakSpeeds] = useMemo(() => {
    const pos = new Float32Array(streakCount * 3)
    const spd = new Float32Array(streakCount)
    for (let i = 0; i < streakCount; i++) {
      pos[i * 3 + 0] = (pseudoRand(i * 3 + 1) - 0.5) * 38
      pos[i * 3 + 1] = pseudoRand(i * 3 + 2) * 12 + 0.3
      pos[i * 3 + 2] = (pseudoRand(i * 3 + 3) - 0.5) * 140
      spd[i] = pseudoRand(i + 10) * 30 + 40
    }
    return [pos, spd]
  }, [streakCount])

  // 2. Ambient Floating Cyber Dust
  const dustPointsRef = useRef<THREE.Points>(null)
  const dustPositions = useMemo(() => {
    const pos = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3 + 0] = (pseudoRand(i * 4 + 7) - 0.5) * 85
      pos[i * 3 + 1] = pseudoRand(i * 4 + 8) * 35 + 1
      pos[i * 3 + 2] = (pseudoRand(i * 4 + 9) - 0.5) * 160
    }
    return pos
  }, [dustCount])

  useFrame((_, delta) => {
    const boost = nitro ? 1.8 : 1.0

    // Animate high-speed road streaks
    if (streakPointsRef.current) {
      const positions = streakPointsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < streakCount; i++) {
        positions[i * 3 + 2] += streakSpeeds[i] * delta * speedMultiplier * boost
        // Recycle streak when passing behind camera
        if (positions[i * 3 + 2] > 30) {
          positions[i * 3 + 2] = -100
          positions[i * 3 + 0] = (Math.random() - 0.5) * 38
          positions[i * 3 + 1] = Math.random() * 12 + 0.3
        }
      }
      streakPointsRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Animate ambient dust slowly
    if (dustPointsRef.current) {
      dustPointsRef.current.rotation.y += delta * 0.015
    }
  })

  return (
    <group>
      {/* High-speed road light streaks */}
      <points ref={streakPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[streakPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={nitro ? 0.28 : 0.18}
          color={nitro ? '#ff007f' : '#00f0ff'}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Atmospheric neon ambient dust */}
      <points ref={dustPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#d946ef"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export default NeonParticles
