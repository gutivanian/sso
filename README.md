# SSO Authentication System

Sistem SSO (Single Sign-On) untuk mengintegrasikan multiple aplikasi dengan satu kali login.

## Fitur

- ✅ Single Sign-On untuk multiple aplikasi
- ✅ JWT-based authentication
- ✅ Halaman login dengan redirect
- ✅ App list dashboard
- ✅ Secure cookie-based session
- ✅ Dark mode support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables di `.env`:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL=postgresql://user:password@localhost:5432/sso_db
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002
BLOG_BELAJAR_URL=http://localhost:3000
PFTU_URL=http://localhost:3002
```

3. Jalankan development server:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3001`

## Demo Credentials

- Email: `admin@test.com`
- Password: `admin123`

## Cara Integrasi dengan Aplikasi Lain

### 1. Redirect dari aplikasi Anda ke SSO:

```javascript
// Cek apakah user sudah login
const response = await fetch('/api/auth/check');
if (!response.ok) {
  // Redirect ke SSO dengan parameter
  const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
  const appName = encodeURIComponent('Blog dan Belajar');
  window.location.href = `http://localhost:3001/login?redirect_uri=${redirectUri}&app_name=${appName}`;
}
```

### 2. Buat callback handler di aplikasi Anda:

```typescript
// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Simpan token
      document.cookie = `auth_token=${token}; path=/; max-age=604800`; // 7 days
      
      // Verifikasi token dengan SSO
      fetch('http://localhost:3001/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          // Redirect ke home atau dashboard
          router.push('/');
        }
      });
    }
  }, [searchParams, router]);

  return <div>Authenticating...</div>;
}
```

## Struktur Aplikasi

```
sso-auth/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts      # Login endpoint
│   │       ├── logout/route.ts     # Logout endpoint
│   │       ├── verify/route.ts     # Verify token
│   │       └── token/route.ts      # Get current token
│   ├── apps/
│   │   └── page.tsx                # App list dashboard
│   ├── login/
│   │   └── page.tsx                # Login page
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── jwt.ts                      # JWT utilities
│   └── users.ts                    # User management
└── package.json
```

## Production Deployment

1. Generate secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. Setup database (PostgreSQL recommended)

3. Update `.env`:
- Set production JWT_SECRET
- Set production DATABASE_URL
- Update ALLOWED_ORIGINS dengan domain production
- Update URLs aplikasi

4. Deploy ke Vercel/Railway/lainnya

## Security Notes

- ⚠️ Demo menggunakan hardcoded users. Gunakan database di production!
- ⚠️ Password dalam demo tidak dihash. Gunakan bcrypt di production!
- ⚠️ JWT secret harus diganti dengan string random yang aman
- ⚠️ Gunakan HTTPS di production
- ⚠️ Set `secure: true` pada cookies di production
