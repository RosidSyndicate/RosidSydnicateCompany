import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PhoneIcon,
  BuildingOffice2Icon,
  TrashIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  InboxIcon
} from '@heroicons/react/24/outline'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

type Inquiry = {
  id: string
  inquiry_type: string
  name: string
  company_name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
  created_at: string
}

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const load = async (showToast = false) => {
    if (showToast) setRefreshing(true)
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setInquiries(data)
        if (showToast) toast.success(`Loaded ${data.length} inquiries`)
      } else if (error) {
        console.warn('Inquiries Supabase notice:', error.message)
      }
    } catch (err: any) {
      console.warn('Inquiries fetch error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('inquiries').update({ status: newStatus }).eq('id', id)
      if (error) {
        console.warn('Status update notice:', error.message)
      }
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i))
      toast.success(`Inquiry marked as ${newStatus}`)
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const deleteInquiry = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete inquiry from "${name}"?`)) return
    try {
      const { error } = await supabase.from('inquiries').delete().eq('id', id)
      if (error) {
        console.warn('Delete notice:', error.message)
      }
      setInquiries(inquiries.filter(i => i.id !== id))
      toast.success('Inquiry deleted')
    } catch (err) {
      toast.error('Failed to delete inquiry')
    }
  }

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = 
      (i.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.company_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.message || '').toLowerCase().includes(search.toLowerCase())

    const matchesStatus = filterStatus === 'all' || (i.status || '').toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 bg-[#F8FAFC] min-h-screen">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#011E52] tracking-tight uppercase">
            Inquiry & Tender Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review incoming tender RFQs, foreign contractor requests, and corporate inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#011E52] shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          <Link
            to="/tender-inquiry"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FD7B00] hover:bg-[#E06A00] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            <PlusIcon className="w-4 h-4" />
            Test Form
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['all', 'New', 'Contacted', 'Read', 'Closed'].map((st) => {
            const count = st === 'all' 
              ? inquiries.length 
              : inquiries.filter(i => (i.status || '').toLowerCase() === st.toLowerCase()).length
            
            const isActive = filterStatus.toLowerCase() === st.toLowerCase()
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#011E52] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'All' : st} ({count})
              </button>
            )
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-[#FD7B00]"
          />
        </div>
      </div>

      {/* Inquiries Table or Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-[#FD7B00] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Fetching inquiries from database...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <InboxIcon className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-700">No Inquiries Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {search || filterStatus !== 'all' 
                  ? 'No inquiries match your current search or filter criteria.' 
                  : 'New submissions from the Contact Us or Tender Inquiry forms will appear here in real-time.'}
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/#contact"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#011E52] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#FD7B00] transition-colors"
              >
                <PlusIcon className="w-4 h-4" /> Submit Sample Inquiry
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#011E52] text-white text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Client / Contact Details</th>
                  <th className="p-4">Type / Scope</th>
                  <th className="p-4">Message Content</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors align-top">
                    
                    {/* Contact Col */}
                    <td className="p-4 pl-6">
                      <div className="text-sm font-bold text-[#011E52]">{req.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{req.email}</div>
                      {req.phone && (
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <PhoneIcon className="w-3 h-3" /> {req.phone}
                        </div>
                      )}
                      {req.company_name && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                          <BuildingOffice2Icon className="w-3 h-3 text-[#FD7B00]" />
                          {req.company_name}
                        </span>
                      )}
                    </td>

                    {/* Inquiry Type Col */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 bg-[#011E52]/10 text-[#011E52] text-xs font-bold uppercase tracking-wide rounded-md">
                        {req.inquiry_type || 'General'}
                      </span>
                      {req.subject && req.subject !== req.inquiry_type && (
                        <div className="text-xs font-medium text-slate-600 mt-1 truncate max-w-[180px]" title={req.subject}>
                          {req.subject}
                        </div>
                      )}
                    </td>

                    {/* Message Col */}
                    <td className="p-4 max-w-md">
                      <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {req.message}
                      </p>
                    </td>

                    {/* Date Col */}
                    <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                      <div className="font-medium text-slate-700">
                        {new Date(req.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(req.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4 whitespace-nowrap">
                      <select
                        value={req.status || 'New'}
                        onChange={(e) => updateStatus(req.id, e.target.value)}
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border focus:outline-none transition-colors cursor-pointer ${
                          req.status === 'New'
                            ? 'bg-amber-50 text-amber-800 border-amber-200 focus:border-amber-400'
                            : req.status === 'Contacted'
                            ? 'bg-sky-50 text-sky-800 border-sky-200 focus:border-sky-400'
                            : req.status === 'Read'
                            ? 'bg-purple-50 text-purple-800 border-purple-200 focus:border-purple-400'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200 focus:border-emerald-400'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Read">Read</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => deleteInquiry(req.id, req.name)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete Inquiry"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
