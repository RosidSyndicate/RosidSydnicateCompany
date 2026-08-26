import { motion } from 'framer-motion'

const projects = [
  { name: 'National Hydroelectric Dam Phase II', location: 'Gandaki Province, Nepal', img: 'https://images.unsplash.com/photo-1541888056262-563b7852f826?q=100&w=3840&auto=format&fit=crop', colSpan: 'col-span-1 md:col-span-2', height: 'h-[500px]' },
  { name: 'Kathmandu Metro Civil Works', location: 'Bagmati Province, Nepal', img: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?q=100&w=3840&auto=format&fit=crop', colSpan: 'col-span-1', height: 'h-[500px]' },
  { name: 'Koshi Bridge Expansion', location: 'Koshi Province, Nepal', img: 'https://images.unsplash.com/photo-1574320297042-63bc58baf00c?q=100&w=3840&auto=format&fit=crop', colSpan: 'col-span-1', height: 'h-[600px]' },
  { name: 'Trans-Himalayan Transmission Grid', location: 'Karnali Province, Nepal', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=100&w=3840&auto=format&fit=crop', colSpan: 'col-span-1 md:col-span-2', height: 'h-[600px]' },
]

export default function Projects() {
  return (
    <section id="projects" className="py-32 bg-white">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-16">
          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="eyebrow uppercase text-[#FD7B00]">Selected Works</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6 text-4xl md:text-5xl lg:text-[4.5rem] font-bold font-sans text-[#011E52] leading-[1.05] tracking-tight">Nation-Building<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD7B00] to-[#FFB067]">Projects.</span></motion.h2>
          </div>
          <a href="#/projects" className="text-sm font-bold text-slate-500 hover:text-[#FD7B00] transition-colors uppercase tracking-widest pb-4">View All Projects →</a>
        </div>

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
                className="absolute inset-0 bg-[#011E52] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url("${p.img}")` }}
              />
              
              {/* Lighter Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#011E52]/95 via-[#011E52]/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-10 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[#FD7B00] font-bold text-xs uppercase tracking-widest mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{p.location}</p>
                <h3 className="text-3xl font-bold text-white uppercase tracking-wide leading-snug">{p.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
