import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import { waitForDb } from './db.js';
import { ensureDefaultAdmin } from './auth.js';
import { crudRouter } from './crud.js';

import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import contentRoutes from './routes/content.js';
import galleryRoutes from './routes/gallery.js';
import messagesRoutes from './routes/messages.js';
import donationsRoutes from './routes/donations.js';
import uploadRoutes from './routes/upload.js';
import publicRoutes from './routes/public.js';

const app = express();
const PORT = process.env.PORT || 4000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/uploads';

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// קבצים שהועלו
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

// בריאות
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'tiferet-api' }));

// ----- ראוטים מיוחדים -----
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/public', publicRoutes);

// ----- ראוטים גנריים (CRUD) -----
app.use('/api/prayer-times', crudRouter('prayer_times',
  ['category', 'icon', 'row_label', 'time_value', 'sort_order', 'is_active']));
app.use('/api/classes', crudRouter('classes',
  ['day', 'time_value', 'title', 'teacher', 'highlighted', 'sort_order', 'is_active']));
app.use('/api/year-cycle', crudRouter('year_cycle',
  ['month', 'title', 'description', 'color_from', 'color_to', 'image_url', 'is_upcoming', 'sort_order', 'is_active']));
app.use('/api/testimonials', crudRouter('testimonials',
  ['name', 'role', 'body', 'initial', 'color_from', 'color_to', 'rating', 'sort_order', 'is_active']));
app.use('/api/leaders', crudRouter('leaders',
  ['name', 'role', 'bio', 'image_url', 'color_from', 'color_to', 'sort_order', 'is_active']));
app.use('/api/values', crudRouter('values_cards',
  ['icon', 'title', 'body', 'bg', 'sort_order', 'is_active']));
app.use('/api/donation-tiers', crudRouter('donation_tiers',
  ['amount', 'label', 'description', 'featured', 'accent', 'sort_order', 'is_active']));
app.use('/api/donation-ways', crudRouter('donation_ways',
  ['icon', 'title', 'subtitle', 'sort_order', 'is_active']));

// 404 לכל /api לא מוכר
app.use('/api', (req, res) => res.status(404).json({ error: 'נתיב לא נמצא' }));

// טיפול שגיאות מרכזי
app.use((err, req, res, next) => {
  console.error('שגיאה:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'שגיאת שרת' });
});

async function start() {
  await waitForDb();
  await ensureDefaultAdmin();
  app.listen(PORT, () => console.log(`✓ שרת ה-API פועל על פורט ${PORT}`));
}

start().catch((e) => {
  console.error('כשל בהפעלת השרת:', e);
  process.exit(1);
});
