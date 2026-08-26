import { useEffect, useState } from 'react'
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

  const load = async () => {
    try {
      const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
      if (!error && data) {
        setInquiries(data)
      } else if (error) {
        console.warn('Inquiries Supabase fetch info:', error.message)
      }
    } catch (err) {
      console.warn('Inquiries fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('inquiries').update({ status: newStatus }).eq('id', id)
    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success('Status updated')
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i))
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-display font-black tracking-widest text-white uppercase mb-8">Inquiry Management</h1>
      
      <div className="bg-[#0f172a] border border-white/5 rounded-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Contact</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Type / Subject</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Message</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inquiries.map((req) => (
                <tr key={req.id} className="hover:bg-white/5 transition-colors align-top">
                  <td className="p-4 text-sm text-slate-300 whitespace-nowrap">{new Date(req.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="text-sm text-white font-medium">{req.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{req.email}</div>
                    <div className="text-xs text-slate-400">{req.phone || '-'}</div>
                    <div className="text-xs text-fire mt-1">{req.company_name}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-ocean mb-1">{req.inquiry_type}</div>
                    <div className="text-sm text-slate-300">{req.subject || '-'}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-400 max-w-xs truncate" title={req.message}>
                    {req.message}
                  </td>
                  <td className="p-4">
                    <select
                      value={req.status}
                      onChange={(e) => updateStatus(req.id, e.target.value)}
                      className="bg-[#020617] border border-white/10 text-white text-xs px-3 py-2 uppercase tracking-wider rounded-sm focus:outline-none focus:border-fire"
                    >
                      <option value="New">New</option>
                      <option value="Read">Read</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
