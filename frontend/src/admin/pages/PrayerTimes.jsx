import CrudManager from '../CrudManager.jsx';

export default function PrayerTimes() {
  return (
    <CrudManager
      title="זמני תפילה"
      endpoint="/prayer-times"
      defaults={{ category: 'שחרית', icon: '🌅', row_label: '', time_value: '', sort_order: 0, is_active: true }}
      fields={[
        { name: 'category', label: 'תפילה', type: 'select', options: [
          { value: 'שחרית', label: 'שחרית' }, { value: 'מנחה', label: 'מנחה' }, { value: 'ערבית', label: 'ערבית' } ] },
        { name: 'icon', label: 'אייקון (אימוג׳י)', type: 'text', placeholder: '🌅' },
        { name: 'row_label', label: 'תווית (חול / שבת ...)', type: 'text' },
        { name: 'time_value', label: 'שעה', type: 'text', placeholder: '06:30' },
        { name: 'sort_order', label: 'סדר', type: 'number' },
      ]}
      columns={[
        { key: 'category', label: 'תפילה', render: (r) => `${r.icon || ''} ${r.category}` },
        { key: 'row_label', label: 'תווית' },
        { key: 'time_value', label: 'שעה' },
        { key: 'sort_order', label: 'סדר' },
      ]}
    />
  );
}
