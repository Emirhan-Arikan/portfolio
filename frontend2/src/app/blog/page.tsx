'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Hash, ArrowUpRight, ArrowLeft, RefreshCw } from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import AnimatedBackground from '@/components/AnimatedBackground'
import { STATIC_BLOGS } from '@/components/sections/BlogShowcase'
import { apiBase } from '@/lib/api'

interface BlogPost {
  id: number
  title: string
  summary: string
  content: string
  image_url: string | null
  tags: string
  slug: string
  created_at: string
}

function BlogListContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tagFilter = searchParams.get('tag')

  const [blogs, setBlogs] = useState<BlogPost[]>(STATIC_BLOGS)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true)
      try {
        const res = await fetch(`${apiBase}/api/blogs/`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setBlogs(data)
          }
        }
      } catch (err) {
        console.warn('Backend blog fetching failed, using fallback static blogs.', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [apiBase])

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  // Filter blogs based on tag query param
  const filteredBlogs = tagFilter
    ? blogs.filter(blog =>
        blog.tags
          .split(',')
          .map(t => t.trim().toLowerCase())
          .includes(tagFilter.toLowerCase())
      )
    : blogs

  const handleCardClick = (slug: string) => {
    router.push(`/blog/${slug}`)
  }

  const handleTagClick = (tag: string) => {
    router.push(`/blog?tag=${tag}`)
  }

  const clearFilter = () => {
    router.push('/blog')
  }

  return (
    <div className="min-h-screen text-white relative font-sans pb-24">
      {/* Background decoration */}
      <AnimatedBackground />

      {/* Navbar wrapper */}
      <div className="pt-24">
        <Navbar />
      </div>

      <div className="w-full max-w-[1250px] mx-auto px-8 md:px-12 py-12">
        {/* Navigation Breadcrumb / Go Back */}
        <div className="mb-10">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white/50 hover:text-white transition text-sm cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Ana Sayfaya Dön
          </button>
        </div>

        {/* PAGE HEADER */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Tüm Blog Yazılarım
          </h1>
          <p className="text-white/50 max-w-xl text-sm md:text-base">
            Teknoloji, yapay zeka, yazılım ve araştırma alanlarındaki paylaşımlarım.
          </p>
        </div>

        {/* ACTIVE FILTER DISPLAY */}
        {tagFilter && (
          <div className="flex flex-wrap items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-10 max-w-lg">
            <span className="text-sm text-white/60">Filtrelenen Etiket:</span>
            <span className="flex items-center gap-0.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold">
              <Hash size={12} />
              {tagFilter}
            </span>
            <button
              onClick={clearFilter}
              className="ml-auto text-xs text-white/40 hover:text-white bg-white/5 hover:bg-white/15 px-3 py-1.5 rounded-lg border border-white/5 transition cursor-pointer"
            >
              Filtreyi Temizle
            </button>
          </div>
        )}

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-white/40 gap-3">
            <RefreshCw size={24} className="animate-spin" />
            <span>Yazılar yükleniyor...</span>
          </div>
        )}

        {/* BLOG GRID */}
        {!loading && (
          filteredBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((item, index) => {
                const tagList = item.tags.split(',').map(t => t.trim())

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    onClick={() => handleCardClick(item.slug)}
                    className="group cursor-pointer rounded-[26px] border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl p-5 flex flex-col h-full transition duration-300 relative overflow-hidden"
                  >
                    {/* Card Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />

                    {/* Image Container */}
                    <div className="rounded-2xl overflow-hidden border border-white/10 h-48 relative mb-5">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">
                          Görsel Yok
                        </div>
                      )}
                      {/* Arrow indicator */}
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                        <ArrowUpRight size={14} className="text-white" />
                      </div>
                    </div>

                    {/* Meta details */}
                    <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                      <Calendar size={12} />
                      <span>{formatDate(item.created_at)}</span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-white transition duration-200">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/55 line-clamp-3 mb-6 flex-grow">
                      {item.summary}
                    </p>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                      {tagList.map(tag => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTagClick(tag)
                          }}
                          className="flex items-center gap-0.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/5 text-[11px] text-white/70 hover:text-white transition cursor-pointer"
                        >
                          <Hash size={10} />
                          {tag}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-white/40 border border-white/10 rounded-[26px] bg-white/[0.02] backdrop-blur-xl">
              <p className="text-lg mb-2">Bu arama kriterine uygun yazı bulunamadı.</p>
              <button
                onClick={clearFilter}
                className="mt-4 px-6 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-white transition cursor-pointer"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default function BlogListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
        <RefreshCw className="animate-spin text-white/40" size={24} />
      </div>
    }>
      <BlogListContent />
    </Suspense>
  )
}
