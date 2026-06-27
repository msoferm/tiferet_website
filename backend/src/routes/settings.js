import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();

// כל ההגדרות (ציבורי) — מוחזר כאובייקט key->value וגם רשימה מפורטת
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM settings ORDER BY category, sort_order');
    const map = {};
    rows.forEach((r) => { map[r.key] = r.value; });
    res.json({ map, list: rows });
  } catch (e) { next(e); }
});

// עדכון מספר הגדרות בבת אחת (דורש התחברות)
router.put('/', requireAuth, async (req, res, next) => {
  try {
    const updates = req.body.updates || {}; // { key: value, ... }
    for (const [key, value] of Object.entries(updates)) {
      await query(
        `INSERT INTO settings (key, value) VALUES ($1,$2)
         ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=now()`,
        [key, value]
      );
    }
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
