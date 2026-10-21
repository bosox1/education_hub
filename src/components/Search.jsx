import { useMemo, useState } from 'react'
import MaterialRow from './MaterialRow'
import { plural, search } from '../lib/catalog'

export function SearchInput({ value, onChange, placeholder, size = 'lg', id = 'search' }) {
  const big = size === 'lg'
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{placeholder}</label>
      <svg className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${big ? 'left-5' : 'left-3.5'}`} width={big ? 22 : 18} height={big ? 22 : 18} viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="9.5" cy="9.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14.5 14.5L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full rounded-lg border border-ink/15 bg-white text-ink shadow-[0_1px_0_rgba(26,31,36,.04)] placeholder:text-muted/80 focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/10 ${big ? 'h-16 pl-14 pr-5 text-lg' : 'h-12 pl-11 pr-4 text-base'}`}
      />
    </div>
  )
}

/** Пошук по всіх розділах хабу з результатами під полем */
export function HubSearch({ id = 'hub-search' }) {
  const [q, setQ] = useState('')
  const results = useMemo(() => (q.trim().length > 1 ? search(q) : []), [q])
  const shown = results.slice(0, 10)
  return (
    <div>
      <SearchInput id={id} value={q} onChange={setQ} placeholder="Пошук: «ін’єкція», «відбитки», «ЄДКІ»…" />
      {q.trim().length > 1 && (
        <div className="mt-3 rounded-lg border border-line bg-white px-4 sm:px-5" aria-live="polite">
          {results.length === 0 ? (
            <p className="py-5 text-muted">Нічого не знайшли за запитом «{q}». Спробуйте коротше слово або іншу форму, наприклад «клізм» замість «клізма».</p>
          ) : (
            <>
              <p className="border-b border-line py-3 text-sm text-muted">
                {results.length} {plural(results.length, 'матеріал', 'матеріали', 'матеріалів')}
                {results.length > shown.length && `, показано перші ${shown.length}`}
              </p>
              <div className="divide-y divide-line">
                {shown.map((it) => <MaterialRow key={it.href} item={it} showSections query={q} sectionKey={it.sections[0]} />)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
