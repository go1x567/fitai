import { fmtPrice } from '../data/catalog';
import { useCart } from '../hooks/useCart';
import { Garment, ArrowRight, ArrowLeft } from '../components/UI';
import { withAffiliate } from '../lib/affiliate';
import { RowSkeleton } from '../components/Skeleton';

export const CartScreen = ({ onBack, onCatalog }) => {
  const { items, loading, remove, updateQty, clear, count, subtotal, keyOf } = useCart();

  const buy = (item) => {
    const url = withAffiliate(item.purchaseUrl, item.brand);
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const buyAll = () => {
    items.forEach((it, i) => {
      const ci = it.catalogItem;
      const url = ci?.purchaseUrl && withAffiliate(ci.purchaseUrl, ci.brand);
      if (!url) return;
      setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), i * 250);
    });
  };

  return (
    <div className="screen page-pad" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 32px 80px' }}>
      <button onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-2)', fontSize: 13.5, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Назад
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--ink-3)', textTransform: 'uppercase' }}>Корзина</div>
          <h1 style={{ fontSize: 44, lineHeight: 1.04, letterSpacing: '-0.035em', fontWeight: 700, margin: '8px 0 0' }}>
            {count > 0 ? `${count} ${pluralize(count, ['вещь','вещи','вещей'])}` : 'Пусто'}
          </h1>
        </div>
        {items.length > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" onClick={clear}>Очистить</button>
            <button className="btn btn-primary" onClick={buyAll}>
              Купить всё <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyCart onCatalog={onCatalog} />
      ) : (
        <div className="grid-outfit" style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 12 }}>
            {items.map((it) => {
              const ci = it.catalogItem;
              if (!ci) return null;
              const k = keyOf(it);
              return (
                <div key={k} className="grid-outfit-row"
                  style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 16, padding: 12,
                    display: 'grid', gridTemplateColumns: '88px 1fr auto', gap: 14, alignItems: 'center' }}>
                  <div style={{ borderRadius: 10, overflow: 'hidden' }}>
                    <Garment item={ci} size="sm" />
                  </div>
                  <div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginBottom: 2 }}>
                      {ci.brand ? `${ci.brand} · ` : ''}{ci.cat}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 6 }}>{ci.name}</div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      {it.size && <span className="chip" style={{ height: 26, fontSize: 11.5, pointerEvents: 'none' }}>{it.size}</span>}
                      <QtyStepper qty={it.qty} onChange={(q) => updateQty(k, q)} />
                      <button onClick={() => remove(k)} className="chip"
                        style={{ height: 28, fontSize: 11.5, color: '#B43D3D', borderColor: 'var(--line)' }}>
                        Убрать
                      </button>
                    </div>
                  </div>
                  <div className="row-actions" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{fmtPrice(ci.price * it.qty)}</div>
                    {ci.purchaseUrl && (
                      <button onClick={() => buy(ci)} style={{
                        height: 36, padding: '0 14px', borderRadius: 999,
                        background: 'var(--ink)', color: 'white', fontSize: 13, fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: 6
                      }}>
                        Купить <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            background: 'var(--surface)', borderRadius: 20, padding: 22,
            border: '1px solid var(--line)', position: 'sticky', top: 92
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 10 }}>
              Итого
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-2)', marginBottom: 6 }}>
              <span>Позиций</span><span>{count}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--line-2)', paddingTop: 12, marginTop: 10 }}>
              <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>К оплате</span>
              <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>{fmtPrice(subtotal)}</span>
            </div>
            <button className="btn btn-accent" onClick={buyAll} style={{ width: '100%', marginTop: 16 }}>
              Купить всё <ArrowRight size={14} />
            </button>
            <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--ink-3)', textAlign: 'center' }}>
              Каждый магазин откроется в новой вкладке
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const QtyStepper = ({ qty, onChange }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, border: '1px solid var(--line)', borderRadius: 999, overflow: 'hidden' }}>
    <button onClick={() => onChange(Math.max(1, qty - 1))} style={{ width: 28, height: 28, fontSize: 16, color: 'var(--ink-2)' }} aria-label="Уменьшить">−</button>
    <span style={{ minWidth: 22, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>{qty}</span>
    <button onClick={() => onChange(qty + 1)} style={{ width: 28, height: 28, fontSize: 16, color: 'var(--ink-2)' }} aria-label="Увеличить">+</button>
  </div>
);

const EmptyCart = ({ onCatalog }) => (
  <div style={{
    background: 'var(--warm)', borderRadius: 22, padding: '64px 28px',
    textAlign: 'center', border: '1px solid var(--line)'
  }}>
    <div style={{ fontSize: 52, marginBottom: 12 }}>🛍️</div>
    <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
      Корзина пуста
    </h3>
    <p style={{ fontSize: 14.5, color: 'var(--ink-2)', margin: '0 0 18px' }}>
      Открой каталог и добавь вещи, которые понравились.
    </p>
    <button onClick={onCatalog} className="btn btn-accent">
      Перейти в каталог <ArrowRight size={14} />
    </button>
  </div>
);

function pluralize(n, [one, few, many]) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
