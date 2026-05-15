// === Screen: Upload ===
const UploadScreen = ({ onContinue, photo, setPhoto, activeStyle, setActiveStyle,
                        height, setHeight, weight, setWeight, bodyType, setBodyType,
                        userSize, sizeConf }) => {
  const [dragOver, setDragOver] = React.useState(false);
  return (
    <div className="screen page-pad page-pad-y" data-screen-label="02 Upload"
      style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px 80px' }}>
      <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr', gap: 56, alignItems: 'start' }}>
        {/* left: dropzone */}
        <div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
              color: 'var(--ink-3)', textTransform: 'uppercase' }}>Шаг 1 из 3</div>
            <h1 className="h-large" style={{ fontSize: 56, lineHeight: 1.02, letterSpacing: '-0.04em',
              fontWeight: 700, margin: '10px 0 12px' }}>
              Загрузи своё фото<br />в&nbsp;<span className="serif h-large-serif" style={{ fontSize: 60 }}>полный&nbsp;рост</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--ink-2)', margin: 0, maxWidth: 460 }}>
              Лучший результат: нейтральный фон, фото в&nbsp;полный рост, ровное освещение.
              Обтягивающая одежда даст более точную примерку.
            </p>
          </div>

          {/* dropzone / preview */}
          {!photo ? (
            <div
              onClick={() => setPhoto(true)}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); setPhoto(true); }}
              className="upload-zone"
              style={{
                position: 'relative', height: 480, borderRadius: 22, cursor: 'pointer',
                border: '1.5px dashed ' + (dragOver ? 'var(--accent)' : 'var(--ink-3)'),
                background: dragOver ? 'var(--accent-soft)' : 'var(--warm)',
                transition: 'all .2s ease',
                display: 'grid', placeItems: 'center', overflow: 'hidden'
              }}
            >
              {/* faint silhouette guide */}
              <div style={{ position: 'absolute', top: '5%', bottom: '5%', left: '50%',
                transform: 'translateX(-50%)', width: 'auto', aspectRatio: '200/320',
                opacity: 0.25 }}>
                <Silhouette shirt="#E8E2D2" pants="#8A8A8F" accent="#8A8A8F" skin="#C9B59E" />
              </div>
              <div style={{ position: 'relative', textAlign: 'center', zIndex: 1 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 18, background: 'white',
                  display: 'grid', placeItems: 'center', margin: '0 auto 16px',
                  boxShadow: '0 10px 24px -12px rgba(14,14,16,.2)'
                }}>
                  <UploadIcon size={24} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Перетащи фото сюда</div>
                <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 4 }}>
                  или <span style={{ color: 'var(--accent)', fontWeight: 600 }}>выбери файл</span> · JPG, PNG до 10&nbsp;MB
                </div>
              </div>
            </div>
          ) : (
            <div style={{ position: 'relative', borderRadius: 22, overflow: 'hidden' }}>
              <div style={{ maxWidth: 380, margin: '0 auto' }}>
                <PersonPhoto label="Твоё фото" tagged tone="#EDE6D5"
                  outfit={{ shirt: '#E8DFC9', pants: '#3A4A66', shoes: '#1B1B1F' }} />
              </div>
              <button onClick={() => setPhoto(false)}
                style={{ position: 'absolute', top: 16, right: '50%', transform: 'translateX(190px)',
                  background: 'rgba(14,14,16,.78)', color: 'white', borderRadius: 999,
                  padding: '8px 14px', fontSize: 12.5, fontWeight: 500, backdropFilter: 'blur(8px)'
                }}>
                Заменить
              </button>
            </div>
          )}

          {/* tips row */}
          <div className="grid-3col-tips" style={{
            marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12
          }}>
            {[
              { ok: true, t: 'Нейтральный фон', s: 'Однотонная стена работает лучше всего' },
              { ok: true, t: 'Свет ровный', s: 'Без резких теней на одежде' },
              { ok: false, t: 'Не группой', s: 'На фото должен быть только ты' },
            ].map((tip, i) => (
              <div key={i} style={{
                padding: '12px 14px', background: 'white', borderRadius: 12,
                border: '1px solid var(--line)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: tip.ok ? 'var(--good)' : '#E8E2D2',
                    color: tip.ok ? 'white' : 'var(--ink-3)',
                    display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700
                  }}>{tip.ok ? '✓' : '×'}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{tip.t}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginLeft: 24 }}>{tip.s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* right: style + cta */}
        <div className="upload-right" style={{ position: 'sticky', top: 92 }}>
          <div style={{
            background: 'white', borderRadius: 22, padding: 24, border: '1px solid var(--line)'
          }} className="card-shadow">
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
              color: 'var(--ink-3)', textTransform: 'uppercase' }}>Стиль образа</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '4px 0 16px' }}>
              Что тебе ближе?
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
              {STYLES.map(s => (
                <button key={s} onClick={() => setActiveStyle(s)}
                  className={"chip " + (activeStyle === s ? 'active' : '')}>
                  {s}
                </button>
              ))}
            </div>

            {/* Measurements section */}
            <div style={{ height: 1, background: 'var(--line-2)', margin: '4px -24px 18px' }} />

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
                color: 'var(--ink-3)', textTransform: 'uppercase' }}>Параметры</div>
              <button style={{ fontSize: 11.5, color: 'var(--ink-3)', textDecoration: 'underline',
                textUnderlineOffset: 2 }}>Зачем это?</button>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em', margin: '2px 0 14px' }}>
              Подбор размера
            </h3>

            <MeasureSlider label="Рост" value={height} min={150} max={200} unit="см"
              onChange={setHeight} ticks={[150, 165, 180, 200]} />
            <div style={{ height: 12 }} />
            <MeasureSlider label="Вес" value={weight} min={40} max={120} unit="кг"
              onChange={setWeight} ticks={[40, 60, 80, 120]} />

            <div style={{ marginTop: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 6 }}>Телосложение</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { id: 'slim',   label: 'Худощавое' },
                  { id: 'normal', label: 'Среднее'   },
                  { id: 'curvy',  label: 'Пышное'    },
                ].map(b => (
                  <button key={b.id} onClick={() => setBodyType(b.id)}
                    style={{
                      flex: 1, height: 36, borderRadius: 10,
                      border: '1px solid ' + (bodyType === b.id ? 'var(--solid)' : 'var(--line)'),
                      background: bodyType === b.id ? 'var(--solid)' : 'var(--surface)',
                      color: bodyType === b.id ? 'var(--on-solid)' : 'var(--ink-2)',
                      fontSize: 12.5, fontWeight: 500, transition: 'all .12s',
                      cursor: 'pointer'
                    }}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* recommendation result */}
            <div style={{
              borderRadius: 14, padding: 14, marginBottom: 18,
              background: 'linear-gradient(135deg, var(--accent-soft), color-mix(in srgb, var(--accent-soft) 70%, var(--surface)))',
              border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'var(--accent)', color: 'white',
                display: 'grid', placeItems: 'center',
                fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em',
                boxShadow: '0 8px 18px -8px var(--accent)'
              }}>
                {userSize}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, color: 'var(--accent-deep)', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Рекомендованный размер
                </div>
                <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500, marginTop: 2 }}>
                  Подобран по росту {height} см и весу {weight} кг
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <div style={{ flex: 1, height: 3, background: 'rgba(0,0,0,.08)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: sizeConf + '%', height: '100%', background: 'var(--accent)',
                      transition: 'width .25s' }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--ink-2)', fontVariantNumeric: 'tabular-nums' }}>
                    точность {sizeConf}%
                  </span>
                </div>
              </div>
            </div>

            {/* preview card */}
            <div style={{
              borderRadius: 14, background: 'var(--warm)', padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18,
              fontSize: 12.5, color: 'var(--ink-2)'
            }}>
              <SparkleIcon size={14} />
              <span>Стиль <strong style={{ color: 'var(--ink)' }}>{activeStyle}</strong> ·
                размер <strong style={{ color: 'var(--ink)' }}>{userSize}</strong> учтены при подборе</span>
            </div>

            <button
              className={"btn btn-accent"}
              onClick={onContinue}
              disabled={!photo}
              style={{
                width: '100%', height: 56, fontSize: 16,
                opacity: photo ? 1 : 0.45, cursor: photo ? 'pointer' : 'not-allowed'
              }}>
              Перейти к каталогу
              <ArrowRight size={17} />
            </button>

            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>
              Фото удаляется автоматически через 24 часа
            </div>
          </div>

          {/* small assurance */}
          <div style={{
            marginTop: 12, padding: '14px 16px', background: 'var(--accent-soft)',
            borderRadius: 14, fontSize: 12.5, color: 'var(--accent-deep)',
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%', background: 'white',
              display: 'grid', placeItems: 'center', flexShrink: 0
            }}>🔒</span>
            <span>Фото обрабатывается приватно. Не передаётся брендам и&nbsp;третьим лицам.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

window.UploadScreen = UploadScreen;

// === MeasureSlider: pretty range slider with tick labels ===
const MeasureSlider = ({ label, value, min, max, unit, onChange, ticks = [] }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600, letterSpacing: '-0.01em',
          fontVariantNumeric: 'tabular-nums' }}>
          {value} <span style={{ color: 'var(--ink-3)', fontSize: 12, fontWeight: 500 }}>{unit}</span>
        </span>
      </div>

      <div style={{ position: 'relative', padding: '8px 0' }}>
        {/* track */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '50%', height: 4,
          borderRadius: 4, background: 'var(--warm-2)', transform: 'translateY(-50%)'
        }} />
        {/* fill */}
        <div style={{
          position: 'absolute', left: 0, top: '50%', width: pct + '%', height: 4,
          borderRadius: 4, background: 'var(--accent)', transform: 'translateY(-50%)',
          transition: 'width .12s'
        }} />
        {/* thumb */}
        <div style={{
          position: 'absolute', left: `calc(${pct}% - 10px)`, top: '50%',
          width: 20, height: 20, borderRadius: 10, background: 'var(--surface)',
          border: '2px solid var(--accent)', transform: 'translateY(-50%)',
          boxShadow: '0 4px 10px -4px rgba(0,0,0,.2)', pointerEvents: 'none'
        }} />
        {/* invisible range input */}
        <input type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: 'relative', width: '100%', height: 20,
            background: 'transparent', appearance: 'none', WebkitAppearance: 'none',
            cursor: 'pointer', margin: 0, padding: 0, opacity: 0
          }} />
      </div>

      {/* ticks */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2,
        fontSize: 10.5, color: 'var(--ink-3)', fontVariantNumeric: 'tabular-nums' }}>
        {ticks.map(tk => (
          <span key={tk}>{tk}</span>
        ))}
      </div>
    </div>
  );
};

window.MeasureSlider = MeasureSlider;
