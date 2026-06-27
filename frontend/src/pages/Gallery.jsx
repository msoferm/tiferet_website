import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../lib/useApi.js';
import SiteLayout, { Tile } from '../components/SiteLayout.jsx';

export default function Gallery() {
  const { data: gallery } = useFetch('/gallery');
  const { data: boot } = useFetch('/public/bootstrap');
  const [active, setActive] = useState(null);
  const s = boot ? boot.settings : {};
  if (!gallery) return <div className="center" style={{ padding: 120 }}>טוען…</div>;

  return (
    <SiteLayout settings={s}>
      <div className="page-hero">
        <div className="wrap">
          <div className="crumb"><Link to="/">בית</Link> &nbsp;/&nbsp; גלריה</div>
          <h1>גלריית הקהילה</h1>
          <p>רגעים מתוך מעגל השנה — מחגי תשרי ועד שמחת התורה, לאורך כל לוח השנה העברי.</p>
        </div>
      </div>

      {/* צ'יפים לסינון */}
      <div className="nav" style={{ top: 0 }}>
        <div className="wrap" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '16px 32px' }}>
          {gallery.map((c) => (
            <a key={c.id} href={`#${c.slug}`}
               style={{ fontFamily: 'Heebo', fontWeight: 600, fontSize: 14, color: '#46566a', background: '#f1f6fb', border: '1px solid #e2eaf2', borderRadius: 999, padding: '8px 18px' }}>
              {c.title}
            </a>
          ))}
        </div>
      </div>

      {/* סקשנים */}
      {gallery.map((cat) => (
        <div id={cat.slug} key={cat.id} className="wrap" style={{ padding: '48px 32px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <span style={{ width: 10, height: 34, borderRadius: 4, background: cat.accent }} />
            <div>
              <h2 style={{ fontFamily: 'Heebo', fontWeight: 800, fontSize: 30, margin: 0, color: '#133869' }}>{cat.title}</h2>
              <div style={{ color: 'var(--muted)', fontSize: 15 }}>{cat.subtitle}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridAutoRows: 180, gap: 14 }} className="gallery-grid">
            {cat.items.map((it) => (
              <div key={it.id} onClick={() => it.image_url && setActive(it.image_url)}
                   style={{ gridColumn: `span ${it.col_span}`, gridRow: `span ${it.row_span}`, cursor: it.image_url ? 'pointer' : 'default' }}>
                <Tile caption={it.caption} image={it.image_url} from={it.color_from} to={it.color_to} overlay
                      style={{ width: '100%', height: '100%', borderRadius: 14 }} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* CTA */}
      <div className="section center" style={{ background: 'var(--tint)' }}>
        <h2 className="h2" style={{ fontSize: 30 }}>יש לכם תמונות מאירועי הקהילה?</h2>
        <p style={{ fontSize: 17, color: 'var(--muted-2)', margin: '0 auto 24px', maxWidth: 480 }}>נשמח לצרף אותן לגלריה המשותפת שלנו.</p>
        <Link to="/contact" className="btn btn-primary">שלחו לנו תמונות</Link>
      </div>

      {/* לייטבוקס */}
      {active && (
        <div onClick={() => setActive(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(8,20,40,.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30 }}>
          <img src={active} alt="" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 12 }} />
        </div>
      )}
    </SiteLayout>
  );
}
