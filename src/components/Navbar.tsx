import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { n: 'About', to: 'about' },
  { 
    n: 'Our Group', 
    dropdown: [
      { n: 'Subsidiaries', to: 'companies-route' },
      { n: 'Group Structure', to: 'group-structure-route' },
      { n: 'Credentials', to: 'credentials-route' }
    ]
  },
  {
    n: 'Capabilities',
    dropdown: [
      { n: 'Foreign Bidders', to: 'infrastructure-tender-services-route' },
      { n: 'Procurement', to: 'procurement-route' },
      { n: 'Projects', to: 'projects-route' }
    ]
  },
  { n: 'Blog', to: 'blog-route' }
]

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const nav = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', h, { passive: true })
    h()
    return () => window.removeEventListener('scroll', h)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    if (id === 'companies-route') {
      nav('/companies')
      window.scrollTo(0, 0)
      return
    }
    if (id === 'infrastructure-tender-services-route') {
      nav('/infrastructure-tender-services')
      window.scrollTo(0, 0)
      return
    }
    if (id === 'projects-route') {
      nav('/projects')
      window.scrollTo(0, 0)
      return
    }
    if (id === 'procurement-route') {
      nav('/procurement')
      window.scrollTo(0, 0)
      return
    }
    if (id === 'group-structure-route') {
      nav('/group-structure')
      window.scrollTo(0, 0)
      return
    }
    if (id === 'credentials-route') {
      nav('/credentials')
      window.scrollTo(0, 0)
      return
    }
    if (id === 'blog-route') {
      nav('/blog')
      window.scrollTo(0, 0)
      return
    }
    
    if (location.pathname !== '/') {
      nav('/')
      setTimeout(() => scrollTo(id), 100)
    } else {
      scrollTo(id)
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-200/50 ${
          scrolled ? 'shadow-lg py-3' : 'shadow-sm py-5'
        }`}
      >
        <nav className="px-6 lg:px-12 flex items-center justify-between max-w-[1920px] mx-auto">
          {/* Logo */}
          <a href="/#" className="flex items-center gap-4 group" onClick={(e) => { e.preventDefault(); nav('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            <img 
              src="/logo.png" 
              alt="Rosid Syndicates Group" 
              className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
                scrolled ? 'h-11' : 'h-14'
              }`} 
            />
            <span className="text-xl font-display font-black tracking-widest uppercase hidden xl:block mt-1 text-[#011E52] transition-colors duration-300">
              ROSID
            </span>
          </a>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            {links.map((l) => (
              <div key={l.n} className="relative group py-2">
                {l.dropdown ? (
                  <>
                    <button className="flex items-center gap-1.5 text-[12px] font-bold transition-colors cursor-pointer uppercase tracking-wider text-[#011E52] group-hover:text-[#FD7B00]">
                      {l.n}
                      <svg className="w-3 h-3 transform group-hover:-rotate-180 transition-all duration-300 text-[#011E52]/50 group-hover:text-[#FD7B00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-4 w-56 bg-white border border-slate-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex flex-col py-2 rounded-sm z-50">
                      {l.dropdown.map(drop => (
                        <button
                          key={drop.n}
                          onClick={() => go(drop.to)}
                          className="text-left px-6 py-3 text-[11px] font-bold text-[#1a1a1a] hover:bg-[#F4F4F2] hover:text-[#FD7B00] transition-colors uppercase tracking-widest w-full"
                        >
                          {drop.n}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => go(l.to)}
                    className="flex items-center gap-1.5 text-[12px] font-bold transition-colors cursor-pointer uppercase tracking-wider text-[#011E52] hover:text-[#FD7B00]"
                  >
                    {l.n}
                  </button>
                )}
                {/* Premium slide-out underline effect */}
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#FD7B00] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </div>
            ))}
          </div>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => go('contact')}
              className="px-8 py-3 text-[11px] font-black transition-all duration-300 cursor-pointer uppercase tracking-widest rounded-sm shadow-md hover:shadow-lg bg-[#011E52] text-white hover:bg-[#FD7B00]"
            >
              Contact Us
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 transition-colors duration-300 text-[#011E52]" 
            onClick={() => setOpen(!open)} 
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <div className="flex flex-col gap-1.5">
              <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 8 : 0 }} className="block w-6 h-[2px] bg-current" />
              <motion.span animate={{ opacity: open ? 0 : 1 }} className="block w-6 h-[2px] bg-current" />
              <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -8 : 0 }} className="block w-6 h-[2px] bg-current" />
            </div>
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden overflow-hidden bg-white border-t border-slate-200 shadow-2xl">
              <div className="container py-6 space-y-2">
                {links.map((l) => (
                  <div key={l.n} className="w-full">
                    {l.dropdown ? (
                      <div className="flex flex-col space-y-1 py-2">
                        <span className="block w-full text-left py-2 px-4 text-xs font-bold text-[#011E52]/40 uppercase tracking-wider">{l.n}</span>
                        {l.dropdown.map(drop => (
                          <button key={drop.n} onClick={() => go(drop.to)} className="block w-full text-left py-3 pl-8 text-xs font-bold text-[#011E52] hover:text-[#FD7B00] rounded-sm transition-colors cursor-pointer uppercase tracking-wider">
                            — {drop.n}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button onClick={() => go(l.to)} className="block w-full text-left py-3 text-xs font-bold text-[#011E52] hover:text-[#FD7B00] px-4 rounded-sm transition-colors cursor-pointer uppercase tracking-wider">
                        {l.n}
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => go('contact')} className="block w-full mt-6 text-center py-4 font-black bg-[#011E52] text-white hover:bg-[#FD7B00] transition-colors cursor-pointer uppercase tracking-widest text-xs rounded-sm shadow-lg">
                  Contact Us
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
