import { Link } from 'react-router-dom';
import { useFetch } from '../../lib/useApi.js';

export default function Dashboard() {
  const { data: dstats } = useFetch('/donations/stats');
  const { data: msgs } = useFetch('/messages');
  const { data: classes } = useFetch('/classes?all=1');
  const { data: gallery } = useFetch('/gallery?all=1');

  const newMsgs = (msgs || []).filter((m) => m.status === 'new').length;
  const galleryCount = (gallery || []).reduce((n, c) => n + c.items.length, 0);

  const cards = [
    { n: newMsgs, l: 'הודעות חדשות' },
    { n: dstats ? `₪${dstats.total_amount}` : '—', l: 'סך תרומות שנרשמו' },
    { n: classes ? classes.length : '—', l: 'שיעורים פעילים' },
    { n: galleryCount, l: 'תמונות בגלריה' },
  ];

  const quick = [
    { to: '/admin/messages', ic: '✉️', t: 'תיבת ההודעות', d: `${newMsgs} ממתינות לטיפול` },
    { to: '/admin/prayer-times', ic: '🕯️', t: 'עדכון זמני תפילה', d: 'שחרית · מנחה · ערבית' },
    { to: '/admin/year-cycle', ic: '🗓️', t: 'מעגל השנה', d: 'אירועי החגים הקרובים' },
    { to: '/admin/gallery', ic: '🖼️', t: 'ניהול גלריה', d: 'העלאת תמונות חדשות' },
    { to: '/admin/donations', ic: '₪', t: 'מעקב תרומות', d: dstats ? `${dstats.pending_count} ממתינות` : '' },
    { to: '/admin/settings', ic: '⚙️', t: 'הגדרות אתר', d: 'פרטי קשר, סטטיסטיקות' },
  ];

  return (
    <>
      <div className="adm-cards">
        {cards.map((c, i) => (
          <div className="adm-stat" key={i}><div className="n">{c.n}</div><div className="l">{c.l}</div></div>
        ))}
      </div>
      <h2 style={{ fontFamily: 'Heebo', color: '#133869', fontSize: 18, margin: '0 0 14px' }}>פעולות מהירות</h2>
      <div className="adm-quick">
        {quick.map((q) => (
          <Link to={q.to} key={q.to}>
            <div className="ic">{q.ic}</div>
            <div>
              <div style={{ fontFamily: 'Heebo', fontWeight: 700, color: '#133869' }}>{q.t}</div>
              <div style={{ color: '#7c8a9a', fontSize: 13 }}>{q.d}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
