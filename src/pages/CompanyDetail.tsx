import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { companies } from '../data/companies'
import PageHeader from '../components/PageHeader'

export default function CompanyDetail() {
  const { slug } = useParams()
  const company = companies.find(c => c.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!company) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#F4F4F2] text-center flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-ink mb-4">Company Not Found</h1>
        <Link to="/companies" className="inline-flex items-center gap-2 text-sm font-bold text-fire hover:text-fire-600 transition-colors">
          <ArrowLeftIcon className="w-4 h-4" /> View All Companies
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-transparent min-h-screen">
      <PageHeader 
        title={company.name}
        subtitle="Rosid Syndicates Group Subsidiary"
        image={company.image || "https://images.unsplash.com/photo-1544971587-c1555541c5d4?q=100&w=3840&auto=format&fit=crop"}
        backLink="/companies"
        backLabel="Group Companies"
      />
      <div className="container max-w-4xl py-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }} 
          className="mt-12 p-8 bg-[#F4F4F2] border border-slate-200"
        >
          <h2 className="text-sm font-bold text-ink/40 uppercase tracking-[0.15em] mb-3">Core Scope</h2>
          <p className="text-xl md:text-2xl text-ink font-medium leading-relaxed">
            {company.coreScope}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }} 
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-ink mb-8">Capabilities & Focus Areas</h2>
          <ul className="grid sm:grid-cols-2 gap-4">
            {company.services.map((service, idx) => (
              <li key={idx} className="flex items-start gap-4 p-6 bg-transparent border border-slate-200 shadow-sm">
                <span className="grid place-items-center w-6 h-6 rounded-full bg-fire/10 text-fire text-[10px] font-bold shrink-0 mt-0.5">
                  &#10003;
                </span>
                <span className="text-ink text-base leading-relaxed font-medium">
                  {service}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
        

        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }} 
          className="mt-20 py-16 border-t border-slate-200 text-center"
        >
          <p className="text-2xl font-bold text-ink">Ready to work with {company.name}?</p>
          <p className="mt-4 text-slate-500 max-w-lg mx-auto">
            Leverage our specialized capabilities for your next mega-project in Nepal.
          </p>
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white text-ink font-bold text-sm uppercase tracking-widest hover:bg-fire transition-colors"
          >
            Discuss a Project
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
