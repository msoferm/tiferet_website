import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../lib/useApi.js';
import { api } from '../lib/api.js';
import SiteLayout from '../components/SiteLayout.jsx';
import MapEmbed from '../components/MapEmbed.jsx';

export default function Contact() {
  const { data: boot } = useFetch('/public/bootstrap');
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'שאלה כללית', message: '' });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  if (!boot) return <div className="center" style={{ padding: 120 }}>טוען…</div>;
  const s = boot.settings;
  const mapQuery = s.map_query || s.contact_address;

  // זמני תפילה ראשונים מכל קטגוריה
  const firstByCat = {};
  boot.prayer_times.forEach((p) => { if (!firstByCat[p.category]) firstByCat[p.category] = p; });

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try { await api.post('/messages', form); setSent(true); }
    catch (e) { setErr(e.message); }
  }

  return (
    <SiteLayout settings={s}>
      <div className="page-hero">
        <div className="wrap">
          <div className="crumb"><Link to="/">בית</Link> &nbsp;/&nbsp; צור קשר</div>
          <h1>דברו איתנו</h1>
          <p>שאלה, בקשה, או סתם רצון להכיר — אנחנו כאן בשבילכם, עם דלת פתוחה ולב פתוח.</p>
        </div>
      </div>

      {/* כרטיסי קשר מהירים */}
      <div className="wrap" style={{ padding: '48px 32px 8px' }}>
        <div className="grid grid-4">
          <a href={`tel:${(s.contact_phone || '').replace(/-/g, '')}`} className="contact-card">
            <div className="contact-icon" style={{ background: '#e2f0fa' }}>📞</div>
            <div style={{ fontFamily: 'Heebo', fontWeight: 700, color: '#133869' }}>טלפון</div>
            <div style={{ color: '#2f86c9', fontSize: 15, marginTop: 4 }}>{s.contact_phone}</div>
          </a>
          <a href={`https://wa.me/${s.contact_whatsapp}`} className="contact-card">
            <div className="contact-icon" style={{ background: '#e2f5ee' }}>💬</div>
            <div style={{ fontFamily: 'Heebo', fontWeight: 700, color: '#133869' }}>וואטסאפ</div>
            <div style={{ color: '#2f86c9', fontSize: 15, marginTop: 4 }}>שלחו הודעה</div>
          </a>
          <a href={`mailto:${s.contact_email}`} className="contact-card">
            <div className="contact-icon" style={{ background: '#fdf2dd' }}>✉</div>
            <div style={{ fontFamily: 'Heebo', fontWeight: 700, color: '#133869' }}>אימייל</div>
            <div style={{ color: '#2f86c9', fontSize: 14, marginTop: 4 }}>{s.contact_email}</div>
          </a>
          <div className="contact-card">
            <div className="contact-icon" style={{ background: '#efe7f9' }}>📍</div>
            <div style={{ fontFamily: 'Heebo', fontWeight: 700, color: '#133869' }}>כתובת</div>
            <div style={{ color: 'var(--muted-2)', fontSize: 14, marginTop: 4 }}>{s.contact_address}</div>
          </div>
        </div>
      </div>

      {/* טופס + מידע */}
      <div className="wrap" style={{ padding: '40px 32px 20px' }}>
        <div className="split b">
          <div className="card" style={{ padding: 38, borderRadius: 22 }}>
            <h2 className="h2" style={{ fontSize: 30 }}>שלחו לנו הודעה</h2>
            <p className="lead" style={{ marginBottom: 26 }}>מלאו את הפרטים ונחזור אליכם בהקדם.</p>
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
                    <option>שאלה כללית</option><option>הצטרפות לשיעור</option><option>אירוע / שמחה</option><option>בקשת סיוע</option><option>התנדבות</option>
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
              <div style={{ fontFamily: 'Heebo', fontWeight: 800, fontSize: 21, color: '#fff', marginBottom: 20 }}>פרטי הבית</div>
              <div className="row"><span style={{ fontSize: 20 }}>📍</span><div><b>כתובת</b><div style={{ fontSize: 15 }}>{s.contact_address}</div></div></div>
              <div className="row"><span style={{ fontSize: 20 }}>📞</span><div><b>טלפון</b><div style={{ fontSize: 15 }}>{s.contact_phone}</div></div></div>
              <div className="row" style={{ marginBottom: 0 }}><span style={{ fontSize: 20 }}>🕒</span><div><b>שעות פתיחה</b><div style={{ fontSize: 15 }}>{s.contact_hours}</div></div></div>
            </div>
            <MapEmbed query={mapQuery} style={{ flex: 1, minHeight: 210 }} />
          </div>
        </div>
      </div>

      {/* רצועת מניינים */}
      <div className="wrap" style={{ padding: '34px 32px 70px' }}>
        <div style={{ background: 'var(--tint)', border: '1px solid #e2eef8', borderRadius: 20, padding: '30px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontFamily: 'Heebo', fontWeight: 800, fontSize: 20, color: '#133869', marginBottom: 4 }}>לפני שמגיעים — זמני המניינים</div>
            <div style={{ color: 'var(--muted)', fontSize: 15 }}>תמיד מוזמנים להצטרף לתפילה</div>
          </div>
          <div style={{ display: 'flex', gap: 30 }}>
            {Object.entries(firstByCat).map(([cat, p]) => (
              <div key={cat} className="center">
                <div style={{ color: 'var(--muted)', fontSize: 14 }}>{cat}</div>
                <div style={{ fontFamily: 'Heebo', fontWeight: 800, fontSize: 22, color: '#2f86c9' }}>{p.time_value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
