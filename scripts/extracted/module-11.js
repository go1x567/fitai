// === Screen: Try-On Result ===
const TryOnScreen = ({ item, onBack, onAdd, inOutfit, userSize = 'M', height = 172 }) => {
  const [loading, setLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [regenKey, setRegenKey] = React.useState(0);

  React.useEffect(() => {
    setLoading(true); setProgress(0);
    let p = 0;
    const tick = setInterval(() => {
      p += 4 + Math.random() * 6;
      setProgress(Math.min(p, 98));
    }, 120);
    const t = setTimeout(() => { setLoading(false); setProgress(100); clearInterval(tick); }, 2400);
    return () => { clearTimeout(t); clearInterval(tick); };
  }, [item.id, regenKey]);

  // outfit colors derived from item
  const tryonOutfit = React.useMemo(() => {
    if (item.cat === 'Топы')           return { shirt: item.tone, pants: '#3A4A66', shoes: '#1B1B1F' };
    if (item.cat === 'Низ')            return { shirt: '#F4F1EA', pants: item.tone, shoes: '#1B1B1F' };
    if (item.cat === 'Обувь')          return { shirt: '#F4F1EA', pants: '#3A4A66', shoes: item.tone };
    if (item.cat === 'Верхняя одежда') return { shirt: item.tone, pants: '#3A4A66', shoes: '#1B1B1F' };
    return { shirt: '#F4F1EA', pants: '#3A4A66', shoes: '#1B1B1F' };
  }, [item]);

  return (
    <div className="screen page-pad" data-screen-label="04 Try-On"
      style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px' }}>
      {/* breadcrumbs */}
      <button onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-2)',
          fontSize: 13.5, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Назад к каталогу
      </button>

      <div className="grid-tryon" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 380px', gap: 20 }}>
        {/* original photo */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
            color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 10 }}>
            Оригинал
          </div>
          <PersonPhoto label="Твоё фото" tone="#EDE6D5"
            outfit={{ shirt: '#E8DFC9', pants: '#3A4A66', shoes: '#1B1B1F' }} />
        </div>

        {/* generated result */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
              color: 'var(--accent)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
              <SparkleIcon size={12} /> ИИ-примерка
            </div>
            {!loading && (
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                Сгенерировано за 2,1 сек
              </span>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            {loading ? (
              <div style={{
                width: '100%', aspectRatio: '3/4', borderRadius: 18,
                background: 'linear-gradient(180deg, #2A2730 0%, #1B1A20 100%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: 'white', position: 'relative', overflow: 'hidden'
              }}>
                {/* shimmer overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(circle at 50% 40%, rgba(124,58,237,.25), transparent 60%)'
                }} />
                <div className="spinner" style={{ borderColor: 'rgba(255,255,255,.15)', borderTopColor: 'var(--accent)' }} />
                <div style={{ marginTop: 22, fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>
                  ИИ примеряет вещь…
                </div>
                <div style={{ marginTop: 4, fontSize: 13, color: 'rgba(255,255,255,.55)' }}>
                  ~20 секунд · {Math.round(progress)}%
                </div>
                <div style={{
                  marginTop: 18, width: '60%', height: 4, borderRadius: 4,
                  background: 'rgba(255,255,255,.1)', overflow: 'hidden'
                }}>
                  <div style={{
                    width: progress + '%', height: '100%', background: 'var(--accent)',
                    transition: 'width .15s'
                  }} />
                </div>
                {/* small status logs */}
                <div style={{ marginTop: 22, fontSize: 11.5, color: 'rgba(255,255,255,.4)',
                  fontFamily: 'ui-monospace, monospace', textAlign: 'center', lineHeight: 1.6 }}>
                  <div>→ анализ позы и пропорций</div>
                  <div>→ перенос ткани и теней</div>
                  <div style={{ opacity: progress > 70 ? 1 : 0.4 }}>→ финальный рендер</div>
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <PersonPhoto label="Результат" tagged tone="#EFE8DA" outfit={tryonOutfit} />
                {/* item label pinned on result */}
                <div className="tryon-result-card" style={{
                  position: 'absolute', bottom: 14, right: 14,
                  background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(6px)',
                  borderRadius: 12, padding: '8px 12px',
                  display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, background: item.tone,
                    display: 'grid', placeItems: 'center', fontSize: 14
                  }}>{item.emoji}</div>
                  <div style={{ fontSize: 12 }}>
                    <div style={{ fontWeight: 600, lineHeight: 1.2 }}>{item.name.split(' ').slice(0,3).join(' ')}</div>
                    <div style={{ color: 'var(--ink-3)' }}>{fmtPrice(item.price)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* right: details panel */}
        <div>
          <div style={{
            background: 'white', borderRadius: 22, padding: 22,
            border: '1px solid var(--line)'
          }} className="card-shadow">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 64, height: 64, borderRadius: 14, overflow: 'hidden' }}>
                <Garment item={item} size="sm" />
              </div>
              <div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{item.cat}</div>
                <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>{item.name}</div>
              </div>
            </div>

            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {fmtPrice(item.price)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--good)', marginBottom: 18 }}>
              ✓ В наличии · Lamoda
            </div>

            {/* size/color row */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Размер</div>
                <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 4 }}>
                  <SparkleIcon size={10} />
                  подобран по росту {height} см
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['XS','S','M','L','XL'].map(s => {
                  const selected = s === userSize;
                  return (
                    <button key={s} style={{
                      width: 40, height: 36, borderRadius: 8, position: 'relative',
                      border: '1px solid ' + (selected ? 'var(--accent)' : 'var(--line)'),
                      background: selected ? 'var(--accent)' : 'var(--surface)',
                      color: selected ? 'white' : 'var(--ink-2)',
                      fontSize: 13, fontWeight: 600,
                      transition: 'all .12s'
                    }}>
                      {s}
                      {selected && (
                        <span style={{
                          position: 'absolute', top: -4, right: -4,
                          width: 12, height: 12, borderRadius: '50%',
                          background: 'var(--accent)', color: 'white',
                          display: 'grid', placeItems: 'center',
                          border: '2px solid var(--surface)'
                        }}>
                          <CheckIcon size={6} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gap: 8, marginTop: 18 }}>
              <button className="btn btn-accent" onClick={() => onAdd(item)} disabled={loading}
                style={{ width: '100%', opacity: loading ? 0.4 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {inOutfit ? <><CheckIcon size={14} /> В образе</> : 'Добавить в образ'}
              </button>
              <button className="btn btn-ghost" onClick={() => setRegenKey(k => k + 1)} disabled={loading}
                style={{ width: '100%', opacity: loading ? 0.4 : 1 }}>
                <RefreshIcon size={14} />
                Перегенерировать
              </button>
              <button className="btn btn-soft" onClick={onBack} style={{ width: '100%' }}>
                Назад к каталогу
              </button>
            </div>

            {/* tiny footer details */}
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--line-2)',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12, color: 'var(--ink-2)' }}>
              <div>
                <div style={{ color: 'var(--ink-3)', marginBottom: 2 }}>Доставка</div>
                <div style={{ fontWeight: 500 }}>завтра, бесплатно</div>
              </div>
              <div>
                <div style={{ color: 'var(--ink-3)', marginBottom: 2 }}>Материал</div>
                <div style={{ fontWeight: 500 }}>хлопок 96%</div>
              </div>
            </div>
          </div>

          {/* AI confidence */}
          {!loading && (
            <div style={{
              marginTop: 12, background: 'var(--accent-soft)', borderRadius: 14,
              padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 10
            }}>
              <div style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>
                <SparkleIcon size={16} />
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--accent-deep)', lineHeight: 1.45 }}>
                <strong>Высокая точность · 94%</strong><br />
                Поза и&nbsp;пропорции хорошо подошли. Цвет может отличаться от&nbsp;реального ткани на&nbsp;3–5%.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

window.TryOnScreen = TryOnScreen;
