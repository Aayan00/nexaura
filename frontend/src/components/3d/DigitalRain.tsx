import React, { useEffect, useRef } from 'react'

export const DigitalRain: React.FC<{
  color?: string
  opacity?: number
  className?: string
}> = ({ color = '#00f0ff', opacity = 0.25, className = 'absolute inset-0 pointer-events-none' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const chars = '010101XYZ_NEXAURA_0x89_NETRUNNER_PROTO_89ABCDEF'
    const fontSize = 14
    let columns = Math.floor(window.innerWidth / fontSize)
    let drops: number[] = Array(columns).fill(1)

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      columns = Math.floor(window.innerWidth / fontSize)
      drops = Array(columns).fill(1)
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 8, 17, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = color
      ctx.font = `${fontSize}px JetBrains Mono, monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length))
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [color])

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity }}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  )
}
