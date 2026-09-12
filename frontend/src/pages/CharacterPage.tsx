import React, { useState } from 'react'
import {
  Sparkles,
  Shield,
  Cpu,
  Brain,
  Dumbbell,
  Zap,
  Heart,
  Plus,
  ShieldAlert,
  Play,
} from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { PageHeader } from '../components/PageHeader'
import { GlassPanel } from '../components/GlassPanel'
import { ProgressBar } from '../components/ProgressBar'
import { XPBar } from '../components/XPBar'
import { CrystalMesh } from '../components/3d/StatCrystal3D'
import { CyberpunkHumanAvatar3D } from '../components/3d/CyberpunkHumanAvatar3D'
import { useRPG, type AvatarAnimState } from '../context/RPGContext'
import { sound } from '../lib/sound'
import type { AttributeType } from '../types/rpg'
import { cn } from '../lib/utils'

export const CharacterPage: React.FC = () => {
  const {
    user,
    attributes,
    shopItems,
    avatarState,
    setAvatarState,
    allocateStatPoint,
    equipShopItem,
  } = useRPG()

  const [activeStatTab, setActiveStatTab] = useState<AttributeType>('INT')

  const equippedCyberware = shopItems.filter((i) => i.type === 'cyberware' && i.equipped)
  const totalAttributeScore = attributes.reduce((acc, curr) => acc + curr.value, 0)
  const powerRating = totalAttributeScore * 10 + user.level * 250

  const animStates: { id: AvatarAnimState; label: string }[] = [
    { id: 'idle', label: 'IDLE BREATHING' },
    { id: 'focus', label: 'NEURAL FOCUS' },
    { id: 'complete', label: 'EXECUTE' },
    { id: 'levelup', label: 'LEVEL UP' },
    { id: 'victory', label: 'VICTORY POSE' },
  ]

  const getAttrIcon = (code: AttributeType) => {
    switch (code) {
      case 'INT':
        return <Brain className="w-5 h-5 text-cyan-400" />
      case 'STR':
        return <Dumbbell className="w-5 h-5 text-red-400" />
      case 'DEX':
        return <Zap className="w-5 h-5 text-emerald-400" />
      case 'VIT':
        return <Heart className="w-5 h-5 text-pink-400" />
      case 'DIS':
        return <Shield className="w-5 h-5 text-purple-400" />
    }
  }

  const getAttrColor = (code: AttributeType) => {
    switch (code) {
      case 'INT':
        return { border: 'border-cyan-500/40', text: 'text-cyan-400', bar: 'cyan' as const }
      case 'STR':
        return { border: 'border-red-500/40', text: 'text-red-400', bar: 'red' as const }
      case 'DEX':
        return { border: 'border-emerald-500/40', text: 'text-emerald-400', bar: 'green' as const }
      case 'VIT':
        return { border: 'border-pink-500/40', text: 'text-pink-400', bar: 'magenta' as const }
      case 'DIS':
        return { border: 'border-purple-500/40', text: 'text-purple-400', bar: 'purple' as const }
    }
  }

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        sectionCode="SEC_03_NEURAL_SHEET"
        title="OPERATIVE 3D RIG &amp; CHARACTER DOSSIER"
        subtitle="Full 3D holographic avatar customizer, neural attribute matrix, and cybernetic loadout management."
      />

      {/* Top Banner: Level & Progression */}
      <XPBar
        level={user.level}
        currentXP={user.currentXP}
        maxXP={user.maxXP}
        unassignedPoints={user.unassignedPoints}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 3D Holographic Avatar & Cyberware Loadout */}
        <div className="lg:col-span-5 space-y-6">
          {/* 3D Hologram Avatar Chamber */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-black border border-cyan-500/40 relative overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.2)] flex flex-col justify-between min-h-[460px]">
            {/* Header tags */}
            <div className="p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
                <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  3D HOLOPLATFORM RIG
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                DRAG TO ROTATE
              </span>
            </div>

            {/* 3D Humanoid Avatar Canvas */}
            <div className="relative w-full h-[380px]">
              <CyberpunkHumanAvatar3D
                state={avatarState}
                theme={user.theme}
                enableControls={true}
                className="h-full w-full"
              />
            </div>

            {/* Animation state controls */}
            <div className="p-3 bg-black/75 backdrop-blur-md border-t border-cyan-500/30 z-10 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                <Play className="w-3 h-3 text-cyan-400" />
                <span>POSE &amp; ANIMATION TRIGGER:</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {animStates.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      sound.playClick()
                      setAvatarState(st.id)
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                      avatarState === st.id
                        ? 'bg-cyan-500 text-black shadow-[0_0_10px_#00f0ff]'
                        : 'bg-black/50 text-slate-400 border border-slate-800 hover:border-cyan-500/40'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cyberware Loadout Slots */}
          <GlassPanel variant="purple" className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-4">
              <h4 className="font-mono text-xs font-bold tracking-wider text-purple-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                // CYBERNETIC SLOTS &amp; AUGMENTS
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                {equippedCyberware.length} / 4 SLOTS
              </span>
            </div>

            <div className="space-y-3">
              {[
                { slot: 'neural', label: 'Neural Bus' },
                { slot: 'optics', label: 'Optical HUD' },
                { slot: 'subdermal', label: 'Subdermal Mesh' },
                { slot: 'biomonitor', label: 'Bio-Telemetry' },
              ].map((slotDef) => {
                const installed = equippedCyberware.find((i) => i.slot === slotDef.slot)
                return (
                  <div
                    key={slotDef.slot}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border transition-all',
                      installed
                        ? 'bg-purple-950/20 border-purple-500/40 text-purple-200'
                        : 'bg-black/40 border-slate-800 text-slate-500'
                    )}
                  >
                    <div>
                      <div className="text-[10px] font-mono uppercase text-slate-500">
                        [{slotDef.label}]
                      </div>
                      <div className="font-mono font-bold text-xs text-slate-200">
                        {installed ? installed.name : 'EMPTY SOCKET'}
                      </div>
                      {installed && (
                        <div className="text-[10px] font-mono text-purple-400 mt-0.5">
                          {installed.perk}
                        </div>
                      )}
                    </div>

                    {installed ? (
                      <button
                        onClick={() => {
                          sound.playClick()
                          equipShopItem(installed.id)
                        }}
                        className="px-2 py-0.5 rounded text-[10px] font-mono border border-purple-400 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 cursor-pointer shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                      >
                        UNPLUG
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-slate-800 bg-slate-900 text-slate-600">
                        EMPTY
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </GlassPanel>
        </div>

        {/* Right Column: Character Attributes & 3D Crystal Chamber */}
        <div className="lg:col-span-7 space-y-6">
          {/* Stat Allocation Notification Banner */}
          {user.unassignedPoints > 0 && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-pink-950/80 to-purple-950/80 border-2 border-pink-500/80 text-pink-200 shadow-[0_0_20px_rgba(255,0,127,0.3)]">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-pink-400 animate-bounce shrink-0" />
                <div>
                  <h4 className="font-mono text-xs font-bold tracking-wider text-pink-300 uppercase">
                    UNASSIGNED NEURAL STAT POINTS: {user.unassignedPoints}
                  </h4>
                  <p className="text-xs text-slate-300">
                    Inject points into any attribute below to unlock exponential multipliers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3D Interactive Crystal Chamber */}
          <div className="p-5 rounded-xl bg-black/60 border border-cyan-500/30 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 border-b border-cyan-500/20 pb-2">
              <div>
                <h3 className="font-mono text-base font-bold tracking-wider text-white uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  3D STAT CRYSTAL RESONATOR
                </h3>
                <p className="text-xs text-slate-400">Click crystal or button to inject points</p>
              </div>
              <div className="text-xs font-mono text-cyan-400 font-bold">
                POWER: {powerRating.toLocaleString()} PR
              </div>
            </div>

            {/* Stat Selector Pills */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {(['INT', 'STR', 'DEX', 'VIT', 'DIS'] as AttributeType[]).map((code) => {
                const isSelected = activeStatTab === code
                const attr = attributes.find((a) => a.code === code)
                return (
                  <button
                    key={code}
                    onClick={() => {
                      sound.playClick()
                      setActiveStatTab(code)
                    }}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                        : 'bg-black/40 text-slate-400 border border-slate-800 hover:border-cyan-500/30'
                    }`}
                  >
                    {code} ({attr?.value || 0} PTS)
                  </button>
                )
              })}
            </div>

            {/* 3D Canvas for Stat Crystal */}
            <div className="h-56 w-full rounded-xl bg-gradient-to-b from-slate-950 via-cyan-950/20 to-black relative overflow-hidden border border-cyan-500/30">
              <Canvas camera={{ position: [0, 0, 3.4], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[3, 3, 3]} intensity={2.0} color="#00f0ff" />
                <pointLight position={[-3, -3, 2]} intensity={1.5} color="#ff007f" />
                <CrystalMesh
                  attributeCode={activeStatTab}
                  points={attributes.find((a) => a.code === activeStatTab)?.value || 10}
                />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
              </Canvas>
            </div>
          </div>

          {/* Attributes Matrix Detailed Cards */}
          <GlassPanel variant="default" className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-mono text-base font-bold tracking-wider text-slate-100">
                  NEURAL ATTRIBUTE MATRIX
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  5 CORE HUMAN REALITY ATTRIBUTES // OVERCLOCK ENGINE
                </p>
              </div>
              <div className="text-xs font-mono text-cyan-400 font-bold">
                TOTAL POWER: {totalAttributeScore} PTS
              </div>
            </div>

            <div className="space-y-4">
              {attributes.map((attr) => {
                const theme = getAttrColor(attr.code)
                const currentTierBase = (attr.level - 1) * 10
                const progressInLevel = attr.value - currentTierBase

                return (
                  <div
                    key={attr.code}
                    className="p-4 rounded-lg bg-black/40 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-black/60 border border-slate-800">
                          {getAttrIcon(attr.code)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-slate-100">
                              {attr.code}
                            </span>
                            <span className="font-mono text-xs text-slate-400">
                              — {attr.fullName}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            TIER {attr.level} // OVERCLOCK VALUE: {attr.value} PTS
                          </div>
                        </div>
                      </div>

                      {/* Point Allocation Action */}
                      <div className="flex items-center gap-2">
                        {user.unassignedPoints > 0 && (
                          <button
                            onClick={() => allocateStatPoint(attr.code)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded bg-pink-500/20 hover:bg-pink-500 hover:text-white border border-pink-400 text-pink-300 text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(255,0,127,0.4)] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>INJECT +2 PTS</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress to next tier */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Tier {attr.level} Ascension</span>
                        <span className={theme.text}>{progressInLevel}/10 PTS</span>
                      </div>
                      <ProgressBar
                        current={progressInLevel}
                        max={10}
                        color={theme.bar}
                        height="sm"
                      />
                    </div>

                    <div className="text-xs text-slate-400 leading-relaxed pt-1">
                      {attr.description}
                    </div>

                    <div className={cn('text-xs font-mono font-semibold flex items-center gap-1.5', theme.text)}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ACTIVE PERK: {attr.perk}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  )
}
