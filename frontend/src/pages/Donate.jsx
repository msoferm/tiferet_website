import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../lib/useApi.js';
import { api } from '../lib/api.js';
import SiteLayout from '../components/SiteLayout.jsx';

const IMPACT = [
  { icon: '🍞', bg: '#e2f0fa', title: 'חסד ומזון', body: 'חבילות מזון לחג וסיוע שקט למשפחות הזקוקות בשכונה.' },
  { icon: '📚', bg: '#fdf2dd', title: 'תורה ושיעורים', body: 'ספרי לימוד, חומרים ומגידי שיעור לכל הקהילה לאורך השבוע.' },
  { icon: '🎉', bg: '#e2f5ee', title: 'אירועי מועד', body: 'הדלקות, סעודות ומסיבות חג לכל המשפחות, מתשרי ועד אלול.' },
];

export default function Donate() {
  const { data: boot } = useFetch('/public/bootstrap');
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');
  const [donor, setDonor] = useState({ donor_name: '', email: '', phone: '', dedication: '' });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  if (!boot) return <div className="center" style={{ padding: 120 }}>טוען…</div>;
  const s = boot.settings;
  const tiers = boot.donation_tiers;
  const ways = boot.donation_ways;

  function choose(t) { setSelected(t); setAmount(String(t.amount)); document.getElementById('give').scrollIntoView({ behavior: 'smooth' }); }

  async function submit(e) {
    e.preventDefault();
    setErr('');
    const amt = parseInt(amount, 10);
    if (!amt || amt <= 0) { setErr('נא לציין סכום תקין'); return; }
    try {
      await api.post('/donations', { ...donor, amount: amt, tier_label: selected ? selected.label : 'סכום חופשי' });
      setDone(true);
    } catch (e) { setErr(e.message); }
  }

  return (
    <SiteLayout settings={s}>
      <div className="page-hero">
        <div className="wrap">
          <div className="crumb"><Link to="/">בית</Link> &nbsp;/&nbsp; תרומות</div>
          <h1>היו שותפים בבית</h1>
          <p>כל תרומה מחזיקה תפילה, שיעור ומעשה חסד. בזכותכם הבית ממשיך להאיר את נחלאות.</p>
        </div>
      </div>

      {/* סכומים */}
      <div className="wrap" style={{ padding: '64px 32px 20px' }}>
        <div className="center" style={{ marginBottom: 40 }}>
          <div className="eyebrow">בחרו את דרך השותפות</div>
          <h2 className="h2">סכומי תרומה</h2>
        </div>
        <div className="grid grid-4" style={{ alignItems: 'stretch' }}>
          {tiers.map((t) => (
            <div key={t.id} className="card" style={t.featured
              ? { background: 'linear-gradient(160deg,#2f86c9,#1b66ac)', border: 'none', textAlign: 'center', boxShadow: '0 18px 40px rgba(47,134,201,.32)', position: 'relative', transform: 'translateY(-8px)', color: '#fff' }
              : { textAlign: 'center', padding: '30px 26px' }}>
              {t.featured && <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#2f86c9', fontFamily: 'Heebo', fontWeight: 700, fontSize: 12, padding: '4px 14px', borderRadius: 999 }}>הכי נבחר</div>}
              <div style={{ fontFamily: 'Heebo', fontWeight: 800, fontSize: t.featured ? 38 : 36, color: t.featured ? '#fff' : (t.accent || '#133869'), marginTop: t.featured ? 14 : 0 }}>₪{t.amount}</div>
              <div style={{ color: t.featured ? '#d6ecfb' : 'var(--muted)', fontSize: 15, margin: '6px 0 18px' }}>{t.label}</div>
              <p style={{ color: t.featured ? '#eaf4fc' : 'var(--muted-2)', fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>{t.description}</p>
              <button onClick={() => choose(t)} className="btn btn-block"
                      style={t.featured ? { color: '#133869', background: '#fff' } : { color: t.accent || '#2f86c9', background: t.accent === '#c98f2e' ? '#fdf2dd' : '#e2f0fa', boxShadow: 'none' }}>בחירה</button>
            </div>
          ))}
        </div>
      </div>

      {/* טופס תרומה */}
      <div id="give" className="wrap" style={{ padding: '30px 32px 20px' }}>
        <div style={{ background: 'var(--tint)', border: '1px solid #e2eef8', borderRadius: 22, padding: 38 }}>
          {done ? (
            <div className="center" style={{ padding: 20 }}>
              <div style={{ fontSize: 40 }}>🙏</div>
              <h3 style={{ fontFamily: 'Heebo', fontWeight: 800, fontSize: 24, color: '#133869' }}>תודה מעומק הלב!</h3>
              <p style={{ color: 'var(--muted-2)' }}>בקשת התרומה נקלטה. נציג מהבית יחזור אליכם להשלמת התהליך.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h3 style={{ fontFamily: 'Heebo', fontWeight: 800, fontSize: 24, margin: '0 0 6px', color: '#133869' }}>פרטי התרומה</h3>
              <p style={{ color: 'var(--muted-2)', fontSize: 16, margin: '0 0 24px' }}>כל סכום מתקבל בברכה ומגיע ישירות לפעילות הבית.</p>
              <div className="grid grid-2" style={{ gap: 14 }}>
                <div className="field"><label>שם התורם</label>
                  <input value={donor.donor_name} onChange={(e) => setDonor({ ...donor, donor_name: e.target.value })} placeholder="ישראל ישראלי" /></div>
                <div className="field"><label>סכום (₪)</label>
                  <input type="number" min="1" value={amount} onChange={(e) => { setAmount(e.target.value); setSelected(null); }} placeholder="100" /></div>
                <div className="field"><label>טלפון</label>
                  <input value={donor.phone} onChange={(e) => setDonor({ ...donor, phone: e.target.value })} placeholder="050-0000000" /></div>
                <div className="field"><label>אימייל</label>
                  <input type="email" value={donor.email} onChange={(e) => setDonor({ ...donor, email: e.target.value })} placeholder="name@email.com" /></div>
              </div>
              <div className="field"><label>הקדשה (אופציונלי)</label>
                <input value={donor.dedication} onChange={(e) => setDonor({ ...donor, dedication: e.target.value })} placeholder="לעילוי נשמת / לרפואת..." /></div>
              {err && <div style={{ color: '#b3261e', marginBottom: 12 }}>{err}</div>}
              <button className="btn btn-primary">
                לתרומה {amount ? `₪${amount}` : ''} ←
              </button>
            </form>
          )}
        </div>
      </div>

      {/* השפעה */}
      <div className="section wrap">
        <div className="center" style={{ marginBottom: 40 }}>
          <div className="eyebrow">לאן הולכת התרומה</div>
          <h2 className="h2">השותפות שלכם בפעולה</h2>
        </div>
        <div className="grid grid-3">
          {IMPACT.map((it, i) => (
            <div className="card" key={i}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: it.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16 }}>{it.icon}</div>
              <div style={{ fontFamily: 'Heebo', fontWeight: 800, fontSize: 19, color: '#133869', marginBottom: 8 }}>{it.title}</div>
              <p style={{ color: 'var(--muted-2)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>{it.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* דרכים נוספות */}
      <div className="section" style={{ background: 'var(--tint)' }}>
        <div className="wrap">
          <div className="center" style={{ marginBottom: 36 }}>
            <h2 className="h2" style={{ fontSize: 30 }}>דרכים נוספות לתרום</h2>
          </div>
          <div className="grid grid-4">
            {ways.map((w) => (
              <div key={w.id} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{w.icon}</div>
                <div style={{ fontFamily: 'Heebo', fontWeight: 700, color: '#133869' }}>{w.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{w.subtitle}</div>
              </div>
            ))}
          </div>
          <div className="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 28, color: 'var(--muted)', fontSize: 14 }}>
            <span style={{ fontSize: 16 }}>🔒</span> תרומה מאובטחת · קבלה מוכרת לצורכי מס לפי סעיף 46
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
