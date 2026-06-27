import { useState } from 'react';
import { api } from '../lib/api.js';

// רכיב שדה גנרי לפי הגדרת type
export default function Field({ def, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const set = (v) => onChange(def.name, v);

  if (def.type === 'checkbox') {
    return (
      <div className="fld fld-check">
        <input type="checkbox" id={def.name} checked={!!value} onChange={(e) => set(e.target.checked)} />
        <label htmlFor={def.name} style={{ margin: 0 }}>{def.label}</label>
      </div>
    );
  }

  if (def.type === 'image') {
    return (
      <div className="fld">
        <label>{def.label}</label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {value ? <img src={value} alt="" className="img-preview" /> : <div className="img-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2ccd6', fontSize: 11 }}>אין</div>}
          <input type="file" accept="image/*" onChange={async (e) => {
            const f = e.target.files[0];
            if (!f) return;
            setUploading(true);
            try { const r = await api.upload(f); set(r.url); } catch (err) { alert(err.message); }
            setUploading(false);
          }} />
          {value && <button type="button" className="bt bt-ghost bt-sm" onClick={() => set('')}>הסר</button>}
        </div>
        {uploading && <div className="help">מעלה…</div>}
      </div>
    );
  }

  if (def.type === 'textarea') {
    return (
      <div className="fld">
        <label>{def.label}</label>
        <textarea rows={def.rows || 4} value={value ?? ''} onChange={(e) => set(e.target.value)} placeholder={def.placeholder} />
        {def.help && <div className="help">{def.help}</div>}
      </div>
    );
  }

  if (def.type === 'select') {
    return (
      <div className="fld">
        <label>{def.label}</label>
        <select value={value ?? ''} onChange={(e) => set(e.target.value)}>
          {def.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    );
  }

  if (def.type === 'color') {
    return (
      <div className="fld">
        <label>{def.label}</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" value={value || '#2f86c9'} onChange={(e) => set(e.target.value)} style={{ width: 46, padding: 2, height: 40 }} />
          <input type="text" value={value ?? ''} onChange={(e) => set(e.target.value)} placeholder="#2f86c9" />
        </div>
      </div>
    );
  }

  return (
    <div className="fld">
      <label>{def.label}</label>
      <input type={def.type === 'number' ? 'number' : 'text'} value={value ?? ''} onChange={(e) => set(def.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)} placeholder={def.placeholder} />
      {def.help && <div className="help">{def.help}</div>}
    </div>
  );
}
