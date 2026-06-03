'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Lock, Mail, KeyRound, CheckCircle2 } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = 'login' | 'register' | 'forgot-password'

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 1. Forgot Password Flow
    if (activeTab === 'forgot-password') {
      if (!email.trim()) {
        setError('E-posta adresi gereklidir.')
        return
      }
      setLoading(true)
      try {
        const res = await fetch(`${apiBase}/api/password-reset/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        })
        if (res.ok) {
          setResetSuccess(true)
        } else {
          const data = await res.json()
          setError(data.error || 'E-posta gönderimi başarısız oldu.')
        }
      } catch (err) {
        setError('Sunucu bağlantı hatası.')
      } finally {
        setLoading(false)
      }
      return
    }

    // 2. Normal Login/Register Flow
    if (!username.trim() || !password.trim()) {
      setError('Kullanıcı adı ve şifre gereklidir.')
      return
    }

    if (activeTab === 'register' && !email.trim()) {
      setError('E-posta adresi gereklidir.')
      return
    }

    setLoading(true)

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
        window.dispatchEvent(new Event('auth-change'))
        
        // Reset and Close
        setUsername('')
        setEmail('')
        setPassword('')
        onClose()
      } else {
        if (activeTab === 'login') {
          setError('Giriş yapılamadı')
        } else {
          setError(data.error || 'Bir hata oluştu. Lütfen bilgilerinizi kontrol edin.')
        }
      }
    } catch (err) {
      if (activeTab === 'login') {
        setError('Giriş yapılamadı')
      } else {
        setError('Sunucu bağlantı hatası. Backend aktif mi?')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'MOCK_GOOGLE_CLIENT_ID'
    const redirectUri = `${window.location.origin}/auth/callback/google`
    if (clientId === 'MOCK_GOOGLE_CLIENT_ID') {
      window.location.href = `/auth/callback/google?code=mock_google_code_${Math.floor(Math.random() * 10000)}`
    } else {
      const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile`
      window.location.href = googleUrl
    }
  }

  const handleGithubLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'MOCK_GITHUB_CLIENT_ID'
    const redirectUri = `${window.location.origin}/auth/callback/github`
    if (clientId === 'MOCK_GITHUB_CLIENT_ID') {
      window.location.href = `/auth/callback/github?code=mock_github_code_${Math.floor(Math.random() * 10000)}`
    } else {
      const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`
      window.location.href = githubUrl
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-black/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl text-white z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>

            {activeTab !== 'forgot-password' ? (
              <>
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
              </>
            ) : (
              <div className="mb-6 mt-2 pb-3 border-b border-white/10 text-center">
                <h3 className="text-base font-semibold font-sans">Şifremi Unuttum</h3>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            {activeTab === 'forgot-password' && resetSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="flex justify-center text-emerald-400">
                  <CheckCircle2 size={48} />
                </div>
                <h4 className="text-lg font-semibold">Bağlantı Gönderildi</h4>
                <p className="text-sm text-white/60">
                  Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('login')
                    setResetSuccess(false)
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs transition hover:bg-white/90 cursor-pointer"
                >
                  Giriş Yap
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'forgot-password' && (
                  <div className="space-y-3 mb-2">
                    <p className="text-xs text-white/50 leading-relaxed text-center">
                      Hesabınızın e-posta adresini girin, size şifrenizi sıfırlamanız için bir bağlantı gönderelim.
                    </p>
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
                          className="w-full rounded-2xl border border-white/15 bg-white/[0.03] pl-12 pr-4 py-4 outline-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab !== 'forgot-password' && (
                  <>
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
                          className="w-full rounded-2xl border border-white/15 bg-white/[0.03] pl-12 pr-4 py-4 outline-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40 text-sm"
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
                            className="w-full rounded-2xl border border-white/15 bg-white/[0.03] pl-12 pr-4 py-4 outline-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40 text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {/* Password */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-white/50">Şifre</label>
                        {activeTab === 'login' && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('forgot-password')
                              setError('')
                            }}
                            className="text-[10px] text-white/40 hover:text-white transition cursor-pointer"
                          >
                            Şifremi Unuttum
                          </button>
                        )}
                      </div>
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
                  </>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`w-full rounded-2xl py-4 mt-2 bg-white text-black font-semibold transition flex items-center justify-center cursor-pointer text-sm ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Lütfen bekleyin...' : activeTab === 'login' ? 'Giriş Yap' : activeTab === 'register' ? 'Kayıt Ol' : 'Bağlantı Gönder'}
                </motion.button>

                {activeTab === 'forgot-password' && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('login')
                        setError('')
                      }}
                      className="text-xs text-white/40 hover:text-white transition cursor-pointer flex items-center gap-1.5 mx-auto"
                    >
                      <KeyRound size={12} />
                      Giriş Ekranına Dön
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* Social Logins */}
            {activeTab !== 'forgot-password' && (
              <div className="space-y-4 mt-6 pt-6 border-t border-white/10">
                <div className="text-center relative">
                  <span className="text-[10px] text-white/30 tracking-widest uppercase bg-black/80 px-3 absolute left-1/2 -translate-x-1/2 -top-[26px] z-10">
                    veya
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Google Login */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.357-2.846-6.357-6.356 0-3.51 2.847-6.356 6.357-6.356 1.63 0 3.127.618 4.266 1.63l3.078-3.078C18.912 2.15 15.782 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.48 0 11.24-4.557 11.24-11.24 0-.763-.086-1.5-.246-2.185H12.24z"/>
                    </svg>
                    Google
                  </button>

                  {/* GitHub Login */}
                  <button
                    type="button"
                    onClick={handleGithubLogin}
                    className="flex items-center justify-center px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                    </svg>
                    GitHub
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
