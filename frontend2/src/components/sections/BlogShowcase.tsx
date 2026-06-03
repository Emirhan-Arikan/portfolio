'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Hash, ArrowUpRight } from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  summary: string
  content: string
  image_url: string | null
  tags: string // comma-separated
  slug: string
  created_at: string
}

export const STATIC_BLOGS: BlogPost[] = [
  {
    id: 1,
    title: 'Yapay Zeka ve Akıllı Tarım Uygulamaları',
    summary: 'RAG chatbotları ve veri analitiği ile modern tarımda verimliliği artırma yolları. Tarımsal üretim süreçlerinin optimize edilmesi.',
    content: 'Modern tarımda verimlilik, veri analitiği ve yapay zeka entegrasyonu ile yepyeni bir seviyeye ulaşıyor. Özellikle RAG (Retrieval-Augmented Generation) tabanlı tarım chatbotları, çiftçilerin ekim, sulama, gübreleme ve hastalık teşhisi gibi kritik konularda anında bilimsel verilere dayalı yanıtlar almasını sağlıyor. Toprak sensörlerinden gelen nem, pH ve sıcaklık verileri derin öğrenme modelleriyle analiz edilerek hasat dönemleri en doğru şekilde tahmin edilebiliyor. Akıllı tarım teknolojileri, su ve gübre tasarrufu sağlarken rekolteyi maksimum seviyeye çıkarmaya yardımcı oluyor.',
    image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
    tags: 'teknoloji,tarim',
    slug: 'yapay-zeka-ve-akilli-tarim-uygulamalari',
    created_at: '2026-06-02T20:30:00Z'
  },
  {
    id: 2,
    title: 'WiFi Sinyalleri ile Duvar Arkasını Görmek',
    summary: 'WiFi sinyallerinin yansıması ve faz değişimlerini analiz ederek duvar arkasındaki nesnelerin ve insanların 3 boyutlu görüntülerini elde etme teknolojisi.',
    content: 'WiFi sinyalleri sadece internete bağlanmamızı sağlamakla kalmıyor, aynı zamanda ortamdaki fiziksel nesnelerin konumunu saptamak için de kullanılabiliyor. MIMO (Multiple-Input Multiple-Output) anten teknolojisi ve gelişmiş sinyal işleme algoritmaları sayesinde, duvarın arkasından sızan WiFi dalgalarının faz değişimleri ve genlik yansımaları ölçülüyor. Bu yansımalar derin öğrenme ve yapay sinir ağları ile eğitilmiş bilgisayarlı görü modellerine beslenerek, duvarın arkasında hareket eden insanların 3 boyutlu duruş iskeletleri (pose estimation) elde edilebiliyor. Bu teknoloji, arama-kurtarma çalışmalarında enkaz altındaki kişilerin yerini saptamaktan ev içi güvenlik ve sağlık izleme sistemlerine kadar geniş bir yelpazede devrim yaratma potansiyeline sahip.',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
    tags: 'teknoloji,wifi',
    slug: 'wifi-sinyalleri-ile-duvar-arkasini-gormek',
    created_at: '2026-06-02T20:31:00Z'
  },
  {
    id: 3,
    title: 'Makine Öğrenmesi Modellerinde Açıklanabilirlik (XAI)',
    summary: 'Yapay zeka modellerinin karar alma süreçlerini anlamak ve tahminlerini şeffaf hale getirmek için kullanılan XAI yöntemleri.',
    content: 'Derin öğrenme modelleri genellikle birer \'kara kutu\' (black box) olarak çalışır; girdi girilir ve bir tahmin üretilir, ancak modelin neden bu kararı verdiği anlaşılması zordur. Açıklanabilir Yapay Zeka (XAI - Explainable AI) teknikleri, bu karar alma süreçlerini görünür kılarak modellerin güvenilirliğini artırmayı hedefler. SHAP (SHapley Additive exPlanations) ve LIME (Local Interpretable Model-agnostic Explanations) gibi yöntemler, her bir girdinin tahmin üzerindeki ağırlığını matematiksel olarak hesaplar. Bu şeffaflık, tıp teşhis sistemleri, finansal kredi onayları ve deprem büyüklüğü sınıflandırması gibi kritik alanlarda yapay zekanın güvenle kullanılabilmesi için hayati önem taşır.',
    image_url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80',
    tags: 'teknoloji,makine-ogrenmesi',
    slug: 'makine-ogrenmesinde-aciklanabilirlik',
    created_at: '2026-06-02T20:32:00Z'
  }
]

export default function BlogShowcase() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<BlogPost[]>(STATIC_BLOGS)
  const [loading, setLoading] = useState(false)
  
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

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

  const handleCardClick = (slug: string) => {
    router.push(`/blog/${slug}`)
  }

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation() // Prevent clicking the card
    router.push(`/blog?tag=${tag}`)
  }

  return (
    <section id="blog" className="w-full max-w-[1450px] mx-auto px-8 md:px-12 lg:px-20 py-24 text-white">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Son Yazılarım</h2>
        <p className="text-white/50 max-w-xl mx-auto text-sm md:text-base">
          Teknoloji, spor ve yapay zeka alanında kaleme aldığım son blog yazılarımı inceleyin.
        </p>
      </motion.div>

      {/* BLOG GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {blogs.map((item, index) => {
          const tagList = item.tags.split(',').map(t => t.trim())

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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
                    onClick={(e) => handleTagClick(e, tag)}
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

      {/* FOOTER CTA */}
      <div className="flex justify-center mt-12">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/blog')}
          className="px-8 py-3.5 rounded-full border border-white/10 bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-xl text-sm font-semibold text-white transition flex items-center gap-2 cursor-pointer"
        >
          Tüm Yazıları Gör
          <ArrowUpRight size={16} />
        </motion.button>
      </div>
    </section>
  )
}
