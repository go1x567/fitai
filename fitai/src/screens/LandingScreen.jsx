import { CATALOG } from '../data/catalog';
import { Silhouette, SparkleIcon, UploadIcon, CheckIcon, ArrowRight, Garment, Logo } from '../components/UI';

export const LandingScreen = ({ onStart, onHow }) => {
  return (
    <div className="screen" data-screen-label="01 Landing">
      <section className="page-pad page-pad-y" style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px 40px' }}>
        <div className="grid-hero" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 999, background: 'var(--accent-soft)',
              color: 'var(--accent-deep)', fontSize: 12.5, fontWeight: 600, letterSpacing: '0.01em',
              marginBottom: 28
            }}>
              <SparkleIcon size={13} />
              ИИ-примерочная · бета
            </div>

            <h1 className="h-mega" style={{
              fontSize: 92, lineHeight: 0.96, letterSpacing: '-0.045em',
              fontWeight: 700, margin: 0, color: 'var(--ink)'
            }}>
              Примерь<br />
              <span className="serif h-mega-serif" style={{ fontSize: 96 }}>до&nbsp;покупки</span>
            </h1>

            <p style={{
              marginTop: 28, fontSize: 19, lineHeight: 1.5, color: 'var(--ink-2)', maxWidth: 480
            }}>
              Загрузи фото — ИИ покажет, как вещь будет смотреться на&nbsp;тебе.
              Без примерочных, без возвратов, без сомнений.
            </p>

            <div className="cta-row" style={{ marginTop: 36, display: 'flex', gap: 12, alignItems: 'center' }}>
              <button className="btn btn-accent" onClick={onStart} style={{ height: 58, padding: '0 28px', fontSize: 16 }}>
                Попробовать бесплатно
                <ArrowRight size={17} />
              </button>
              <button onClick={onHow} className="btn btn-ghost" style={{ height: 58 }}>
                Как это работает
              </button>
            </div>

            <div className="hero-stats" style={{ marginTop: 44, display: 'flex', alignItems: 'center', gap: 20, color: 'var(--ink-3)', fontSize: 13 }}>
              <div style={{ display: 'flex' }}>
                {['#F4D8C4','#C8AE8F','#A07A5C','#E0BFA0'].map((c,i) => (
                  <div key={i} style={{
                    width: 28, height: 28, borderRadius: '50%', background: c,
                    border: '2px solid var(--bg)', marginLeft: i ? -10 : 0
                  }} />
                ))}
              </div>
              <span>12&nbsp;400+ примерок за&nbsp;неделю</span>
              <span style={{ width: 4, height: 4, borderRadius: 2, background: 'var(--ink-3)' }} />
              <span>4.8★ из 1 240 отзывов</span>
            </div>
          </div>

          <div className="hero-visual" style={{ position: 'relative', height: 620 }}>
            <HeroVisual />
          </div>
        </div>
      </section>

      <section id="how" className="page-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 72px' }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28
        }}>
          <h2 className="h-section" style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>
            Три шага до образа
          </h2>
          <span style={{ color: 'var(--ink-3)', fontSize: 14 }}>≈ 40 секунд</span>
        </div>
        <div className="grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          <FeatureCard idx="01" title="Загрузи фото"
            body="Селфи в полный рост — нейтральный фон, обычная одежда. Остальное сделает ИИ."
            visual={<UploadVisual />} />
          <FeatureCard idx="02" title="Выбери вещь"
            body="Каталог тысяч вещей от Lamoda, Wildberries и Ozon. Примеряй в любых сочетаниях."
            visual={<PickVisual />} accent />
          <FeatureCard idx="03" title="Смотри результат"
            body="ИИ соберёт фотореалистичный снимок за 20 секунд. Сохрани, поделись, докажи маме."
            visual={<ResultVisual />} />
        </div>
      </section>

      <BrandsSection />
      <PricingSection onStart={onStart} />
      <BusinessSection />

      <Footer />
    </div>
  );
};

const BRANDS = [
  { name: 'Lamoda',    accent: '#FF6900' },
  { name: 'Wildberries', accent: '#CB11AB' },
  { name: 'Ozon',      accent: '#005BFF' },
  { name: 'ASOS',      accent: '#000000' },
  { name: 'Zara',      accent: '#222222' },
  { name: 'H&M',       accent: '#E50010' },
  { name: 'Uniqlo',    accent: '#FF0000' },
  { name: 'Mango',     accent: '#000000' },
];

const BrandsSection = () => (
  <section id="brands" className="page-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 72px' }}>
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28
    }}>
      <h2 className="h-section" style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>
        Бренды и&nbsp;<span className="serif" style={{ fontSize: 36 }}>магазины</span>
      </h2>
      <span style={{ color: 'var(--ink-3)', fontSize: 14 }}>120+ партнёров</span>
    </div>
    <p style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--ink-2)', maxWidth: 640, margin: '0 0 28px' }}>
      Каталог обновляется ежедневно. Покупка идёт напрямую у&nbsp;партнёра — мы&nbsp;только&nbsp;примеряем.
    </p>
    <div className="grid-brands" style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14
    }}>
      {BRANDS.map(b => (
        <div key={b.name} style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 16, padding: '28px 18px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'transform .15s, border-color .15s'
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = b.accent; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--line)'; }}
        >
          <div style={{
            width: 12, height: 12, borderRadius: 3, background: b.accent, flexShrink: 0
          }} />
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            {b.name}
          </span>
        </div>
      ))}
    </div>
  </section>
);

const PRICING = [
  {
    id: 'free', label: 'Free', price: '0 ₽', period: 'навсегда',
    desc: 'Попробуй ИИ-примерку без обязательств',
    features: ['5 примерок в месяц', 'Базовое качество', 'История 7 дней', 'Каталог партнёров'],
    cta: 'Начать бесплатно',
  },
  {
    id: 'pro', label: 'Pro', price: '299 ₽', period: 'в месяц',
    desc: 'Для тех, кто покупает онлайн часто',
    features: ['Безлимит примерок', 'HD-результат', 'История без ограничений', 'Сохранение образов', 'Приоритетная генерация'],
    cta: 'Оформить Pro',
    featured: true,
  },
  {
    id: 'biz', label: 'Business', price: 'По запросу', period: 'для магазинов',
    desc: 'API + white-label виджет в вашу витрину',
    features: ['Интеграция через API', 'White-label виджет', 'Аналитика и метрики', 'Поддержка 24/7', 'SLA 99.9%'],
    cta: 'Связаться с продажами',
  },
];

const PricingSection = ({ onStart }) => (
  <section id="pricing" className="page-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 72px' }}>
    <div style={{ textAlign: 'center', marginBottom: 36 }}>
      <h2 className="h-section" style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
        Простая <span className="serif" style={{ fontSize: 36 }}>цена</span>
      </h2>
      <p style={{ fontSize: 16, color: 'var(--ink-2)', margin: 0 }}>
        Начни бесплатно. Оплати только когда захочется большего.
      </p>
    </div>
    <div className="grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
      {PRICING.map(p => (
        <div key={p.id} style={{
          background: p.featured ? 'var(--solid)' : 'var(--surface)',
          color: p.featured ? 'var(--on-solid)' : 'var(--ink)',
          border: '1px solid ' + (p.featured ? 'var(--solid)' : 'var(--line)'),
          borderRadius: 22, padding: 28,
          position: 'relative',
          transform: p.featured ? 'translateY(-6px)' : 'none',
          boxShadow: p.featured ? '0 24px 48px -20px rgba(14,14,16,.45)' : 'none'
        }}>
          {p.featured && (
            <div style={{
              position: 'absolute', top: -10, right: 18,
              background: 'var(--accent)', color: 'white',
              padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.04em', textTransform: 'uppercase'
            }}>
              Популярно
            </div>
          )}
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.04em',
            opacity: p.featured ? 0.6 : 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
            {p.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em' }}>{p.price}</span>
            <span style={{ fontSize: 13, opacity: 0.6 }}>{p.period}</span>
          </div>
          <p style={{ fontSize: 14, opacity: 0.7, lineHeight: 1.45, margin: '0 0 22px' }}>
            {p.desc}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'grid', gap: 10 }}>
            {p.features.map(f => (
              <li key={f} style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  background: p.featured ? 'var(--accent)' : 'var(--accent-soft)',
                  color: p.featured ? 'white' : 'var(--accent)',
                  display: 'grid', placeItems: 'center'
                }}>
                  <CheckIcon size={11} />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={p.id === 'free' ? onStart : undefined}
            className={p.featured ? 'btn btn-accent' : 'btn btn-ghost'}
            style={{ width: '100%', height: 48,
              background: p.featured ? 'var(--accent)' : (p.id === 'free' ? 'var(--bg)' : 'transparent'),
              borderColor: p.featured ? 'var(--accent)' : 'var(--line)',
              color: p.featured ? 'white' : 'var(--ink)' }}>
            {p.cta}
          </button>
        </div>
      ))}
    </div>
  </section>
);

const BusinessSection = () => (
  <section id="business" className="page-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 72px' }}>
    <div style={{
      background: 'linear-gradient(135deg, var(--accent-soft) 0%, var(--warm) 100%)',
      borderRadius: 28, padding: '56px 48px',
      display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center',
      border: '1px solid var(--line)'
    }} className="biz-card">
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999, background: 'var(--bg)',
          color: 'var(--accent-deep)', fontSize: 12.5, fontWeight: 600,
          marginBottom: 20 }}>
          <SparkleIcon size={13} /> Для магазинов
        </div>
        <h2 className="h-section biz-title" style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.035em',
          lineHeight: 1.05, margin: '0 0 14px', color: 'var(--ink)' }}>
          Меньше возвратов.<br/>
          <span className="serif biz-title-serif" style={{ fontSize: 42 }}>больше конверсии.</span>
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--ink-2)',
          maxWidth: 480, margin: '0 0 28px' }}>
          Встрой FitAI в&nbsp;карточку товара через JS-сниппет или API.
          Покупатель примеряет — ты&nbsp;продаёшь.
        </p>
        <div className="biz-cta" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ height: 52 }}>
            Подключить магазин <ArrowRight size={15} />
          </button>
          <button className="btn btn-ghost" style={{ height: 52, background: 'var(--bg)' }}>
            Документация API
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 14 }}>
        {[
          { kpi: '−42%', label: 'возвратов', sub: 'покупатели берут сразу нужный размер' },
          { kpi: '+28%', label: 'конверсия', sub: 'примерка снимает сомнения "подойдёт ли"' },
          { kpi: '<200мс', label: 'нагрузка', sub: 'асинхронный виджет, не тормозит сайт' },
        ].map(s => (
          <div key={s.label} className="biz-kpi" style={{
            background: 'var(--bg)', border: '1px solid var(--line)',
            borderRadius: 14, padding: '16px 20px',
            display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'center', gap: 16
          }}>
            <div className="biz-kpi-num" style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em',
              color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
              {s.kpi}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeatureCard = ({ idx, title, body, visual, accent }) => (
  <div style={{
    background: accent ? 'var(--solid)' : 'var(--surface)',
    color: accent ? 'var(--on-solid)' : 'var(--ink)',
    border: '1px solid ' + (accent ? 'var(--solid)' : 'var(--line)'),
    borderRadius: 22, padding: 22, transition: 'transform .2s ease, box-shadow .2s ease',
    cursor: 'default'
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{ height: 220, borderRadius: 14, overflow: 'hidden', marginBottom: 18 }}>
      {visual}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: 12, fontWeight: 600, opacity: accent ? 0.6 : 0.4, letterSpacing: '0.04em' }}>
        {idx}
      </span>
      <span style={{ fontSize: 12, opacity: accent ? 0.6 : 0.4 }}>—</span>
    </div>
    <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', margin: '6px 0 8px' }}>{title}</h3>
    <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: accent ? 'color-mix(in srgb, var(--on-solid) 70%, transparent)' : 'var(--ink-2)' }}>{body}</p>
  </div>
);

const HeroVisual = () => (
  <div style={{ position: 'relative', height: '100%' }}>
    <div style={{
      position: 'absolute', top: 0, left: '8%', right: '8%', bottom: 0,
      borderRadius: 24, overflow: 'hidden',
      background: 'linear-gradient(180deg,#F0E3CC 0%,#D9C2A0 100%)',
      boxShadow: '0 30px 60px -30px rgba(80,50,20,.4)'
    }}>
      <div style={{ position: 'absolute', inset: '4% 18% 0 18%' }}>
        <Silhouette shirt="#E8C9AC" pants="#8B5E3C" accent="#A07A5C" />
      </div>
      <div style={{
        position: 'absolute', bottom: 20, left: 20, right: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: 12, color: 'rgba(14,14,16,.55)', fontWeight: 500 }}>2026 · ОБРАЗ</span>
        <span className="serif" style={{ fontSize: 28, color: 'var(--ink)' }}>осенний</span>
      </div>
    </div>
    <div style={{
      position: 'absolute', top: 30, right: -10, width: 140,
      background: 'white', borderRadius: 14, padding: 8,
      boxShadow: '0 18px 36px -16px rgba(14,14,16,.25)', transform: 'rotate(4deg)'
    }}>
      <div style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: '3/4',
        background: 'linear-gradient(180deg,#EDE8DC,#D8D2C2)' }}>
        <div style={{ padding: '6% 18%' }}>
          <Silhouette shirt="#FFFFFF" pants="#3A4A66" accent="#D5CFC0" />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 4px 2px', fontSize: 10, color: 'var(--ink-3)' }}>
        <span>До</span>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Оригинал</span>
      </div>
    </div>
    <div style={{
      position: 'absolute', bottom: 70, left: -16,
      background: 'white', borderRadius: 14, padding: '12px 14px',
      boxShadow: '0 18px 36px -16px rgba(14,14,16,.25)', transform: 'rotate(-3deg)',
      display: 'flex', alignItems: 'center', gap: 10, maxWidth: 200
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)',
        color: 'var(--accent)', display: 'grid', placeItems: 'center'
      }}>
        <SparkleIcon size={18} />
      </div>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>Образ собран</div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>≈ 12 490 ₽ · 3 вещи</div>
      </div>
    </div>
    <div style={{
      position: 'absolute', top: 240, left: -28,
      background: 'var(--ink)', color: 'white',
      borderRadius: 999, padding: '8px 12px', fontSize: 11.5, fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 6, transform: 'rotate(-6deg)'
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: '#7CFFB8' }} className="pulse" />
      Генерация · 18 сек
    </div>
  </div>
);

const UploadVisual = () => (
  <div style={{ height: '100%', background: 'var(--warm)', position: 'relative',
    display: 'grid', placeItems: 'center', borderRadius: 14 }}>
    <div style={{
      width: '70%', height: '78%', border: '1.5px dashed var(--ink-3)',
      borderRadius: 12, display: 'grid', placeItems: 'center', position: 'relative'
    }}>
      <div style={{ textAlign: 'center', color: 'var(--ink-2)' }}>
        <div style={{
          width: 44, height: 44, margin: '0 auto 8px', background: 'white',
          borderRadius: 12, display: 'grid', placeItems: 'center'
        }}>
          <UploadIcon size={20} />
        </div>
        <div style={{ fontSize: 12, fontWeight: 500 }}>фото.jpg</div>
        <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>4,2 MB</div>
      </div>
    </div>
  </div>
);

const PickVisual = () => {
  const items = [CATALOG[0], CATALOG[3], CATALOG[6]];
  return (
    <div style={{ height: '100%', background: '#1c1c20', padding: 14, display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, borderRadius: 14 }}>
      {items.map((it, i) => (
        <div key={it.id} style={{ position: 'relative' }}>
          <Garment item={it} size="sm" />
          {i === 1 && (
            <div style={{
              position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%',
              background: 'var(--accent)', color: 'white', display: 'grid', placeItems: 'center'
            }}>
              <CheckIcon size={12} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ResultVisual = () => (
  <div style={{ height: '100%', background: 'linear-gradient(180deg,#F0E3CC,#D9C2A0)',
    position: 'relative', borderRadius: 14, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: '5% 22% 0 22%' }}>
      <Silhouette shirt="#F4EFE5" pants="#3A4A66" accent="#D9CFB9" />
    </div>
    <div style={{
      position: 'absolute', bottom: 12, left: 12, right: 12, padding: '10px 12px',
      background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(6px)',
      borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Свитер оверсайз</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>4 290 ₽</div>
      </div>
      <button className="btn btn-accent" style={{ height: 30, padding: '0 12px', fontSize: 12 }}>
        Купить
      </button>
    </div>
  </div>
);

const Footer = () => (
  <footer style={{ borderTop: '1px solid var(--line-2)', marginTop: 40 }}>
    <div className="footer-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      color: 'var(--ink-3)', fontSize: 13 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Logo />
        <span>© 2026 · Москва</span>
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Конфиденциальность</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Партнёрам</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Поддержка</a>
      </div>
    </div>
  </footer>
);
