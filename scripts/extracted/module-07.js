// === Theme switcher (in-page button + popover) ===
const THEME_META = {
  warm: { label: 'Warm', palette: ['#FBFAF7', '#0E0E10', '#7C3AED'], desc: 'Тёплый off-white' },
  mono: { label: 'Mono', palette: ['#FFFFFF', '#000000', '#8E8E8E'], desc: 'Editorial ч/б' },
  dark: { label: 'Dark', palette: ['#0C0C0E', '#F4F2EE', '#A78BFA'], desc: 'Премиум ночь' },
  berry: { label: 'Berry', palette: ['#FBF1ED', '#2A0E1A', '#B43D5F'], desc: 'Розово-бордовый' }
};

const ACCENT_META = [
{ id: '#7C3AED', label: 'Сирень' },
{ id: '#E11D48', label: 'Малина' },
{ id: '#F97316', label: 'Манго' },
{ id: '#0EA5E9', label: 'Лёд' },
{ id: '#16A34A', label: 'Мята' }];


const ThemeChip = ({ theme, size = 22 }) => {
  const [bg, ink, acc] = (THEME_META[theme] || THEME_META.warm).palette;
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2, overflow: 'hidden',
      display: 'flex', border: '1px solid var(--line)', flexShrink: 0
    }}>
      <div style={{ flex: 1, background: bg }} />
      <div style={{ flex: 1, background: ink }} />
      <div style={{ flex: 1, background: acc }} />
    </div>);

};

const ThemeSwitcher = ({ theme, accent, onTheme, onAccent, compact }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen((o) => !o)} className="chip"
      style={{ height: 40, padding: compact ? '0 10px 0 6px' : '0 14px 0 8px', gap: 8 }}>
        <ThemeChip theme={theme} size={22} />
        {!compact && <span style={{ fontWeight: 500 }}>{THEME_META[theme]?.label}</span>}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .6 }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open &&
      <div style={{
        position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 100,
        background: 'var(--surface)',
        border: '1px solid var(--line)', borderRadius: 16,
        boxShadow: '0 24px 48px -16px rgba(0,0,0,.22), 0 4px 12px -4px rgba(0,0,0,.08)',
        padding: 10, animation: 'tsFadeIn .15s ease both', width: "327px", height: "221px"
      }}>
          <style>{`@keyframes tsFadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>

          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em',
          color: 'var(--ink-3)', textTransform: 'uppercase', padding: '6px 8px 8px' }}>
            Тема
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {Object.entries(THEME_META).map(([id, meta]) => {
            const active = theme === id;
            return (
              <button key={id} onClick={() => {onTheme(id);}}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 10, cursor: 'pointer',
                border: '1px solid ' + (active ? 'var(--ink)' : 'var(--line)'),
                background: active ? 'var(--warm)' : 'transparent',
                textAlign: 'left', transition: 'all .12s',
                color: 'var(--ink)'
              }}>
                  <ThemeChip theme={id} size={26} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: active ? 600 : 500, letterSpacing: '-0.005em' }}>
                      {meta.label}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--ink-3)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {meta.desc}
                    </div>
                  </div>
                  {active &&
                <span style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: 'var(--ink)', color: 'var(--bg)',
                  display: 'grid', placeItems: 'center', fontSize: 9
                }}>
                      <CheckIcon size={9} />
                    </span>
                }
                </button>);

          })}
          </div>

          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em',
          color: 'var(--ink-3)', textTransform: 'uppercase', padding: '14px 8px 8px' }}>
            Акцент
          </div>
          <div style={{ display: 'flex', gap: 6, padding: '0 4px 4px' }}>
            {ACCENT_META.map((a) => {
            const active = accent === a.id;
            return (
              <button key={a.id} onClick={() => onAccent(a.id)}
              title={a.label}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: a.id, cursor: 'pointer', position: 'relative',
                border: '2px solid ' + (active ? 'var(--ink)' : 'transparent'),
                boxShadow: active ?
                '0 0 0 2px var(--surface) inset, 0 4px 10px -4px ' + a.id :
                '0 0 0 1px var(--line) inset',
                transition: 'transform .12s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                
                  {active &&
                <span style={{
                  position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                  color: 'white', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.4))'
                }}>
                      <CheckIcon size={14} />
                    </span>
                }
                </button>);

          })}
          </div>
        </div>
      }
    </div>);

};

window.ThemeSwitcher = ThemeSwitcher;
window.ThemeChip = ThemeChip;