import { Link } from 'react-router-dom'
import DirectionCards from '../components/DirectionCards'
import { HubSearch } from '../components/Search'
import { pages } from '../lib/catalog'
import { useTitle } from '../lib/useTitle'

const hub = pages.hub

export default function Hub() {
  useTitle('Освітній хаб')
  return (
    <>
      <section className="wrap pt-12 lg:pt-16">
        <h1 className="font-display text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.02em] text-brand sm:text-6xl lg:text-7xl">
          Освітній хаб
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          Віртуальні навчальні блоки фахового медичного коледжу ІФНМУ: відео й алгоритми маніпуляцій, тестові завдання,
          підготовка до ЄДКІ, посібники з тактичної медицини та віртуальна симуляція.
        </p>
        <div className="mt-8 max-w-3xl">
          <HubSearch />
        </div>
      </section>

      <section className="wrap mt-14">
        <DirectionCards />
      </section>

      <section className="wrap mt-20 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-2xl font-semibold">Для кого цей хаб</h2>
          <ul className="mt-5 space-y-3">
            {hub.audience.map((a) => (
              <li key={a} className="flex gap-3 text-[17px]">
                <span className="mt-[0.55em] h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                <span>{a[0].toUpperCase() + a.slice(1)}</span>
              </li>
            ))}
          </ul>
          <Link to="/authors" className="btn-ghost mt-8">Хто створив матеріали</Link>
        </div>

        <figure className="rounded-xl border border-line bg-white p-6 sm:p-8">
          <blockquote className="text-[17px] leading-relaxed sm:text-lg">
            <span className="float-left -mt-2 mr-2 font-display text-6xl leading-none text-brand" aria-hidden="true">“</span>
            {hub.quote}
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-4 border-t border-line pt-5">
            <img src={hub.quotePhoto} alt="" className="h-14 w-14 rounded-full object-cover" />
            <span>
              <span className="block font-semibold">Олександр Бульбук</span>
              <span className="block text-sm text-muted">Директор фахового медичного коледжу ІФНМУ</span>
            </span>
          </figcaption>
        </figure>
      </section>
    </>
  )
}
