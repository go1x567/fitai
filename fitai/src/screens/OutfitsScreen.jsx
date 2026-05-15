import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useCatalog } from '../hooks/useCatalog';
import { ArrowLeft } from '../components/UI';

export const OutfitsScreen = ({ onBack, onLoad }) => {
  const { items } = useCatalog();
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.listOutfits().then(r => setOutfits(r.outfits ?? [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    await api.deleteOutfit(id).catch(() => {});
    load();
  };

  return (
    <div className="screen page-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px' }}>
      <button onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-2)', fontSize: 13.5, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Назад
      </button>
      <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.035em', margin: '0 0 24px' }}>
        Сохранённые образы
      </h1>

      {loading ? (
        <div style={{ color: 'var(--ink-3)' }}>Загружаем…</div>
      ) : outfits.length === 0 ? (
        <div style={{
          background: 'var(--warm)', borderRadius: 22, padding: '64px 28px',
          textAlign: 'center', border: '1px solid var(--line)'
        }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>👗</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Образы не сохранены</div>
          <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 4 }}>
            Собери образ в каталоге и нажми «Сохранить как новый».
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {outfits.map(o => {
            const its = o.itemIds.map(id => items.find(i => i.id === id)).filter(Boolean);
            return (
              <div key={o.id} style={{
                borderRadius: 18, padding: 18, background: 'var(--surface)',
                border: '1px solid var(--line)',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{o.name || 'Образ'}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                      {new Date(o.createdAt).toLocaleDateString('ru-RU')} · {its.length} вещей
                    </div>
                  </div>
                  <button onClick={() => remove(o.id)}
                    style={{ fontSize: 12, color: 'var(--ink-3)' }}>удалить</button>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {its.map(it => (
                    <div key={it.id} style={{
                      width: 40, height: 40, borderRadius: 10, background: it.tone,
                      display: 'grid', placeItems: 'center', fontSize: 18,
                    }}>{it.emoji}</div>
                  ))}
                </div>
                <button onClick={() => onLoad(o)} className="btn btn-soft" style={{ height: 38 }}>
                  Загрузить
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
