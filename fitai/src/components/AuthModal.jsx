import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Logo, SparkleIcon } from './UI';

export function AuthModal({ open, onClose, initialMode = 'login' }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setErr(null);
      setBusy(false);
      setPassword2('');
    }
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const strength = useMemo(() => scorePassword(password), [password]);

  if (!open) return null;

  const isReg = mode === 'register';
  const canSubmit = !busy && emailValid && password.length >= 8 &&
    (!isReg || (password === password2 && agree));

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setErr(null);
    setBusy(true);
    try {
      if (isReg) await register(email, password);
      else await login(email, password);
      onClose();
    } catch (e) {
      setErr(humanError(e, isReg));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(14,14,16,.5)', backdropFilter: 'blur(6px)',
      display: 'grid', placeItems: 'center', padding: 20,
      animation: 'fadeIn .18s ease',
    }}>
      <form onSubmit={submit} onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg)', borderRadius: 24, padding: '28px 28px 24px',
          width: '100%', maxWidth: 420, border: '1px solid var(--line)',
          boxShadow: '0 40px 80px -24px rgba(0,0,0,.5)',
          display: 'flex', flexDirection: 'column', gap: 14,
          position: 'relative',
        }}>
        <button type="button" onClick={onClose} aria-label="Закрыть" style={{
          position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 10,
          display: 'grid', placeItems: 'center', color: 'var(--ink-2)',
          background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 18,
        }}>×</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
          <Logo />
        </div>

        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.025em', margin: '0 0 4px' }}>
            {isReg ? 'Создать аккаунт' : 'С возвращением'}
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.45 }}>
            {isReg
              ? 'Бесплатно. Без карты. 5 примерок в месяц.'
              : 'Войди, чтобы продолжить примерки и сохранённые образы.'}
          </p>
        </div>

        <div role="tablist" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          padding: 4, background: 'var(--surface)', borderRadius: 12,
          border: '1px solid var(--line)',
        }}>
          {[['login','Войти'],['register','Регистрация']].map(([k,l]) => (
            <button key={k} type="button" role="tab" aria-selected={mode===k}
              onClick={() => { setMode(k); setErr(null); }}
              style={{
                height: 36, borderRadius: 9, border: 'none', cursor: 'pointer',
                fontSize: 13.5, fontWeight: 600,
                background: mode === k ? 'var(--bg)' : 'transparent',
                color: mode === k ? 'var(--ink)' : 'var(--ink-3)',
                boxShadow: mode === k ? '0 1px 2px rgba(0,0,0,.08)' : 'none',
                transition: 'background .15s, color .15s',
              }}>{l}</button>
          ))}
        </div>

        <Field label="Email">
          <input type="email" required autoComplete="email" placeholder="ты@example.com"
            value={email} onChange={e => setEmail(e.target.value)}
            style={inputStyle(email && !emailValid)} />
        </Field>

        <Field label="Пароль" hint={isReg ? 'минимум 8 символов' : null}>
          <div style={{ position: 'relative' }}>
            <input type={showPw ? 'text' : 'password'} required minLength={8}
              autoComplete={isReg ? 'new-password' : 'current-password'}
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle(false), paddingRight: 56 }} />
            <button type="button" onClick={() => setShowPw(s => !s)}
              tabIndex={-1}
              style={{
                position: 'absolute', right: 8, top: 6, height: 32, padding: '0 10px',
                fontSize: 12, color: 'var(--ink-2)', background: 'transparent',
                border: 'none', cursor: 'pointer',
              }}>{showPw ? 'скрыть' : 'показать'}</button>
          </div>
          {isReg && password.length > 0 && <StrengthBar score={strength} />}
        </Field>

        {isReg && (
          <Field label="Повтори пароль">
            <input type={showPw ? 'text' : 'password'} required minLength={8}
              autoComplete="new-password"
              placeholder="••••••••"
              value={password2} onChange={e => setPassword2(e.target.value)}
              style={inputStyle(password2 && password2 !== password)} />
            {password2 && password2 !== password && (
              <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>Пароли не совпадают</div>
            )}
          </Field>
        )}

        {isReg && (
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5,
            color: 'var(--ink-2)', lineHeight: 1.45, cursor: 'pointer', marginTop: -2 }}>
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
              style={{ marginTop: 2, accentColor: 'var(--accent)' }} />
            <span>Соглашаюсь с <a href="#" style={{ color: 'var(--accent-deep)' }}>условиями</a> и
              {' '}<a href="#" style={{ color: 'var(--accent-deep)' }}>политикой</a>.</span>
          </label>
        )}

        {err && (
          <div style={{
            background: '#fee2e2', color: '#991b1b', padding: '10px 12px',
            borderRadius: 10, fontSize: 13, lineHeight: 1.4,
          }}>{err}</div>
        )}

        <button type="submit" disabled={!canSubmit} className="btn btn-primary"
          style={{ height: 48, marginTop: 2, opacity: canSubmit ? 1 : 0.55,
            cursor: canSubmit ? 'pointer' : 'not-allowed' }}>
          {busy
            ? (isReg ? 'Создаём…' : 'Входим…')
            : (isReg ? <>Создать аккаунт <SparkleIcon size={14} /></> : 'Войти')}
        </button>

        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>
          {isReg ? 'Уже с нами? ' : 'Новый здесь? '}
          <button type="button" onClick={() => { setMode(isReg ? 'login' : 'register'); setErr(null); }}
            style={{ color: 'var(--accent-deep)', fontWeight: 600, background: 'none',
              border: 'none', cursor: 'pointer', padding: 0 }}>
            {isReg ? 'Войти' : 'Создать аккаунт'}
          </button>
        </div>
      </form>
    </div>
  );
}

const Field = ({ label, hint, children }) => (
  <label style={{ display: 'block' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      marginBottom: 6 }}>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)' }}>{label}</span>
      {hint && <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{hint}</span>}
    </div>
    {children}
  </label>
);

const StrengthBar = ({ score }) => {
  const colors = ['#dc2626', '#f59e0b', '#eab308', '#84cc16', '#16a34a'];
  const labels = ['очень слабый', 'слабый', 'средний', 'хороший', 'отличный'];
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < score ? colors[score - 1] : 'var(--line)',
            transition: 'background .2s',
          }} />
        ))}
      </div>
      {score > 0 && (
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 4 }}>
          надёжность: <span style={{ color: colors[score - 1], fontWeight: 600 }}>{labels[score - 1]}</span>
        </div>
      )}
    </div>
  );
};

function scorePassword(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-ZА-Я]/.test(pw) && /[a-zа-я]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-zА-Яа-я0-9]/.test(pw)) s++;
  return Math.min(s, 5);
}

function humanError(e, isReg) {
  const code = e.data?.error;
  if (code === 'email_taken') return 'Этот email уже зарегистрирован. Попробуй войти.';
  if (code === 'invalid_credentials') return 'Неверный email или пароль.';
  if (code === 'invalid_input') return 'Проверь, что email корректный, а пароль не короче 8 символов.';
  if (e.status === 429) return 'Слишком много попыток, подожди минуту.';
  return isReg ? 'Не удалось зарегистрироваться. Попробуй ещё раз.' : 'Не удалось войти. Попробуй ещё раз.';
}

const inputStyle = (error) => ({
  width: '100%', height: 44, padding: '0 14px', borderRadius: 11,
  border: '1px solid ' + (error ? '#dc2626' : 'var(--line)'),
  background: 'var(--surface)',
  color: 'var(--ink)', fontSize: 14.5, fontFamily: 'inherit', outline: 'none',
  transition: 'border-color .15s, box-shadow .15s',
  boxSizing: 'border-box',
});
