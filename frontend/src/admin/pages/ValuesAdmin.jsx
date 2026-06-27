import CrudManager from '../CrudManager.jsx';

export default function ValuesAdmin() {
  return (
    <CrudManager
      title="ערכי הבית (עמוד אודות)"
      endpoint="/values"
      defaults={{ icon: '🕯️', title: '', body: '', bg: '#e2f0fa', sort_order: 0, is_active: true }}
      fields={[
        { name: 'icon', label: 'אייקון (אימוג׳י)', type: 'text' },
        { name: 'title', label: 'כותרת', type: 'text' },
        { name: 'body', label: 'תיאור', type: 'textarea', rows: 2 },
        { name: 'bg', label: 'צבע רקע לאייקון', type: 'color' },
        { name: 'sort_order', label: 'סדר', type: 'number' },
      ]}
      columns={[
        { key: 'icon', label: 'אייקון', render: (r) => <span style={{ fontSize: 22 }}>{r.icon}</span> },
        { key: 'title', label: 'כותרת' },
        { key: 'body', label: 'תיאור' },
      ]}
    />
  );
}
