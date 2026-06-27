import { Link } from 'react-router-dom';

export default function Footer({ settings = {} }) {
  return (
    <div className="footer">
      <div className="wrap footer-grid">
        <div>
          <div className="footer-logo"><img src="/logo.png" alt="לוגו" /></div>
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, maxWidth: 300 }}>
            {settings.footer_about || 'בית חב״ד תפארת מנחם — קהילה חמה בלב נחלאות, ירושלים. דלת פתוחה לכל יהודי.'}
          </p>
        </div>
        <div className="footer-col">
          <h4>ניווט</h4>
          <Link to="/">בית</Link>
          <Link to="/about">אודות</Link>
          <Link to="/gallery">גלריה</Link>
          <Link to="/donate">תרומות</Link>
        </div>
        <div className="footer-col">
          <h4>צרו קשר</h4>
          <span>📍 {settings.contact_address || 'רח׳ בצלאל, נחלאות, ירושלים'}</span>
          <span>📞 {settings.contact_phone || '02-123-4567'}</span>
          <span>✉ {settings.contact_email || 'info@tiferet-menachem.org.il'}</span>
        </div>
      </div>
      <div className="wrap footer-bottom">
        © תשפ״ו · בית חב״ד נחלאות — תפארת מנחם
      </div>
    </div>
  );
}
