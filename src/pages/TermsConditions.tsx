import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

export default function TermsConditions() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Terms & Conditions | Rosid Syndicates Group'
  }, [])

  return (
    <div className="bg-transparent min-h-screen">
      {/* Header */}
      <div className="print:hidden">
        <PageHeader 
          title="Terms & Conditions" 
          subtitle="Legal Terms of Use" 
          image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=100&w=3840&auto=format&fit=crop"
        />
      </div>

      <div className="hidden print:block print:bg-transparent print:text-ink print:py-12 border-b border-slate-200">
        <div className="container">
          <div className="max-w-3xl">
            <p className="eyebrow text-slate-500 uppercase tracking-widest mb-4">Official Legal Document</p>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">Terms & Conditions</h1>
            <p className="mt-4 text-xl text-slate-500 font-medium">Rosid Syndicates Group</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl py-16 print:py-8">
        
        {/* Notice Card */}
        <div className="mb-12 p-8 bg-white border-l-4 border-[#FD7B00] shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-[#011E52]">Legal Notice</p>
          <p className="text-slate-600 mt-2 leading-relaxed text-sm md:text-base">
            Please read these Terms and Conditions carefully before using <strong>rosid.com.np</strong>. By accessing or using this website, you agree to be bound by these terms.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-6 text-xs text-slate-500 font-medium">
            <span><strong>Last Updated:</strong> August 2026</span>
            <span><strong>Jurisdiction:</strong> Nepal</span>
            <span><strong>Website:</strong> rosid.com.np</span>
          </div>
        </div>

        <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#011E52] prose-a:text-[#FD7B00]">
          
          <h2 className="text-2xl md:text-3xl border-b border-slate-200 pb-3 mt-12 mb-6">1. Acceptance of Terms</h2>
          <p>
            By using <strong>rosid.com.np</strong>, you agree to these terms. If you do not agree to these terms, please do not use our website.
          </p>

          <h2 className="text-2xl md:text-3xl border-b border-slate-200 pb-3 mt-14 mb-6">2. Use of Website</h2>
          <p>
            Use the website only for lawful purposes. You agree not to use the website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of <strong>rosid.com.np</strong>.
          </p>

          <h2 className="text-2xl md:text-3xl border-b border-slate-200 pb-3 mt-14 mb-6">3. Intellectual Property</h2>
          <p>
            All content on this website—including text, graphics, logos, images, and corporate documents—is owned by <strong>Rosid Syndicates Group</strong> and is protected under applicable intellectual property laws.
          </p>

          <h2 className="text-2xl md:text-3xl border-b border-slate-200 pb-3 mt-14 mb-6">4. Disclaimer</h2>
          <p>
            Information on this website is provided <strong>"as is"</strong> without warranties of any kind, either express or implied.
          </p>

          <h2 className="text-2xl md:text-3xl border-b border-slate-200 pb-3 mt-14 mb-6">5. Limitation of Liability</h2>
          <p>
            <strong>Rosid Syndicates Group</strong> is not liable for damages from website use or inability to use this website.
          </p>

          <h2 className="text-2xl md:text-3xl border-b border-slate-200 pb-3 mt-14 mb-6">6. Governing Law</h2>
          <p>
            These terms are governed by the laws of <strong>Nepal</strong>.
          </p>

          <h2 className="text-2xl md:text-3xl border-b border-slate-200 pb-3 mt-14 mb-6">7. Contact Us</h2>
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
            <Link to="/cookie-policy" className="text-[#FD7B00] font-bold hover:underline">View Cookie Policy &rarr;</Link>
          </div>

        </article>
      </div>
    </div>
  )
}
