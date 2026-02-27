# Panduan Cepat - Integrasi Portfolio SSO

## 🚀 Quick Start

### 1. Setup Database
```bash
# Masuk ke PostgreSQL
psql -U postgres

# Buat database (jika belum ada)
CREATE DATABASE sso_db;

# Keluar dan import schema asli
psql -U postgres -d sso_db -f database/schema.sql

# Import portfolio schema
psql -U postgres -d sso_db -f database/migration-portfolio.sql
```

### 2. Jalankan Aplikasi
```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka browser: `http://localhost:3001`

## 📁 Struktur File Baru

```
sso-auth/
├── app/
│   ├── page.tsx                          ← UPDATED: Homepage portfolio
│   ├── layout.tsx                        ← UPDATED: Added Font Awesome
│   ├── globals.css                       ← UPDATED: Purple theme, animations
│   ├── login/page.tsx                    ← UPDATED: New design
│   ├── apps/page.tsx                     ← UPDATED: My Apps + Portfolio
│   └── api/
│       └── portfolio/
│           └── projects/route.ts         ← NEW: API projects
└── database/
    └── migration-portfolio.sql            ← NEW: Database schema
```

## 🎨 Halaman Utama

### Homepage (/)
**Sebelum Login:**
- Hero section dengan profil
- Social media links
- About section
- Featured projects (3)
- Button: "Login to Access Apps"

**Sesudah Login:**
- Sama seperti sebelum login
- Button berubah: "Go to My Apps →"

### Login (/login)
- Form login dengan design purple theme
- Demo credentials ditampilkan
- Auto redirect ke /apps setelah login

### My Apps (/apps) - PROTECTED
**Requires: Login**

**Section 1: My Applications**
- List aplikasi SSO terdaftar
- Click untuk launch app dengan token

**Section 2: My Portfolio**
- Semua projects (8+ projects)
- Image, description, tech stack
- Link demo & source code

## 💾 Database Tables Baru

| Table | Deskripsi |
|-------|-----------|
| `profile` | Data profil utama |
| `about_paragraphs` | Paragraf about me |
| `social_links` | GitHub, LinkedIn, dll |
| `skill_categories` | Kategori: Programming, Tools, dll |
| `skills` | Detail skills |
| `projects` | Portfolio projects |
| `project_tools` | Tools per project |
| `gallery_images` | Image gallery |

## 🎯 Fitur Utama

✅ **Homepage Portfolio**
- Design hitam-purple (mirip About-Me)
- Responsive
- Animated wave emoji 👋
- Social icons dengan hover

✅ **SSO Authentication**
- JWT-based
- HTTP-only cookies
- Auto redirect

✅ **My Apps Dashboard**
- Protected route
- User info & logout
- App launcher
- Portfolio showcase

✅ **Modern Design**
- Tailwind CSS
- Gradient buttons
- Glass morphism effects
- Custom scrollbar

## 📝 Cara Edit Portfolio

### Edit Profil
```sql
UPDATE profile 
SET name = 'Nama Baru',
    title = 'Job Title Baru',
    bio = 'Bio baru...'
WHERE id = 1;
```

### Tambah Project Baru
```sql
INSERT INTO projects (
    title, description, program, 
    image_url, demo_url, source_url, 
    is_featured, order_index
) VALUES (
    'Project Name',
    'Project description...',
    'React, Next.js, Tailwind',
    'https://image-url.jpg',
    'https://demo-url.com',
    'https://github.com/user/repo',
    true,  -- featured di homepage
    9      -- urutan
);
```

### Edit Social Links
```sql
UPDATE social_links 
SET url = 'https://github.com/newusername'
WHERE platform = 'github';
```

### Tambah Skill Baru
```sql
-- Cek kategori yang ada
SELECT * FROM skill_categories;

-- Tambah skill baru
INSERT INTO skills (category_id, name, proficiency_level, order_index)
VALUES (1, 'Rust', 4, 6);
```

## 🎨 Customization

### Ganti Warna Theme

Edit di file `.tsx`:

```tsx
// Dari purple ke green
className="text-purple-500"     → "text-green-500"
className="border-purple-500"   → "border-green-500"
className="from-purple-600"     → "from-green-600"
```

### Tambah Social Media

Di `app/page.tsx`, tambah link baru:

```tsx
<a
  href="https://tiktok.com/@username"
  className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-purple-500 hover:bg-purple-500 transition-colors"
>
  <i className="fab fa-tiktok text-xl"></i>
</a>
```

### Ubah Jumlah Featured Projects

Di `app/page.tsx`, ubah slice:

```tsx
// Dari 3 ke 6
{[...projects].slice(0, 6).map(...)}
```

## 🔐 Login Demo

```
Email: admin@test.com
Password: admin123
```

## 🐛 Common Issues

### 1. Font Awesome icons tidak muncul
**Solusi:** Check koneksi internet atau install local
```bash
npm install @fortawesome/react-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-brands-svg-icons
```

### 2. Database connection error
**Solusi:** 
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Update .env DATABASE_URL
DATABASE_URL=postgresql://user:password@localhost:5432/sso_db
```

### 3. Projects tidak muncul
**Cause:** API masih pakai mock data

**Solusi Sementara:** Projects akan muncul dari file `app/api/portfolio/projects/route.ts`

**Solusi Permanent:** Koneksi ke database (belum diimplementasi)

### 4. Port 3001 sudah digunakan
```bash
# Kill port
npx kill-port 3001

# Atau ganti port di package.json scripts
"dev": "next dev -p 3002"
```

## 📊 Data Flow

```
┌─────────────────────────────────────────┐
│  User visits "/"                        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│  Check Cookie (sso_token)                │
└──────────┬───────────────────────────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐  ┌─────────┐
│ Logged  │  │ Not     │
│ In      │  │ Logged  │
└────┬────┘  └────┬────┘
     │            │
     │            │
     ▼            ▼
┌─────────┐  ┌──────────────┐
│ Button: │  │ Button:      │
│ "Go to  │  │ "Login to    │
│  Apps"  │  │  Access Apps"│
└─────────┘  └──────────────┘
     │
     ▼
┌──────────────────────────────┐
│  Click → /apps               │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  My Apps Dashboard           │
│  - Applications Section      │
│  - Portfolio Section         │
└──────────────────────────────┘
```

## 🎯 Next Steps

Setelah setup:

1. ✅ Jalankan migration database
2. ✅ Test login dengan demo credentials
3. ✅ Check homepage portfolio
4. ✅ Access /apps untuk lihat dashboard
5. 📝 Edit data di database sesuai kebutuhan
6. 🎨 Customize colors/design
7. 📸 Upload gambar project ke CDN
8. 🔗 Connect ke database real (opsional)

## 📚 File Penting

| File | Purpose |
|------|---------|
| `database/migration-portfolio.sql` | Schema & data awal |
| `app/page.tsx` | Homepage portfolio |
| `app/apps/page.tsx` | My Apps dashboard |
| `app/api/portfolio/projects/route.ts` | API projects |
| `PORTFOLIO_INTEGRATION.md` | Dokumentasi lengkap |

## 💡 Tips

1. **Development:** Edit data langsung di file API route untuk testing cepat
2. **Production:** Gunakan database real dengan connection pooling
3. **Images:** Gunakan Next.js Image component untuk optimisasi
4. **SEO:** Tambahkan metadata yang proper di setiap page
5. **Performance:** Lazy load images dengan IntersectionObserver

---

**Happy Coding! 🚀**
