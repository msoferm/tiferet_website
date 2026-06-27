import { useState } from 'react';
import { api, auth } from '../lib/api.js';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const r = await api.post('/auth/login', { username, password });
      auth.token = r.token;
      onLogin(r.user);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  }

  return (
    <div className="login-bg">
      <form className="login-card" onSubmit={submit}>
        <img src="/logo.png" alt="תפארת מנחם" />
        <h1>מערכת ניהול</h1>
        <p>בית חב״ד נחלאות · תפארת מנחם</p>
        {err && <div className="login-err">{err}</div>}
        <div className="fld">
          <label>שם משתמש</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus placeholder="admin" />
        </div>
        <div className="fld">
          <label>סיסמה</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button className="bt bt-pri" style={{ width: '100%', padding: 13, marginTop: 6 }} disabled={busy}>
          {busy ? 'מתחבר…' : 'כניסה'}
        </button>
      </form>
    </div>
  );
}
