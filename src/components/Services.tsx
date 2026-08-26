import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const services = [
  { 
    n: 'Construction & Civil Infrastructure', 
    d: 'Earthworks, highway construction, structural engineering, and integrated civil build contracts.', 
    img: 'https://images.unsplash.com/photo-1541888056262-563b7852f826?q=100&w=3840&auto=format&fit=crop',
    fallbackImg: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=100&w=3840&auto=format&fit=crop'
  },
  { 
    n: 'Procurement & Tender Execution', 
    d: 'Active participation and execution in public sector and private infrastructure supply tenders.', 
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=100&w=3840&auto=format&fit=crop',
    fallbackImg: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=100&w=3840&auto=format&fit=crop'
  },
  { 
    n: 'Financial Advisory', 
    d: 'Sovereign project financing, bank guarantee structuring, and Class "A" consortium syndication.', 
    img: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=100&w=3840&auto=format&fit=crop',
    fallbackImg: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=100&w=3840&auto=format&fit=crop'
  },
  { 
    n: 'International Trade', 
    d: 'Comprehensive import and export operations for raw materials, industrial plant machinery, and commodities.', 
    img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=100&w=3840&auto=format&fit=crop',
    fallbackImg: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=100&w=3840&auto=format&fit=crop'
  },
  { 
    n: 'Logistics & Supply Chain', 
    d: 'Nationwide warehousing, heavy fleet transportation, and last-mile logistics across Nepal.', 
    img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=100&w=3840&auto=format&fit=crop',
    fallbackImg: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=100&w=3840&auto=format&fit=crop'
  },
  { 
    n: 'Public-Private Partnerships', 
    d: 'Facilitating joint-venture execution, concession agreements, and government liaison for mega projects.', 
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=100&w=3840&auto=format&fit=crop',
    fallbackImg: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=100&w=3840&auto=format&fit=crop'
  },
]

export default function Services() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <section id="companies" className="py-32 bg-[#F4F4F2]">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-16">
          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="eyebrow uppercase text-[#FD7B00]">Core Capabilities</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6 text-4xl md:text-5xl lg:text-[4.5rem] font-bold font-sans text-[#011E52] leading-[1.05] tracking-tight">Business<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD7B00] to-[#FFB067]">Areas.</span></motion.h2>
          </div>
          <Link to="/companies" className="text-sm font-bold text-slate-500 hover:text-[#FD7B00] transition-colors uppercase tracking-widest pb-4">Explore Our Companies →</Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div 
              key={s.n} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1 }} 
              onMouseMove={handleMouseMove}
              className="group relative h-[420px] overflow-hidden rounded-sm shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer bg-[#011E52]"
            >
              {/* Distinct Background Image with Dedicated Fallback */}
              <img 
                src={s.img} 
                alt={s.n}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.85]"
                onError={(e) => {
                  e.currentTarget.src = s.fallbackImg
                }}
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#011E52] via-[#011E52]/60 to-[#011E52]/20 transition-opacity duration-500 opacity-90 group-hover:opacity-95 z-10" />

              {/* Dynamic spotlight hover glow */}
              <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(280px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(253,123,0,0.3),transparent_80%)]" />

              {/* Top Bar: Number Indicator */}
              <div className="absolute top-6 right-6 z-30 font-mono text-2xl font-black text-[#FD7B00] drop-shadow-md">
                0{i + 1}
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-30">
                <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide transform group-hover:-translate-y-1 transition-transform duration-500 leading-snug">
                  {s.n}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {s.d}
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-xs font-bold uppercase tracking-widest text-[#FD7B00]">
                  <span>Discover Capability</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
