# Frontend2 - Portfolio Website

Bu proje [RifqiMuhammadAliya12/portofoliov1](https://github.com/RifqiMuhammadAliya12/portofoliov1) reposundan klonlanmış ve Contact bölümü özelleştirilmiştir.

## Özelleştirmeler

### Contact Bölümü
- **Sol taraf**: Contact Form (orijinal tasarım korundu)
- **Sağ taraf**: 3D Globe animasyonu (earth_globe.glb) - frontend klasöründen alındı
- **Alt kısım**: Comments Section (tam genişlik)

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env.local` dosyasını düzenleyin ve Supabase bilgilerinizi ekleyin:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda açın: [http://localhost:3000](http://localhost:3000)

## Özellikler

- ✅ Next.js 16.2.4
- ✅ React 19.2.4
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Framer Motion animasyonlar
- ✅ Three.js / React Three Fiber (3D Globe)
- ✅ Supabase entegrasyonu
- ✅ Admin paneli
- ✅ Portfolio showcase
- ✅ Comments sistemi
- ✅ Responsive tasarım

## Dosya Yapısı

```
frontend2/
├── public/
│   ├── earth_globe.glb      # 3D Globe modeli
│   └── assets/
├── src/
│   ├── app/
│   │   ├── admin/           # Admin paneli
│   │   └── portfolio/       # Portfolio detay sayfaları
│   ├── components/
│   │   ├── GlobeModel.tsx   # 3D Globe bileşeni (YENİ)
│   │   ├── sections/
│   │   │   └── contact/
│   │   │       ├── ContactSection.tsx    # Ana contact bölümü (GÜNCELLENDİ)
│   │   │       ├── ContactForm.tsx       # İletişim formu
│   │   │       └── CommentsSection.tsx   # Yorumlar
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   └── ...
└── ...
```

## Build

Production build almak için:
```bash
npm run build
```

Build sonrası başlatmak için:
```bash
npm start
```

## Notlar

- 3D Globe animasyonu client-side render edilir (SSR kapalı)
- Supabase yapılandırması admin paneli ve comments için gereklidir
- Responsive tasarım: mobilde tek sütun, desktop'ta iki sütun layout
