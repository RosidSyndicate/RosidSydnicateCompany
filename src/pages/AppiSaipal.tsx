import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const processSteps = [
  { title: 'Project Development', desc: 'Initial feasibility and planning' },
  { title: 'Financial Structuring', desc: 'Debt-equity modeling & NRB compliance' },
  { title: 'Bank Syndication', desc: 'Mobilizing Class "A" consortiums' },
  { title: 'Guarantee / Risk Architecture', desc: 'Counter-guarantees & tripartite assurances' },
  { title: 'Financial Closure', desc: 'Finalizing syndicated facilities' },
  { title: 'Project Execution', desc: 'Construction commencement & DSCR monitoring' },
]

export default function AppiSaipal() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Appi Saipal Financial Solutions | Rosid Syndicates Group'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Capital Structuring, Bank Syndication, and Risk Assurance for Nepal\'s Energy Sector.')
    }
  }, [])

  return (
    <div className="bg-transparent">
      {/* 1. HERO */}
      <section className="relative min-h-[85vh] flex items-center bg-[#011E52] overflow-hidden pt-36 pb-32">
        {/* Hydropower Plant Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
          style={{ backgroundImage: 'url("/hydropower-plant.jpg")' }}
        />
        {/* Dark Blue & Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#011E52] via-[#011E52]/90 to-[#011E52]/70" />
        <div className="absolute inset-0 pointer-events-none opacity-20 cinematic-grid" />
        <div className="absolute top-0 right-0 w-[40vw] h-1 bg-[#FD7B00] origin-right -skew-x-12 opacity-80" aria-hidden="true" />
        
        <div className="container relative z-10 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-sm text-xs font-bold uppercase tracking-widest text-[#FD7B00] mb-6">
              A Rosid Syndicates Group Company
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-5xl leading-tight text-white uppercase">
              Appi Saipal Financial Solutions Pvt. Ltd.
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-[#FD7B00] font-bold max-w-3xl leading-relaxed">
              Hydropower & Transmission Line Financial Advisory Services
            </p>
            <p className="mt-4 text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
              Capital Structuring, Bank Syndication, and Risk Assurance for Nepal's Energy Sector.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/#contact" className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-[#FD7B00] text-white font-bold text-xs hover:bg-[#e66a00] transition-colors uppercase tracking-widest rounded-sm shadow-lg">
                Schedule Financial Closure Consultation <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link to="/tender-inquiry" className="inline-flex justify-center items-center gap-2 px-8 py-4 border border-white/30 text-white font-bold text-xs hover:bg-white/10 transition-colors uppercase tracking-widest rounded-sm">
                Request Energy Sector Advisory Profile
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. INTRODUCTION & FEATURED HYDROPOWER SHOWCASE */}
      <section className="py-24 bg-[#F4F4F2] border-b border-slate-200">
        <div className="container max-w-5xl">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-6">
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold text-[#FD7B00] uppercase tracking-[0.2em] mb-3">
                Energy Infrastructure Focus
              </motion.p>
              <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-[#011E52] leading-tight">
                De-Risking Mega Energy Projects from Concept to Grid Connection
              </motion.h2>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-6 prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm md:text-base space-y-4">
                <p>
                  Developing hydropower assets and high-voltage transmission corridors in Nepal requires robust financial architecture, local banking consortium alignment, and seamless multi-stakeholder governance.
                </p>
                <p>
                  Appi Saipal Financial Solutions connects developers, Class "A" commercial banks, international EPC contractors, and state energy authorities to ensure project bankability and continuous execution.
                </p>
              </motion.div>
            </div>

            {/* Hydropower Plant Showcase Card */}
            <div className="lg:col-span-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-3 rounded-sm shadow-xl border border-slate-200 overflow-hidden group"
              >
                <div className="relative h-72 sm:h-80 overflow-hidden rounded-sm bg-[#011E52]">
                  <img 
                    src="/hydropower-plant.jpg" 
                    alt="Hydropower & Transmission Line Financial Advisory Services — Appi Saipal" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011E52]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FD7B00] bg-[#011E52]/80 px-2.5 py-1 rounded-sm backdrop-blur-sm inline-block mb-1">
                      Verified Infrastructure Asset
                    </span>
                    <h4 className="text-sm font-bold leading-snug text-white">
                      Hydropower & High-Voltage Transmission Substation Advisory
                    </h4>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
                  <strong className="text-[#011E52]">Appi Saipal Financial Solutions Pvt. Ltd.</strong> — Capital Structuring & Bank Consortium Syndication.
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-32 bg-transparent">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* 3. FINANCIAL CLOSURE */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#F4F4F2] p-10 border border-slate-200">
              <h3 className="text-2xl font-bold text-ink mb-8 border-b border-slate-200 pb-4">Consortium Bank Syndication & Debt Structuring</h3>
              <ul className="space-y-8">
                <li>
                  <h4 className="font-bold text-ink text-lg">Lead Arrangement Support</h4>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">Structuring debt-equity ratios compliant with Nepal Rastra Bank directives and project cash-flow models.</p>
                </li>
                <li>
                  <h4 className="font-bold text-ink text-lg">Consortium Facilitation</h4>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">Mobilizing Class "A" commercial banks and financial institutions into syndicated loan facilities for large capital expenditures.</p>
                </li>
                <li>
                  <h4 className="font-bold text-ink text-lg">Refinancing & Equity Advisory</h4>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">Structuring bridge financing, mezzanine capital and equity partner alignment for mid-stage project developers.</p>
                </li>
              </ul>
            </motion.div>

            {/* 4. TRIPARTITE ASSURANCE */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-[#F4F4F2] p-10 border border-slate-200">
              <h3 className="text-2xl font-bold text-ink mb-8 border-b border-slate-200 pb-4">Tripartite Assurance & Risk Mitigation</h3>
              <ul className="space-y-8">
                <li>
                  <h4 className="font-bold text-ink text-lg">Debtor-Servicing Assurance</h4>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">Independent operational intermediary role to align project milestones with bank repayment schedules.</p>
                </li>
                <li>
                  <h4 className="font-bold text-ink text-lg">Beneficiary Protection</h4>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">Transparent escrow monitoring and performance-linked disbursements.</p>
                </li>
                <li>
                  <h4 className="font-bold text-ink text-lg">Default Prevention</h4>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">Continuous covenant monitoring to prevent DSCR breaches during construction periods.</p>
                </li>
              </ul>
            </motion.div>

            {/* 5. FOREIGN CONTRACTOR FACILITIES */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#F4F4F2] p-10 border border-slate-200">
              <h3 className="text-2xl font-bold text-ink mb-8 border-b border-slate-200 pb-4">Foreign Contractor Facilities & Counter-Guarantees</h3>
              <ul className="space-y-8">
                <li>
                  <h4 className="font-bold text-ink text-lg">Counter-Guarantee Structuring</h4>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">Support for cross-border bank guarantees including Bid Bonds, Performance Bonds, and Advance Payment Guarantees.</p>
                </li>
                <li>
                  <h4 className="font-bold text-ink text-lg">Regulatory Foreign Exchange Compliance</h4>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">Navigating foreign currency approvals, offshore equipment procurement, and repatriation of project earnings.</p>
                </li>
                <li>
                  <h4 className="font-bold text-ink text-lg">Cross-Border Trade Structuring</h4>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">Letter of Credit facilities, turbine imports, generator imports, transmission tower imports, and coordination with B & C Exim.</p>
                </li>
              </ul>
            </motion.div>

            {/* 6. POLICY REFORM & GOVERNMENT ADVOCACY */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-[#F4F4F2] p-10 border border-slate-200">
              <h3 className="text-2xl font-bold text-ink mb-8 border-b border-slate-200 pb-4">Policy Reform & Government Advocacy</h3>
              <ul className="space-y-8">
                <li>
                  <h4 className="font-bold text-ink text-lg">Regulatory Liaison</h4>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">Advisory coordination with the Ministry of Energy, Water Resources and Irrigation (MoEWRI), Electricity Regulatory Commission (ERC), and Nepal Electricity Authority (NEA).</p>
                </li>
                <li>
                  <h4 className="font-bold text-ink text-lg">Legal Framework Amendments</h4>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">Strategic advisory on concession agreements, transmission wheeling charges, and infrastructure lending caps.</p>
                </li>
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 7. FINANCIAL CLOSURE PROCESS */}
      <section className="py-32 bg-white text-ink">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-ink">Financial Closure Process</h2>
            <p className="mt-4 text-ink/70">Our structured pathway from development to execution.</p>
          </motion.div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-[#F4F4F2] border border-slate-200 -translate-y-1/2" aria-hidden="true" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
              {processSteps.map((step, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-slate-200 shadow-sm border border-slate-200 p-6 md:p-8 hover:bg-[#F4F4F2] border border-slate-200 transition-colors backdrop-blur-sm"
                >
                  <div className="text-fire font-bold text-sm uppercase tracking-widest mb-4">Stage 0{i + 1}</div>
                  <h3 className="text-xl font-bold text-ink mb-2">{step.title}</h3>
                  <p className="text-sm text-ink/70">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMPARISON TABLE */}
      <section className="py-32 bg-[#F4F4F2]">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ink">Why Energy Developers Choose Appi Saipal</h2>
          </motion.div>
          
          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full text-left border-collapse bg-transparent shadow-xl min-w-[700px]">
              <thead>
                <tr className="bg-white text-ink">
                  <th className="p-6 font-bold uppercase tracking-wider text-sm border-b border-slate-200 w-1/4">Dimension</th>
                  <th className="p-6 font-bold uppercase tracking-wider text-sm border-b border-slate-200 border-l w-3/8 text-ink/60">Standard Financial Advisory</th>
                  <th className="p-6 font-bold uppercase tracking-wider text-sm border-b border-slate-200 border-l w-3/8 text-fire">Appi Saipal Approach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                <tr>
                  <td className="p-6 font-bold text-ink bg-[#F4F4F2]">Banking Network</td>
                  <td className="p-6 text-slate-500 border-l border-slate-200">Purely transactional referral</td>
                  <td className="p-6 text-ink font-medium border-l border-slate-200 bg-fire-50/30">Direct consortium syndication with established NRB compliance frameworks</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-ink bg-[#F4F4F2]">Cross-Border Reach</td>
                  <td className="p-6 text-slate-500 border-l border-slate-200">Domestic focus only</td>
                  <td className="p-6 text-ink font-medium border-l border-slate-200 bg-fire-50/30">Integrated counter-guarantees for foreign EPC firms entering Nepal</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-ink bg-[#F4F4F2]">Group Ecosystem</td>
                  <td className="p-6 text-slate-500 border-l border-slate-200">Standalone advisory firm</td>
                  <td className="p-6 text-ink font-medium border-l border-slate-200 bg-fire-50/30">Backed by Rosid Syndicates Group's civil execution and material supply network</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-ink bg-[#F4F4F2]">Regulatory Policy</td>
                  <td className="p-6 text-slate-500 border-l border-slate-200">Passive compliance</td>
                  <td className="p-6 text-ink font-medium border-l border-slate-200 bg-fire-50/30">Active lobbying and legal advocacy for sectoral policy improvements</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="py-32 bg-transparent border-t border-slate-200 text-center">
        <div className="container max-w-4xl">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold text-ink leading-tight">
            Accelerate Your Energy Project's<br />
            <span className="text-fire">Capital Structuring</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-8 text-lg md:text-xl text-slate-500 leading-relaxed">
            Supporting domestic developers preparing for financial closure and international contractors bidding on cross-border transmission lines.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/#contact" className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white text-ink font-bold text-sm hover:bg-fire transition-colors uppercase tracking-widest">
              Schedule Financial Closure Consultation <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link to="/#contact" className="inline-flex justify-center items-center gap-2 px-8 py-4 border-2 border-slate-700 text-ink font-bold text-sm hover:bg-white hover:text-ink transition-colors uppercase tracking-widest">
              Request Energy Sector Advisory Profile
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
