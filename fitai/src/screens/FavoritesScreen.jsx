import { useCatalog } from '../hooks/useCatalog';
import { Garment, ArrowLeft, ArrowRight, HeartIcon, SparkleIcon, BagIcon } from '../components/UI';
import { fmtPrice } from '../data/catalog';
import { useCart } from '../hooks/useCart';

export const FavoritesScreen = ({ favorites = [], onBack, onCatalog, onTryOn, onToggleFavorite, userSize = 'M' }) => {
  const { items: CATALOG } = useCatalog();
  const { add: addToCart } = useCart();
  const items = CATALOG.filter((c) => favorites.includes(c.id));

  return (
    <div className="screen page-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px' }}>
      <button onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-2)', fontSize: 13.5, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Назад
      </button>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--ink-3)', textTransform: 'uppercase' }}>Избранное</div>
        <h1 style={{ fontSize: 44, lineHeight: 1.04, letterSpacing: '-0.035em', fontWeight: 700, margin: '8px 0 0' }}>
          {items.length > 0 ? `${items.length} в избранном` : 'Здесь пусто'}
        </h1>
      </div>

      {items.length === 0 ? (
        <div style={{
          background: 'var(--warm)', borderRadius: 22, padding: '64px 28px',
          textAlign: 'center', border: '1px solid var(--line)'
        }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>♡</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>Пока ничего не сохранено</h3>
          <p style={{ fontSize: 14.5, color: 'var(--ink-2)', margin: '0 0 18px' }}>
            Нажми на сердечко в каталоге, чтобы сохранить вещь сюда.
          </p>
          <button onClick={onCatalog} className="btn btn-accent">
            Перейти в каталог <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="grid-4col stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {items.map((item, idx) => (
            <div key={item.id} style={{ '--i': idx, position: 'relative', cursor: 'pointer' }} onClick={() => onTryOn(item)}>
              <div style={{ position: 'relative' }}>
                <Garment item={item} />
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
                  className="heart-pop"
                  aria-label="Убрать из избранного"
                  style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--accent)', color: 'white',
                    display: 'grid', placeItems: 'center',
                    boxShadow: '0 4px 10px -4px rgba(0,0,0,.15)'
                  }}>
                  <HeartIcon size={14} filled />
                </button>
                <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10, display: 'flex', gap: 6 }}>
                  <button onClick={(e) => { e.stopPropagation(); onTryOn(item); }}
                    style={{
                      flex: 1, height: 36, borderRadius: 10,
                      background: 'rgba(14,14,16,.92)', color: 'white',
                      fontSize: 12.5, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                    <SparkleIcon size={12} /> Примерить
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(item, userSize, 1); }}
                    aria-label="В корзину"
                    style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.95)', color: 'var(--ink)', display: 'grid', placeItems: 'center' }}>
                    <BagIcon size={14} />
                  </button>
                </div>
              </div>
              <div style={{ padding: '12px 4px 0' }}>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 3 }}>{item.brand ? `${item.brand} · ` : ''}{item.cat}</div>
                <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.3, marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{fmtPrice(item.price)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
