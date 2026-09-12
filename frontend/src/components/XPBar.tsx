import React from 'react'
import { motion } from 'framer-motion'
import { Zap, ShieldAlert } from 'lucide-react'
import { cn } from '../lib/utils'

interface XPBarProps {
  level: number
  currentXP: number
  maxXP: number
  unassignedPoints?: number
  className?: string
}

export const XPBar: React.FC<XPBarProps> = ({
  level,
  currentXP,
  maxXP,
  unassignedPoints = 0,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((currentXP / (maxXP || 1)) * 100)))

  return (
    <div className={cn('relative w-full rounded-lg border border-cyan-500/30 bg-[#0b1020]/90 p-3.5 backdrop-blur-md', className)}>
      {/* Top row with level, badge, and XP ratio */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center h-8 px-2.5 bg-cyan-500/10 border border-cyan-400 text-cyan-300 font-orbitron text-xs font-bold tracking-wider rounded shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            <Zap className="w-3.5 h-3.5 mr-1 text-cyan-400 fill-cyan-400/30" />
            LVL {level}
          </div>
          <div className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <span className="text-slate-500">//</span>
            <span className="text-cyan-400/90 font-semibold tracking-wider">NEURAL PROGRESSION</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {unassignedPoints > 0 && (
            <div className="animate-pulse flex items-center gap-1 px-2 py-0.5 rounded bg-pink-500/20 border border-pink-500/60 text-pink-300 text-[11px] font-mono">
              <ShieldAlert className="w-3 h-3" />
              <span>+{unassignedPoints} STAT PT{unassignedPoints > 1 ? 'S' : ''} READY</span>
            </div>
          )}
          <div className="text-right font-mono text-xs">
            <span className="text-cyan-300 font-bold">{currentXP.toLocaleString()}</span>
            <span className="text-slate-500"> / </span>
            <span className="text-slate-400">{maxXP.toLocaleString()} XP</span>
            <span className="ml-2 text-pink-400 font-semibold">({percentage}%)</span>
          </div>
        </div>
      </div>

      {/* Main glowing bar */}
      <div className="relative h-3 w-full overflow-hidden rounded bg-[#070b14] border border-cyan-900/60">
        {/* Background grid markings */}
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-px h-full bg-cyan-400" />
          ))}
        </div>

        {/* Dynamic bar fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(0,240,255,0.8)] relative"
        >
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[1px]" />
        </motion.div>
      </div>

      <div className="flex justify-between items-center mt-1.5 text-[10px] font-mono text-slate-500">
        <span>[0% TIER BASE]</span>
        <span className="text-slate-400 tracking-wider">NEXT PROMOTION: {maxXP - currentXP} XP REMAINING</span>
        <span>[100% ASCENSION]</span>
      </div>
    </div>
  )
}
