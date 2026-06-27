import { Router } from 'express';
import { query } from '../db.js';
import { signToken, requireAuth, bcrypt } from '../auth.js';

const router = Router();

// התחברות
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'נא למלא שם משתמש וסיסמה' });
    const { rows } = await query('SELECT * FROM admin_users WHERE username=$1', [username]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' });
    res.json({
      token: signToken(user),
      user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role },
    });
  } catch (e) { next(e); }
});

// פרטי המשתמש המחובר
router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));

// שינוי סיסמה
router.post('/change-password', requireAuth, async (req, res, next) => {
  try {
    const { current, next: nextPass } = req.body;
    const { rows } = await query('SELECT * FROM admin_users WHERE id=$1', [req.user.id]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(current || '', user.password_hash)))
      return res.status(400).json({ error: 'הסיסמה הנוכחית שגויה' });
    if (!nextPass || nextPass.length < 6)
      return res.status(400).json({ error: 'הסיסמה החדשה חייבת לפחות 6 תווים' });
    const hash = await bcrypt.hash(nextPass, 10);
    await query('UPDATE admin_users SET password_hash=$1 WHERE id=$2', [hash, req.user.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
