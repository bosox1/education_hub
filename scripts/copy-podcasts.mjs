// Копіює mp3-подкасти зі старого репозиторію в public/media/podcasts
// (без дужок і пробілів у назвах).
//   node scripts/copy-podcasts.mjs ../eduhub
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const legacy = process.argv[2]
if (!legacy) {
  console.error('Вкажіть шлях до старого репозиторію: node scripts/copy-podcasts.mjs ../eduhub')
  process.exit(1)
}
const from = join(legacy, 'Stomatology', 'podcasts')
if (!existsSync(from)) {
  console.error(`Не знайдено папку ${from}`)
  process.exit(1)
}
const to = join('public', 'media', 'podcasts')
mkdirSync(to, { recursive: true })
let n = 0
for (const f of readdirSync(from)) {
  if (!f.endsWith('.mp3')) continue
  const name = f.replace(/\s*\(\d+\)/, '')
  copyFileSync(join(from, f), join(to, name))
  console.log(`${f} -> ${name}`)
  n++
}
console.log(`Скопійовано ${n} файлів у ${to}`)
