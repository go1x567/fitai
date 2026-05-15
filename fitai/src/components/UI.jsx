export function shiftTone(hex, amt) {
  const h = hex.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(h.slice(0,2),16) + amt));
  const g = Math.max(0, Math.min(255, parseInt(h.slice(2,4),16) + amt));
  const b = Math.max(0, Math.min(255, parseInt(h.slice(4,6),16) + amt));
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}

export const Logo = ({ onClick }) => (
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

export const BagIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8a3 3 0 1 1 6 0" />
  </svg>
);
export const UploadIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 20h14" />
  </svg>
);
export const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 5 5L20 7" />
  </svg>
);
export const SparkleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2Z" />
    <path d="M19 14l.8 2.4L22 17l-2.2.6L19 20l-.8-2.4L16 17l2.2-.6L19 14Z" />
  </svg>
);
export const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
);
export const ArrowLeft = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" /><path d="m11 18-6-6 6-6" />
  </svg>
);
export const ShareIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path d="m8.6 10.6 6.8-4.2M8.6 13.4l6.8 4.2" />
  </svg>
);
export const RefreshIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" /><path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" /><path d="M3 21v-5h5" />
  </svg>
);
export const PlusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const HeartIcon = ({ size = 16, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
export const SearchIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
  </svg>
);

export const Silhouette = ({ accent = '#D5CFC0', skin = '#E8C9AC', shirt = '#F4F1EA', pants = '#3A4A66' }) => (
  <svg viewBox="0 0 200 320" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F6F2EA" />
        <stop offset="1" stopColor="#E8E2D2" />
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="44" rx="22" ry="26" fill={skin} />
    <path d="M78 36 Q100 8 122 36 Q124 22 100 18 Q76 22 78 36Z" fill="#2B1F18" />
    <rect x="92" y="64" width="16" height="14" fill={skin} />
    <path d="M60 84 Q100 76 140 84 L150 178 Q100 188 50 178 Z" fill={shirt} />
    <path d="M60 84 Q100 76 140 84 L150 178 Q100 188 50 178 Z" fill="none" stroke={accent} strokeWidth="1" />
    <path d="M58 86 L40 168 L52 172 L70 100 Z" fill={shirt} stroke={accent} strokeWidth="0.6" />
    <path d="M142 86 L160 168 L148 172 L130 100 Z" fill={shirt} stroke={accent} strokeWidth="0.6" />
    <path d="M58 178 Q100 184 142 178 L138 296 L108 296 L100 200 L92 296 L62 296 Z" fill={pants} />
    <ellipse cx="76" cy="302" rx="18" ry="6" fill="#1B1B1F" />
    <ellipse cx="124" cy="302" rx="18" ry="6" fill="#1B1B1F" />
  </svg>
);

export const PersonPhoto = ({ outfit = {}, label = 'Твоё фото', tone = '#EFE8DA', tagged = false }) => {
  const shirt = outfit.shirt || '#F4F1EA';
  const pants = outfit.pants || '#3A4A66';
  const shoes = outfit.shoes || '#1B1B1F';
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '3/4',
      background: `linear-gradient(180deg, ${tone} 0%, ${shiftTone(tone, -8)} 100%)`,
      borderRadius: 18, overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '22%',
        background: `linear-gradient(180deg, transparent, ${shiftTone(tone, -16)})`
      }} />
      <div style={{ position: 'absolute', inset: '6% 14% 0 14%' }}>
        <Silhouette shirt={shirt} pants={pants} accent={shiftTone(shirt, -18)} />
      </div>
      <svg style={{ position: 'absolute', left: '14%', right: '14%', bottom: '4%', width: '72%', height: '5%' }} viewBox="0 0 200 20" preserveAspectRatio="none">
        <ellipse cx="76" cy="10" rx="18" ry="6" fill={shoes} />
        <ellipse cx="124" cy="10" rx="18" ry="6" fill={shoes} />
      </svg>
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

export const Garment = ({ item, size = 'lg' }) => {
  const fontSize = size === 'lg' ? 56 : size === 'md' ? 40 : 32;
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '4/5',
      background: `linear-gradient(160deg, ${item.tone} 0%, ${shiftTone(item.tone, item.dark ? 12 : -10)} 100%)`,
      borderRadius: 14, overflow: 'hidden',
      display: 'grid', placeItems: 'center'
    }}>
      <div style={{
        position: 'absolute', left: '50%', bottom: '14%', transform: 'translateX(-50%)',
        width: '60%', height: 16, background: 'rgba(0,0,0,.15)', borderRadius: '50%', filter: 'blur(8px)'
      }} />
      <span style={{ fontSize, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,.18))' }}>{item.emoji}</span>
      <div style={{
        position: 'absolute', top: 10, right: 10,
        width: 8, height: 8, borderRadius: 4, background: item.accent, opacity: .8
      }} />
    </div>
  );
};

