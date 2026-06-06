# Portföy Web Sitesi (Next.js & Django)

Bu proje, modern bir portföy web sitesidir. Kullanıcı arayüzü Next.js ile, yönetim paneli ve veri tabanı entegrasyonu ise Django REST Framework ile geliştirilmiştir.

---

## 🛠️ Proje Özellikleri

*   **Frontend**: Next.js 16 (React 19), Tailwind CSS, Framer Motion, Three.js (3D Globe Animasyonu).
*   **Backend**: Django, Django Rest Framework, SQLite (Lokal) / PostgreSQL (Canlı).
*   **Özellikler**: Portföy projeleri listeleme, sertifikalar, yetenekler (tech stack), iletişim formu, yorum sistemi (Google, GitHub ve normal üyelik).

---

## 💻 1. Frontend Kurulumu (`frontend2`)

### Gereksinimler
*   Node.js (v18+) ve npm

### Kurulum Adımları
1.  Frontend klasörüne gidin:
    ```bash
    cd frontend2
    ```
2.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
3.  Lokal ortam değişkenlerini ayarlamak için `frontend2` klasöründe `.env.local` dosyası oluşturun ve aşağıdaki değişkenleri tanımlayın:
    ```env
    NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
    NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
    ```
    *(Eğer istemci ID'leri girilmezse, lokal testler için otomatik olarak mock/örnek giriş modu aktif olur.)*
4.  Geliştirme sunucusunu başlatın:
    ```bash
    npm run dev
    ```
5.  Tarayıcınızda açın: [http://localhost:3000](http://localhost:3000)

---

## 🐍 2. Backend Kurulumu (`backend`)

### Gereksinimler
*   Python 3.10+

### Kurulum Adımları
1.  Backend klasörüne gidin:
    ```bash
    cd backend
    ```
2.  Sanal ortam (Virtual Environment) oluşturun ve aktif edin:
    *   **Windows**:
        ```bash
        python -m venv venv
        venv\Scripts\activate
        ```
    *   **macOS/Linux**:
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
3.  Bağımlılıkları yükleyin:
    ```bash
    pip install -r requirements.txt
    ```
4.  Veritabanını hazırlayın ve migration işlemleri ile başlangıç verilerini (seed data) yükleyin:
    ```bash
    python manage.py migrate
    ```
5.  Django yerel sunucusunu başlatın:
    ```bash
    python manage.py runserver
    ```
6.  API adresine erişin: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)
7.  Admin paneli: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

## 📝 Yorum ve İletişim Sistemi Çalışma Mantığı

*   **İletişim Formu**: Ziyaretçilerin gönderdiği mesajlar veritabanına kaydedilir ve otomatik olarak belirlenen e-posta adresine SMTP üzerinden iletilir.
*   **Yorumlar**: Yorum yapabilmek için kullanıcıların giriş yapması gerekir. Giriş işlemleri normal kayıt/giriş, Google OAuth veya GitHub OAuth ile gerçekleştirilebilir. Kayıtlı kullanıcılar kendi yorumlarını ekleyebilir, beğenebilir ve düzenleyebilir/silebilir.
