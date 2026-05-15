import { useState, useMemo } from 'react';
import { TABS, fmtPrice } from '../data/catalog';
import { useCatalog } from '../hooks/useCatalog';
import { Garment, SparkleIcon, CheckIcon, ArrowRight, HeartIcon, SearchIcon, BagIcon } from '../components/UI';
import { useCart } from '../hooks/useCart';
import { GridSkeleton } from '../components/Skeleton';

const PRICE_RANGES = [
  { id: 'any',   label: 'Любая',     test: () => true },
  { id: 'lt2k',  label: 'до 2 000 ₽',  test: p => p < 2000 },
  { id: '2to5k', label: '2 000 – 5 000 ₽', test: p => p >= 2000 && p < 5000 },
  { id: '5to10k',label: '5 000 – 10 000 ₽', test: p => p >= 5000 && p < 10000 },
  { id: 'gt10k', label: 'от 10 000 ₽', test: p => p >= 10000 },
];

const SORTS = [
  { id: 'pop',   label: 'Популярные' },
  { id: 'asc',   label: 'Сначала дешевле' },
  { id: 'desc',  label: 'Сначала дороже' },
  { id: 'name',  label: 'По названию' },
];

export const CatalogScreen = ({ outfit, onTryOn, onOpenOutfit, userSize = 'M', favorites = [], onToggleFavorite }) => {
  const { items: CATALOG, loading } = useCatalog();
  const { add: addToCart } = useCart();
  const [tab, setTab] = useState('Все');
  const [hovered, setHovered] = useState(null);
  const [query, setQuery] = useState('');
  const [priceRange, setPriceRange] = useState('any');
  const [sort, setSort] = useState('pop');
  const [onlyFav, setOnlyFav] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    const pr = PRICE_RANGES.find(p => p.id === priceRange) || PRICE_RANGES[0];
    const q = query.trim().toLowerCase();
    let list = CATALOG.filter(i => {
      if (tab !== 'Все' && i.cat !== tab) return false;
      if (!pr.test(i.price)) return false;
      if (onlyFav && !favorites.includes(i.id)) return false;
      if (q && !i.name.toLowerCase().includes(q) && !i.cat.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sort === 'asc')  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    return list;
  }, [CATALOG, tab, query, priceRange, sort, onlyFav, favorites]);

  return (
    <div className="screen page-pad" data-screen-label="03 Catalog"
      style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div className="catalog-header" style={{
        display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 24
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
            color: 'var(--ink-3)', textTransform: 'uppercase' }}>Шаг 2 из 3</div>
          <h1 style={{ fontSize: 44, lineHeight: 1.04, letterSpacing: '-0.035em',
            fontWeight: 700, margin: '8px 0 0' }}>
            Каталог
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button className="chip" onClick={() => setSortOpen(o => !o)}>
              <span>Сортировка: {SORTS.find(s => s.id === sort).label.toLowerCase()}</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .6 }}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {sortOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 30,
                background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: 12, padding: 6, minWidth: 200,
                boxShadow: '0 16px 36px -16px rgba(0,0,0,.2)'
              }}>
                {SORTS.map(s => (
                  <button key={s.id} onClick={() => { setSort(s.id); setSortOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '8px 10px', borderRadius: 8,
                      fontSize: 13, fontWeight: sort === s.id ? 600 : 500,
                      background: sort === s.id ? 'var(--warm)' : 'transparent',
                      color: 'var(--ink)', textAlign: 'left'
                    }}>
                    {s.label}
                    {sort === s.id && <CheckIcon size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="chip" style={{
            background: 'var(--accent-soft)', color: 'var(--accent-deep)',
            borderColor: 'transparent', fontWeight: 600
          }}>
            <SparkleIcon size={12} />
            Ваш размер · {userSize}
          </button>
        </div>
      </div>

      {/* search + price + favorites */}
      <div className="catalog-filters" style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 380 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--ink-3)', pointerEvents: 'none' }}>
            <SearchIcon size={15} />
          </span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск по названию или категории…"
            style={{
              width: '100%', height: 40, padding: '0 14px 0 38px',
              borderRadius: 999, border: '1px solid var(--line)',
              background: 'var(--surface)', color: 'var(--ink)',
              fontSize: 13.5, fontFamily: 'inherit', outline: 'none',
              transition: 'border-color .15s'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--ink)'}
            onBlur={e => e.target.style.borderColor = 'var(--line)'}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              width: 22, height: 22, borderRadius: '50%', background: 'var(--warm)',
              color: 'var(--ink-2)', display: 'grid', placeItems: 'center', fontSize: 13
            }}>×</button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {PRICE_RANGES.map(p => (
            <button key={p.id} onClick={() => setPriceRange(p.id)}
              className={"chip " + (priceRange === p.id ? 'active' : '')}
              style={{ height: 32, fontSize: 12.5 }}>
              {p.label}
            </button>
          ))}
        </div>
        <button onClick={() => setOnlyFav(v => !v)}
          className={"chip " + (onlyFav ? 'active' : '')}
          style={{ height: 32, fontSize: 12.5 }}>
          <HeartIcon size={12} filled={onlyFav} />
          Избранное {favorites.length > 0 && `(${favorites.length})`}
        </button>
      </div>

      <div className="tabs-scroll" style={{
        display: 'flex', alignItems: 'center', gap: 28, borderBottom: '1px solid var(--line-2)',
        marginBottom: 28
      }}>
        {TABS.map(t => {
          const count = t === 'Все' ? CATALOG.length : CATALOG.filter(i => i.cat === t).length;
          const active = tab === t;
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '12px 0', display: 'flex', alignItems: 'center', gap: 8,
              borderBottom: '2px solid ' + (active ? 'var(--ink)' : 'transparent'),
              marginBottom: -1, fontSize: 14.5,
              color: active ? 'var(--ink)' : 'var(--ink-2)',
              fontWeight: active ? 600 : 500,
              transition: 'color .15s'
            }}>
              {t}
              <span style={{
                fontSize: 11, padding: '2px 7px', borderRadius: 999,
                background: active ? 'var(--ink)' : 'var(--warm)',
                color: active ? 'white' : 'var(--ink-3)'
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {loading && CATALOG.length === 0 ? (
        <GridSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <EmptyState onReset={() => { setQuery(''); setPriceRange('any'); setOnlyFav(false); setTab('Все'); }} />
      ) : (
        <div key={`${tab}-${query}-${priceRange}-${sort}-${onlyFav}`} className="grid-4col stagger" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20
        }}>
          {filtered.map((item, idx) => {
            const inOutfit = outfit.includes(item.id);
            const isFav = favorites.includes(item.id);
            const isHovered = hovered === item.id;
            return (
              <div key={item.id}
                style={{ '--i': idx,
                  position: 'relative', cursor: 'pointer', transition: 'transform .2s',
                  transform: isHovered ? 'translateY(-3px)' : 'none'
                }}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onTryOn(item)}
              >
                <div style={{ position: 'relative' }}>
                  <Garment item={item} />

                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
                    className={isFav ? 'heart-pop' : ''}
                    aria-label={isFav ? 'Убрать из избранного' : 'В избранное'}
                    style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 32, height: 32, borderRadius: '50%',
                      background: isFav ? 'var(--accent)' : 'rgba(255,255,255,.92)',
                      color: isFav ? 'white' : 'var(--ink-2)',
                      display: 'grid', placeItems: 'center',
                      backdropFilter: 'blur(6px)',
                      transition: 'all .15s',
                      boxShadow: '0 4px 10px -4px rgba(0,0,0,.15)'
                    }}>
                    <HeartIcon size={14} filled={isFav} />
                  </button>

                  {inOutfit && (
                    <div style={{
                      position: 'absolute', top: 10, left: 10, padding: '5px 10px 5px 8px',
                      borderRadius: 999, background: 'var(--accent)', color: 'white',
                      fontSize: 11.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
                      boxShadow: '0 6px 14px -6px rgba(124,58,237,.5)'
                    }}>
                      <CheckIcon size={11} />
                      в&nbsp;образе
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', left: 10, right: 10, bottom: 10,
                    opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'all .2s ease', pointerEvents: isHovered ? 'auto' : 'none',
                    display: 'flex', gap: 6
                  }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); onTryOn(item); }}
                      style={{
                        flex: 1, height: 38, borderRadius: 10,
                        background: 'rgba(14,14,16,.92)', color: 'white',
                        fontSize: 13, fontWeight: 600,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        backdropFilter: 'blur(6px)'
                      }}>
                      <SparkleIcon size={13} />
                      Примерить
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart(item, userSize, 1); }}
                      aria-label="В корзину"
                      title="В корзину"
                      style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: 'rgba(255,255,255,.95)', color: 'var(--ink)',
                        display: 'grid', placeItems: 'center',
                        backdropFilter: 'blur(6px)'
                      }}>
                      <BagIcon size={15} />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '12px 4px 0' }}>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 3 }}>{item.cat}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em',
                    lineHeight: 1.3, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>
                      {fmtPrice(item.price)}
                    </span>
                    {item.price > 5000 && (
                      <span style={{ fontSize: 12, color: 'var(--ink-3)', textDecoration: 'line-through' }}>
                        {fmtPrice(Math.round(item.price * 1.3))}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {outfit.length > 0 && (
        <button onClick={onOpenOutfit} className="floating-outfit"
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 40,
            height: 56, padding: '0 20px 0 16px', borderRadius: 999,
            background: 'var(--solid)', color: 'var(--on-solid)',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 18px 36px -12px rgba(0,0,0,.4)',
            fontWeight: 600, fontSize: 15,
            transition: 'transform .15s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div className="floating-avatars" style={{ display: 'flex' }}>
            {outfit.slice(0, 3).map((id, i) => {
              const item = CATALOG.find(c => c.id === id);
              if (!item) return null;
              return (
                <div key={id} style={{
                  width: 32, height: 32, borderRadius: '50%', background: item.tone,
                  display: 'grid', placeItems: 'center', fontSize: 14,
                  border: '2px solid var(--solid)', marginLeft: i ? -10 : 0
                }}>{item.emoji}</div>
              );
            })}
          </div>
          Мой образ ({outfit.length})
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
};

const EmptyState = ({ onReset }) => (
  <div style={{
    background: 'var(--warm)', borderRadius: 22, padding: '64px 28px',
    textAlign: 'center', border: '1px solid var(--line)'
  }}>
    <div style={{ fontSize: 52, marginBottom: 12 }}>🔍</div>
    <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
      Ничего не нашлось
    </h3>
    <p style={{ fontSize: 14.5, color: 'var(--ink-2)', margin: '0 0 18px' }}>
      Попробуй ослабить фильтры или поискать иначе.
    </p>
    <button onClick={onReset} className="btn btn-soft" style={{ height: 42 }}>
      Сбросить все фильтры
    </button>
  </div>
);
