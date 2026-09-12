import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FlyingVehicleItem {
  id: string
  laneY: number
  laneX: number
  speed: number
  direction: number
  color: string
}

interface GroundTrafficItem {
  id: string
  laneX: number
  initialZ: number
  speedOffset: number
}

const FLYING_CARS: FlyingVehicleItem[] = [
  { id: 'f1', laneY: 28, laneX: -24, speed: 26, direction: -1, color: '#00f0ff' },
  { id: 'f2', laneY: 36, laneX: -38, speed: 32, direction: 1, color: '#ff007f' },
  { id: 'f3', laneY: 24, laneX: 26, speed: 22, direction: -1, color: '#a855f7' },
  { id: 'f4', laneY: 42, laneX: 36, speed: 36, direction: 1, color: '#38bdf8' },
  { id: 'f5', laneY: 32, laneX: -10, speed: 28, direction: -1, color: '#facc15' },
  { id: 'f6', laneY: 46, laneX: 18, speed: 38, direction: 1, color: '#00f0ff' },
]

const GROUND_TRAFFIC: GroundTrafficItem[] = [
  { id: 'gt1', laneX: -3.2, initialZ: -55, speedOffset: 12 },
  { id: 'gt2', laneX: 3.2, initialZ: -90, speedOffset: 16 },
  { id: 'gt3', laneX: -3.0, initialZ: -130, speedOffset: 10 },
  { id: 'gt4', laneX: 3.4, initialZ: -165, speedOffset: 14 },
]

export const FlyingVehicles: React.FC<{ highwaySpeed?: number }> = ({
  highwaySpeed = 35,
}) => {
  const flyingGroupRef = useRef<THREE.Group>(null)
  const trafficGroupRef = useRef<THREE.Group>(null)

  // Infinite Flying & Highway Traffic Animation Loop
  useFrame((_, delta) => {
    // 1. Animate Flying Spinners
    if (flyingGroupRef.current) {
      const children = flyingGroupRef.current.children
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        const v = FLYING_CARS[i]
        child.position.z += v.speed * v.direction * delta

        // Seamless wrap-around
        if (child.position.z < -170) child.position.z = 25
        if (child.position.z > 25) child.position.z = -170
      }
    }

    // 2. Animate Distant Ground Highway Traffic
    if (trafficGroupRef.current) {
      const children = trafficGroupRef.current.children
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        const t = GROUND_TRAFFIC[i]
        // Relative speed compared to player car
        const relativeSpeed = (highwaySpeed - t.speedOffset) * delta
        child.position.z += relativeSpeed

        // Wrap ahead when passed
        if (child.position.z > 20) {
          child.position.z = -180
        }
      }
    }
  })

  return (
    <group>
      {/* 1. Skyline Flying Aerocars */}
      <group ref={flyingGroupRef}>
        {FLYING_CARS.map((v, i) => (
          <group
            key={v.id}
            position={[v.laneX, v.laneY, -130 + i * 28]}
          >
            {/* Aerocar Body Chassis */}
            <mesh>
              <boxGeometry args={[1.4, 0.45, 3.4]} />
              <meshStandardMaterial color="#0b1124" metalness={0.92} roughness={0.2} />
            </mesh>

            {/* Glowing Engine Thruster / Headlight */}
            <mesh position={[0, 0, v.direction > 0 ? 1.72 : -1.72]}>
              <boxGeometry args={[1.1, 0.16, 0.08]} />
              <meshBasicMaterial color={v.color} />
            </mesh>

            {/* Point Light Casting Glow */}
            <pointLight color={v.color} intensity={1.2} distance={10} decay={2} />
          </group>
        ))}
      </group>

      {/* 2. Distant Highway Traffic */}
      <group ref={trafficGroupRef} position={[0, -0.6, 0]}>
        {GROUND_TRAFFIC.map((t) => (
          <group key={t.id} position={[t.laneX, 0.38, t.initialZ]}>
            {/* Low-poly Sleek Car Body */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[1.8, 0.45, 3.8]} />
              <meshStandardMaterial color="#080c1a" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.42, -0.2]}>
              <boxGeometry args={[1.3, 0.35, 1.8]} />
              <meshStandardMaterial color="#02040a" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Dual Red Tail Lights */}
            <mesh position={[-0.65, 0.22, 1.92]}>
              <boxGeometry args={[0.35, 0.08, 0.06]} />
              <meshBasicMaterial color="#ff0055" />
            </mesh>
            <mesh position={[0.65, 0.22, 1.92]}>
              <boxGeometry args={[0.35, 0.08, 0.06]} />
              <meshBasicMaterial color="#ff0055" />
            </mesh>
            {/* Center lightbar strip */}
            <mesh position={[0, 0.22, 1.92]}>
              <boxGeometry args={[0.7, 0.03, 0.05]} />
              <meshBasicMaterial color="#ff0055" />
            </mesh>

            {/* Distant Tail Light Glow */}
            <pointLight position={[0, 0.2, 2.2]} color="#ff0055" intensity={0.9} distance={8} decay={2} />
          </group>
        ))}
      </group>
    </group>
  )
}

export default FlyingVehicles
