// === App: nav + state ===
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "warm",
  "accent": "#7C3AED"
}/*EDITMODE-END*/;

const THEME_OPTIONS = [
  { id: 'warm',  label: 'Warm',  swatch: '#FBFAF7' },
  { id: 'mono',  label: 'Mono',  swatch: '#FFFFFF' },
  { id: 'dark',  label: 'Dark',  swatch: '#0C0C0E' },
  { id: 'berry', label: 'Berry', swatch: '#FBF1ED' },
];

const ACCENTS = {
  '#7C3AED': { deep: '#5B21B6', soft: '#F1ECFE' },  // purple
  '#E11D48': { deep: '#9F1239', soft: '#FFE4E9' },  // crimson
  '#F97316': { deep: '#C2410C', soft: '#FFEDD5' },  // orange
  '#0EA5E9': { deep: '#0369A1', soft: '#E0F2FE' },  // sky
  '#16A34A': { deep: '#15803D', soft: '#DCFCE7' },  // green
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useState('landing');
  const [photo, setPhoto] = useState(false);
  const [activeStyle, setActiveStyle] = useState('Casual');
  const [outfit, setOutfit] = useState(['t1', 'b1', 's1']);
  const [tryonItem, setTryonItem] = useState(null);

  // User measurements (drive size recommendation)
  const [height, setHeight] = useState(172);
  const [weight, setWeight] = useState(64);
  const [bodyType, setBodyType] = useState('normal'); // 'slim' | 'normal' | 'curvy'
  const userSize = recommendSize(height, weight, bodyType);
  const sizeConf = sizeConfidence(height, weight, bodyType);

  // Apply theme + accent to the document root
  useEffect(() => {
    document.documentElement.dataset.theme = t.theme || 'warm';
  }, [t.theme]);

  useEffect(() => {
    const a = ACCENTS[t.accent] || ACCENTS['#7C3AED'];
    document.documentElement.style.setProperty('--accent', t.accent);
    document.documentElement.style.setProperty('--accent-deep', a.deep);
    document.documentElement.style.setProperty('--accent-soft', a.soft);
  }, [t.accent]);

  const goCatalog = () => setScreen('catalog');
  const goOutfit = () => setScreen('outfit');
  const goUpload = () => setScreen('upload');
  const goLanding = () => setScreen('landing');

  const openTryon = (item) => {
    setTryonItem(item);
    setScreen('tryon');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToOutfit = (item) => {
    setOutfit(o => o.includes(item.id) ? o : [...o, item.id]);
  };
  const removeFromOutfit = (id) => setOutfit(o => o.filter(i => i !== id));

  const handleNav = (k) => {
    if (k === 'upload') setScreen('upload');
    if (k === 'catalog') setScreen('catalog');
    if (k === 'outfit') setScreen('outfit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navScreen = screen === 'tryon' ? 'catalog' : screen;
  const showTopBar = screen !== 'landing';

  return (
    <div>
      {showTopBar && <TopBar onLogo={goLanding} onNav={handleNav} screen={navScreen} outfitCount={outfit.length}
        theme={t.theme} accent={t.accent}
        onTheme={v => setTweak('theme', v)} onAccent={v => setTweak('accent', v)} />}
      {screen === 'landing' && (
        <>
          <LandingHeader onLogin={goUpload}
            theme={t.theme} accent={t.accent}
            onTheme={v => setTweak('theme', v)} onAccent={v => setTweak('accent', v)} />
          <LandingScreen onStart={goUpload} />
        </>
      )}
      {screen === 'upload'  && <UploadScreen onContinue={goCatalog} photo={photo} setPhoto={setPhoto}
                                              activeStyle={activeStyle} setActiveStyle={setActiveStyle}
                                              height={height} setHeight={setHeight}
                                              weight={weight} setWeight={setWeight}
                                              bodyType={bodyType} setBodyType={setBodyType}
                                              userSize={userSize} sizeConf={sizeConf} />}
      {screen === 'catalog' && <CatalogScreen outfit={outfit} onTryOn={openTryon} onOpenOutfit={goOutfit}
                                              userSize={userSize} />}
      {screen === 'tryon'   && tryonItem && (
        <TryOnScreen item={tryonItem} onBack={goCatalog}
          inOutfit={outfit.includes(tryonItem.id)}
          userSize={userSize} height={height}
          onAdd={(item) => { addToOutfit(item); setScreen('outfit'); }}
        />
      )}
      {screen === 'outfit'  && <OutfitScreen outfit={outfit} onRemove={removeFromOutfit}
                                              onContinue={goCatalog} onTryOn={openTryon} />}

      <TweaksPanel>
        <TweakSection label="Тема" />
        <ThemeSwatches value={t.theme} onChange={v => setTweak('theme', v)} />
        <TweakSection label="Акцент" />
        <TweakColor label="Цвет"
          value={t.accent}
          options={Object.keys(ACCENTS)}
          onChange={v => setTweak('accent', v)} />
      </TweaksPanel>
    </div>
  );
}

// Custom theme picker — shows palette preview for each theme
const ThemeSwatches = ({ value, onChange }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
    {THEME_OPTIONS.map(opt => {
      const active = value === opt.id;
      return (
        <button key={opt.id} onClick={() => onChange(opt.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 9px', borderRadius: 8, cursor: 'pointer',
            border: '1px solid ' + (active ? 'rgba(41,38,27,.85)' : 'rgba(0,0,0,.08)'),
            background: active ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.3)',
            color: '#29261b', font: 'inherit', textAlign: 'left'
          }}>
          <ThemePreview theme={opt.id} />
          <span style={{ fontSize: 11.5, fontWeight: active ? 600 : 500 }}>{opt.label}</span>
        </button>
      );
    })}
  </div>
);

const ThemePreview = ({ theme }) => {
  const palettes = {
    warm:  ['#FBFAF7', '#0E0E10', '#7C3AED'],
    mono:  ['#FFFFFF', '#000000', '#8E8E8E'],
    dark:  ['#0C0C0E', '#F4F2EE', '#A78BFA'],
    berry: ['#FBF1ED', '#2A0E1A', '#B43D5F'],
  };
  const [bg, ink, accent] = palettes[theme] || palettes.warm;
  return (
    <div style={{
      width: 28, height: 18, borderRadius: 4, overflow: 'hidden',
      display: 'flex', border: '0.5px solid rgba(0,0,0,.1)', flexShrink: 0
    }}>
      <div style={{ flex: 2, background: bg }} />
      <div style={{ flex: 1, background: ink }} />
      <div style={{ flex: 1, background: accent }} />
    </div>
  );
};

// Landing has its own minimal top bar (since the design feels different on landing)
const LandingHeader = ({ onLogin, theme, accent, onTheme, onAccent }) => (
  <header style={{
    position: 'sticky', top: 0, zIndex: 50,
    background: 'color-mix(in srgb, var(--bg) 85%, transparent)', backdropFilter: 'blur(12px)'
  }}>
    <div className="topbar-inner" style={{
      maxWidth: 1280, margin: '0 auto', padding: '20px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Logo />
      <nav className="landing-header-nav" style={{ display: 'flex', gap: 28, fontSize: 14, color: 'var(--ink-2)' }}>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Как работает</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Бренды</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Цена</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Для бизнеса</a>
      </nav>
      <div className="header-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <ThemeSwitcher theme={theme} accent={accent} onTheme={onTheme} onAccent={onAccent} />
        <button className="chip chip-hide-mobile" style={{ height: 40, padding: '0 14px' }}>Войти</button>
        <button className="btn btn-primary" onClick={onLogin} style={{ height: 40, padding: '0 18px', fontSize: 14 }}>
          Начать
        </button>
      </div>
    </div>
  </header>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
