import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Terminal, Shield, Lock, Mail, User, ArrowRight, AlertTriangle } from 'lucide-react'
import { GlassPanel } from '../components/GlassPanel'
import { NeonButton } from '../components/NeonButton'
import { api } from '../lib/api'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): string | null => {
    if (!username.trim()) return 'Operative callsign is required.'
    if (username.trim().length < 3) return 'Callsign must be at least 3 characters.'
    if (!email.trim()) return 'Neural comms email address is required.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) return 'Please provide a valid neural email address.'
    if (!password) return 'Security passkey is required.'
    if (password.length < 8) return 'Passkey must be at least 8 characters long.'
    if (password !== confirmPassword) return 'Passkey and confirmation passkey do not match.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    try {
      const res = await api.auth.register({
        username: username.trim(),
        email: email.trim(),
        password,
      })

      if (res.success) {
        navigate('/login', {
          state: {
            message: 'Account created successfully. Please log in.',
            username: username.trim(),
          },
        })
      } else {
        setError(res.message || 'Registration failed. Please verify credentials.')
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Username or email may already be registered.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050811] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Cyberpunk Glows */}
      <div className="absolute inset-0 cyber-grid-bg opacity-35 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Register Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10 my-8"
      >
        <GlassPanel variant="cyan" glow className="p-6 sm:p-8">
          {/* Header Brand */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-400 text-cyan-400 mb-3 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <Shield className="w-8 h-8 animate-pulse" />
            </div>
            <h1 className="font-orbitron text-2xl font-black tracking-widest text-slate-100 uppercase">
              NEXAURA<span className="text-cyan-400">.EXE</span>
            </h1>
            <p className="font-mono text-xs text-pink-400 font-bold uppercase tracking-widest mt-0.5">
              Upgrade Your Reality.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0b1428] border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>// OPERATIVE_ENROLLMENT_PROTOCOL</span>
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded bg-red-950/40 border border-red-500/60 text-red-300 text-xs font-mono flex items-start gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                OPERATIVE CALLSIGN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. CYPHER_09"
                  disabled={isLoading}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#080e1c] border border-cyan-500/30 rounded text-sm font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all disabled:opacity-50"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">Min 3 characters. Unique callsign.</span>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                NEURAL NETWORK EMAIL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@nexaura.net"
                  disabled={isLoading}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#080e1c] border border-cyan-500/30 rounded text-sm font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Field */}
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#080e1c] border border-cyan-500/30 rounded text-sm font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all disabled:opacity-50"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">Min 8 characters. Bcrypt hashed.</span>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                CONFIRM PASSKEY
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#080e1c] border border-cyan-500/30 rounded text-sm font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <NeonButton
                type="submit"
                variant="cyan"
                size="md"
                isLoading={isLoading}
                disabled={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full font-bold uppercase tracking-wider"
              >
                {isLoading ? 'ENCRYPTING CREDENTIALS...' : 'ENROLL OPERATIVE'}
              </NeonButton>
            </div>
          </form>

          {/* Footer Login Link */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs font-mono text-slate-400">
            <span>ALREADY ENROLLED IN SYSTEM? </span>
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-4 ml-1"
            >
              INITIALIZE LOGIN &gt;
            </Link>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  )
}

export default RegisterPage
