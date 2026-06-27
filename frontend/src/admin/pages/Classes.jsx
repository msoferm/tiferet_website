import CrudManager from '../CrudManager.jsx';

export default function Classes() {
  return (
    <CrudManager
      title="שיעורים שבועיים"
      endpoint="/classes"
      defaults={{ day: 'ראשון', time_value: '', title: '', teacher: '', highlighted: false, sort_order: 0, is_active: true }}
      fields={[
        { name: 'day', label: 'יום', type: 'text', placeholder: 'ראשון' },
        { name: 'time_value', label: 'שעה', type: 'text', placeholder: '20:30' },
        { name: 'title', label: 'נושא השיעור', type: 'text' },
        { name: 'teacher', label: 'מגיד השיעור', type: 'text' },
        { name: 'highlighted', label: 'הדגשה (כרטיס מודגש)', type: 'checkbox' },
        { name: 'sort_order', label: 'סדר', type: 'number' },
      ]}
      columns={[
        { key: 'day', label: 'יום' },
        { key: 'time_value', label: 'שעה' },
        { key: 'title', label: 'נושא' },
        { key: 'teacher', label: 'מגיד' },
        { key: 'highlighted', label: 'מודגש', render: (r) => r.highlighted ? '⭐' : '' },
      ]}
    />
  );
}
