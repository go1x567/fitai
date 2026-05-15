// Shared UI components

const Logo = ({ onClick }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
    <div style={{
      width: 30, height: 30, borderRadius: 9, background: 'var(--solid)',
      display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--accent) 85%, transparent), transparent 60%)'
      }} />
      <span style={{ color: 'var(--on-solid)', fontWeight: 800, fontSize: 14, position: 'relative', letterSpacing: '-0.02em' }}>F</span>
    </div>
    <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.03em' }}>
      FitAI
    </span>
  </button>
);

const TopBar = ({ onLogo, onNav, screen, outfitCount, theme, accent, onTheme, onAccent }) => (
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
        {[
          { k: 'upload', label: 'Примерка' },
          { k: 'catalog', label: 'Каталог' },
          { k: 'outfit', label: 'Мой образ' },
        ].map(item => (
          <button key={item.k} onClick={() => onNav(item.k)}
            style={{
              fontWeight: screen === item.k ? 600 : 500,
              color: screen === item.k ? 'var(--ink)' : 'var(--ink-2)',
              padding: '6px 0', position: 'relative'
            }}>
            {item.label}
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
        <button className="chip chip-hide-mobile" onClick={() => onNav('outfit')}
          style={{ background: outfitCount > 0 ? 'var(--accent-soft)' : 'white',
                   color: outfitCount > 0 ? 'var(--accent-deep)' : 'var(--ink-2)',
                   borderColor: outfitCount > 0 ? 'transparent' : 'var(--line)' }}>
          <BagIcon size={15} />
          Образ · {outfitCount}
        </button>
        <div className="topbar-avatar" style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg,#F4D8C4,#C28B6A)',
          display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700, fontSize: 13
        }}>М</div>
      </div>
    </div>
  </header>
);

// Icons
const BagIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8a3 3 0 1 1 6 0" />
  </svg>
);
const UploadIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 20h14" />
  </svg>
);
const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 5 5L20 7" />
  </svg>
);
const SparkleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2Z" />
    <path d="M19 14l.8 2.4L22 17l-2.2.6L19 20l-.8-2.4L16 17l2.2-.6L19 14Z" />
  </svg>
);
const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
);
const ArrowLeft = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" /><path d="m11 18-6-6 6-6" />
  </svg>
);
const ShareIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path d="m8.6 10.6 6.8-4.2M8.6 13.4l6.8 4.2" />
  </svg>
);
const RefreshIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" /><path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" /><path d="M3 21v-5h5" />
  </svg>
);
const PlusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

// Silhouette placeholder
const Silhouette = ({ accent = '#D5CFC0', skin = '#E8C9AC', shirt = '#F4F1EA', pants = '#3A4A66' }) => (
  <svg viewBox="0 0 200 320" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F6F2EA" />
        <stop offset="1" stopColor="#E8E2D2" />
      </linearGradient>
    </defs>
    {/* head */}
    <ellipse cx="100" cy="44" rx="22" ry="26" fill={skin} />
    {/* hair */}
    <path d="M78 36 Q100 8 122 36 Q124 22 100 18 Q76 22 78 36Z" fill="#2B1F18" />
    {/* neck */}
    <rect x="92" y="64" width="16" height="14" fill={skin} />
    {/* torso (shirt) */}
    <path d="M60 84 Q100 76 140 84 L150 178 Q100 188 50 178 Z" fill={shirt} />
    <path d="M60 84 Q100 76 140 84 L150 178 Q100 188 50 178 Z" fill="none" stroke={accent} strokeWidth="1" />
    {/* arms */}
    <path d="M58 86 L40 168 L52 172 L70 100 Z" fill={shirt} stroke={accent} strokeWidth="0.6" />
    <path d="M142 86 L160 168 L148 172 L130 100 Z" fill={shirt} stroke={accent} strokeWidth="0.6" />
    {/* pants */}
    <path d="M58 178 Q100 184 142 178 L138 296 L108 296 L100 200 L92 296 L62 296 Z" fill={pants} />
    {/* shoes */}
    <ellipse cx="76" cy="302" rx="18" ry="6" fill="#1B1B1F" />
    <ellipse cx="124" cy="302" rx="18" ry="6" fill="#1B1B1F" />
  </svg>
);

// Person photo placeholder — a posed "studio" look
const PersonPhoto = ({ outfit = {}, label = 'Твоё фото', tone = '#EFE8DA', tagged = false }) => {
  const shirt = outfit.shirt || '#F4F1EA';
  const pants = outfit.pants || '#3A4A66';
  const shoes = outfit.shoes || '#1B1B1F';
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '3/4',
      background: `linear-gradient(180deg, ${tone} 0%, ${shiftTone(tone, -8)} 100%)`,
      borderRadius: 18, overflow: 'hidden'
    }}>
      {/* subtle floor */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '22%',
        background: `linear-gradient(180deg, transparent, ${shiftTone(tone, -16)})`
      }} />
      <div style={{ position: 'absolute', inset: '6% 14% 0 14%' }}>
        <Silhouette shirt={shirt} pants={pants} accent={shiftTone(shirt, -18)} />
      </div>
      {/* color override for shoes */}
      <svg style={{ position: 'absolute', left: '14%', right: '14%', bottom: '4%', width: '72%', height: '5%' }} viewBox="0 0 200 20" preserveAspectRatio="none">
        <ellipse cx="76" cy="10" rx="18" ry="6" fill={shoes} />
        <ellipse cx="124" cy="10" rx="18" ry="6" fill={shoes} />
      </svg>
      {/* tag */}
      <div style={{
        position: 'absolute', top: 14, left: 14,
        background: 'rgba(14,14,16,.78)', color: 'white',
        padding: '6px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 500,
        display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(6px)'
      }}>
        {tagged && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF6B5B' }} className="pulse" />}
        {label}
      </div>
    </div>
  );
};

function shiftTone(hex, amt) {
  const h = hex.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(h.slice(0,2),16) + amt));
  const g = Math.max(0, Math.min(255, parseInt(h.slice(2,4),16) + amt));
  const b = Math.max(0, Math.min(255, parseInt(h.slice(4,6),16) + amt));
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}

// Garment tile — flat lay style placeholder
const Garment = ({ item, size = 'lg' }) => {
  const fontSize = size === 'lg' ? 56 : size === 'md' ? 40 : 32;
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '4/5',
      background: `linear-gradient(160deg, ${item.tone} 0%, ${shiftTone(item.tone, item.dark ? 12 : -10)} 100%)`,
      borderRadius: 14, overflow: 'hidden',
      display: 'grid', placeItems: 'center'
    }}>
      {/* studio shadow */}
      <div style={{
        position: 'absolute', left: '50%', bottom: '14%', transform: 'translateX(-50%)',
        width: '60%', height: 16, background: 'rgba(0,0,0,.15)', borderRadius: '50%', filter: 'blur(8px)'
      }} />
      <span style={{ fontSize, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,.18))' }}>{item.emoji}</span>
      {/* corner dot */}
      <div style={{
        position: 'absolute', top: 10, right: 10,
        width: 8, height: 8, borderRadius: 4, background: item.accent, opacity: .8
      }} />
    </div>
  );
};

window.Logo = Logo;
window.TopBar = TopBar;
window.BagIcon = BagIcon;
window.UploadIcon = UploadIcon;
window.CheckIcon = CheckIcon;
window.SparkleIcon = SparkleIcon;
window.ArrowRight = ArrowRight;
window.ArrowLeft = ArrowLeft;
window.ShareIcon = ShareIcon;
window.RefreshIcon = RefreshIcon;
window.PlusIcon = PlusIcon;
window.Silhouette = Silhouette;
window.PersonPhoto = PersonPhoto;
window.Garment = Garment;
window.shiftTone = shiftTone;
