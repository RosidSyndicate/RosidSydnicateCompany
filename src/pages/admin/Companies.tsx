import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { companies as INITIAL_COMPANIES } from '../../data/companies'
import toast from 'react-hot-toast'

type Company = {
  id: string
  name: string
  slug: string
  description: string
  is_archived: boolean
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>(() => 
    INITIAL_COMPANIES.map((c, i) => ({
      id: `local-${i}`,
      name: c.name,
      slug: c.slug,
      description: c.shortDescription || c.coreScope,
      is_archived: false
    }))
  )
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Company | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newCompany, setNewCompany] = useState({ name: '', slug: '', description: '' })

  const load = async () => {
    try {
      const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: true })
      if (!error && data && data.length > 0) {
        setCompanies(data)
      } else if (error) {
        console.warn('Companies Supabase fetch info:', error.message)
      }
    } catch (err: any) {
      console.warn('Companies fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const toggleArchive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('companies').update({ is_archived: !currentStatus }).eq('id', id)
    if (error) toast.error('Failed to update status')
    else load()
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    const { error } = await supabase.from('companies').update({
      name: editing.name,
      description: editing.description
    }).eq('id', editing.id)
    
    if (error) {
      toast.error('Save failed')
    } else {
      toast.success('Company updated')
      setEditing(null)
      load()
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompany.name || !newCompany.slug) {
      toast.error('Name and URL slug are required')
      return
    }
    const { error } = await supabase.from('companies').insert({
      name: newCompany.name,
      slug: newCompany.slug,
      description: newCompany.description
    })
    
    if (error) {
      toast.error('Creation failed: ' + error.message)
    } else {
      toast.success('Company created')
      setIsCreating(false)
      setNewCompany({ name: '', slug: '', description: '' })
      load()
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-display font-black tracking-widest text-white uppercase">Subsidiary Management</h1>
        <button onClick={() => setIsCreating(true)} className="px-6 py-3 bg-fire text-[#0f172a] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-fire-100 transition-colors">
          Add Company
        </button>
      </div>
      
      {isCreating ? (
        <div className="bg-[#0f172a] border border-white/5 p-6 rounded-sm mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-fire mb-4">Create New Subsidiary</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Company Name</label>
              <input type="text" required value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})} className="w-full bg-[#020617] border border-white/10 text-white px-4 py-2 focus:border-fire outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">URL Slug (e.g. roshan-enterprises)</label>
              <input type="text" required value={newCompany.slug} onChange={e => setNewCompany({...newCompany, slug: e.target.value})} className="w-full bg-[#020617] border border-white/10 text-white px-4 py-2 focus:border-fire outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Description / Core Scope</label>
              <textarea value={newCompany.description} onChange={e => setNewCompany({...newCompany, description: e.target.value})} className="w-full bg-[#020617] border border-white/10 text-white px-4 py-2 h-24 focus:border-fire outline-none" />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="px-6 py-3 bg-fire text-[#0f172a] text-xs font-bold uppercase tracking-widest rounded-sm">Create Company</button>
              <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white/5">Cancel</button>
            </div>
          </form>
        </div>
      ) : null}

      {editing ? (
        <div className="bg-[#0f172a] border border-white/5 p-6 rounded-sm mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-fire mb-4">Edit Subsidiary</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Company Name</label>
              <input type="text" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full bg-[#020617] border border-white/10 text-white px-4 py-2 focus:border-fire outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Description / Core Scope</label>
              <textarea value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} className="w-full bg-[#020617] border border-white/10 text-white px-4 py-2 h-24 focus:border-fire outline-none" />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="px-6 py-3 bg-fire text-[#0f172a] text-xs font-bold uppercase tracking-widest rounded-sm">Save Changes</button>
              <button type="button" onClick={() => setEditing(null)} className="px-6 py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white/5">Cancel</button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          companies.map(c => (
            <div key={c.id} className={`p-6 border rounded-sm transition-colors ${c.is_archived ? 'bg-white/5 border-white/5 opacity-50' : 'bg-[#0f172a] border-white/10'}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white leading-tight">{c.name}</h3>
                <span className={`text-[10px] px-2 py-1 uppercase tracking-wider font-bold rounded-sm ${c.is_archived ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                  {c.is_archived ? 'Archived' : 'Active'}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-6">{c.description}</p>
              <div className="flex gap-3">
                <button onClick={() => setEditing(c)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white rounded-sm transition-colors">Edit</button>
                <button onClick={() => toggleArchive(c.id, c.is_archived)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-fire text-slate-400 hover:text-fire rounded-sm transition-colors">
                  {c.is_archived ? 'Restore' : 'Archive'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
