// קליינט API מרכזי
const BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('tiferet_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body, isForm = false) {
  const opts = { method, headers: { ...authHeaders() } };
  if (body !== undefined) {
    if (isForm) {
      opts.body = body;
    } else {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
  }
  const res = await fetch(BASE + path, opts);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('tiferet_token');
    }
    throw new Error((data && data.error) || 'שגיאה בלתי צפויה');
  }
  return data;
}

export const api = {
  get: (p) => request('GET', p),
  post: (p, b) => request('POST', p, b),
  put: (p, b) => request('PUT', p, b),
  del: (p) => request('DELETE', p),
  upload: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return request('POST', '/upload', fd, true);
  },
};

// ניהול אסימון
export const auth = {
  get token() { return localStorage.getItem('tiferet_token'); },
  set token(t) {
    if (t) localStorage.setItem('tiferet_token', t);
    else localStorage.removeItem('tiferet_token');
  },
  get isLoggedIn() { return !!localStorage.getItem('tiferet_token'); },
  logout() { localStorage.removeItem('tiferet_token'); },
};
