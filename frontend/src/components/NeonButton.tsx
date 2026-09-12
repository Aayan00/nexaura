import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { soundFx } from '../lib/sound'
import { cn } from '../lib/utils'

export interface NeonButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode
  variant?: 'cyan' | 'magenta' | 'purple' | 'amber' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  cyberCut?: boolean
  playSound?: boolean
  glow?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  className?: string
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  cyberCut = true,
  playSound = true,
  glow = true,
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  onClick,
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-mono tracking-wider',
    md: 'px-4 py-2.5 text-sm font-rajdhani font-semibold tracking-wide',
    lg: 'px-6 py-3.5 text-base font-orbitron font-bold tracking-widest',
  }

  const variantStyles = {
    cyan: cn(
      'bg-cyan-500/10 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400 hover:text-black hover:border-cyan-300',
      glow && 'hover:shadow-[0_0_20px_rgba(0,240,255,0.7)]'
    ),
    magenta: cn(
      'bg-pink-500/10 border-pink-400/50 text-pink-300 hover:bg-pink-500 hover:text-black hover:border-pink-300',
      glow && 'hover:shadow-[0_0_20px_rgba(255,0,127,0.7)]'
    ),
    purple: cn(
      'bg-purple-500/10 border-purple-400/50 text-purple-300 hover:bg-purple-500 hover:text-white hover:border-purple-300',
      glow && 'hover:shadow-[0_0_20px_rgba(168,85,247,0.7)]'
    ),
    amber: cn(
      'bg-amber-500/10 border-amber-400/50 text-amber-300 hover:bg-amber-400 hover:text-black hover:border-amber-300',
      glow && 'hover:shadow-[0_0_20px_rgba(250,204,21,0.7)]'
    ),
    danger: cn(
      'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-400',
      glow && 'hover:shadow-[0_0_20px_rgba(239,68,68,0.7)]'
    ),
    ghost: 'bg-transparent border-slate-700/60 text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-slate-500',
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (playSound) soundFx.playClick()
    if (onClick) onClick(e)
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 border uppercase select-none transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        sizeStyles[size],
        variantStyles[variant],
        cyberCut && 'cyber-clip-tr',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </motion.button>
  )
}
