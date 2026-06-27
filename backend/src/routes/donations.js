import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();

// רישום בקשת תרומה (ציבורי) — נשמר כ"ממתין"
router.post('/', async (req, res, next) => {
  try {
    const { donor_name, email, phone, amount, tier_label, dedication } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ error: 'נא לציין סכום תרומה תקין' });
    const { rows } = await query(
      `INSERT INTO donations (donor_name,email,phone,amount,tier_label,dedication)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [donor_name, email, phone, amount, tier_label, dedication]
    );
    res.status(201).json({ ok: true, id: rows[0].id });
  } catch (e) { next(e); }
});

// רשימת תרומות (דורש התחברות)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { status } = req.query;
    const sql = status
      ? 'SELECT * FROM donations WHERE status=$1 ORDER BY created_at DESC'
      : 'SELECT * FROM donations ORDER BY created_at DESC';
    const { rows } = await query(sql, status ? [status] : []);
    res.json(rows);
  } catch (e) { next(e); }
});

// סיכום סטטיסטי לתרומות (לדשבורד)
router.get('/stats', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT
        count(*)::int AS total_count,
        coalesce(sum(amount),0)::int AS total_amount,
        coalesce(sum(amount) FILTER (WHERE status='paid'),0)::int AS paid_amount,
        count(*) FILTER (WHERE status='pending')::int AS pending_count
      FROM donations`);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { status } = req.body;
    const { rows } = await query(
      'UPDATE donations SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'לא נמצא' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await query('DELETE FROM donations WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
