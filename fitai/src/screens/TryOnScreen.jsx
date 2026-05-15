import { useState, useEffect, useMemo } from 'react';
import { fmtPrice } from '../data/catalog';
import { PersonPhoto, Garment, SparkleIcon, ArrowLeft, CheckIcon, RefreshIcon, HeartIcon, BagIcon, ArrowRight } from '../components/UI';
import { api, pollTryOn } from '../lib/api';
import { useCart } from '../hooks/useCart';
import { withAffiliate } from '../lib/affiliate';

export const TryOnScreen = ({ item, onBack, onAdd, inOutfit, isFavorite, onToggleFavorite, userSize = 'M', height = 172, photo }) => {
  const { add: addToCart } = useCart();
  const openBuy = () => {
    if (!item.purchaseUrl) return;
    const url = withAffiliate(item.purchaseUrl, item.brand);
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [regenKey, setRegenKey] = useState(0);
  const [showSizeGrid, setShowSizeGrid] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [tryonErr, setTryonErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setProgress(0); setResultUrl(null); setTryonErr(null);

    let p = 0;
    const tick = setInterval(() => {
      p += 4 + Math.random() * 6;
      setProgress(Math.min(p, 98));
    }, 120);

    const run = async () => {
      if (!photo?.id) {
        await new Promise((r) => setTimeout(r, 2400));
        if (!cancelled) { setLoading(false); setProgress(100); }
        return;
      }
      try {
        const { jobId } = await api.createTryOn(photo.id, item.id, userSize);
        const job = await pollTryOn(jobId);
        if (cancelled) return;
        if (job.status === 'done') setResultUrl(job.resultUrl);
        else setTryonErr(job.error || 'Не удалось примерить');
      } catch (e) {
        if (!cancelled) setTryonErr(e.data?.error || e.message);
      } finally {
        if (!cancelled) { setLoading(false); setProgress(100); }
      }
    };
    run();

    return () => { cancelled = true; clearInterval(tick); };
  }, [item.id, regenKey, photo?.id, userSize]);

  const tryonOutfit = useMemo(() => {
    if (item.cat === 'Топы')           return { shirt: item.tone, pants: '#3A4A66', shoes: '#1B1B1F' };
    if (item.cat === 'Низ')            return { shirt: '#F4F1EA', pants: item.tone, shoes: '#1B1B1F' };
    if (item.cat === 'Обувь')          return { shirt: '#F4F1EA', pants: '#3A4A66', shoes: item.tone };
    if (item.cat === 'Верхняя одежда') return { shirt: item.tone, pants: '#3A4A66', shoes: '#1B1B1F' };
    return { shirt: '#F4F1EA', pants: '#3A4A66', shoes: '#1B1B1F' };
  }, [item]);

  return (
    <div className="screen page-pad" data-screen-label="04 Try-On"
      style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px' }}>
      <button onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-2)',
          fontSize: 13.5, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Назад к каталогу
      </button>

      <div className="grid-tryon" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 380px', gap: 20 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
            color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 10 }}>
            Оригинал
          </div>
          {photo?.url ? (
            <img src={photo.url} alt="Твоё фото"
              style={{ width: '100%', borderRadius: 18, display: 'block', aspectRatio: '3/4', objectFit: 'cover' }} />
          ) : (
            <PersonPhoto label="Твоё фото" tone="#EDE6D5"
              outfit={{ shirt: '#E8DFC9', pants: '#3A4A66', shoes: '#1B1B1F' }} />
          )}
        </div>

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
                <div style={{ marginTop: 22, fontSize: 11.5, color: 'rgba(255,255,255,.4)',
                  fontFamily: 'ui-monospace, monospace', textAlign: 'center', lineHeight: 1.6 }}>
                  <div>→ анализ позы и пропорций</div>
                  <div>→ перенос ткани и теней</div>
                  <div style={{ opacity: progress > 70 ? 1 : 0.4 }}>→ финальный рендер</div>
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                {tryonErr ? (
                  <div style={{ aspectRatio: '3/4', borderRadius: 18, display: 'grid', placeItems: 'center',
                    background: 'var(--warm)', border: '1px solid var(--line)', color: '#dc2626',
                    padding: 24, textAlign: 'center', fontSize: 14 }}>
                    {tryonErr}
                  </div>
                ) : resultUrl ? (
                  <img src={resultUrl} alt="Результат примерки"
                    style={{ width: '100%', borderRadius: 18, display: 'block', aspectRatio: '3/4', objectFit: 'cover' }} />
                ) : (
                  <PersonPhoto label="Результат" tagged tone="#EFE8DA" outfit={tryonOutfit} />
                )}
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

        <div>
          <div style={{
            background: 'white', borderRadius: 22, padding: 22,
            border: '1px solid var(--line)'
          }} className="card-shadow">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 64, height: 64, borderRadius: 14, overflow: 'hidden' }}>
                <Garment item={item} size="sm" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{item.cat}</div>
                <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>{item.name}</div>
              </div>
              <button
                onClick={() => onToggleFavorite && onToggleFavorite(item.id)}
                className={isFavorite ? 'heart-pop' : ''}
                aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
                style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: isFavorite ? 'var(--accent)' : 'var(--warm)',
                  color: isFavorite ? 'white' : 'var(--ink-2)',
                  display: 'grid', placeItems: 'center', transition: 'all .15s'
                }}>
                <HeartIcon size={16} filled={isFavorite} />
              </button>
            </div>

            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {fmtPrice(item.price)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--good)', marginBottom: 18 }}>
              ✓ В наличии · Lamoda
            </div>

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
              <button onClick={() => setShowSizeGrid(s => !s)}
                style={{
                  marginTop: 10, fontSize: 12, color: 'var(--ink-2)',
                  display: 'flex', alignItems: 'center', gap: 6,
                  textDecoration: 'underline', textUnderlineOffset: 2
                }}>
                {showSizeGrid ? 'Скрыть' : 'Показать'} размерную сетку RU / EU / US / UK
              </button>
              {showSizeGrid && <SizeGrid userSize={userSize} category={item.cat} />}
            </div>

            <div style={{ display: 'grid', gap: 8, marginTop: 18 }}>
              <button className="btn btn-accent" onClick={() => addToCart(item, userSize, 1)} disabled={loading}
                style={{ width: '100%', opacity: loading ? 0.4 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                <BagIcon size={14} /> В корзину
              </button>
              {item.purchaseUrl && (
                <button className="btn btn-primary" onClick={openBuy} style={{ width: '100%' }}>
                  Купить{item.brand ? ` на ${item.brand}` : ''} <ArrowRight size={14} />
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => onAdd(item)} disabled={loading}
                style={{ width: '100%', opacity: loading ? 0.4 : 1 }}>
                {inOutfit ? <><CheckIcon size={14} /> В образе</> : 'Добавить в образ'}
              </button>
              {tryonErr && (
                <button className="btn btn-soft" onClick={() => setRegenKey(k => k + 1)} style={{ width: '100%' }}>
                  <RefreshIcon size={14} /> Повторить
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => setRegenKey(k => k + 1)} disabled={loading}
                style={{ width: '100%', opacity: loading ? 0.4 : 1 }}>
                <RefreshIcon size={14} />
                Перегенерировать
              </button>
              <button className="btn btn-soft" onClick={onBack} style={{ width: '100%' }}>
                Назад к каталогу
              </button>
            </div>

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

const SIZE_GRID = {
  top: [
    { ru: '40-42', eu: 'XS', us: 'XS / 2', uk: '6',  bust: '78-82',  waist: '60-64' },
    { ru: '44',    eu: 'S',  us: 'S / 4',  uk: '8',  bust: '84-88',  waist: '66-70' },
    { ru: '46',    eu: 'M',  us: 'M / 6',  uk: '10', bust: '90-94',  waist: '72-76' },
    { ru: '48',    eu: 'L',  us: 'L / 8',  uk: '12', bust: '96-100', waist: '78-82' },
    { ru: '50-52', eu: 'XL', us: 'XL / 10',uk: '14', bust: '102-108',waist: '84-92' },
  ],
  bottom: [
    { ru: '40-42', eu: 'XS', us: '24-25', uk: '6',  hips: '84-88',   waist: '60-64' },
    { ru: '44',    eu: 'S',  us: '26-27', uk: '8',  hips: '90-94',   waist: '66-70' },
    { ru: '46',    eu: 'M',  us: '28-29', uk: '10', hips: '96-100',  waist: '72-76' },
    { ru: '48',    eu: 'L',  us: '30-31', uk: '12', hips: '102-106', waist: '78-82' },
    { ru: '50-52', eu: 'XL', us: '32-33', uk: '14', hips: '108-114', waist: '84-92' },
  ],
  shoe: [
    { ru: '36', eu: '36', us: '5.5', uk: '3.5', cm: '23.0' },
    { ru: '37', eu: '37', us: '6.5', uk: '4.5', cm: '23.5' },
    { ru: '38', eu: '38', us: '7.5', uk: '5.5', cm: '24.5' },
    { ru: '39', eu: '39', us: '8.5', uk: '6.5', cm: '25.0' },
    { ru: '40', eu: '40', us: '9.5', uk: '7.5', cm: '25.5' },
    { ru: '41', eu: '41', us: '10.5',uk: '8.5', cm: '26.5' },
  ],
};

const SizeGrid = ({ userSize, category }) => {
  const isShoe = category === 'Обувь';
  const isBottom = category === 'Низ';
  const rows = isShoe ? SIZE_GRID.shoe : (isBottom ? SIZE_GRID.bottom : SIZE_GRID.top);
  const cols = isShoe
    ? [{ k: 'ru', l: 'RU' }, { k: 'eu', l: 'EU' }, { k: 'us', l: 'US' }, { k: 'uk', l: 'UK' }, { k: 'cm', l: 'Стопа, см' }]
    : isBottom
      ? [{ k: 'ru', l: 'RU' }, { k: 'eu', l: 'EU' }, { k: 'us', l: 'US' }, { k: 'uk', l: 'UK' }, { k: 'waist', l: 'Талия' }, { k: 'hips', l: 'Бёдра' }]
      : [{ k: 'ru', l: 'RU' }, { k: 'eu', l: 'EU' }, { k: 'us', l: 'US' }, { k: 'uk', l: 'UK' }, { k: 'bust', l: 'Грудь' }, { k: 'waist', l: 'Талия' }];

  return (
    <div style={{
      marginTop: 12, border: '1px solid var(--line)', borderRadius: 12,
      overflow: 'hidden', background: 'var(--surface)',
      animation: 'fadeIn .2s ease both'
    }}>
      <div style={{
        padding: '10px 12px', borderBottom: '1px solid var(--line-2)',
        fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
        color: 'var(--ink-3)', textTransform: 'uppercase',
        background: 'var(--warm)'
      }}>
        {isShoe ? 'Обувь' : isBottom ? 'Низ (см)' : 'Верх (см)'}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse',
          fontSize: 12, fontVariantNumeric: 'tabular-nums',
          color: 'var(--ink)'
        }}>
          <thead>
            <tr style={{ background: 'var(--warm)' }}>
              {cols.map(c => (
                <th key={c.k} style={{
                  padding: '8px 10px', textAlign: 'left', fontWeight: 600,
                  color: 'var(--ink-3)', fontSize: 11, letterSpacing: '0.04em',
                  textTransform: 'uppercase', borderBottom: '1px solid var(--line-2)'
                }}>
                  {c.l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const matches = r.eu === userSize;
              return (
                <tr key={r.ru} style={{
                  background: matches ? 'var(--accent-soft)' : 'transparent',
                  fontWeight: matches ? 600 : 500,
                  color: matches ? 'var(--accent-deep)' : 'var(--ink)'
                }}>
                  {cols.map(c => (
                    <td key={c.k} style={{
                      padding: '9px 10px',
                      borderBottom: '1px solid var(--line-2)'
                    }}>
                      {r[c.k]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{
        padding: '10px 12px', fontSize: 11, color: 'var(--ink-3)',
        background: 'var(--warm)', borderTop: '1px solid var(--line-2)'
      }}>
        Размер по нашей рекомендации подсвечен. Замерь обхваты сантиметром по самому широкому месту.
      </div>
    </div>
  );
};
