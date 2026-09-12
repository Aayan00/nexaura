import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface FuturisticCarProps {
  speed?: number
  steeringOffset?: number
}

// Procedural High-Detail Futuristic Cyberpunk Supercar
export const ProceduralCyberCar: React.FC<{ speed: number; steeringOffset: number }> = ({
  speed,
  steeringOffset,
}) => {
  const carGroup = useRef<THREE.Group>(null)
  const chassisRef = useRef<THREE.Group>(null)
  const frontLeftWheel = useRef<THREE.Group>(null)
  const frontRightWheel = useRef<THREE.Group>(null)
  const rearLeftWheel = useRef<THREE.Group>(null)
  const rearRightWheel = useRef<THREE.Group>(null)
  const exhaustGlowRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime()

    // 1. Wheel Rotation (Synced with highway speed)
    const rotationStep = speed * delta * 2.8
    if (frontLeftWheel.current) frontLeftWheel.current.rotation.x += rotationStep
    if (frontRightWheel.current) frontRightWheel.current.rotation.x += rotationStep
    if (rearLeftWheel.current) rearLeftWheel.current.rotation.x += rotationStep
    if (rearRightWheel.current) rearRightWheel.current.rotation.x += rotationStep

    // 2. Subtle High-Speed Suspension Oscillation & Lateral Steer Tilt
    if (chassisRef.current) {
      // Gentle micro-bounce from asphalt texture
      const suspensionBob = Math.sin(time * 28) * 0.015 + Math.sin(time * 14) * 0.008
      chassisRef.current.position.y = suspensionBob

      // Slight roll/tilt when drifting or steering
      const targetRoll = -steeringOffset * 0.12 + Math.sin(time * 4) * 0.015
      chassisRef.current.rotation.z = THREE.MathUtils.lerp(chassisRef.current.rotation.z, targetRoll, 0.1)

      // Slight pitch on acceleration
      const targetPitch = Math.sin(time * 6) * 0.008 - 0.01
      chassisRef.current.rotation.x = THREE.MathUtils.lerp(chassisRef.current.rotation.x, targetPitch, 0.1)
    }

    // 3. Lateral Swaying on Highway Lane
    if (carGroup.current) {
      const targetX = steeringOffset * 1.8 + Math.sin(time * 0.8) * 0.4
      carGroup.current.position.x = THREE.MathUtils.lerp(carGroup.current.position.x, targetX, 0.05)
    }

    // 4. Exhaust Plasma Pulsing
    if (exhaustGlowRef.current) {
      exhaustGlowRef.current.intensity = 2.0 + Math.sin(time * 30) * 0.6
    }
  })

  // Reusable Wheel Component
  const Wheel = ({ isLeft }: { isLeft: boolean }) => (
    <group>
      {/* Tire Rubber Tread */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 0.32, 24]} />
        <meshStandardMaterial color="#02040a" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Metallic Wheel Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.26, 0.34, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.95} />
      </mesh>
      {/* Glowing Neon Cyan Outer Rim Ring */}
      <mesh
        position={[isLeft ? -0.175 : 0.175, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <ringGeometry args={[0.28, 0.36, 24]} />
        <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} />
      </mesh>
      {/* Hubless Center Core (Dark Void with Magenta Dot) */}
      <mesh position={[isLeft ? -0.18 : 0.18, 0, 0]}>
        <circleGeometry args={[0.12, 16]} />
        <meshBasicMaterial color="#ff007f" />
      </mesh>
    </group>
  )

  return (
    <group ref={carGroup} position={[0, 0, 0]}>
      {/* Main Chassis Assembly */}
      <group ref={chassisRef} position={[0, 0.38, 0]}>
        {/* 1. Main Lower Monocoque Wedge Hull */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[2.0, 0.35, 4.4]} />
          <meshStandardMaterial
            color="#060913"
            metalness={0.92}
            roughness={0.16}
          />
        </mesh>

        {/* 2. Slanted Front Hood / Aerodynamic Nose Cone */}
        <mesh position={[0, 0.14, -1.3]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[1.85, 0.22, 1.8]} />
          <meshStandardMaterial
            color="#080e1e"
            metalness={0.9}
            roughness={0.18}
          />
        </mesh>

        {/* Front Splitter Carbon Lip */}
        <mesh position={[0, -0.08, -2.25]}>
          <boxGeometry args={[2.1, 0.06, 0.4]} />
          <meshStandardMaterial color="#020408" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* 3. Aerodynamic Cockpit Greenhouse Roof & Windshield */}
        <mesh position={[0, 0.42, 0.1]} rotation={[-0.14, 0, 0]}>
          <boxGeometry args={[1.4, 0.42, 2.0]} />
          <meshPhysicalMaterial
            color="#020817"
            metalness={0.3}
            roughness={0.08}
            transmission={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Cockpit Interior Glowing Cyber HUD */}
        <mesh position={[0, 0.3, -0.4]}>
          <planeGeometry args={[0.8, 0.25]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.65} />
        </mesh>

        {/* 4. Rear Engine Deck & Aerodynamic Haunches */}
        <mesh position={[0, 0.25, 1.3]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[1.9, 0.35, 1.7]} />
          <meshStandardMaterial
            color="#070c1a"
            metalness={0.9}
            roughness={0.18}
          />
        </mesh>

        {/* 5. Rear Aggressive Diffuser Fins */}
        <mesh position={[0, -0.06, 2.15]}>
          <boxGeometry args={[1.95, 0.15, 0.3]} />
          <meshStandardMaterial color="#02040a" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* Rear Aerodynamic Wing / Spoiler */}
        <group position={[0, 0.65, 1.95]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.2, 0.08, 0.5]} />
            <meshStandardMaterial color="#030712" metalness={0.95} roughness={0.2} />
          </mesh>
          {/* Wing Left Strut */}
          <mesh position={[-0.8, -0.22, 0]}>
            <boxGeometry args={[0.08, 0.38, 0.3]} />
            <meshStandardMaterial color="#030712" metalness={0.95} roughness={0.2} />
          </mesh>
          {/* Wing Right Strut */}
          <mesh position={[0.8, -0.22, 0]}>
            <boxGeometry args={[0.08, 0.38, 0.3]} />
            <meshStandardMaterial color="#030712" metalness={0.95} roughness={0.2} />
          </mesh>
          {/* Cyan Neon Accent on Top Wing Edge */}
          <mesh position={[0, 0.045, 0.2]}>
            <boxGeometry args={[2.18, 0.02, 0.05]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        </group>

        {/* 6. Front Razor Headlights (Intense Cyan LED) */}
        <mesh position={[-0.72, 0.08, -2.18]} rotation={[0, -0.15, 0]}>
          <boxGeometry args={[0.45, 0.08, 0.08]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[0.72, 0.08, -2.18]} rotation={[0, 0.15, 0]}>
          <boxGeometry args={[0.45, 0.08, 0.08]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        {/* Forward Headlight Beams */}
        <spotLight
          position={[0, 0.2, -2.3]}
          target-position={[0, -0.5, -35]}
          color="#00f0ff"
          intensity={6}
          distance={45}
          angle={0.45}
          penumbra={0.8}
        />

        {/* 7. Full-Width Rear LED Tail Lightbar (Magenta / Red) */}
        <mesh position={[0, 0.25, 2.19]}>
          <boxGeometry args={[1.85, 0.08, 0.05]} />
          <meshBasicMaterial color="#ff0055" />
        </mesh>

        {/* Rear Branding: "NEXAURA" Embossed Illuminated Badge */}
        <Text
          position={[0, 0.12, 2.21]}
          fontSize={0.16}
          color="#00f0ff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.18}
        >
          NEXAURA
        </Text>

        {/* 8. Twin Plasma Jet Exhaust Nozzles */}
        <group position={[-0.45, 0.04, 2.18]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.14, 0.22, 16]} />
            <meshStandardMaterial color="#02040a" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.12]}>
            <circleGeometry args={[0.1, 16]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        </group>

        <group position={[0.45, 0.04, 2.18]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.14, 0.22, 16]} />
            <meshStandardMaterial color="#02040a" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.12]}>
            <circleGeometry args={[0.1, 16]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        </group>

        {/* Exhaust Point Light Casting on Road */}
        <pointLight
          ref={exhaustGlowRef}
          position={[0, 0.04, 2.8]}
          color="#00f0ff"
          intensity={2.5}
          distance={10}
          decay={2}
        />

        {/* 9. Lateral Side Neon Strakes */}
        <mesh position={[-1.02, 0.08, 0]}>
          <boxGeometry args={[0.04, 0.06, 3.2]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[1.02, 0.08, 0]}>
          <boxGeometry args={[0.04, 0.06, 3.2]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>

        {/* 10. Neon Ground Underglow Light */}
        <pointLight position={[0, -0.22, 0]} color="#00f0ff" intensity={3.5} distance={5} decay={2} />
        <pointLight position={[0, -0.22, 1.2]} color="#ff007f" intensity={3.0} distance={5} decay={2} />
      </group>

      {/* 4 Spinning Cyber Wheels */}
      {/* Front Left */}
      <group ref={frontLeftWheel} position={[-1.02, 0.42, -1.35]}>
        <Wheel isLeft={true} />
      </group>
      {/* Front Right */}
      <group ref={frontRightWheel} position={[1.02, 0.42, -1.35]}>
        <Wheel isLeft={false} />
      </group>
      {/* Rear Left */}
      <group ref={rearLeftWheel} position={[-1.04, 0.42, 1.35]}>
        <Wheel isLeft={true} />
      </group>
      {/* Rear Right */}
      <group ref={rearRightWheel} position={[1.04, 0.42, 1.35]}>
        <Wheel isLeft={false} />
      </group>
    </group>
  )
}

export const FuturisticCar: React.FC<FuturisticCarProps> = ({
  speed = 35,
  steeringOffset = 0,
}) => {
  return <ProceduralCyberCar speed={speed} steeringOffset={steeringOffset} />
}

export default FuturisticCar
