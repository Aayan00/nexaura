import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../lib/utils'

interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  variant?: 'cyan' | 'magenta' | 'purple' | 'amber' | 'default'
  glow?: boolean
  scanlines?: boolean
  cornerBrackets?: boolean
  className?: string
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  variant = 'cyan',
  glow = false,
  scanlines = false,
  cornerBrackets = true,
  className,
  ...motionProps
}) => {
  const variantStyles = {
    cyan: 'border-cyan-500/25 bg-[#0a0e1a]/80 hover:border-cyan-400/45 shadow-[0_4px_24px_rgba(0,0,0,0.6)]',
    magenta: 'border-pink-500/25 bg-[#0f0a1a]/80 hover:border-pink-400/45 shadow-[0_4px_24px_rgba(0,0,0,0.6)]',
    purple: 'border-purple-500/25 bg-[#0d0a1c]/80 hover:border-purple-400/45 shadow-[0_4px_24px_rgba(0,0,0,0.6)]',
    amber: 'border-amber-500/25 bg-[#140e08]/80 hover:border-amber-400/45 shadow-[0_4px_24px_rgba(0,0,0,0.6)]',
    default: 'border-slate-800 bg-[#080d1a]/80 hover:border-slate-700 shadow-[0_4px_24px_rgba(0,0,0,0.6)]',
  }

  const glowStyles = {
    cyan: 'neon-glow-cyan',
    magenta: 'neon-glow-magenta',
    purple: 'neon-glow-purple',
    amber: 'neon-glow-amber',
    default: '',
  }

  const bracketColor = {
    cyan: 'border-cyan-400',
    magenta: 'border-pink-400',
    purple: 'border-purple-400',
    amber: 'border-amber-400',
    default: 'border-slate-500',
  }

  return (
    <motion.div
      className={cn(
        'relative rounded-lg border backdrop-blur-md transition-all duration-300',
        variantStyles[variant],
        glow && glowStyles[variant],
        className
      )}
      {...motionProps}
    >
      {/* Optional Corner HUD Brackets */}
      {cornerBrackets && (
        <>
          <div
            aria-hidden="true"
            className={cn('absolute -top-px -left-px h-2.5 w-2.5 border-t-2 border-l-2 pointer-events-none', bracketColor[variant])}
          />
          <div
            aria-hidden="true"
            className={cn('absolute -top-px -right-px h-2.5 w-2.5 border-t-2 border-r-2 pointer-events-none', bracketColor[variant])}
          />
          <div
            aria-hidden="true"
            className={cn('absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 pointer-events-none', bracketColor[variant])}
          />
          <div
            aria-hidden="true"
            className={cn('absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 pointer-events-none', bracketColor[variant])}
          />
        </>
      )}

      {/* Optional Scanlines Texture */}
      {scanlines && (
        <div
          aria-hidden="true"
          className="cyber-scanlines absolute inset-0 rounded-lg pointer-events-none opacity-40"
        />
      )}

      {children}
    </motion.div>
  )
}
