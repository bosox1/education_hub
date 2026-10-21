import { Link } from 'react-router-dom'
import { pages } from '../lib/catalog'
import { useTitle } from '../lib/useTitle'

export default function Authors() {
  useTitle('Автори освітнього хабу')
  const items = pages.authors
  return (
    <>
      <section className="wrap pt-12 lg:pt-16">
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">Автори освітнього хабу</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Навчальні блоки створили науково-педагогічні та педагогічні працівники фахового медичного коледжу ІФНМУ,
          а згодом до них долучилися колеги з українських медичних ЗВО, Канади й Польщі. Авторство кожного блоку вказане окремо.
        </p>
      </section>

      <section className="wrap mt-12 space-y-6">
        {items.map((a, i) => (
          <article key={i} className="grid overflow-hidden rounded-xl border border-line bg-white md:grid-cols-[18rem_1fr]">
            {a.image && <img src={a.image} alt="" loading="lazy" className="h-56 w-full object-cover md:h-full" />}
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold leading-snug sm:text-xl">{a.title}</h2>
              {a.text && <p className="mt-3 text-[15px] leading-relaxed text-muted">{a.text}</p>}
            </div>
          </article>
        ))}
      </section>

      <section className="wrap mt-12 flex flex-wrap items-center gap-3">
        <Link to="/hub" className="btn">До освітнього хабу</Link>
        <p className="text-sm text-muted">Першу версію сайту розробив Олександр Бульбук.</p>
      </section>
    </>
  )
}
