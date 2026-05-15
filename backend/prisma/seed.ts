import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATALOG = [
  { id: 't1', cat: 'Топы', name: 'Свитер оверсайз молоко', price: 4290, emoji: '🧥', tone: '#F4EFE5', accent: '#D9CFB9', dark: false, brand: 'Lime',     purchaseUrl: 'https://lime-shop.com/ru/product/sviter-oversajz' },
  { id: 't2', cat: 'Топы', name: 'Футболка хлопок белая',  price: 1490, emoji: '👕', tone: '#FBFBFB', accent: '#E8E5DE', dark: false, brand: 'Uniqlo',   purchaseUrl: 'https://www.uniqlo.com/eu/en/product/white-cotton-tshirt' },
  { id: 't3', cat: 'Топы', name: 'Рубашка лён песочная',   price: 3990, emoji: '👔', tone: '#EDE3CC', accent: '#C8B68B', dark: false, brand: 'Mango',    purchaseUrl: 'https://shop.mango.com/ru/linen-shirt-sand' },
  { id: 'b1', cat: 'Низ',  name: 'Джинсы прямые indigo',   price: 5490, emoji: '👖', tone: '#3A4A66', accent: '#243044', dark: true,  brand: 'Levi\'s', purchaseUrl: 'https://www.levi.com/RU/ru/clothing/men/jeans/501-original' },
  { id: 'b2', cat: 'Низ',  name: 'Брюки палаццо чёрные',   price: 4890, emoji: '👖', tone: '#1B1B1F', accent: '#0E0E10', dark: true,  brand: 'Zarina',   purchaseUrl: 'https://zarina.ru/catalog/palazzo-trousers' },
  { id: 'b3', cat: 'Низ',  name: 'Юбка миди шоколад',      price: 3690, emoji: '👗', tone: '#5A3826', accent: '#3F2718', dark: true,  brand: 'Befree',   purchaseUrl: 'https://befree.ru/catalog/midi-skirt-chocolate' },
  { id: 's1', cat: 'Обувь', name: 'Кроссовки белые низкие', price: 6990, emoji: '👟', tone: '#F2F0EA', accent: '#D8D2C2', dark: false, brand: 'Adidas',   purchaseUrl: 'https://www.adidas.com/us/stan-smith' },
  { id: 's2', cat: 'Обувь', name: 'Ботинки челси кожа',    price: 8990, emoji: '👢', tone: '#2B1F18', accent: '#19110C', dark: true,  brand: 'Ekonika',  purchaseUrl: 'https://www.ekonika.ru/catalog/chelsea-boots' },
  { id: 's3', cat: 'Обувь', name: 'Балетки чёрные мягкие',  price: 4290, emoji: '👠', tone: '#1B1B1F', accent: '#0E0E10', dark: true,  brand: 'Mascotte', purchaseUrl: 'https://mascotte.ru/catalog/ballet-flats-black' },
  { id: 'o1', cat: 'Верхняя одежда', name: 'Тренч классический бежевый', price: 12490, emoji: '🧥', tone: '#D9C8A6', accent: '#A88E5F', dark: false, brand: 'Massimo Dutti', purchaseUrl: 'https://www.massimodutti.com/ru/trench-classic-beige' },
  { id: 'o2', cat: 'Верхняя одежда', name: 'Пуховик короткий олива',     price: 14990, emoji: '🧥', tone: '#5A6147', accent: '#3F4530', dark: true,  brand: 'Bask',          purchaseUrl: 'https://bask.ru/catalog/short-down-olive' },
  { id: 'o3', cat: 'Верхняя одежда', name: 'Кардиган шерсть серый',       price: 7490, emoji: '🧶', tone: '#9A9A9F', accent: '#6C6C70', dark: false, brand: 'COS',           purchaseUrl: 'https://www.cos.com/ru/wool-cardigan-grey' },
];

async function main() {
  for (const item of CATALOG) {
    const data = { ...item, priceCents: item.price * 100, currency: 'RUB' };
    await prisma.catalogItem.upsert({
      where: { id: item.id },
      update: data,
      create: data,
    });
  }
  console.log(`Seeded ${CATALOG.length} catalog items`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
