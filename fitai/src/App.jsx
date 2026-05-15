import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useTweaks, TweaksPanel, TweakSection, TweakColor } from './components/TweaksPanel';
import { Logo, BagIcon, HeartIcon } from './components/UI';
import { ThemeSwitcher } from './components/Theme';
import { LandingScreen } from './screens/LandingScreen';
import { UploadScreen } from './screens/UploadScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { TryOnScreen } from './screens/TryOnScreen';
import { OutfitScreen } from './screens/OutfitScreen';
import { OutfitsScreen } from './screens/OutfitsScreen';
import { TryOnsScreen } from './screens/TryOnsScreen';
import { HowScreen } from './screens/HowScreen';
import { CartScreen } from './screens/CartScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { PublicOutfitScreen } from './screens/PublicOutfitScreen';
import { AdminScreen } from './screens/AdminScreen';
import { recommendSize, sizeConfidence } from './data/catalog';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useCart } from './hooks/useCart';
import { AuthModal } from './components/AuthModal';
import { api } from './lib/api';

const TWEAK_DEFAULTS = {
  theme: 'warm',
  accent: '#7C3AED'
};

const ACCENTS = {
  '#7C3AED': { deep: '#5B21B6', soft: '#F1ECFE' },
  '#E11D48': { deep: '#9F1239', soft: '#FFE4E9' },
  '#F97316': { deep: '#C2410C', soft: '#FFEDD5' },
  '#0EA5E9': { deep: '#0369A1', soft: '#E0F2FE' },
  '#16A34A': { deep: '#15803D', soft: '#DCFCE7' },
};

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const { user, logout } = useAuth();
  const { profile, patch: patchProfile } = useProfile();
  const { count: cartCount } = useCart();
  const [authMode, setAuthMode] = useState(null); // null | 'login' | 'register'
  const [screen, setScreen] = useState('landing');
  const [photo, setPhoto] = useState(null);
  const [outfit, setOutfit] = useState(['t1', 'b1', 's1']);
  const [outfitId, setOutfitId] = useState(null);
  const [tryonItem, setTryonItem] = useState(null);
  const [publicToken, setPublicToken] = useState(null);

  useEffect(() => {
    const parse = () => {
      const m = window.location.hash.match(/^#\/o\/([\w-]+)/);
      setPublicToken(m ? m[1] : null);
    };
    parse();
    window.addEventListener('hashchange', parse);
    return () => window.removeEventListener('hashchange', parse);
  }, []);

  useEffect(() => {
    const onErr = (e) => {
      const msg = e?.detail?.message;
      if (msg) toast.error(typeof msg === 'string' ? msg : 'Ошибка');
    };
    window.addEventListener('fitai:error', onErr);
    return () => window.removeEventListener('fitai:error', onErr);
  }, []);

  const height    = profile?.height    ?? 172;
  const weight    = profile?.weight    ?? 64;
  const bodyType  = profile?.bodyType  ?? 'normal';
  const activeStyle = profile?.style   ?? 'Casual';
  const favorites = profile?.favorites ?? [];

  const setHeight      = (v) => patchProfile({ height: typeof v === 'function' ? v(height) : v });
  const setWeight      = (v) => patchProfile({ weight: typeof v === 'function' ? v(weight) : v });
  const setBodyType    = (v) => patchProfile({ bodyType: v });
  const setActiveStyle = (v) => patchProfile({ style: v });

  const userSize = recommendSize(height, weight, bodyType);
  const sizeConf = sizeConfidence(height, weight, bodyType);

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

  const saveOutfit = (ids) => {
    if (!user) return;
    if (ids.length === 0) {
      if (outfitId) {
        api.deleteOutfit(outfitId).catch(() => {});
        setOutfitId(null);
      }
      return;
    }
    if (outfitId) {
      api.updateOutfit(outfitId, { itemIds: ids }).catch(() => {});
    } else {
      api.createOutfit('Текущий', ids).then(r => setOutfitId(r.outfit.id)).catch(() => {});
    }
  };

  const saveOutfitAsNew = async (name) => {
    if (!user || outfit.length === 0) return;
    await api.createOutfit(name || 'Образ', outfit).catch(() => {});
  };

  const loadSavedOutfit = (o) => {
    setOutfit(o.itemIds);
    setOutfitId(o.id);
    setScreen('outfit');
  };
  const addToOutfit = (item) => {
    setOutfit(o => {
      if (o.includes(item.id)) return o;
      const next = [...o, item.id];
      saveOutfit(next);
      return next;
    });
  };
  const removeFromOutfit = (id) => setOutfit(o => {
    const next = o.filter(i => i !== id);
    saveOutfit(next);
    return next;
  });
  const toggleFavorite = (id) => {
    const next = favorites.includes(id) ? favorites.filter(i => i !== id) : [...favorites, id];
    patchProfile({ favorites: next });
  };

  useEffect(() => {
    if (!user) { setOutfitId(null); return; }
    api.listOutfits().then(r => {
      const current = r.outfits?.find(o => o.name === 'Текущий') || r.outfits?.[0];
      if (current) {
        setOutfit(current.itemIds);
        setOutfitId(current.id);
      }
    }).catch(() => {});
  }, [user?.id]);

  const handleNav = (k) => {
    if (k === 'upload') setScreen('upload');
    if (k === 'catalog') setScreen('catalog');
    if (k === 'outfit') setScreen('outfit');
    if (k === 'outfits') setScreen('outfits');
    if (k === 'tryons') setScreen('tryons');
    if (k === 'how') setScreen('how');
    if (k === 'cart') setScreen('cart');
    if (k === 'favorites') setScreen('favorites');
    if (k === 'admin') setScreen('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
      setPublicToken(null);
    }
    setScreen('landing');
  };

  const navScreen = screen === 'tryon' ? 'catalog' : screen;
  const showTopBar = screen !== 'landing' && !publicToken;

  if (publicToken) {
    return (
      <>
        <PublicOutfitScreen token={publicToken} onHome={goHome} />
        <Toaster richColors position="top-center" />
      </>
    );
  }

  return (
    <div>
      {showTopBar && (
        <TopBar onLogo={goLanding} onNav={handleNav} screen={navScreen} outfitCount={outfit.length}
          cartCount={cartCount} favCount={favorites.length}
          theme={t.theme} accent={t.accent}
          user={user} onAuth={() => setAuthMode('login')} onLogout={logout}
          onTheme={v => setTweak('theme', v)} onAccent={v => setTweak('accent', v)} />
      )}
      {screen === 'landing' && (
        <>
          <LandingHeader
            onLogin={() => (user ? goUpload() : setAuthMode('login'))}
            onRegister={() => (user ? goUpload() : setAuthMode('register'))}
            onHow={() => handleNav('how')}
            onAdmin={() => handleNav('admin')}
            user={user}
            theme={t.theme} accent={t.accent}
            onTheme={v => setTweak('theme', v)} onAccent={v => setTweak('accent', v)} />
          <LandingScreen onStart={goUpload} onHow={() => handleNav('how')} />
        </>
      )}
      {screen === 'upload' && (
        <UploadScreen onContinue={goCatalog} photo={photo} setPhoto={setPhoto}
          activeStyle={activeStyle} setActiveStyle={setActiveStyle}
          height={height} setHeight={setHeight}
          weight={weight} setWeight={setWeight}
          bodyType={bodyType} setBodyType={setBodyType}
          userSize={userSize} sizeConf={sizeConf} />
      )}
      {screen === 'catalog' && (
        <CatalogScreen outfit={outfit} onTryOn={openTryon} onOpenOutfit={goOutfit}
          userSize={userSize} favorites={favorites} onToggleFavorite={toggleFavorite} />
      )}
      {screen === 'tryon' && tryonItem && (
        <TryOnScreen item={tryonItem} onBack={goCatalog}
          inOutfit={outfit.includes(tryonItem.id)}
          isFavorite={favorites.includes(tryonItem.id)}
          onToggleFavorite={toggleFavorite}
          userSize={userSize} height={height}
          photo={photo}
          onAdd={(item) => { addToOutfit(item); setScreen('outfit'); }}
        />
      )}
      {screen === 'outfit' && (
        <OutfitScreen outfit={outfit} outfitId={outfitId} onRemove={removeFromOutfit}
          onContinue={goCatalog} onTryOn={openTryon}
          onSaveAs={saveOutfitAsNew} onViewSaved={() => setScreen('outfits')} />
      )}
      {screen === 'cart' && (
        <CartScreen onBack={() => setScreen('catalog')} onCatalog={goCatalog} />
      )}
      {screen === 'favorites' && (
        <FavoritesScreen favorites={favorites} userSize={userSize}
          onBack={() => setScreen('catalog')} onCatalog={goCatalog}
          onTryOn={openTryon} onToggleFavorite={toggleFavorite} />
      )}
      {screen === 'outfits' && (
        <OutfitsScreen onBack={() => setScreen('outfit')} onLoad={loadSavedOutfit} />
      )}
      {screen === 'tryons' && (
        <TryOnsScreen onBack={() => setScreen('catalog')} />
      )}
      {screen === 'how' && (
        <HowScreen onStart={goUpload} onBack={goLanding} />
      )}
      {screen === 'admin' && user?.role === 'admin' && (
        <AdminScreen currentUserId={user.id} />
      )}

      <AuthModal open={authMode != null} initialMode={authMode || 'login'} onClose={() => setAuthMode(null)} />

      <Toaster richColors position="top-center" />

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

const Badge = ({ n }) => (
  <span style={{
    position: 'absolute', top: -4, right: -4,
    minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999,
    background: 'var(--accent)', color: 'white',
    fontSize: 10, fontWeight: 700,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    border: '2px solid var(--bg)'
  }}>{n > 99 ? '99+' : n}</span>
);

const BurgerIcon = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    {open ? <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
  </svg>
);

const MobileMenu = ({ open, items, onPick, footer }) => (
  open ? (
    <div className="mobile-menu" style={{
      position: 'fixed', top: 60, left: 0, right: 0, zIndex: 49,
      background: 'var(--bg)', borderBottom: '1px solid var(--line-2)',
      padding: '14px 20px 18px', display: 'flex', flexDirection: 'column', gap: 4,
      boxShadow: '0 14px 28px -16px rgba(0,0,0,.2)',
      animation: 'mobMenuIn .18s ease both'
    }}>
      <style>{`@keyframes mobMenuIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {items.map(it => (
        <button key={it.k} onClick={() => onPick(it.k)} style={{
          padding: '14px 6px', textAlign: 'left', fontSize: 16, fontWeight: 500,
          color: it.active ? 'var(--ink)' : 'var(--ink-2)',
          borderBottom: '1px solid var(--line-2)'
        }}>{it.label}</button>
      ))}
      {footer}
    </div>
  ) : null
);

const TopBar = ({ onLogo, onNav, screen, outfitCount, cartCount = 0, favCount = 0, theme, accent, onTheme, onAccent, user, onAuth, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = [
    { k: 'upload', label: 'Примерка' },
    { k: 'catalog', label: 'Каталог' },
    { k: 'outfit', label: `Мой образ · ${outfitCount}` },
    { k: 'outfits', label: 'Сохранённые' },
    { k: 'favorites', label: `Избранное · ${favCount}` },
    { k: 'tryons', label: 'История' },
    { k: 'cart', label: `Корзина · ${cartCount}` },
    ...(user?.role === 'admin' ? [{ k: 'admin', label: 'Админка' }] : []),
  ];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'color-mix(in srgb, var(--bg) 85%, transparent)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--line-2)'
    }}>
      <div className="topbar-inner" style={{
        maxWidth: 1280, margin: '0 auto', padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24
      }}>
        <Logo onClick={onLogo} />
        <nav className="topbar-nav" style={{ display: 'flex', gap: 28, fontSize: 14, color: 'var(--ink-2)' }}>
          {items.map(item => (
            <button key={item.k} onClick={() => onNav(item.k)}
              style={{
                fontWeight: screen === item.k ? 600 : 500,
                color: screen === item.k ? 'var(--ink)' : 'var(--ink-2)',
                padding: '6px 0', position: 'relative'
              }}>
              {item.k === 'outfit' ? 'Мой образ' : item.label}
              {screen === item.k && (
                <span style={{
                  position: 'absolute', left: 0, right: 0, bottom: -2, height: 2,
                  background: 'var(--ink)', borderRadius: 2
                }} />
              )}
            </button>
          ))}
        </nav>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ThemeSwitcher theme={theme} accent={accent} onTheme={onTheme} onAccent={onAccent} compact />
          <button className="chip chip-hide-mobile" onClick={() => onNav('favorites')}
            aria-label="Избранное"
            style={{ width: 38, justifyContent: 'center', position: 'relative',
                     background: favCount > 0 ? 'var(--accent-soft)' : 'white',
                     color: favCount > 0 ? 'var(--accent-deep)' : 'var(--ink-2)',
                     borderColor: favCount > 0 ? 'transparent' : 'var(--line)' }}>
            <HeartIcon size={14} filled={favCount > 0} />
            {favCount > 0 && <Badge n={favCount} />}
          </button>
          <button className="chip chip-hide-mobile" onClick={() => onNav('cart')}
            aria-label="Корзина"
            style={{ position: 'relative',
                     background: cartCount > 0 ? 'var(--accent-soft)' : 'white',
                     color: cartCount > 0 ? 'var(--accent-deep)' : 'var(--ink-2)',
                     borderColor: cartCount > 0 ? 'transparent' : 'var(--line)' }}>
            <BagIcon size={15} />
            Корзина {cartCount > 0 ? `· ${cartCount}` : ''}
          </button>
          {user ? (
            <button onClick={onLogout} title={user.email}
              className="topbar-avatar"
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg,#F4D8C4,#C28B6A)',
                display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700, fontSize: 13
              }}>{user.email[0].toUpperCase()}</button>
          ) : (
            <button onClick={onAuth} className="chip" style={{ height: 34 }}>Войти</button>
          )}
          <button className="burger show-mobile" onClick={() => setMenuOpen(o => !o)}
            style={{ width: 40, height: 40, display: 'none', alignItems: 'center', justifyContent: 'center',
              borderRadius: 10, border: '1px solid var(--line)', color: 'var(--ink)' }}>
            <BurgerIcon open={menuOpen} />
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} items={items.map(i => ({ ...i, active: screen === i.k }))}
        onPick={(k) => { onNav(k); setMenuOpen(false); }} />
    </header>
  );
};

const LandingHeader = ({ onLogin, onRegister, onHow, onAdmin, theme, accent, onTheme, onAccent, user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = [
    { k: 'how', label: 'Как работает' },
    { k: 'brands', label: 'Бренды' },
    { k: 'pricing', label: 'Цена' },
    { k: 'business', label: 'Для бизнеса' },
  ];
  const pick = (k) => {
    setMenuOpen(false);
    if (k === 'how') return onHow();
    const el = document.getElementById(k);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
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
          {items.map(it => (
            <button key={it.k} onClick={() => pick(it.k)} style={{ color: 'inherit' }}>{it.label}</button>
          ))}
        </nav>
        <div className="header-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ThemeSwitcher theme={theme} accent={accent} onTheme={onTheme} onAccent={onAccent} />
          {user?.role === 'admin' && (
            <button className="chip chip-hide-mobile" onClick={onAdmin}
              style={{ height: 40, padding: '0 14px', background: 'var(--accent-soft)',
                color: 'var(--accent-deep)', borderColor: 'transparent' }}>Админка</button>
          )}
          {!user && (
            <button className="chip chip-hide-mobile" onClick={onLogin}
              style={{ height: 40, padding: '0 14px' }}>Войти</button>
          )}
          <button className="btn btn-primary" onClick={user ? onLogin : onRegister}
            style={{ height: 40, padding: '0 18px', fontSize: 14 }}>
            {user ? 'Начать' : 'Начать бесплатно'}
          </button>
          <button className="burger show-mobile" onClick={() => setMenuOpen(o => !o)}
            style={{ width: 40, height: 40, display: 'none', alignItems: 'center', justifyContent: 'center',
              borderRadius: 10, border: '1px solid var(--line)', color: 'var(--ink)' }}>
            <BurgerIcon open={menuOpen} />
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} items={items} onPick={pick}
        footer={
          <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
            {!user && (
              <button onClick={() => { setMenuOpen(false); onLogin(); }}
                className="btn btn-ghost" style={{ height: 48 }}>Войти</button>
            )}
            <button onClick={() => { setMenuOpen(false); (user ? onLogin : onRegister)(); }}
              className="btn btn-primary" style={{ height: 48 }}>
              {user ? 'Начать' : 'Начать бесплатно'}
            </button>
          </div>
        } />
    </header>
  );
};

const THEME_OPTIONS = [
  { id: 'warm',  label: 'Warm' },
  { id: 'mono',  label: 'Mono' },
  { id: 'dark',  label: 'Dark' },
  { id: 'berry', label: 'Berry' },
];

const ThemeSwatches = ({ value, onChange }) => {
  const palettes = {
    warm:  ['#FBFAF7', '#0E0E10', '#7C3AED'],
    mono:  ['#FFFFFF', '#000000', '#8E8E8E'],
    dark:  ['#0C0C0E', '#F4F2EE', '#A78BFA'],
    berry: ['#FBF1ED', '#2A0E1A', '#B43D5F'],
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
      {THEME_OPTIONS.map(opt => {
        const active = value === opt.id;
        const [bg, ink, accent] = palettes[opt.id] || palettes.warm;
        return (
          <button key={opt.id} onClick={() => onChange(opt.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 9px', borderRadius: 8, cursor: 'pointer',
              border: '1px solid ' + (active ? 'rgba(41,38,27,.85)' : 'rgba(0,0,0,.08)'),
              background: active ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.3)',
              color: '#29261b', font: 'inherit', textAlign: 'left'
            }}>
            <div style={{
              width: 28, height: 18, borderRadius: 4, overflow: 'hidden',
              display: 'flex', border: '0.5px solid rgba(0,0,0,.1)', flexShrink: 0
            }}>
              <div style={{ flex: 2, background: bg }} />
              <div style={{ flex: 1, background: ink }} />
              <div style={{ flex: 1, background: accent }} />
            </div>
            <span style={{ fontSize: 11.5, fontWeight: active ? 600 : 500 }}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
