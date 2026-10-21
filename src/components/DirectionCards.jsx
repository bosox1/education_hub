import { Link } from 'react-router-dom'
import { SECTION_CODES, SECTION_META, SECTION_ORDER, pages, plural, sections } from '../lib/catalog'

/** Три напрями хабу: фото, код спеціальності, кількість матеріалів */
export default function DirectionCards({ tone = 'light' }) {
  const banners = pages.home.banners
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {SECTION_ORDER.map((k) => {
        const meta = SECTION_META[k]
        const count = sections[k].items.length
        return (
          <Link key={k} to={`/hub/${k}`}
            className={`group relative flex flex-col overflow-hidden rounded-xl ${tone === 'dark' ? 'bg-white text-ink' : 'border border-line bg-white'}`}>
            <div className="relative aspect-[16/9] overflow-hidden">
              <img src={banners[k]} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              <span className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: meta.hex }} />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-2 text-sm text-muted">
                <span className={`code-tag ${meta.color}`}>{SECTION_CODES[k]}</span>
                спеціальність
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold">{meta.short}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-snug text-muted">{meta.lead}</p>
              <p className="mt-4 font-medium" style={{ color: meta.hex }}>
                {count} {plural(count, 'навчальний блок', 'навчальні блоки', 'навчальних блоків')}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
