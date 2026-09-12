import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Terminal } from 'lucide-react'
import { NeuralVisionLab } from '../components/focus/NeuralVisionLab'
import { LandingNavbar } from '../components/landing/LandingNavbar'
import { LandingFooter } from '../components/landing/LandingFooter'
import { useRPG } from '../context/RPGContext'

export const VisionLabPage: React.FC = () => {
  const { isAuthenticated } = useRPG()

  return (
    <div className="min-h-screen bg-[#02050f] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <LandingNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <Link
            to={isAuthenticated ? '/focus' : '/'}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isAuthenticated ? 'RETURN TO FOCUS CORE' : 'RETURN TO HOME'}</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a1428] border border-cyan-500/30 text-[11px] font-mono text-cyan-300 uppercase tracking-widest">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>PUBLIC NEURAL LAB ACCESSIBLE</span>
          </div>
        </div>

        {/* Section 07: Neural Vision Lab — Ambiguous Rotation Experiment */}
        <NeuralVisionLab />
      </main>

      <LandingFooter />
    </div>
  )
}

export default VisionLabPage
