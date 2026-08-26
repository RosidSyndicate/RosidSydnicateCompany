import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

type Credential = {
  id: string
  title: string
  category: string
  description: string
  file_url: string
  is_public: boolean
}

export default function Credentials() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [newCred, setNewCred] = useState({ title: '', category: 'Company Registration', description: '', is_public: false })

  const load = async () => {
    try {
      const { data, error } = await supabase.from('credentials').select('*').order('created_at', { ascending: false })
      if (!error && data) {
        setCredentials(data)
      } else if (error) {
        console.warn('Credentials Supabase fetch info:', error.message)
      }
    } catch (err) {
      console.warn('Credentials fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const togglePublic = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('credentials').update({ is_public: !currentStatus }).eq('id', id)
    if (error) toast.error('Failed to update status')
    else {
      toast.success('Visibility updated')
      load()
    }
  }

  const deleteCred = async (id: string, file_url: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return
    
    // Delete from DB first
    const { error } = await supabase.from('credentials').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete from database')
      return
    }

    // Try to delete from storage if it's a supabase storage URL
    try {
      if (file_url.includes('/')) {
        await supabase.storage.from('credentials_files').remove([file_url])
      }
    } catch (e) {
      console.error('Storage deletion error:', e)
    }

    toast.success('Document deleted')
    load()
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) {
      toast.error('Please select a file')
      return
    }
    
    setIsUploading(true)
    
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = uploadFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${newCred.category.replace(/[^a-zA-Z0-9]/g, '_')}/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('credentials_files')
        .upload(filePath, uploadFile)

      if (uploadError) throw uploadError

      // 2. Insert into Database using the internal path, NOT a public URL
      const { error: dbError } = await supabase.from('credentials').insert({
        title: newCred.title,
        category: newCred.category,
        description: newCred.description,
        file_url: filePath,
        is_public: newCred.is_public
      })

      if (dbError) throw dbError

      toast.success('Document uploaded successfully')
      setUploadFile(null)
      setNewCred({ title: '', category: 'Company Registration', description: '', is_public: false })
      load()
    } catch (error: any) {
      toast.error('Upload failed: ' + (error.message || 'Unknown error'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleView = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from('credentials_files')
      .createSignedUrl(filePath, 60) // valid for 60 seconds
    
    if (error || !data) {
      toast.error('Failed to access secure document')
      return
    }
    
    window.open(data.signedUrl, '_blank')
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-display font-black tracking-widest text-white uppercase">Credentials Center</h1>
      </div>

      <div className="bg-[#0f172a] border border-white/5 p-6 rounded-sm mb-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-fire mb-4">Upload New Document</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Document Title</label>
              <input type="text" required value={newCred.title} onChange={e => setNewCred({...newCred, title: e.target.value})} className="w-full bg-[#020617] border border-white/10 text-white px-4 py-2 focus:border-fire outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Category</label>
              <select value={newCred.category} onChange={e => setNewCred({...newCred, category: e.target.value})} className="w-full bg-[#020617] border border-white/10 text-white px-4 py-2 focus:border-fire outline-none">
                <option value="Company Registration">Company Registration</option>
                <option value="PAN / VAT">PAN / VAT</option>
                <option value="Contractor Registration">Contractor Registration</option>
                <option value="Certifications">Certifications</option>
                <option value="Licences">Licences</option>
                <option value="Other Corporate Documents">Other Corporate Documents</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Description</label>
            <input type="text" value={newCred.description} onChange={e => setNewCred({...newCred, description: e.target.value})} className="w-full bg-[#020617] border border-white/10 text-white px-4 py-2 focus:border-fire outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Select File (PDF, JPG, PNG)</label>
              <input type="file" required accept=".pdf,.jpg,.jpeg,.png" onChange={e => setUploadFile(e.target.files ? e.target.files[0] : null)} className="w-full bg-[#020617] border border-white/10 text-slate-400 px-4 py-1.5 focus:border-fire outline-none file:mr-4 file:py-1 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:bg-white/10 file:text-white hover:file:bg-white/20" />
            </div>
            <div className="flex items-center mt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={newCred.is_public} onChange={e => setNewCred({...newCred, is_public: e.target.checked})} className="w-4 h-4 rounded-sm border-white/10 bg-[#020617] text-fire focus:ring-fire focus:ring-offset-[#0f172a]" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Make Publicly Visible</span>
              </label>
            </div>
          </div>
          <div className="pt-2">
            <button type="submit" disabled={isUploading} className="px-6 py-3 bg-fire text-[#0f172a] text-xs font-bold uppercase tracking-widest rounded-sm disabled:opacity-50 hover:bg-fire-100 transition-colors">
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-[#0f172a] border border-white/5 rounded-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Document Title</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Category</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Visibility</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {credentials.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="text-sm text-white font-medium">{c.title}</div>
                    <div className="text-xs text-slate-400 mt-1 truncate max-w-xs">{c.description}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-300">{c.category}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => togglePublic(c.id, c.is_public)}
                      className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors ${
                        c.is_public ? 'bg-ocean/20 text-ocean hover:bg-ocean/30' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {c.is_public ? 'Public' : 'Internal Only'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => handleView(c.file_url)} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">View</button>
                    <button onClick={() => deleteCred(c.id, c.file_url)} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
              {credentials.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">No credentials uploaded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
