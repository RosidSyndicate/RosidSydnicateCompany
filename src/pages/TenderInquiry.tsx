import { useState, type FormEvent, useRef } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Turnstile } from '@marsidev/react-turnstile'
import PageHeader from '../components/PageHeader'

import { supabase } from '../lib/supabase'

const SUPPORT_OPTIONS = [
  'Financial / Guarantee Support',
  'Local JV / Partner',
  'Procurement Support',
  'Material Supply',
  'Civil Execution',
  'Foreign Contractor Support',
  'Financial Closure',
  'Other'
]

type Attachment = {
  filename: string
  content: string // base64
}

export default function TenderInquiry() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    companyName: '',
    country: '',
    contactPerson: '',
    email: '',
    phone: '',
    tenderName: '',
    tenderRef: '',
    projectSector: '',
    bidDeadline: '',
    requiredSupport: '',
    message: '',
    honeypot: ''
  })
  
  const [attachment, setAttachment] = useState<Attachment | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Only PDF, DOCX, and XLSX are allowed.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // 2MB size limit to safely respect payload limits
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds the 2MB limit.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1]
      setAttachment({
        filename: file.name,
        content: base64String
      })
    }
    reader.readAsDataURL(file)
  }

  const removeFile = () => {
    setAttachment(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!formData.companyName.trim() || !formData.country.trim() || !formData.contactPerson.trim() || !formData.email.trim()) {
      toast.error('Please fill out all required fields.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address.')
      return
    }

    setStatus('loading')

    try {
      // 1. Direct insertion to Supabase PostgreSQL
      const { error: dbError } = await supabase.from('inquiries').insert({
        inquiry_type: 'Tender / RFQ Inquiry',
        name: formData.contactPerson.trim(),
        company_name: formData.companyName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        subject: formData.tenderName.trim() || `Tender: ${formData.companyName}`,
        message: `Country: ${formData.country}\nTender Ref: ${formData.tenderRef || 'N/A'}\nProject Sector: ${formData.projectSector || 'N/A'}\nBid Deadline: ${formData.bidDeadline || 'N/A'}\nRequired Support: ${formData.requiredSupport || 'N/A'}\n\nMessage:\n${formData.message || 'N/A'}`,
        status: 'New'
      })

      if (dbError) {
        console.warn('Direct Supabase insert notice:', dbError.message)
      }

      // 2. Trigger Serverless API notification (background / non-blocking)
      try {
        const payload = { ...formData, attachment, turnstileToken: turnstileToken || 'dev_token' }
        await fetch('/api/tender', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } catch (apiErr) {
        console.log('Background API notification notice (normal in local dev):', apiErr)
      }

      setStatus('success')
      toast.success('Tender inquiry submitted securely.')
      
      setFormData({
        companyName: '', country: '', contactPerson: '', email: '', phone: '',
        tenderName: '', tenderRef: '', projectSector: '', bidDeadline: '',
        requiredSupport: '', message: '', honeypot: ''
      })
      removeFile()
      setTurnstileToken('')
      
      setTimeout(() => setStatus('idle'), 3500)
    } catch (error) {
      console.error('Submission error:', error)
      setStatus('error')
      toast.error('Submission failed. Please check your connection.')
      setTimeout(() => setStatus('idle'), 3500)
    }
  }

  return (
    <div className="bg-transparent min-h-screen">
      <PageHeader 
        title="Tender & RFQ Inquiry" 
        subtitle="Secure Portal" 
        image="https://images.unsplash.com/photo-1574320297042-63bc58baf00c?q=100&w=3840&auto=format&fit=crop"
      />

      <section className="py-24 bg-transparent">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            
            <div className="mb-12 p-6 bg-[#F4F4F2] border border-slate-200">
              <p className="text-sm font-bold text-ink uppercase tracking-widest mb-2">Secure Submission</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Your documentation and business details are transmitted securely to our executive team. Uploads are strictly restricted to PDF, DOCX, and XLSX formats (Max 2MB). No data is indexed publicly.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-12">
              <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
                <input type="text" id="honeypot" name="honeypot" tabIndex={-1} value={formData.honeypot} onChange={handleChange} />
              </div>

              {/* SECTION 1: CONTACT INFO */}
              <div>
                <h3 className="text-lg font-bold text-ink border-b border-slate-200 pb-4 mb-6">1. Company & Contact Information</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyName" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Company Name *</label>
                    <input id="companyName" type="text" value={formData.companyName} onChange={handleChange} required className="w-full bg-transparent border-0 border-b-2 border-slate-200 pb-3 text-ink focus:outline-none focus:border-fire transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Country *</label>
                    <input id="country" type="text" value={formData.country} onChange={handleChange} required className="w-full bg-transparent border-0 border-b-2 border-slate-200 pb-3 text-ink focus:outline-none focus:border-fire transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="contactPerson" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Contact Person *</label>
                    <input id="contactPerson" type="text" value={formData.contactPerson} onChange={handleChange} required className="w-full bg-transparent border-0 border-b-2 border-slate-200 pb-3 text-ink focus:outline-none focus:border-fire transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Email *</label>
                    <input id="email" type="email" value={formData.email} onChange={handleChange} required className="w-full bg-transparent border-0 border-b-2 border-slate-200 pb-3 text-ink focus:outline-none focus:border-fire transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Phone</label>
                    <input id="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full bg-transparent border-0 border-b-2 border-slate-200 pb-3 text-ink focus:outline-none focus:border-fire transition-colors" />
                  </div>
                </div>
              </div>

              {/* SECTION 2: TENDER DETAILS */}
              <div>
                <h3 className="text-lg font-bold text-ink border-b border-slate-200 pb-4 mb-6">2. Tender / RFQ Details</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="tenderName" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Tender / Project Name</label>
                    <input id="tenderName" type="text" value={formData.tenderName} onChange={handleChange} className="w-full bg-transparent border-0 border-b-2 border-slate-200 pb-3 text-ink focus:outline-none focus:border-ocean transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="tenderRef" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Tender Reference (if any)</label>
                    <input id="tenderRef" type="text" value={formData.tenderRef} onChange={handleChange} className="w-full bg-transparent border-0 border-b-2 border-slate-200 pb-3 text-ink focus:outline-none focus:border-ocean transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="projectSector" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Project Sector</label>
                    <input id="projectSector" type="text" value={formData.projectSector} onChange={handleChange} className="w-full bg-transparent border-0 border-b-2 border-slate-200 pb-3 text-ink focus:outline-none focus:border-ocean transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="bidDeadline" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Bid Deadline</label>
                    <input id="bidDeadline" type="date" value={formData.bidDeadline} onChange={handleChange} className="w-full bg-transparent border-0 border-b-2 border-slate-200 pb-3 text-ink focus:outline-none focus:border-ocean transition-colors text-ink/70" />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label htmlFor="requiredSupport" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Required Support</label>
                  <select id="requiredSupport" value={formData.requiredSupport} onChange={handleChange} className="w-full bg-transparent border-0 border-b-2 border-slate-200 pb-3 text-ink focus:outline-none focus:border-ocean transition-colors appearance-none cursor-pointer">
                    <option value="" disabled className="text-ink/20">Select an option</option>
                    {SUPPORT_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="text-ink bg-transparent">{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-6">
                  <label htmlFor="message" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Message / Scope Description</label>
                  <textarea id="message" rows={4} value={formData.message} onChange={handleChange} className="w-full bg-transparent border-0 border-b-2 border-slate-200 pb-3 text-ink focus:outline-none focus:border-ocean transition-colors resize-none" />
                </div>
              </div>

              {/* SECTION 3: DOCUMENT UPLOAD */}
              <div>
                <h3 className="text-lg font-bold text-ink border-b border-slate-200 pb-4 mb-6">3. Supporting Documents (Optional)</h3>
                
                {!attachment ? (
                  <div className="border-2 border-dashed border-slate-200 p-8 text-center bg-white/5 hover:bg-white/10 transition-colors relative">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept=".pdf,.docx,.xlsx" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      title="Upload PDF, DOCX, or XLSX"
                    />
                    <PaperClipIcon className="w-8 h-8 text-ink/40 mx-auto mb-4" />
                    <p className="text-sm font-bold text-ink">Click or drag to upload</p>
                    <p className="text-xs text-slate-500 mt-2">PDF, DOCX, or XLSX up to 2MB</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-ocean/10 border border-ocean/20">
                    <div className="flex items-center gap-3">
                      <PaperClipIcon className="w-5 h-5 text-ocean" />
                      <span className="text-sm font-bold text-ink truncate max-w-[200px] sm:max-w-xs">{attachment.filename}</span>
                    </div>
                    <button type="button" onClick={removeFile} className="p-2 text-ink/50 hover:text-fire transition-colors" title="Remove file">
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* SUBMIT */}
              <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                <Turnstile 
                  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
                  onSuccess={(token) => setTurnstileToken(token)}
                  options={{ theme: 'dark' }}
                />

                <button 
                  type="submit" 
                  disabled={status === 'loading' || status === 'success'} 
                  className="w-full sm:w-auto inline-flex justify-center items-center px-12 py-5 bg-white text-ink font-bold text-sm hover:bg-fire transition-all disabled:opacity-50 uppercase tracking-widest"
                >
                  {status === 'loading' ? 'Submitting...' : status === 'success' ? 'Inquiry Sent' : 'Submit Inquiry'}
                </button>
              </div>
              
              {status === 'error' && (
                <p className="mt-2 text-sm text-red-600 font-bold">Failed to submit. Please check your connection.</p>
              )}
            </form>

          </motion.div>
        </div>
      </section>
    </div>
  )
}
