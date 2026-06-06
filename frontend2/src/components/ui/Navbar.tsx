'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import AuthModal from './AuthModal'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mounted, setMounted] = useState(false)
  const [showNavbar, setShowNavbar] = useState(false)

  // Auth states
  const [user, setUser] = useState<string | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)

    const checkAuth = () => {
      const storedUsername = localStorage.getItem('portfolio_username')
      const token = localStorage.getItem('portfolio_token')
      if (storedUsername && token) {
        setUser(storedUsername)
      } else {
        setUser(null)
      }
    }

    const openModal = () => {
      setAuthModalOpen(true)
    }

    checkAuth()
    window.addEventListener('auth-change', checkAuth)
    window.addEventListener('open-auth-modal', openModal)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = ['home', 'about', 'portfolio', 'contact']

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId)
        if (!section) continue

        const rect = section.getBoundingClientRect()

        if (rect.top <= 140 && rect.bottom >= 140) {
          setActiveSection(sectionId)
          break
        }
      }
    }

    handleResize()
    handleScroll()

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('auth-change', checkAuth)
      window.removeEventListener('open-auth-modal', openModal)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const navbarPlayed = sessionStorage.getItem('navbarPlayed')

    if (navbarPlayed) {
      setShowNavbar(true)
      return
    }

    const timer = setTimeout(() => {
      setShowNavbar(true)
      sessionStorage.setItem('navbarPlayed', 'true')
    }, 3800)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  const handleLogout = () => {
    localStorage.removeItem('portfolio_token')
    localStorage.removeItem('portfolio_username')
    window.dispatchEvent(new Event('auth-change'))
    setOpen(false)
  }

  const smoothScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault()

    const target = document.querySelector(targetId)
    if (!target) return

    const navbarOffset = 3
    const targetPosition =
      target.getBoundingClientRect().top + window.scrollY - navbarOffset

    const startPosition = window.scrollY
    const distance = targetPosition - startPosition
    const duration = 1200

    let startTime: number | null = null

    const easeInOutCubic = (t: number) => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime

      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)

      const ease = easeInOutCubic(progress)

      window.scrollTo({
        top: startPosition + distance * ease,
      })

      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
    setOpen(false)
  }

  const navItems = [
    { label: 'Home', id: 'home', href: '/' },
    { label: 'About', id: 'about', href: '/#about' },
    { label: 'Portfolio', id: 'portfolio', href: '/#portfolio' },
    { label: 'Blog', id: 'blog', href: '/blog' },
    { label: 'Contact', id: 'contact', href: '/#contact' },
  ]

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -40 }}
        animate={{
          opacity: showNavbar ? 1 : 0,
          y: showNavbar ? 0 : -40,
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          position: 'fixed',
          top: 20,
          left: isMobile ? 20 : 60,
          right: isMobile ? 20 : 60,
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 30px',
            width: '100%',
            borderRadius: 999,
            backgroundColor: scrolled
              ? 'rgba(13,13,13,0.92)'
              : 'rgba(13,13,13,0.5)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
                color: 'var(--text-secondary)',
                letterSpacing: '0.1em',
              }}
            >
              emirhanarikan.com.tr
            </span>
            {!isMobile && (
              <a
                href="mailto:info@emirhanarikan.com.tr"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.45)',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '3px 10px',
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  transition: '0.2s',
                }}
                className="hover:text-white hover:border-white/20 hover:bg-white/5"
              >
                info@emirhanarikan.com.tr
              </a>
            )}
          </div>

          {!isMobile && (
            <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 30 }}>
                {navItems.map((item) => {
                  const isActive = activeSection === item.id && pathname === '/'
                  const isBlog = item.id === 'blog'
                  const isHome = pathname === '/'

                  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (isBlog) {
                      e.preventDefault()
                      router.push('/blog')
                      setOpen(false)
                    } else if (!isHome) {
                      setOpen(false)
                    } else {
                      smoothScrollTo(e, `#${item.id}`)
                    }
                  }

                  return (
                    <a
                      key={item.id}
                      href={isBlog ? '/blog' : (isHome ? `#${item.id}` : `/${item.id === 'home' ? '' : '#' + item.id}`)}
                      onClick={handleClick}
                      style={{
                        position: 'relative',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 13,
                        color: isActive
                          ? 'var(--text-primary)'
                          : 'var(--text-secondary)',
                        textDecoration: 'none',
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        paddingBottom: 4,
                        transition: '0.25s ease',
                      }}
                      className="hover:text-white"
                    >
                      {item.label}

                      {!isBlog && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: 1,
                            background: 'white',
                            transform: isActive
                              ? 'scaleX(1)'
                              : 'scaleX(0)',
                            transformOrigin: 'left',
                            transition: 'transform 0.25s ease',
                          }}
                        />
                      )}
                    </a>
                  )
                })}
              </div>

              {/* Desktop Auth Button */}
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: 20, display: 'flex', alignItems: 'center' }}>
                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                      {user}
                    </span>
                    <button
                      onClick={handleLogout}
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 11,
                        color: 'white',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '6px 12px',
                        borderRadius: 999,
                        cursor: 'pointer',
                        transition: '0.2s',
                      }}
                      className="hover:bg-white hover:text-black"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      color: 'black',
                      background: 'white',
                      border: '1px solid white',
                      padding: '6px 14px',
                      borderRadius: 999,
                      cursor: 'pointer',
                      transition: '0.2s',
                      fontWeight: 600,
                    }}
                    className="hover:bg-transparent hover:text-white"
                  >
                    Giriş Yap
                  </button>
                )}
              </div>
            </div>
          )}

          {isMobile && (
            <div
              onClick={() => setOpen(!open)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                cursor: 'pointer',
              }}
            >
              <span style={{ width: 20, height: 2, background: 'white' }} />
              <span style={{ width: 20, height: 2, background: 'white' }} />
              <span style={{ width: 20, height: 2, background: 'white' }} />
            </div>
          )}
        </div>

        {isMobile && open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              marginTop: 10,
              borderRadius: 16,
              background: 'rgba(13,13,13,0.92)',
              border: '1px solid var(--border)',
              backdropFilter: 'blur(12px)',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id && pathname === '/'
              const isBlog = item.id === 'blog'
              const isHome = pathname === '/'

              const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                if (isBlog) {
                  e.preventDefault()
                  router.push('/blog')
                  setOpen(false)
                } else if (!isHome) {
                  setOpen(false)
                } else {
                  smoothScrollTo(e, `#${item.id}`)
                }
              }

              return (
                <a
                  key={item.id}
                  href={isBlog ? '/blog' : (isHome ? `#${item.id}` : `/${item.id === 'home' ? '' : '#' + item.id}`)}
                  onClick={handleClick}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 13,
                    color: isActive
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </a>
              )
            })}

            {/* Mobile Mail Link */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 15, marginTop: 5 }}>
              <a
                href="mailto:info@emirhanarikan.com.tr"
                style={{
                  display: 'block',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '8px 16px',
                  borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  textAlign: 'center',
                }}
                className="hover:text-white"
              >
                info@emirhanarikan.com.tr
              </a>
            </div>

            {/* Mobile Auth Button */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 15, marginTop: 5 }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                    Hoş geldin, {user}
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      color: 'white',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '6px 12px',
                      borderRadius: 999,
                      cursor: 'pointer',
                    }}
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalOpen(true)
                    setOpen(false)
                  }}
                  style={{
                    width: '100%',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                    color: 'black',
                    background: 'white',
                    border: '1px solid white',
                    padding: '10px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Giriş Yap
                </button>
              )}
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Authentication Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  )
}