import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { SECTION_CODES, SECTION_META, itemTags, materials, sections } from '../lib/catalog'
import { useTitle } from '../lib/useTitle'
import NotFound from './NotFound'

export default function Material() {
  const { id } = useParams()
  const m = materials[id]
  const { state } = useLocation()
  const navigate = useNavigate()
  const [doc, setDoc] = useState(null)
  const [error, setError] = useState(false)
  const body = useRef(null)
  useTitle(m?.title)

  const sectionKey = (state?.from && m?.sections?.includes(state.from) ? state.from : m?.sections?.[0]) || 'nursing'
  const meta = SECTION_META[sectionKey]

  useEffect(() => {
    if (!m) return
    let alive = true
    setDoc(null); setError(false)
    fetch(`/content/${id}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => alive && setDoc(d))
      .catch(() => alive && setError(true))
    return () => { alive = false }
  }, [id, m])

  // внутрішні посилання зі старого HTML відкриваємо без перезавантаження
  useEffect(() => {
    const el = body.current
    if (!el) return
    const onClick = (e) => {
      const a = e.target.closest('a[data-internal]')
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return
      e.preventDefault()
      navigate(a.getAttribute('href'), { state: { from: sectionKey } })
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [doc, navigate, sectionKey])

  if (!m) return <NotFound />

  const list = sections[sectionKey].items.filter((it) => it.material)
  const pos = list.findIndex((it) => it.material === id)
  const prev = pos > 0 ? list[pos - 1] : null
  const next = pos >= 0 && pos < list.length - 1 ? list[pos + 1] : null
  const entry = list[pos] || { material: id, title: m.title }
  const tags = itemTags(entry)

  return (
    <article style={{ '--accent': meta.hex, '--accent-soft': meta.softHex }}>
      <header className="border-b border-line bg-white">
        <div className="wrap pb-8 pt-8 lg:pb-10 lg:pt-10">
          <nav aria-label="Навігація" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
            <Link to="/hub" className="hover:text-ink hover:underline">Освітній хаб</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/hub/${sectionKey}`} className="inline-flex items-center gap-1.5 hover:text-ink hover:underline">
              <span className={`code-tag ${meta.color}`}>{SECTION_CODES[sectionKey]}</span>
              {meta.short}
            </Link>
          </nav>
          <h1 className="mt-5 max-w-4xl font-display text-[1.7rem] font-semibold leading-[1.15] tracking-[-0.01em] sm:text-4xl" lang={m.lang}>
            {m.title}
          </h1>
          {entry.subtitle && <p className="mt-3 max-w-3xl text-lg text-muted">{entry.subtitle}</p>}
          {tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((t) => <li key={t} className="rounded-full border border-line px-2.5 py-0.5 text-[13px] text-muted">{t}</li>)}
            </ul>
          )}
        </div>
      </header>

      <div className="wrap pt-10">
        {error && (
          <div className="rounded-lg border border-line bg-white p-6">
            <p className="font-semibold">Не вдалося завантажити матеріал.</p>
            <p className="mt-1 text-muted">Перевірте з’єднання з інтернетом і оновіть сторінку.</p>
            <button type="button" onClick={() => window.location.reload()} className="btn mt-4">Оновити сторінку</button>
          </div>
        )}
        {!doc && !error && (
          <div className="max-w-read animate-pulse space-y-3" aria-label="Завантаження">
            <div className="h-4 w-3/4 rounded bg-line" />
            <div className="h-4 w-full rounded bg-line" />
            <div className="h-4 w-5/6 rounded bg-line" />
            <div className="mt-6 aspect-video max-w-[52rem] rounded-lg bg-line" />
          </div>
        )}
        {doc && <div ref={body} className="doc" lang={m.lang} dangerouslySetInnerHTML={{ __html: doc.html }} />}

        {(prev || next) && (
          <nav aria-label="Сусідні матеріали" className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
            {prev ? (
              <Link to={`/material/${prev.material}`} state={{ from: sectionKey }} className="group rounded-lg border border-line bg-white p-4 hover:border-ink/40">
                <span className="text-sm text-muted">← Попередній</span>
                <span className="mt-1 block font-medium leading-snug group-hover:underline">{prev.title}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link to={`/material/${next.material}`} state={{ from: sectionKey }} className="group rounded-lg border border-line bg-white p-4 text-right hover:border-ink/40">
                <span className="text-sm text-muted">Наступний →</span>
                <span className="mt-1 block font-medium leading-snug group-hover:underline">{next.title}</span>
              </Link>
            )}
          </nav>
        )}
        <Link to={`/hub/${sectionKey}`} className="btn-ghost mt-8">Усі матеріали розділу «{meta.short}»</Link>
      </div>
    </article>
  )
}
