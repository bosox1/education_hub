import { pages } from '../lib/catalog'
import { useTitle } from '../lib/useTitle'

const work = pages.work

export default function Vacancies() {
  useTitle('Вакансії')
  return (
    <>
      <section className="wrap pt-12 lg:pt-16">
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">Вакансії</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Роботодавці надсилають коледжу пропозиції для наших випускників. Списки вакансій оновлюються в документах за кожною спеціальністю.
        </p>
      </section>
      <section className="wrap mt-10 grid gap-4 md:grid-cols-3">
        {work.items.map((w) => (
          <a key={w.title} href={w.href} target="_blank" rel="noopener" className="group overflow-hidden rounded-xl border border-line bg-white hover:border-ink/40">
            <div className="aspect-[4/3] overflow-hidden bg-line">
              <img src={w.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            </div>
            <div className="p-5">
              <h2 className="font-display text-xl font-semibold">{w.title}</h2>
              <p className="mt-2 font-medium text-brand">Відкрити список вакансій ↗</p>
            </div>
          </a>
        ))}
      </section>
    </>
  )
}
