import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, Link, useNavigate } from 'react-router-dom';
import { api, auth } from '../lib/api.js';
import { ToastProvider } from '../components/Toast.jsx';
import Login from './Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SettingsEditor from './pages/SettingsEditor.jsx';
import ContentEditor from './pages/ContentEditor.jsx';
import PrayerTimes from './pages/PrayerTimes.jsx';
import Classes from './pages/Classes.jsx';
import YearCycle from './pages/YearCycle.jsx';
import GalleryAdmin from './pages/GalleryAdmin.jsx';
import Testimonials from './pages/Testimonials.jsx';
import Leaders from './pages/Leaders.jsx';
import ValuesAdmin from './pages/ValuesAdmin.jsx';
import Donations from './pages/Donations.jsx';
import Messages from './pages/Messages.jsx';

const NAV = [
  { group: 'ראשי' },
  { to: '/admin', end: true, icon: '📊', label: 'לוח בקרה' },
  { group: 'עמוד הבית' },
  { to: '/admin/settings', icon: '⚙️', label: 'הגדרות אתר' },
  { to: '/admin/content', icon: '📝', label: 'תכנים ופסקאות' },
  { to: '/admin/prayer-times', icon: '🕯️', label: 'זמני תפילה' },
  { to: '/admin/classes', icon: '📖', label: 'שיעורים' },
  { to: '/admin/year-cycle', icon: '🗓️', label: 'מעגל השנה' },
  { to: '/admin/testimonials', icon: '💬', label: 'המלצות' },
  { group: 'עמודים' },
  { to: '/admin/leaders', icon: '👥', label: 'הנהגה' },
  { to: '/admin/values', icon: '✨', label: 'ערכי הבית' },
  { to: '/admin/gallery', icon: '🖼️', label: 'גלריה' },
  { to: '/admin/donations', icon: '₪', label: 'תרומות' },
  { group: 'תיבת דואר' },
  { to: '/admin/messages', icon: '✉️', label: 'הודעות', badgeKey: 'messages' },
];

export default function AdminApp() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [unread, setUnread] = useState(0);
  const [sideOpen, setSideOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me').then((r) => setUser(r.user || null)).catch(() => setUser(null)).finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    const load = () => api.get('/messages/unread-count').then((r) => setUnread(r.count)).catch(() => {});
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [user]);

  function logout() { auth.logout(); setUser(null); navigate('/admin'); }

  if (checking) return <div className="login-bg"><div style={{ color: '#fff' }}>טוען…</div></div>;
  if (!user) return <Login onLogin={setUser} />;

  return (
    <ToastProvider>
      <div className="adm">
        {sideOpen && <div className="adm-backdrop" onClick={() => setSideOpen(false)} />}
        <div className={`adm-side ${sideOpen ? 'open' : ''}`} onClick={() => setSideOpen(false)}>
          <div className="adm-brand">
            <img src="/logo.png" alt="" />
            <div>תפארת מנחם<br /><span style={{ fontSize: 12, color: '#8fb0d4', fontWeight: 400 }}>ניהול תוכן</span></div>
          </div>
          <div className="adm-nav">
            {NAV.map((item, i) => item.group ? (
              <div className="group" key={i}>{item.group}</div>
            ) : (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => isActive ? 'active' : ''}>
                <span>{item.icon}</span> {item.label}
                {item.badgeKey === 'messages' && unread > 0 && <span className="badge">{unread}</span>}
              </NavLink>
            ))}
          </div>
          <div className="adm-foot">
            <Link to="/" target="_blank">🔗 צפייה באתר</Link>
            <button onClick={logout}>יציאה</button>
          </div>
        </div>

        <div className="adm-main">
          <div className="adm-top">
            <button className="bt bt-ghost adm-burger" onClick={(e) => { e.stopPropagation(); setSideOpen(true); }} aria-label="תפריט">☰</button>
            <h1>שלום, {user.full_name || user.username} 👋</h1>
            <Link to="/" target="_blank" className="bt bt-soft">צפייה באתר ↗</Link>
          </div>
          <div className="adm-content">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="settings" element={<SettingsEditor />} />
              <Route path="content" element={<ContentEditor />} />
              <Route path="prayer-times" element={<PrayerTimes />} />
              <Route path="classes" element={<Classes />} />
              <Route path="year-cycle" element={<YearCycle />} />
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="leaders" element={<Leaders />} />
              <Route path="values" element={<ValuesAdmin />} />
              <Route path="gallery" element={<GalleryAdmin />} />
              <Route path="donations" element={<Donations />} />
              <Route path="messages" element={<Messages />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
