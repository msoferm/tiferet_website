import CrudManager from '../CrudManager.jsx';

export default function Leaders() {
  return (
    <CrudManager
      title="הנהגת הבית"
      endpoint="/leaders"
      defaults={{ name: '', role: '', bio: '', image_url: '', color_from: '#1b4a8a', color_to: '#2f86c9', sort_order: 0, is_active: true }}
      fields={[
        { name: 'name', label: 'שם', type: 'text' },
        { name: 'role', label: 'תפקיד', type: 'text' },
        { name: 'bio', label: 'תיאור', type: 'textarea' },
        { name: 'image_url', label: 'תמונת דיוקן', type: 'image' },
        { name: 'color_from', label: 'צבע רקע (התחלה)', type: 'color' },
        { name: 'color_to', label: 'צבע רקע (סוף)', type: 'color' },
        { name: 'sort_order', label: 'סדר', type: 'number' },
      ]}
      columns={[
        { key: 'image', label: 'תמונה', render: (r) => r.image_url ? <img src={r.image_url} className="img-preview" /> : <span className="swatch" style={{ background: `linear-gradient(135deg,${r.color_from},${r.color_to})` }} /> },
        { key: 'name', label: 'שם' },
        { key: 'role', label: 'תפקיד' },
      ]}
    />
  );
}
