import { Link } from 'react-router-dom';
import { useFetch } from '../lib/useApi.js';
import SiteLayout, { Tile } from '../components/SiteLayout.jsx';

export default function About() {
  const { data } = useFetch('/public/bootstrap');
  if (!data) return <div className="center" style={{ padding: 120 }}>טוען…</div>;
  const s = data.settings;
  const story = data.blocks.about_story || {};
  const paras = (story.body || '').split('||');

  return (
    <SiteLayout settings={s}>
      <div className="page-hero">
        <div className="wrap">
          <div className="crumb"><Link to="/">בית</Link> &nbsp;/&nbsp; אודות</div>
          <h1>אודות הבית</h1>
          <p>קהילה חמה של תורה, תפילה וחסד — דלת פתוחה לכל יהודי בלב נחלאות.</p>
        </div>
      </div>

      {/* סיפור */}
      <div className="section wrap">
        <div className="split a">
          <div>
            <div className="eyebrow">{story.label || 'הסיפור שלנו'}</div>
            <h2 className="h2" style={{ fontSize: 34 }}>{story.title}</h2>
            {paras.map((p, i) => (
              <p key={i} style={{ fontSize: 18, lineHeight: 1.8, color: 'var(--body)', margin: '0 0 16px' }}>{p}</p>
            ))}
          </div>
          <Tile caption="תמונת בית הכנסת · 900×760" style={{ minHeight: 320 }} />
        </div>
      </div>

      {/* סטטיסטיקות */}
      <div className="section" style={{ background: 'var(--tint)', padding: '46px 32px' }}>
        <div className="wrap grid grid-4 center">
          <div><div className="stat-num" style={{ fontSize: 40 }}>{s.stat_years}</div><div className="stat-label">שנות פעילות בשכונה</div></div>
          <div><div className="stat-num" style={{ fontSize: 40 }}>{s.stat_minyanim}</div><div className="stat-label">מניינים מדי יום</div></div>
          <div><div className="stat-num" style={{ fontSize: 40 }}>{s.stat_classes}</div><div className="stat-label">שיעורים שבועיים</div></div>
          <div><div className="stat-num" style={{ fontSize: 40 }}>∞</div><div className="stat-label">אהבת ישראל</div></div>
        </div>
      </div>

      {/* ערכים */}
      <div className="section wrap">
        <div className="center" style={{ marginBottom: 42 }}>
          <div className="eyebrow">מה שמניע אותנו</div>
          <h2 className="h2">ארבעה עמודים שעליהם הבית עומד</h2>
        </div>
        <div className="grid grid-4">
          {data.values.map((v) => (
            <div className="card" key={v.id}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16 }}>{v.icon}</div>
              <div style={{ fontFamily: 'Heebo', fontWeight: 800, fontSize: 20, color: '#133869', marginBottom: 8 }}>{v.title}</div>
              <p style={{ color: 'var(--muted-2)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>{v.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* הנהגה */}
      <div className="section" style={{ background: 'var(--tint)' }}>
        <div className="wrap">
          <div className="center" style={{ marginBottom: 42 }}>
            <div className="eyebrow">העומדים בראש</div>
            <h2 className="h2">הרב והרבנית</h2>
          </div>
          <div className="grid grid-2">
            {data.leaders.map((l) => (
              <div key={l.id} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden', display: 'flex', boxShadow: '0 12px 32px rgba(19,56,105,.06)' }}>
                <Tile caption="דיוקן" image={l.image_url} from={l.color_from} to={l.color_to} style={{ width: 170, flexShrink: 0, borderRadius: 0 }} />
                <div style={{ padding: 28 }}>
                  <div style={{ fontFamily: 'Heebo', fontWeight: 800, fontSize: 22, color: '#133869' }}>{l.name}</div>
                  <div style={{ color: l.color_from === '#c98f2e' ? '#c98f2e' : '#2f86c9', fontWeight: 600, fontSize: 15, marginBottom: 12 }}>{l.role}</div>
                  <p style={{ color: 'var(--muted-2)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{l.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="section wrap">
        <div style={{ background: 'linear-gradient(130deg,#143a6b,#2f86c9)', borderRadius: 24, padding: 52, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <h2 style={{ fontFamily: 'Heebo', fontWeight: 800, fontSize: 32, margin: '0 0 12px', color: '#fff' }}>רוצים להכיר מקרוב?</h2>
          <p style={{ fontSize: 18, color: '#dceaf8', margin: '0 auto 26px', maxWidth: 480 }}>בואו לתפילה, לשיעור או פשוט לכוס תה. תמיד נשמח לארח אתכם.</p>
          <div className="hero-btns">
            <Link to="/contact" className="btn btn-light">צרו קשר</Link>
            <Link to="/donate" className="btn btn-ghost">היו שותפים</Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
