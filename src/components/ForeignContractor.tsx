import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function ForeignContractor() {
  return (
    <section className="relative py-32 overflow-hidden flex items-center justify-center min-h-[800px]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=100&w=3840&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-[#011E52]/40" /> {/* Lighter Navy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#011E52]/70 to-transparent" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="eyebrow text-[#FD7B00] uppercase font-bold tracking-widest bg-white/10 px-4 py-1.5 rounded-sm inline-block backdrop-blur-sm border border-white/10">Foreign Contractor Support</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 text-5xl md:text-6xl text-white font-display font-bold uppercase tracking-wide leading-tight">Your In-Country<br /><span className="text-[#FD7B00]">Execution Engine.</span></motion.h2>
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }} className="mt-8 text-lg text-slate-200 leading-relaxed font-light">
              Entering Nepal's rapidly expanding infrastructure sector presents immense opportunities. However, foreign firms often face complex hurdles under the Public Procurement Act, local bank guarantee compliance, and regulatory navigation.
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-4 text-lg text-slate-200 leading-relaxed font-light">
              Rosid Syndicates Group acts as your complete in-country operational, financial, and strategic partner. We bridge the gap between global expertise and Nepalese execution.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="mt-10">
              <Link to="/infrastructure-tender-services" className="inline-flex justify-center items-center gap-3 px-10 py-5 bg-[#FD7B00] text-white font-bold text-sm hover:bg-[#e66a00] transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-widest rounded-sm">
                Explore Tenders <span aria-hidden="true" className="text-lg">→</span>
              </Link>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl p-10 lg:p-12 rounded-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#FD7B00]/10 rounded-full blur-[80px]" />
             <ul className="space-y-10 relative z-10">
               <li className="flex gap-6 items-start">
                 <div className="w-12 h-12 shrink-0 bg-white/10 grid place-items-center text-white font-mono font-bold text-lg rounded-sm border border-white/20">01</div>
                 <div>
                   <h3 className="font-bold text-xl text-white uppercase tracking-wide">Financial & Guarantees</h3>
                   <p className="text-sm text-slate-300 mt-2 leading-relaxed font-light">Counter Guarantee Setup, Local Bank Syndication, Financial Closure.</p>
                 </div>
               </li>
               <li className="flex gap-6 items-start">
                 <div className="w-12 h-12 shrink-0 bg-white/10 grid place-items-center text-white font-mono font-bold text-lg rounded-sm border border-white/20">02</div>
                 <div>
                   <h3 className="font-bold text-xl text-white uppercase tracking-wide">Regulatory & Advocacy</h3>
                   <p className="text-sm text-slate-300 mt-2 leading-relaxed font-light">Local Agent Alignment, PPA / PPMP Compliance, Government Advocacy.</p>
                 </div>
               </li>
               <li className="flex gap-6 items-start">
                 <div className="w-12 h-12 shrink-0 bg-white/10 grid place-items-center text-white font-mono font-bold text-lg rounded-sm border border-white/20">03</div>
                 <div>
                   <h3 className="font-bold text-xl text-white uppercase tracking-wide">Civil & Supply Logistics</h3>
                   <p className="text-sm text-slate-300 mt-2 leading-relaxed font-light">Bulk Material Sourcing, Equipment Logistics, JV Site Execution.</p>
                 </div>
               </li>
             </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
