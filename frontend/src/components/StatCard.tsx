import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Dumbbell, Zap, Heart, Shield, Plus } from 'lucide-react'
import type { AttributeData } from '../types/rpg'
import { ProgressBar } from './ProgressBar'
import { cn } from '../lib/utils'

interface StatCardProps {
  attribute: AttributeData
  unassignedPoints?: number
  onAllocate?: () => void
  compact?: boolean
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  attribute,
  unassignedPoints = 0,
  onAllocate,
  compact = false,
  className,
}) => {
  const getIcon = (code: string) => {
    switch (code) {
      case 'INT':
        return <Brain className="w-5 h-5" />
      case 'STR':
        return <Dumbbell className="w-5 h-5" />
      case 'DEX':
        return <Zap className="w-5 h-5" />
      case 'VIT':
        return <Heart className="w-5 h-5" />
      case 'DIS':
        return <Shield className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
    }
  }

  const getTheme = (code: string) => {
    switch (code) {
      case 'INT':
        return {
          border: 'border-cyan-500/30 hover:border-cyan-400',
          bg: 'bg-[#080e1e]/80',
          glow: 'hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]',
          text: 'text-cyan-400',
          badge: 'bg-cyan-500/10 border-cyan-400/40 text-cyan-300',
          barColor: 'cyan' as const,
        }
      case 'STR':
        return {
          border: 'border-red-500/30 hover:border-red-400',
          bg: 'bg-[#1a0a0d]/80',
          glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]',
          text: 'text-red-400',
          badge: 'bg-red-500/10 border-red-400/40 text-red-300',
          barColor: 'red' as const,
        }
      case 'DEX':
        return {
          border: 'border-emerald-500/30 hover:border-emerald-400',
          bg: 'bg-[#091712]/80',
          glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/10 border-emerald-400/40 text-emerald-300',
          barColor: 'green' as const,
        }
      case 'VIT':
        return {
          border: 'border-pink-500/30 hover:border-pink-400',
          bg: 'bg-[#180914]/80',
          glow: 'hover:shadow-[0_0_20px_rgba(255,0,127,0.25)]',
          text: 'text-pink-400',
          badge: 'bg-pink-500/10 border-pink-400/40 text-pink-300',
          barColor: 'magenta' as const,
        }
      case 'DIS':
        return {
          border: 'border-purple-500/30 hover:border-purple-400',
          bg: 'bg-[#130b21]/80',
          glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]',
          text: 'text-purple-400',
          badge: 'bg-purple-500/10 border-purple-400/40 text-purple-300',
          barColor: 'purple' as const,
        }
      default:
        return {
          border: 'border-cyan-500/30',
          bg: 'bg-[#080e1e]/80',
          glow: '',
          text: 'text-cyan-400',
          badge: 'bg-cyan-500/10 border-cyan-400/40 text-cyan-300',
          barColor: 'cyan' as const,
        }
    }
  }

  const theme = getTheme(attribute.code)
  const currentTierBase = (attribute.level - 1) * 10
  const pointsInCurrentLevel = attribute.value - currentTierBase
  const maxInLevel = 10

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        'relative rounded-lg border p-4 backdrop-blur-md transition-all duration-300',
        theme.border,
        theme.bg,
        theme.glow,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn('p-2 rounded border', theme.badge)}>
            {getIcon(attribute.code)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron text-sm font-bold tracking-wider text-white">
                {attribute.code}
              </span>
              <span className="text-xs font-rajdhani text-slate-400">
                {attribute.name}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              TIER {attribute.level} // OVERLOAD {attribute.value} PTS
            </div>
          </div>
        </div>

        {/* Allocate Button if available */}
        {unassignedPoints > 0 && onAllocate && (
          <button
            onClick={onAllocate}
            title="Allocate +2 Stat Points"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-400 hover:text-black text-cyan-300 border border-cyan-400 text-xs font-mono transition-all shadow-[0_0_10px_rgba(0,240,255,0.4)] cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>+2</span>
          </button>
        )}
      </div>

      {/* Progress Bar within level tier */}
      <div className="space-y-1 mb-2.5">
        <div className="flex justify-between text-[11px] font-mono">
          <span className="text-slate-400">Next Tier Progress</span>
          <span className={theme.text}>{pointsInCurrentLevel}/{maxInLevel}</span>
        </div>
        <ProgressBar
          current={pointsInCurrentLevel}
          max={maxInLevel}
          color={theme.barColor}
          height="sm"
        />
      </div>

      {!compact && (
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 line-clamp-1 mb-1">
            {attribute.description}
          </div>
          <div className={cn('text-[11px] font-mono font-medium flex items-center gap-1', theme.text)}>
            <span className="text-slate-500">&gt;</span> {attribute.perk}
          </div>
        </div>
      )}
    </motion.div>
  )
}
