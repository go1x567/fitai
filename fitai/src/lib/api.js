const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const ACCESS_KEY = 'fitai_token';
const REFRESH_KEY = 'fitai_refresh';

export const tokenStore = {
  get: () => localStorage.getItem(ACCESS_KEY),
  set: (t) => localStorage.setItem(ACCESS_KEY, t),
  clear: () => { localStorage.removeItem(ACCESS_KEY); localStorage.removeItem(REFRESH_KEY); },
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setRefresh: (t) => localStorage.setItem(REFRESH_KEY, t),
  setPair: ({ accessToken, refreshToken }) => {
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  },
};

export function emitError(message, ctx) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('fitai:error', { detail: { message, ctx } }));
}

let refreshInflight = null;
async function tryRefresh() {
  if (refreshInflight) return refreshInflight;
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return null;
  refreshInflight = (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) { tokenStore.clear(); return null; }
      const data = await res.json();
      tokenStore.setPair(data);
      return data.accessToken;
    } finally {
      refreshInflight = null;
    }
  })();
  return refreshInflight;
}

async function rawRequest(path, opts, accessToken) {
  const headers = { ...(opts.headers || {}) };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  return fetch(`${API_URL}${path}`, { ...opts, headers });
}

const RETRY_METHODS = new Set(['GET', 'HEAD']);

async function withRetry(fn, { retries = 2, base = 400, method = 'GET' } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fn();
      if (res.status >= 500 && RETRY_METHODS.has(method) && attempt < retries) {
        await new Promise((r) => setTimeout(r, base * Math.pow(2, attempt)));
        continue;
      }
      return res;
    } catch (e) {
      lastErr = e;
      if (!RETRY_METHODS.has(method) || attempt === retries) throw e;
      await new Promise((r) => setTimeout(r, base * Math.pow(2, attempt)));
    }
  }
  throw lastErr;
}

async function request(path, { method = 'GET', body, form, auth = true, silent = false } = {}) {
  const headers = {};
  let payload;
  if (form) {
    payload = form;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const opts = { method, headers, body: payload };

  let token = auth ? tokenStore.get() : null;
  let res = await withRetry(() => rawRequest(path, opts, token), { method });

  if (res.status === 401 && auth) {
    const fresh = await tryRefresh();
    if (fresh) res = await withRetry(() => rawRequest(path, opts, fresh), { method });
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(data?.error || res.statusText);
    err.status = res.status;
    err.data = data;
    if (!silent && res.status !== 401) emitError(err.message, { path, status: res.status });
    throw err;
  }
  return data;
}

export const api = {
  register: (email, password) => request('/auth/register', { method: 'POST', body: { email, password }, auth: false, silent: true }),
  login:    (email, password) => request('/auth/login',    { method: 'POST', body: { email, password }, auth: false, silent: true }),
  logout:   () => request('/auth/logout', { method: 'POST', body: { refreshToken: tokenStore.getRefresh() } }).catch(() => null),

  catalog:  (cat) => request(`/catalog${cat && cat !== 'Все' ? `?cat=${encodeURIComponent(cat)}` : ''}`, { auth: false }),

  uploadPhoto: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return request('/upload/photo', { method: 'POST', form: fd });
  },

  createTryOn: (photoId, catalogItemId, size) =>
    request('/tryon', { method: 'POST', body: { photoId, catalogItemId, size } }),
  getTryOn: (id) => request(`/tryon/${id}`, { silent: true }),

  listOutfits:  () => request('/outfits'),
  createOutfit: (name, itemIds) => request('/outfits', { method: 'POST', body: { name, itemIds } }),
  updateOutfit: (id, patch) => request(`/outfits/${id}`, { method: 'PATCH', body: patch }),
  deleteOutfit: (id) => request(`/outfits/${id}`, { method: 'DELETE' }),

  shareOutfit:   (id) => request(`/outfits/${id}/share`, { method: 'POST' }),
  unshareOutfit: (id) => request(`/outfits/${id}/share`, { method: 'DELETE' }),
  getPublicOutfit: (token) => request(`/public/outfits/${encodeURIComponent(token)}`, { auth: false }),

  getProfile:    () => request('/me/profile'),
  updateProfile: (patch) => request('/me/profile', { method: 'PUT', body: patch }),

  listPhotos:  () => request('/me/photos'),
  listTryOns:  (limit = 30) => request(`/me/tryons?limit=${limit}`),

  getCart:        () => request('/cart'),
  addToCart:      (catalogItemId, size, qty = 1) => request('/cart/items', { method: 'POST', body: { catalogItemId, size, qty } }),
  updateCartItem: (id, patch) => request(`/cart/items/${id}`, { method: 'PATCH', body: patch }),
  removeCartItem: (id) => request(`/cart/items/${id}`, { method: 'DELETE' }),
  clearCart:      () => request('/cart', { method: 'DELETE' }),
  mergeCart:      (items) => request('/cart/merge', { method: 'POST', body: { items } }),

  adminStats:   () => request('/admin/stats'),
  adminUsers:   ({ q = '', skip = 0, take = 20 } = {}) =>
    request(`/admin/users?q=${encodeURIComponent(q)}&skip=${skip}&take=${take}`),
  adminSetRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PATCH', body: { role } }),
  adminDeleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  adminTryOns:  ({ status = '', skip = 0, take = 30 } = {}) =>
    request(`/admin/tryon?status=${encodeURIComponent(status)}&skip=${skip}&take=${take}`),
  adminCatalog:    () => request('/admin/catalog'),
  adminCreateItem: (item) => request('/admin/catalog', { method: 'POST', body: item }),
  adminUpdateItem: (id, patch) => request(`/admin/catalog/${id}`, { method: 'PATCH', body: patch }),
  adminDeleteItem: (id) => request(`/admin/catalog/${id}`, { method: 'DELETE' }),
};

export async function pollTryOn(jobId, { intervalMs = 1500, timeoutMs = 60000 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const job = await api.getTryOn(jobId);
    if (job.status === 'done' || job.status === 'failed') return job;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('tryon_timeout');
}
