import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

export default function CookiePolicy() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Cookie Policy | Rosid Syndicates Group'
  }, [])

  return (
    <div className="bg-transparent min-h-screen">
      {/* Header */}
      <div className="print:hidden">
        <PageHeader 
          title="Cookie Policy" 
          subtitle="Web Security & Preferences" 
          image="https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=100&w=3840&auto=format&fit=crop"
        />
      </div>

      <div className="hidden print:block print:bg-transparent print:text-ink print:py-12 border-b border-slate-200">
        <div className="container">
          <div className="max-w-3xl">
            <p className="eyebrow text-slate-500 uppercase tracking-widest mb-4">Web Security Document</p>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">Cookie Policy</h1>
            <p className="mt-4 text-xl text-slate-500 font-medium">Rosid Syndicates Group</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl py-16 print:py-8">
        
        {/* Notice Card */}
        <div className="mb-12 p-8 bg-white border-l-4 border-[#FD7B00] shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-[#011E52]">Transparency on Tracking</p>
          <p className="text-slate-600 mt-2 leading-relaxed text-sm md:text-base">
            This Cookie Policy explains how <strong>Rosid Syndicates Group</strong> (rosid.com.np) uses cookies and similar technologies on your device.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-6 text-xs text-slate-500 font-medium">
            <span><strong>Last Updated:</strong> August 2026</span>
            <span><strong>Jurisdiction:</strong> Nepal</span>
            <span><strong>Website:</strong> rosid.com.np</span>
          </div>
        </div>

        <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#011E52] prose-a:text-[#FD7B00]">
          
          <h2 className="text-2xl md:text-3xl border-b border-slate-200 pb-3 mt-12 mb-6">What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device.
          </p>

          <h2 className="text-2xl md:text-3xl border-b border-slate-200 pb-3 mt-14 mb-6">How We Use Cookies</h2>
          <p>We use cookies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Ensure website functionality</li>
            <li>Analyze traffic</li>
            <li>Remember preferences</li>
          </ul>

          <h2 className="text-2xl md:text-3xl border-b border-slate-200 pb-3 mt-14 mb-6">Types of Cookies</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Essential:</strong> Required for operation</li>
            <li><strong>Analytics:</strong> Traffic analysis</li>
            <li><strong>Preference:</strong> User settings</li>
          </ol>

          <h2 className="text-2xl md:text-3xl border-b border-slate-200 pb-3 mt-14 mb-6">Managing Cookies</h2>
          <p>
            Control cookies through your browser settings.
          </p>

          <h2 className="text-2xl md:text-3xl border-b border-slate-200 pb-3 mt-14 mb-6">Contact Us</h2>
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm not-prose text-ink space-y-2">
            <p className="text-lg font-bold text-[#011E52]">Rosid Syndicates Group</p>
            <p><strong>Address:</strong> New Baneshwor, Kathmandu, Nepal</p>
            <p><strong>Email:</strong> <a href="mailto:rosid2025@outlook.com" className="text-[#FD7B00] font-bold">rosid2025@outlook.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+9779705398939" className="text-[#011E52] font-semibold">+977-9705398939</a></p>
            <p><strong>Website:</strong> <a href="https://rosid.com.np" target="_blank" rel="noopener" className="text-[#011E52] font-bold">rosid.com.np</a></p>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap gap-4 text-sm not-prose">
            <Link to="/privacy-policy" className="text-[#FD7B00] font-bold hover:underline">&larr; View Privacy Policy</Link>
            <span className="text-slate-300">|</span>
            <Link to="/terms-conditions" className="text-[#FD7B00] font-bold hover:underline">View Terms & Conditions &rarr;</Link>
          </div>

        </article>
      </div>
    </div>
  )
}
