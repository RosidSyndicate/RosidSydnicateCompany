import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const stats = [
  { v: '100', s: '+', l: 'Global Partners' },
  { v: '150', s: '+', l: 'Projects Delivered' },
  { v: '40', s: '+', l: 'Years Experience' },
  { v: '2000', s: '+', l: 'Expert Workforce' },
]

function CountUp({ to, active }: { to: string; active: boolean }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!active) return
    const target = parseInt(to, 10)
    if (isNaN(target)) return

    let start = 0
    const duration = 1500 // 1.5 seconds
    const steps = 60
    const stepTime = duration / steps
    const increment = target / steps

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setVal(target)
        clearInterval(timer)
      } else {
        setVal(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [to, active])

  return <span>{val}</span>
}

export default function Stats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <section ref={ref} className="relative py-20 overflow-hidden border-b border-white/10 shadow-2xl">
      {/* 4K Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-[#011E52] bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url("https://images.unsplash.com/photo-1504307651254-35680f356f12?q=100&w=3840&auto=format&fit=crop")` }}
      />
      <div className="absolute inset-0 z-0 bg-[#011E52]/90 backdrop-blur-[2px]"></div>
      
      {/* Dotted grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] cinematic-grid" />

      <div className="container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-sm text-center shadow-lg group hover:border-[#FD7B00]/40 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-baseline gap-0.5 justify-center">
                <span className="text-4xl lg:text-5xl font-black text-white tabular-nums tracking-tighter">
                  <CountUp to={s.v} active={inView} />
                </span>
                <span className="text-2xl lg:text-3xl font-black text-[#FD7B00] group-hover:scale-110 transition-transform duration-300">{s.s}</span>
              </div>
              <p className="mt-2 text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
