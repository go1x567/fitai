import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { fmtPrice } from '../data/catalog';
import { useCatalog } from '../hooks/useCatalog';
import { PersonPhoto, Garment, SparkleIcon, ArrowRight, ShareIcon, PlusIcon, RefreshIcon } from '../components/UI';
import { api } from '../lib/api';

export const OutfitScreen = ({ outfit, outfitId, onRemove, onContinue, onTryOn, onSaveAs, onViewSaved }) => {
  const [sharing, setSharing] = useState(false);
  const share = async () => {
    if (!outfitId) {
      toast.error('Сначала сохрани образ');
      return;
    }
    setSharing(true);
    try {
      const { token } = await api.shareOutfit(outfitId);
      const url = `${window.location.origin}/#/o/${token}`;
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Ссылка скопирована');
      } catch {
        toast.success(`Ссылка: ${url}`);
      }
    } catch { /* toasted */ } finally {
      setSharing(false);
    }
  };
  const { items: CATALOG } = useCatalog();
  const items = outfit.map(id => CATALOG.find(c => c.id === id)).filter(Boolean);
  const total = items.reduce((s, i) => s + i.price, 0);

  const fullOutfit = useMemo(() => {
    const o = { shirt: '#F4F1EA', pants: '#3A4A66', shoes: '#1B1B1F' };
    items.forEach(i => {
      if (i.cat === 'Топы' || i.cat === 'Верхняя одежда') o.shirt = i.tone;
      if (i.cat === 'Низ') o.pants = i.tone;
      if (i.cat === 'Обувь') o.shoes = i.tone;
    });
    return o;
  }, [outfit, items]);

  return (
    <div className="screen page-pad" data-screen-label="05 Outfit"
      style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 100px' }}>
      <div className="outfit-header" style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 32, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
            color: 'var(--ink-3)', textTransform: 'uppercase' }}>Шаг 3 из 3</div>
          <h1 className="h-large" style={{ fontSize: 56, lineHeight: 1.02, letterSpacing: '-0.04em',
            fontWeight: 700, margin: '8px 0 0' }}>
            Мой <span className="serif h-large-serif" style={{ fontSize: 60 }}>образ</span>
          </h1>
          <p style={{ marginTop: 10, fontSize: 16, color: 'var(--ink-2)', maxWidth: 480 }}>
            {items.length} {pluralize(items.length, ['вещь','вещи','вещей'])} собрано.
            Купи всё в&nbsp;один клик или поделись готовым луком.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {onViewSaved && (
            <button className="btn btn-ghost" onClick={onViewSaved}>
              Сохранённые
            </button>
          )}
          {items.length > 0 && outfitId && (
            <button className="btn btn-ghost" onClick={share} disabled={sharing}>
              <ShareIcon size={14} /> {sharing ? 'Готовлю…' : 'Поделиться'}
            </button>
          )}
          {onSaveAs && items.length > 0 && (
            <button className="btn btn-ghost" onClick={async () => {
              const name = window.prompt('Название образа', 'Мой образ');
              if (name !== null) await onSaveAs(name.trim() || 'Образ');
            }}>
              Сохранить как новый
            </button>
          )}
          <button className="btn btn-primary" onClick={onContinue}>
            <PlusIcon size={15} /> Добавить ещё вещи
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyOutfit onContinue={onContinue} />
      ) : (
        <div className="grid-outfit" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 28, alignItems: 'start' }}>
          <div style={{
            background: 'white', borderRadius: 22, padding: 18,
            border: '1px solid var(--line)', position: 'sticky', top: 92
          }} className="card-shadow">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
                color: 'var(--accent)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                <SparkleIcon size={12} /> Полный лук
              </div>
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>сгенерировано ИИ</span>
            </div>
            <PersonPhoto label="Образ собран" tagged tone="#EFE8DA" outfit={fullOutfit} />

            <div style={{
              marginTop: 16, padding: '14px 16px',
              borderRadius: 14, background: 'var(--solid)', color: 'var(--on-solid)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: 11.5, opacity: .55 }}>Итого ≈</div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{fmtPrice(total)}</div>
              </div>
              <button style={{
                background: 'var(--bg)', color: 'var(--ink)', height: 42, padding: '0 16px',
                borderRadius: 999, fontWeight: 600, fontSize: 13.5,
                display: 'flex', alignItems: 'center', gap: 6
              }}>
                Купить всё <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--ink-3)', textAlign: 'center' }}>
              Цена ориентировочная — финал на&nbsp;Lamoda
            </div>
          </div>

          <div>
            <div style={{ display: 'grid', gap: 14 }}>
              {items.map((item, i) => (
                <OutfitRow key={item.id} item={item} idx={i + 1}
                  onRemove={() => onRemove(item.id)} onTryOn={() => onTryOn(item)} />
              ))}
            </div>

            <button onClick={onContinue}
              style={{
                marginTop: 14, width: '100%', padding: '18px',
                border: '1.5px dashed var(--line)', borderRadius: 14,
                background: 'transparent', color: 'var(--ink-2)',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all .15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.color = 'var(--ink)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--ink-2)'; }}
            >
              <PlusIcon size={15} /> Добавить ещё вещи из&nbsp;каталога
            </button>

            <div className="grid-stats" style={{
              marginTop: 22, padding: 22, borderRadius: 18,
              background: 'var(--warm)', display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)', gap: 24
            }}>
              <Stat label="Сэкономлено" value="≈ 1 800 ₽" sub="vs покупки наугад" />
              <Stat label="Возвратов" value="0%" sub="в твоей истории" />
              <Stat label="Углерод" value="−3,2 кг CO₂" sub="без примерки в магазине" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OutfitRow = ({ item, idx, onRemove, onTryOn }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="grid-outfit-row"
      style={{
        background: 'white', border: '1px solid var(--line)',
        borderRadius: 18, padding: 14, display: 'grid',
        gridTemplateColumns: '88px 110px 1fr auto', gap: 18, alignItems: 'center',
        transition: 'border-color .15s, transform .15s',
        borderColor: hover ? 'var(--ink)' : 'var(--line)'
      }}>
      <div style={{ borderRadius: 12, overflow: 'hidden' }}>
        <Garment item={item} size="sm" />
      </div>
      <div className="tryon-thumb" style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '3/4' }}>
        <PersonPhoto label="на тебе" tone="#EFE8DA"
          outfit={{
            shirt: (item.cat === 'Топы' || item.cat === 'Верхняя одежда') ? item.tone : '#EDE6D5',
            pants: item.cat === 'Низ' ? item.tone : '#2E2E33',
            shoes: item.cat === 'Обувь' ? item.tone : '#1B1B1F'
          }} />
      </div>
      <div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginBottom: 3 }}>
          {String(idx).padStart(2, '0')} · {item.cat}
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>
          {item.name}
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{fmtPrice(item.price)}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="chip" style={{ height: 26, fontSize: 11.5, pointerEvents: 'none' }}>размер M</span>
          <span className="chip" style={{ height: 26, fontSize: 11.5, pointerEvents: 'none' }}>в наличии</span>
        </div>
      </div>
      <div className="row-actions" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
        <button style={{
          height: 42, padding: '0 16px', borderRadius: 999,
          background: 'var(--lamoda)', color: 'white',
          fontSize: 13.5, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: hover ? '0 10px 22px -10px rgba(255,105,0,.55)' : 'none',
          transition: 'box-shadow .15s'
        }}>
          <span className="row-buy-text">Купить на Lamoda</span>
          <span className="row-buy-short">Lamoda</span>
          <ArrowRight size={13} />
        </button>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={onTryOn} className="chip" style={{ height: 30, fontSize: 11.5 }}>
            <RefreshIcon size={11} /> примерить ещё раз
          </button>
          <button onClick={onRemove} className="chip" style={{ height: 30, fontSize: 11.5,
            color: '#B43D3D', borderColor: 'var(--line)' }}>
            Убрать
          </button>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, sub }) => (
  <div>
    <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.04em',
      textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 4 }}>{value}</div>
    <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2 }}>{sub}</div>
  </div>
);

const EmptyOutfit = ({ onContinue }) => (
  <div style={{
    background: 'var(--warm)', borderRadius: 22, padding: '80px 40px',
    textAlign: 'center', border: '1px solid var(--line)'
  }}>
    <div style={{ fontSize: 60, marginBottom: 12 }}>🧥</div>
    <h3 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
      В образе пока пусто
    </h3>
    <p style={{ fontSize: 15, color: 'var(--ink-2)', margin: '0 0 24px' }}>
      Открой каталог и&nbsp;примерь первую вещь — её можно будет добавить сюда.
    </p>
    <button className="btn btn-accent" onClick={onContinue}>
      Открыть каталог <ArrowRight size={15} />
    </button>
  </div>
);

function pluralize(n, [one, few, many]) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
