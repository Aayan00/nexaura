import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cpu, Brain, Dumbbell, Zap, Heart, Shield, ArrowRight } from 'lucide-react'
import { GlassPanel } from '../components/GlassPanel'
import { NeonButton } from '../components/NeonButton'
import { useRPG } from '../context/RPGContext'
import type { AttributeType } from '../types/rpg'
import { cn } from '../lib/utils'

interface Archetype {
  id: string
  name: string
  stat: AttributeType
  statLabel: string
  description: string
  icon: React.ReactNode
  color: string
}

export const SignupPage: React.FC = () => {
  const { signup } = useRPG()
  const navigate = useNavigate()
  const [username, setUsername] = useState('NOVA_PRIME')
  const [selectedArchetype, setSelectedArchetype] = useState<string>('netrunner')
  const [isLoading, setIsLoading] = useState(false)

  const archetypes: Archetype[] = [
    {
      id: 'netrunner',
      name: 'Neural Netrunner',
      stat: 'INT',
      statLabel: 'Intellect Focus (+10 INT)',
      description: 'Master of high-complexity codebases, data analytics, and deep mental focus.',
      icon: <Brain className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/50 hover:border-cyan-400',
    },
    {
      id: 'samurai',
      name: 'Street Samurai',
      stat: 'STR',
      statLabel: 'Strength Focus (+10 STR)',
      description: 'Physical powerhouse specializing in heavy strength conditioning and endurance.',
      icon: <Dumbbell className="w-5 h-5 text-red-400" />,
      color: 'border-red-500/50 hover:border-red-400',
    },
    {
      id: 'ghost',
      name: 'Ghost Operative',
      stat: 'DEX',
      statLabel: 'Dexterity Focus (+10 DEX)',
      description: 'Ultra-agile executor with fast habit stacking and lightning task execution.',
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/50 hover:border-emerald-400',
    },
    {
      id: 'biohacker',
      name: 'Bio-Hacker',
      stat: 'VIT',
      statLabel: 'Vitality Focus (+10 VIT)',
      description: 'Optimizer of sleep circadian rhythm, hydration matrix, and biometric resilience.',
      icon: <Heart className="w-5 h-5 text-pink-400" />,
      color: 'border-pink-500/50 hover:border-pink-400',
    },
    {
      id: 'fixer',
      name: 'Corporate Fixer',
      stat: 'DIS',
      statLabel: 'Discipline Focus (+10 DIS)',
      description: 'Relentless protocol enforcer with titanium willpower and unbreakable streak discipline.',
      icon: <Shield className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/50 hover:border-purple-400',
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    const chosen = archetypes.find((a) => a.id === selectedArchetype) || archetypes[0]
    setIsLoading(true)

    setTimeout(() => {
      signup(username, chosen.name, chosen.stat)
      navigate('/dashboard')
    }, 700)
  }

  return (
    <div className="min-h-screen bg-[#050811] flex items-center justify-center p-4 py-8 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-35 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-xl z-10"
      >
        <GlassPanel variant="cyan" glow className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-400 text-pink-400 mb-2.5 shadow-[0_0_20px_rgba(255,0,127,0.4)]">
              <Cpu className="w-7 h-7 animate-pulse" />
            </div>
            <h1 className="font-orbitron text-2xl font-black tracking-widest text-slate-100 uppercase">
              OPERATIVE ENROLLMENT
            </h1>
            <p className="font-mono text-xs text-cyan-400 font-semibold uppercase tracking-widest mt-0.5">
              // INITIALIZE CHARACTER PROFILE // NEXAURA.EXE
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Callsign Input */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                OPERATIVE CALLSIGN (USERNAME)
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ENTER CALLSIGN..."
                className="w-full px-4 py-2.5 bg-[#080e1c] border border-cyan-500/30 rounded text-sm font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all uppercase"
              />
            </div>

            {/* Archetype Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  SELECT OPERATIVE CLASS &amp; CORE FOCUS
                </label>
                <span className="text-[10px] font-mono text-pink-400 font-bold">
                  +500 ₢ BONUS INCLUDED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {archetypes.map((archetype) => {
                  const isSelected = selectedArchetype === archetype.id
                  return (
                    <div
                      key={archetype.id}
                      onClick={() => setSelectedArchetype(archetype.id)}
                      className={cn(
                        'cursor-pointer p-3 rounded-lg border text-left transition-all duration-200',
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                          : 'border-slate-800 bg-[#080d1a]/80 hover:border-slate-700'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {archetype.icon}
                        <div className="font-rajdhani font-bold text-sm text-slate-100">
                          {archetype.name}
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-300 font-semibold mb-1">
                        {archetype.statLabel}
                      </div>
                      <div className="text-[10px] font-sans text-slate-400 leading-tight">
                        {archetype.description}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <NeonButton
                type="submit"
                variant="cyan"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full"
              >
                INITIALIZE OPERATIVE &amp; ENTER NEXAURA
              </NeonButton>
            </div>
          </form>

          {/* Footer Login Link */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs font-mono text-slate-400">
            <span>ALREADY REGISTERED? </span>
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-4 ml-1"
            >
              AUTHENTICATE HERE &gt;
            </Link>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  )
}
