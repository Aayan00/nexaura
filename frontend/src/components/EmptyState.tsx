import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { NeonButton } from './NeonButton'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'NO ACTIVE DIRECTIVES DETECTED',
  description = 'The system query returned zero records. Initialize new parameters or refresh scan filter.',
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-10 text-center rounded-lg border border-dashed border-slate-800 bg-[#080d1a]/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
        {icon || <AlertTriangle className="w-6 h-6 text-amber-400" />}
      </div>
      <h4 className="font-orbitron text-sm font-bold tracking-wider text-slate-200 mb-1">
        {title}
      </h4>
      <p className="max-w-md font-sans text-xs text-slate-400 leading-relaxed mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <NeonButton size="sm" variant="cyan" onClick={onAction}>
          {actionLabel}
        </NeonButton>
      )}
    </motion.div>
  )
}
