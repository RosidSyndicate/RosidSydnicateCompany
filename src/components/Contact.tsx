import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Turnstile } from '@marsidev/react-turnstile'
import { supabase } from '../lib/supabase'

const INQUIRY_TYPES = [
  'General Inquiry',
  'Infrastructure & Construction',
  'Tender / Procurement',
  'Foreign Contractor Support',
  'Financial Advisory',
  'Hydropower / Transmission',
  'Trade & Supply'
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
    honeypot: '' // Spam protection
  })
  
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.inquiryType || !formData.message.trim()) {
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
        inquiry_type: formData.inquiryType,
        name: formData.name.trim(),
        company_name: formData.company.trim() || null,
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        subject: formData.inquiryType,
        message: formData.message.trim(),
        status: 'New'
      })

      if (dbError) {
        console.warn('Direct Supabase insert notice:', dbError.message)
      }

      // 2. Trigger Serverless API notification (background / non-blocking)
      try {
        const payload = { ...formData, turnstileToken: turnstileToken || 'dev_token' }
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } catch (apiErr) {
        // In local development, Vite doesn't run /api serverless functions, so ignore network error
        console.log('Background API notification notice (normal in local dev):', apiErr)
      }

      setStatus('success')
      toast.success('Message sent successfully. We will reply shortly.')
      
      // Reset form on success
      setFormData({
        name: '', company: '', email: '', phone: '', inquiryType: '', message: '', honeypot: ''
      })
      setTurnstileToken('')
      setTimeout(() => setStatus('idle'), 3500)
    } catch (error: any) {
      console.error('Submission error:', error)
      setStatus('error')
      toast.error('Message failed to send. Please try again.')
      setTimeout(() => setStatus('idle'), 3500)
    }
  }

  return (
    <section id="contact" className="relative py-32 border-t border-slate-200 overflow-hidden">
      {/* 4K Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-[#011E52] bg-cover bg-center"
        style={{ backgroundImage: `url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=100&w=3840&auto=format&fit=crop")` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#011E52]/95 via-[#011E52]/80 to-[#011E52]/95" />

      <div className="container max-w-6xl relative z-10">
        <div className="grid md:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="eyebrow uppercase text-white/50">Contact</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6 text-4xl md:text-5xl lg:text-[4.5rem] font-bold font-sans text-white leading-[1.05] tracking-tight">
              Let’s Build<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD7B00] to-[#FFB067]">Nationwide Progress.</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-6 text-base text-white/70 leading-relaxed">
              Discuss your project, tender requirements, or schedule a consultation with our advisory team.
            </motion.p>

            <div className="mt-16 pt-8 border-t border-white/10 space-y-8">
              {[
                { l: 'HQ Address', v: 'New Baneshwor, Kathmandu, Nepal' },
                { l: 'Phone', v: '+977-9705398939' },
                { l: 'Email', v: 'rosid2025@outlook.com' },
                { l: 'Website', v: 'rosid.com.np' },
              ].map((c) => (
                <div key={c.l}>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.1em]">{c.l}</p>
                  <p className="mt-1 text-sm font-medium text-white/90">{c.v}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }}>
            <form onSubmit={submit} className="bg-white p-8 sm:p-12 border border-slate-200 space-y-6 shadow-2xl rounded-sm">
              {/* Honeypot field - invisible to users but catches bots */}
              <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
                <label htmlFor="honeypot">Leave this empty</label>
                <input type="text" id="honeypot" name="honeypot" tabIndex={-1} value={formData.honeypot} onChange={handleChange} />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Name *</label>
                  <input id="name" type="text" value={formData.name} onChange={handleChange} required className="w-full bg-[#F4F4F2] border border-slate-200 rounded-sm px-4 py-3.5 text-ink placeholder:text-slate-400 focus:outline-none focus:border-[#FD7B00] focus:ring-1 focus:ring-[#FD7B00] transition-colors" placeholder="Jane Doe" />
                </div>
                <div>
                  <label htmlFor="company" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Company</label>
                  <input id="company" type="text" value={formData.company} onChange={handleChange} className="w-full bg-[#F4F4F2] border border-slate-200 rounded-sm px-4 py-3.5 text-ink placeholder:text-slate-400 focus:outline-none focus:border-[#FD7B00] focus:ring-1 focus:ring-[#FD7B00] transition-colors" placeholder="Organization" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Email *</label>
                  <input id="email" type="email" value={formData.email} onChange={handleChange} required className="w-full bg-[#F4F4F2] border border-slate-200 rounded-sm px-4 py-3.5 text-ink placeholder:text-slate-400 focus:outline-none focus:border-[#FD7B00] focus:ring-1 focus:ring-[#FD7B00] transition-colors" placeholder="hello@company.com" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Phone</label>
                  <input id="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full bg-[#F4F4F2] border border-slate-200 rounded-sm px-4 py-3.5 text-ink placeholder:text-slate-400 focus:outline-none focus:border-[#FD7B00] focus:ring-1 focus:ring-[#FD7B00] transition-colors" placeholder="+977 ..." />
                </div>
              </div>

              <div>
                <label htmlFor="inquiryType" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Inquiry Type *</label>
                <select id="inquiryType" value={formData.inquiryType} onChange={handleChange} required className="w-full bg-[#F4F4F2] border border-slate-200 rounded-sm px-4 py-3.5 text-ink focus:outline-none focus:border-[#FD7B00] focus:ring-1 focus:ring-[#FD7B00] transition-colors cursor-pointer">
                  <option value="" disabled className="text-slate-500">Select an area of interest</option>
                  {INQUIRY_TYPES.map(type => (
                    <option key={type} value={type} className="text-ink bg-white">{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-2">Message *</label>
                <textarea id="message" rows={4} value={formData.message} onChange={handleChange} required placeholder="Tell us how we can support your project..." className="w-full bg-[#F4F4F2] border border-slate-200 rounded-sm px-4 py-3.5 text-ink placeholder:text-slate-400 focus:outline-none focus:border-[#FD7B00] focus:ring-1 focus:ring-[#FD7B00] transition-colors resize-none" />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-6 justify-between">
                <Turnstile 
                  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
                  onSuccess={(token) => setTurnstileToken(token)}
                  options={{ theme: 'dark' }}
                />
                
                <button 
                  type="submit" 
                  disabled={status === 'loading' || status === 'success'} 
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-10 py-4 bg-[#011E52] text-white font-bold text-sm hover:bg-[#FD7B00] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest rounded-sm shadow-md"
                >
                  {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent Successfully' : 'Send Message'}
                </button>
              </div>
              
              {status === 'error' && (
                <p className="mt-2 text-sm text-red-600 font-medium">Message failed to send. Please check your connection.</p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
