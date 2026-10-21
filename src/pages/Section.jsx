import { useMemo } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import MaterialRow from '../components/MaterialRow'
import { SearchInput } from '../components/Search'
import { FILTERS, SECTION_CODES, SECTION_META, SECTION_ORDER, normalize, plural, sections } from '../lib/catalog'
import { useTitle } from '../lib/useTitle'

export default function Section() {
  const { section } = useParams()
  const data = sections[section]
  const meta = SECTION_META[section]
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const filter = params.get('f') || 'all'
  useTitle(meta?.short)

  const update = (patch) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (!v || v === 'all') next.delete(k)
      else next.set(k, v)
    }
    setParams(next, { replace: true })
  }

  const available = useMemo(() => {
    if (!data) return []
    return FILTERS.filter((f) => f.key === 'all' || data.items.some(f.test))
  }, [data])

  const items = useMemo(() => {
    if (!data) return []
    const words = normalize(q).split(' ').filter(Boolean)
    const f = FILTERS.find((x) => x.key === filter)
    return data.items.filter((it) => {
      if (f?.test && !f.test(it)) return false
      const hay = normalize(it.title + ' ' + it.subtitle)
      return words.every((w) => hay.includes(w))
    })
  }, [data, q, filter])

  if (!data) return <Navigate to="/hub" replace />

  return (
    <div style={{ '--accent': meta.hex }}>
      <section className="border-b border-line" style={{ background: `linear-gradient(180deg, ${meta.softHex} 0%, rgba(244,246,246,0) 100%)` }}>
        <div className="wrap pb-10 pt-8 lg:pt-12">
          <nav aria-label="Навігація" className="text-sm text-muted">
            <Link to="/hub" className="hover:text-ink hover:underline">Освітній хаб</Link>
          </nav>
          <div className="mt-4 flex items-center gap-3">
            <span className={`code-tag ${meta.color} text-[13px]`}>{SECTION_CODES[section]}</span>
            <span className="text-muted">спеціальність</span>
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-[-0.01em] sm:text-5xl" style={{ color: meta.hex }}>
            {meta.short}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{meta.lead}</p>
          <p className="mt-3 max-w-2xl text-[15px] text-muted">
            Блоки створили викладачі коледжу та партнери, авторство вказане в кожному блоці.{' '}
            <Link to="/authors" className="underline underline-offset-2 hover:text-ink">Про авторів</Link>
          </p>
        </div>
      </section>

      <section className="wrap mt-8 grid gap-10 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <SearchInput id="section-search" size="md" value={q} onChange={(v) => update({ q: v })} placeholder={`Пошук у розділі`} />
          <div className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start" role="group" aria-label="Фільтр">
            {available.map((f) => {
              const active = filter === f.key
              return (
                <button key={f.key} type="button" onClick={() => update({ f: f.key })} aria-pressed={active}
                  className={`rounded-full border px-3.5 py-1.5 text-[15px] transition-colors ${active ? 'border-transparent text-white' : 'border-line bg-white hover:border-ink/40'}`}
                  style={active ? { background: meta.hex } : undefined}>
                  {f.label}
                </button>
              )
            })}
          </div>
          <div className="mt-8 hidden border-t border-line pt-5 lg:block">
            <p className="text-sm text-muted">Інші напрями</p>
            {SECTION_ORDER.filter((k) => k !== section).map((k) => (
              <Link key={k} to={`/hub/${k}`} className="mt-2 flex items-center gap-2 hover:underline">
                <span className={`code-tag ${SECTION_META[k].color}`}>{SECTION_CODES[k]}</span>
                {SECTION_META[k].short}
              </Link>
            ))}
          </div>
        </aside>

        <div>
          <p className="border-b border-line pb-3 text-sm text-muted" aria-live="polite">
            {items.length === data.items.length
              ? `${items.length} ${plural(items.length, 'блок', 'блоки', 'блоків')}`
              : `Знайдено ${items.length} з ${data.items.length}`}
          </p>
          {items.length === 0 ? (
            <div className="py-12">
              <p className="text-lg">У цьому розділі нічого не знайшлося.</p>
              <button type="button" className="btn-ghost mt-4" onClick={() => update({ q: '', f: '' })}>Скинути пошук і фільтр</button>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {items.map((it) => <MaterialRow key={it.href} item={it} sectionKey={section} query={q} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
