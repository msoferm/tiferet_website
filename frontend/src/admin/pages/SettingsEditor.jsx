import { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useToast } from '../../components/Toast.jsx';
import Field from '../Field.jsx';

const CATEGORY_LABELS = {
  general: 'כללי',
  hero: 'אזור פתיחה (Hero)',
  about: 'אזור "קצת עלינו"',
  contact: 'פרטי יצירת קשר',
  stats: 'סטטיסטיקות',
  shabbat: 'שבת וזמנים',
  social: 'רשתות חברתיות',
};

export default function SettingsEditor() {
  const [list, setList] = useState([]);
  const [values, setValues] = useState({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.get('/settings').then((d) => {
      setList(d.list);
      const v = {};
      d.list.forEach((s) => { v[s.key] = s.value; });
      setValues(v);
    });
  }, []);

  async function save() {
    setBusy(true);
    try {
      await api.put('/settings', { updates: values });
      toast('ההגדרות נשמרו ✓');
    } catch (e) { toast(e.message, 'err'); }
    setBusy(false);
  }

  // קיבוץ לפי קטגוריה
  const byCat = {};
  list.forEach((s) => { (byCat[s.category] = byCat[s.category] || []).push(s); });

  return (
    <div>
      {Object.entries(byCat).map(([cat, items]) => (
        <div className="adm-panel" key={cat} style={{ marginBottom: 18 }}>
          <div className="adm-panel-head"><h2>{CATEGORY_LABELS[cat] || cat}</h2></div>
          <div style={{ padding: '20px 22px' }}>
            <div className="fld-row" style={{ gap: 18 }}>
              {items.map((s) => (
                s.type === 'image' ? (
                  <div key={s.key} style={{ gridColumn: '1 / -1' }}>
                    <Field def={{ name: s.key, label: s.label || s.key, type: 'image' }} value={values[s.key]} onChange={(name, val) => setValues({ ...values, [name]: val })} />
                  </div>
                ) : (
                  <div className="fld" key={s.key} style={{ gridColumn: s.type === 'textarea' ? '1 / -1' : 'auto' }}>
                    <label>{s.label || s.key}</label>
                    {s.type === 'textarea' ? (
                      <textarea rows={3} value={values[s.key] ?? ''} onChange={(e) => setValues({ ...values, [s.key]: e.target.value })} />
                    ) : (
                      <input type="text" value={values[s.key] ?? ''} onChange={(e) => setValues({ ...values, [s.key]: e.target.value })} />
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      ))}
      <div style={{ position: 'sticky', bottom: 0, background: '#f4f7fb', padding: '14px 0' }}>
        <button className="bt bt-pri" onClick={save} disabled={busy}>{busy ? 'שומר…' : 'שמירת כל ההגדרות'}</button>
      </div>
    </div>
  );
}
