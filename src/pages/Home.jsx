import { Link } from 'react-router-dom'
import Slider from '../components/Slider'
import DirectionCards from '../components/DirectionCards'
import { HubSearch } from '../components/Search'
import { STUDENT_GUIDE, pages, plural, totalMaterials } from '../lib/catalog'
import { useTitle } from '../lib/useTitle'

const home = pages.home

export default function Home() {
  useTitle(null)
  return (
    <>
      {/* Коледж */}
      <section className="wrap grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1fr_1.1fr] lg:pt-16">
        <div>
          <img src={home.logo} alt="Логотип фахового медичного коледжу ІФНМУ" className="h-24 w-24 rounded-full bg-white object-contain p-1 ring-1 ring-line sm:h-28 sm:w-28" />
          <h1 className="mt-6 font-display text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.01em] sm:text-5xl lg:text-[3.4rem]">
            Фаховий медичний коледж ІФНМУ
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Готуємо медичних сестер, зубних техніків і асистентів фармацевта. Перших студентів набрали у 1997 році,
            а клінічні дисципліни викладають на кафедрах медичного університету.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/about" className="btn">Про коледж</Link>
            <Link to="/hub" className="btn-ghost">Освітній хаб</Link>
          </div>
        </div>
        <Slider images={home.slides} alts={['Колектив коледжу', 'Студентка в навчальній лабораторії', 'Практичне заняття з медсестринства', 'Випускники коледжу']} className="aspect-[4/3]" />
      </section>

      {/* Освітній хаб — головний акцент сторінки */}
      <section className="bg-brand text-white">
        <div className="wrap py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <h2 className="font-display text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
                Освітній<br />хаб
              </h2>
            </div>
            <p className="max-w-lg text-lg text-white/85 lg:pb-2">
              {totalMaterials} {plural(totalMaterials, 'навчальний блок', 'навчальні блоки', 'навчальних блоків')} з медсестринства, стоматології та фармації:
              відео маніпуляцій, покрокові алгоритми, матеріали до ЄДКІ. Відкрито для всіх, без реєстрації.
            </p>
          </div>
          <div className="mt-10 text-ink">
            <HubSearch id="home-search" />
          </div>
          <div className="mt-10">
            <DirectionCards tone="dark" />
          </div>
        </div>
      </section>

      {/* Інше */}
      <section className="wrap mt-16 grid gap-4 md:grid-cols-3">
        <Link to="/nmt" className="group rounded-xl border border-line bg-white p-6 hover:border-ink/40">
          <h3 className="font-display text-lg font-semibold">Вступникам: НМТ</h3>
          <p className="mt-2 text-[15px] text-muted">Пробне тестування, взірці завдань і офіційні документи УЦОЯО в одному місці.</p>
        </Link>
        <Link to="/vacancies" className="group rounded-xl border border-line bg-white p-6 hover:border-ink/40">
          <h3 className="font-display text-lg font-semibold">Вакансії</h3>
          <p className="mt-2 text-[15px] text-muted">Пропозиції роботодавців для медичних сестер, зубних техніків і асистентів фармацевта.</p>
        </Link>
        <a href={STUDENT_GUIDE} target="_blank" rel="noopener" className="group rounded-xl border border-line bg-white p-6 hover:border-ink/40">
          <h3 className="font-display text-lg font-semibold">Student Guide ↗</h3>
          <p className="mt-2 text-[15px] text-muted">Довідник студента ІФНМУ: корпуси, гуртожитки, бібліотека, деканати.</p>
        </a>
      </section>

      <section className="wrap mt-16">
        <a href="https://ifnmu.edu.ua/uk/" target="_blank" rel="noopener" className="group grid overflow-hidden rounded-xl bg-ink text-white md:grid-cols-2">
          <img src={home.ifnmuLogo} alt="Головний корпус ІФНМУ" loading="lazy" className="h-64 w-full object-cover md:h-full" />
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <p className="text-white/60">Коледж є структурним підрозділом</p>
            <h2 className="mt-2 font-display text-2xl font-semibold leading-tight lg:text-3xl">Івано-Франківського національного медичного університету</h2>
            <span className="mt-6 inline-flex w-fit rounded-md bg-white px-4 py-2.5 font-medium text-ink group-hover:bg-white/90">Сайт університету ↗</span>
          </div>
        </a>
      </section>
    </>
  )
}
