import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// בוטסטרap ציבורי — כל המידע לעמוד הבית בקריאה אחת
router.get('/bootstrap', async (req, res, next) => {
  try {
    const [settings, blocks, prayer, classes, cycle, testimonials, leaders, values, tiers, ways] =
      await Promise.all([
        query('SELECT key, value FROM settings'),
        query('SELECT * FROM content_blocks ORDER BY sort_order'),
        query('SELECT * FROM prayer_times WHERE is_active=true ORDER BY sort_order'),
        query('SELECT * FROM classes WHERE is_active=true ORDER BY sort_order'),
        query('SELECT * FROM year_cycle WHERE is_active=true ORDER BY sort_order'),
        query('SELECT * FROM testimonials WHERE is_active=true ORDER BY sort_order'),
        query('SELECT * FROM leaders WHERE is_active=true ORDER BY sort_order'),
        query('SELECT * FROM values_cards WHERE is_active=true ORDER BY sort_order'),
        query('SELECT * FROM donation_tiers WHERE is_active=true ORDER BY sort_order'),
        query('SELECT * FROM donation_ways WHERE is_active=true ORDER BY sort_order'),
      ]);

    const settingsMap = {};
    settings.rows.forEach((r) => { settingsMap[r.key] = r.value; });
    const blockMap = {};
    blocks.rows.forEach((b) => { blockMap[b.key] = b; });

    res.json({
      settings: settingsMap,
      blocks: blockMap,
      prayer_times: prayer.rows,
      classes: classes.rows,
      year_cycle: cycle.rows,
      testimonials: testimonials.rows,
      leaders: leaders.rows,
      values: values.rows,
      donation_tiers: tiers.rows,
      donation_ways: ways.rows,
    });
  } catch (e) { next(e); }
});

export default router;
