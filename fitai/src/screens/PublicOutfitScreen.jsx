import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { fmtPrice } from '../data/catalog';
import { Garment, ArrowRight, SparkleIcon, Logo } from '../components/UI';
import { withAffiliate } from '../lib/affiliate';
import { CardSkeleton } from '../components/Skeleton';

export const PublicOutfitScreen = ({ token, onHome }) => {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getPublicOutfit(token)
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setErr(e.data?.error === 'not_found' ? 'Образ не найден или его перестали показывать' : (e.message || 'Не удалось загрузить')); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token]);

  const total = (data?.items || []).reduce((s, i) => s + i.price, 0);

  const buy = (item) => {
    if (!item.purchaseUrl) return;
    window.open(withAffiliate(item.purchaseUrl, item.brand), '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <header style={{ padding: '18px 32px', borderBottom: '1px solid var(--line-2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo onClick={onHome} />
          <button className="btn btn-primary" onClick={onHome} style={{ height: 38 }}>Открыть FitAI</button>
        </div>
      </header>
      <div className="screen page-pad" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px 80px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--ink-3)', textTransform: 'uppercase' }}>
          Поделённый образ
        </div>
        <h1 style={{ fontSize: 44, lineHeight: 1.04, letterSpacing: '-0.035em', fontWeight: 700, margin: '8px 0 24px' }}>
          {data?.outfit?.name || 'Образ'}
        </h1>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : err ? (
          <div style={{ background: 'var(--warm)', borderRadius: 18, padding: 32, textAlign: 'center', color: 'var(--ink-2)' }}>
            {err}
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {data.items.map((it) => (
                <div key={it.id} style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 16, padding: 12 }}>
                  <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 10 }}>
                    <Garment item={it} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{it.brand ? `${it.brand} · ` : ''}{it.cat}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, margin: '4px 0 6px' }}>{it.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{fmtPrice(it.price)}</span>
                    {it.purchaseUrl && (
                      <button onClick={() => buy(it)} className="chip" style={{ height: 30, fontSize: 12 }}>
                        Купить <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 24, padding: 20, borderRadius: 18,
              background: 'var(--solid)', color: 'var(--on-solid)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ fontSize: 11.5, opacity: .6 }}>Итого ≈</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{fmtPrice(total)}</div>
              </div>
              <button className="btn" onClick={onHome} style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
                <SparkleIcon size={14} /> Примерить на себе
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
