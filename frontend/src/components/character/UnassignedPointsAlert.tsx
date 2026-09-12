import React from 'react'
import { ShieldAlert } from 'lucide-react'

interface UnassignedPointsAlertProps {
  unassignedPoints: number
}

export const UnassignedPointsAlert: React.FC<UnassignedPointsAlertProps> = ({
  unassignedPoints,
}) => {
  if (unassignedPoints <= 0) return null

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-pink-950/70 via-purple-950/50 to-[#080B18]/90 border border-pink-500/70 text-pink-200 shadow-[0_0_20px_rgba(255,43,166,0.25)] transition-all">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-pink-500/20 border border-pink-400 text-pink-400 shrink-0">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="font-mono text-xs sm:text-sm font-black tracking-wider text-pink-300 uppercase">
            UNASSIGNED NEURAL STAT POINTS: {unassignedPoints}
          </h4>
          <p className="text-xs font-mono text-slate-300 mt-0.5">
            Inject points into any attribute below to unlock exponential multipliers.
          </p>
        </div>
      </div>
    </div>
  )
}
