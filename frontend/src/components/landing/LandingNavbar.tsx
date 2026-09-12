import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Menu, X, ArrowRight, LogIn } from 'lucide-react'
import { NeonButton } from '../NeonButton'

export const LandingNavbar: React.FC = () => {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Features', href: '#features' },
    { label: 'World', href: '#world' },
    { label: 'Vision Lab', href: '#vision-lab' },
    { label: 'About', href: '#about' },
  ]

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030712]/90 backdrop-blur-md border-b border-cyan-500/25 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3'
          : 'bg-gradient-to-b from-[#030712]/80 via-[#030712]/30 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo Branding */}
        <Link to="/" className="flex items-center gap-2.5 group select-none">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:border-pink-400 transition-colors">
            <Cpu className="w-5 h-5 group-hover:text-pink-400 transition-colors animate-pulse" />
          </div>
          <div>
            <span className="font-orbitron text-lg font-black tracking-widest text-slate-100 uppercase">
              NEXAURA<span className="text-cyan-400">.EXE</span>
            </span>
            <span className="hidden sm:block text-[8px] font-mono tracking-widest text-pink-400 uppercase font-semibold">
              UPGRADE YOUR REALITY.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleScrollTo(e, item.href)}
              className="text-xs font-mono text-slate-300 hover:text-cyan-400 uppercase tracking-widest transition-colors cursor-pointer py-1 relative group"
            >
              <span>{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Action Buttons: LOGIN & REGISTER */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 px-4 py-2 rounded border border-cyan-500/30 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/15 text-xs font-mono text-cyan-300 tracking-wider uppercase transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>LOGIN</span>
          </button>

          <NeonButton
            variant="cyan"
            size="sm"
            onClick={() => navigate('/register')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs tracking-wider uppercase font-bold"
          >
            REGISTER
          </NeonButton>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => navigate('/login')}
            className="px-2.5 py-1 rounded border border-cyan-500/30 text-[11px] font-mono text-cyan-300 uppercase"
          >
            LOGIN
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded border border-slate-800 bg-[#080d1e] text-slate-300 hover:text-cyan-400"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#050917]/95 border-b border-cyan-500/30 backdrop-blur-xl px-4 py-6 space-y-4"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                  className="text-sm font-mono text-slate-200 hover:text-cyan-400 uppercase tracking-widest py-2 border-b border-slate-800/60"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <NeonButton
                variant="cyan"
                size="md"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full justify-center"
              >
                CREATE ACCOUNT
              </NeonButton>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 rounded border border-cyan-500/30 bg-[#070e22] text-xs font-mono text-cyan-300 uppercase tracking-wider text-center"
              >
                ENTER NEXAURA (LOGIN)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default LandingNavbar
