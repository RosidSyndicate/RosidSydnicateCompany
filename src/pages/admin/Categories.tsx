import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  PlusIcon, 
  TrashIcon, 
  ArrowLeftIcon,
  FolderIcon
} from '@heroicons/react/24/outline'
import { supabase } from '../../lib/supabase'
import { BlogCategory, INITIAL_CATEGORIES } from '../../data/blog'

export default function AdminCategories() {
  const [categories, setCategories] = useState<BlogCategory[]>(INITIAL_CATEGORIES)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [adding, setAdding] = useState(false)

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')

      if (!error && data && data.length > 0) {
        setCategories(data)
      }
    } catch (err) {
      console.warn('Category fetch fallback', err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    const generatedSlug = val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim()
    setSlug(generatedSlug)
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) {
      toast.error('Category Name and Slug are required.')
      return
    }

    setAdding(true)
    const newCat = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      description
    }

    try {
      const { error } = await supabase
        .from('blog_categories')
        .insert([{ name, slug, description }])

      if (error) throw error
      toast.success('Category created successfully!')
      fetchCategories()
    } catch (err) {
      // Local fallback
      setCategories([...categories, newCat])
      toast.success('Category added (local session)')
    } finally {
      setName('')
      setSlug('')
      setDescription('')
      setAdding(false)
    }
  }

  const handleDelete = async (id: string, catName: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) return

    try {
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Category deleted.')
      fetchCategories()
    } catch (err) {
      setCategories(categories.filter(c => c.id !== id))
      toast.success('Category deleted (local session)')
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/blog"
            className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-[#011E52] rounded-sm transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#011E52] tracking-tight uppercase">
              Blog Category Management
            </h1>
            <p className="text-xs text-slate-500">
              Organize articles by strategic sectors and corporate disciplines.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Add Category Form */}
        <div className="md:col-span-5">
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#011E52] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <PlusIcon className="w-4 h-4 text-[#FD7B00]" /> Add New Category
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Renewable Energy"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs rounded-sm focus:outline-none focus:border-[#FD7B00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  placeholder="renewable-energy"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs font-mono rounded-sm focus:outline-none focus:border-[#FD7B00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief synopsis of this discipline..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs rounded-sm focus:outline-none focus:border-[#FD7B00]"
                />
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full py-2.5 bg-[#FD7B00] hover:bg-[#e66a00] text-white text-xs font-bold uppercase tracking-widest rounded-sm shadow-md transition-colors disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="md:col-span-7">
          <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-[#011E52] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Existing Disciplines ({categories.length})</span>
            </div>
            <div className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <div key={cat.id || cat.slug} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FolderIcon className="w-4 h-4 text-[#FD7B00]" />
                      <h4 className="text-sm font-bold text-[#011E52]">{cat.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">/{cat.slug}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {cat.description || 'No description provided.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-colors shrink-0"
                    title="Delete Category"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
