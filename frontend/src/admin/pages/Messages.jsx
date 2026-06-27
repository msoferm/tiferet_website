import { useState } from 'react';
import { useFetch } from '../../lib/useApi.js';
import { api } from '../../lib/api.js';
import { useToast } from '../../components/Toast.jsx';

const FILTERS = [
  { key: '', label: 'הכל' },
  { key: 'new', label: 'חדשות' },
  { key: 'read', label: 'נקראו' },
  { key: 'archived', label: 'בארכיון' },
];

export default function Messages() {
  const [filter, setFilter] = useState('');
  const { data, loading, reload } = useFetch(`/messages${filter ? `?status=${filter}` : ''}`, [filter]);
  const [open, setOpen] = useState(null);
  const toast = useToast();

  async function setStatus(id, status) {
    try { await api.put(`/messages/${id}`, { status }); reload(); if (open && open.id === id) setOpen({ ...open, status }); }
    catch (e) { toast(e.message, 'err'); }
  }
  async function remove(id) {
    if (!confirm('למחוק הודעה זו?')) return;
    try { await api.del(`/messages/${id}`); toast('נמחק'); setOpen(null); reload(); }
    catch (e) { toast(e.message, 'err'); }
  }
  function view(m) {
    setOpen(m);
    if (m.status === 'new') setStatus(m.id, 'read');
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {FILTERS.map((f) => (
          <button key={f.key} className={`bt ${filter === f.key ? 'bt-pri' : 'bt-ghost'}`} onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>
      <div className="adm-panel">
        <div className="adm-panel-head"><h2>הודעות מטופס יצירת קשר</h2></div>
        {loading ? <div className="adm-empty">טוען…</div> : (
          <table className="adm-table">
            <thead><tr><th>תאריך</th><th>שם</th><th>נושא</th><th>יצירת קשר</th><th>סטטוס</th><th style={{ textAlign: 'left' }}>פעולות</th></tr></thead>
            <tbody>
              {(data || []).map((m) => (
                <tr key={m.id} style={{ fontWeight: m.status === 'new' ? 700 : 400 }}>
                  <td>{new Date(m.created_at).toLocaleDateString('he-IL')}</td>
                  <td>{m.name}</td>
                  <td>{m.subject}</td>
                  <td>{m.phone || m.email}</td>
                  <td><span className={`tag tag-${m.status}`}>{m.status === 'new' ? 'חדש' : m.status === 'read' ? 'נקרא' : 'ארכיון'}</span></td>
                  <td>
                    <div className="row-actions">
                      <button className="bt bt-soft bt-sm" onClick={() => view(m)}>צפייה</button>
                      <button className="bt bt-danger bt-sm" onClick={() => remove(m.id)}>מחיקה</button>
                    </div>
                  </td>
                </tr>
              ))}
              {data && data.length === 0 && <tr><td colSpan="6" className="adm-empty">אין הודעות</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <div className="modal-bg" onClick={() => setOpen(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>הודעה מאת {open.name}</h3>
              <button onClick={() => setOpen(null)}>×</button>
            </div>
            <div className="modal-body">
              <p><b>נושא:</b> {open.subject}</p>
              <p><b>טלפון:</b> {open.phone || '—'} &nbsp;·&nbsp; <b>אימייל:</b> {open.email || '—'}</p>
              <p><b>תאריך:</b> {new Date(open.created_at).toLocaleString('he-IL')}</p>
              <div style={{ background: '#f4f7fb', borderRadius: 10, padding: 16, marginTop: 12, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {open.message || '(ללא תוכן)'}
              </div>
            </div>
            <div className="modal-foot">
              {open.phone && <a className="bt bt-soft" href={`tel:${open.phone}`}>חיוג</a>}
              {open.email && <a className="bt bt-soft" href={`mailto:${open.email}`}>מענה במייל</a>}
              <button className="bt bt-ghost" onClick={() => setStatus(open.id, 'archived')}>לארכיון</button>
              <button className="bt bt-danger" onClick={() => remove(open.id)}>מחיקה</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
