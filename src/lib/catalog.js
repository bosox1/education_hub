import catalog from '../data/catalog.json'
import pages from '../data/pages.json'

export { pages }
export const sections = catalog.sections
export const materials = catalog.materials

export const SECTION_ORDER = ['nursing', 'dentistry', 'pharmacy']
export const SECTION_CODES = { nursing: '223', dentistry: '221', pharmacy: '226' }

// Тексти й кольори розділів, яких немає в старому HTML
export const SECTION_META = {
  nursing: {
    slug: 'nursing',
    short: 'Медсестринство',
    lead: 'Маніпуляції з відео та покроковими алгоритмами, підготовка до ЄДКІ, тактична медицина й навчальні модулі колег з Канади.',
    color: 'bg-nursing', text: 'text-nursing', soft: 'bg-nursing-soft',
    hex: '#0E7C7B', softHex: '#E1F0EF',
  },
  dentistry: {
    slug: 'dentistry',
    short: 'Стоматологія',
    lead: 'Клініко-лабораторні етапи ортопедичних конструкцій, відбитки, артикулятори, цифрові протоколи та подкасти.',
    color: 'bg-dentistry', text: 'text-dentistry', soft: 'bg-dentistry-soft',
    hex: '#2F5DA8', softHex: '#E4EBF6',
  },
  pharmacy: {
    slug: 'pharmacy',
    short: 'Фармація',
    lead: 'Експрес-методи ідентифікації, лабораторні досліди з органічної хімії, фармацевтична опіка та культура сервісу в аптеці.',
    color: 'bg-pharmacy', text: 'text-pharmacy', soft: 'bg-pharmacy-soft',
    hex: '#B26F12', softHex: '#F6ECDD',
  },
}

export const CONTACTS = {
  email: 'college@ifnmu.edu.ua',
  phone: '+38 0342 53 02 03',
  phoneHref: 'tel:+380342530203',
  address: 'м. Івано-Франківськ, вул. Галицька, 2',
  map: 'https://goo.gl/maps/gQ7YLqAjXkmaRfe1A',
  social: [
    { name: 'Instagram', href: 'https://www.instagram.com/collegeifnmu/' },
    { name: 'Facebook', href: 'https://www.facebook.com/collegeifnmu/' },
    { name: 'Telegram', href: 'https://t.me/collegeifnmu' },
    { name: 'YouTube', href: 'https://youtu.be/2pyi5pXK-Pw' },
  ],
}

export const STUDENT_GUIDE = 'https://studentguide.ifnmu.edu.ua/'

/* ---------- Пошук ---------- */
export function normalize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[’'ʼ`"«»“”]/g, '')
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Теги блоку — те, що реально є в матеріалі */
export function itemTags(item) {
  const m = item.material ? materials[item.material] : null
  const tags = []
  if (item.flavor === 'podcasts') tags.push('Аудіо')
  if (m?.videos) tags.push(m.videos > 1 ? `${m.videos} відео` : 'Відео')
  if (m?.algorithm) tags.push('Алгоритм')
  if (m?.files) tags.push('Файли')
  if (m?.lang === 'en' || item.flavor === 'canada') tags.push('English')
  if (item.external || item.flavor === 'tccc') tags.push('Зовнішній ресурс')
  return tags
}

export const FILTERS = [
  { key: 'all', label: 'Усе' },
  { key: 'video', label: 'З відео', test: (it) => materials[it.material]?.videos > 0 },
  { key: 'algo', label: 'Алгоритм дій', test: (it) => materials[it.material]?.algorithm },
  { key: 'en', label: 'Англійською', test: (it) => it.flavor === 'canada' || materials[it.material]?.lang === 'en' },
]

export function itemHref(item) {
  return item.href
}

export function itemImage(item) {
  const m = item.material ? materials[item.material] : null
  return item.image || m?.thumb || null
}

/** Плаский індекс усіх блоків хабу для глобального пошуку */
export const searchIndex = (() => {
  const seen = new Map()
  for (const key of SECTION_ORDER) {
    for (const it of sections[key].items) {
      const id = it.href
      if (seen.has(id)) {
        seen.get(id).sections.push(key)
        continue
      }
      const m = it.material ? materials[it.material] : null
      seen.set(id, {
        ...it,
        sections: [key],
        hay: normalize([it.title, it.subtitle, m?.title, m?.desc].join(' ')),
      })
    }
  }
  return [...seen.values()]
})()

export function search(query, list = searchIndex) {
  const words = normalize(query).split(' ').filter(Boolean)
  if (!words.length) return list
  return list.filter((it) => words.every((w) => (it.hay ?? normalize(it.title + ' ' + it.subtitle)).includes(w)))
}

export const totalMaterials = searchIndex.length

export function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few
  return many
}
