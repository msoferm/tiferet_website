import { Router } from 'express';
import { query } from './db.js';
import { requireAuth } from './auth.js';

/**
 * מפעל CRUD גנרי לטבלה.
 * יוצר ראוטר עם:
 *   GET    /         — רשימה (ציבורי, רק פעילים אלא אם ?all=1 ומחובר)
 *   GET    /:id      — פריט בודד
 *   POST   /         — יצירה (דורש התחברות)
 *   PUT    /:id      — עדכון (דורש התחברות)
 *   DELETE /:id      — מחיקה (דורש התחברות)
 *   POST   /reorder  — עדכון סדר (דורש התחברות)
 */
export function crudRouter(table, columns, opts = {}) {
  const router = Router();
  const orderBy = opts.orderBy || 'sort_order ASC, id ASC';
  const hasActive = opts.hasActive !== false; // ברירת מחדל: יש is_active
  const hasOrder = opts.hasOrder !== false;   // ברירת מחדל: יש sort_order

  // רשימה
  router.get('/', async (req, res, next) => {
    try {
      const showAll = req.query.all === '1';
      let sql = `SELECT * FROM ${table}`;
      if (hasActive && !showAll) sql += ` WHERE is_active = true`;
      sql += ` ORDER BY ${orderBy}`;
      const { rows } = await query(sql);
      res.json(rows);
    } catch (e) { next(e); }
  });

  // פריט בודד
  router.get('/:id', async (req, res, next) => {
    try {
      const { rows } = await query(`SELECT * FROM ${table} WHERE id=$1`, [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'לא נמצא' });
      res.json(rows[0]);
    } catch (e) { next(e); }
  });

  // יצירה
  router.post('/', requireAuth, async (req, res, next) => {
    try {
      const cols = columns.filter((c) => req.body[c] !== undefined);
      if (!cols.length) return res.status(400).json({ error: 'אין נתונים' });
      const vals = cols.map((c) => req.body[c]);
      const ph = cols.map((_, i) => `$${i + 1}`).join(',');
      const { rows } = await query(
        `INSERT INTO ${table} (${cols.join(',')}) VALUES (${ph}) RETURNING *`,
        vals
      );
      res.status(201).json(rows[0]);
    } catch (e) { next(e); }
  });

  // עדכון
  router.put('/:id', requireAuth, async (req, res, next) => {
    try {
      const cols = columns.filter((c) => req.body[c] !== undefined);
      if (!cols.length) return res.status(400).json({ error: 'אין נתונים לעדכון' });
      const set = cols.map((c, i) => `${c}=$${i + 1}`).join(',');
      const vals = cols.map((c) => req.body[c]);
      vals.push(req.params.id);
      const { rows } = await query(
        `UPDATE ${table} SET ${set} WHERE id=$${vals.length} RETURNING *`,
        vals
      );
      if (!rows.length) return res.status(404).json({ error: 'לא נמצא' });
      res.json(rows[0]);
    } catch (e) { next(e); }
  });

  // מחיקה
  router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
      await query(`DELETE FROM ${table} WHERE id=$1`, [req.params.id]);
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  // שינוי סדר — מקבל מערך של מזהים בסדר הרצוי
  if (hasOrder) {
    router.post('/reorder', requireAuth, async (req, res, next) => {
      try {
        const ids = req.body.ids || [];
        for (let i = 0; i < ids.length; i++) {
          await query(`UPDATE ${table} SET sort_order=$1 WHERE id=$2`, [i + 1, ids[i]]);
        }
        res.json({ ok: true });
      } catch (e) { next(e); }
    });
  }

  return router;
}
