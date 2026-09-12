import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BuildingData {
  id: string
  position: [number, number, number]
  dimensions: [number, number, number]
  color: string
  emissiveColor: string
  emissiveIntensity: number
  hasAntenna: boolean
  antennaHeight: number
  antennaColor: string
}

interface FlyingVehicleData {
  id: string
  laneY: number
  laneX: number
  speed: number
  direction: number
  color: string
}

// Generate deterministic buildings flanking the highway
function generateBuildings(): BuildingData[] {
  const buildings: BuildingData[] = []
  const buildingColors = ['#050814', '#060a18', '#070b1c', '#040712']
  const emissiveColors = ['#00f0ff', '#a855f7', '#ec4899', '#3b82f6', '#f59e0b']

  let idCounter = 0
  // Left side buildings
  for (let z = 10; z >= -160; z -= 14) {
    for (let x = -14; x >= -55; x -= 14) {
      const pseudoRand = Math.abs(Math.sin(x * 12.9898 + z * 78.233))
      const height = 18 + pseudoRand * 55
      const width = 8 + (pseudoRand * 10) % 6
      const depth = 8 + ((pseudoRand * 100) % 6)
      const emissiveColor = emissiveColors[Math.floor(pseudoRand * emissiveColors.length)]
      const hasAntenna = pseudoRand > 0.45

      buildings.push({
        id: `bld_l_${idCounter++}`,
        position: [x - pseudoRand * 4, height / 2 - 1, z + (pseudoRand - 0.5) * 6],
        dimensions: [width, height, depth],
        color: buildingColors[Math.floor(pseudoRand * buildingColors.length)],
        emissiveColor,
        emissiveIntensity: 0.15 + pseudoRand * 0.4,
        hasAntenna,
        antennaHeight: 4 + pseudoRand * 12,
        antennaColor: pseudoRand > 0.5 ? '#00f0ff' : '#ff007f',
      })
    }
  }

  // Right side buildings
  for (let z = 10; z >= -160; z -= 14) {
    for (let x = 14; x <= 55; x += 14) {
      const pseudoRand = Math.abs(Math.sin(x * 93.9898 + z * 34.233))
      const height = 16 + pseudoRand * 60
      const width = 8 + (pseudoRand * 10) % 6
      const depth = 8 + ((pseudoRand * 100) % 6)
      const emissiveColor = emissiveColors[Math.floor(pseudoRand * emissiveColors.length)]
      const hasAntenna = pseudoRand > 0.4

      buildings.push({
        id: `bld_r_${idCounter++}`,
        position: [x + pseudoRand * 4, height / 2 - 1, z + (pseudoRand - 0.5) * 6],
        dimensions: [width, height, depth],
        color: buildingColors[Math.floor(pseudoRand * buildingColors.length)],
        emissiveColor,
        emissiveIntensity: 0.15 + pseudoRand * 0.4,
        hasAntenna,
        antennaHeight: 4 + pseudoRand * 12,
        antennaColor: pseudoRand > 0.5 ? '#00f0ff' : '#ec4899',
      })
    }
  }

  return buildings
}

// Flying aerial traffic
const VEHICLES: FlyingVehicleData[] = [
  { id: 'fv1', laneY: 30, laneX: -22, speed: 28, direction: -1, color: '#00f0ff' },
  { id: 'fv2', laneY: 38, laneX: -36, speed: 34, direction: 1, color: '#ff007f' },
  { id: 'fv3', laneY: 26, laneX: 25, speed: 24, direction: -1, color: '#a855f7' },
  { id: 'fv4', laneY: 42, laneX: 38, speed: 40, direction: 1, color: '#38bdf8' },
  { id: 'fv5', laneY: 34, laneX: 0, speed: 30, direction: -1, color: '#00f0ff' },
]

const FlyingVehicles: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      const children = groupRef.current.children
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        const v = VEHICLES[i]
        child.position.z += v.speed * v.direction * delta
        if (child.position.z < -160) child.position.z = 20
        if (child.position.z > 20) child.position.z = -160
      }
    }
  })

  return (
    <group ref={groupRef}>
      {VEHICLES.map((v) => (
        <group key={v.id} position={[v.laneX, v.laneY, (Math.random() - 0.5) * 120]}>
          {/* Drone/Aerocar Body */}
          <mesh>
            <boxGeometry args={[1.2, 0.4, 3.2]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Headlights / Tail thrusters */}
          <mesh position={[0, 0, v.direction > 0 ? 1.6 : -1.6]}>
            <boxGeometry args={[0.9, 0.15, 0.1]} />
            <meshBasicMaterial color={v.color} />
          </mesh>
          {/* Small point light for flying car */}
          <pointLight color={v.color} intensity={0.8} distance={8} decay={2} />
        </group>
      ))}
    </group>
  )
}

export const CyberCity: React.FC = () => {
  const buildings = useMemo(() => generateBuildings(), [])

  return (
    <group>
      {/* 1. Procedural Skyscraper Skyline */}
      {buildings.map((b) => (
        <group key={b.id} position={b.position}>
          {/* Main Tower Box */}
          <mesh>
            <boxGeometry args={b.dimensions} />
            <meshStandardMaterial
              color={b.color}
              metalness={0.85}
              roughness={0.3}
              emissive={b.emissiveColor}
              emissiveIntensity={b.emissiveIntensity * 0.3}
            />
          </mesh>

          {/* Emissive Vertical Corner Neon Strip on Taller Towers */}
          {b.dimensions[1] > 35 && (
            <>
              <mesh position={[-b.dimensions[0] / 2 - 0.05, 0, b.dimensions[2] / 2 + 0.05]}>
                <boxGeometry args={[0.1, b.dimensions[1] * 0.8, 0.1]} />
                <meshBasicMaterial color={b.emissiveColor} />
              </mesh>
              <mesh position={[b.dimensions[0] / 2 + 0.05, 0, b.dimensions[2] / 2 + 0.05]}>
                <boxGeometry args={[0.1, b.dimensions[1] * 0.8, 0.1]} />
                <meshBasicMaterial color={b.emissiveColor} />
              </mesh>
            </>
          )}

          {/* Roof Spire Antenna */}
          {b.hasAntenna && (
            <group position={[0, b.dimensions[1] / 2, 0]}>
              <mesh position={[0, b.antennaHeight / 2, 0]}>
                <cylinderGeometry args={[0.08, 0.25, b.antennaHeight, 6]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Blinking Top Beacon */}
              <mesh position={[0, b.antennaHeight, 0]}>
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshBasicMaterial color={b.antennaColor} />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* 2. Elevated Skybridges Connecting Key Towers */}
      {[-30, -75, -125].map((z, idx) => (
        <group key={idx} position={[0, 22 + idx * 4, z]}>
          {/* Left Bridge Section */}
          <mesh position={[-20, 0, 0]}>
            <boxGeometry args={[14, 1.2, 2.5]} />
            <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-20, 0.7, 0]}>
            <boxGeometry args={[13.8, 0.1, 2.4]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>

          {/* Right Bridge Section */}
          <mesh position={[20, 0, 0]}>
            <boxGeometry args={[14, 1.2, 2.5]} />
            <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[20, 0.7, 0]}>
            <boxGeometry args={[13.8, 0.1, 2.4]} />
            <meshBasicMaterial color="#ff007f" />
          </mesh>
        </group>
      ))}

      {/* 3. Distant Flying Air Traffic */}
      <FlyingVehicles />
    </group>
  )
}

export default CyberCity
