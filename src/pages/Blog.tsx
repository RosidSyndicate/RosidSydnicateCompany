import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  ClockIcon, 
  EyeIcon, 
  CalendarIcon, 
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import PageHeader from '../components/PageHeader'
import { supabase } from '../lib/supabase'
import { BlogPost, BlogCategory, INITIAL_BLOG_POSTS, INITIAL_CATEGORIES } from '../data/blog'

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS)
  const [categories, setCategories] = useState<BlogCategory[]>(INITIAL_CATEGORIES)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Corporate Blog & Insights | Rosid Syndicates Group'

    async function loadData() {
      try {
        // Fetch categories from Supabase
        const { data: catData, error: catError } = await supabase
          .from('blog_categories')
          .select('*')
          .order('name')

        if (!catError && catData && catData.length > 0) {
          setCategories(catData)
        }

        // Fetch published posts
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false })

        if (!postError && postData && postData.length > 0) {
          setPosts(postData)
        }
      } catch (err) {
        console.warn('Supabase blog fetch fallback to initial data:', err)
      }
    }

    loadData()
  }, [])

  // Filter posts based on category and search query
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category_slug === selectedCategory
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    return matchesCategory && matchesSearch
  })

  // Featured post (latest or first)
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null
  const secondaryPosts = filteredPosts.slice(1)

  return (
    <div className="bg-[#F4F4F2] min-h-screen text-slate-800">
      <PageHeader 
        title="Corporate Insights & Industry Intelligence"
        subtitle="Rosid Syndicates Group Blog"
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=100&w=3840&auto=format&fit=crop"
      />

      <div className="container py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search and Category Filter Bar */}
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#011E52] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Insights ({posts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-[#FD7B00] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-sm rounded-sm focus:outline-none focus:border-[#FD7B00] transition-colors"
            />
          </div>
        </div>

        {/* Featured Post Card (Hero) */}
        {featuredPost && selectedCategory === 'all' && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="bg-white rounded-sm border border-slate-200 shadow-lg overflow-hidden grid lg:grid-cols-12 gap-0 group">
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden bg-[#011E52]">
                <img 
                  src={featuredPost.featured_image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95" 
                />
                <div className="absolute top-4 left-4 bg-[#FD7B00] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-sm shadow-md flex items-center gap-1.5">
                  <SparklesIcon className="w-3.5 h-3.5" /> Featured Intelligence
                </div>
              </div>
              <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-[#FD7B00] font-bold uppercase tracking-wider mb-3">
                    <span>{featuredPost.category}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-medium">{featuredPost.reading_time}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#011E52] leading-tight mb-4 group-hover:text-[#FD7B00] transition-colors">
                    <Link to={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#011E52] text-white grid place-items-center font-bold text-sm">
                        {featuredPost.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#011E52]">{featuredPost.author}</p>
                        <p className="text-[11px] text-slate-500">{new Date(featuredPost.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#011E52] group-hover:text-[#FD7B00] transition-colors"
                    >
                      Read Full Article <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Secondary Posts Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <h3 className="text-xl font-bold text-[#011E52] uppercase tracking-wide">
              {selectedCategory === 'all' && !searchQuery ? 'Latest Analyses & Publications' : `Found (${filteredPosts.length}) Articles`}
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Showing verified corporate editorial
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-sm border border-slate-200 shadow-sm">
              <p className="text-slate-500 font-medium text-lg mb-4">No articles found matching your query.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery('') }}
                className="px-6 py-2.5 bg-[#011E52] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#FD7B00] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(selectedCategory === 'all' && !searchQuery ? secondaryPosts : filteredPosts).map((post, idx) => (
                <motion.article
                  key={post.id || post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:border-[#011E52]/20 transition-all duration-300"
                >
                  <div>
                    {/* Featured Image */}
                    <div className="relative h-52 overflow-hidden bg-[#011E52]">
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <span className="absolute top-3 left-3 bg-[#011E52]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm">
                        {post.category}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium mb-3">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                          {post.reading_time}
                        </span>
                        <span className="flex items-center gap-1 ml-auto">
                          <EyeIcon className="w-3.5 h-3.5 text-slate-400" />
                          {post.views}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-[#011E52] leading-snug mb-3 group-hover:text-[#FD7B00] transition-colors line-clamp-2">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#011E52] truncate max-w-[150px]">
                      By {post.author}
                    </span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-xs font-extrabold text-[#FD7B00] uppercase tracking-wider inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      Read &rarr;
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>

        {/* Corporate Newsletter & Direct Inquiry Banner */}
        <div className="bg-[#011E52] text-white p-10 lg:p-14 rounded-sm shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#FD7B00]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FD7B00] bg-white/10 px-3 py-1 rounded-sm inline-block mb-3">
                Executive Intelligence
              </span>
              <h3 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-3">
                Need Project Advisory or Local EPC Partnership in Nepal?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                Consult with our specialized divisions for bank syndication, public procurement support, material supply, or joint-venture tender execution.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                to="/tender-inquiry"
                className="px-6 py-3.5 bg-[#FD7B00] hover:bg-[#e66a00] text-white font-bold text-xs uppercase tracking-widest text-center rounded-sm shadow-md transition-colors"
              >
                Submit Tender Inquiry
              </Link>
              <Link
                to="/#contact"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest text-center rounded-sm transition-colors border border-white/20"
              >
                Contact Executive Desk
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
