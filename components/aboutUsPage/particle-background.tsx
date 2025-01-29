"use client"

import { useRef, useEffect } from "react"

interface ParticleProps {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

interface ParticleBackgroundProps {
  color: string
  density?: number
}

export const ParticleBackground = ({ color, density = 50 }: ParticleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    const particles: ParticleProps[] = Array.from({ length: density }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5,
    }))

    let mouseX = 0
    let mouseY = 0
    let isMouseMoving = false

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
      isMouseMoving = true
      setTimeout(() => (isMouseMoving = false), 100)
    })

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        if (isMouseMoving) {
          const dx = mouseX - particle.x
          const dy = mouseY - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 100) {
            const angle = Math.atan2(dy, dx)
            particle.x -= Math.cos(angle) * 2
            particle.y -= Math.sin(angle) * 2
          }
        }

        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.opacity += (Math.random() - 0.5) * 0.01

        particle.x = particle.x < 0 ? canvas.width : particle.x > canvas.width ? 0 : particle.x
        particle.y = particle.y < 0 ? canvas.height : particle.y > canvas.height ? 0 : particle.y
        particle.opacity = Math.max(0, Math.min(1, particle.opacity))

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`
        ctx.fill()

        particles.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `${color}${Math.floor((1 - distance / 100) * 50)
              .toString(16)
              .padStart(2, "0")}`
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [color, density])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }} />
}

