-- ============================================================
--  בית חב"ד תפארת מנחם — סכמת מסד הנתונים
--  Tiferet Menachem — Chabad House CMS schema (PostgreSQL)
-- ============================================================

-- מנהלי מערכת
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name     TEXT,
  role          TEXT NOT NULL DEFAULT 'admin',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- הגדרות אתר (key/value גמיש) — פרטי קשר, סטטיסטיקות, טקסטים גלובליים
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  category   TEXT NOT NULL DEFAULT 'general',
  label      TEXT,
  type       TEXT NOT NULL DEFAULT 'text', -- text | textarea | number | image | color
  sort_order INT  NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- בלוקים של תוכן עמודים (גיבורי עמוד, פסקאות "אודות" וכו')
CREATE TABLE IF NOT EXISTS content_blocks (
  key        TEXT PRIMARY KEY,
  page       TEXT NOT NULL,
  label      TEXT,
  title      TEXT,
  subtitle   TEXT,
  body       TEXT,
  type       TEXT NOT NULL DEFAULT 'text',
  sort_order INT  NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- זמני תפילה
CREATE TABLE IF NOT EXISTS prayer_times (
  id          SERIAL PRIMARY KEY,
  category    TEXT NOT NULL,         -- שחרית / מנחה / ערבית
  icon        TEXT,
  row_label   TEXT NOT NULL,         -- חול א' / שבת ...
  time_value  TEXT NOT NULL,         -- 06:30
  sort_order  INT  NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- שיעורים שבועיים
CREATE TABLE IF NOT EXISTS classes (
  id           SERIAL PRIMARY KEY,
  day          TEXT NOT NULL,        -- ראשון ...
  time_value   TEXT NOT NULL,
  title        TEXT NOT NULL,
  teacher      TEXT,
  highlighted  BOOLEAN NOT NULL DEFAULT false,
  sort_order   INT NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true
);

-- מעגל השנה (אירועים לפי חודש עברי)
CREATE TABLE IF NOT EXISTS year_cycle (
  id           SERIAL PRIMARY KEY,
  month        TEXT NOT NULL,        -- תמוז / אב ...
  title        TEXT NOT NULL,
  description  TEXT,
  color_from   TEXT NOT NULL DEFAULT '#2f6fc0',
  color_to     TEXT NOT NULL DEFAULT '#6fb6e6',
  image_url    TEXT,
  is_upcoming  BOOLEAN NOT NULL DEFAULT false,
  sort_order   INT NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true
);

-- קטגוריות גלריה
CREATE TABLE IF NOT EXISTS gallery_categories (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,  -- tishrei / chanuka ...
  title       TEXT NOT NULL,
  subtitle    TEXT,
  accent      TEXT NOT NULL DEFAULT '#2f86c9',
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- פריטי גלריה
CREATE TABLE IF NOT EXISTS gallery_items (
  id           SERIAL PRIMARY KEY,
  category_id  INT REFERENCES gallery_categories(id) ON DELETE CASCADE,
  caption      TEXT,
  image_url    TEXT,
  color_from   TEXT DEFAULT '#2f86c9',
  color_to     TEXT DEFAULT '#6fb6e6',
  col_span     INT NOT NULL DEFAULT 1,
  row_span     INT NOT NULL DEFAULT 1,
  sort_order   INT NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true
);

-- המלצות
CREATE TABLE IF NOT EXISTS testimonials (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  role        TEXT,
  body        TEXT NOT NULL,
  initial     TEXT,
  color_from  TEXT DEFAULT '#2f86c9',
  color_to    TEXT DEFAULT '#6fb6e6',
  rating      INT NOT NULL DEFAULT 5,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- אנשי צוות / הנהגה
CREATE TABLE IF NOT EXISTS leaders (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  role        TEXT,
  bio         TEXT,
  image_url   TEXT,
  color_from  TEXT DEFAULT '#1b4a8a',
  color_to    TEXT DEFAULT '#2f86c9',
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- ערכי הבית (4 עמודים)
CREATE TABLE IF NOT EXISTS values_cards (
  id          SERIAL PRIMARY KEY,
  icon        TEXT,
  title       TEXT NOT NULL,
  body        TEXT,
  bg          TEXT DEFAULT '#e2f0fa',
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- סכומי תרומה
CREATE TABLE IF NOT EXISTS donation_tiers (
  id          SERIAL PRIMARY KEY,
  amount      INT NOT NULL,
  label       TEXT NOT NULL,
  description TEXT,
  featured    BOOLEAN NOT NULL DEFAULT false,
  accent      TEXT DEFAULT '#2f86c9',
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- דרכי תרומה נוספות
CREATE TABLE IF NOT EXISTS donation_ways (
  id          SERIAL PRIMARY KEY,
  icon        TEXT,
  title       TEXT NOT NULL,
  subtitle    TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- הודעות מטופס יצירת קשר
CREATE TABLE IF NOT EXISTS contact_messages (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  subject     TEXT,
  message     TEXT,
  status      TEXT NOT NULL DEFAULT 'new', -- new | read | archived
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- יומן תרומות (רישום בקשות תרומה)
CREATE TABLE IF NOT EXISTS donations (
  id          SERIAL PRIMARY KEY,
  donor_name  TEXT,
  email       TEXT,
  phone       TEXT,
  amount      INT NOT NULL,
  tier_label  TEXT,
  dedication  TEXT,
  status      TEXT NOT NULL DEFAULT 'pending', -- pending | paid | cancelled
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_cat ON gallery_items(category_id);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
