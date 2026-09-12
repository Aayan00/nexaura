import React from 'react'
import {
  Brain,
  Dumbbell,
  Zap,
  Heart,
  Shield,
  Plus,
  Sparkles,
} from 'lucide-react'
import type { AttributeData, AttributeType } from '../../types/rpg'
import { sound } from '../../lib/sound'

interface NeuralAttributeMatrixProps {
  attributes: AttributeData[]
  unassignedPoints: number
  onAllocateStat: (code: AttributeType) => void
}

export const NeuralAttributeMatrix: React.FC<NeuralAttributeMatrixProps> = ({
  attributes,
  unassignedPoints,
  onAllocateStat,
}) => {
  const totalPower = attributes.reduce((acc, curr) => acc + curr.value, 0)

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

  const getThemeStyles = (code: AttributeType) => {
    switch (code) {
      case 'INT':
        return {
          border: 'border-cyan-500/30 hover:border-cyan-400',
          text: 'text-cyan-400',
          barGrad: 'from-cyan-500 to-blue-500',
          glow: 'rgba(0, 229, 255, 0.4)',
        }
      case 'STR':
        return {
          border: 'border-red-500/30 hover:border-red-400',
          text: 'text-red-400',
          barGrad: 'from-red-500 to-amber-500',
          glow: 'rgba(239, 68, 68, 0.4)',
        }
      case 'DEX':
        return {
          border: 'border-emerald-500/30 hover:border-emerald-400',
          text: 'text-emerald-400',
          barGrad: 'from-emerald-500 to-teal-400',
          glow: 'rgba(16, 185, 129, 0.4)',
        }
      case 'VIT':
        return {
          border: 'border-pink-500/30 hover:border-pink-400',
          text: 'text-pink-400',
          barGrad: 'from-pink-500 to-rose-500',
          glow: 'rgba(255, 43, 166, 0.4)',
        }
      case 'DIS':
        return {
          border: 'border-purple-500/30 hover:border-purple-400',
          text: 'text-purple-400',
          barGrad: 'from-purple-500 to-indigo-500',
          glow: 'rgba(139, 92, 246, 0.4)',
        }
    }
  }

  return (
    <div className="rounded-2xl bg-[#080B18]/90 border border-cyan-500/30 backdrop-blur-xl p-5 sm:p-6 shadow-[0_0_25px_rgba(0,229,255,0.1)] space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-cyan-500/20">
        <div>
          <h3 className="font-mono text-base font-bold tracking-wider text-slate-100 uppercase flex items-center gap-2">
            NEURAL ATTRIBUTE MATRIX
          </h3>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            5 CORE HUMAN REALITY ATTRIBUTES // OVERCLOCK ENGINE
          </p>
        </div>
        <div className="text-xs sm:text-sm font-mono text-cyan-400 font-black tracking-wider px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          TOTAL POWER: {totalPower} PTS
        </div>
      </div>

      {/* 5 Attribute Rows */}
      <div className="space-y-3">
        {attributes.map((attr) => {
          const theme = getThemeStyles(attr.code)
          const currentTierBase = (attr.level - 1) * 10
          const progressInLevel = Math.max(0, attr.value - currentTierBase)
          const percent = Math.min(100, Math.round((progressInLevel / 10) * 100))

          return (
            <div
              key={attr.code}
              className={`p-3.5 sm:p-4 rounded-xl bg-[#050816]/75 border ${theme.border} transition-all duration-200 hover:bg-[#090e22] space-y-2.5 group`}
            >
              {/* Row Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#020611] border border-slate-800 group-hover:border-cyan-500/40 transition-colors">
                    {getAttrIcon(attr.code)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-100">
                        {attr.name.toUpperCase()}
                      </span>
                      <span className="font-mono text-xs text-slate-400 hidden sm:inline">
                        — {attr.fullName}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                      TIER {attr.level} // OVERCLOCK VALUE: <span className="text-slate-200 font-bold">{attr.value} PTS</span>
                    </div>
                  </div>
                </div>

                {/* Point Allocation Action */}
                <div>
                  {unassignedPoints > 0 ? (
                    <button
                      onClick={() => {
                        sound.playClick()
                        onAllocateStat(attr.code)
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500 hover:text-white border border-pink-400 text-pink-300 text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(255,43,166,0.35)] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>INJECT +1 PT</span>
                    </button>
                  ) : (
                    <div className="px-2.5 py-1 rounded bg-[#020611] border border-slate-800 text-[10px] font-mono text-slate-500">
                      CALIBRATED
                    </div>
                  )}
                </div>
              </div>

              {/* Progress to next tier */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Tier {attr.level} Ascension Progress</span>
                  <span className={theme.text}>{progressInLevel}/10 PTS</span>
                </div>
                <div className="relative h-2 w-full rounded-full bg-[#020611] border border-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${theme.barGrad} shadow-[0_0_8px_${theme.glow}] transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Description & Active Perk */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-400 pt-0.5">
                <span className="line-clamp-1">{attr.description}</span>
                <span className={`font-mono font-semibold flex items-center gap-1 shrink-0 ${theme.text}`}>
                  <Sparkles className="w-3 h-3" />
                  PERK: {attr.perk}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
