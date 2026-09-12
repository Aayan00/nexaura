import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface FuturisticCarProps {
  speed?: number
  steeringOffset?: number
  nitro?: boolean
}

interface CyberWheelProps {
  isLeft: boolean
  tireMat: THREE.Material
  rimMat: THREE.Material
  cyanMat: THREE.Material
  violetMat: THREE.Material
}

// Separate high-detail wheel component outside render loop
const CyberWheel: React.FC<CyberWheelProps> = ({
  isLeft,
  tireMat,
  rimMat,
  cyanMat,
  violetMat,
}) => (
  <group>
    {/* Competition Rubber Tire with Beveled Tread Profile */}
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.45, 0.45, 0.35, 28]} />
      <primitive object={tireMat} attach="material" />
    </mesh>

    {/* Deep-dish Black Chrome Alloy Rim */}
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.29, 0.29, 0.37, 20]} />
      <primitive object={rimMat} attach="material" />
    </mesh>

    {/* Thin Electric Cyan Outer Ring Lighting */}
    <mesh
      position={[isLeft ? -0.19 : 0.19, 0, 0]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <ringGeometry args={[0.31, 0.38, 28]} />
      <primitive object={cyanMat} attach="material" />
    </mesh>

    {/* Hubless Center Core with Deep Violet Accent */}
    <mesh position={[isLeft ? -0.195 : 0.195, 0, 0]}>
      <circleGeometry args={[0.13, 18]} />
      <primitive object={violetMat} attach="material" />
    </mesh>
  </group>
)

export const FuturisticCar: React.FC<FuturisticCarProps> = ({
  speed = 35,
  steeringOffset = 0,
  nitro = false,
}) => {
  const carRootRef = useRef<THREE.Group>(null)
  const chassisRef = useRef<THREE.Group>(null)
  const frontLeftWheelRef = useRef<THREE.Group>(null)
  const frontRightWheelRef = useRef<THREE.Group>(null)
  const rearLeftWheelRef = useRef<THREE.Group>(null)
  const rearRightWheelRef = useRef<THREE.Group>(null)
  const exhaustLightRef = useRef<THREE.PointLight>(null)
  const violetGlowRef = useRef<THREE.PointLight>(null)
  const flameGroupRef = useRef<THREE.Group>(null)

  // 1. PRIMARY BODY: Pearl White Metallic with Liquid Chrome Highlights & Clearcoat
  const pearlWhitePaint = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f8fafc', // Pristine pearl white
        metalness: 0.88,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
        reflectivity: 0.98,
      }),
    []
  )

  // 2. Liquid Chrome Highlights & Accents
  const liquidChromeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        metalness: 0.98,
        roughness: 0.08,
      }),
    []
  )

  // 3. SECONDARY PANELS: Dark Graphite Carbon-Fiber
  const carbonFiberMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#080c14',
        roughness: 0.32,
        metalness: 0.85,
      }),
    []
  )

  // 4. Brushed Titanium Details
  const brushedTitaniumMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        metalness: 0.94,
        roughness: 0.2,
      }),
    []
  )

  // 5. WINDOWS: Dark Blue Tinted Reflective Glass Canopy
  const tintedCanopyGlassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#03112c', // Deep cockpit navy
        metalness: 0.45,
        roughness: 0.05,
        transmission: 0.52,
        transparent: true,
        opacity: 0.88,
        reflectivity: 0.98,
      }),
    []
  )

  // 6. NEON ACCENTS: Electric Cyan
  const electricCyanMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#00f0ff',
      }),
    []
  )

  // 7. NEON ACCENTS: Deep Violet
  const deepVioletMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#8b5cf6',
      }),
    []
  )

  // 8. NEON ACCENTS: Subtle Magenta Highlights
  const magentaAccentMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ec4899',
      }),
    []
  )

  // 9. REAR LIGHTS: Red-Pink LED Tail Lightbar
  const brakeLightMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ff0055',
      }),
    []
  )

  // 10. WHEELS: Tire & Black Chrome Materials
  const tireMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#03050a',
        roughness: 0.82,
        metalness: 0.1,
      }),
    []
  )

  const blackChromeRimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#070a12',
        roughness: 0.12,
        metalness: 0.96,
      }),
    []
  )

  // Continuous Frame Loop: Delta time, frame-rate independent, infinite duration
  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime()
    const activeSpeed = nitro ? speed * 1.65 : speed

    // 1. Continuous Wheel Spin (Never stops, frame-rate independent)
    const wheelSpin = activeSpeed * delta * 2.8
    if (frontLeftWheelRef.current) frontLeftWheelRef.current.rotation.x += wheelSpin
    if (frontRightWheelRef.current) frontRightWheelRef.current.rotation.x += wheelSpin
    if (rearLeftWheelRef.current) rearLeftWheelRef.current.rotation.x += wheelSpin
    if (rearRightWheelRef.current) rearRightWheelRef.current.rotation.x += wheelSpin

    // 2. High-speed Suspension Bounce & Body Dynamics
    if (chassisRef.current) {
      // Micro road vibration + suspension breathing
      const roadVibration = Math.sin(time * 32) * 0.012 + Math.sin(time * 18) * 0.006
      chassisRef.current.position.y = 0.38 + roadVibration

      // Lateral roll tilt during lane drift or steering
      const targetRoll = -steeringOffset * 0.12 + Math.sin(time * 1.8) * 0.015
      chassisRef.current.rotation.z = THREE.MathUtils.lerp(chassisRef.current.rotation.z, targetRoll, 0.12)

      // Pitch angle during acceleration
      const targetPitch = Math.sin(time * 5.5) * 0.006 - 0.012
      chassisRef.current.rotation.x = THREE.MathUtils.lerp(chassisRef.current.rotation.x, targetPitch, 0.12)
    }

    // 3. Smooth Lane Centering & Gentle Drift
    if (carRootRef.current) {
      const targetX = steeringOffset * 1.8 + Math.sin(time * 0.7) * 0.35
      carRootRef.current.position.x = THREE.MathUtils.lerp(carRootRef.current.position.x, targetX, 0.06)
    }

    // 4. Exhaust Plasma Pulsing & Flame Stretch
    if (exhaustLightRef.current) {
      const baseIntensity = nitro ? 4.8 : 2.8
      exhaustLightRef.current.intensity = baseIntensity + Math.sin(time * 28) * 0.8
    }

    if (violetGlowRef.current) {
      const baseViolet = nitro ? 3.5 : 2.2
      violetGlowRef.current.intensity = baseViolet + Math.sin(time * 24) * 0.6
    }

    if (flameGroupRef.current) {
      const scaleZ = (nitro ? 1.6 : 1.0) + Math.sin(time * 30) * 0.2
      flameGroupRef.current.scale.set(1, 1, scaleZ)
    }
  })

  return (
    <group ref={carRootRef} position={[0, 0, 0]}>
      {/* Main Supercar Chassis */}
      <group ref={chassisRef} position={[0, 0.38, 0]}>
        {/* ======================================================== */}
        {/* 1. PRIMARY MONOCOQUE BODY — Pearl White Titanium Chrome */}
        {/* ======================================================== */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[2.08, 0.34, 4.45]} />
          <primitive object={pearlWhitePaint} attach="material" />
        </mesh>

        {/* Liquid Chrome Body Side Crease Strips */}
        <mesh position={[-1.05, 0.06, 0]}>
          <boxGeometry args={[0.02, 0.08, 4.3]} />
          <primitive object={liquidChromeMaterial} attach="material" />
        </mesh>
        <mesh position={[1.05, 0.06, 0]}>
          <boxGeometry args={[0.02, 0.08, 4.3]} />
          <primitive object={liquidChromeMaterial} attach="material" />
        </mesh>

        {/* Sculpted Muscular Rear Wheel Arches / Haunches in Pearl White */}
        <mesh position={[-0.98, 0.17, 1.25]}>
          <boxGeometry args={[0.38, 0.4, 1.7]} />
          <primitive object={pearlWhitePaint} attach="material" />
        </mesh>
        <mesh position={[0.98, 0.17, 1.25]}>
          <boxGeometry args={[0.38, 0.4, 1.7]} />
          <primitive object={pearlWhitePaint} attach="material" />
        </mesh>

        {/* Flared Front Wheel Arches & Slanted Hood in Pearl White */}
        <mesh position={[0, 0.14, -1.35]} rotation={[0.11, 0, 0]}>
          <boxGeometry args={[1.94, 0.22, 1.85]} />
          <primitive object={pearlWhitePaint} attach="material" />
        </mesh>

        {/* Hood Aerodynamic Air Extractor Inset (Dark Graphite Carbon) */}
        <mesh position={[0, 0.22, -1.25]} rotation={[0.11, 0, 0]}>
          <boxGeometry args={[0.95, 0.08, 0.8]} />
          <primitive object={carbonFiberMaterial} attach="material" />
        </mesh>

        {/* Front Splitter Carbon Fiber Lip with Electric Cyan Edge */}
        <mesh position={[0, -0.08, -2.32]}>
          <boxGeometry args={[2.18, 0.06, 0.44]} />
          <primitive object={carbonFiberMaterial} attach="material" />
        </mesh>
        <mesh position={[0, -0.08, -2.53]}>
          <boxGeometry args={[2.16, 0.02, 0.04]} />
          <primitive object={electricCyanMaterial} attach="material" />
        </mesh>

        {/* ======================================================== */}
        {/* 2. COCKPIT GREENHOUSE & BLUE TINTED GLASS CANOPY        */}
        {/* ======================================================== */}
        <mesh position={[0, 0.44, 0.1]} rotation={[-0.14, 0, 0]}>
          <boxGeometry args={[1.44, 0.44, 2.05]} />
          <primitive object={tintedCanopyGlassMaterial} attach="material" />
        </mesh>

        {/* Cockpit Interior Cyan Holographic HUD Display */}
        <mesh position={[0, 0.32, -0.42]}>
          <planeGeometry args={[0.85, 0.28]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.7} />
        </mesh>

        {/* ======================================================== */}
        {/* 3. REAR ENGINE DECK & HEAT DISSIPATION LOUVERS          */}
        {/* ======================================================== */}
        <mesh position={[0, 0.26, 1.34]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[1.94, 0.34, 1.75]} />
          <primitive object={pearlWhitePaint} attach="material" />
        </mesh>

        {/* Brushed Titanium Heat Louvers */}
        {[-0.1, 0.3, 0.7].map((offsetZ, i) => (
          <mesh key={i} position={[0, 0.44, 0.6 + offsetZ]} rotation={[-0.16, 0, 0]}>
            <boxGeometry args={[1.15, 0.03, 0.22]} />
            <primitive object={brushedTitaniumMaterial} attach="material" />
          </mesh>
        ))}

        {/* ======================================================== */}
        {/* 4. AGGRESSIVE CARBON-FIBER REAR DIFFUSER & VORTEX STAKES */}
        {/* ======================================================== */}
        <mesh position={[0, -0.06, 2.22]}>
          <boxGeometry args={[2.02, 0.16, 0.38]} />
          <primitive object={carbonFiberMaterial} attach="material" />
        </mesh>
        {/* Diffuser Vertical Strakes */}
        {[-0.72, -0.26, 0.26, 0.72].map((x, i) => (
          <mesh key={i} position={[x, -0.06, 2.28]}>
            <boxGeometry args={[0.04, 0.22, 0.36]} />
            <primitive object={carbonFiberMaterial} attach="material" />
          </mesh>
        ))}

        {/* ======================================================== */}
        {/* 5. ACTIVE AERODYNAMIC REAR WING / SPOILER               */}
        {/* ======================================================== */}
        <group position={[0, 0.68, 2.02]}>
          {/* Main Airfoil in Pearl White */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.3, 0.08, 0.52]} />
            <primitive object={pearlWhitePaint} attach="material" />
          </mesh>
          {/* Carbon Endplates */}
          <mesh position={[-1.16, 0.04, 0]}>
            <boxGeometry args={[0.04, 0.2, 0.54]} />
            <primitive object={carbonFiberMaterial} attach="material" />
          </mesh>
          <mesh position={[1.16, 0.04, 0]}>
            <boxGeometry args={[0.04, 0.2, 0.54]} />
            <primitive object={carbonFiberMaterial} attach="material" />
          </mesh>
          {/* Airfoil Upright Stanchions (Brushed Titanium) */}
          <mesh position={[-0.85, -0.22, 0]}>
            <boxGeometry args={[0.08, 0.42, 0.32]} />
            <primitive object={brushedTitaniumMaterial} attach="material" />
          </mesh>
          <mesh position={[0.85, -0.22, 0]}>
            <boxGeometry args={[0.08, 0.42, 0.32]} />
            <primitive object={brushedTitaniumMaterial} attach="material" />
          </mesh>
          {/* Electric Cyan Neon Top Accent Blade */}
          <mesh position={[0, 0.048, 0.24]}>
            <boxGeometry args={[2.28, 0.02, 0.06]} />
            <primitive object={electricCyanMaterial} attach="material" />
          </mesh>
        </group>

        {/* ======================================================== */}
        {/* 6. FULL-WIDTH CONTINUOUS CYBERNETIC REAR LED LIGHTBAR   */}
        {/* ======================================================== */}
        {/* Upper Red-Pink Brake Lightbar */}
        <mesh position={[0, 0.27, 2.25]}>
          <boxGeometry args={[1.94, 0.08, 0.06]} />
          <primitive object={brakeLightMaterial} attach="material" />
        </mesh>
        {/* Lower Electric Cyan Edge Accent */}
        <mesh position={[0, 0.19, 2.25]}>
          <boxGeometry args={[1.7, 0.025, 0.05]} />
          <primitive object={electricCyanMaterial} attach="material" />
        </mesh>

        {/* Rear License Plate: "NEXAURA" in Electric Cyan */}
        <group position={[0, 0.11, 2.26]}>
          <mesh>
            <boxGeometry args={[0.92, 0.18, 0.02]} />
            <meshStandardMaterial color="#060913" metalness={0.9} roughness={0.3} />
          </mesh>
          <Text
            position={[0, 0, 0.015]}
            fontSize={0.12}
            color="#00f0ff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.22}
          >
            NEXAURA
          </Text>
        </group>

        {/* ======================================================== */}
        {/* 7. QUAD FUTURISTIC EXHAUST PORTS & ELECTRIC BLUE ENERGY */}
        {/* ======================================================== */}
        {/* Left Twin Exhaust Nozzles */}
        {[-0.6, -0.38].map((posX, i) => (
          <group key={`lexh-${i}`} position={[posX, 0.04, 2.24]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.13, 0.24, 18]} />
              <primitive object={carbonFiberMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0, 0.12]}>
              <circleGeometry args={[0.09, 18]} />
              <primitive object={electricCyanMaterial} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Right Twin Exhaust Nozzles */}
        {[0.38, 0.6].map((posX, i) => (
          <group key={`rexh-${i}`} position={[posX, 0.04, 2.24]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.13, 0.24, 18]} />
              <primitive object={carbonFiberMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0, 0.12]}>
              <circleGeometry args={[0.09, 18]} />
              <primitive object={electricCyanMaterial} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Dynamic Exhaust Energy Flame Cones */}
        <group ref={flameGroupRef} position={[0, 0.04, 2.5]}>
          <mesh position={[-0.49, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.14, 0.65, 16]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} />
          </mesh>
          <mesh position={[0.49, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.14, 0.65, 16]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} />
          </mesh>
          {/* Inner Violet Energy Core Plume */}
          <mesh position={[-0.49, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.08, 0.45, 16]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0.49, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.08, 0.45, 16]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.9} />
          </mesh>
        </group>

        {/* Real-time Exhaust Light Casting on Wet Highway */}
        <pointLight
          ref={exhaustLightRef}
          position={[0, 0.05, 2.9]}
          color="#00f0ff"
          intensity={3.0}
          distance={15}
          decay={2}
        />

        {/* Deep Violet Secondary Exhaust Aura Light */}
        <pointLight
          ref={violetGlowRef}
          position={[0, 0.05, 2.4]}
          color="#8b5cf6"
          intensity={2.2}
          distance={12}
          decay={2}
        />

        {/* ======================================================== */}
        {/* 8. LATERAL ELECTRIC CYAN NEON BLADES & VIOLET ACCENTS    */}
        {/* ======================================================== */}
        <mesh position={[-1.08, 0.09, 0]}>
          <boxGeometry args={[0.03, 0.06, 3.4]} />
          <primitive object={electricCyanMaterial} attach="material" />
        </mesh>
        <mesh position={[1.08, 0.09, 0]}>
          <boxGeometry args={[0.03, 0.06, 3.4]} />
          <primitive object={electricCyanMaterial} attach="material" />
        </mesh>

        {/* Small Subtle Magenta Highlights near rear air extractors */}
        <mesh position={[-0.92, 0.02, 1.95]}>
          <boxGeometry args={[0.15, 0.04, 0.04]} />
          <primitive object={magentaAccentMaterial} attach="material" />
        </mesh>
        <mesh position={[0.92, 0.02, 1.95]}>
          <boxGeometry args={[0.15, 0.04, 0.04]} />
          <primitive object={magentaAccentMaterial} attach="material" />
        </mesh>

        {/* ======================================================== */}
        {/* 9. DEEP VIOLET & ELECTRIC CYAN GROUND UNDERGLOW         */}
        {/* ======================================================== */}
        {/* Forward Cyan Underglow */}
        <pointLight position={[0, -0.24, -0.5]} color="#00f0ff" intensity={3.6} distance={6.5} decay={2} />
        {/* Rearward Deep Violet Underglow */}
        <pointLight position={[0, -0.24, 1.2]} color="#8b5cf6" intensity={3.5} distance={6.5} decay={2} />
      </group>

      {/* ========================================================== */}
      {/* 10. COMPETITION CYBER WHEELS (Black Chrome & Cyan Rings)    */}
      {/* ========================================================== */}
      {/* Front Left */}
      <group ref={frontLeftWheelRef} position={[-1.06, 0.44, -1.35]}>
        <CyberWheel
          isLeft={true}
          tireMat={tireMaterial}
          rimMat={blackChromeRimMaterial}
          cyanMat={electricCyanMaterial}
          violetMat={deepVioletMaterial}
        />
      </group>
      {/* Front Right */}
      <group ref={frontRightWheelRef} position={[1.06, 0.44, -1.35]}>
        <CyberWheel
          isLeft={false}
          tireMat={tireMaterial}
          rimMat={blackChromeRimMaterial}
          cyanMat={electricCyanMaterial}
          violetMat={deepVioletMaterial}
        />
      </group>
      {/* Rear Left (Wider Stance) */}
      <group ref={rearLeftWheelRef} position={[-1.1, 0.44, 1.35]}>
        <CyberWheel
          isLeft={true}
          tireMat={tireMaterial}
          rimMat={blackChromeRimMaterial}
          cyanMat={electricCyanMaterial}
          violetMat={deepVioletMaterial}
        />
      </group>
      {/* Rear Right (Wider Stance) */}
      <group ref={rearRightWheelRef} position={[1.1, 0.44, 1.35]}>
        <CyberWheel
          isLeft={false}
          tireMat={tireMaterial}
          rimMat={blackChromeRimMaterial}
          cyanMat={electricCyanMaterial}
          violetMat={deepVioletMaterial}
        />
      </group>
    </group>
  )
}

export default FuturisticCar
