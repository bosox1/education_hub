import { Link } from 'react-router-dom'
import { SECTION_CODES, SECTION_META, itemImage, itemTags, materials } from '../lib/catalog'

function Placeholder({ item, accent }) {
  const m = item.material ? materials[item.material] : null
  return (
    <div className="flex h-full w-full items-center justify-center" style={{ background: accent.softHex, color: accent.hex }}>
      {m?.algorithm ? (
        <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
          <rect x="6" y="5" width="22" height="25" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M11 12h12M11 17h12M11 22h8" stroke="currentColor" strokeWidth="2" />
        </svg>
      ) : (
        <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
          <circle cx="17" cy="17" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M14 11.5l8 5.5-8 5.5z" fill="currentColor" />
        </svg>
      )}
    </div>
  )
}

export default function MaterialRow({ item, sectionKey, showSections = false, query = '' }) {
  const accent = SECTION_META[sectionKey || item.sections?.[0] || 'nursing']
  const img = itemImage(item)
  const tags = itemTags(item)
  const external = item.external || item.href?.startsWith('http')
  const inner = (
    <>
      <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-md bg-line sm:w-44">
        {img ? (
          <img src={img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={(e) => { e.currentTarget.style.display = 'none' }} />
        ) : (
          <Placeholder item={item} accent={accent} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {showSections && (
          <div className="mb-1.5 flex flex-wrap gap-1">
            {item.sections.map((s) => (
              <span key={s} className={`code-tag ${SECTION_META[s].color}`} title={SECTION_META[s].short}>{SECTION_CODES[s]}</span>
            ))}
          </div>
        )}
        <h3 className="text-[16px] font-semibold leading-snug group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 sm:text-[17px]">
          <Highlight text={item.title} query={query} />
          {external && <span aria-label="(відкриється на іншому сайті)" className="ml-1 text-muted">↗</span>}
        </h3>
        {item.subtitle && <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-muted sm:text-[15px]">{item.subtitle}</p>}
        {tags.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <li key={t} className="rounded-full border border-line bg-white px-2 py-0.5 text-[12px] leading-tight text-muted">{t}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
  const cls = 'group flex items-start gap-4 py-4 sm:gap-5'
  return external
    ? <a href={item.href} target="_blank" rel="noopener" className={cls}>{inner}</a>
    : <Link to={item.href} state={{ from: sectionKey }} className={cls}>{inner}</Link>
}

function Highlight({ text, query }) {
  const q = query.trim()
  if (q.length < 2) return text
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-brand-soft text-inherit">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}
