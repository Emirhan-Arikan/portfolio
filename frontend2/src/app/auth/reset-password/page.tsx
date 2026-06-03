'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import AnimatedBackground from '@/components/AnimatedBackground'

function ResetPasswordFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const uid = searchParams.get('uid')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token || !uid) {
      setError('Geçersiz veya eksik şifre sıfırlama parametreleri.')
      return
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.')
      return
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${apiBase}/api/password-reset-confirm/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, uid, password }),
      })

      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Şifre sıfırlama işlemi başarısız oldu.')
      }
    } catch (err) {
      setError('Sunucu bağlantı hatası.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center p-6 relative font-sans">
      <AnimatedBackground />

      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-black/80 p-8 backdrop-blur-xl shadow-2xl z-10">
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-5"
          >
            <div className="flex justify-center text-emerald-400">
              <CheckCircle2 size={54} />
            </div>
            <h3 className="text-xl font-bold">Şifreniz Güncellendi</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Yeni şifreniz başarıyla kaydedildi. Şimdi ana sayfaya dönerek yeni şifrenizle giriş yapabilirsiniz.
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full rounded-2xl py-4 bg-white text-black font-semibold text-sm transition hover:bg-white/90 cursor-pointer"
            >
              Ana Sayfaya Git
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Yeni Şifre Belirleyin</h2>
              <p className="text-sm text-white/50">Lütfen yeni ve güvenli bir şifre girin.</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl flex items-center gap-2"
              >
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-1">
                <label className="text-xs text-white/50">Yeni Şifre</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/15 bg-white/[0.03] pl-12 pr-4 py-4 outline-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40 text-sm"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs text-white/50">Şifreyi Onayla</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/15 bg-white/[0.03] pl-12 pr-4 py-4 outline-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40 text-sm"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading || !token || !uid}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full rounded-2xl py-4 mt-2 bg-white text-black font-semibold transition flex items-center justify-center cursor-pointer text-sm ${
                  loading || !token || !uid ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : 'Şifreyi Güncelle'}
              </motion.button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-xs text-white/40 hover:text-white transition cursor-pointer flex items-center gap-1.5 mx-auto"
              >
                <ArrowLeft size={12} />
                Ana Sayfaya Dön
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordFormPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
        <RefreshCw className="animate-spin text-white/40" size={24} />
      </div>
    }>
      <ResetPasswordFormContent />
    </Suspense>
  )
}
