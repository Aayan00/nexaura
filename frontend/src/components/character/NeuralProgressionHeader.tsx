import React from 'react'
import { motion } from 'framer-motion'
import { Zap, ShieldAlert } from 'lucide-react'

interface NeuralProgressionHeaderProps {
  level: number
  currentXP: number
  maxXP: number
  unassignedPoints: number
}

export const NeuralProgressionHeader: React.FC<NeuralProgressionHeaderProps> = ({
  level,
  currentXP,
  maxXP,
  unassignedPoints,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((currentXP / (maxXP || 1)) * 100)))
  const remainingXP = Math.max(0, maxXP - currentXP)
  const tierBasePercent = Math.max(0, Math.floor((percentage / 10)) * 10)

  return (
    <div className="w-full rounded-2xl bg-[#080B18]/90 border border-cyan-500/35 backdrop-blur-xl p-4 sm:p-5 shadow-[0_0_25px_rgba(0,229,255,0.12)]">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        {/* Left: Level Badge & Neural Progression text */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-400 text-cyan-300 font-mono text-xs sm:text-sm font-black tracking-wider shadow-[0_0_12px_rgba(0,229,255,0.4)]">
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/40" />
            <span>⚡ LVL {level}</span>
          </div>
          <span className="font-mono text-xs sm:text-sm font-bold text-slate-200 tracking-wider">
            // NEURAL PROGRESSION
          </span>
        </div>

        {/* Right: Unassigned Points badge, XP values, Percentage */}
        <div className="flex items-center gap-3">
          {unassignedPoints > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/20 border border-pink-500/70 text-pink-300 font-mono text-xs font-bold animate-pulse shadow-[0_0_12px_rgba(255,43,166,0.35)]">
              <ShieldAlert className="w-3.5 h-3.5 text-pink-400" />
              <span>+{unassignedPoints} STAT PT READY</span>
            </div>
          )}
          <div className="text-right font-mono text-xs sm:text-sm">
            <span className="text-cyan-300 font-bold">{currentXP.toLocaleString()}</span>
            <span className="text-slate-500 font-normal"> / </span>
            <span className="text-slate-300">{maxXP.toLocaleString()} XP</span>
            <span className="ml-2 text-pink-400 font-bold">({percentage}%)</span>
          </div>
        </div>
      </div>

      {/* Glowing Gradient XP Progress Bar */}
      <div className="relative h-3.5 w-full rounded-full bg-[#020611] p-0.5 border border-cyan-500/30 overflow-hidden shadow-inner">
        {/* Subtle grid markings inside bar */}
        <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-px h-full bg-cyan-400" />
          ))}
        </div>

        {/* Multi-stop glowing gradient fill: cyan -> blue -> purple -> magenta */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] via-[#159DFF] via-[#8B5CF6] to-[#FF2BA6] shadow-[0_0_16px_rgba(0,229,255,0.7)] relative"
        >
          {/* Leading edge light gleam */}
          <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/90 rounded-full blur-[1px]" />
        </motion.div>
      </div>

      {/* Bottom Labels */}
      <div className="flex justify-between items-center mt-2 font-mono text-[10px] sm:text-[11px] text-slate-500">
        <span className="tracking-wider">[{tierBasePercent < 10 ? `0${tierBasePercent}` : tierBasePercent}% TIER BASE]</span>
        <span className="text-slate-300 font-bold tracking-widest text-center">
          NEXT PROMOTION: {remainingXP.toLocaleString()} XP REMAINING
        </span>
        <span className="tracking-wider text-right">[100% ASCENSION]</span>
      </div>
    </div>
  )
}
