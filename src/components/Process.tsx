import { motion } from 'framer-motion'

const steps = [
  { n: '01', t: 'Financial Integrity', d: 'Bridging contractors, funding banks, and central authorities through transparent guarantee structures and financial closure mechanisms.' },
  { n: '02', t: 'National Impact', d: 'Priority execution on mega-projects—including hydropower development, transmission corridors, and critical civil roadways.' },
  { n: '03', t: 'Global Synergy', d: 'Facilitating foreign bidder entry, counter-guarantee integration, and streamlined cross-border trade into Nepal.' },
  { n: '04', t: 'Uncompromised Delivery', d: 'End-to-end reliability, from bulk raw material sourcing to final civil site construction.' },
]

export default function Process() {
  return (
    <section id="values" className="relative py-32 bg-[#F4F4F2]">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left side Image (Engineering / Planning) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[700px] w-full hidden lg:block"
          >
            <div className="absolute inset-0 bg-[#FD7B00]/10 z-10 rounded-sm mix-blend-multiply" />
            <img 
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=100&w=3840&auto=format&fit=crop" 
              alt="Engineering and Planning" 
              className="w-full h-full object-cover rounded-sm shadow-2xl"
            />
            {/* Accent block behind */}
            <div
              className="absolute -top-6 -left-6 w-32 h-32 bg-[#011E52]/10 -z-10 rounded-sm"
              aria-hidden="true"
            />
          </motion.div>

          {/* Right side Text & Values */}
          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="eyebrow text-[#FD7B00] uppercase">Core Values</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6 text-4xl md:text-5xl lg:text-[4.5rem] font-bold font-sans text-[#011E52] leading-[1.05] tracking-tight">Values Driving <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD7B00] to-[#FFB067]">Our Growth.</span></motion.h2>

            <div className="mt-12 space-y-10">
              {steps.map((s, i) => (
                <motion.div 
                  key={s.n} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.15 }} 
                  className="relative pl-10 border-l-2 border-slate-200 hover:border-[#FD7B00] transition-colors duration-300"
                >
                  <span className="absolute -left-[17px] top-0 grid place-items-center w-8 h-8 rounded-full bg-white border-2 border-slate-200 text-ink text-[10px] font-bold">{s.n}</span>
                  <h3 className="text-xl font-bold text-ink uppercase tracking-wide">{s.t}</h3>
                  <p className="mt-3 text-slate-500 leading-relaxed text-sm md:text-base">{s.d}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
