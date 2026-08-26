import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  EnvelopeIcon,
  SparklesIcon,
  PhoneIcon,
  CheckBadgeIcon,
  BuildingOffice2Icon,
  PlusIcon,
  ArrowPathIcon,
  DocumentPlusIcon,
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
  FolderIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ClockIcon,
  InboxIcon
} from '@heroicons/react/24/outline'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface InquiryItem {
  id: string
  name: string
  company_name?: string
  email: string
  phone?: string
  subject?: string
  message: string
  inquiry_type: string
  status: string
  created_at: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  const [stats, setStats] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    contactedInquiries: 0,
    closedInquiries: 0,
    totalCompanies: 6,
    totalBlogPosts: 4,
    totalCategories: 5,
    totalCredentials: 0
  })

  const [recentInquiries, setRecentInquiries] = useState<InquiryItem[]>([])

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const fetchDashboardData = async (showToast = false) => {
    if (showToast) setRefreshing(true)
    try {
      // 1. Fetch Inquiries counts
      const { data: allInquiries } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      const inqList: InquiryItem[] = allInquiries || []
      const totalInq = inqList.length
      const newInq = inqList.filter(i => (i.status || '').toLowerCase() === 'new').length
      const contInq = inqList.filter(i => (i.status || '').toLowerCase() === 'contacted').length
      const closedInq = inqList.filter(i => (i.status || '').toLowerCase() === 'closed').length

      // 2. Fetch Companies count
      const { count: companyCount } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('is_archived', false)

      // 3. Fetch Blog Posts count
      const { count: postCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })

      // 4. Fetch Blog Categories count
      const { count: catCount } = await supabase
        .from('blog_categories')
        .select('*', { count: 'exact', head: true })

      // 5. Fetch Credentials count
      const { count: credCount } = await supabase
        .from('credentials')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalInquiries: totalInq,
        newInquiries: newInq,
        contactedInquiries: contInq,
        closedInquiries: closedInq,
        totalCompanies: companyCount ?? 6,
        totalBlogPosts: postCount ?? 4,
        totalCategories: catCount ?? 5,
        totalCredentials: credCount ?? 0
      })

      setRecentInquiries(inqList.slice(0, 6))

      if (showToast) {
        toast.success('Dashboard metrics refreshed')
      }
    } catch (err: any) {
      console.warn('Dashboard fetch notice:', err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 bg-[#F8FAFC] min-h-screen">
      
      {/* ========================================================================= */}
      {/* 1. PREMIUM HEADER BANNER                                                  */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#011E52] via-[#083070] to-[#FD7B00] p-6 sm:p-8 md:p-10 text-white shadow-xl shadow-[#011E52]/10"
      >
        {/* Background Subtle Geometric Accents */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-20 w-64 h-64 rounded-full bg-[#FD7B00]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold uppercase tracking-wider text-amber-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sovereign Executive Portal
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, <span className="text-amber-300">{user?.email?.split('@')[0] || 'Admin'}</span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-200 flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-amber-300/80 shrink-0" />
              {currentDate}
            </p>
          </div>

          {/* System Status and Quick Actions in Header */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-50"
              title="Refresh all metrics from PostgreSQL"
            >
              <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-[#011E52] hover:bg-amber-50 text-xs font-bold uppercase tracking-wider shadow-lg transition-all duration-200 active:scale-95"
            >
              <GlobeAltIcon className="w-4 h-4 text-[#FD7B00]" />
              Live Website
              <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. ANIMATED STATS CARDS (5-GRID)                                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* Card 1: Total Inquiries */}
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-[#011E52] to-[#0A327B] text-white shadow-lg shadow-[#011E52]/15 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Total Inquiries</span>
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <EnvelopeIcon className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">{stats.totalInquiries}</span>
            <span className="text-xs text-slate-300 bg-white/10 px-2 py-0.5 rounded font-medium">All Time</span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
            <span>Global & Domestic</span>
            <Link to="/admin/inquiries" className="hover:text-amber-300 font-bold transition-colors">Manage →</Link>
          </div>
        </motion.div>

        {/* Card 2: New Inquiries */}
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-[#FD7B00] to-[#E06A00] text-white shadow-lg shadow-[#FD7B00]/20 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">New / Unread</span>
            <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">{stats.newInquiries}</span>
            {stats.newInquiries > 0 ? (
              <span className="text-xs bg-white text-[#FD7B00] font-bold px-2 py-0.5 rounded shadow-sm animate-pulse">Action Required</span>
            ) : (
              <span className="text-xs text-amber-100 bg-white/10 px-2 py-0.5 rounded font-medium">Up to date</span>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-amber-100">
            <span>Awaiting Review</span>
            <Link to="/admin/inquiries" className="hover:text-white font-bold transition-colors">View New →</Link>
          </div>
        </motion.div>

        {/* Card 3: Contacted */}
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white shadow-lg shadow-sky-900/15 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-100">Contacted</span>
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <PhoneIcon className="w-5 h-5 text-sky-200" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">{stats.contactedInquiries}</span>
            <span className="text-xs text-sky-100 bg-white/10 px-2 py-0.5 rounded font-medium">In Pipeline</span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-sky-100">
            <span>In Discussion</span>
            <Link to="/admin/inquiries" className="hover:text-sky-200 font-bold transition-colors">Track →</Link>
          </div>
        </motion.div>

        {/* Card 4: Closed / Resolved */}
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-[#16A34A] to-[#15803D] text-white shadow-lg shadow-emerald-900/15 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Closed / Completed</span>
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <CheckBadgeIcon className="w-5 h-5 text-emerald-200" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">{stats.closedInquiries}</span>
            <span className="text-xs text-emerald-100 bg-white/10 px-2 py-0.5 rounded font-medium">Resolved</span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-100">
            <span>Archive Logs</span>
            <Link to="/admin/inquiries" className="hover:text-emerald-200 font-bold transition-colors">History →</Link>
          </div>
        </motion.div>

        {/* Card 5: Subsidiaries */}
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white shadow-lg shadow-slate-900/15 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Subsidiaries</span>
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <BuildingOffice2Icon className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">{stats.totalCompanies}</span>
            <span className="text-xs text-amber-300 bg-amber-400/10 border border-amber-300/20 px-2 py-0.5 rounded font-bold">Active Group</span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
            <span>Integrated Entities</span>
            <Link to="/admin/companies" className="hover:text-amber-300 font-bold transition-colors">Manage →</Link>
          </div>
        </motion.div>

      </div>

      {/* ========================================================================= */}
      {/* 3. QUICK ACTION CONTROL CENTER                                            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#011E52] uppercase tracking-wider flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-[#FD7B00]" />
            Quick Action Commands
          </h2>
          <span className="text-xs text-slate-400 font-medium">Accelerate Corporate Operations</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Action 1: Create Blog Post */}
          <Link
            to="/admin/blog/create"
            className="group flex items-center gap-4 p-4 rounded-xl bg-[#011E52] hover:bg-[#083070] text-white transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DocumentPlusIcon className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-wide">Create Blog Post</div>
              <div className="text-xs text-slate-300">Publish corporate insights</div>
            </div>
          </Link>

          {/* Action 2: Add Subsidiary */}
          <Link
            to="/admin/companies"
            className="group flex items-center gap-4 p-4 rounded-xl bg-[#FD7B00] hover:bg-[#E06A00] text-white transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="w-11 h-11 rounded-lg bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BuildingOffice2Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-wide">Add Subsidiary</div>
              <div className="text-xs text-amber-100">Manage business portfolio</div>
            </div>
          </Link>

          {/* Action 3: View Inquiries & Reports */}
          <Link
            to="/admin/inquiries"
            className="group flex items-center gap-4 p-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <EnvelopeIcon className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-wide">View Inquiries</div>
              <div className="text-xs text-emerald-100">Review tenders & contact leads</div>
            </div>
          </Link>

          {/* Action 4: Manage Categories */}
          <Link
            to="/admin/categories"
            className="group flex items-center gap-4 p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderIcon className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-wide">Categories & Taxonomies</div>
              <div className="text-xs text-slate-300">Structure blog classification</div>
            </div>
          </Link>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN TWO-COLUMN WORKSPACE                                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: RECENT INQUIRIES & ACTIVITY (2 COLS WIDE) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#011E52] uppercase tracking-wide">
                  Recent Global Inquiries & Tenders
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest client and tender submissions from the portal
                </p>
              </div>

              <Link
                to="/admin/inquiries"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold uppercase tracking-wider text-[#011E52] transition-colors"
              >
                View All Inquiries
                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Table or Empty State */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-slate-400">
                  <div className="w-8 h-8 border-2 border-[#FD7B00] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm font-medium">Synchronizing with PostgreSQL...</p>
                </div>
              ) : recentInquiries.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <InboxIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-700">No Inquiries Found Yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      New messages submitted through the Contact Us or Tender Inquiry forms will appear here in real-time.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/tender-inquiry"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#011E52] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#FD7B00] transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" /> Submit Sample Test Inquiry
                    </Link>
                  </div>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#011E52] text-white text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4 pl-6">Contact / Client</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 pr-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-[#011E52]">{inq.name}</div>
                          <div className="text-xs text-slate-500">{inq.email}</div>
                          {inq.company_name && (
                            <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                              {inq.company_name}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            {inq.inquiry_type || 'General'}
                          </span>
                        </td>
                        <td className="p-4 max-w-xs truncate text-xs text-slate-600" title={inq.subject || inq.message}>
                          {inq.subject || inq.message}
                        </td>
                        <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(inq.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                              inq.status === 'New'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : inq.status === 'Contacted'
                                ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: QUICK STATS SIDEBAR & SYSTEM OVERVIEW (1 COL WIDE) */}
        <div className="space-y-6">
          
          {/* Quick Stats Summary Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-[#011E52] uppercase tracking-wide">
                Ecosystem Overview
              </h3>
              <span className="text-xs font-bold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Cloud
              </span>
            </div>

            <div className="space-y-4">
              
              {/* Stat Row 1: Blog Articles */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#011E52]/10 text-[#011E52] flex items-center justify-center">
                    <DocumentTextIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">Blog Publications</div>
                    <div className="text-[11px] text-slate-400">Articles & Press Releases</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-[#011E52]">{stats.totalBlogPosts}</span>
                  <Link to="/admin/blog" className="block text-[10px] font-bold text-[#FD7B00] hover:underline">Manage</Link>
                </div>
              </div>

              {/* Stat Row 2: Categories */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FD7B00]/10 text-[#FD7B00] flex items-center justify-center">
                    <FolderIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">Blog Categories</div>
                    <div className="text-[11px] text-slate-400">Content Taxonomies</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-[#011E52]">{stats.totalCategories}</span>
                  <Link to="/admin/categories" className="block text-[10px] font-bold text-[#FD7B00] hover:underline">Manage</Link>
                </div>
              </div>

              {/* Stat Row 3: Subsidiaries */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <BuildingOffice2Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">Subsidiary Entities</div>
                    <div className="text-[11px] text-slate-400">Group Companies</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-[#011E52]">{stats.totalCompanies}</span>
                  <Link to="/admin/companies" className="block text-[10px] font-bold text-[#FD7B00] hover:underline">Manage</Link>
                </div>
              </div>

              {/* Stat Row 4: Credentials */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <ShieldCheckIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">Corporate Credentials</div>
                    <div className="text-[11px] text-slate-400">Certificates & Licences</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-[#011E52]">{stats.totalCredentials}</span>
                  <Link to="/admin/credentials" className="block text-[10px] font-bold text-[#FD7B00] hover:underline">Manage</Link>
                </div>
              </div>

            </div>
          </div>

          {/* Database Architecture Info Card */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#011E52] to-[#0A327B] text-white shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Supabase PostgreSQL</h4>
                <p className="text-[11px] text-slate-300">Row Level Security (RLS) Active</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              All queries and authentication tokens are secured with high-grade cryptographic handshakes and automated replication.
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">API Endpoint</span>
              <span className="font-mono text-[11px] text-amber-300">mlfakixbqzgttwzqinvl</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
