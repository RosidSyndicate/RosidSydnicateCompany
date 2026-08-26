import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { scrollTo } from '../lib/scroll'
import { ArrowRightIcon, GlobeAltIcon, BanknotesIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = []
    const particleCount = Math.min(Math.floor((w * h) / 18000), 80)

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 1,
      })
    }

    let mouse = { x: -1000, y: -1000 }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('resize', handleResize)

    let animationId: number

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(253, 123, 0, 0.25)'
      ctx.strokeStyle = 'rgba(253, 123, 0, 0.04)'

      // Draw lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        p1.x += p1.vx
        p1.y += p1.vy

        if (p1.x < 0 || p1.x > w) p1.vx *= -1
        if (p1.y < 0 || p1.y > h) p1.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2)
        ctx.fill()

        // Line to mouse
        const dxMouse = p1.x - mouse.x
        const dyMouse = p1.y - mouse.y
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
        if (distMouse < 200) {
          ctx.strokeStyle = `rgba(253, 123, 0, ${(1 - distMouse / 200) * 0.15})`
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }

        // Line to other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 130) {
            ctx.strokeStyle = `rgba(253, 123, 0, ${(1 - dist / 130) * 0.06})`
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-70" />
}

export default function Hero() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <section className="relative min-h-screen bg-[#030914] overflow-hidden flex flex-col justify-between pt-32 pb-12">
        {/* Deep, cinematic background image */}
        <div 
           className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] ease-linear scale-110"
           style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=100&w=3840&auto=format&fit=crop")' }}
        />
        {/* Layered gradients for that cinematic Vercel/Stripe darkness */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#011E52]/90 via-[#011E52]/60 to-[#030914] opacity-95" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-[#011E52]/10 to-transparent" />
        
        {/* Particle net canvas */}
        <ParticleNetwork />

        {/* Subtle tech grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] cinematic-grid" />

        {/* Main Content Area */}
        <div className="container relative z-10 px-6 lg:px-12 flex-1 flex flex-col justify-center mb-16">
           <div className="max-w-5xl">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
                 <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-10 shadow-2xl">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FD7B00] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FD7B00]"></span>
                    </span>
                    <span className="text-[11px] font-bold text-white/90 uppercase tracking-[0.25em]">Global Conglomerate</span>
                 </div>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-7xl lg:text-[5.5rem] text-white leading-[1.05] font-sans font-bold tracking-tight"
              >
                <motion.span
                  initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  Engineer the future.
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD7B00] to-[#FFB067] inline-block"
                >
                  With absolute certainty.
                </motion.span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }} 
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} 
                className="mt-10 max-w-2xl text-xl md:text-2xl text-white/70 font-medium leading-relaxed tracking-tight border-l-4 border-[#FD7B00] pl-6"
              >
                Rosid orchestrates sovereign infrastructure, tier-one financial syndication, and heavy supply chains. We don't just build—we architect the economic foundation of Nepal.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }} 
                className="mt-12 flex flex-col sm:flex-row gap-6 w-full max-w-md sm:max-w-none"
              >
                <button onClick={() => scrollTo('contact')} className="group relative inline-flex justify-center items-center gap-4 px-12 py-5 bg-[#FD7B00] text-white font-black text-[13px] transition-all duration-300 hover:shadow-[0_0_40px_rgba(253,123,0,0.5)] uppercase tracking-[0.2em] rounded-sm overflow-hidden border border-[#FD7B00]">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                  <span className="relative">Initiate Contact</span>
                  <ArrowRightIcon className="relative w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
           </div>
        </div>

        {/* The Power Move: Bottom Glassmorphic Dashboard Bar */}
        <motion.div 
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
           className="container relative z-10 px-6 lg:px-12"
        >
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { i: BuildingOfficeIcon, t: 'Mega Infrastructure', v: 'Civil & Structural' },
                { i: BanknotesIcon, t: 'Financial Syndication', v: 'Tier-One Advisory' },
                { i: GlobeAltIcon, t: 'Global Trade', v: 'Heavy Logistics' },
              ].map((card, i) => (
                 <div 
                    key={i} 
                    onMouseMove={handleMouseMove}
                    className="glow-border-card group p-6 backdrop-blur-xl cursor-pointer"
                 >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-sm bg-[#011E52]/50 border border-white/10 grid place-items-center transition-all duration-300 group-hover:border-[#FD7B00]/40 group-hover:shadow-[0_0_15px_rgba(253,123,0,0.2)]">
                          <card.i className="w-6 h-6 text-[#FD7B00]" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-white/50 uppercase tracking-widest">{card.v}</p>
                          <h3 className="text-lg font-black text-white uppercase tracking-wider mt-1 transition-colors duration-300 group-hover:text-[#FD7B00]">{card.t}</h3>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </motion.div>
     </section>
  )
}
