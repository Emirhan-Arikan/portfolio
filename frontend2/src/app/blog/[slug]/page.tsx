'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Hash, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import AnimatedBackground from '@/components/AnimatedBackground'
import { STATIC_BLOGS } from '@/components/sections/BlogShowcase'

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

export default function BlogDetailPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string

  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

  useEffect(() => {
    if (!slug) return

    async function fetchBlogDetail() {
      setLoading(true)
      try {
        const res = await fetch(`${apiBase}/api/blogs/${slug}/`)
        if (res.ok) {
          const data = await res.json()
          if (data && data.slug) {
            setBlog(data)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.warn('Backend detail fetch failed, searching static fallbacks.', err)
      }

      // Fallback search
      const fallbackPost = STATIC_BLOGS.find(item => item.slug === slug)
      if (fallbackPost) {
        setBlog(fallbackPost)
        setError(false)
      } else {
        setError(true)
      }
      setLoading(false)
    }

    fetchBlogDetail()
  }, [slug, apiBase])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center gap-3">
        <RefreshCw className="animate-spin text-white/40" size={24} />
        <span className="text-white/40 text-sm">Yazı yükleniyor...</span>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertCircle size={40} className="text-red-500/80" />
        <h1 className="text-2xl font-bold">Blog yazısı bulunamadı</h1>
        <p className="text-white/50 text-sm max-w-sm">
          İstediğiniz blog yazısı mevcut değil veya silinmiş olabilir.
        </p>
        <button
          onClick={() => router.push('/blog')}
          className="mt-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-sm transition cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Blog Listesine Dön
        </button>
      </div>
    )
  }

  const tagList = blog.tags.split(',').map(t => t.trim())

  return (
    <div className="min-h-screen text-white relative font-sans pb-32">
      {/* Background blobs & grids */}
      <AnimatedBackground />

      {/* Navbar Wrapper */}
      <div className="pt-24">
        <Navbar />
      </div>

      <div className="w-full max-w-[900px] mx-auto px-6 md:px-8 py-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/blog')}
            className="flex items-center gap-2 text-white/50 hover:text-white transition text-sm cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Tüm Yazılara Dön
          </button>
        </div>

        {/* POST META & TAGS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-4 text-xs text-white/40 mb-6"
        >
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>{formatDate(blog.created_at)}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 ml-1">
            {tagList.map(tag => (
              <button
                key={tag}
                onClick={() => router.push(`/blog?tag=${tag}`)}
                className="flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/5 text-[10px] text-white/60 hover:text-white transition cursor-pointer"
              >
                <Hash size={9} />
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* POST TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.15]"
        >
          {blog.title}
        </motion.h1>

        {/* POST HEADER IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-[30px] overflow-hidden border border-white/10 w-full aspect-[21/9] md:h-[350px] relative mb-12"
        >
          {blog.image_url ? (
            <img
              src={blog.image_url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">
              Görsel Yok
            </div>
          )}
        </motion.div>

        {/* POST CONTENT BODY */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="prose prose-invert max-w-none text-white/80 text-base md:text-lg leading-relaxed space-y-6 font-light"
        >
          {blog.content ? (
            blog.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="italic text-white/40">Bu yazının içeriği henüz eklenmedi.</p>
          )}
        </motion.article>
      </div>
    </div>
  )
}
