import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  CalendarIcon, 
  ClockIcon, 
  EyeIcon, 
  ArrowLeftIcon,
  ShareIcon,
  TagIcon,
  FolderIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline'
import PageHeader from '../components/PageHeader'
import { supabase } from '../lib/supabase'
import { BlogPost as BlogPostType, INITIAL_BLOG_POSTS } from '../data/blog'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPostType | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([])
  const [loading, setLoading] = useState(true)

  // Scroll reading progress
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    window.scrollTo(0, 0)

    async function loadPost() {
      if (!slug) return
      setLoading(true)

      let currentPost: BlogPostType | null = null

      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single()

        if (!error && data) {
          currentPost = data

          // Increment view count asynchronously
          supabase
            .from('blog_posts')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', data.id)
            .then(() => {})
        }
      } catch (err) {
        console.warn('Supabase fetch error, checking fallback data:', err)
      }

      // If not in Supabase, search fallback data
      if (!currentPost) {
        currentPost = INITIAL_BLOG_POSTS.find((p) => p.slug === slug) || null
      }

      if (currentPost) {
        setPost(currentPost)
        document.title = `${currentPost.title} | Rosid Syndicates Group`

        // Load related posts
        const related = INITIAL_BLOG_POSTS.filter(
          (p) => p.slug !== currentPost!.slug && (p.category_slug === currentPost!.category_slug || true)
        ).slice(0, 3)
        setRelatedPosts(related)
      } else {
        toast.error('Article not found.')
        navigate('/blog')
      }

      setLoading(false)
    }

    loadPost()
  }, [slug, navigate])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = post?.title || 'Rosid Syndicates Group Intelligence'

    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank')
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, '_blank')
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      toast.success('Article link copied to clipboard!')
    }
  }

  if (loading || !post) {
    return (
      <div className="min-h-screen bg-[#F4F4F2] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#011E52] border-t-[#FD7B00]"></div>
      </div>
    )
  }

  // Basic renderer for markdown headings & lists
  const renderFormattedContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim()
      
      // H2
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl sm:text-3xl font-extrabold text-[#011E52] mt-10 mb-5 border-b border-slate-200 pb-3">
            {trimmed.replace('## ', '')}
          </h2>
        )
      }
      
      // H3
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl sm:text-2xl font-bold text-[#011E52] mt-8 mb-4">
            {trimmed.replace('### ', '')}
          </h3>
        )
      }

      // Blockquote / Divider
      if (trimmed.startsWith('---')) {
        return <hr key={index} className="my-8 border-slate-200" />
      }

      // Code Block
      if (trimmed.startsWith('```')) {
        const codeLines = trimmed.replace(/```/g, '').trim()
        return (
          <pre key={index} className="bg-[#030914] text-slate-200 p-5 rounded-sm overflow-x-auto text-xs sm:text-sm font-mono my-6 border border-slate-700 shadow-inner">
            <code>{codeLines}</code>
          </pre>
        )
      }

      // Unordered list
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').filter(Boolean)
        return (
          <ul key={index} className="list-disc pl-6 space-y-2 my-4 text-slate-700 text-base leading-relaxed">
            {items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/^[-*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            ))}
          </ul>
        )
      }

      // Numbered list
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n').filter(Boolean)
        return (
          <ol key={index} className="list-decimal pl-6 space-y-2.5 my-4 text-slate-700 text-base leading-relaxed">
            {items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\.\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            ))}
          </ol>
        )
      }

      // Regular paragraph
      return (
        <p 
          key={index} 
          className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ 
            __html: trimmed
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[#FD7B00] font-bold hover:underline">$1</a>') 
          }} 
        />
      )
    })
  }

  return (
    <div className="bg-[#F4F4F2] min-h-screen text-slate-800 relative">
      
      {/* Fixed Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#FD7B00] z-50 origin-left"
        style={{ scaleX }}
      />

      <PageHeader 
        title={post.title}
        subtitle={`${post.category} • Rosid Intelligence`}
        image={post.featured_image}
      />

      <div className="container py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-8">
          <Link to="/blog" className="hover:text-[#FD7B00] flex items-center gap-1">
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to All Articles
          </Link>
          <span>/</span>
          <Link to={`/blog/category/${post.category_slug}`} className="text-[#011E52] hover:text-[#FD7B00]">
            {post.category}
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Main Article Content */}
          <main className="lg:col-span-8">
            <article className="bg-white p-6 sm:p-10 lg:p-14 rounded-sm border border-slate-200 shadow-sm">
              
              {/* Header Info */}
              <div className="pb-8 mb-8 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mb-4">
                  <span className="bg-[#011E52] text-white px-3 py-1 rounded-sm uppercase tracking-wider text-[11px] font-bold">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4 text-slate-400" />
                    {post.reading_time}
                  </span>
                  <span className="flex items-center gap-1.5 ml-auto">
                    <EyeIcon className="w-4 h-4 text-slate-400" />
                    {post.views} Views
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#011E52] leading-tight mb-4">
                  {post.title}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium italic bg-slate-50 p-4 border-l-4 border-[#FD7B00]">
                  "{post.excerpt}"
                </p>
              </div>

              {/* Featured Image */}
              <div className="mb-10 rounded-sm overflow-hidden border border-slate-100 shadow-md">
                <img 
                  src={post.featured_image} 
                  alt={post.title} 
                  className="w-full h-auto max-h-[480px] object-cover"
                />
              </div>

              {/* Rendered Body Content */}
              <div className="prose prose-slate max-w-none">
                {renderFormattedContent(post.content)}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                  <TagIcon className="w-4 h-4 text-slate-400 mr-1" />
                  <span className="text-xs font-bold uppercase text-slate-400 mr-2">Tags:</span>
                  {post.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-sm hover:bg-slate-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Share Section */}
              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#011E52]">
                  <ShareIcon className="w-4 h-4 text-[#FD7B00]" /> Share this analysis:
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="px-3.5 py-1.5 bg-[#0077B5] text-white text-xs font-bold rounded-sm hover:opacity-90 transition-opacity"
                  >
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="px-3.5 py-1.5 bg-black text-white text-xs font-bold rounded-sm hover:opacity-90 transition-opacity"
                  >
                    X / Twitter
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="px-3.5 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded-sm hover:opacity-90 transition-opacity"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="px-3.5 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-sm hover:bg-slate-300 transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Author Biography Box */}
              <div className="mt-12 p-6 bg-slate-50 rounded-sm border border-slate-200 flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#011E52] text-white grid place-items-center font-black text-xl shrink-0 shadow-md">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#011E52]">{post.author}</h4>
                  <p className="text-xs font-semibold text-[#FD7B00] mb-2">{post.author_role || 'Executive Leadership'}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Published by the corporate governance & industry advisory desk at Rosid Syndicates Group, overseeing commercial trade, mega project financing, and nationwide EPC executions in Nepal.
                  </p>
                </div>
              </div>

            </article>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Quick Corporate Action Card */}
            <div className="bg-[#011E52] text-white p-8 rounded-sm shadow-md border-t-4 border-[#FD7B00]">
              <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
                Engage Our Group
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Are you an international EPC contractor or financial institution exploring opportunities in Nepal? Partner with our local advisory and execution engine.
              </p>
              <div className="space-y-3">
                <Link
                  to="/tender-inquiry"
                  className="block w-full text-center py-3 bg-[#FD7B00] hover:bg-[#e66a00] text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors shadow-md"
                >
                  Submit Tender Support
                </Link>
                <Link
                  to="/infrastructure-tender-services"
                  className="block w-full text-center py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors border border-white/20"
                >
                  Foreign Contractor Guide
                </Link>
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
              <h4 className="text-sm font-extrabold text-[#011E52] uppercase tracking-wider mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                <FolderIcon className="w-4 h-4 text-[#FD7B00]" /> Related Publications
              </h4>
              <div className="space-y-6">
                {relatedPosts.map((rPost) => (
                  <div key={rPost.slug} className="group">
                    <span className="text-[10px] font-bold text-[#FD7B00] uppercase tracking-wider block mb-1">
                      {rPost.category}
                    </span>
                    <h5 className="text-sm font-bold text-[#011E52] leading-snug group-hover:text-[#FD7B00] transition-colors mb-1.5">
                      <Link to={`/blog/${rPost.slug}`}>
                        {rPost.title}
                      </Link>
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      {new Date(rPost.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {rPost.reading_time}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Subsidiaries Widget */}
            <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
              <h4 className="text-sm font-extrabold text-[#011E52] uppercase tracking-wider mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                <BuildingOffice2Icon className="w-4 h-4 text-[#FD7B00]" /> Group Subsidiaries
              </h4>
              <ul className="space-y-3 text-xs">
                <li>
                  <Link to="/companies/roshan-enterprises" className="font-bold text-[#011E52] hover:text-[#FD7B00] transition-colors block">
                    Roshan Enterprises Pvt. Ltd.
                  </Link>
                  <span className="text-[11px] text-slate-500">Bulk Construction Supply & Procurement</span>
                </li>
                <li className="pt-2 border-t border-slate-100">
                  <Link to="/companies/appi-saipal-financial-solutions" className="font-bold text-[#011E52] hover:text-[#FD7B00] transition-colors block">
                    Appi Saipal Financial Solutions Pvt. Ltd.
                  </Link>
                  <span className="text-[11px] text-slate-500">Bank Guarantees & Debt Syndication</span>
                </li>
                <li className="pt-2 border-t border-slate-100">
                  <Link to="/companies/kasthamandap-commerce-and-company" className="font-bold text-[#011E52] hover:text-[#FD7B00] transition-colors block">
                    Kasthamandap Commerce and Company
                  </Link>
                  <span className="text-[11px] text-slate-500">Trading & Material Supply Tenders</span>
                </li>
                <li className="pt-2 border-t border-slate-100">
                  <Link to="/companies/b-c-exim-company" className="font-bold text-[#011E52] hover:text-[#FD7B00] transition-colors block">
                    B & C Exim Company Pvt. Ltd.
                  </Link>
                  <span className="text-[11px] text-slate-500">Cross-Border Trade & Logistics</span>
                </li>
              </ul>
            </div>

          </aside>

        </div>

      </div>
    </div>
  )
}
