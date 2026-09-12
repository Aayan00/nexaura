import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Zap, Coins, AlertCircle, Info, X } from 'lucide-react'
import type { ToastMessage } from '../context/RPGContext'
import { cn } from '../lib/utils'

interface ToastNotificationProps {
  toast: ToastMessage | null
  onDismiss: () => void
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toast,
  onDismiss,
}) => {
  const getToastStyle = (type: ToastMessage['type']) => {
    switch (type) {
      case 'level':
        return {
          border: 'border-pink-500/70 shadow-[0_0_25px_rgba(255,0,127,0.5)]',
          bg: 'bg-[#150a1d]/95',
          icon: <Zap className="w-5 h-5 text-pink-400 fill-pink-400/30" />,
          titleColor: 'text-pink-300',
        }
      case 'reward':
      case 'success':
        return {
          border: 'border-cyan-400/70 shadow-[0_0_25px_rgba(0,240,255,0.4)]',
          bg: 'bg-[#081220]/95',
          icon: <CheckCircle2 className="w-5 h-5 text-cyan-400" />,
          titleColor: 'text-cyan-300',
        }
      case 'error':
        return {
          border: 'border-red-500/70 shadow-[0_0_25px_rgba(239,68,68,0.4)]',
          bg: 'bg-[#1c0a0c]/95',
          icon: <AlertCircle className="w-5 h-5 text-red-400" />,
          titleColor: 'text-red-300',
        }
      case 'info':
      default:
        return {
          border: 'border-purple-500/70 shadow-[0_0_25px_rgba(168,85,247,0.4)]',
          bg: 'bg-[#110a1f]/95',
          icon: <Info className="w-5 h-5 text-purple-400" />,
          titleColor: 'text-purple-300',
        }
    }
  }

  return (
    <div className="fixed top-5 right-5 z-50 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
              'pointer-events-auto relative overflow-hidden rounded-lg border p-4 backdrop-blur-xl',
              getToastStyle(toast.type).border,
              getToastStyle(toast.type).bg
            )}
          >
            {/* Top scanning line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {getToastStyle(toast.type).icon}
              </div>

              <div className="flex-1 min-w-0">
                <h5
                  className={cn(
                    'font-orbitron text-xs font-bold tracking-wider uppercase',
                    getToastStyle(toast.type).titleColor
                  )}
                >
                  {toast.title}
                </h5>
                <p className="mt-1 text-xs font-sans text-slate-300 leading-relaxed">
                  {toast.message}
                </p>

                {/* Reward bonuses */}
                {(toast.xp || toast.credits) && (
                  <div className="flex items-center gap-2 mt-2 font-mono text-xs">
                    {toast.xp && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        +{toast.xp} XP
                      </span>
                    )}
                    {toast.credits && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400 text-amber-300 font-bold">
                        <Coins className="w-3 h-3 text-amber-400" />
                        {toast.credits > 0 ? `+${toast.credits}` : toast.credits} ₢
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={onDismiss}
                className="shrink-0 p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
