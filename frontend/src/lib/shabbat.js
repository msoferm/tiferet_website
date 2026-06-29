// משיכת זמני שבת מ-Hebcal Shabbat API (ישירות מהדפדפן — ללא בקאנד).
// ברירת מחדל: ירושלים (geonameid 281184), הדלקה 40 דק' לפני שקיעה, הבדלה בצאת הכוכבים.
// מחזיר { candles, havdala, parsha } או זורק שגיאה.

const HHMM = (iso) => (String(iso).match(/T(\d{2}:\d{2})/) || [])[1] || '';

export async function fetchShabbat(geonameid = '281184') {
  const url = `https://www.hebcal.com/shabbat?cfg=json&geonameid=${encodeURIComponent(geonameid)}&b=40&M=on&lg=h`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Hebcal request failed');
  const data = await res.json();
  const items = data.items || [];
  const find = (cat) => items.find((i) => i.category === cat);
  const candles = find('candles');
  const havdalah = find('havdalah');
  const parashat = find('parashat');
  return {
    candles: candles ? HHMM(candles.date) : '',
    havdala: havdalah ? HHMM(havdalah.date) : '',
    parsha: parashat ? (parashat.hebrew || parashat.title || '') : '',
  };
}
