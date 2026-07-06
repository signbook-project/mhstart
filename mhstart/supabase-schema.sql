-- ============================================================
-- MHStart Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
('site', '{"name": "MHStart", "tagline": "Empowering Maharashtra Startups", "about": "MHStart is the premier platform connecting startups, incubators, investors, and enablers across Maharashtra.", "contact_email": "build@mhstart.com", "contact_phone": "+91 98765 43210", "address": "Maharashtra, India"}'),
('smtp', '{"host": "smtp.gmail.com", "port": 587, "user": "", "pass": "", "from": "MHStart <noreply@mhstart.com>"}'),
('homepage', '{"hero_title": "Maharashtra''s Startup Ecosystem", "hero_subtitle": "Connecting startups, incubators, investors and enablers across the state", "hero_cta": "Explore Ecosystem", "hero_image": ""}')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- ADMIN USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NEWS / ARTICLES
-- ============================================================
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,   -- Rich HTML content
  cover_image TEXT,
  author_name TEXT,
  author_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  is_pinned BOOLEAN DEFAULT FALSE,
  submitted_by_type TEXT DEFAULT 'admin' CHECK (submitted_by_type IN ('admin', 'startup', 'user')),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS news_status_idx ON news(status);
CREATE INDEX IF NOT EXISTS news_pinned_idx ON news(is_pinned);
CREATE INDEX IF NOT EXISTS news_slug_idx ON news(slug);

-- ============================================================
-- MAP LISTINGS (Startups + Enablers)
-- ============================================================
CREATE TABLE IF NOT EXISTS map_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('startup', 'incubator', 'vc', 'accelerator', 'angel', 'government', 'corporate', 'other')),
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  logo_url TEXT,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  district TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  stage TEXT,           -- For startups: idea/seed/growth/scale
  sector TEXT[],        -- Industry sectors
  founded_year INT,
  team_size TEXT,
  linkedin TEXT,
  twitter TEXT,
  instagram TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'rejected')),
  is_featured BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS map_listings_type_idx ON map_listings(type);
CREATE INDEX IF NOT EXISTS map_listings_status_idx ON map_listings(status);

-- ============================================================
-- PEOPLE (Team, Advisors, Partners)
-- ============================================================
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  photo_url TEXT,
  category TEXT DEFAULT 'team' CHECK (category IN ('team', 'founding_member', 'advisor', 'supported_by', 'partner')),
  order_index INT DEFAULT 0,
  linkedin TEXT,
  twitter TEXT,
  website TEXT,
  email TEXT,
  organization TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTACT SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- HOMEPAGE BANNERS
-- ============================================================
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  link_text TEXT,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STARTUP SPOTLIGHT
-- ============================================================
CREATE TABLE IF NOT EXISTS spotlight (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES map_listings(id) ON DELETE SET NULL,
  custom_title TEXT,
  custom_description TEXT,
  custom_image TEXT,
  week_start DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (make tables accessible from client)
-- ============================================================

-- Allow public read for published content
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published news" ON news FOR SELECT USING (status = 'published');
CREATE POLICY "Service role full access news" ON news USING (auth.role() = 'service_role');

ALTER TABLE map_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active listings" ON map_listings FOR SELECT USING (status = 'active');
CREATE POLICY "Public insert listings" ON map_listings FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Service role full access listings" ON map_listings USING (auth.role() = 'service_role');

ALTER TABLE people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active people" ON people FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Service role full access people" ON people USING (auth.role() = 'service_role');

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (TRUE);
CREATE POLICY "Service role manage settings" ON settings USING (auth.role() = 'service_role');

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active banners" ON banners FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Service role full access banners" ON banners USING (auth.role() = 'service_role');

ALTER TABLE spotlight ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active spotlight" ON spotlight FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Service role full access spotlight" ON spotlight USING (auth.role() = 'service_role');

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert contact" ON contact_submissions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Service role full access contact" ON contact_submissions USING (auth.role() = 'service_role');

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only admin_users" ON admin_users USING (auth.role() = 'service_role');

-- ============================================================
-- Storage Buckets (run in Supabase Dashboard > Storage)
-- ============================================================
-- Create bucket: 'media' (public)
-- This will hold all uploaded images
