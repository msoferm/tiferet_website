import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tiferet-dev-secret-change-me';
const TOKEN_TTL = '12h';

export function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

// middleware: דורש מנהל מחובר
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'נדרשת התחברות' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'הרשאה לא תקפה' });
  }
}

// יצירת מנהל ברירת מחדל אם לא קיים
export async function ensureDefaultAdmin() {
  const username = process.env.ADMIN_USER || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const { rows } = await query('SELECT id FROM admin_users WHERE username=$1', [username]);
  if (rows.length === 0) {
    const hash = await bcrypt.hash(password, 10);
    await query(
      'INSERT INTO admin_users (username, password_hash, full_name, role) VALUES ($1,$2,$3,$4)',
      [username, hash, 'מנהל ראשי', 'admin']
    );
    console.log(`✓ נוצר מנהל ברירת מחדל: ${username} / ${password}`);
  }
}

export { bcrypt, JWT_SECRET };
