# Pamer.co — Project Showcase Platform

Personal portfolio website dengan dashboard admin untuk manage project showcase.

**Stack:** Next.js 15 + Tailwind CSS + Supabase

## ✅ FIXES APPLIED

Semua error yang mencegah deployment sudah diperbaiki:
- ✅ `autoprefixer` sudah ada di package.json
- ✅ TypeScript type errors di `lib/supabase-server.ts` fixed
- ✅ TypeScript type errors di `middleware.ts` fixed  
- ✅ File structure lengkap dengan folder `lib/`

## 🚀 DEPLOYMENT KE VERCEL

### 1. Push ke GitHub
```bash
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin https://github.com/Dappzzz-Dev/Pamer.co.git
git push -u origin main
```

### 2. Deploy di Vercel
1. Buka [vercel.com/new](https://vercel.com/new)
2. Import repository: `Dappzzz-Dev/Pamer.co`
3. Framework: Next.js (auto-detect)
4. **Environment Variables** (WAJIB):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   AUTH_SECRET=random-string-minimal-32-chars
   ```
5. Klik Deploy

## 📊 SETUP SUPABASE

### 1. Buat Project di Supabase
- Buka [supabase.com](https://supabase.com)
- Buat project baru
- Copy URL dan Anon Key dari Settings → API

### 2. Setup Database
1. Buka SQL Editor di Supabase dashboard
2. Copy-paste isi `supabase-setup.sql`
3. Execute

### 3. Setup Storage
1. Buka Storage di sidebar
2. New Bucket → nama: `project-images`
3. ✅ Centang **Public bucket**
4. Create

### 4. Setup Authentication
1. Authentication → Users
2. Add user:
   - Email: `daffafarash@gmail.com`
   - Password: `daffanara13`
3. **PENTING:** Ganti password setelah deploy!

## 🔗 URL STRUKTUR

| Path | Akses | Fungsi |
|------|-------|--------|
| `/` | Publik | Landing page |
| `/projects` | Publik | Gallery semua project (filter, search) |
| `/login` | Publik | Login dashboard |
| `/dashboard` | Private | Manage projects (CRUD) |
| `/dashboard/add` | Private | Tambah project baru |
| `/dashboard/edit/[id]` | Private | Edit project |

## 💻 LOCAL DEVELOPMENT

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local dengan Supabase credentials

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🔐 AKSES DASHBOARD

Setelah deploy, akses dashboard:
```
https://pamer-co.vercel.app/login
```

Login credentials:
- Email: `daffafarash@gmail.com`
- Password: `daffanara13`

**Security Note:** 
- Ganti password di Supabase → Authentication → Users setelah deploy
- Jangan commit `.env.local` ke Git
- Row Level Security (RLS) sudah aktif di database

## 📝 TECH STACK

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (Neo-brutalist design)
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage
- **Auth:** Supabase Auth
- **Deployment:** Vercel
- **Language:** TypeScript

## 🎨 FEATURES

### Public Features
- Portfolio landing page dengan stats
- Project gallery dengan filter & search
- Responsive design (mobile-friendly)
- Neo-brutalist UI design

### Dashboard Features (Private)
- Add/Edit/Delete projects
- Image upload untuk preview project
- Tech stack management
- Category filtering
- Real-time updates

## 📂 PROJECT STRUCTURE

```
Pamer.co/
├── app/
│   ├── page.tsx              # Landing page
│   ├── projects/page.tsx     # Public gallery
│   ├── login/page.tsx        # Login page
│   └── dashboard/            # Admin dashboard
│       ├── page.tsx          # Project list
│       ├── add/page.tsx      # Add project
│       └── edit/[id]/page.tsx # Edit project
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProjectCard.tsx
│   └── ProjectForm.tsx
├── lib/
│   ├── supabase-client.ts    # Browser client
│   ├── supabase-server.ts    # Server client
│   └── types.ts              # TypeScript types
├── middleware.ts             # Route protection
└── supabase-setup.sql        # Database schema

```

## 🐛 TROUBLESHOOTING

### Build Error: Cannot find module 'autoprefixer'
**Fixed** ✅ — `autoprefixer` sudah ada di `package.json`

### Build Error: Parameter 'cookiesToSet' implicitly has an 'any' type
**Fixed** ✅ — Type annotations sudah ditambahkan di `lib/supabase-server.ts` dan `middleware.ts`

### Vercel deployment stuck
- Cek Environment Variables sudah benar
- Pastikan Supabase URL dan key valid
- Check build logs untuk error spesifik

## 📞 SUPPORT

Kalau ada error saat deployment, screenshot build logs dari Vercel dan hubungi developer.

---

Made with ❤️ using Next.js & Supabase
