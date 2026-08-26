import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'

type Credential = {
  id: string
  title: string
  category: string
  description: string
  file_url: string
}

const CATEGORIES = [
  'Company Registration',
  'PAN / VAT',
  'Contractor Registration',
  'Licences',
  'Certifications',
  'Banking / Financial Credentials',
  'Safety / Quality',
  'Other Corporate Documents'
]

export default function Credentials() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Credentials & Compliance | Rosid Syndicates Group'
    
    async function fetchCreds() {
      const { data } = await supabase
        .from('credentials')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
      
      if (data) setCredentials(data)
      setLoading(false)
    }
    
    fetchCreds()
  }, [])

  const handleView = async (filePath: string) => {
    try {
      // Use download instead of createSignedUrl for public anon users
      const { data, error } = await supabase.storage.from('credentials_files').download(filePath)
      if (error || !data) {
        alert('Failed to access secure document. It may have been unpublished.')
        return
      }
      
      const url = URL.createObjectURL(data)
      window.open(url, '_blank')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="bg-transparent min-h-screen flex flex-col">
      <PageHeader 
        title="Credentials & Compliance" 
        subtitle="Corporate Governance" 
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=100&w=3840&auto=format&fit=crop"
      />

      {/* 2. PENDING DATA / EMPTY STATE */}
      <section className="py-24 bg-[#F4F4F2] flex-grow">
        <div className="container max-w-5xl">
          
          <div className="mb-12 p-6 bg-transparent border border-slate-200 shadow-sm">
            <p className="text-sm font-bold text-ink uppercase tracking-widest mb-2">Status: Pending Verification</p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Verified corporate credentials, statutory licences, and financial registration certificates will be published here upon final clearance from our legal and compliance division.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading verified credentials...</div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {CATEGORIES.map((category, index) => {
                const categoryCreds = credentials.filter(c => c.category === category)
                
                return (
                  <div key={index} className="bg-transparent p-6 border border-slate-200 hover:border-fire/30 transition-colors group relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    
                    <DocumentTextIcon className="w-6 h-6 text-ink/30 mb-4 group-hover:text-fire transition-colors shrink-0" />
                    <h3 className="font-bold text-ink mb-4 text-sm">{category}</h3>
                    
                    <div className="pt-4 border-t border-slate-200 flex-1 flex flex-col gap-3">
                      {categoryCreds.length === 0 ? (
                        <p className="text-xs text-ink/40 uppercase tracking-widest font-bold">Documents Pending</p>
                      ) : (
                        categoryCreds.map(cred => (
                          <div key={cred.id} className="flex justify-between items-start gap-4">
                            <div>
                              <p className="text-sm font-medium text-slate-600">{cred.title}</p>
                              {cred.description && <p className="text-xs text-slate-500 mt-1">{cred.description}</p>}
                            </div>
                            <button 
                              onClick={() => handleView(cred.file_url)}
                              className="text-fire hover:text-fire-100 transition-colors p-1"
                              title="View Document"
                            >
                              <ArrowDownTrayIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}
          
        </div>
      </section>
    </div>
  )
}
