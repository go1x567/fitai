import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { CATALOG as LOCAL_CATALOG } from '../data/catalog';

export function useCatalog() {
  const [items, setItems] = useState(LOCAL_CATALOG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.catalog()
      .then((r) => { if (!cancelled && r.items?.length) setItems(r.items); })
      .catch((e) => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error };
}
