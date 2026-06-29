// מפת גוגל מוטמעת לפי כתובת/מיקום — גרסת ה-embed הפשוטה (ללא מפתח API).
export default function MapEmbed({ query, style, className = '' }) {
  if (!query) return null;
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=he&z=16&output=embed`;
  return (
    <div className={`map-embed ${className}`} style={style}>
      <iframe
        src={src}
        title={`מפה · ${query}`}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
