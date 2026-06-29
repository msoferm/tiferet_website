-- ============================================================
--  נתוני זריעה — תוכן אמיתי מתוך עיצוב האתר
-- ============================================================

-- ---------- הגדרות אתר ----------
INSERT INTO settings (key, value, category, label, type, sort_order) VALUES
  ('site_name',        'בית חב״ד נחלאות · תפארת מנחם', 'general', 'שם האתר',        'text',     1),
  ('site_short',       'תפארת מנחם',                   'general', 'שם מקוצר',       'text',     2),
  ('tagline',          'בית חב״ד נחלאות · ירושלים',    'general', 'תגית עליונה',    'text',     3),
  ('hero_title',       'המקום שבו כל יהודי מרגיש בבית', 'hero',   'כותרת ראשית',    'textarea', 4),
  ('hero_subtitle',    'תפילות במניין, שיעורי תורה וחסידות, ופעילות לכל מעגל השנה — בלב השכונה.', 'hero', 'תת כותרת', 'textarea', 5),
  ('hero_video_url',   '',                             'hero',    'קישור לסרטון רקע (YouTube)', 'text', 6),
  ('about_video_url',  '',                             'about',   'קישור לסרטון (אזור "קצת עלינו")', 'text', 7),
  ('about_video_poster','',                            'about',   'צילום מסך לסרטון (לא חובה — ברירת מחדל: תמונת הסרטון)', 'image', 8),
  ('contact_phone',    '02-123-4567',                  'contact', 'טלפון',          'text',     10),
  ('contact_whatsapp', '972500000000',                 'contact', 'וואטסאפ',        'text',     11),
  ('contact_email',    'info@tiferet-menachem.org.il', 'contact', 'אימייל',         'text',     12),
  ('contact_address',  'רח׳ בצלאל, שכונת נחלאות, ירושלים', 'contact', 'כתובת',       'text',     13),
  ('contact_hours',    'דלת פתוחה כל ימות השבוע',       'contact', 'שעות פתיחה',     'text',     14),
  ('stat_minyanim',    '3',                            'stats',   'מניינים ביום',   'number',   20),
  ('stat_classes',     '12',                           'stats',   'שיעורים שבועיים','number',   21),
  ('stat_days',        '365',                          'stats',   'ימים של חסד',    'number',   22),
  ('stat_years',       '15+',                          'stats',   'שנות פעילות',    'text',     23),
  ('candle_time',      '19:13',                        'shabbat', 'הדלקת נרות',     'text',     30),
  ('havdala_time',     '20:25',                        'shabbat', 'צאת השבת',       'text',     31),
  ('current_parsha',   'פרשת בלק',                     'shabbat', 'פרשת השבוע',     'text',     32),
  ('shabbat_auto',     'on',                           'shabbat', 'משיכת זמני שבת אוטומטית (on/off)', 'text', 33),
  ('shabbat_geonameid','281184',                       'shabbat', 'קוד מיקום Hebcal (281184 = ירושלים)', 'text', 34),
  ('footer_about',     'בית חב״ד תפארת מנחם — קהילה חמה בלב נחלאות, ירושלים. דלת פתוחה לכל יהודי.', 'general', 'טקסט פוטר', 'textarea', 40)
ON CONFLICT (key) DO NOTHING;

-- ---------- בלוקי תוכן ----------
INSERT INTO content_blocks (key, page, label, title, subtitle, body, sort_order) VALUES
  ('home_about',  'home',  'קצת עלינו', 'בית חם של תורה וחסד בלב נחלאות', NULL,
   'בית חב״ד "תפארת מנחם" שוכן בלב שכונת נחלאות העתיקה, ומשמש בית פתוח לכל יהודי — ותיק או אורח, קרוב או רחוק. אצלנו כל אחד מוצא את מקומו.||מתפילות במניין דרך שיעורי תורה וחסידות ועד פעילות חמה סביב כל מועדי השנה — אנו כאן כדי להאיר, לקרב ולחבר את הקהילה כולה, מתוך אהבת ישראל ושמחה של מצווה.', 1),
  ('about_story', 'about', 'הסיפור שלנו', 'בית של אור בלב שכונת נחלאות', NULL,
   'בית חב״ד "תפארת מנחם" קם מתוך שליחות פשוטה — להאיר את נחלאות באור של תורה ושמחה, ולתת לכל יהודי בית שבו ירגיש שייך. הדלת שלנו פתוחה לוותיקי השכונה ולאורחים, לקרובים ולרחוקים.||לאורך השנה אנחנו מלווים את הקהילה במניינים קבועים, בשיעורי תורה וחסידות, בפעילות חמה לכל מועדי השנה ובמעשי חסד שקטים — מתוך אהבת ישראל ושמחה של מצווה.', 1)
ON CONFLICT (key) DO NOTHING;

-- ---------- זמני תפילה ----------
INSERT INTO prayer_times (category, icon, row_label, time_value, sort_order) VALUES
  ('שחרית','🌅','חול א׳','06:30',1),
  ('שחרית','🌅','חול ב׳','08:00',2),
  ('שחרית','🌅','שבת','09:00',3),
  ('מנחה','☀️','חול','19:15',1),
  ('מנחה','☀️','ערב שבת','19:00',2),
  ('מנחה','☀️','שבת','18:45',3),
  ('ערבית','🌙','חול','20:05',1),
  ('ערבית','🌙','מוצ״ש','20:25',2),
  ('ערבית','🌙','חסידות','20:30',3);

-- ---------- שיעורים ----------
INSERT INTO classes (day, time_value, title, teacher, highlighted, sort_order) VALUES
  ('ראשון','06:15','דף יומי','הרב מנחם',false,1),
  ('שני','20:30','שיעור בתניא','הרב מנחם',false,2),
  ('שלישי','21:00','פרשת שבוע לנשים','הרבנית',false,3),
  ('רביעי','19:30','הלכה יומית','הרב מנחם',false,4),
  ('חמישי','20:30','מאמר חסידות','הרב מנחם',false,5),
  ('שבת','בקידוש','פרקי אבות + קידושא רבה','לכל הקהל',true,6);

-- ---------- מעגל השנה ----------
INSERT INTO year_cycle (month, title, description, color_from, color_to, is_upcoming, sort_order) VALUES
  ('תמוז','ג׳ תמוז','התוועדות מרכזית ולימוד מתורת הרבי','#2f6fc0','#6fb6e6',true,1),
  ('אב','בין המצרים','שיעורי גאולה וערב עיון לקראת ט׳ באב','#5b6b86','#8aa0bd',false,2),
  ('תשרי','חגי תשרי','סליחות, שופר, סוכה קהילתית והקפות','#c98f2e','#e6bd5e',false,3),
  ('כסלו','חנוכה','הדלקה פומבית ומסיבת אורות לכל המשפחה','#d97b2c','#f0b35a',false,4);

-- ---------- קטגוריות גלריה ----------
INSERT INTO gallery_categories (slug, title, subtitle, accent, sort_order) VALUES
  ('tishrei','חגי תשרי','ראש השנה · יום כיפור · סוכות · שמחת תורה','#c98f2e',1),
  ('chanuka','חנוכה','הדלקה פומבית · מסיבת אורות · סופגניות','#d97b2c',2),
  ('purim','פורים','מגילה · משלוחי מנות · סעודה ושמחה','#7c4fb0',3),
  ('pesach','פסח','אפיית מצות · סדר ציבורי · ליל הסדר','#2f86c9',4),
  ('shavuot','שבועות','תיקון ליל שבועות · עשרת הדיברות · מאכלי חלב','#3a8f7a',5),
  ('summer','בין הזמנים ואירועי קהילה','ל״ג בעומר · ג׳ תמוז · התוועדויות · סעודות שבת','#5b6b86',6);

-- ---------- פריטי גלריה ----------
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'תקיעת שופר','#c98f2e','#e6bd5e',2,2,1 FROM gallery_categories WHERE slug='tishrei';
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'סוכה קהילתית','#b87f28','#d8a948',1,1,2 FROM gallery_categories WHERE slug='tishrei';
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'ארבעת המינים','#d6a23e','#eccb6e',1,1,3 FROM gallery_categories WHERE slug='tishrei';
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'הקפות שמחת תורה','#caa23f','#e8c668',2,1,4 FROM gallery_categories WHERE slug='tishrei';

INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'הדלקת נרות','#d97b2c','#f0b35a',1,1,1 FROM gallery_categories WHERE slug='chanuka';
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'חנוכייה ברחוב','#cf6f24','#ee9f44',2,1,2 FROM gallery_categories WHERE slug='chanuka';
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'מסיבת ילדים','#e08a3c','#f4bd6c',1,1,3 FROM gallery_categories WHERE slug='chanuka';

INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'קריאת המגילה','#7c4fb0','#a87fd0',2,1,1 FROM gallery_categories WHERE slug='purim';
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'משלוחי מנות','#8b5cc0','#b491dc',1,1,2 FROM gallery_categories WHERE slug='purim';
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'סעודת פורים','#7146a8','#9d76c8',1,1,3 FROM gallery_categories WHERE slug='purim';

INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'אפיית מצות','#2f86c9','#6fb6e6',1,1,1 FROM gallery_categories WHERE slug='pesach';
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'בדיקת חמץ','#2774b8','#5aa6dc',1,1,2 FROM gallery_categories WHERE slug='pesach';
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'סדר ציבורי','#1b66ac','#4f9bd6',2,1,3 FROM gallery_categories WHERE slug='pesach';

INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'קריאת עשרת הדיברות','#3a8f7a','#6fc2a8',2,1,1 FROM gallery_categories WHERE slug='shavuot';
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'תיקון ליל שבועות','#2f7d6a','#5cb398',1,1,2 FROM gallery_categories WHERE slug='shavuot';
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'קישוט הבית בירק','#43997f','#76c9af',1,1,3 FROM gallery_categories WHERE slug='shavuot';

INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'מדורת ל״ג בעומר','#5b6b86','#8aa0bd',1,1,1 FROM gallery_categories WHERE slug='summer';
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'התוועדות','#54647f','#7f96b4',1,1,2 FROM gallery_categories WHERE slug='summer';
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'סעודת שבת קהילתית','#4e5e79','#7c93b1',1,1,3 FROM gallery_categories WHERE slug='summer';
INSERT INTO gallery_items (category_id, caption, color_from, color_to, col_span, row_span, sort_order)
SELECT id, 'פעילות ילדים','#5b6b86','#93a8c4',1,1,4 FROM gallery_categories WHERE slug='summer';

-- ---------- המלצות ----------
INSERT INTO testimonials (name, role, body, initial, color_from, color_to, rating, sort_order) VALUES
  ('דוד כהן','תושב נחלאות','הגעתי לבד לתפילה והרגשתי מיד חלק מהמשפחה. החום והקבלה כאן הם משהו שלא חוויתי בשום מקום אחר בעיר.','ד','#2f86c9','#6fb6e6',5,1),
  ('מרים לוי','משתתפת בשיעורים','שיעור התניא של הרב פתח לי עולם שלם. הסבלנות וההסברה הברורה הופכים כל מפגש לחוויה שמחכים לה כל השבוע.','מ','#c98f2e','#e6bd5e',5,2),
  ('אבי פרידמן','אב למשפחה מהשכונה','הילדים מחכים כל שנה לחנוכה ולמסיבת האורות. בית חב״ד נחלאות הפך לבית השני של כל המשפחה שלנו.','א','#3a8f7a','#6fc2a8',5,3);

-- ---------- הנהגה ----------
INSERT INTO leaders (name, role, bio, color_from, color_to, sort_order) VALUES
  ('הרב מנחם','רב הקהילה ושליח','מוביל את התפילות והשיעורים, ומלווה את בני הקהילה ביד חמה בכל ענייני הרוח והחומר.','#1b4a8a','#2f86c9',1),
  ('הרבנית','שליחה ופעילות הנשים','מובילה את שיעורי הנשים ואת פעילות המשפחות והילדים, ופותחת את הבית בחום לכל אישה ואם בשכונה.','#c98f2e','#e6bd5e',2);

-- ---------- ערכי הבית ----------
INSERT INTO values_cards (icon, title, body, bg, sort_order) VALUES
  ('🕯️','תפילה','מניינים חמים ומדויקים שלוש פעמים ביום, בנוסח חב״ד.','#e2f0fa',1),
  ('📖','לימוד','שיעורי גמרא, תניא, הלכה וחסידות לכל הרמות, לגברים ונשים.','#fdf2dd',2),
  ('🤝','חסד','סיוע למשפחות, חבילות לחג ויד מושטת לכל מי שזקוק.','#e2f5ee',3),
  ('✨','קירוב','קבלת פנים חמה לכל יהודי, בלי תנאים ובלי תוויות.','#efe7f9',4);

-- ---------- סכומי תרומה ----------
INSERT INTO donation_tiers (amount, label, description, featured, accent, sort_order) VALUES
  (54,'תרומה חד פעמית','תורמים סעודת שבת לאורח בודד.',false,'#2f86c9',1),
  (180,'שותף חודשי','מחזיקים מניין שלם לאורך החודש.',true,'#2f86c9',2),
  (360,'תומך מוביל','מממנים שיעור שבועי קבוע לכל הקהל.',false,'#2f86c9',3),
  (770,'מקדש חודש','מקדישים חודש שלם של פעילות לעילוי נשמה.',false,'#c98f2e',4);

-- ---------- דרכי תרומה נוספות ----------
INSERT INTO donation_ways (icon, title, subtitle, sort_order) VALUES
  ('🔁','הוראת קבע','שותפות חודשית קבועה',1),
  ('🏦','העברה בנקאית','פרטי חשבון בטלפון',2),
  ('🕯️','הקדשה והנצחה','לעילוי נשמה או לרפואה',3),
  ('🤝','תרומה בעין','מזון, ציוד והתנדבות',4);
