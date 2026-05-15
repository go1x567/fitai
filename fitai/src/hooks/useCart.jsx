import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { useAuth } from './useAuth';

const CartCtx = createContext(null);
const LS_KEY = 'fitai_cart';

function readLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(items) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch { /* ignore */ }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]); // local shape: { catalogItemId, size, qty, catalogItem?, id? }
  const [loading, setLoading] = useState(false);
  const mergedFor = useRef(null);

  // Load: if user — fetch from server (merging any pending local first); else read localStorage.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (user?.id) {
        setLoading(true);
        try {
          const local = readLocal();
          if (local.length && mergedFor.current !== user.id) {
            await api.mergeCart(local.map(({ catalogItemId, size, qty }) => ({ catalogItemId, size, qty })));
            writeLocal([]);
            mergedFor.current = user.id;
          }
          const data = await api.getCart();
          if (!cancelled) {
            setItems((data.items || []).map((it) => ({
              id: it.id,
              catalogItemId: it.catalogItemId,
              size: it.size,
              qty: it.qty,
              catalogItem: it.catalogItem,
            })));
          }
        } catch (e) {
          /* error already toasted */
        } finally {
          if (!cancelled) setLoading(false);
        }
      } else {
        mergedFor.current = null;
        setItems(readLocal());
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user?.id]);

  // Persist local-only changes
  useEffect(() => {
    if (!user?.id) writeLocal(items);
  }, [items, user?.id]);

  const add = useCallback(async (catalogItem, size = null, qty = 1) => {
    const catalogItemId = catalogItem.id;
    if (user?.id) {
      try {
        const { item } = await api.addToCart(catalogItemId, size, qty);
        setItems((prev) => {
          const idx = prev.findIndex((p) => p.id === item.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], qty: item.qty, size: item.size };
            return next;
          }
          return [{ id: item.id, catalogItemId, size: item.size, qty: item.qty, catalogItem }, ...prev];
        });
        toast.success('Добавлено в корзину');
      } catch { /* toasted */ }
    } else {
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.catalogItemId === catalogItemId && (p.size ?? null) === (size ?? null));
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [{ catalogItemId, size, qty, catalogItem }, ...prev];
      });
      toast.success('Добавлено в корзину');
    }
  }, [user?.id]);

  const remove = useCallback(async (key) => {
    if (user?.id) {
      try {
        await api.removeCartItem(key);
        setItems((prev) => prev.filter((p) => p.id !== key));
      } catch { /* toasted */ }
    } else {
      setItems((prev) => prev.filter((p, i) => `${p.catalogItemId}:${p.size ?? ''}` !== key && i !== key));
    }
  }, [user?.id]);

  const updateQty = useCallback(async (key, qty) => {
    if (qty < 1) return;
    if (user?.id) {
      try {
        const { item } = await api.updateCartItem(key, { qty });
        setItems((prev) => prev.map((p) => (p.id === key ? { ...p, qty: item.qty } : p)));
      } catch { /* toasted */ }
    } else {
      setItems((prev) => prev.map((p) => (`${p.catalogItemId}:${p.size ?? ''}` === key ? { ...p, qty } : p)));
    }
  }, [user?.id]);

  const clear = useCallback(async () => {
    if (user?.id) {
      try { await api.clearCart(); } catch { /* toasted */ }
    }
    setItems([]);
  }, [user?.id]);

  const count = items.reduce((s, it) => s + it.qty, 0);
  const subtotal = items.reduce((s, it) => s + (it.catalogItem?.price ?? 0) * it.qty, 0);

  const keyOf = (it) => it.id ?? `${it.catalogItemId}:${it.size ?? ''}`;

  return (
    <CartCtx.Provider value={{ items, loading, add, remove, updateQty, clear, count, subtotal, keyOf }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
