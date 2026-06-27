import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();

// גלריה מלאה — קטגוריות עם הפריטים שלהן (ציבורי)
router.get('/', async (req, res, next) => {
  try {
    const showAll = req.query.all === '1';
    const catSql = `SELECT * FROM gallery_categories ${showAll ? '' : 'WHERE is_active=true'} ORDER BY sort_order`;
    const { rows: cats } = await query(catSql);
    const { rows: items } = await query(
      `SELECT * FROM gallery_items ${showAll ? '' : 'WHERE is_active=true'} ORDER BY sort_order, id`
    );
    const result = cats.map((c) => ({
      ...c,
      items: items.filter((it) => it.category_id === c.id),
    }));
    res.json(result);
  } catch (e) { next(e); }
});

// ---------- קטגוריות ----------
router.post('/categories', requireAuth, async (req, res, next) => {
  try {
    const { slug, title, subtitle, accent, sort_order } = req.body;
    const { rows } = await query(
      `INSERT INTO gallery_categories (slug,title,subtitle,accent,sort_order)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [slug, title, subtitle, accent || '#2f86c9', sort_order || 0]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.put('/categories/:id', requireAuth, async (req, res, next) => {
  try {
    const { slug, title, subtitle, accent, sort_order, is_active } = req.body;
    const { rows } = await query(
      `UPDATE gallery_categories SET slug=$1,title=$2,subtitle=$3,accent=$4,sort_order=$5,is_active=$6
       WHERE id=$7 RETURNING *`,
      [slug, title, subtitle, accent, sort_order, is_active, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'לא נמצא' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/categories/:id', requireAuth, async (req, res, next) => {
  try {
    await query('DELETE FROM gallery_categories WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ---------- פריטים ----------
router.post('/items', requireAuth, async (req, res, next) => {
  try {
    const { category_id, caption, image_url, color_from, color_to, col_span, row_span, sort_order } = req.body;
    const { rows } = await query(
      `INSERT INTO gallery_items (category_id,caption,image_url,color_from,color_to,col_span,row_span,sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [category_id, caption, image_url, color_from || '#2f86c9', color_to || '#6fb6e6',
       col_span || 1, row_span || 1, sort_order || 0]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.put('/items/:id', requireAuth, async (req, res, next) => {
  try {
    const { category_id, caption, image_url, color_from, color_to, col_span, row_span, sort_order, is_active } = req.body;
    const { rows } = await query(
      `UPDATE gallery_items SET category_id=$1,caption=$2,image_url=$3,color_from=$4,color_to=$5,
       col_span=$6,row_span=$7,sort_order=$8,is_active=$9 WHERE id=$10 RETURNING *`,
      [category_id, caption, image_url, color_from, color_to, col_span, row_span, sort_order, is_active, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'לא נמצא' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/items/:id', requireAuth, async (req, res, next) => {
  try {
    await query('DELETE FROM gallery_items WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
