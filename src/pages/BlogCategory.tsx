import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CalendarIcon, 
  ClockIcon, 
  ArrowLeftIcon,
  FolderIcon
} from '@heroicons/react/24/outline'
import PageHeader from '../components/PageHeader'
import { supabase } from '../lib/supabase'
import { BlogPost, BlogCategory as BlogCategoryType, INITIAL_BLOG_POSTS, INITIAL_CATEGORIES } from '../data/blog'

export default function BlogCategory() {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<BlogCategoryType | null>(null)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [allCategories] = useState<BlogCategoryType[]>(INITIAL_CATEGORIES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)

    async function loadCategoryData() {
      if (!slug) return
      setLoading(true)

      let currentCat: BlogCategoryType | null = null
      let filtered: BlogPost[] = []

      try {
        // Fetch category
        const { data: catData, error: catError } = await supabase
          .from('blog_categories')
          .select('*')
          .eq('slug', slug)
          .single()

        if (!catError && catData) {
          currentCat = catData
        }

        // Fetch posts for category
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('category_slug', slug)
          .eq('is_published', true)
          .order('published_at', { ascending: false })

        if (!postError && postData && postData.length > 0) {
          filtered = postData
        }
      } catch (err) {
        console.warn('Supabase category fetch error, using fallback:', err)
      }

      if (!currentCat) {
        currentCat = INITIAL_CATEGORIES.find((c) => c.slug === slug) || null
      }

      if (filtered.length === 0) {
        filtered = INITIAL_BLOG_POSTS.filter((p) => p.category_slug === slug)
      }

      setCategory(currentCat)
      setPosts(filtered)

      if (currentCat) {
        document.title = `${currentCat.name} | Rosid Syndicates Group Blog`
      }

      setLoading(false)
    }

    loadCategoryData()
  }, [slug])

  return (
    <div className="bg-[#F4F4F2] min-h-screen text-slate-800">
      <PageHeader 
        title={category ? category.name : 'Category Insights'}
        subtitle="Rosid Syndicates Group Editorial"
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=100&w=3840&auto=format&fit=crop"
      />

      <div className="container py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-8">
          <Link to="/blog" className="hover:text-[#FD7B00] flex items-center gap-1">
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to All Articles
          </Link>
          <span>/</span>
          <span className="text-[#011E52]">{category?.name || 'Category'}</span>
        </div>

        {/* Category Header Card */}
        {category && (
          <div className="bg-white p-8 rounded-sm border-l-4 border-[#FD7B00] shadow-sm mb-12">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#011E52] mb-2">
              <FolderIcon className="w-4 h-4 text-[#FD7B00]" /> Category Focus
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#011E52] mb-2">
              {category.name}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
              {category.description}
            </p>
          </div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#011E52] border-t-[#FD7B00]"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-sm border border-slate-200 shadow-sm">
            <p className="text-slate-500 font-medium text-lg mb-4">No published articles in this category yet.</p>
            <Link
              to="/blog"
              className="inline-block px-6 py-2.5 bg-[#011E52] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#FD7B00] transition-colors"
            >
              Browse All Insights
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {posts.map((post, idx) => (
              <motion.article
                key={post.id || post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:border-[#011E52]/20 transition-all duration-300"
              >
                <div>
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

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#011E52]">
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

        {/* Other Categories Selector */}
        <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#011E52] mb-4">
            Explore Other Disciplines
          </h3>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((c) => (
              <Link
                key={c.slug}
                to={`/blog/category/${c.slug}`}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
                  c.slug === slug
                    ? 'bg-[#011E52] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-[#FD7B00] hover:text-white'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
