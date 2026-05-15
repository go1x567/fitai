export const CATALOG = [
  { id: 't1', cat: 'Топы', name: 'Свитер оверсайз молоко', price: 4290, emoji: '🧥', tone: '#F4EFE5', accent: '#D9CFB9', brand: 'Lime',          purchaseUrl: 'https://lime-shop.com/ru/product/sviter-oversajz' },
  { id: 't2', cat: 'Топы', name: 'Футболка хлопок белая',  price: 1490, emoji: '👕', tone: '#FBFBFB', accent: '#E8E5DE', brand: 'Uniqlo',        purchaseUrl: 'https://www.uniqlo.com/eu/en/product/white-cotton-tshirt' },
  { id: 't3', cat: 'Топы', name: 'Рубашка лён песочная',   price: 3990, emoji: '👔', tone: '#EDE3CC', accent: '#C8B68B', brand: 'Mango',         purchaseUrl: 'https://shop.mango.com/ru/linen-shirt-sand' },
  { id: 'b1', cat: 'Низ',  name: 'Джинсы прямые indigo',   price: 5490, emoji: '👖', tone: '#3A4A66', accent: '#243044', dark: true, brand: "Levi's", purchaseUrl: 'https://www.levi.com/RU/ru/clothing/men/jeans/501-original' },
  { id: 'b2', cat: 'Низ',  name: 'Брюки палаццо чёрные',   price: 4890, emoji: '👖', tone: '#1B1B1F', accent: '#0E0E10', dark: true, brand: 'Zarina', purchaseUrl: 'https://zarina.ru/catalog/palazzo-trousers' },
  { id: 'b3', cat: 'Низ',  name: 'Юбка миди шоколад',      price: 3690, emoji: '👗', tone: '#5A3826', accent: '#3F2718', dark: true, brand: 'Befree', purchaseUrl: 'https://befree.ru/catalog/midi-skirt-chocolate' },
  { id: 's1', cat: 'Обувь', name: 'Кроссовки белые низкие', price: 6990, emoji: '👟', tone: '#F2F0EA', accent: '#D8D2C2', brand: 'Adidas',        purchaseUrl: 'https://www.adidas.com/us/stan-smith' },
  { id: 's2', cat: 'Обувь', name: 'Ботинки челси кожа',    price: 8990, emoji: '👢', tone: '#2B1F18', accent: '#19110C', dark: true, brand: 'Ekonika', purchaseUrl: 'https://www.ekonika.ru/catalog/chelsea-boots' },
  { id: 's3', cat: 'Обувь', name: 'Балетки чёрные мягкие',  price: 4290, emoji: '👠', tone: '#1B1B1F', accent: '#0E0E10', dark: true, brand: 'Mascotte', purchaseUrl: 'https://mascotte.ru/catalog/ballet-flats-black' },
  { id: 'o1', cat: 'Верхняя одежда', name: 'Тренч классический бежевый', price: 12490, emoji: '🧥', tone: '#D9C8A6', accent: '#A88E5F', brand: 'Massimo Dutti', purchaseUrl: 'https://www.massimodutti.com/ru/trench-classic-beige' },
  { id: 'o2', cat: 'Верхняя одежда', name: 'Пуховик короткий олива',     price: 14990, emoji: '🧥', tone: '#5A6147', accent: '#3F4530', dark: true, brand: 'Bask',  purchaseUrl: 'https://bask.ru/catalog/short-down-olive' },
  { id: 'o3', cat: 'Верхняя одежда', name: 'Кардиган шерсть серый',       price: 7490, emoji: '🧶', tone: '#9A9A9F', accent: '#6C6C70', brand: 'COS',          purchaseUrl: 'https://www.cos.com/ru/wool-cardigan-grey' },
];

export const TABS = ['Все', 'Топы', 'Низ', 'Обувь', 'Верхняя одежда'];
export const STYLES = ['Casual', 'Streetwear', 'Business', 'Sport', 'Romantic', 'Minimalism'];
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const fmtPrice = (n) => n.toLocaleString('ru-RU') + ' ₽';

export function recommendSize(height, weight, type = 'normal') {
  let i;
  if (weight < 52)       i = 0;
  else if (weight < 60)  i = 1;
  else if (weight < 70)  i = 2;
  else if (weight < 80)  i = 3;
  else if (weight < 92)  i = 4;
  else                   i = 5;

  if (height >= 184 && i < 5) i += 0.4;
  if (height <= 158 && i > 0) i -= 0.3;

  if (type === 'curvy') i += 0.6;
  if (type === 'slim')  i -= 0.4;

  i = Math.max(0, Math.min(SIZES.length - 1, Math.round(i)));
  return SIZES[i];
}

export function sizeConfidence(height, weight, type) {
  const bands = [52, 60, 70, 80, 92];
  const dist = Math.min(...bands.map(b => Math.abs(weight - b)));
  const heightPen = (height < 158 || height > 190) ? 4 : 0;
  const c = Math.round(98 - Math.max(0, 4 - dist) * 1.5 - heightPen);
  return Math.max(82, Math.min(98, c));
}
