const TEMPLATES = {
  Lamoda:    { utm_source: 'fitai', utm_medium: 'affiliate' },
  Lime:      { utm_source: 'fitai', utm_medium: 'affiliate' },
  Uniqlo:    { utm_source: 'fitai' },
  Mango:     { utm_source: 'fitai' },
  "Levi's":  { utm_source: 'fitai' },
  Zarina:    { utm_source: 'fitai' },
  Befree:    { utm_source: 'fitai' },
  Adidas:    { utm_source: 'fitai' },
  Ekonika:   { utm_source: 'fitai' },
  Mascotte:  { utm_source: 'fitai' },
  'Massimo Dutti': { utm_source: 'fitai' },
  Bask:      { utm_source: 'fitai' },
  COS:       { utm_source: 'fitai' },
};

const DEFAULT = { utm_source: 'fitai' };

export function withAffiliate(url, brand) {
  if (!url) return url;
  try {
    const u = new URL(url);
    const params = TEMPLATES[brand] || DEFAULT;
    for (const [k, v] of Object.entries(params)) {
      if (!u.searchParams.has(k)) u.searchParams.set(k, v);
    }
    return u.toString();
  } catch {
    return url;
  }
}
