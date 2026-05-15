import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '../lib/api';

const TABS = [
  { k: 'overview', label: 'Обзор' },
  { k: 'users',    label: 'Пользователи' },
  { k: 'tryons',   label: 'Примерки' },
  { k: 'catalog',  label: 'Каталог' },
];

export function AdminScreen({ currentUserId }) {
  const [tab, setTab] = useState('overview');
  return (
    <div className="screen" data-screen-label="Admin">
      <section className="page-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 80px' }}>
        <header style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: 6 }}>FitAI</div>
          <h1 style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>
            Админка
          </h1>
        </header>

        <div role="tablist" style={{
          display: 'flex', gap: 4, padding: 4, background: 'var(--surface)',
          border: '1px solid var(--line)', borderRadius: 14, marginBottom: 24,
          overflowX: 'auto',
        }}>
          {TABS.map(t => (
            <button key={t.k} type="button" role="tab" aria-selected={tab===t.k}
              onClick={() => setTab(t.k)}
              style={{
                height: 38, padding: '0 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap',
                background: tab === t.k ? 'var(--bg)' : 'transparent',
                color: tab === t.k ? 'var(--ink)' : 'var(--ink-3)',
                boxShadow: tab === t.k ? '0 1px 2px rgba(0,0,0,.08)' : 'none',
              }}>{t.label}</button>
          ))}
        </div>

        {tab === 'overview' && <Overview />}
        {tab === 'users' && <Users currentUserId={currentUserId} />}
        {tab === 'tryons' && <TryOns />}
        {tab === 'catalog' && <Catalog />}
      </section>
    </div>
  );
}

// ── Overview ───────────────────────────────────────────────
const Overview = () => {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api.adminStats().then(setData).catch(e => setErr(e.message));
  }, []);

  if (err) return <ErrorBox msg={err} />;
  if (!data) return <Skeleton h={120} />;

  const stats = [
    { label: 'Пользователей', value: data.users, sub: `+${data.last7d} за 7 дней` },
    { label: 'Примерок всего', value: data.jobs },
    { label: 'Товаров в каталоге', value: data.catalog },
    { label: 'Готовых', value: data.jobsByStatus.done ?? 0, sub: `pending: ${data.jobsByStatus.pending ?? 0} · failed: ${data.jobsByStatus.failed ?? 0}` },
  ];

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        {stats.map(s => (
          <div key={s.label} style={cardStyle}>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.025em',
              fontVariantNumeric: 'tabular-nums', marginTop: 6 }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{s.sub}</div>}
          </div>
        ))}
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Последние регистрации</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {data.recentUsers.length === 0 && <Empty msg="Пока никого" />}
          {data.recentUsers.map(u => (
            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between',
              fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--line-2)' }}>
              <span style={{ color: 'var(--ink)' }}>{u.email}</span>
              <span style={{ color: 'var(--ink-3)' }}>
                {u.role === 'admin' && <RoleBadge role="admin" />}
                {' '}{fmtDate(u.createdAt)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Users ──────────────────────────────────────────────────
const Users = ({ currentUserId }) => {
  const [q, setQ] = useState('');
  const [skip, setSkip] = useState(0);
  const take = 20;
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  const load = useCallback(() => {
    setErr(null);
    api.adminUsers({ q, skip, take }).then(setData).catch(e => setErr(e.message));
  }, [q, skip]);

  useEffect(() => { load(); }, [load]);

  const setRole = async (u, role) => {
    try { await api.adminSetRole(u.id, role); toast.success('Роль обновлена'); load(); }
    catch (e) { toast.error(e.message); }
  };
  const del = async (u) => {
    if (!confirm(`Удалить ${u.email}? Все данные пропадут.`)) return;
    try { await api.adminDeleteUser(u.id); toast.success('Удалён'); load(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input placeholder="Поиск по email…" value={q}
          onChange={e => { setSkip(0); setQ(e.target.value); }}
          style={inputStyle} />
        {data && <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>всего: {data.total}</span>}
      </div>
      {err && <ErrorBox msg={err} />}
      {!data && !err && <Skeleton h={200} />}
      {data && (
        <>
          <div style={cardStyle}>
            <Table cols={['Email','Роль','Создан','Примерок','Аутфитов','']}>
              {data.items.length === 0 && <tr><td colSpan={6}><Empty msg="Ничего не найдено" /></td></tr>}
              {data.items.map(u => (
                <tr key={u.id}>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}><RoleBadge role={u.role} /></td>
                  <td style={{ ...tdStyle, color: 'var(--ink-3)' }}>{fmtDate(u.createdAt)}</td>
                  <td style={tdStyle}>{u._count.tryOnJobs}</td>
                  <td style={tdStyle}>{u._count.outfits}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {u.id !== currentUserId && (
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button onClick={() => setRole(u, u.role === 'admin' ? 'user' : 'admin')}
                          className="chip" style={chipMini}>
                          {u.role === 'admin' ? 'снять админа' : 'сделать админом'}
                        </button>
                        <button onClick={() => del(u)} className="chip"
                          style={{ ...chipMini, color: '#dc2626', borderColor: '#fecaca' }}>
                          удалить
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </Table>
          </div>
          <Pager skip={skip} take={take} total={data.total} onChange={setSkip} />
        </>
      )}
    </div>
  );
};

// ── TryOns ─────────────────────────────────────────────────
const TryOns = () => {
  const [status, setStatus] = useState('');
  const [skip, setSkip] = useState(0);
  const take = 30;
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setErr(null);
    api.adminTryOns({ status, skip, take }).then(setData).catch(e => setErr(e.message));
  }, [status, skip]);

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['', 'pending', 'processing', 'done', 'failed'].map(s => (
          <button key={s || 'all'} onClick={() => { setSkip(0); setStatus(s); }}
            className="chip" style={{ ...chipMini, height: 32, padding: '0 12px',
              background: status === s ? 'var(--ink)' : 'var(--bg)',
              color: status === s ? 'white' : 'var(--ink)' }}>
            {s || 'все'}
          </button>
        ))}
        {data && <span style={{ fontSize: 13, color: 'var(--ink-3)', marginLeft: 'auto', alignSelf: 'center' }}>
          {data.total}
        </span>}
      </div>
      {err && <ErrorBox msg={err} />}
      {!data && !err && <Skeleton h={200} />}
      {data && (
        <>
          <div style={cardStyle}>
            <Table cols={['Когда','Пользователь','Товар','Статус','Результат']}>
              {data.items.length === 0 && <tr><td colSpan={5}><Empty msg="Пусто" /></td></tr>}
              {data.items.map(j => (
                <tr key={j.id}>
                  <td style={{ ...tdStyle, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{fmtDate(j.createdAt)}</td>
                  <td style={tdStyle}>{j.user.email}</td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600 }}>{j.catalogItem.name}</div>
                    {j.catalogItem.brand && <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{j.catalogItem.brand}</div>}
                  </td>
                  <td style={tdStyle}><StatusBadge s={j.status} /></td>
                  <td style={tdStyle}>
                    {j.resultUrl
                      ? <a href={j.resultUrl} target="_blank" rel="noreferrer"
                          style={{ color: 'var(--accent-deep)', fontSize: 13 }}>открыть</a>
                      : <span style={{ color: 'var(--ink-3)' }}>—</span>}
                  </td>
                </tr>
              ))}
            </Table>
          </div>
          <Pager skip={skip} take={take} total={data.total} onChange={setSkip} />
        </>
      )}
    </div>
  );
};

// ── Catalog ────────────────────────────────────────────────
const emptyItem = {
  id: '', cat: 'Топы', name: '', price: 0, brand: '', emoji: '',
  tone: '#3A4A66', accent: '#243044', dark: false,
  imageUrl: '', purchaseUrl: '', priceCents: null, currency: 'RUB',
};

const Catalog = () => {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState(null);

  const load = useCallback(() => {
    setErr(null);
    api.adminCatalog().then(d => setItems(d.items)).catch(e => setErr(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  const del = async (it) => {
    if (!confirm(`Удалить «${it.name}»?`)) return;
    try { await api.adminDeleteItem(it.id); toast.success('Удалено'); load(); }
    catch (e) { toast.error(e.data?.error === 'in_use' ? 'Товар используется в примерках' : e.message); }
  };

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>
          {items ? `${items.length} товаров` : '...'}
        </div>
        <button onClick={() => setEditing({ ...emptyItem, _new: true })}
          className="btn btn-primary" style={{ height: 38, padding: '0 16px' }}>
          + Добавить товар
        </button>
      </div>
      {err && <ErrorBox msg={err} />}
      {!items && !err && <Skeleton h={300} />}
      {items && (
        <div style={cardStyle}>
          <Table cols={['ID','Категория','Название','Бренд','Цена','']}>
            {items.length === 0 && <tr><td colSpan={6}><Empty msg="Каталог пуст" /></td></tr>}
            {items.map(it => (
              <tr key={it.id}>
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 12, color: 'var(--ink-3)' }}>{it.id}</td>
                <td style={tdStyle}>{it.cat}</td>
                <td style={tdStyle}>{it.name}</td>
                <td style={{ ...tdStyle, color: 'var(--ink-3)' }}>{it.brand || '—'}</td>
                <td style={tdStyle}>{it.price.toLocaleString('ru')} ₽</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 6 }}>
                    <button onClick={() => setEditing({ ...it })} className="chip" style={chipMini}>
                      править
                    </button>
                    <button onClick={() => del(it)} className="chip"
                      style={{ ...chipMini, color: '#dc2626', borderColor: '#fecaca' }}>
                      удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}
      {editing && (
        <ItemModal item={editing} onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }} />
      )}
    </div>
  );
};

const ItemModal = ({ item, onClose, onSaved }) => {
  const [form, setForm] = useState(item);
  const [busy, setBusy] = useState(false);

  const upd = (k) => (e) => {
    const v = e.target.type === 'number'
      ? (e.target.value === '' ? null : Number(e.target.value))
      : e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [k]: v }));
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { _new, _count, createdAt, ...payload } = form;
      ['emoji','tone','accent','imageUrl','brand','purchaseUrl'].forEach(k => {
        if (payload[k] === '') payload[k] = null;
      });
      if (_new) await api.adminCreateItem(payload);
      else {
        const { id, ...patch } = payload;
        await api.adminUpdateItem(id, patch);
      }
      toast.success('Сохранено');
      onSaved();
    } catch (e) {
      toast.error(e.data?.error === 'invalid_input' ? 'Проверь поля (URL, цена)' : e.message);
    } finally { setBusy(false); }
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(14,14,16,.5)', backdropFilter: 'blur(6px)',
      display: 'grid', placeItems: 'center', padding: 20,
    }}>
      <form onSubmit={save} onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg)', borderRadius: 18, padding: 24,
        width: '100%', maxWidth: 560, border: '1px solid var(--line)',
        maxHeight: '90vh', overflowY: 'auto',
        display: 'grid', gap: 12,
      }}>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
          {form._new ? 'Новый товар' : `Править: ${form.name}`}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Lbl label="ID (slug)" hint="латиница, уникальный">
            <input required disabled={!form._new} value={form.id} onChange={upd('id')} style={inputStyle} />
          </Lbl>
          <Lbl label="Категория">
            <input required value={form.cat} onChange={upd('cat')} style={inputStyle} />
          </Lbl>
        </div>
        <Lbl label="Название">
          <input required value={form.name} onChange={upd('name')} style={inputStyle} />
        </Lbl>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Lbl label="Бренд">
            <input value={form.brand ?? ''} onChange={upd('brand')} style={inputStyle} />
          </Lbl>
          <Lbl label="Цена, ₽">
            <input required type="number" min={0} value={form.price ?? 0} onChange={upd('price')} style={inputStyle} />
          </Lbl>
        </div>
        <Lbl label="URL картинки">
          <input type="url" placeholder="https://…" value={form.imageUrl ?? ''} onChange={upd('imageUrl')} style={inputStyle} />
        </Lbl>
        <Lbl label="URL покупки">
          <input type="url" placeholder="https://…" value={form.purchaseUrl ?? ''} onChange={upd('purchaseUrl')} style={inputStyle} />
        </Lbl>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <Lbl label="Эмодзи"><input maxLength={4} value={form.emoji ?? ''} onChange={upd('emoji')} style={inputStyle} /></Lbl>
          <Lbl label="Цвет (tone)"><input value={form.tone ?? ''} onChange={upd('tone')} style={inputStyle} /></Lbl>
          <Lbl label="Акцент"><input value={form.accent ?? ''} onChange={upd('accent')} style={inputStyle} /></Lbl>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <input type="checkbox" checked={!!form.dark} onChange={upd('dark')} style={{ accentColor: 'var(--accent)' }} />
          Тёмная вещь (для контраста)
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
          <button type="button" onClick={onClose} className="btn btn-ghost" style={{ height: 40, padding: '0 16px' }}>
            Отмена
          </button>
          <button type="submit" disabled={busy} className="btn btn-primary" style={{ height: 40, padding: '0 18px' }}>
            {busy ? '...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ── helpers ────────────────────────────────────────────────
const cardStyle = {
  background: 'var(--surface)', border: '1px solid var(--line)',
  borderRadius: 14, padding: 18,
};
const tdStyle = { padding: '10px 12px', borderBottom: '1px solid var(--line-2)', fontSize: 13.5, verticalAlign: 'top' };
const thStyle = { padding: '10px 12px', textAlign: 'left', fontSize: 11.5, fontWeight: 600,
  color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase',
  borderBottom: '1px solid var(--line)' };
const inputStyle = {
  width: '100%', height: 38, padding: '0 12px', borderRadius: 9,
  border: '1px solid var(--line)', background: 'var(--bg)',
  color: 'var(--ink)', fontSize: 13.5, fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box',
};
const chipMini = { height: 28, padding: '0 10px', fontSize: 12, borderRadius: 8 };

const Lbl = ({ label, hint, children }) => (
  <label style={{ display: 'block' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)' }}>{label}</span>
      {hint && <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{hint}</span>}
    </div>
    {children}
  </label>
);

const Table = ({ cols, children }) => (
  <div style={{ overflowX: 'auto', margin: -18, padding: 0 }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead><tr>{cols.map((c, i) => <th key={i} style={thStyle}>{c}</th>)}</tr></thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const RoleBadge = ({ role }) => (
  <span style={{
    fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
    padding: '3px 8px', borderRadius: 999,
    background: role === 'admin' ? 'var(--accent-soft)' : 'var(--line-2)',
    color: role === 'admin' ? 'var(--accent-deep)' : 'var(--ink-3)',
  }}>{role}</span>
);

const StatusBadge = ({ s }) => {
  const colors = {
    pending:    ['#fef3c7', '#92400e'],
    processing: ['#dbeafe', '#1e40af'],
    done:       ['#dcfce7', '#166534'],
    failed:     ['#fee2e2', '#991b1b'],
  };
  const [bg, fg] = colors[s] || ['var(--line-2)', 'var(--ink-3)'];
  return <span style={{
    fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
    background: bg, color: fg,
  }}>{s}</span>;
};

const Pager = ({ skip, take, total, onChange }) => {
  const has = total > take;
  if (!has) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
      <span style={{ color: 'var(--ink-3)' }}>
        {skip + 1}–{Math.min(skip + take, total)} из {total}
      </span>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => onChange(Math.max(0, skip - take))} disabled={skip === 0}
          className="chip" style={{ ...chipMini, opacity: skip === 0 ? 0.4 : 1 }}>← назад</button>
        <button onClick={() => onChange(skip + take)} disabled={skip + take >= total}
          className="chip" style={{ ...chipMini, opacity: skip + take >= total ? 0.4 : 1 }}>вперёд →</button>
      </div>
    </div>
  );
};

const Skeleton = ({ h = 100 }) => (
  <div className="shimmer" style={{ height: h, borderRadius: 14, background: 'var(--line-2)' }} />
);
const Empty = ({ msg }) => (
  <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--ink-3)', fontSize: 14 }}>{msg}</div>
);
const ErrorBox = ({ msg }) => (
  <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 14px', borderRadius: 10, fontSize: 13 }}>
    {msg}
  </div>
);

function fmtDate(d) {
  const date = new Date(d);
  return date.toLocaleString('ru', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
