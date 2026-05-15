import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { fmtPrice } from '../data/catalog';
import { ArrowLeft } from '../components/UI';

export const TryOnsScreen = ({ onBack }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listTryOns().then(r => setJobs(r.jobs ?? [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="screen page-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px' }}>
      <button onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-2)', fontSize: 13.5, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Назад
      </button>
      <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.035em', margin: '0 0 24px' }}>
        Мои примерки
      </h1>

      {loading ? (
        <div style={{ color: 'var(--ink-3)' }}>Загружаем…</div>
      ) : jobs.length === 0 ? (
        <div style={{
          background: 'var(--warm)', borderRadius: 22, padding: '64px 28px',
          textAlign: 'center', border: '1px solid var(--line)'
        }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🪞</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Пока ничего не примерял</div>
          <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 4 }}>
            Зайди в каталог и попробуй вещь — она появится здесь.
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {jobs.map(j => (
            <div key={j.id} style={{ borderRadius: 16, overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--line)' }}>
              <div style={{ aspectRatio: '3/4', background: 'var(--warm)', position: 'relative' }}>
                {j.resultUrl ? (
                  <img src={j.resultUrl} alt={j.catalogItem?.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'grid', placeItems: 'center', height: '100%',
                    fontSize: 12, color: 'var(--ink-3)' }}>
                    {j.status === 'failed' ? `Ошибка: ${j.error ?? ''}` : j.status}
                  </div>
                )}
                <div style={{
                  position: 'absolute', top: 8, left: 8,
                  background: 'rgba(255,255,255,.92)', borderRadius: 999,
                  padding: '4px 10px', fontSize: 11, fontWeight: 600,
                }}>
                  {new Date(j.createdAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{j.catalogItem?.cat}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2, lineHeight: 1.3 }}>
                  {j.catalogItem?.name}
                </div>
                {j.catalogItem?.price && (
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>
                    {fmtPrice(j.catalogItem.price)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
