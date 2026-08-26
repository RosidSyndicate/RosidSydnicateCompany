import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { projects } from '../data/projects'
import PageHeader from '../components/PageHeader'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-6xl font-black text-ink/10 mb-4">404</p>
          <p className="text-xl font-bold text-ink">Project not found</p>
          <Link to="/projects" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white text-ink text-sm font-bold hover:bg-fire transition-colors uppercase tracking-widest">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-transparent min-h-screen">
      <PageHeader 
        title={project.title}
        subtitle={project.sector}
        image={project.images?.[0] || "https://images.unsplash.com/photo-1541888056262-563b7852f826?q=100&w=3840&auto=format&fit=crop"}
        backLink="/projects"
        backLabel="All Projects"
      />

      <div className="container max-w-4xl py-20">

        {/* Title + meta */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-500">
            <span className="font-bold text-ink uppercase tracking-widest">Client: {project.client}</span>
            <span className="text-ink/10">|</span>
            <span className="font-bold uppercase tracking-widest">{project.location}</span>
            <span className="text-ink/10">|</span>
            <span className="font-bold uppercase tracking-widest">{project.year}</span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8 text-lead text-slate-500 leading-relaxed max-w-3xl"
        >
          {project.shortDescription}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 prose prose-ink max-w-none"
        >
          <h2 className="text-2xl font-bold text-ink mb-4">Project Overview</h2>
          <p className="text-lg text-slate-500 leading-relaxed">{project.description}</p>
          
          <h3 className="text-xl font-bold text-ink mt-8 mb-4">Rosid Scope</h3>
          <p className="text-lg text-slate-500 leading-relaxed">{project.scope}</p>
          
          <h3 className="text-xl font-bold text-ink mt-8 mb-4">Results</h3>
          <p className="text-lg text-slate-500 leading-relaxed">{project.results}</p>
        </motion.div>

        {/* Specs grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/5"
        >
          <div className="bg-transparent p-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em]">Status</p>
            <p className="mt-2 text-lg font-bold text-ink">{project.status}</p>
          </div>
          <div className="bg-transparent p-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em]">Project Type</p>
            <p className="mt-2 text-lg font-bold text-ink">{project.projectType}</p>
          </div>
        </motion.div>

        {/* Gallery */}
        {project.images && project.images.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-ink">Gallery</h2>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.slice(1).map((img, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden group">
                  <img
                    src={img}
                    alt={`${project.title} - Image ${i + 2}`}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 mb-24 py-16 border-t border-slate-200 text-center"
        >
          <p className="text-section text-ink">Discuss Your Project</p>
          <p className="mt-4 text-lead text-slate-500">Tell us about your infrastructure or supply requirements.</p>
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white text-ink font-bold text-sm uppercase tracking-widest hover:bg-fire transition-colors"
          >
            Contact Us
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
