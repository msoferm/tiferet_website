import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Nav({ settings = {} }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div className="nav">
      <div className="nav-inner wrap">
        <Link to="/" className="nav-logo" onClick={close}>
          <img src="/logo.png" alt={settings.site_short || 'תפארת מנחם'} />
        </Link>
        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="תפריט">☰</button>
        <div className={`nav-links ${open ? 'open' : ''}`} onClick={close}>
          <NavLink to="/" end>בית</NavLink>
          <NavLink to="/about">אודות</NavLink>
          <a href="/#times">זמני תפילה</a>
          <a href="/#classes">שיעורים</a>
          <NavLink to="/gallery">גלריה</NavLink>
          <NavLink to="/contact">צור קשר</NavLink>
        </div>
        <Link to="/donate" className="btn-donate" onClick={close}>תרומה</Link>
      </div>
    </div>
  );
}
