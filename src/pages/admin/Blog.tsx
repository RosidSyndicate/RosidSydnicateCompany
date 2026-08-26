import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import { supabase } from '../../lib/supabase'
import { BlogPost, INITIAL_BLOG_POSTS } from '../../data/blog'

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        setPosts(data)
      }
    } catch (err) {
      console.warn('Admin blog fetch error, using local state:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleTogglePublish = async (post: BlogPost) => {
    const newStatus = !post.is_published
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_published: newStatus })
        .eq('id', post.id)

      if (error) {
        console.warn('Supabase toggle error:', error)
      }
      
      setPosts(posts.map(p => p.id === post.id ? { ...p, is_published: newStatus } : p))
      toast.success(`Post marked as ${newStatus ? 'Published' : 'Draft'}`)
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) {
        console.warn('Supabase delete error:', error)
      }

      setPosts(posts.filter(p => p.id !== id))
      toast.success('Post deleted successfully')
    } catch (err) {
      toast.error('Failed to delete post')
    }
  }

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'published' && p.is_published) || 
      (statusFilter === 'draft' && !p.is_published)
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#011E52] tracking-tight uppercase">
            Blog & Publications Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, and publish corporate insights and project updates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/categories"
            className="px-4 py-2.5 bg-white border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 rounded-sm shadow-sm transition-colors"
          >
            Manage Categories
          </Link>
          <Link
            to="/admin/blog/create"
            className="px-5 py-2.5 bg-[#FD7B00] hover:bg-[#e66a00] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-md transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" /> New Article
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold uppercase rounded-sm transition-colors ${
              statusFilter === 'all' ? 'bg-[#011E52] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 text-xs font-bold uppercase rounded-sm transition-colors ${
              statusFilter === 'published' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Published ({posts.filter(p => p.is_published).length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 text-xs font-bold uppercase rounded-sm transition-colors ${
              statusFilter === 'draft' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Drafts ({posts.filter(p => !p.is_published).length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs rounded-sm focus:outline-none focus:border-[#FD7B00]"
          />
        </div>
      </div>

      {/* Table of Blog Posts */}
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#011E52] text-white text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4">Article</th>
              <th className="p-4">Category</th>
              <th className="p-4">Author</th>
              <th className="p-4">Status</th>
              <th className="p-4">Views</th>
              <th className="p-4">Published Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  Loading articles...
                </td>
              </tr>
            ) : filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No articles found.
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id || post.slug} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 max-w-xs">
                    <div className="flex items-center gap-3">
                      <img 
                        src={post.featured_image} 
                        alt={post.title} 
                        className="w-12 h-10 object-cover rounded-sm border border-slate-200 shrink-0" 
                      />
                      <div className="truncate">
                        <Link 
                          to={`/blog/${post.slug}`} 
                          target="_blank"
                          className="font-bold text-[#011E52] hover:text-[#FD7B00] transition-colors truncate block flex items-center gap-1"
                        >
                          {post.title}
                          <ArrowTopRightOnSquareIcon className="w-3 h-3 text-slate-400 shrink-0" />
                        </Link>
                        <span className="text-[11px] text-slate-400">{post.reading_time}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-sm">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap text-xs font-medium text-slate-600">
                    {post.author}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <button
                      onClick={() => handleTogglePublish(post)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
                        post.is_published 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {post.is_published ? (
                        <><CheckCircleIcon className="w-3.5 h-3.5" /> Published</>
                      ) : (
                        <><XCircleIcon className="w-3.5 h-3.5" /> Draft</>
                      )}
                    </button>
                  </td>
                  <td className="p-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <EyeIcon className="w-3.5 h-3.5 text-slate-400" />
                      {post.views || 0}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap text-xs text-slate-500">
                    {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-4 whitespace-nowrap text-right space-x-2">
                    <Link
                      to={`/admin/blog/edit/${post.id || post.slug}`}
                      className="p-1.5 text-slate-600 hover:text-[#011E52] hover:bg-slate-100 inline-block rounded-sm transition-colors"
                      title="Edit Article"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 inline-block rounded-sm transition-colors"
                      title="Delete Article"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
