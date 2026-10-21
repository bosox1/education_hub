import { pages } from '../lib/catalog'
import { useTitle } from '../lib/useTitle'

const nmt = pages.nmt

function host(url) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return url }
}

export default function Nmt() {
  useTitle('Підготовка до НМТ')
  return (
    <>
      <section className="wrap pt-12 lg:pt-16">
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">Підготовка до НМТ</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Корисні посилання для вступників: пробне тестування, взірці завдань і офіційна інформація Українського центру оцінювання якості освіти.
        </p>
      </section>

      <section className="wrap mt-10 grid gap-4 md:grid-cols-2">
        {nmt.cards.map((c) => (
          <a key={c.href} href={c.href} target="_blank" rel="noopener" className="group flex flex-col rounded-xl bg-brand p-6 text-white sm:p-8">
            <h2 className="font-display text-xl font-semibold leading-snug sm:text-2xl">{c.title}</h2>
            {c.text && <p className="mt-3 text-white/85">{c.text}</p>}
            <span className="mt-6 inline-flex w-fit rounded-md bg-white px-4 py-2 font-medium text-ink group-hover:bg-white/90">Перейти на {host(c.href)} ↗</span>
          </a>
        ))}
      </section>

      <section className="wrap mt-14 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold">Офіційна інформація</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {nmt.rules.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener" className="flex items-baseline justify-between gap-4 py-3.5 hover:text-brand">
                  <span className="font-medium">{l.label}</span>
                  <span className="shrink-0 text-sm text-muted">{host(l.href)} ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">Тренувальні тести</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {nmt.resources.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener" className="flex items-baseline justify-between gap-4 py-3.5 hover:text-brand">
                  <span className="font-medium">{l.label}</span>
                  <span className="shrink-0 text-sm text-muted">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
