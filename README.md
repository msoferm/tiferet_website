# בית חב״ד נחלאות — תפארת מנחם 🕯️

אתר אינטרנט מלא (Full-Stack) לבית חב״ד "תפארת מנחם" בשכונת נחלאות, ירושלים,
כולל **מערכת ניהול תוכן (CMS) חכמה** לכל חלקי האתר.

נבנה לפי העיצוב מתוך הריפו [`msoferm/tiferet2`](https://github.com/msoferm/tiferet2.git).

---

## 🏗️ ארכיטקטורה

| שכבה | טכנולוגיה |
|------|-----------|
| **Frontend** | React 18 + Vite + React Router (RTL מלא, עברית) |
| **Backend** | Node.js + Express (REST API) |
| **Database** | PostgreSQL 16 |
| **אימות** | JWT + bcrypt |
| **תשתית** | Docker + Docker Compose (3 שירותים) + Nginx |

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  frontend   │ ──▶ │   backend   │ ──▶ │     db      │
│ React+Nginx │     │  Express    │     │ PostgreSQL  │
│   :8088     │     │   :4400     │     │   :5544     │
└─────────────┘     └─────────────┘     └─────────────┘
```
Nginx מגיש את ה-React ומעביר (proxy) בקשות `/api` ו-`/uploads` לבקאנד.

> סטאק ה-Docker לעיל משמש לפיתוח מקומי. **בענן** האתר רץ ללא שרת — ראו למטה.

---

## ☁️ פריסה בענן — Firebase + Supabase (ללא בקאנד)

האתר החי רץ על **Firebase Hosting** (הפרונט) מול **Supabase** בלבד — אין שרת Express בענן.
הפרונט מדבר ישירות מול Supabase (PostgREST + Auth + Storage), והגישה מאובטחת ע"י **RLS**.

| רכיב | שירות |
|------|--------|
| 🌐 אתר (React build) | **Firebase Hosting** — `tiferetwebsite` |
| 🗄️ מסד נתונים | **Supabase Postgres** |
| 🔒 הרשאות | **RLS** — קריאה ציבורית לתוכן · הוספת הודעות/תרומות ל-anon · ניהול מלא למחוברים |
| 👤 התחברות אדמין | **Supabase Auth** (אימייל/סיסמה) |
| 🖼️ העלאת תמונות | **Supabase Storage** (bucket `uploads`) |

**אתר חי:** https://tiferetwebsite.web.app · **ניהול:** https://tiferetwebsite.web.app/admin

### בנייה ופריסה
```bash
cd frontend
cp .env.example .env          # מלאו VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm install
npm run build
cd ..
firebase deploy --only hosting --project tiferetwebsite
```

> משתני ה-Supabase (URL + מפתח anon ציבורי) מוזרקים בזמן build דרך `frontend/.env`.
> כל הגישה לנתונים מוגנת ב-RLS — לכן המפתח הציבורי בטוח לחשיפה בפרונט.

---

## 🚀 הפעלה מהירה (פיתוח מקומי עם Docker)

```bash
# 1. העתקת קובץ הסביבה (כבר קיים .env מוכן)
cp .env.example .env

# 2. בנייה והרצה
docker compose up -d --build

# 3. צפייה
#    אתר:        http://localhost:8088
#    ניהול:      http://localhost:8088/admin
#    API:        http://localhost:4400/api/health
```

> הפורטים בקובץ `.env` שונו מברירת המחדל כדי להימנע מהתנגשות עם שירותים אחרים
> (DB=5544, Backend=4400, Frontend=8088). ניתן לשנות בחופשיות.

### כניסה למערכת הניהול
```
שם משתמש:  admin
סיסמה:     admin123
```
מומלץ לשנות מיד דרך המערכת (או דרך משתני `ADMIN_USER` / `ADMIN_PASSWORD` ב-`.env`).

---

## 🗂️ מבנה הפרויקט

```
tiferet web2/
├── docker-compose.yml         # תזמור 3 השירותים
├── .env.example               # משתני סביבה
├── db/init/                   # סכמה + נתוני זריעה (רצים אוטומטית)
│   ├── 01_schema.sql
│   └── 02_seed.sql
├── backend/                   # שרת ה-API
│   ├── src/
│   │   ├── index.js           # נקודת כניסה + רישום ראוטים
│   │   ├── db.js              # חיבור Postgres
│   │   ├── auth.js           # JWT + מנהל ברירת מחדל
│   │   ├── crud.js           # מפעל CRUD גנרי
│   │   └── routes/           # auth, settings, content, gallery,
│   │                          #  messages, donations, upload, public
│   └── Dockerfile
└── frontend/                  # אפליקציית React
    ├── src/
    │   ├── pages/            # בית, אודות, גלריה, צור קשר, תרומות
    │   ├── components/       # Nav, Footer, Toast, SiteLayout
    │   ├── admin/            # מערכת הניהול המלאה
    │   │   ├── AdminApp.jsx  # ניתוב + שמירה על הרשאות + פריסה
    │   │   ├── CrudManager.jsx  # טבלת ניהול גנרית
    │   │   └── pages/        # עורך לכל סוג תוכן
    │   └── lib/              # api.js, useApi.js
    ├── nginx.conf
    └── Dockerfile
```

---

## 🧠 מערכת הניהול (CMS)

ניתן לערוך **כל** חלק באתר ללא נגיעה בקוד:

| מסך | מה ניתן לנהל |
|-----|--------------|
| 📊 **לוח בקרה** | סיכום הודעות, תרומות, שיעורים ותמונות + קיצורי דרך |
| ⚙️ **הגדרות אתר** | פרטי קשר, סטטיסטיקות, כותרת ראשית, זמני שבת ופרשה |
| 📝 **תכנים ופסקאות** | טקסטי "אודות" ופסקאות העמודים |
| 🕯️ **זמני תפילה** | שחרית / מנחה / ערבית — הוספה, עריכה, סדר, הסתרה |
| 📖 **שיעורים** | לוח השיעורים השבועי + הדגשת שיעור |
| 🗓️ **מעגל השנה** | אירועי החגים, צבעים ותמונות |
| 💬 **המלצות** | המלצות הקהילה + דירוג ואווטאר |
| 👥 **הנהגה** | הרב והרבנית — דיוקנאות וביוגרפיה |
| ✨ **ערכי הבית** | ארבעת העמודים בעמוד אודות |
| 🖼️ **גלריה** | קטגוריות ותמונות — כולל **העלאת תמונות** וגדלי משבצת |
| ₪ **תרומות** | מסלולי תרומה, דרכים נוספות, ו**יומן תרומות** עם מעקב סטטוס |
| ✉️ **הודעות** | תיבת דואר מטופס יצירת הקשר עם סטטוסים וארכיון |

**תכונות חכמות:** העלאת תמונות, הפעלה/הסתרה של פריטים, ספירת הודעות חדשות בזמן אמת,
סטטיסטיקות תרומות, ובורר צבעים לכל גרדיאנט.

---

## 🔌 עיקרי ה-API

| Method | Endpoint | תיאור |
|--------|----------|-------|
| `GET`  | `/api/public/bootstrap` | כל תוכן האתר בקריאה אחת (ציבורי) |
| `GET`  | `/api/gallery` | גלריה עם קטגוריות ופריטים |
| `POST` | `/api/messages` | שליחת הודעת יצירת קשר (ציבורי) |
| `POST` | `/api/donations` | רישום בקשת תרומה (ציבורי) |
| `POST` | `/api/auth/login` | התחברות מנהל → JWT |
| `*`    | `/api/{prayer-times,classes,year-cycle,testimonials,leaders,values,donation-tiers,donation-ways}` | CRUD (דורש התחברות לכתיבה) |
| `PUT`  | `/api/settings` | עדכון הגדרות (דורש התחברות) |
| `POST` | `/api/upload` | העלאת תמונה (דורש התחברות) |

---

## 🛠️ פיתוח מקומי (ללא Docker)

```bash
# בקאנד (צריך Postgres מקומי או הרצת שירות ה-db בלבד)
cd backend && npm install && npm run dev

# פרונטאנד (Vite עם proxy ל-localhost:4000)
cd frontend && npm install && npm run dev   # http://localhost:5173
```

---

## 📋 פקודות שימושיות

```bash
docker compose logs -f backend     # צפייה בלוגים
docker compose down                # עצירה
docker compose down -v             # עצירה + מחיקת מסד הנתונים (איפוס מלא)
docker compose up -d --build       # בנייה מחדש
```

---

© תשפ״ו · בית חב״ד נחלאות — תפארת מנחם
