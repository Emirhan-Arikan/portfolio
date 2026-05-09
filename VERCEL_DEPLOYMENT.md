# Vercel Deployment Guide

## ✅ Hazırlık Tamamlandı

Proje Vercel'e deploy edilmeye hazır! Supabase olmadan da çalışacak şekilde yapılandırıldı.

---

## 🚀 Vercel'e Deploy Etme

### Yöntem 1: GitHub Üzerinden (Önerilen)

1. **GitHub'a Push Edin**
   ```bash
   cd frontend2
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Vercel Dashboard'a Gidin**
   - https://vercel.com/dashboard adresine gidin
   - "Add New Project" tıklayın

3. **GitHub Repo'yu Seçin**
   - GitHub hesabınızı bağlayın
   - `portfolio` repo'nuzu seçin

4. **Root Directory Ayarlayın**
   - "Root Directory" kısmına `frontend2` yazın
   - Bu çok önemli! Yoksa build başarısız olur

5. **Environment Variables (Opsiyonel)**
   - Supabase kullanmayacaksanız boş bırakın
   - Kullanacaksanız:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_actual_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key
     ```

6. **Deploy**
   - "Deploy" butonuna tıklayın
   - 2-3 dakika bekleyin

---

## 🔧 Vercel Ayarları

### Build & Development Settings

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

### Root Directory
```
frontend2
```

**ÖNEMLİ**: Root directory'yi `frontend2` olarak ayarlamayı unutmayın!

---

## 🐛 Olası Hatalar ve Çözümleri

### Hata 1: "Module not found"
**Çözüm**: Root directory'yi `frontend2` olarak ayarlayın

### Hata 2: "Supabase URL required"
**Çözüm**: Artık bu hata gelmemeli. Eğer gelirse:
- Vercel'de Environment Variables ekleyin
- Veya middleware.ts'yi kontrol edin

### Hata 3: "Build failed"
**Çözüm**: 
- Vercel logs'u kontrol edin
- Local'de `npm run build` çalıştırıp test edin

### Hata 4: "Page not found"
**Çözüm**: 
- Root directory doğru mu kontrol edin
- `vercel.json` dosyası var mı kontrol edin

---

## 📁 Deploy Edilen Dosyalar

Aşağıdaki dosyalar Vercel'e gönderilmeli:

```
frontend2/
├── .env.example          ✅ (Environment variables örneği)
├── vercel.json           ✅ (Vercel yapılandırması)
├── middleware.ts         ✅ (Supabase optional)
├── src/
│   ├── lib/
│   │   ├── supabase.ts         ✅ (Placeholder değerler)
│   │   └── supabaseServer.ts   ✅ (Placeholder değerler)
│   └── ...
├── package.json
├── next.config.ts
└── ...
```

---

## ✨ Özellikler

- ✅ Supabase olmadan çalışır (statik veriler)
- ✅ Supabase ile çalışır (admin paneli aktif)
- ✅ Environment variables opsiyonel
- ✅ Middleware hata vermez
- ✅ Build başarılı
- ✅ Production ready

---

## 🔐 Supabase Kullanımı (Opsiyonel)

Eğer admin panelini ve dinamik verileri kullanmak isterseniz:

1. **Supabase Projesi Oluşturun**
   - https://supabase.com adresine gidin
   - Yeni proje oluşturun

2. **Veritabanı Tablolarını Oluşturun**
   - `projects` tablosu
   - `certificates` tablosu
   - `tech_stacks` tablosu
   - `comments` tablosu

3. **Vercel'de Environment Variables Ekleyin**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Redeploy Edin**
   - Vercel otomatik olarak yeniden deploy edecek

---

## 📊 Deployment Checklist

- [x] Root directory `frontend2` olarak ayarlandı
- [x] `vercel.json` oluşturuldu
- [x] Middleware Supabase'siz çalışıyor
- [x] Supabase client'lar placeholder değerlerle çalışıyor
- [x] Build başarılı (local test)
- [x] Environment variables opsiyonel
- [x] Statik veriler hazır (projeler, tech stack, sertifikalar)
- [x] SocialIcons eklendi
- [x] Globe yüksekliği düzeltildi
- [x] Sayfa başlığı güncellendi

---

## 🎯 Deploy Sonrası

Deploy başarılı olduktan sonra:

1. **Domain Kontrolü**
   - Vercel size otomatik bir domain verir: `your-project.vercel.app`
   - Kendi domain'inizi bağlayabilirsiniz

2. **Test Edin**
   - Ana sayfa yükleniyor mu?
   - Projeler görünüyor mu?
   - Tech stack logoları yükleniyor mu?
   - Globe animasyonu çalışıyor mu?
   - Sosyal medya ikonları görünüyor mu?

3. **Analytics (Opsiyonel)**
   - Vercel Analytics'i aktif edin
   - Ziyaretçi istatistiklerini görün

---

## 🔄 Güncelleme

Kod değişikliği yaptığınızda:

```bash
git add .
git commit -m "Update: your changes"
git push origin main
```

Vercel otomatik olarak yeniden deploy edecek.

---

## 📞 Destek

Sorun yaşarsanız:
1. Vercel logs'u kontrol edin
2. Local'de `npm run build` test edin
3. Environment variables'ı kontrol edin
4. Root directory ayarını kontrol edin

---

**Başarılar! 🚀**
