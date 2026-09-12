import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { Plus } from 'lucide-react'
import type { AttributeData, AttributeType } from '../../types/rpg'
import { cn } from '../../lib/utils'

export interface CrystalMeshProps {
  color?: string
  attributeCode?: AttributeType | string
  isHovered?: boolean
  points?: number
}

export function CrystalMesh({ color, attributeCode = 'INT', isHovered = false }: CrystalMeshProps) {
  const crystalRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  const resolvedColor = color || (
    attributeCode === 'INT' ? '#00f0ff' :
    attributeCode === 'STR' ? '#ef4444' :
    attributeCode === 'DEX' ? '#facc15' :
    attributeCode === 'VIT' ? '#10b981' : '#a855f7'
  )

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * (isHovered ? 2.5 : 1.2)
      crystalRef.current.rotation.x = Math.sin(t * 1.5) * 0.25
      crystalRef.current.position.y = Math.sin(t * 2) * 0.12
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.8
      ringRef.current.rotation.x = 1.1 + Math.sin(t * 2) * 0.15
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Faceted Octahedron Crystal */}
      <mesh ref={crystalRef} scale={isHovered ? [1.15, 1.35, 1.15] : [0.95, 1.15, 0.95]}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color={resolvedColor}
          emissive={resolvedColor}
          emissiveIntensity={isHovered ? 2.2 : 1.4}
          roughness={0.15}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Orbiting Energy Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.3, 0.02, 12, 32]} />
        <meshStandardMaterial
          color={resolvedColor}
          emissive={resolvedColor}
          emissiveIntensity={1.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}

export interface StatCrystal3DProps {
  attribute?: AttributeData
  attributeType?: AttributeType
  points?: number
  unassignedPoints?: number
  onAllocate?: () => void
  onInjectPoint?: () => void
  className?: string
}

export const StatCrystal3D: React.FC<StatCrystal3DProps> = ({
  attribute,
  attributeType,
  points,
  unassignedPoints = 0,
  onAllocate,
  onInjectPoint,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const code = attribute?.code || attributeType || 'INT'
  const val = attribute?.value ?? points ?? 10
  const lvl = attribute?.level ?? Math.floor(val / 10) + 1
  const name = attribute?.name || code
  const perk = attribute?.perk || 'Neural augmentation active'

  const getCrystalColor = (c: string) => {
    switch (c) {
      case 'INT':
        return '#00f0ff'
      case 'STR':
        return '#ef4444'
      case 'DEX':
        return '#facc15'
      case 'VIT':
        return '#10b981'
      case 'DIS':
        return '#a855f7'
      default:
        return '#00f0ff'
    }
  }

  const crystalColor = getCrystalColor(code)
  const currentTierBase = (lvl - 1) * 10
  const progressInTier = val - currentTierBase
  const handleAction = onAllocate || onInjectPoint

  return (
    <motion.div
      whileHover={{ y: -3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative rounded-xl border p-4 bg-[#0a0f22]/85 backdrop-blur-md transition-all duration-300 flex flex-col justify-between overflow-hidden',
        isHovered
          ? 'border-cyan-400/70 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
          : 'border-slate-800 hover:border-slate-700',
        className
      )}
    >
      {/* Top Tag & Allocate Action */}
      <div className="flex items-center justify-between z-10">
        <div>
          <div className="font-orbitron text-xs font-black tracking-wider text-slate-100 flex items-center gap-1.5">
            <span style={{ color: crystalColor }}>●</span>
            <span>{code} // {name}</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            TIER {lvl} ({val} PTS)
          </div>
        </div>

        {unassignedPoints > 0 && handleAction && (
          <button
            onClick={handleAction}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-400 hover:text-black text-cyan-300 border border-cyan-400 text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(0,240,255,0.4)] cursor-pointer"
            title="Inject +2 Stat Points"
          >
            <Plus className="w-3 h-3" />
            <span>+2</span>
          </button>
        )}
      </div>

      {/* 3D Interactive Crystal Canvas */}
      <div className="h-28 w-full relative my-1">
        <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 5, 3]} intensity={1.5} color={crystalColor} />
          <pointLight position={[-3, -2, -2]} intensity={1.2} color="#ffffff" />
          <CrystalMesh color={crystalColor} attributeCode={code} isHovered={isHovered} />
        </Canvas>
      </div>

      {/* Tier Progress Bar & Perk */}
      <div className="space-y-1.5 z-10">
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>Tier Progression</span>
          <span style={{ color: crystalColor }}>{progressInTier}/10 PTS</span>
        </div>

        <div className="h-1.5 w-full bg-slate-900 rounded overflow-hidden border border-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, (progressInTier / 10) * 100))}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded"
            style={{ backgroundColor: crystalColor, boxShadow: `0 0 10px ${crystalColor}` }}
          />
        </div>

        <div className="text-[10px] font-mono text-slate-400 truncate pt-0.5">
          &gt; {perk}
        </div>
      </div>
    </motion.div>
  )
}
