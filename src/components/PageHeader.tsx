import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  image?: string;
  backLink?: string;
  backLabel?: string;
}

export default function PageHeader({ 
  title, 
  subtitle = "Rosid Syndicates Group", 
  image = "https://images.unsplash.com/photo-1541888056262-563b7852f826?q=100&w=3840&auto=format&fit=crop",
  backLink,
  backLabel = "Back to Home"
}: PageHeaderProps) {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden flex items-center min-h-[75vh]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-[#011E52] bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url("${image}")` }}
      >
        {/* Lighter Navy Overlay for 4K Clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#011E52]/95 via-[#011E52]/60 to-[#011E52]/95" />
      </div>

      <div className="container relative z-10">
        {backLink && (
          <Link to={backLink} className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-[#FD7B00] transition-colors mb-12 uppercase tracking-widest">
            <ArrowLeftIcon className="w-4 h-4" /> {backLabel}
          </Link>
        )}
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="eyebrow text-[#FD7B00] uppercase font-bold tracking-widest mb-4 bg-white/10 px-4 py-1.5 rounded-sm inline-block backdrop-blur-sm border border-white/10"
        >
          {subtitle}
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[5rem] font-bold font-sans text-white tracking-tight leading-[1.05] max-w-5xl"
        >
          {title}
        </motion.h1>
      </div>
    </section>
  )
}
