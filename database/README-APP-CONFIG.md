# SSO-Auth: Update to Database-Driven App Configuration

## 📋 Perubahan

Sebelumnya, URL aplikasi dan allowed origins disimpan di file `.env`. Sekarang semua konfigurasi aplikasi disimpan di **database** dengan dukungan **development** dan **production** URLs terpisah.

## 🗄️ Database Schema

Table `registered_apps` sekarang memiliki kolom:

### Development URLs (Required)
- `dev_app_url` - URL aplikasi untuk development (e.g., `http://localhost:3000`)
- `dev_callback_url` - Callback URL untuk development (e.g., `http://localhost:3000/auth/callback`)
- `dev_allowed_origins` - Array origins yang diizinkan untuk CORS

### Production URLs (Optional)
- `prod_app_url` - URL aplikasi untuk production (e.g., `https://app.example.com`)
- `prod_callback_url` - Callback URL untuk production
- `prod_allowed_origins` - Array origins untuk production

## 🔧 Cara Migrasi Database

### 1. **Backup Data Lama** (Jika ada)
```sql
CREATE TABLE registered_apps_backup AS 
SELECT * FROM registered_apps;
```

### 2. **Jalankan Migration Script**
```bash
psql -U your_user -d sso-db -f database/migration-add-dev-prod-urls.sql
```

Atau jalankan manual SQL di [database/migration-add-dev-prod-urls.sql](../database/migration-add-dev-prod-urls.sql)

### 3. **Atau Drop & Recreate** (Fresh Install)
```bash
psql -U your_user -d sso-db -f database/schema.sql
```

## ⚙️ Environment Configuration

File `.env` sekarang hanya perlu:

```env
# Database Configuration
DB_USER=your_user
DB_HOST=your_host
DB_NAME=sso-db
DB_PASSWORD=your_password
DB_PORT=5432
DB_SSL=true

# JWT Secret
JWT_SECRET=your_secret_key

# Environment Mode (development atau production)
NODE_ENV=development
```

**Tidak perlu lagi:**
- ❌ `ALLOWED_ORIGINS`
- ❌ `BLOG_BELAJAR_URL`
- ❌ `PFTU_URL`

Semua URL diambil dari database berdasarkan `NODE_ENV`.

## 🎯 Cara Menggunakan

### 1. **Get App Configuration**
```typescript
import { getAppConfig } from '@/lib/db';

const config = await getAppConfig('blog-belajar');
// Returns:
// {
//   id: 'blog-belajar',
//   name: 'Blog dan Belajar',
//   app_url: 'http://localhost:3000',  // atau prod_app_url jika NODE_ENV=production
//   callback_url: 'http://localhost:3000/auth/callback',
//   allowed_origins: ['http://localhost:3000']
// }
```

### 2. **Get All Allowed Origins** (untuk CORS)
```typescript
import { getAllAllowedOrigins } from '@/lib/db';

const origins = await getAllAllowedOrigins();
// Returns: ['http://localhost:3000', 'http://localhost:3002']
```

### 3. **Update App URLs** (dari Admin Panel)
```typescript
import { updateAppUrls } from '@/lib/db';

await updateAppUrls('blog-belajar', {
  prod_app_url: 'https://blog.example.com',
  prod_callback_url: 'https://blog.example.com/auth/callback',
  prod_allowed_origins: ['https://blog.example.com'],
});
```

## 🔄 Switch Environment

Untuk switch antara development dan production, ubah di `.env`:

```env
# Development
NODE_ENV=development

# Production
NODE_ENV=production
```

Restart server setelah mengubah environment.

## 📝 Menambah Aplikasi Baru

```sql
INSERT INTO registered_apps (
    id, 
    name, 
    description, 
    dev_app_url,
    dev_callback_url, 
    dev_allowed_origins,
    prod_app_url,
    prod_callback_url,
    prod_allowed_origins
) VALUES (
    'new-app',
    'My New App',
    'Description of my app',
    'http://localhost:3003',
    'http://localhost:3003/auth/callback',
    ARRAY['http://localhost:3003'],
    'https://myapp.example.com',
    'https://myapp.example.com/auth/callback',
    ARRAY['https://myapp.example.com']
);
```

## 🎨 Frontend Changes

Halaman `/apps` sekarang **fetch data dari database** melalui API `/api/apps`:

```typescript
// Otomatis menampilkan semua apps dari database
const response = await fetch('/api/apps');
const data = await response.json();
// Returns: { apps: [...], environment: 'development' }
```

## ✅ Keuntungan

1. ✅ **Tidak perlu rebuild** untuk ganti URL - cukup update di database
2. ✅ **Support multi-environment** - dev dan prod terpisah
3. ✅ **Centralized config** - semua apps di satu tempat
4. ✅ **Dynamic** - tambah/edit apps tanpa code changes
5. ✅ **Environment-aware** - otomatis pilih dev/prod berdasarkan NODE_ENV

## 🚀 Testing

1. Pastikan database sudah diupdate dengan schema baru
2. Set `NODE_ENV=development` di `.env`
3. Restart development server: `npm run dev`
4. Akses `/apps` - seharusnya menampilkan apps dari database
5. Check console log untuk melihat environment dan URLs yang digunakan

## 📌 Files Changed

- ✅ [database/schema.sql](../database/schema.sql) - Updated table structure
- ✅ [database/migration-add-dev-prod-urls.sql](../database/migration-add-dev-prod-urls.sql) - Migration script
- ✅ [.env](../.env) - Simplified environment variables
- ✅ [lib/db.ts](../lib/db.ts) - Added app config functions
- ✅ [app/api/apps/route.ts](../app/api/apps/route.ts) - New API endpoint
- ✅ [app/apps/page.tsx](../app/apps/page.tsx) - Fetch from API instead of hardcoded
