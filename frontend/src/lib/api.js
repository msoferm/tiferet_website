// ============================================================
//  שכבת תאימות API → Supabase
//  מחקה את ממשק ה-REST הישן (api.get/post/put/del/upload) אבל
//  מדברת ישירות מול Supabase (PostgREST + Auth + Storage), בלי בקאנד.
//  כך שאר הקוד (הדפים, ה-CRUD הגנרי) נשאר ללא שינוי.
// ============================================================
import { supabase } from './supabase.js';

// מיפוי שם משאב בנתיב → שם טבלה ב-DB
const TABLES = {
  classes: 'classes',
  'prayer-times': 'prayer_times',
  'year-cycle': 'year_cycle',
  testimonials: 'testimonials',
  leaders: 'leaders',
  values: 'values_cards',
  'donation-tiers': 'donation_tiers',
  'donation-ways': 'donation_ways',
};

function parse(path) {
  const [p, qs] = path.split('?');
  const query = Object.fromEntries(new URLSearchParams(qs || ''));
  const parts = p.replace(/^\/+/, '').split('/').filter(Boolean);
  return { parts, query };
}

function check(error) {
  if (error) throw new Error(error.message || 'שגיאה בלתי צפויה');
}

// סינון פעילים בלבד אלא אם התבקש all=1 (מצב ניהול)
function maybeActive(q, query, table) {
  const hasActive = table !== 'settings' && table !== 'content_blocks';
  if (hasActive && query.all !== '1') q = q.eq('is_active', true);
  return q;
}

// -------- גלריה: קטגוריות עם הפריטים שלהן --------
async function getGallery(showAll) {
  let cq = supabase.from('gallery_categories').select('*').order('sort_order');
  let iq = supabase.from('gallery_items').select('*').order('sort_order').order('id');
  if (!showAll) { cq = cq.eq('is_active', true); iq = iq.eq('is_active', true); }
  const [{ data: cats, error: e1 }, { data: items, error: e2 }] = await Promise.all([cq, iq]);
  check(e1); check(e2);
  return cats.map((c) => ({ ...c, items: items.filter((it) => it.category_id === c.id) }));
}

// -------- בוטסטראפ ציבורי: כל תוכן האתר בקריאה אחת --------
async function getBootstrap() {
  const active = (t) => supabase.from(t).select('*').eq('is_active', true).order('sort_order');
  const [
    settings, blocks, prayer, classes, cycle, testimonials, leaders, values, tiers, ways,
  ] = await Promise.all([
    supabase.from('settings').select('key,value'),
    supabase.from('content_blocks').select('*').order('sort_order'),
    active('prayer_times'), active('classes'), active('year_cycle'),
    active('testimonials'), active('leaders'), active('values_cards'),
    active('donation_tiers'), active('donation_ways'),
  ]);
  for (const r of [settings, blocks, prayer, classes, cycle, testimonials, leaders, values, tiers, ways]) check(r.error);

  const settingsMap = {};
  (settings.data || []).forEach((r) => { settingsMap[r.key] = r.value; });
  const blockMap = {};
  (blocks.data || []).forEach((b) => { blockMap[b.key] = b; });

  return {
    settings: settingsMap,
    blocks: blockMap,
    prayer_times: prayer.data,
    classes: classes.data,
    year_cycle: cycle.data,
    testimonials: testimonials.data,
    leaders: leaders.data,
    values: values.data,
    donation_tiers: tiers.data,
    donation_ways: ways.data,
  };
}

// ============================================================
//  GET
// ============================================================
async function get(path) {
  const { parts, query } = parse(path);
  const [head, sub, tail] = parts;

  if (head === 'public' && sub === 'bootstrap') return getBootstrap();

  if (head === 'gallery') return getGallery(query.all === '1');

  if (head === 'auth' && sub === 'me') {
    const { data } = await supabase.auth.getUser();
    const u = data?.user;
    if (!u) return { user: null };
    return { user: { id: u.id, username: u.email, full_name: u.user_metadata?.full_name || 'מנהל', role: 'admin' } };
  }

  if (head === 'settings') {
    const { data, error } = await supabase.from('settings').select('*').order('category').order('sort_order');
    check(error);
    const map = {};
    data.forEach((r) => { map[r.key] = r.value; });
    return { map, list: data };
  }

  if (head === 'content') {
    let q = supabase.from('content_blocks').select('*').order('sort_order');
    if (query.page) q = q.eq('page', query.page);
    const { data, error } = await q;
    check(error);
    return data;
  }

  if (head === 'messages') {
    if (sub === 'unread-count') {
      const { count, error } = await supabase
        .from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new');
      check(error);
      return { count: count || 0 };
    }
    let q = supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (query.status) q = q.eq('status', query.status);
    const { data, error } = await q;
    check(error);
    return data;
  }

  if (head === 'donations') {
    if (sub === 'stats') {
      const { data, error } = await supabase.from('donations').select('amount,status');
      check(error);
      const stats = { total_count: data.length, total_amount: 0, paid_amount: 0, pending_count: 0 };
      data.forEach((d) => {
        stats.total_amount += d.amount || 0;
        if (d.status === 'paid') stats.paid_amount += d.amount || 0;
        if (d.status === 'pending') stats.pending_count += 1;
      });
      return stats;
    }
    let q = supabase.from('donations').select('*').order('created_at', { ascending: false });
    if (query.status) q = q.eq('status', query.status);
    const { data, error } = await q;
    check(error);
    return data;
  }

  // משאב CRUD גנרי: /classes ?all=1 וכו'
  const table = TABLES[head];
  if (table) {
    let q = supabase.from(table).select('*').order('sort_order').order('id');
    q = maybeActive(q, query, table);
    const { data, error } = await q;
    check(error);
    return data;
  }

  throw new Error(`נתיב לא נתמך: ${path}`);
}

// ============================================================
//  POST
// ============================================================
async function post(path, body = {}) {
  const { parts } = parse(path);
  const [head, sub] = parts;

  if (head === 'auth' && sub === 'login') {
    const email = body.email || body.username;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: body.password });
    if (error) throw new Error('שם משתמש או סיסמה שגויים');
    const u = data.user;
    return {
      token: data.session?.access_token,
      user: { id: u.id, username: u.email, full_name: u.user_metadata?.full_name || 'מנהל', role: 'admin' },
    };
  }

  // טופס יצירת קשר (ציבורי)
  if (head === 'messages') {
    const { name, phone, email, subject, message } = body;
    if (!name || (!phone && !email)) throw new Error('נא למלא שם ופרט יצירת קשר אחד לפחות');
    // ללא קריאת-חזרה (read-back) — ל-anon אין הרשאת SELECT על הודעות (מכוון)
    const { error } = await supabase
      .from('contact_messages').insert({ name, phone, email, subject, message });
    check(error);
    return { ok: true };
  }

  // רישום בקשת תרומה (ציבורי)
  if (head === 'donations' && parts.length === 1) {
    if (!body.amount || body.amount <= 0) throw new Error('נא לציין סכום תרומה תקין');
    const { donor_name, email, phone, amount, tier_label, dedication } = body;
    // ללא קריאת-חזרה — ל-anon אין הרשאת SELECT על תרומות (מכוון)
    const { error } = await supabase
      .from('donations').insert({ donor_name, email, phone, amount, tier_label, dedication });
    check(error);
    return { ok: true };
  }

  // גלריה — קטגוריות / פריטים
  if (head === 'gallery' && sub === 'categories') return insertReturning('gallery_categories', body);
  if (head === 'gallery' && sub === 'items') return insertReturning('gallery_items', body);

  // משאב גנרי
  const table = TABLES[head];
  if (table) return insertReturning(table, body);

  throw new Error(`נתיב לא נתמך: ${path}`);
}

async function insertReturning(table, body) {
  const clean = stripUndefined(body);
  const { data, error } = await supabase.from(table).insert(clean).select().single();
  check(error);
  return data;
}

function stripUndefined(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) out[k] = v;
  return out;
}

// ============================================================
//  PUT
// ============================================================
async function put(path, body = {}) {
  const { parts } = parse(path);
  const [head, sub, tail] = parts;

  // עדכון מקובץ של הגדרות: { updates: {key:value} }
  if (head === 'settings' && parts.length === 1) {
    const updates = body.updates || {};
    const rows = Object.entries(updates).map(([key, value]) => ({ key, value }));
    if (rows.length) {
      const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' });
      check(error);
    }
    return { ok: true };
  }

  // בלוק תוכן לפי key
  if (head === 'content' && sub) {
    const { title, subtitle, body: text, label } = body;
    const { data, error } = await supabase
      .from('content_blocks').update({ title, subtitle, body: text, label }).eq('key', sub).select().single();
    check(error);
    return data;
  }

  // גלריה
  if (head === 'gallery' && sub === 'categories' && tail) return updateById('gallery_categories', tail, body);
  if (head === 'gallery' && sub === 'items' && tail) return updateById('gallery_items', tail, body);

  // הודעות / תרומות — עדכון סטטוס
  if (head === 'messages' && sub) return updateById('contact_messages', sub, body);
  if (head === 'donations' && sub) return updateById('donations', sub, body);

  // משאב גנרי /resource/:id
  const table = TABLES[head];
  if (table && sub) return updateById(table, sub, body);

  throw new Error(`נתיב לא נתמך: ${path}`);
}

async function updateById(table, id, body) {
  const clean = stripUndefined(body);
  const { data, error } = await supabase.from(table).update(clean).eq('id', id).select().single();
  check(error);
  return data;
}

// ============================================================
//  DELETE
// ============================================================
async function del(path) {
  const { parts } = parse(path);
  const [head, sub, tail] = parts;

  if (head === 'gallery' && sub === 'categories' && tail) return deleteById('gallery_categories', tail);
  if (head === 'gallery' && sub === 'items' && tail) return deleteById('gallery_items', tail);
  if (head === 'messages' && sub) return deleteById('contact_messages', sub);
  if (head === 'donations' && sub) return deleteById('donations', sub);

  const table = TABLES[head];
  if (table && sub) return deleteById(table, sub);

  throw new Error(`נתיב לא נתמך: ${path}`);
}

async function deleteById(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  check(error);
  return { ok: true };
}

// ============================================================
//  Upload → Supabase Storage (bucket: uploads)
// ============================================================
async function upload(file) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const { error } = await supabase.storage.from('uploads').upload(name, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });
  check(error);
  const { data } = supabase.storage.from('uploads').getPublicUrl(name);
  return { url: data.publicUrl };
}

export const api = { get, post, put, del, upload };

// ============================================================
//  ניהול אסימון / סשן (מבוסס Supabase Auth)
// ============================================================
export const auth = {
  get token() { return null; },
  set token(_) { /* הסשן מנוהל ע"י Supabase — אין צורך לאחסן ידנית */ },
  get isLoggedIn() {
    try { return !!localStorage.getItem('tiferet_auth'); } catch { return false; }
  },
  async logout() { await supabase.auth.signOut(); },
};
