// === Screen: Catalog ===
const CatalogScreen = ({ outfit, onTryOn, onOpenOutfit, userSize = 'M' }) => {
  const [tab, setTab] = React.useState('Все');
  const [hovered, setHovered] = React.useState(null);
  const filtered = tab === 'Все' ? CATALOG : CATALOG.filter(i => i.cat === tab);

  return (
    <div className="screen page-pad" data-screen-label="03 Catalog"
      style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px' }}>
      {/* header */}
      <div className="catalog-header" style={{
        display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 28
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
          <button className="chip">
            <span>Сортировка: популярные</span>
          </button>
          <button className="chip" style={{
            background: 'var(--accent-soft)',
            color: 'var(--accent-deep)',
            borderColor: 'transparent',
            fontWeight: 600
          }}>
            <SparkleIcon size={12} />
            Ваш размер · {userSize}
          </button>
        </div>
      </div>

      {/* tabs */}
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

      {/* grid */}
      <div className="grid-4col" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20
      }}>
        {filtered.map(item => {
          const inOutfit = outfit.includes(item.id);
          const isHovered = hovered === item.id;
          return (
            <div key={item.id}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'relative', cursor: 'pointer', transition: 'transform .2s',
                transform: isHovered ? 'translateY(-3px)' : 'none'
              }}
              onClick={() => onTryOn(item)}
            >
              <div style={{ position: 'relative' }}>
                <Garment item={item} />
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
                {/* hover tryon overlay */}
                <div style={{
                  position: 'absolute', left: 10, right: 10, bottom: 10,
                  opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'all .2s ease', pointerEvents: isHovered ? 'auto' : 'none'
                }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onTryOn(item); }}
                    style={{
                      width: '100%', height: 38, borderRadius: 10,
                      background: 'rgba(14,14,16,.92)', color: 'white',
                      fontSize: 13, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      backdropFilter: 'blur(6px)'
                    }}>
                    <SparkleIcon size={13} />
                    Примерить
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

      {/* floating outfit button */}
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

window.CatalogScreen = CatalogScreen;
