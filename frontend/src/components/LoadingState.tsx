import React from 'react'
import { motion } from 'framer-motion'
import { Terminal } from 'lucide-react'

interface LoadingStateProps {
  message?: string
  subMessage?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'INITIALIZING NEURAL LINK...',
  subMessage = 'ESTABLISHING SECURE PROTOCOL // 0x7F9B',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
      {/* Cyber radar spinner */}
      <div className="relative flex items-center justify-center w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/40 animate-spin" />
        <div className="absolute inset-2 rounded-full border border-pink-500/50 animate-ping opacity-30" />
        <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#0a1024] border border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.5)]">
          <Terminal className="w-6 h-6 text-cyan-400 animate-pulse" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-1.5"
      >
        <h3 className="font-orbitron text-sm font-bold tracking-widest text-cyan-300">
          {message}
        </h3>
        <p className="font-mono text-xs text-slate-500 tracking-wider">
          {subMessage}
        </p>
      </motion.div>

      {/* Progress ticker dots */}
      <div className="flex gap-1.5 mt-4">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
          />
        ))}
      </div>
    </div>
  )
}
