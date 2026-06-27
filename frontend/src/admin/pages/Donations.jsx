import { useState } from 'react';
import CrudManager from '../CrudManager.jsx';
import { useFetch } from '../../lib/useApi.js';
import { api } from '../../lib/api.js';
import { useToast } from '../../components/Toast.jsx';

const TABS = [
  { key: 'log', label: 'יומן תרומות' },
  { key: 'tiers', label: 'סכומי תרומה' },
  { key: 'ways', label: 'דרכים נוספות' },
];

function DonationLog() {
  const { data, loading, reload } = useFetch('/donations');
  const { data: stats } = useFetch('/donations/stats');
  const toast = useToast();

  async function setStatus(id, status) {
    try { await api.put(`/donations/${id}`, { status }); reload(); }
    catch (e) { toast(e.message, 'err'); }
  }
  async function remove(id) {
    if (!confirm('למחוק רישום תרומה?')) return;
    try { await api.del(`/donations/${id}`); toast('נמחק'); reload(); }
    catch (e) { toast(e.message, 'err'); }
  }

  return (
    <>
      {stats && (
        <div className="adm-cards" style={{ marginBottom: 18 }}>
          <div className="adm-stat"><div className="n">{stats.total_count}</div><div className="l">סך רישומים</div></div>
          <div className="adm-stat"><div className="n">₪{stats.total_amount}</div><div className="l">סכום כולל</div></div>
          <div className="adm-stat"><div className="n">₪{stats.paid_amount}</div><div className="l">שולמו</div></div>
          <div className="adm-stat"><div className="n">{stats.pending_count}</div><div className="l">ממתינות</div></div>
        </div>
      )}
      <div className="adm-panel">
        <div className="adm-panel-head"><h2>רישומי תרומות</h2></div>
        {loading ? <div className="adm-empty">טוען…</div> : (
          <table className="adm-table">
            <thead><tr><th>תאריך</th><th>תורם</th><th>סכום</th><th>מסלול</th><th>הקדשה</th><th>סטטוס</th><th style={{ textAlign: 'left' }}>פעולות</th></tr></thead>
            <tbody>
              {(data || []).map((d) => (
                <tr key={d.id}>
                  <td>{new Date(d.created_at).toLocaleDateString('he-IL')}</td>
                  <td>{d.donor_name || '—'}<div style={{ color: '#9aa8b6', fontSize: 12 }}>{d.phone || d.email}</div></td>
                  <td><b>₪{d.amount}</b></td>
                  <td>{d.tier_label}</td>
                  <td>{d.dedication || '—'}</td>
                  <td><span className={`tag tag-${d.status}`}>{d.status === 'paid' ? 'שולם' : d.status === 'pending' ? 'ממתין' : 'בוטל'}</span></td>
                  <td>
                    <div className="row-actions">
                      {d.status !== 'paid' && <button className="bt bt-soft bt-sm" onClick={() => setStatus(d.id, 'paid')}>סמן כשולם</button>}
                      <button className="bt bt-danger bt-sm" onClick={() => remove(d.id)}>מחיקה</button>
                    </div>
                  </td>
                </tr>
              ))}
              {data && data.length === 0 && <tr><td colSpan="7" className="adm-empty">אין רישומי תרומות עדיין</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default function Donations() {
  const [tab, setTab] = useState('log');
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {TABS.map((t) => (
          <button key={t.key} className={`bt ${tab === t.key ? 'bt-pri' : 'bt-ghost'}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {tab === 'log' && <DonationLog />}

      {tab === 'tiers' && (
        <CrudManager
          title="סכומי תרומה"
          endpoint="/donation-tiers"
          defaults={{ amount: 100, label: '', description: '', featured: false, accent: '#2f86c9', sort_order: 0, is_active: true }}
          fields={[
            { name: 'amount', label: 'סכום (₪)', type: 'number' },
            { name: 'label', label: 'כותרת המסלול', type: 'text' },
            { name: 'description', label: 'תיאור', type: 'textarea', rows: 2 },
            { name: 'featured', label: 'מסלול מודגש (הכי נבחר)', type: 'checkbox' },
            { name: 'accent', label: 'צבע הדגשה', type: 'color' },
            { name: 'sort_order', label: 'סדר', type: 'number' },
          ]}
          columns={[
            { key: 'amount', label: 'סכום', render: (r) => `₪${r.amount}` },
            { key: 'label', label: 'מסלול' },
            { key: 'featured', label: 'מודגש', render: (r) => r.featured ? '⭐' : '' },
          ]}
        />
      )}

      {tab === 'ways' && (
        <CrudManager
          title="דרכים נוספות לתרום"
          endpoint="/donation-ways"
          defaults={{ icon: '🔁', title: '', subtitle: '', sort_order: 0, is_active: true }}
          fields={[
            { name: 'icon', label: 'אייקון', type: 'text' },
            { name: 'title', label: 'כותרת', type: 'text' },
            { name: 'subtitle', label: 'תיאור קצר', type: 'text' },
            { name: 'sort_order', label: 'סדר', type: 'number' },
          ]}
          columns={[
            { key: 'icon', label: 'אייקון', render: (r) => <span style={{ fontSize: 20 }}>{r.icon}</span> },
            { key: 'title', label: 'כותרת' },
            { key: 'subtitle', label: 'תיאור' },
          ]}
        />
      )}
    </div>
  );
}
