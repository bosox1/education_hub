import { Link } from 'react-router-dom'
import { pages } from '../lib/catalog'
import { useTitle } from '../lib/useTitle'

const t = pages.tccc

export default function Tccc() {
  useTitle('Курс тактичної бойової допомоги постраждалим')
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <img src={t.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="wrap relative grid gap-8 py-14 md:grid-cols-[1fr_16rem] md:items-center lg:py-20">
          <div>
            <nav aria-label="Навігація" className="text-sm text-white/70">
              <Link to="/hub/nursing" className="hover:text-white hover:underline">Освітній хаб / Медсестринство</Link>
            </nav>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-5xl">Курс тактичної бойової допомоги постраждалим</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/85">
              Український переклад загальнодоступного курсу Tactical Combat Casualty Care (TCCC) для всіх військовослужбовців.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={t.uk} target="_blank" rel="noopener" className="inline-flex rounded-md bg-white px-4 py-2.5 font-medium text-ink hover:bg-white/90">Відкрити курс українською ↗</a>
              <a href={t.more} target="_blank" rel="noopener" className="inline-flex rounded-md border border-white/40 px-4 py-2.5 font-medium hover:border-white">Про курс на сайті NAEMT ↗</a>
            </div>
          </div>
          <img src={t.soldier} alt="" className="hidden rounded-xl md:block" />
        </div>
      </section>
      <section className="wrap mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="max-w-read">
          <h2 className="font-display text-2xl font-semibold">Про переклад</h2>
          <p className="mt-4 text-[17px] leading-relaxed" lang="en">{t.text}</p>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">
            Ми переклали курс, але не претендуємо на авторство змісту. Він належить Defense Health Agency, NAEMT, Комітету з тактичної допомоги пораненим (CoTCCC) та їхнім фахівцям.
          </p>
        </div>
        <img src={t.image} alt="Сторінка курсу TCCC" loading="lazy" className="w-full rounded-xl border border-line bg-white" />
      </section>
    </>
  )
}
