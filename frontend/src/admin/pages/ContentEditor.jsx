import { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useToast } from '../../components/Toast.jsx';

const PAGE_LABELS = { home: 'עמוד הבית', about: 'עמוד אודות' };

// עריכת בלוקי תוכן (פסקאות ארוכות). מפרידים פסקאות ב-"||"
export default function ContentEditor() {
  const [blocks, setBlocks] = useState([]);
  const toast = useToast();

  useEffect(() => { api.get('/content').then(setBlocks); }, []);

  function update(key, field, value) {
    setBlocks((bs) => bs.map((b) => b.key === key ? { ...b, [field]: value } : b));
  }

  async function save(b) {
    try {
      await api.put(`/content/${b.key}`, { title: b.title, subtitle: b.subtitle, body: b.body, label: b.label });
      toast('נשמר ✓');
    } catch (e) { toast(e.message, 'err'); }
  }

  return (
    <div>
      <p className="help" style={{ marginBottom: 16, fontSize: 13 }}>
        טיפ: כדי להפריד בין פסקאות בתוך גוף הטקסט, השתמשו בסימן <b>||</b> (שני קווים אנכיים).
      </p>
      {blocks.map((b) => (
        <div className="adm-panel" key={b.key} style={{ marginBottom: 18 }}>
          <div className="adm-panel-head">
            <h2>{PAGE_LABELS[b.page] || b.page} — {b.label}</h2>
            <button className="bt bt-pri" onClick={() => save(b)}>שמירה</button>
          </div>
          <div style={{ padding: '20px 22px' }}>
            <div className="fld"><label>תווית עליונה (Eyebrow)</label>
              <input value={b.label ?? ''} onChange={(e) => update(b.key, 'label', e.target.value)} /></div>
            <div className="fld"><label>כותרת</label>
              <input value={b.title ?? ''} onChange={(e) => update(b.key, 'title', e.target.value)} /></div>
            <div className="fld"><label>גוף הטקסט (פסקאות מופרדות ב-||)</label>
              <textarea rows={5} value={b.body ?? ''} onChange={(e) => update(b.key, 'body', e.target.value)} /></div>
          </div>
        </div>
      ))}
    </div>
  );
}
