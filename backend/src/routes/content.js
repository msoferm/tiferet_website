import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();

// בלוקי תוכן — אפשר לסנן לפי עמוד ?page=home
router.get('/', async (req, res, next) => {
  try {
    const { page } = req.query;
    const sql = page
      ? 'SELECT * FROM content_blocks WHERE page=$1 ORDER BY sort_order'
      : 'SELECT * FROM content_blocks ORDER BY page, sort_order';
    const { rows } = await query(sql, page ? [page] : []);
    res.json(rows);
  } catch (e) { next(e); }
});

// בלוק בודד לפי מפתח
router.get('/:key', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM content_blocks WHERE key=$1', [req.params.key]);
    if (!rows.length) return res.status(404).json({ error: 'לא נמצא' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// עדכון בלוק (דורש התחברות)
router.put('/:key', requireAuth, async (req, res, next) => {
  try {
    const { title, subtitle, body, label } = req.body;
    const { rows } = await query(
      `UPDATE content_blocks SET title=$1, subtitle=$2, body=$3, label=$4, updated_at=now()
       WHERE key=$5 RETURNING *`,
      [title, subtitle, body, label, req.params.key]
    );
    if (!rows.length) return res.status(404).json({ error: 'לא נמצא' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

export default router;
