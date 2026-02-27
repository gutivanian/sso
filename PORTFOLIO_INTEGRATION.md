# Portfolio Integration - SSO Auth

## Overview

Repository SSO Auth ini telah diintegrasikan dengan portfolio dari About-Me repository. Sekarang sistem ini berfungsi sebagai:
1. **Homepage Portfolio** - Menampilkan profil, skills, dan projects
2. **SSO Authentication** - Single Sign-On untuk mengakses multiple aplikasi
3. **My Apps Dashboard** - Dashboard untuk mengakses aplikasi-aplikasi Anda

## Perubahan yang Dilakukan

### 1. Database Schema (migration-portfolio.sql)

Ditambahkan tabel-tabel baru untuk menyimpan data portfolio:

**Tabel Utama:**
- `profile` - Informasi profil/about
- `about_paragraphs` - Paragraf-paragraf tentang diri
- `social_links` - Link sosial media (GitHub, LinkedIn, dll)
- `skill_categories` - Kategori skill (Programming Languages, Tools, dll)
- `skills` - Detail skill per kategori
- `projects` - Portfolio projects
- `project_tools` - Tools yang digunakan dalam setiap project
- `gallery_images` - Gambar untuk About section

**Data Awal:**
- Profile Gutivan Alief Syahputra
- Social media links
- 4 skill categories dengan sample skills
- 8 featured projects

### 2. Halaman Homepage (app/page.tsx)

Halaman utama sekarang menampilkan:
- **Hero Section** dengan greeting dan typewriter effect
- **Social Media Links** (GitHub, Facebook, Twitter, LinkedIn, Instagram)
- **Login/My Apps Button** - Berubah tergantung status login
- **About Section** - Introduction dan bio
- **Featured Projects** - 3 project unggulan

**Design:**
- Background hitam dengan aksen purple (mirip About-Me)
- Gradient buttons
- Social icons dengan hover effects
- Responsive design

### 3. My Apps Dashboard (app/apps/page.tsx)

Dashboard setelah login menampilkan 2 section:

**My Applications:**
- List aplikasi yang sudah terdaftar di SSO
- Requires authentication
- Click langsung redirect ke aplikasi dengan token

**My Portfolio:**
- Menampilkan semua projects dari database
- Project cards dengan image, description, tech stack
- Links ke demo dan source code (jika ada)
- Tidak perlu login (tapi hanya bisa diakses jika sudah login via /apps)

**Features:**
- Sticky header dengan nama user
- Logout button
- Environment indicator (development/production)
- Responsive grid layout

### 4. Login Page (app/login/page.tsx)

Redesign login page:
- Black background dengan purple accents
- Modern gradient buttons
- Better form styling dengan border-purple
- Loading state dengan spinner icon
- Demo credentials ditampilkan di bawah form

### 5. Layout & Styling

**app/layout.tsx:**
- Ditambahkan Font Awesome CDN untuk icons
- Updated metadata

**app/globals.css:**
- Wave animation untuk emoji 👋
- Custom scrollbar (purple theme)
- Smooth scrolling behavior

### 6. API Endpoints

**app/api/portfolio/projects/route.ts:**
- GET endpoint untuk fetch projects
- Support query parameter: `?featured=true` untuk featured projects saja
- Returns JSON dengan array projects

## Setup & Installation

### 1. Database Setup

Jalankan SQL migration untuk membuat tabel portfolio:

```bash
psql -U your_username -d your_database -f database/migration-portfolio.sql
```

Atau jika menggunakan GUI tools seperti DBeaver/pgAdmin, copy paste isi file `database/migration-portfolio.sql`.

### 2. Environment Variables

Pastikan `.env` sudah dikonfigurasi:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL=postgresql://user:password@localhost:5432/sso_db
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002
BLOG_BELAJAR_URL=http://localhost:3000
PFTU_URL=http://localhost:3002
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3001`

## Struktur Halaman

### Public Pages (Tidak Perlu Login)

1. **/** (Homepage)
   - Hero section dengan profile
   - About section
   - Featured projects (3 items)
   - Login button

### Protected Pages (Perlu Login)

1. **/login**
   - Form login
   - Redirect ke /apps setelah berhasil login

2. **/apps** (Requires Authentication)
   - My Applications section
   - My Portfolio section (semua projects)
   - User info & logout

## Data Flow

### Homepage Flow:
```
User visits / 
→ Check if logged in (cookie check)
→ Show homepage dengan button:
   - "Login to Access Apps" jika belum login
   - "Go to My Apps →" jika sudah login
```

### Login Flow:
```
User clicks login
→ Redirect to /login
→ Enter credentials
→ POST /api/auth/login
→ Set cookie
→ Redirect to /apps
```

### My Apps Flow:
```
User visits /apps
→ Check authentication
→ If not authenticated: redirect to /login
→ If authenticated:
   - Fetch user data
   - Fetch registered apps
   - Fetch portfolio projects
   - Display dashboard
```

### App Launch Flow:
```
User clicks app card
→ Fetch JWT token
→ Redirect to app with token: app_url/auth/callback?token=xxx
```

## Customization

### Mengganti Data Portfolio

**Option 1: Via Database**
Edit langsung di database PostgreSQL (production):
```sql
UPDATE profile SET name = 'Your Name' WHERE id = 1;
INSERT INTO projects (title, description, ...) VALUES (...);
```

**Option 2: Via Migration File**
Edit file `database/migration-portfolio.sql` dan jalankan ulang migration (development).

**Option 3: Via API Endpoint (Future)**
Buat admin panel untuk CRUD operations (belum diimplementasi).

### Menambah Social Media Links

Edit di database:
```sql
INSERT INTO social_links (profile_id, platform, url, icon, order_index) 
VALUES (1, 'youtube', 'https://youtube.com/yourhandle', 'fab fa-youtube', 6);
```

Atau edit homepage langsung di `app/page.tsx`.

### Menambah/Edit Projects

Projects saat ini menggunakan mock data di `app/api/portfolio/projects/route.ts`.

Untuk koneksi ke database real, ganti dengan query PostgreSQL:
```typescript
// TODO: Replace with actual database query
// const { rows } = await pool.query('SELECT * FROM projects ORDER BY order_index');
```

### Styling

Semua styling menggunakan Tailwind CSS. Theme colors:
- Primary: Purple (#8b5cf6)
- Background: Black (#000000)
- Accent: Blue (#3b82f6)

Ubah di file-file `.tsx` dengan mengubah class Tailwind.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Font Awesome 6.4.0
- **Database:** PostgreSQL
- **Authentication:** JWT with HTTP-only cookies
- **Language:** TypeScript

## Features Checklist

✅ Homepage portfolio dengan design mirip About-Me
✅ Login page dengan purple theme
✅ My Apps section dengan authentication
✅ Portfolio section di My Apps page
✅ SQL migration untuk database schema
✅ API endpoint untuk projects
✅ Responsive design
✅ Social media links
✅ Font Awesome icons
✅ Custom animations (wave effect)
✅ Protected routes

## TODO / Future Improvements

- [ ] Koneksi database real untuk projects (saat ini mock data)
- [ ] Admin panel untuk CRUD portfolio
- [ ] Skills section di homepage
- [ ] About gallery dengan slider
- [ ] Blog integration
- [ ] Contact form
- [ ] Analytics tracking
- [ ] SEO optimization
- [ ] Dark/light mode toggle
- [ ] Load more projects functionality
- [ ] Project detail page
- [ ] Search & filter projects

## Demo Credentials

```
Email: admin@test.com
Password: admin123
```

## Notes

1. **Database:** Pastikan PostgreSQL sudah running dan migration sudah dijalankan
2. **Mock Data:** Projects saat ini menggunakan mock data di API route. Untuk production, ganti dengan query ke database
3. **Images:** Project images menggunakan external URLs. Untuk production, sebaiknya upload ke CDN/cloud storage
4. **SSO Apps:** Untuk menambah aplikasi baru, tambahkan di tabel `registered_apps` di database

## Troubleshooting

### Port sudah digunakan
```bash
# Kill process di port 3001
npx kill-port 3001
# Atau ubah port di package.json
```

### Database connection error
```bash
# Check PostgreSQL status
sudo systemctl status postgresql
# Restart jika perlu
sudo systemctl restart postgresql
```

### Font Awesome icons tidak muncul
- Check koneksi internet (CDN)
- Atau install local: `npm install @fortawesome/fontawesome-free`

## Contact

Untuk pertanyaan atau issues, hubungi:
- **Email:** gutivanian@example.com
- **GitHub:** github.com/gutivanian

---

**Created:** February 2026
**Version:** 1.0.0
