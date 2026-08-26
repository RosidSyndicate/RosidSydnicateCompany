import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="py-32 bg-[#F4F4F2] overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left text */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="eyebrow uppercase"
            >
              Group Overview
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="mt-6 text-4xl md:text-5xl lg:text-[4.5rem] font-bold font-sans text-[#011E52] leading-[1.05] tracking-tight"
            >
              A Multi-Disciplinary
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD7B00] to-[#FFB067]">Infrastructure & Trade</span>
              <br />
              Conglomerate.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className="mt-6 text-lead text-slate-500 max-w-md leading-relaxed"
            >
              Rosid Syndicates Group provides end-to-end solutions in heavy supply chain, financial advisory, public tender execution, and international trade. We connect global expertise with Nepalese execution.
            </motion.p>

            {/* Feature list */}
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-10 space-y-4"
            >
              {[
                'Construction Supply & Civil Infrastructure',
                'Public-Private Procurement',
                'Financial Advisory & Bank Syndication',
                'International Trade & Logistics',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-fire/10 text-fire text-[10px] font-bold">&#10003;</span>
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right side Image (Corporate Boardroom / HQ) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative h-[600px] w-full"
          >
            <div className="absolute inset-0 bg-[#011E52]/10 z-10 rounded-sm mix-blend-multiply" />
            <div 
              className="w-full h-full bg-[#011E52] bg-cover bg-center rounded-sm shadow-2xl"
              style={{ backgroundImage: `url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=100&w=3840&auto=format&fit=crop")` }}
            />
            {/* Accent block behind */}
            <div
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-fire/10 -z-10 rounded-sm"
              aria-hidden="true"
            />
          </motion.div>
        </div>

        {/* Mission Statement Box (moved below) */}
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-24 max-w-4xl mx-auto bg-white p-12 lg:p-16 shadow-xl border-l-4 border-[#FD7B00]"
          >
            <h3 className="text-xl font-bold text-ink uppercase tracking-wide">Executive Mission Statement</h3>
            <p className="mt-4 text-slate-500 text-lg leading-relaxed italic">
              "To engineer nationwide progress by bridging critical gaps in Nepal's infrastructure, financial, and commercial ecosystems. Through strategic partnerships, rigorous financial structuring, and cross-border trade excellence, Rosid Syndicates Group empowers contractors, global investors, and government bodies to realize nation-building projects with transparency, speed, and uncompromising quality."
            </p>
        </motion.div>
      </div>
    </section>
  )
}
