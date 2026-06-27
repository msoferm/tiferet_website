import Nav from './Nav.jsx';
import Footer from './Footer.jsx';

// פריסת אתר ציבורי — ניווט + תוכן + פוטר
export default function SiteLayout({ settings = {}, children }) {
  return (
    <>
      <Nav settings={settings} />
      {children}
      <Footer settings={settings} />
    </>
  );
}

// תמונת אריח: אם יש image_url מציג תמונה, אחרת גרדיאנט עם כיתוב
export function Tile({ caption, image, from = '#1b4a8a', to = '#2f86c9', style = {}, overlay = false }) {
  const bg = overlay
    ? `linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.35)),linear-gradient(135deg,${from},${to})`
    : `repeating-linear-gradient(135deg,rgba(255,255,255,.13) 0 13px,transparent 13px 26px),linear-gradient(135deg,${from},${to})`;
  return (
    <div className="tile" style={{ background: image ? undefined : bg, alignItems: overlay ? 'flex-end' : 'center', justifyContent: overlay ? 'flex-start' : 'center', ...style }}>
      {image ? <img src={image} alt={caption || ''} /> : (caption || '')}
    </div>
  );
}
