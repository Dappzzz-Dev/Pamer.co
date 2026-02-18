# DaffaDev Portfolio

Portfolio website pribadi dengan dashboard admin. Dibangun dengan **Next.js 15**, **Tailwind CSS**, dan **Supabase**.

## Stack
- **Frontend**: Next.js 15 (App Router) + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (untuk gambar project)
- **Auth**: Supabase Auth (email/password)

## Struktur File
```
├── app/
│   ├── page.tsx              ← Landing page (publik)
│   ├── projects/page.tsx     ← Gallery semua project (publik)
│   ├── login/page.tsx        ← Login halaman admin
│   └── dashboard/
│       ├── layout.tsx        ← Layout dashboard + sidebar
│       ├── page.tsx          ← Daftar semua project
│       ├── add/page.tsx      ← Tambah project baru
│       └── edit/[id]/page.tsx ← Edit project
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProjectCard.tsx       ← Card project di gallery publik
│   └── ProjectForm.tsx       ← Form add/edit project
├── lib/
│   ├── supabase.ts           ← Supabase client (browser + server)
│   └── types.ts              ← TypeScript types
├── middleware.ts             ← Route protection
└── supabase-setup.sql        ← SQL schema + instruksi setup
```

## Setup

### 1. Clone & Install
```bash
git clone [repo-url]
cd Pamer.co
npm install
```

### 2. Setup Supabase
1. Buat akun di [supabase.com](https://supabase.com)
2. Buat project baru
3. Buka **SQL Editor** → New Query
4. Copy-paste isi `supabase-setup.sql` dan jalankan
5. Setup Storage bucket bernama `project-images` (Public)
6. Buat user di Authentication → Users: `daffafarash@gmail.com` / `daffanara13`

### 3. Environment Variables
```bash
cp .env.local.example .env.local
```

Isi `.env.local` dengan value dari Supabase dashboard (Settings → API):
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
AUTH_SECRET=random-string-minimal-32-karakter
```

### 4. Jalankan
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## URL Penting
| Path | Akses | Keterangan |
|------|-------|------------|
| `/` | Publik | Landing page |
| `/projects` | Publik | Gallery semua project |
| `/login` | Publik | Login ke dashboard |
| `/dashboard` | Private | Daftar project (CRUD) |
| `/dashboard/add` | Private | Tambah project |
| `/dashboard/edit/[id]` | Private | Edit project |

## Security Notes
- Password jangan di-hardcode di kode. Simpan di Supabase Auth saja.
- Jangan commit `.env.local` ke Git (sudah ada di `.gitignore`)
- Row Level Security (RLS) sudah diaktifkan di database
- Middleware memproteksi semua route `/dashboard/*`
