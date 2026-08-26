import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function Content() {
  const [content, setContent] = useState<Record<string, string>>({
    mission: "To accelerate Nepal's industrial transformation by integrating sovereign financial engineering, tier-one infrastructure construction, and resilient international supply chains under one trusted group structure.",
    vision: "To be the preeminent corporate conglomerate and partner of choice for foreign EPC contractors, sovereign institutions, and multilateral investors driving South Asia's sustainable development.",
    core_values: "Institutional Integrity, Engineering Precision, Financial Reliability, and Sovereign Stewardship."
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const { data, error } = await supabase.from('site_content').select('*')
      if (!error && data && data.length > 0) {
        const map: Record<string, string> = {}
        data.forEach(d => map[d.section_key] = d.content)
        setContent(prev => ({ ...prev, ...map }))
      } else if (error) {
        console.warn('Site content fetch info:', error.message)
      }
    } catch (err) {
      console.warn('Content fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // We update all keys that exist
    for (const key of Object.keys(content)) {
      await supabase.from('site_content').update({ content: content[key], updated_at: new Date().toISOString() }).eq('section_key', key)
    }
    
    toast.success('Content updated successfully')
    setSaving(false)
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-display font-black tracking-widest text-white uppercase mb-8">Content Management</h1>
      
      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-[#0f172a] border border-white/5 p-8 rounded-sm space-y-6">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Corporate Mission</label>
              <textarea 
                value={content.mission || ''} 
                onChange={e => setContent({...content, mission: e.target.value})} 
                className="w-full bg-[#020617] border border-white/10 text-white px-4 py-3 h-24 focus:border-fire outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Corporate Vision</label>
              <textarea 
                value={content.vision || ''} 
                onChange={e => setContent({...content, vision: e.target.value})} 
                className="w-full bg-[#020617] border border-white/10 text-white px-4 py-3 h-24 focus:border-fire outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Core Values</label>
              <textarea 
                value={content.core_values || ''} 
                onChange={e => setContent({...content, core_values: e.target.value})} 
                className="w-full bg-[#020617] border border-white/10 text-white px-4 py-3 h-24 focus:border-fire outline-none" 
              />
            </div>

          </div>
          
          <button 
            type="submit" 
            disabled={saving}
            className="px-10 py-4 bg-fire text-[#0f172a] text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-fire-100 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving Changes...' : 'Publish Content'}
          </button>
        </form>
      )}
    </div>
  )
}
