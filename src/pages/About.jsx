import { pages } from '../lib/catalog'
import { useTitle } from '../lib/useTitle'

const about = pages.about

const MILESTONES = [
  ['1996', 'Ректор ІФДМА Євген Нейко звертається до Міністерства освіти щодо підготовки зубних техніків'],
  ['1997', 'Перший набір: по одній групі медичних сестер і зубних техніків'],
  ['1999', 'Перший випуск за спеціальностями «Сестринська справа» та «Стоматологія ортопедична»'],
  ['2004', 'Коледж створено як окремий структурний підрозділ ІФНМУ'],
  ['2010', 'Початок підготовки за спеціальністю «Лікувальна справа»'],
  ['2012', 'Відкрито спеціальність «Фармація»'],
  ['2020', 'Директором коледжу призначено Олександра Бульбука'],
]

function Person({ name }) {
  const src = about.portraits[name]
  return (
    <figure className="flex items-center gap-4">
      {src && <img src={src} alt="" loading="lazy" className="h-20 w-20 rounded-full border border-line bg-white object-cover object-top" />}
      <figcaption className="font-semibold leading-snug">{name}</figcaption>
    </figure>
  )
}

export default function About() {
  useTitle('Про коледж')
  const blocks = about.blocks.map((b, i) => ({ ...b, title: b.title || (i === 2 ? 'Структура коледжу' : '') }))

  return (
    <>
      <section className="wrap pt-12 lg:pt-16">
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">Про коледж</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Від однієї групи медичних сестер і однієї групи зубних техніків до понад тисячі студентів і чотирьох спеціальностей.
        </p>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {MILESTONES.map(([year, text]) => (
            <li key={year} className="bg-white p-5">
              <p className="font-display text-2xl font-semibold text-brand">{year}</p>
              <p className="mt-2 text-[15px] leading-snug text-muted">{text}</p>
            </li>
          ))}
          <li className="hidden bg-brand p-5 text-white lg:block">
            <p className="font-display text-2xl font-semibold">Сьогодні</p>
            <p className="mt-2 text-[15px] leading-snug text-white/85">Освітній хаб відкритий для студентів будь-якого медичного закладу</p>
          </li>
        </ol>
      </section>

      {blocks.map((b, i) => (
        <section key={i} className="wrap mt-20 grid gap-10 lg:grid-cols-[1fr_20rem]">
          <div className="max-w-read">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">{b.title}</h2>
            {b.people.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                {b.people.map((p) => <Person key={p} name={p} />)}
              </div>
            )}
            <div className="mt-6 space-y-4 text-[17px] leading-[1.75]">
              {b.paras.map((p, k) => <p key={k}>{p}</p>)}
            </div>
          </div>
          {b.images.length > 0 && (
            <div className={`grid content-start gap-4 ${b.images.length > 1 ? 'grid-cols-2 lg:grid-cols-1' : ''}`}>
              {b.images.map((src) => (
                <img key={src} src={src} alt="" loading="lazy" className="w-full rounded-lg border border-line bg-white object-cover" />
              ))}
            </div>
          )}
        </section>
      ))}
    </>
  )
}
