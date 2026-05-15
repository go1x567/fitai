import { useState } from 'react';
import { ArrowLeft, ArrowRight, SparkleIcon, UploadIcon, CheckIcon, RefreshIcon } from '../components/UI';

const STEPS = [
  {
    n: '01',
    title: 'Загрузка фото',
    desc: 'Сделай селфи в полный рост на нейтральном фоне — обычная футболка, ровный свет. Алгоритм извлекает позу, пропорции и точки ключевых суставов за 0.6 сек.',
    bullets: ['Поддержка JPG/PNG до 10 MB', 'Анализ позы по 17 точкам', 'Автокадрирование'],
    tone: '#F4EFE5',
    icon: <UploadIcon size={28} />,
  },
  {
    n: '02',
    title: 'Выбор вещи',
    desc: 'Открываешь каталог — товары Lamoda, Wildberries, Ozon и других. По карточке кликаешь "Примерить" — ИИ сразу запускает генерацию.',
    bullets: ['120+ магазинов-партнёров', 'Каталог обновляется ежедневно', 'Фильтр по стилю, цене и цвету'],
    tone: '#EDE3CC',
    icon: <CheckIcon size={28} />,
  },
  {
    n: '03',
    title: 'Генерация образа',
    desc: 'Diffusion-модель надевает вещь на твоё тело с правильной тенью, тканью и складками. Перегенерация — если результат не устроил.',
    bullets: ['Время генерации: 2–20 сек', 'Точность подгонки: 94%', 'Регенерация без ограничений на Pro'],
    tone: '#D9C8A6',
    icon: <SparkleIcon size={28} />,
  },
  {
    n: '04',
    title: 'Покупка',
    desc: 'Собрал образ — нажимаешь "Купить всё". Переход напрямую к магазину-партнёру. Мы не накручиваем цену, не берём комиссию с покупателя.',
    bullets: ['Прямой переход к партнёру', 'Цена не отличается от оригинала', 'Возврат — через магазин'],
    tone: '#5A6147',
    icon: <ArrowRight size={28} />,
    dark: true,
  },
];

const FAQ = [
  {
    q: 'Насколько точно ИИ показывает, как сядет вещь?',
    a: 'Точность зависит от качества фото и правильности параметров. На стандартной фотографии точность 92–96%. Цвет ткани может отличаться от реального на 3–5% — поэтому в карточке мы показываем оригинальную фотографию товара рядом.',
  },
  {
    q: 'Куда отправляется моё фото?',
    a: 'Фото обрабатывается на наших серверах в Москве, шифруется AES-256, удаляется через 24 часа. Не передаётся третьим лицам, не используется для обучения модели без явного согласия.',
  },
  {
    q: 'Можно ли примерять не на себе, а на другом человеке?',
    a: 'Да, но загружай только то фото, на использование которого у тебя есть согласие. На Pro-тарифе можно создать до 5 профилей (например, для семьи).',
  },
  {
    q: 'Что если я между размерами?',
    a: 'Алгоритм рекомендует размер по росту/весу/типу телосложения и показывает точность подбора (например, "92%"). На карточке товара видна размерная сетка магазина — можно посмотреть точные обхваты.',
  },
  {
    q: 'Бесплатный тариф ограничен?',
    a: '5 примерок в месяц, базовое качество (HD на Pro), история 7 дней. Этого хватает чтобы понять, нравится ли тебе сам подход. Без карты, без обязательств.',
  },
  {
    q: 'Работает ли на телефоне?',
    a: 'Да, веб-версия адаптирована под мобильные. Мобильное приложение iOS/Android — Q3 2026, можно подписаться на бету.',
  },
];

const FaqRow = ({ q, a, idx }) => {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div style={{
      borderBottom: '1px solid var(--line-2)',
      transition: 'background .15s'
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', textAlign: 'left', padding: '22px 4px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
      }}>
        <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
          {q}
        </span>
        <span style={{
          width: 28, height: 28, borderRadius: '50%',
          background: open ? 'var(--accent)' : 'var(--warm)',
          color: open ? 'white' : 'var(--ink-2)',
          display: 'grid', placeItems: 'center', flexShrink: 0,
          transition: 'all .15s', transform: open ? 'rotate(45deg)' : 'rotate(0)'
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div style={{
        maxHeight: open ? 400 : 0, overflow: 'hidden',
        transition: 'max-height .25s ease, opacity .2s', opacity: open ? 1 : 0
      }}>
        <p style={{
          padding: '0 4px 22px', margin: 0, fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 720
        }}>
          {a}
        </p>
      </div>
    </div>
  );
};

export const HowScreen = ({ onStart, onBack }) => (
  <div className="screen page-pad" style={{ maxWidth: 960, margin: '0 auto', padding: '32px 32px 80px' }}>
    <button onClick={onBack} style={{
      display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-2)',
      fontSize: 13.5, marginBottom: 28
    }}>
      <ArrowLeft size={14} /> На главную
    </button>

    <div style={{ marginBottom: 56 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 12px', borderRadius: 999, background: 'var(--accent-soft)',
        color: 'var(--accent-deep)', fontSize: 12.5, fontWeight: 600, marginBottom: 20
      }}>
        <SparkleIcon size={13} /> Как это работает
      </div>
      <h1 className="h-large" style={{
        fontSize: 64, lineHeight: 1.02, letterSpacing: '-0.04em',
        fontWeight: 700, margin: '0 0 18px'
      }}>
        От селфи до образа<br/>
        за <span className="serif h-large-serif" style={{ fontSize: 70 }}>40 секунд</span>
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.5, color: 'var(--ink-2)', margin: 0, maxWidth: 640 }}>
        ИИ-примерочная — это не магия, а связка из трёх алгоритмов: оценки позы,
        переноса ткани и финального рендера. Разбираем по шагам.
      </p>
    </div>

    <div className="stagger" style={{ display: 'grid', gap: 22, marginBottom: 64 }}>
      {STEPS.map((s, i) => (
        <div key={s.n} style={{ '--i': i,
          background: s.dark ? s.tone : 'var(--surface)',
          color: s.dark ? '#F4F2EE' : 'var(--ink)',
          border: '1px solid ' + (s.dark ? 'transparent' : 'var(--line)'),
          borderRadius: 22, padding: 28, display: 'grid',
          gridTemplateColumns: '64px 1fr', gap: 22, alignItems: 'start'
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 14,
            background: s.dark ? 'rgba(255,255,255,.1)' : s.tone,
            color: s.dark ? '#F4F2EE' : 'var(--ink)',
            display: 'grid', placeItems: 'center', flexShrink: 0
          }}>{s.icon}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
              opacity: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>Шаг {s.n}</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
              {s.title}
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.55, margin: '0 0 16px',
              color: s.dark ? 'rgba(244,242,238,.8)' : 'var(--ink-2)' }}>
              {s.desc}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0,
              display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {s.bullets.map(b => (
                <li key={b} style={{
                  padding: '6px 12px', borderRadius: 999,
                  background: s.dark ? 'rgba(255,255,255,.1)' : 'var(--warm)',
                  fontSize: 12.5, fontWeight: 500
                }}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>

    <div style={{ marginBottom: 28 }}>
      <h2 className="h-section" style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 4px' }}>
        Частые <span className="serif" style={{ fontSize: 38 }}>вопросы</span>
      </h2>
      <p style={{ fontSize: 15, color: 'var(--ink-3)', margin: 0 }}>
        Не нашёл ответ? Напиши в <a href="#" style={{ color: 'var(--accent)' }}>support@fitai.ru</a>
      </p>
    </div>

    <div style={{ marginBottom: 64 }}>
      {FAQ.map((f, i) => <FaqRow key={f.q} q={f.q} a={f.a} idx={i} />)}
    </div>

    <div style={{
      background: 'var(--solid)', color: 'var(--on-solid)',
      borderRadius: 22, padding: '40px 32px', textAlign: 'center'
    }}>
      <h3 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
        Готов попробовать?
      </h3>
      <p style={{ fontSize: 16, opacity: 0.7, margin: '0 0 24px' }}>
        Первые 5 примерок бесплатно, карта не нужна.
      </p>
      <button onClick={onStart} className="btn btn-accent" style={{ height: 56, padding: '0 28px', fontSize: 16 }}>
        Загрузить фото <ArrowRight size={16} />
      </button>
    </div>
  </div>
);
