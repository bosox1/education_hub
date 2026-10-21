# Освітній хаб — Фаховий медичний коледж ІФНМУ

Новий сайт коледжу й освітнього хабу на React 18 + Vite 5 + Tailwind CSS 3.
Замінює старий HTML-сайт (репозиторій `obulbuk07/eduhub`): увесь контент перенесено, старі адреси `*.html` перенаправляються на нові.

## Запуск

```bash
npm install
npm run dev       # локально: http://localhost:5173
npm run build     # збірка в dist/
```

Версії Vite і Tailwind закріплені без `^`. Rollup підмінений на WASM-версію (`overrides` у package.json),
бо Windows Smart App Control блокує його нативний бінарник. Tailwind 3 обрано свідомо: він не має нативних бінарників.

## Подкасти (один раз перед першим деплоєм)

MP3 (~230 МБ) не входять в архів. Скопіюйте їх зі старого репозиторію:

```bash
node scripts/copy-podcasts.mjs ../eduhub
```

Файли ляжуть у `public/media/podcasts/` (назви без дужок: `pod9 (2).mp3` → `pod9.mp3`).

## Сторінки

| Адреса | Що там |
|---|---|
| `/` | Головна коледжу |
| `/hub` | Про освітній хаб, пошук по всіх матеріалах |
| `/hub/nursing`, `/hub/dentistry`, `/hub/pharmacy` | Розділи з пошуком і фільтрами (відео, алгоритм, англійською) |
| `/hub/dentistry/podcasts` | Подкасти з плеєром |
| `/material/<id>` | Окремий навчальний блок |
| `/about`, `/authors`, `/nmt`, `/vacancies`, `/tccc` | Про коледж, автори, НМТ, вакансії, курс TCCC |

## Де що лежить

```
src/
  data/catalog.json    розділи хабу й список матеріалів (назви, теги, обкладинки)
  data/pages.json      тексти «Про коледж», «Автори», НМТ, вакансії, подкасти
  lib/catalog.js       кольори розділів, контакти, пошук, посилання на Student Guide
  pages/               сторінки
  components/          шапка/футер, рядок матеріалу, пошук, слайдер
public/
  content/<id>.json    очищений HTML кожного матеріалу (вантажиться при відкритті)
  media/               картинки й файли зі старого сайту (стиснуті до 1800 px)
  _redirects           старі адреси → нові (Netlify)
scripts/
  convert_legacy.py    конвертер старого сайту (Python 3 + beautifulsoup4 + Pillow)
  copy-podcasts.mjs    копіювання подкастів
```

### Як додати новий матеріал

1. Створіть `public/content/<id>.json`: `{ "id": "...", "title": "...", "html": "<p>...</p>" }`.
   Відео YouTube вставляйте як `<div class="embed"><iframe src="https://www.youtube-nocookie.com/embed/ID" allowfullscreen></iframe></div>`,
   таблиці — у `<div class="table-wrap"><table>…</table></div>`.
2. Додайте запис у `src/data/catalog.json` → `materials` і блок у потрібний розділ `sections.<розділ>.items`
   (`href: "/material/<id>"`, `material: "<id>"`, `title`, `subtitle`, `image`).

Конвертер перезаписує `catalog.json`, `pages.json` і `public/content`, тому після ручних правок його вже не запускайте.

## Деплой на Netlify

Налаштування в `netlify.toml`: команда `npm run build`, папка `dist`. `public/_redirects` містить 301-перенаправлення
зі старих адрес і SPA-фолбек `/* /index.html 200`.
