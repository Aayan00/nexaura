import React from 'react'
import { Link } from 'react-router-dom'
import { Cpu, Radio } from 'lucide-react'

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#02040a] border-t border-slate-900 py-12 text-slate-400 font-mono text-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="font-orbitron text-base font-black tracking-widest text-slate-100 uppercase">
                NEXAURA<span className="text-cyan-400">.EXE</span>
              </span>
              <p className="text-[9px] tracking-widest text-pink-400 uppercase font-semibold">
                UPGRADE YOUR REALITY.
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <a href="#hero" className="hover:text-cyan-400 transition-colors uppercase tracking-wider">
              Home
            </a>
            <a href="#features" className="hover:text-cyan-400 transition-colors uppercase tracking-wider">
              Features
            </a>
            <a href="#world" className="hover:text-cyan-400 transition-colors uppercase tracking-wider">
              World
            </a>
            <a href="#about" className="hover:text-cyan-400 transition-colors uppercase tracking-wider">
              About
            </a>
            <Link to="/login" className="hover:text-cyan-400 transition-colors uppercase tracking-wider text-cyan-300">
              Login
            </Link>
            <Link to="/register" className="hover:text-cyan-400 transition-colors uppercase tracking-wider text-pink-400 font-bold">
              Register
            </Link>
          </div>

          {/* System Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070e20] border border-cyan-500/30 text-[10px] text-emerald-400">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>SYS: ONLINE // V4.2.0_3D</span>
          </div>
        </div>

        {/* Copyright and Legal Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} NEXAURA.EXE. ALL RIGHTS RESERVED. OPERATIVE DATA IS ENCRYPTED.</p>
          <div className="flex items-center gap-4">
            <span>NEURAL ENCRYPTION PROTOCOL 0x89</span>
            <span className="text-slate-700">•</span>
            <span>THREE.JS R3F ENGINE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter
