import { useState } from 'react';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useApi.js';
import Field from './Field.jsx';
import { useToast } from '../components/Toast.jsx';

/**
 * מנהל CRUD גנרי.
 * props:
 *   title      — כותרת
 *   endpoint   — נתיב API (למשל '/classes')
 *   fields     — מערך הגדרות שדה { name, label, type, ... }
 *   columns    — עמודות לטבלה [{ key, label, render? }]
 *   defaults   — ערכי ברירת מחדל לרשומה חדשה
 */
export default function CrudManager({ title, endpoint, fields, columns, defaults = {} }) {
  const { data, loading, reload } = useFetch(`${endpoint}?all=1`);
  const [editing, setEditing] = useState(null); // אובייקט או null
  const toast = useToast();

  function openNew() { setEditing({ ...defaults }); }
  function openEdit(row) { setEditing({ ...row }); }
  function close() { setEditing(null); }

  function setField(name, value) { setEditing((e) => ({ ...e, [name]: value })); }

  async function save() {
    try {
      const payload = {};
      fields.forEach((f) => { payload[f.name] = editing[f.name]; });
      if (editing.id) await api.put(`${endpoint}/${editing.id}`, payload);
      else await api.post(endpoint, payload);
      toast('נשמר בהצלחה ✓');
      close();
      reload();
    } catch (e) { toast(e.message, 'err'); }
  }

  async function remove(row) {
    if (!confirm('למחוק פריט זה?')) return;
    try { await api.del(`${endpoint}/${row.id}`); toast('נמחק'); reload(); }
    catch (e) { toast(e.message, 'err'); }
  }

  async function toggleActive(row) {
    try { await api.put(`${endpoint}/${row.id}`, { is_active: !row.is_active }); reload(); }
    catch (e) { toast(e.message, 'err'); }
  }

  return (
    <div className="adm-panel">
      <div className="adm-panel-head">
        <h2>{title}</h2>
        <button className="bt bt-pri" onClick={openNew}>+ הוספה</button>
      </div>
      {loading ? <div className="adm-empty">טוען…</div> : (
        <table className="adm-table">
          <thead>
            <tr>
              {columns.map((c) => <th key={c.key}>{c.label}</th>)}
              <th style={{ width: 1 }}>סטטוס</th>
              <th style={{ textAlign: 'left' }}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id}>
                {columns.map((c) => <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>)}
                <td>
                  {'is_active' in row ? (
                    <button className={`tag ${row.is_active ? 'tag-on' : 'tag-off'}`} style={{ border: 'none', cursor: 'pointer' }} onClick={() => toggleActive(row)}>
                      {row.is_active ? 'פעיל' : 'מוסתר'}
                    </button>
                  ) : '—'}
                </td>
                <td>
                  <div className="row-actions">
                    <button className="bt bt-soft bt-sm" onClick={() => openEdit(row)}>עריכה</button>
                    <button className="bt bt-danger bt-sm" onClick={() => remove(row)}>מחיקה</button>
                  </div>
                </td>
              </tr>
            ))}
            {data && data.length === 0 && (
              <tr><td colSpan={columns.length + 2} className="adm-empty">אין פריטים עדיין</td></tr>
            )}
          </tbody>
        </table>
      )}

      {editing && (
        <div className="modal-bg" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editing.id ? 'עריכת פריט' : 'פריט חדש'}</h3>
              <button onClick={close}>×</button>
            </div>
            <div className="modal-body">
              {fields.map((f) => (
                <Field key={f.name} def={f} value={editing[f.name]} onChange={setField} />
              ))}
            </div>
            <div className="modal-foot">
              <button className="bt bt-ghost" onClick={close}>ביטול</button>
              <button className="bt bt-pri" onClick={save}>שמירה</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
