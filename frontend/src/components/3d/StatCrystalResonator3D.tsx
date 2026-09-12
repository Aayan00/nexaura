import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { AttributeType, AttributeData } from '../../types/rpg'
import { sound } from '../../lib/sound'

interface StatCrystalResonatorProps {
  attributes: AttributeData[]
  activeStat: AttributeType
  onSelectStat: (stat: AttributeType) => void
  onInjectPoint: (stat: AttributeType) => void
  unassignedPoints: number
  powerRating: number
}

// 3D Faceted Crystal Mesh
function CrystalResonatorMesh({
  color,
  isHovered,
  onClick,
}: {
  color: string
  isHovered: boolean
  onClick: () => void
}) {
  const crystalOuterRef = useRef<THREE.Mesh>(null)
  const crystalInnerRef = useRef<THREE.Mesh>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const [pulse, setPulse] = useState(0)

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // Smooth crystal tumbling & levitation
    if (crystalOuterRef.current) {
      crystalOuterRef.current.rotation.y += delta * (isHovered ? 2.4 : 1.2)
      crystalOuterRef.current.rotation.x = Math.sin(t * 1.5) * 0.2
      crystalOuterRef.current.position.y = Math.sin(t * 2.0) * 0.12
    }
    if (crystalInnerRef.current) {
      crystalInnerRef.current.rotation.y -= delta * 1.8
      crystalInnerRef.current.rotation.z = Math.cos(t * 1.5) * 0.25
      crystalInnerRef.current.position.y = Math.sin(t * 2.0) * 0.12
    }

    // Gyroscopic orbital energy rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 1.6
      ring1Ref.current.rotation.x = 1.1 + Math.sin(t * 1.8) * 0.18
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 1.4
      ring2Ref.current.rotation.z = -0.8 + Math.cos(t * 2.2) * 0.15
    }
  })

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        onClick()
        setPulse(1)
        setTimeout(() => setPulse(0), 400)
      }}
      scale={pulse ? [1.15, 1.15, 1.15] : isHovered ? [1.08, 1.08, 1.08] : [1, 1, 1]}
    >
      {/* 1. Translucent Outer Faceted Crystal */}
      <mesh ref={crystalOuterRef}>
        <octahedronGeometry args={[0.92, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 2.6 : 1.6}
          roughness={0.12}
          metalness={0.85}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* 2. Inner Condensed Energy Core */}
      <mesh ref={crystalInnerRef} scale={[0.5, 0.5, 0.5]}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={color}
          emissiveIntensity={3.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* 3. Primary Orbital Energy Ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.42, 0.022, 16, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.2}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* 4. Secondary Counter-Rotating Orbital Ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.65, 0.016, 16, 48]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={color}
          emissiveIntensity={1.8}
          transparent
          opacity={0.55}
        />
      </mesh>
    </group>
  )
}

export const StatCrystalResonator3D: React.FC<StatCrystalResonatorProps> = ({
  attributes,
  activeStat,
  onSelectStat,
  onInjectPoint,
  unassignedPoints,
  powerRating,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [justInjected, setJustInjected] = useState(false)

  const activeAttr = attributes.find((a) => a.code === activeStat) || attributes[0]

  const getStatColor = (code: AttributeType) => {
    switch (code) {
      case 'INT':
        return '#00E5FF'
      case 'STR':
        return '#ef4444'
      case 'DEX':
        return '#10b981'
      case 'VIT':
        return '#FF2BA6'
      case 'DIS':
        return '#8B5CF6'
      default:
        return '#00E5FF'
    }
  }

  const activeColor = getStatColor(activeStat)

  const handleInject = () => {
    if (unassignedPoints <= 0) {
      sound.playAlert()
      return
    }
    onInjectPoint(activeStat)
    setJustInjected(true)
    setTimeout(() => setJustInjected(false), 800)
  }

  return (
    <div className="rounded-2xl bg-[#080B18]/90 border border-cyan-500/35 backdrop-blur-xl p-5 shadow-[0_0_30px_rgba(0,229,255,0.12)] relative overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-3.5">
        <div>
          <h3 className="font-mono text-sm sm:text-base font-bold tracking-wider text-slate-100 uppercase flex items-center gap-2">
            <span className="text-cyan-400">✧</span>
            3D STAT CRYSTAL RESONATOR
          </h3>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Click crystal or button to inject points
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-500 uppercase">SYNAPSE POWER</div>
          <div className="text-xs sm:text-sm font-mono text-cyan-400 font-black tracking-wider">
            POWER: {powerRating.toLocaleString()} PR
          </div>
        </div>
      </div>

      {/* Stat Tabs */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-3">
        {(['INT', 'STR', 'DEX', 'VIT', 'DIS'] as AttributeType[]).map((code) => {
          const isSelected = activeStat === code
          const attr = attributes.find((a) => a.code === code)
          return (
            <button
              key={code}
              onClick={() => {
                sound.playClick()
                onSelectStat(code)
              }}
              className={`py-2 px-1 rounded-lg font-mono text-[11px] font-bold text-center transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-[#050816]/70 text-slate-400 border-slate-800/80 hover:border-cyan-500/40 hover:text-slate-200'
              }`}
            >
              <div className="truncate">{code}</div>
              <div className="text-[10px] font-normal text-slate-400">({attr?.value || 0} PTS)</div>
            </button>
          )
        })}
      </div>

      {/* 3D Interactive Crystal Chamber */}
      <div
        className="h-56 sm:h-64 w-full rounded-xl bg-gradient-to-b from-[#020611] via-[#050918] to-[#020611] relative overflow-hidden border border-cyan-500/30 group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleInject}
        title={unassignedPoints > 0 ? `Click to inject +1 PT into ${activeStat}` : 'No unassigned stat points'}
      >
        {/* Subtle Cyber Grid in Canvas background */}
        <div className="absolute inset-0 cyber-grid-dense opacity-20 pointer-events-none" />

        {/* Hover / Injection status badge */}
        <div className="absolute top-2.5 left-3 z-10 text-[10px] font-mono text-cyan-400/80 bg-[#020611]/80 px-2 py-0.5 rounded border border-cyan-500/25 pointer-events-none">
          // HARMONIC FREQ :: {activeStat} [TIER {activeAttr?.level || 1}]
        </div>

        {justInjected && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-cyan-500/10 backdrop-blur-xs animate-ping pointer-events-none">
            <span className="font-mono text-sm font-bold text-cyan-300">
              +1 POINT INJECTED!
            </span>
          </div>
        )}

        {/* Three.js R3F Canvas */}
        <Canvas camera={{ position: [0, 0, 3.6], fov: 45 }}>
          <ambientLight intensity={0.9} />
          <pointLight position={[3, 3, 3]} intensity={2.2} color={activeColor} />
          <pointLight position={[-3, -3, 2]} intensity={1.8} color="#FF2BA6" />
          <pointLight position={[0, 0, 2.5]} intensity={1.2} color="#ffffff" />
          <CrystalResonatorMesh
            color={activeColor}
            isHovered={isHovered}
            onClick={handleInject}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={isHovered ? 2.8 : 1.2}
          />
        </Canvas>

        {/* Bottom CTA Overlay */}
        <div className="absolute bottom-2.5 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] font-mono text-slate-400">
            {activeAttr?.fullName || activeStat}
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              unassignedPoints > 0
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                : 'bg-slate-900/80 text-slate-500 border-slate-800'
            }`}
          >
            {unassignedPoints > 0 ? 'CLICK CRYSTAL TO INJECT' : 'RESONATOR CHARGED'}
          </span>
        </div>
      </div>
    </div>
  )
}
