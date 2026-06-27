import CrudManager from '../CrudManager.jsx';

export default function Testimonials() {
  return (
    <CrudManager
      title="המלצות הקהילה"
      endpoint="/testimonials"
      defaults={{ name: '', role: '', body: '', initial: '', color_from: '#2f86c9', color_to: '#6fb6e6', rating: 5, sort_order: 0, is_active: true }}
      fields={[
        { name: 'name', label: 'שם', type: 'text' },
        { name: 'role', label: 'תיאור (תושב נחלאות...)', type: 'text' },
        { name: 'body', label: 'תוכן ההמלצה', type: 'textarea' },
        { name: 'initial', label: 'אות לאווטאר', type: 'text', placeholder: 'ד' },
        { name: 'rating', label: 'דירוג (1-5)', type: 'number' },
        { name: 'color_from', label: 'צבע אווטאר (התחלה)', type: 'color' },
        { name: 'color_to', label: 'צבע אווטאר (סוף)', type: 'color' },
        { name: 'sort_order', label: 'סדר', type: 'number' },
      ]}
      columns={[
        { key: 'name', label: 'שם' },
        { key: 'role', label: 'תיאור' },
        { key: 'rating', label: 'דירוג', render: (r) => '★'.repeat(r.rating) },
      ]}
    />
  );
}
