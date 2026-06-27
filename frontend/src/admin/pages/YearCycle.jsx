import CrudManager from '../CrudManager.jsx';

export default function YearCycle() {
  return (
    <CrudManager
      title="מעגל השנה"
      endpoint="/year-cycle"
      defaults={{ month: '', title: '', description: '', color_from: '#2f6fc0', color_to: '#6fb6e6', image_url: '', is_upcoming: false, sort_order: 0, is_active: true }}
      fields={[
        { name: 'month', label: 'חודש עברי', type: 'text', placeholder: 'תמוז' },
        { name: 'title', label: 'כותרת האירוע', type: 'text' },
        { name: 'description', label: 'תיאור', type: 'textarea', rows: 2 },
        { name: 'image_url', label: 'תמונה', type: 'image' },
        { name: 'is_upcoming', label: 'אירוע קרוב (מודגש)', type: 'checkbox' },
        { name: 'color_from', label: 'צבע גרדיאנט (התחלה)', type: 'color' },
        { name: 'color_to', label: 'צבע גרדיאנט (סוף)', type: 'color' },
        { name: 'sort_order', label: 'סדר', type: 'number' },
      ]}
      columns={[
        { key: 'image', label: 'תמונה', render: (r) => r.image_url ? <img src={r.image_url} className="img-preview" /> : <span className="swatch" style={{ background: `linear-gradient(135deg,${r.color_from},${r.color_to})` }} /> },
        { key: 'month', label: 'חודש' },
        { key: 'title', label: 'כותרת' },
        { key: 'is_upcoming', label: 'קרוב', render: (r) => r.is_upcoming ? '● קרוב' : '' },
      ]}
    />
  );
}
