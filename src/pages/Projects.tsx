import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import PageHeader from '../components/PageHeader'

const projects = [
  { name: 'National Hydroelectric Dam Phase II', location: 'Gandaki Province, Nepal', img: 'https://images.unsplash.com/photo-1541888056262-563b7852f826?q=100&w=3840&auto=format&fit=crop', colSpan: 'col-span-1 md:col-span-2', height: 'h-[500px]' },
  { name: 'Kathmandu Metro Civil Works', location: 'Bagmati Province, Nepal', img: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?q=100&w=3840&auto=format&fit=crop', colSpan: 'col-span-1', height: 'h-[500px]' },
  { name: 'Koshi Bridge Expansion', location: 'Koshi Province, Nepal', img: 'https://images.unsplash.com/photo-1574320297042-63bc58baf00c?q=100&w=3840&auto=format&fit=crop', colSpan: 'col-span-1', height: 'h-[600px]' },
  { name: 'Trans-Himalayan Transmission Grid', location: 'Karnali Province, Nepal', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=100&w=3840&auto=format&fit=crop', colSpan: 'col-span-1 md:col-span-2', height: 'h-[600px]' },
]

export default function ProjectsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Projects & Case Studies | Rosid Syndicates Group'
  }, [])

  return (
    <div className="bg-transparent min-h-screen flex flex-col">
      <PageHeader 
        title="Projects & case studies." 
        subtitle="Portfolio" 
        image="https://images.unsplash.com/photo-1504307651254-35680f356f12?q=100&w=3840&auto=format&fit=crop"
      />

      {/* 2. CAPABILITIES VS VERIFIED PROJECTS */}
      <section className="py-24 bg-[#F4F4F2] flex-grow">
        <div className="container max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-ink mb-16 text-center">Verified Rosid Syndicates Projects</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((p, i) => (
                <motion.div 
                  key={p.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.8 }}
                  className={`group relative overflow-hidden rounded-sm cursor-pointer ${p.colSpan} ${p.height}`}
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: `url("${p.img}")` }}
                  />
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011E52]/90 via-[#011E52]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 p-10 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[#FD7B00] font-bold text-xs uppercase tracking-widest mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{p.location}</p>
                    <h3 className="text-3xl font-bold text-white uppercase tracking-wide leading-snug">{p.name}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-24 text-center">
              <Link to="/companies" className="inline-flex justify-center items-center gap-2 px-10 py-5 bg-white border border-slate-200 text-ink font-bold text-sm hover:border-[#FD7B00] transition-colors uppercase tracking-widest shadow-sm">
                Explore Our Capabilities <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
