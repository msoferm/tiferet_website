import { useState } from 'react';
import { useFetch } from '../../lib/useApi.js';
import { api } from '../../lib/api.js';
import Field from '../Field.jsx';
import { useToast } from '../../components/Toast.jsx';

const CAT_FIELDS = [
  { name: 'title', label: 'שם הקטגוריה', type: 'text' },
  { name: 'slug', label: 'מזהה (אנגלית, לעוגן)', type: 'text', placeholder: 'chanuka' },
  { name: 'subtitle', label: 'תת כותרת', type: 'text' },
  { name: 'accent', label: 'צבע מזהה', type: 'color' },
  { name: 'sort_order', label: 'סדר', type: 'number' },
];
const ITEM_FIELDS = [
  { name: 'caption', label: 'כיתוב', type: 'text' },
  { name: 'image_url', label: 'תמונה', type: 'image' },
  { name: 'col_span', label: 'רוחב (1-2 עמודות)', type: 'number' },
  { name: 'row_span', label: 'גובה (1-2 שורות)', type: 'number' },
  { name: 'color_from', label: 'צבע ממלא (התחלה)', type: 'color' },
  { name: 'color_to', label: 'צבע ממלא (סוף)', type: 'color' },
  { name: 'sort_order', label: 'סדר', type: 'number' },
];

function EditModal({ title, fields, item, onClose, onSave }) {
  const [data, setData] = useState(item);
  const setField = (name, value) => setData((d) => ({ ...d, [name]: value }));
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><h3>{title}</h3><button onClick={onClose}>×</button></div>
        <div className="modal-body">
          {fields.map((f) => <Field key={f.name} def={f} value={data[f.name]} onChange={setField} />)}
        </div>
        <div className="modal-foot">
          <button className="bt bt-ghost" onClick={onClose}>ביטול</button>
          <button className="bt bt-pri" onClick={() => onSave(data)}>שמירה</button>
        </div>
      </div>
    </div>
  );
}

export default function GalleryAdmin() {
  const { data, loading, reload } = useFetch('/gallery?all=1');
  const [catModal, setCatModal] = useState(null);
  const [itemModal, setItemModal] = useState(null);
  const toast = useToast();

  async function saveCat(cat) {
    try {
      if (cat.id) await api.put(`/gallery/categories/${cat.id}`, cat);
      else await api.post('/gallery/categories', cat);
      toast('נשמר ✓'); setCatModal(null); reload();
    } catch (e) { toast(e.message, 'err'); }
  }
  async function delCat(id) {
    if (!confirm('למחוק קטגוריה וכל התמונות שבה?')) return;
    try { await api.del(`/gallery/categories/${id}`); toast('נמחק'); reload(); }
    catch (e) { toast(e.message, 'err'); }
  }
  async function saveItem(it) {
    try {
      if (it.id) await api.put(`/gallery/items/${it.id}`, it);
      else await api.post('/gallery/items', it);
      toast('נשמר ✓'); setItemModal(null); reload();
    } catch (e) { toast(e.message, 'err'); }
  }
  async function delItem(id) {
    if (!confirm('למחוק תמונה זו?')) return;
    try { await api.del(`/gallery/items/${id}`); toast('נמחק'); reload(); }
    catch (e) { toast(e.message, 'err'); }
  }

  if (loading) return <div className="adm-empty">טוען…</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="bt bt-pri" onClick={() => setCatModal({ title: '', slug: '', subtitle: '', accent: '#2f86c9', sort_order: (data?.length || 0) + 1, is_active: true })}>+ קטגוריה חדשה</button>
      </div>

      {(data || []).map((cat) => (
        <div className="adm-panel" key={cat.id} style={{ marginBottom: 18 }}>
          <div className="adm-panel-head">
            <h2><span className="swatch" style={{ background: cat.accent, marginInlineEnd: 8 }} />{cat.title} <span style={{ color: '#9aa8b6', fontWeight: 400, fontSize: 14 }}>· {cat.items.length} תמונות</span></h2>
            <div className="row-actions">
              <button className="bt bt-soft bt-sm" onClick={() => setItemModal({ category_id: cat.id, caption: '', image_url: '', col_span: 1, row_span: 1, color_from: cat.accent, color_to: '#6fb6e6', sort_order: cat.items.length + 1, is_active: true })}>+ תמונה</button>
              <button className="bt bt-soft bt-sm" onClick={() => setCatModal(cat)}>עריכה</button>
              <button className="bt bt-danger bt-sm" onClick={() => delCat(cat.id)}>מחיקה</button>
            </div>
          </div>
          <div style={{ padding: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
            {cat.items.map((it) => (
              <div key={it.id} style={{ border: '1px solid #e6edf5', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ height: 90, background: it.image_url ? undefined : `linear-gradient(135deg,${it.color_from},${it.color_to})`, display: 'flex', alignItems: 'flex-end', padding: 8, color: '#fff', fontSize: 12 }}>
                  {it.image_url ? <img src={it.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : it.caption}
                </div>
                <div style={{ padding: 8, fontSize: 13 }}>
                  <div style={{ fontWeight: 600, color: '#2c3a4c', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.caption || '—'}</div>
                  <div className="row-actions">
                    <button className="bt bt-soft bt-sm" onClick={() => setItemModal(it)}>עריכה</button>
                    <button className="bt bt-danger bt-sm" onClick={() => delItem(it.id)}>מחיקה</button>
                  </div>
                </div>
              </div>
            ))}
            {cat.items.length === 0 && <div className="adm-empty" style={{ gridColumn: '1/-1' }}>אין תמונות בקטגוריה זו</div>}
          </div>
        </div>
      ))}

      {catModal && <EditModal title={catModal.id ? 'עריכת קטגוריה' : 'קטגוריה חדשה'} fields={CAT_FIELDS} item={catModal} onClose={() => setCatModal(null)} onSave={saveCat} />}
      {itemModal && <EditModal title={itemModal.id ? 'עריכת תמונה' : 'תמונה חדשה'} fields={ITEM_FIELDS} item={itemModal} onClose={() => setItemModal(null)} onSave={saveItem} />}
    </div>
  );
}
