

import { Link } from 'react-router-dom'

const quickLinks = [
  { n: 'Corporate Blog', h: '/#/blog' },
  { n: 'Foreign Bidders', h: '/#/infrastructure-tender-services' },
  { n: 'Procurement', h: '/#/procurement' },
  { n: 'Verified Projects', h: '/#/projects' },
  { n: 'Group Structure', h: '/#/group-structure' },
]

const companies = [
  { n: 'Roshan Enterprises', h: '/#/companies/roshan-enterprises' },
  { n: 'Appi Saipal Financial', h: '/#/companies/appi-saipal-financial-solutions' },
  { n: 'Rosid Trade', h: '/#/companies/rosid-trade' },
  { n: 'Rosid International', h: '/#/companies/rosid-international-inc' },
  { n: 'Rosid Facility', h: '/#/companies/rosid-facility-management' },
]

export default function Footer() {
  return (
    <footer className="bg-[#030914] pt-24 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Cinematic Background Image for Footer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20 mix-blend-luminosity"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=100&w=3840&auto=format&fit=crop")' }}
      />
      {/* Heavy gradient to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#030914] via-[#030914]/90 to-[#030914]/80" />

      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-fire/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="container px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-12 mb-20">
          
          {/* Column 1: Brand Authority (Takes up 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-md shadow-lg inline-flex">
                <img src="/logo.png" alt="Rosid Syndicates Group Logo" className="h-10 w-auto object-contain" />
              </div>
              <span className="text-2xl font-display font-black tracking-[0.2em] text-white uppercase">ROSID SYNDICATES GROUP</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Connecting global expertise with Nepalese execution. An industry leader in strategic procurement, heavy infrastructure, and corporate financial advisory.
            </p>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-ink/50 border border-white/5 rounded-full text-[10px] font-bold text-slate-300 tracking-widest uppercase shadow-sm">ISO 9001:2015</span>
              <span className="px-4 py-2 bg-fire/10 border border-fire/20 rounded-full text-[10px] font-bold text-fire tracking-widest uppercase shadow-sm">Gov Verified</span>
            </div>
          </div>

          {/* Column 2: Subsidiaries */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-6 text-slate-200">Subsidiaries</h4>
            <ul className="space-y-4">
              {companies.map((c) => (
                <li key={c.n}>
                  <a href={c.h} className="text-sm font-medium text-slate-500 hover:text-fire transition-colors duration-300">
                    {c.n}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Capabilities */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-6 text-slate-200">Capabilities</h4>
            <ul className="space-y-4">
              {quickLinks.map((l) => (
                <li key={l.n}>
                  <a href={l.h} className="text-sm font-medium text-slate-500 hover:text-fire transition-colors duration-300">
                    {l.n}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Global Contact */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-6 text-slate-200">Contact</h4>
            <ul className="space-y-5 text-sm text-slate-500">
              <li className="flex items-start gap-3 group">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-fire transition-colors shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="leading-relaxed">New Baneshwor,<br />Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-3 group">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-fire transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <a href="tel:+9779705398939" className="hover:text-slate-300 transition-colors">+977-9705398939</a>
              </li>
              <li className="flex items-center gap-3 group">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-fire transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <a href="mailto:rosid2025@outlook.com" className="hover:text-slate-300 transition-colors">rosid2025@outlook.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Utility / Copyright Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-medium text-slate-600 tracking-widest uppercase">&copy; {new Date().getFullYear()} Rosid Syndicates Group. All Rights Reserved.</p>
          <div className="flex items-center gap-8 flex-wrap">
            <Link to="/corporate-profile" className="text-[11px] font-bold text-slate-500 hover:text-fire tracking-widest uppercase transition-colors">Corporate Profile</Link>
            <Link to="/privacy-policy" className="text-[11px] font-bold text-slate-500 hover:text-fire tracking-widest uppercase transition-colors">Privacy Policy</Link>
            <Link to="/terms-conditions" className="text-[11px] font-bold text-slate-500 hover:text-fire tracking-widest uppercase transition-colors">Terms & Conditions</Link>
            <Link to="/cookie-policy" className="text-[11px] font-bold text-slate-500 hover:text-fire tracking-widest uppercase transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
