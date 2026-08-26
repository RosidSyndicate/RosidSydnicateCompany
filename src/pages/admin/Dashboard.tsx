import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    totalInquiries: 0, 
    newInquiries: 0, 
    contactedInquiries: 0,
    closedInquiries: 0,
    totalCompanies: 0 
  })
  const [recent, setRecent] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { count: totalInquiries } = await supabase.from('inquiries').select('*', { count: 'exact', head: true })
      const { count: newInquiries } = await supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'New')
      const { count: contactedInquiries } = await supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'Contacted')
      const { count: closedInquiries } = await supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'Closed')
      const { count: totalCompanies } = await supabase.from('companies').select('*', { count: 'exact', head: true }).eq('is_archived', false)
      
      const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5)
      
      setStats({
        totalInquiries: totalInquiries || 0,
        newInquiries: newInquiries || 0,
        contactedInquiries: contactedInquiries || 0,
        closedInquiries: closedInquiries || 0,
        totalCompanies: totalCompanies || 0
      })
      setRecent(data || [])
    }
    load()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-display font-black tracking-widest text-white uppercase mb-8">Corporate Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
        <div className="bg-[#0f172a] border border-white/5 p-6 rounded-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Total Inquiries</p>
          <p className="text-4xl font-display font-bold text-white">{stats.totalInquiries}</p>
        </div>
        <div className="bg-fire/10 border border-fire/20 p-6 rounded-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-fire mb-2">New</p>
          <p className="text-4xl font-display font-bold text-fire">{stats.newInquiries}</p>
        </div>
        <div className="bg-ocean/10 border border-ocean/20 p-6 rounded-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-ocean mb-2">Contacted</p>
          <p className="text-4xl font-display font-bold text-ocean">{stats.contactedInquiries}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Closed</p>
          <p className="text-4xl font-display font-bold text-slate-400">{stats.closedInquiries}</p>
        </div>
        <div className="bg-[#0f172a] border border-white/5 p-6 rounded-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Subsidiaries</p>
          <p className="text-4xl font-display font-bold text-white">{stats.totalCompanies}</p>
        </div>
      </div>

      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Recent Global Inquiries</h2>
      <div className="bg-[#0f172a] border border-white/5 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Name</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Company</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Type</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {recent.map((req) => (
              <tr key={req.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-sm text-slate-300">{new Date(req.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-sm text-white font-medium">{req.name}</td>
                <td className="p-4 text-sm text-slate-300">{req.company_name || '-'}</td>
                <td className="p-4 text-sm text-slate-300 uppercase">{req.inquiry_type}</td>
                <td className="p-4">
                  <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                    req.status === 'New' ? 'bg-fire/20 text-fire' : 'bg-white/10 text-slate-300'
                  }`}>
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No inquiries found in database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
