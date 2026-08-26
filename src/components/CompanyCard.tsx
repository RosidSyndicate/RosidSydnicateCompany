import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Company } from '../data/companies'

export default function CompanyCard({ company, index }: { company: Company, index: number }) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ delay: index * 0.1 }} 
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden transition-all duration-500 h-[400px] sm:h-[450px] w-full flex flex-col justify-end p-8 sm:p-10 border-0 cursor-pointer"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-[#011E52] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url("${company.image}")` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#011E52]/90 via-[#011E52]/40 to-transparent"></div>

      {/* Dynamic spotlight hover glow */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(250px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(253,123,0,0.25),transparent_80%)]" />

      <Link to={`/companies/${company.slug}`} className="absolute inset-0 z-30">
        <span className="sr-only">View {company.name}</span>
      </Link>
      
      <div className="relative z-20">
        <div className="flex items-start justify-between mb-4">
          <span className="text-[10px] font-mono text-white/50 font-bold uppercase tracking-widest">0{index + 1}</span>
        </div>
        
        <h3 className="text-2xl font-bold text-white leading-tight pr-4 group-hover:text-[#FD7B00] transition-colors">
          {company.name}
        </h3>
        
        <div className="mt-4 flex flex-col gap-2">
          <span className="inline-block px-3 py-1 bg-[#FD7B00]/20 text-[#FD7B00] text-[10px] font-bold uppercase tracking-[0.1em] self-start">
            Core Scope
          </span>
          <p className="text-sm text-white/80 leading-relaxed font-medium line-clamp-2">
            {company.coreScope}
          </p>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/20 flex items-center justify-between">
          <span className="text-xs font-bold text-white/60 uppercase tracking-[0.15em] group-hover:text-white transition-colors">
            View Company →
          </span>
        </div>
      </div>
    </motion.div>
  )
}
