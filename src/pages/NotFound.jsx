import { Link } from 'react-router-dom'
import { useTitle } from '../lib/useTitle'

export default function NotFound() {
  useTitle('Сторінку не знайдено')
  return (
    <section className="wrap py-24">
      <p className="font-display text-7xl font-semibold text-brand">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">Такої сторінки немає</h1>
      <p className="mt-3 max-w-xl text-lg text-muted">Можливо, посилання застаріло після оновлення сайту. Матеріали хабу можна знайти через пошук.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/hub" className="btn">Відкрити освітній хаб</Link>
        <Link to="/" className="btn-ghost">На головну</Link>
      </div>
    </section>
  )
}
