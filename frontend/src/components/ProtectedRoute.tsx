import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cpu, ShieldCheck } from 'lucide-react'
import { useRPG } from '../context/RPGContext'

interface ProtectedRouteProps {
  children?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAuthChecking } = useRPG()
  const location = useLocation()

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#050811] flex flex-col items-center justify-center relative overflow-hidden text-slate-200">
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Cyber Terminal Scan Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 flex flex-col items-center p-8 bg-[#090e1d]/90 border border-cyan-500/40 rounded-xl shadow-[0_0_35px_rgba(0,240,255,0.2)] backdrop-blur-md max-w-sm w-full mx-4"
        >
          <div className="relative w-16 h-16 mb-5 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
              className="absolute inset-0 border-2 border-dashed border-cyan-400 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="absolute inset-2 border-2 border-t-pink-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full"
            />
            <Cpu className="w-7 h-7 text-cyan-400 animate-pulse" />
          </div>

          <div className="text-center space-y-2">
            <div className="font-orbitron text-base font-bold tracking-widest text-cyan-300 uppercase flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>NEURAL SCAN ACTIVE</span>
            </div>
            <p className="font-mono text-xs text-slate-400">
              Verifying encrypted operative session...
            </p>
          </div>

          {/* Progress Scanning Bar */}
          <div className="w-full bg-[#050b18] border border-cyan-900/80 rounded-full h-1.5 mt-6 overflow-hidden relative">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            />
          </div>

          <div className="mt-4 font-mono text-[10px] text-cyan-600 tracking-wider">
            [PROTOCOL 0x7E // AUTH_CHECK]
          </div>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
