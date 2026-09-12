import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface PageHeaderProps {
  sectionCode: string
  title: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  sectionCode,
  title,
  subtitle,
  actions,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-cyan-500/20 mb-6', className)}
    >
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <span className="text-slate-600">//</span>
          <span className="tracking-widest uppercase font-semibold">{sectionCode}</span>
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <h1 className="font-orbitron text-2xl md:text-3xl font-black tracking-wider text-slate-100 uppercase">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-xs md:text-sm font-sans text-slate-400 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
