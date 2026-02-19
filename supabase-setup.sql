-- =============================================
-- SUPABASE SETUP INSTRUCTIONS
-- Jalankan ini di Supabase SQL Editor
-- Dashboard -> SQL Editor -> New query
-- =============================================

-- 1. Buat tabel categories
CREATE TABLE public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Buat tabel projects
CREATE TABLE public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  year integer NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  category text NOT NULL DEFAULT 'Web Application',
  tech_stack text[] DEFAULT '{}',
  image_url text,
  github_url text,
  live_url text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. Policy: semua orang bisa READ (public gallery)
CREATE POLICY "Anyone can read projects"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read categories"
  ON public.categories FOR SELECT
  USING (true);

-- 4. Policy: hanya authenticated user (kamu) yang bisa INSERT, UPDATE, DELETE
-- Projects policies
CREATE POLICY "Authenticated users can insert"
  ON public.projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update"
  ON public.projects FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete"
  ON public.projects FOR DELETE
  USING (auth.role() = 'authenticated');

-- Categories policies
CREATE POLICY "Authenticated users can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories"
  ON public.categories FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories"
  ON public.categories FOR DELETE
  USING (auth.role() = 'authenticated');

-- =============================================
-- STORAGE SETUP (dilakukan via Supabase Dashboard)
-- =============================================
-- 1. Buka Storage di sidebar Supabase
-- 2. Klik "New bucket"
-- 3. Nama bucket: project-images
-- 4. Centang "Public bucket" (agar gambar bisa diakses publik)
-- 5. Klik Create

-- Kemudian buat policy untuk storage:
-- INSERT: authenticated only
-- SELECT: public

-- =============================================
-- AUTH SETUP
-- =============================================
-- 1. Buka Authentication -> Users di Supabase Dashboard
-- 2. Klik "Invite user" atau "Add user"
-- 3. Masukkan: daffafarash@gmail.com
-- 4. Set password: daffanara13
-- 5. PENTING: Setelah ini, ganti password kamu di production!
-- 6. Di Authentication -> Providers, pastikan Email enabled
-- 7. Bisa nonaktifkan "Confirm email" untuk local testing

-- =============================================
-- SAMPLE DATA (opsional, untuk testing)
-- =============================================

-- Seed default categories
INSERT INTO public.categories (name)
VALUES
  ('Web Application'),
  ('Bot & Automation'),
  ('Desktop Application'),
  ('Library'),
  ('Scripts')
ON CONFLICT (name) DO NOTHING;

-- Sample project
INSERT INTO public.projects (title, description, year, category, tech_stack, github_url, live_url)
VALUES
  (
    'Pamer.co',
    'Portfolio website showcasing projects and skills.',
    2026,
    'Web Application',
    ARRAY['Next.js', 'TailwindCSS', 'Supabase'],
    'https://github.com/Dappzzz-Dev/Pamer.co',
    NULL
  );
