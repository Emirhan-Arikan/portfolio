'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import AnimatedBackground from '@/components/AnimatedBackground'

function GoogleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Google ile giriş doğrulanıyor...')
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

  useEffect(() => {
    if (!code) {
      setStatus('error')
      setMessage('Doğrulama kodu (OAuth code) bulunamadı.')
      return
    }

    async function exchangeCode() {
      try {
        const redirectUri = `${window.location.origin}/auth/callback/google`
        const res = await fetch(`${apiBase}/api/auth/google/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirect_uri: redirectUri }),
        })

        const data = await res.json()
        if (res.ok) {
          localStorage.setItem('portfolio_token', data.token)
          localStorage.setItem('portfolio_username', data.username)
          window.dispatchEvent(new Event('auth-change'))
          
          setStatus('success')
          setMessage('Başarıyla giriş yapıldı! Yönlendiriliyorsunuz...')
          
          setTimeout(() => {
            router.push('/')
          }, 1500)
        } else {
          setStatus('error')
          setMessage(data.error || 'Google ile giriş başarısız oldu.')
        }
      } catch (err) {
        setStatus('error')
        setMessage('Backend sunucu bağlantı hatası.')
      }
    }

    exchangeCode()
  }, [code, apiBase, router])

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center p-6 relative">
      <AnimatedBackground />

      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-black/80 p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 z-10">
        {status === 'loading' && (
          <div className="space-y-4">
            <RefreshCw className="animate-spin text-white/50 mx-auto" size={40} />
            <h3 className="text-lg font-semibold">Giriş Yapılıyor</h3>
            <p className="text-sm text-white/50">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle2 className="text-emerald-400 mx-auto" size={44} />
            <h3 className="text-lg font-semibold">Giriş Başarılı</h3>
            <p className="text-sm text-white/50">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-5">
            <AlertCircle className="text-red-400 mx-auto" size={44} />
            <h3 className="text-lg font-semibold">Giriş Başarısız</h3>
            <p className="text-sm text-white/50">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs transition hover:bg-white/90 cursor-pointer"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
        <RefreshCw className="animate-spin text-white/40" size={24} />
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  )
}
