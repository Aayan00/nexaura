import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface ProgressBarProps {
  current: number
  max: number
  color?: 'cyan' | 'magenta' | 'purple' | 'amber' | 'green' | 'red'
  height?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  labelPrefix?: string
  showPercent?: boolean
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  color = 'cyan',
  height = 'md',
  showLabel = false,
  labelPrefix,
  showPercent = false,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((current / (max || 1)) * 100)))

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const colorStyles = {
    cyan: 'from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.6)]',
    magenta: 'from-pink-600 to-pink-400 shadow-[0_0_10px_rgba(255,0,127,0.6)]',
    purple: 'from-purple-600 to-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.6)]',
    amber: 'from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]',
    green: 'from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.6)]',
    red: 'from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.6)]',
  }

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || showPercent) && (
        <div className="mb-1 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>{labelPrefix ? `${labelPrefix} ${current}/${max}` : `${current}/${max}`}</span>
          {showPercent && <span className="text-cyan-300 font-semibold">{percentage}%</span>}
        </div>
      )}
      <div className={cn('relative w-full overflow-hidden rounded-sm bg-slate-900/90 border border-slate-800', heightStyles[height])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full bg-gradient-to-r transition-all', colorStyles[color])}
        />
        {/* Glow indicator at the tip */}
        {percentage > 0 && percentage < 100 && (
          <div
            style={{ left: `calc(${percentage}% - 4px)` }}
            className="absolute top-0 bottom-0 w-2 bg-white/80 blur-[2px]"
          />
        )}
      </div>
    </div>
  )
}
