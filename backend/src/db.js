import pg from 'pg';

const { Pool } = pg;

// אם הוגדר DATABASE_URL (למשל Supabase / שירות אירוח מנוהל) — נשתמש בו עם SSL.
// אחרת — חיבור מקומי לפי משתני DB_* (Docker Compose).
export const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
    })
  : new Pool({
      host: process.env.DB_HOST || 'db',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'tiferet',
      password: process.env.DB_PASSWORD || 'tiferet',
      database: process.env.DB_NAME || 'tiferet',
      max: 10,
    });

export const query = (text, params) => pool.query(text, params);

// המתנה לזמינות מסד הנתונים בעת עליית השרת
export async function waitForDb(retries = 30, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('✓ מחובר למסד הנתונים');
      return;
    } catch (err) {
      console.log(`ממתין למסד הנתונים... (${i + 1}/${retries})`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error('מסד הנתונים אינו זמין');
}
