import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../lib/useApi.js';
import { api } from '../lib/api.js';
import SiteLayout, { Tile } from '../components/SiteLayout.jsx';

// חילוץ מזהה הסרטון מקישור יוטיוב (watch / youtu.be / embed / shorts / מזהה גולמי)
function youtubeId(url) {
  if (!url) return null;
  const s = String(url).trim();
  const m = s.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s; // מזהה בלבד
  return null;
}

export default function Home() {
  const { data, loading } = useFetch('/public/bootstrap');
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'שאלה כללית', message: '' });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [videoOpen, setVideoOpen] = useState(false);

  if (loading || !data) return <div className="center" style={{ padding: 120 }}>טוען…</div>;

  const s = data.settings;
  const heroVideo = youtubeId(s.hero_video_url);
  const about = data.blocks.home_about || {};
  const aboutParas = (about.body || '').split('||');
  const aboutVideo = youtubeId(s.about_video_url);

  // קיבוץ זמני תפילה לפי קטגוריה
  const prayerByCat = {};
  data.prayer_times.forEach((p) => {
    (prayerByCat[p.category] = prayerByCat[p.category] || { icon: p.icon, rows: [] }).rows.push(p);
  });

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/messages', form);
      setSent(true);
      setForm({ name: '', phone: '', email: '', subject: 'שאלה כללית', message: '' });
    } catch (e) { setErr(e.message); }
  }

  return (
    <SiteLayout settings={s}>
      {/* HERO */}
      <div className="hero">
        <div className="hero-bg" />
        {heroVideo && (
          <div className="hero-video" aria-hidden="true">
            <iframe
              src={`https://www.youtube.com/embed/${heroVideo}?autoplay=1&mute=1&loop=1&playlist=${heroVideo}&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&fs=0&iv_load_policy=3`}
              title="רקע וידאו"
              allow="autoplay; encrypted-media"
              frameBorder="0"
              tabIndex={-1}
            />
          </div>
        )}
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="badge-pill">{s.tagline}</div>
          <h1>{(s.hero_title || '').split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}</h1>
          <p>{s.hero_subtitle}</p>
          <div className="hero-btns">
            <a href="#times" className="btn btn-light">זמני התפילות</a>
            <a href="#classes" className="btn btn-ghost">לוח השיעורים</a>
          </div>
        </div>
      </div>

      {/* סטטיסטיקות */}
      <div className="wrap" style={{ padding: '0 32px' }}>
        <div className="stat-row">
          <div><div className="stat-num">{s.stat_minyanim}</div><div className="stat-label">מניינים ביום</div></div>
          <div className="stat-sep" />
          <div><div className="stat-num">{s.stat_classes}</div><div className="stat-label">שיעורים שבועיים</div></div>
          <div className="stat-sep" />
          <div><div className="stat-num">{s.stat_days}</div><div className="stat-label">ימים של חסד</div></div>
        </div>
      </div>

      {/* זמני תפילה */}
      <div id="times" className="section wrap">
        <h2 className="h2">זמני תפילות</h2>
        <p className="lead">עדכני לשבוע {s.current_parsha} · נחלאות, ירושלים</p>
        <div className="times-grid">
          {Object.entries(prayerByCat).map(([cat, info]) => (
            <div className="times-col" key={cat}>
              <div className="times-cat">{info.icon} {cat}</div>
              {info.rows.map((r) => (
                <div className="times-row" key={r.id}><span>{r.row_label}</span><b>{r.time_value}</b></div>
              ))}
            </div>
          ))}
        </div>
        <div className="shabbat-row">
          <div className="shabbat-card" style={{ background: '#e2f0fa' }}>
            <span style={{ fontWeight: 700, color: '#133869' }}>🕯️ הדלקת נרות</span>
            <b style={{ color: '#2f86c9' }}>{s.candle_time}</b>
          </div>
          <div className="shabbat-card" style={{ background: '#133869' }}>
            <span style={{ fontWeight: 700, color: '#cfe3f3' }}>✨ צאת השבת</span>
            <b style={{ color: '#6fb6e6' }}>{s.havdala_time}</b>
          </div>
        </div>
      </div>

      {/* אודות */}
      <div className="section wrap">
        <div className="split a">
          <div>
            <div className="eyebrow">{about.label || 'קצת עלינו'}</div>
            <h2 className="h2" style={{ fontSize: 36 }}>{about.title}</h2>
            {aboutParas.map((p, i) => (
              <p key={i} style={{ fontSize: 18, lineHeight: 1.8, color: 'var(--body)', margin: '0 0 16px' }}>{p}</p>
            ))}
          </div>
          {aboutVideo ? (
            <button className="about-media" onClick={() => setVideoOpen(true)} aria-label="צפייה בסרטון">
              <span className="about-media-bg" />
              <span className="about-play">▶</span>
              <span className="about-media-label">צפו בסרטון</span>
            </button>
          ) : (
            <Tile caption="תמונת בית הכנסת · 900×700" style={{ minHeight: 280 }} />
          )}
        </div>
      </div>

      {/* מעגל השנה */}
      <div id="cycle" className="section" style={{ background: 'var(--tint)' }}>
        <div className="wrap">
          <h2 className="h2">מעגל השנה</h2>
          <p className="lead">הפעילות הקרובה לאורך לוח השנה העברי</p>
          <div className="grid grid-4">
            {data.year_cycle.map((ev) => (
              <div className={`cycle-card ${ev.is_upcoming ? 'upcoming' : ''}`} key={ev.id}>
                {ev.is_upcoming && <span className="cycle-badge">● קרוב</span>}
                <Tile caption="תמונת אירוע" image={ev.image_url} from={ev.color_from} to={ev.color_to} style={{ height: 118, borderRadius: 0 }} />
                <div className="cycle-body">
                  <div className="cycle-month" style={{ color: ev.color_to }}>{ev.month}</div>
                  <div className="cycle-title">{ev.title}</div>
                  <p className="cycle-desc">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* שיעורים */}
      <div id="classes" className="section wrap">
        <h2 className="h2">שיעורים ולימוד</h2>
        <p className="lead">לוח שבועי קבוע — לכל הרמות, גברים ונשים</p>
        <div className="grid grid-3">
          {data.classes.map((c) => (
            <div className={`class-card ${c.highlighted ? 'hl' : ''}`} key={c.id}>
              <div className="class-top">
                <span className={`day-chip ${c.highlighted ? 'hl' : ''}`}>{c.day}</span>
                <b style={{ fontFamily: 'Heebo', color: '#133869' }}>{c.time_value}</b>
              </div>
              <div className="class-title">{c.title}</div>
              <div className="class-teacher">{c.teacher}</div>
            </div>
          ))}
        </div>
      </div>

      {/* המלצות */}
      <div className="section wrap">
        <div className="center" style={{ marginBottom: 42 }}>
          <div className="eyebrow">הקהילה מספרת</div>
          <h2 className="h2">מה אומרים עלינו</h2>
        </div>
        <div className="grid grid-3">
          {data.testimonials.map((t) => (
            <div className="tcard" key={t.id}>
              <div className="tquote">”</div>
              <p className="tbody">{t.body}</p>
              <div className="tperson">
                <div className="tavatar" style={{ background: `linear-gradient(135deg,${t.color_from},${t.color_to})` }}>{t.initial}</div>
                <div><div className="tname">{t.name}</div><div className="trole">{t.role}</div></div>
              </div>
              <div className="stars">{'★'.repeat(t.rating)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* תרומה */}
      <div className="donate-band">
        <h2>היו שותפים בבית</h2>
        <p>התרומה שלכם מאפשרת תפילות, שיעורים וחסד לכל יהודי בנחלאות, כל ימות השנה.</p>
        <div className="donate-chips">
          {data.donation_tiers.slice(0, 3).map((t) => (
            <div className={`donate-chip ${t.featured ? 'on' : ''}`} key={t.id}>
              <div className="amt">₪{t.amount}</div><div className="lbl">{t.label}</div>
            </div>
          ))}
        </div>
        <Link to="/donate" className="btn btn-light">לתרומה מאובטחת ←</Link>
      </div>

      {/* טופס יצירת קשר */}
      <div className="section" style={{ background: 'var(--tint)' }}>
        <div className="wrap split b">
          <div className="card" style={{ padding: 38, borderRadius: 22 }}>
            <h2 className="h2" style={{ fontSize: 34 }}>צרו קשר</h2>
            <p className="lead" style={{ marginBottom: 28 }}>נשמח לשמוע מכם — מלאו פרטים ונחזור אליכם בהקדם.</p>
            {sent ? (
              <div style={{ background: '#e2f5ee', color: '#1d6b4f', padding: 20, borderRadius: 12, fontWeight: 600 }}>
                ההודעה נשלחה בהצלחה! נחזור אליכם בהקדם. 🙏
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="grid grid-2" style={{ gap: 14 }}>
                  <div className="field"><label>שם מלא</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ישראל ישראלי" /></div>
                  <div className="field"><label>טלפון</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="050-0000000" /></div>
                </div>
                <div className="field"><label>אימייל</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@email.com" /></div>
                <div className="field"><label>נושא הפנייה</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                    <option>שאלה כללית</option><option>הצטרפות לשיעור</option><option>אירוע / שמחה</option><option>בקשת סיוע</option>
                  </select></div>
                <div className="field"><label>הודעה</label>
                  <textarea rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="כתבו לנו..." /></div>
                {err && <div style={{ color: '#b3261e', marginBottom: 12 }}>{err}</div>}
                <button className="btn btn-primary btn-block">שליחת הודעה ←</button>
              </form>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="info-panel">
              <div style={{ fontFamily: 'Heebo', fontWeight: 800, fontSize: 22, color: '#fff', marginBottom: 22 }}>פרטי הבית</div>
              <div className="row"><span style={{ fontSize: 20 }}>📍</span><div><b>כתובת</b><div style={{ fontSize: 15 }}>{s.contact_address}</div></div></div>
              <div className="row"><span style={{ fontSize: 20 }}>📞</span><div><b>טלפון</b><div style={{ fontSize: 15 }}>{s.contact_phone}</div></div></div>
              <div className="row"><span style={{ fontSize: 20 }}>✉</span><div><b>אימייל</b><div style={{ fontSize: 15 }}>{s.contact_email}</div></div></div>
              <div className="row" style={{ marginBottom: 0 }}><span style={{ fontSize: 20 }}>🕒</span><div><b>שעות</b><div style={{ fontSize: 15 }}>{s.contact_hours}</div></div></div>
            </div>
            <Tile caption={`מפה · ${s.contact_address}`} from="#2f6fc0" to="#6fb6e6" style={{ flex: 1, minHeight: 170 }} />
          </div>
        </div>
      </div>

      {/* לייטבוקס וידאו (אזור "קצת עלינו") */}
      {videoOpen && aboutVideo && (
        <div className="lightbox" onClick={() => setVideoOpen(false)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lb-close" onClick={() => setVideoOpen(false)} aria-label="סגירה">×</button>
            <div className="lb-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${aboutVideo}?autoplay=1&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&color=white`}
                title="סרטון"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
