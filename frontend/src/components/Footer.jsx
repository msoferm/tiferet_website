import { Link } from 'react-router-dom';

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.5 21v-7h2.4l.4-2.85h-2.8V9.32c0-.83.23-1.39 1.42-1.39h1.5V5.4c-.26-.04-1.15-.11-2.18-.11-2.16 0-3.64 1.32-3.64 3.74v2.12H8.2V14h2.4v7h2.9z" />
  </svg>
);
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
const IconWaze = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C7.9 2 4.5 5.2 4.5 9.2c0 1 .2 1.9.6 2.8-.5.4-.9 1-.9 1.8 0 .6.5 1.1 1.1 1.1h.3c.5 1 1.4 1.8 2.5 2.3-.1.3-.2.6-.2 1A2 2 0 1011.7 17h.9a2 2 0 103.6-1.3c1.8-1 3.3-2.9 3.3-6.5C19.5 5.2 16.1 2 12 2zm-2.3 7.7a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2zm4.6 0a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z" />
  </svg>
);

export default function Footer({ settings = {} }) {
  const hasSocial = settings.social_facebook || settings.social_instagram || settings.social_waze;
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
          {hasSocial && (
            <div className="footer-social">
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" aria-label="פייסבוק"><IconFacebook /></a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" aria-label="אינסטגרם"><IconInstagram /></a>
              )}
              {settings.social_waze && (
                <a href={settings.social_waze} target="_blank" rel="noopener noreferrer" aria-label="Waze"><IconWaze /></a>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="wrap footer-bottom">
        © תשפ״ו · בית חב״ד נחלאות — תפארת מנחם
      </div>
    </div>
  );
}
