import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Terminal, Shield, Lock, ArrowRight, UserCheck, Cpu } from 'lucide-react'
import { GlassPanel } from '../components/GlassPanel'
import { NeonButton } from '../components/NeonButton'
import { useRPG } from '../context/RPGContext'

export const LoginPage: React.FC = () => {
  const { login } = useRPG()
  const navigate = useNavigate()
  const [username, setUsername] = useState('KAIRO_NET')
  const [passkey, setPasskey] = useState('••••••••••••')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)
    setTimeout(() => {
      login(username)
      navigate('/dashboard')
    }, 600)
  }

  const handleQuickDemo = () => {
    setIsLoading(true)
    setTimeout(() => {
      login('V_CYPHER')
      navigate('/dashboard')
    }, 400)
  }

  return (
    <div className="min-h-screen bg-[#050811] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background grids & glows */}
      <div className="absolute inset-0 cyber-grid-bg opacity-35 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        <GlassPanel variant="cyan" glow className="p-6 sm:p-8">
          {/* Header Brand */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-400 text-cyan-400 mb-3 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <Cpu className="w-8 h-8 animate-pulse" />
            </div>
            <h1 className="font-orbitron text-2xl font-black tracking-widest text-slate-100 uppercase">
              NEXAURA<span className="text-cyan-400">.EXE</span>
            </h1>
            <p className="font-mono text-xs text-pink-400 font-bold uppercase tracking-widest mt-0.5">
              Upgrade Your Reality.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0b1428] border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>// NEURAL_AUTH_GATEWAY: 0x89</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                OPERATIVE CALLSIGN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Shield className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ENTER CALLSIGN..."
                  className="w-full pl-9 pr-4 py-2.5 bg-[#080e1c] border border-cyan-500/30 rounded text-sm font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                CYBERNETIC PASSKEY
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#080e1c] border border-cyan-500/30 rounded text-sm font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 space-y-2.5">
              <NeonButton
                type="submit"
                variant="cyan"
                size="md"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full"
              >
                INITIALIZE SYNC
              </NeonButton>

              <NeonButton
                type="button"
                variant="purple"
                size="sm"
                onClick={handleQuickDemo}
                leftIcon={<UserCheck className="w-4 h-4" />}
                className="w-full"
              >
                QUICK DEMO ACCESS (V_CYPHER)
              </NeonButton>
            </div>
          </form>

          {/* Footer Register Link */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs font-mono text-slate-400">
            <span>UNREGISTERED OPERATIVE? </span>
            <Link
              to="/signup"
              className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-4 ml-1"
            >
              ENROLL IN SYSTEM &gt;
            </Link>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  )
}
