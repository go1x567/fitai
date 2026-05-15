// Catalog data
const CATALOG = [
  { id: 't1', cat: 'Топы', name: 'Свитер оверсайз молоко', price: 4290, emoji: '🧥', tone: '#F4EFE5', accent: '#D9CFB9' },
  { id: 't2', cat: 'Топы', name: 'Футболка хлопок белая', price: 1490, emoji: '👕', tone: '#FBFBFB', accent: '#E8E5DE' },
  { id: 't3', cat: 'Топы', name: 'Рубашка лён песочная', price: 3990, emoji: '👔', tone: '#EDE3CC', accent: '#C8B68B' },
  { id: 'b1', cat: 'Низ',  name: 'Джинсы прямые indigo', price: 5490, emoji: '👖', tone: '#3A4A66', accent: '#243044', dark: true },
  { id: 'b2', cat: 'Низ',  name: 'Брюки палаццо чёрные', price: 4890, emoji: '👖', tone: '#1B1B1F', accent: '#0E0E10', dark: true },
  { id: 'b3', cat: 'Низ',  name: 'Юбка миди шоколад', price: 3690, emoji: '👗', tone: '#5A3826', accent: '#3F2718', dark: true },
  { id: 's1', cat: 'Обувь', name: 'Кроссовки белые низкие', price: 6990, emoji: '👟', tone: '#F2F0EA', accent: '#D8D2C2' },
  { id: 's2', cat: 'Обувь', name: 'Ботинки челси кожа', price: 8990, emoji: '👢', tone: '#2B1F18', accent: '#19110C', dark: true },
  { id: 's3', cat: 'Обувь', name: 'Балетки чёрные мягкие', price: 4290, emoji: '👠', tone: '#1B1B1F', accent: '#0E0E10', dark: true },
  { id: 'o1', cat: 'Верхняя одежда', name: 'Тренч классический бежевый', price: 12490, emoji: '🧥', tone: '#D9C8A6', accent: '#A88E5F' },
  { id: 'o2', cat: 'Верхняя одежда', name: 'Пуховик короткий олива', price: 14990, emoji: '🧥', tone: '#5A6147', accent: '#3F4530', dark: true },
  { id: 'o3', cat: 'Верхняя одежда', name: 'Кардиган шерсть серый', price: 7490, emoji: '🧶', tone: '#9A9A9F', accent: '#6C6C70' },
];

const TABS = ['Все', 'Топы', 'Низ', 'Обувь', 'Верхняя одежда'];
const STYLES = ['Casual', 'Streetwear', 'Business', 'Sport', 'Romantic', 'Minimalism'];

const fmtPrice = (n) => n.toLocaleString('ru-RU') + ' ₽';

// Recommend a clothing size based on height (cm), weight (kg), and body type
// type: 'slim' | 'normal' | 'curvy'
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function recommendSize(height, weight, type = 'normal') {
  // Base from weight band
  let i;
  if (weight < 52)       i = 0; // XS
  else if (weight < 60)  i = 1; // S
  else if (weight < 70)  i = 2; // M
  else if (weight < 80)  i = 3; // L
  else if (weight < 92)  i = 4; // XL
  else                   i = 5; // XXL

  // Adjust for very tall / very short
  if (height >= 184 && i < 5) i += 0.4;
  if (height <= 158 && i > 0) i -= 0.3;

  // Body type
  if (type === 'curvy') i += 0.6;
  if (type === 'slim')  i -= 0.4;

  i = Math.max(0, Math.min(SIZES.length - 1, Math.round(i)));
  return SIZES[i];
}

// Rough confidence ─ closer to band centers = higher
function sizeConfidence(height, weight, type) {
  // Penalize extreme params or "edge" weights between bands
  const bands = [52, 60, 70, 80, 92];
  const dist = Math.min(...bands.map(b => Math.abs(weight - b)));
  const heightPen = (height < 158 || height > 190) ? 4 : 0;
  const c = Math.round(98 - Math.max(0, 4 - dist) * 1.5 - heightPen);
  return Math.max(82, Math.min(98, c));
}

window.CATALOG = CATALOG;
window.TABS = TABS;
window.STYLES = STYLES;
window.SIZES = SIZES;
window.fmtPrice = fmtPrice;
window.recommendSize = recommendSize;
window.sizeConfidence = sizeConfidence;
