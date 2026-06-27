import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();

// שליחת הודעה מטופס צור קשר (ציבורי)
router.post('/', async (req, res, next) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || (!phone && !email))
      return res.status(400).json({ error: 'נא למלא שם ופרט יצירת קשר אחד לפחות' });
    const { rows } = await query(
      `INSERT INTO contact_messages (name,phone,email,subject,message)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [name, phone, email, subject, message]
    );
    res.status(201).json({ ok: true, id: rows[0].id });
  } catch (e) { next(e); }
});

// רשימת הודעות (דורש התחברות) — אפשר סינון ?status=new
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { status } = req.query;
    const sql = status
      ? 'SELECT * FROM contact_messages WHERE status=$1 ORDER BY created_at DESC'
      : 'SELECT * FROM contact_messages ORDER BY created_at DESC';
    const { rows } = await query(sql, status ? [status] : []);
    res.json(rows);
  } catch (e) { next(e); }
});

// ספירת הודעות חדשות (לתג בלוח הבקרה)
router.get('/unread-count', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(`SELECT count(*)::int AS c FROM contact_messages WHERE status='new'`);
    res.json({ count: rows[0].c });
  } catch (e) { next(e); }
});

// עדכון סטטוס
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { status } = req.body;
    const { rows } = await query(
      'UPDATE contact_messages SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'לא נמצא' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await query('DELETE FROM contact_messages WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
