import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Terminal, Shield, Zap, Sparkles } from 'lucide-react'
import { GlassPanel } from '../GlassPanel'
import { NeonButton } from '../NeonButton'

export const CallToActionSection: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section id="about" className="relative py-24 bg-[#01040a] text-slate-100 overflow-hidden border-t border-slate-900">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-cyan-500/10 via-purple-600/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <GlassPanel variant="cyan" glow className="p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
          {/* Subtle grid pattern inside card */}
          <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />

          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a1428] border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-6">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>// INITIALIZE OPERATIVE SYNAPSE</span>
          </div>

          {/* Big Headline */}
          <h2 className="font-orbitron text-3xl sm:text-5xl lg:text-6xl font-black tracking-wider text-slate-100 uppercase leading-tight mb-4">
            READY TO <span className="text-cyan-400">UPGRADE</span> YOUR REALITY?
          </h2>

          <p className="max-w-2xl mx-auto font-mono text-xs sm:text-sm text-slate-400 leading-relaxed mb-8">
            Stop letting daily momentum slip away into disorganized tabs and forgotten checklists. Join the cybernetic productivity operating system built for real-world growth.
          </p>

          {/* Call-to-action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <NeonButton
              variant="cyan"
              size="lg"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold uppercase tracking-wider"
            >
              CREATE ACCOUNT
            </NeonButton>

            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-6 py-3 rounded border border-cyan-500/30 hover:border-cyan-400 bg-[#081226]/80 hover:bg-cyan-500/15 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              ENTER NEXAURA
            </button>
          </div>

          {/* Footer Telemetry Chips */}
          <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              SESSION ENCRYPTION: SHA-256
            </span>
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              MYSQL PERSISTENCE: 100% ISOLATED
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              STATUS: OPERATIONAL
            </span>
          </div>
        </GlassPanel>
      </div>
    </section>
  )
}

export default CallToActionSection
