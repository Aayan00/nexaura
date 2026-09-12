import React from 'react'
import { motion } from 'framer-motion'
import { Check, Clock, Coins, Sparkles, Trash2, Brain, Dumbbell, Zap, Heart, Shield } from 'lucide-react'
import type { Mission, AttributeType, MissionRank } from '../types/rpg'
import { cn } from '../lib/utils'

export interface MissionCardProps {
  mission: Mission
  onComplete: (id: string | number) => void
  onDelete?: (id: string | number) => void
  className?: string
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onComplete,
  onDelete,
  className,
}) => {
  const getRankBadge = (rank: MissionRank) => {
    switch (rank) {
      case 'S':
        return 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(250,204,21,0.5)]'
      case 'A':
        return 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_12px_rgba(255,0,127,0.5)]'
      case 'B':
        return 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
      case 'C':
        return 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.5)]'
      case 'D':
        return 'bg-slate-700/40 border-slate-600 text-slate-300'
    }
  }

  const getAttrIcon = (attr: AttributeType) => {
    switch (attr) {
      case 'INT':
        return <Brain className="w-3.5 h-3.5 text-cyan-400" />
      case 'STR':
        return <Dumbbell className="w-3.5 h-3.5 text-red-400" />
      case 'DEX':
        return <Zap className="w-3.5 h-3.5 text-emerald-400" />
      case 'VIT':
        return <Heart className="w-3.5 h-3.5 text-pink-400" />
      case 'DIS':
        return <Shield className="w-3.5 h-3.5 text-purple-400" />
    }
  }

  const getAttrBadgeColor = (attr: AttributeType) => {
    switch (attr) {
      case 'INT':
        return 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10'
      case 'STR':
        return 'border-red-500/40 text-red-300 bg-red-500/10'
      case 'DEX':
        return 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
      case 'VIT':
        return 'border-pink-500/40 text-pink-300 bg-pink-500/10'
      case 'DIS':
        return 'border-purple-500/40 text-purple-300 bg-purple-500/10'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: mission.completed ? 1 : 1.01 }}
      className={cn(
        'group relative rounded-lg border p-4 backdrop-blur-md transition-all duration-300',
        mission.completed
          ? 'border-emerald-500/30 bg-[#061510]/50 opacity-70'
          : 'border-slate-800 bg-[#0a0f20]/80 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]',
        className
      )}
    >
      {/* Top Status & Badges Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          {/* Rank Badge */}
          <span
            className={cn(
              'flex items-center justify-center w-6 h-6 rounded border font-mono text-xs font-black',
              getRankBadge(mission.rank)
            )}
          >
            {mission.rank}
          </span>

          {/* Category Tag */}
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-300">
            {mission.category === 'daily'
              ? 'DAILY PROTOCOL'
              : mission.category === 'main'
              ? 'PRIMARY DIRECTIVE'
              : 'BOUNTY TARGET'}
          </span>

          {/* Attribute Tag */}
          <span
            className={cn(
              'flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border',
              getAttrBadgeColor(mission.attribute)
            )}
          >
            {getAttrIcon(mission.attribute)}
            <span>+{mission.statPoints} {mission.attribute}</span>
          </span>
        </div>

        {/* Due date or completed timestamp */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{mission.completed ? `DONE: ${mission.completedAt || 'TODAY'}` : mission.dueDate || 'ACTIVE'}</span>
        </div>
      </div>

      {/* Main Quest Content */}
      <div className="mb-3">
        <h4
          className={cn(
            'font-mono text-base font-bold tracking-wide transition-colors',
            mission.completed
              ? 'text-emerald-400/80 line-through'
              : 'text-slate-100 group-hover:text-cyan-300'
          )}
        >
          {mission.title}
        </h4>
        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
          {mission.description}
        </p>
      </div>

      {/* Footer Rewards & Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        {/* Rewards pills */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>+{mission.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <Coins className="w-3 h-3 text-amber-400" />
            <span>+{mission.creditReward} ₢</span>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          {mission.isCustom && onDelete && !mission.completed && (
            <button
              onClick={() => onDelete(mission.id)}
              className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Purge Mission"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onComplete(mission.id)}
            disabled={mission.completed}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer',
              mission.completed
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 cursor-default'
                : 'bg-cyan-500/15 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.6)]'
            )}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{mission.completed ? 'COMPLETED' : 'COMPLETE PROTOCOL'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
