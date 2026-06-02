'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Lock, Mail } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Kullanıcı adı ve şifre gereklidir.')
      return
    }

    if (activeTab === 'register' && !email.trim()) {
      setError('E-posta adresi gereklidir.')
      return
    }

    setLoading(true)
    setError('')

    const endpoint = activeTab === 'login' ? 'login' : 'register'
    const bodyData =
      activeTab === 'login'
        ? { username: username.trim(), password: password.trim() }
        : { username: username.trim(), email: email.trim(), password: password.trim() }

    try {
      const res = await fetch(`${apiBase}/api/${endpoint}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('portfolio_token', data.token)
        localStorage.setItem('portfolio_username', data.username)
        // Notify other components of authentication change
        window.dispatchEvent(new Event('auth-change'))
        
        // Reset and Close
        setUsername('')
        setEmail('')
        setPassword('')
        onClose()
      } else {
        setError(data.error || 'Bir hata oluştu. Lütfen bilgilerinizi kontrol edin.')
      }
    } catch (err) {
      setError('Sunucu bağlantı hatası. Backend aktif mi?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-black/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl text-white z-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Title / Tabs */}
            <div className="flex border-b border-white/10 mb-6 mt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login')
                  setError('')
                }}
                className={`flex-1 pb-3 text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'login' ? 'border-b-2 border-white text-white' : 'text-white/40'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register')
                  setError('')
                }}
                className={`flex-1 pb-3 text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'register' ? 'border-b-2 border-white text-white' : 'text-white/40'
                }`}
              >
                Kayıt Ol
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="space-y-1">
                <label className="text-xs text-white/50">Kullanıcı Adı</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="kullanici_adi"
                    className="w-full rounded-2xl border border-white/15 bg-white/[0.03] pl-12 pr-4 py-4 outline-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40"
                  />
                </div>
              </div>

              {/* Email (Register only) */}
              {activeTab === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs text-white/50">E-posta Adresi</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e-posta@example.com"
                      className="w-full rounded-2xl border border-white/15 bg-white/[0.03] pl-12 pr-4 py-4 outline-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs text-white/50">Şifre</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/15 bg-white/[0.03] pl-12 pr-4 py-4 outline-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full rounded-2xl py-4 mt-2 bg-white text-black font-semibold transition flex items-center justify-center cursor-pointer ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Lütfen bekleyin...' : activeTab === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
