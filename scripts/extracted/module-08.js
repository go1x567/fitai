// === Screen: Landing ===
const LandingScreen = ({ onStart }) => {
  return (
    <div className="screen" data-screen-label="01 Landing">
      <section className="page-pad page-pad-y" style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px 40px' }}>
        <div className="grid-hero" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 64, alignItems: 'center' }}>
          {/* Left: copy */}
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
              <button className="btn btn-ghost" style={{ height: 58 }}>
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

          {/* Right: hero visual */}
          <div className="hero-visual" style={{ position: 'relative', height: 620 }}>
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* 3 feature cards */}
      <section className="page-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 72px' }}>
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

      <Footer />
    </div>
  );
};

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
    {/* main photo */}
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
    {/* before/after thumbnail */}
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
    {/* sparkle badge */}
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
    {/* small chip */}
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

window.LandingScreen = LandingScreen;
