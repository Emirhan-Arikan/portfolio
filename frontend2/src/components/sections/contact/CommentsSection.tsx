'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Upload, Heart, Pin } from 'lucide-react'
import { apiBase } from '@/lib/api'

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
}

interface CommentItem {
  id: number
  name: string
  comment: string
  likes: number
  is_pinned: boolean
  image: string | null
  image_url?: string | null
  created_at?: string
}

const FALLBACK_COMMENTS: CommentItem[] = []

export default function CommentsSection() {

  const [comments, setComments] = useState<CommentItem[]>(FALLBACK_COMMENTS)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Auth States
  const [user, setUser] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const [comment, setComment] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const fetchComments = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/api/comments/`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setComments(data)
        }
      }
    } catch (err) {
      console.warn('Could not fetch comments from backend. Using fallback.', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()

    const checkAuth = () => {
      const storedUsername = localStorage.getItem('portfolio_username')
      const storedToken = localStorage.getItem('portfolio_token')
      if (storedUsername && storedToken) {
        setUser(storedUsername)
        setToken(storedToken)
      } else {
        setUser(null)
        setToken(null)
      }
    }

    checkAuth()
    window.addEventListener('auth-change', checkAuth)
    return () => window.removeEventListener('auth-change', checkAuth)
  }, [])

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!comment.trim()) return
    if (!token) {
      window.dispatchEvent(new Event('open-auth-modal'))
      return
    }

    setSubmitting(true)
    const formData = new FormData()
    formData.append('comment', comment.trim())
    if (image) {
      formData.append('image', image)
    }

    try {
      const res = await fetch(`${apiBase}/api/comments/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData,
      })

      if (res.ok) {
        setComment('')
        setImage(null)
        setPreview(null)
        fetchComments() // reload list
      } else {
        alert('Failed to post comment.')
      }
    } catch (err) {
      alert('Network error. Is backend server running?')
    } finally {
      setSubmitting(false)
    }
  }

  const likeComment = async (id: number, currentLikes: number) => {
    // Optimistic UI update
    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    )

    const headers: HeadersInit = {}
    if (token) {
      headers['Authorization'] = `Token ${token}`
    }

    try {
      const res = await fetch(`${apiBase}/api/comments/${id}/like/`, {
        method: 'POST',
        headers: headers
      })
      if (res.ok) {
        const data = await res.json()
        setComments(prev =>
          prev.map(c => (c.id === id ? { ...c, likes: data.likes } : c))
        )
      }
    } catch (err) {
      console.error('Error liking comment', err)
      // revert if failed
      setComments(prev =>
        prev.map(c => (c.id === id ? { ...c, likes: currentLikes } : c))
      )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        ease: smoothEase,
      }}
      viewport={{ once: false, amount: 0.2 }}
      className="rounded-[28px] md:rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-xl p-5 md:p-8 h-full flex flex-col"
    >
      {/* HEADER */}
      <div className="mb-5 md:mb-6">
        <h3 className="text-xl md:text-2xl font-semibold mb-1">
          Yorumlar
        </h3>

        <p className="text-xs md:text-sm text-white/40">
          Düşüncelerinizi buraya bırakın
        </p>
      </div>

      {/* FORM */}
      {user ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          className="space-y-3 md:space-y-4 mb-5 md:mb-6"
        >
          <div className="flex items-center gap-2 text-xs text-white/40 px-1">
            <span>Yorum yazan:</span>
            <span className="font-semibold text-white">{user}</span>
          </div>

          <motion.textarea
            variants={itemVariants}
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Yorumunuzu buraya yazın..."
            className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 md:py-4 outline-none resize-none focus:border-white text-sm"
          />

          <motion.label
            variants={itemVariants}
            className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-3 md:p-4 flex items-center gap-3 cursor-pointer"
          >
            <Upload size={16} />

            <span className="text-xs md:text-sm text-white/65">
              {image ? image.name : 'Görsel Yükle (İsteğe Bağlı)'}
            </span>

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleImage}
            />
          </motion.label>

          <AnimatePresence>
            {preview && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={preview}
                alt="Preview"
                className="rounded-2xl h-36 md:h-44 w-full object-cover border border-white/10"
              />
            )}
          </AnimatePresence>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full rounded-2xl py-3 md:py-4 bg-white/10 border border-white/10 transition-all cursor-pointer text-sm font-semibold"
          >
            {submitting ? 'Gönderiliyor...' : 'Yorum Yap'}
          </motion.button>
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-6 mb-6 text-center space-y-4">
          <p className="text-sm text-white/50">Yorum yazmak için lütfen giriş yapın.</p>
          <button
            onClick={() => window.dispatchEvent(new Event('open-auth-modal'))}
            className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 transition cursor-pointer"
          >
            Giriş Yap / Kayıt Ol
          </button>
        </div>
      )}

      {/* COMMENTS LIST */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false }}
        className="rounded-[24px] md:rounded-[28px] border border-white/10 bg-black/20 p-3 h-[320px] md:h-[420px] overflow-y-auto custom-scroll flex-1"
      >
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {comments.map((item, i) => (
              <motion.div
                key={item.id || i}
                layout
                initial={{
                  opacity: 0,
                  y: 18,
                  scale: 0.96,
                  filter: 'blur(6px)',
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.55,
                  ease: smoothEase,
                  layout: {
                    duration: 0.45,
                    ease: smoothEase,
                  },
                }}
                className={`rounded-[20px] md:rounded-[24px] border p-3 md:p-4 ${
                  item.is_pinned
                    ? 'border-purple-500/30 bg-purple-500/5'
                    : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div className="flex gap-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold shrink-0">
                    {item.name?.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-medium">
                        {item.name}
                      </p>

                      {item.is_pinned && (
                        <div className="flex items-center gap-1 px-2 py-[3px] rounded-full bg-purple-500/15 border border-purple-500/20 text-[10px] text-purple-300">
                          <Pin size={10} />
                          SABİTLENDİ
                        </div>
                      )}
                    </div>

                    <p className="text-[12px] md:text-[13px] text-white/55">
                      {item.comment}
                    </p>

                    {(item.image || item.image_url) && (
                      <img
                        src={item.image || item.image_url || undefined}
                        alt="Comment"
                        className="mt-3 rounded-xl w-full max-h-48 md:max-h-56 object-cover border border-white/10"
                      />
                    )}
                  </div>

                  <button
                    onClick={() =>
                      likeComment(item.id, item.likes)
                    }
                    className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    <Heart size={13} />
                    {item.likes || 0}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}