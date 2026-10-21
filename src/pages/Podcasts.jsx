import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SECTION_CODES, SECTION_META, pages } from '../lib/catalog'
import { useTitle } from '../lib/useTitle'

const episodes = pages.podcasts
const meta = SECTION_META.dentistry

export default function Podcasts() {
  useTitle('Подкасти з ортопедичної стоматології')
  const [cur, setCur] = useState(0)
  const [playing, setPlaying] = useState(false)
  const audio = useRef(null)

  const play = (i) => {
    const a = audio.current
    if (i === cur) {
      a.paused ? a.play() : a.pause()
      return
    }
    setCur(i)
    requestAnimationFrame(() => audio.current?.play())
  }

  return (
    <div style={{ '--accent': meta.hex }}>
      <section className="wrap pt-8 lg:pt-12">
        <nav aria-label="Навігація" className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link to="/hub" className="hover:text-ink hover:underline">Освітній хаб</Link>
          <span aria-hidden="true">/</span>
          <Link to="/hub/dentistry" className="inline-flex items-center gap-1.5 hover:text-ink hover:underline">
            <span className={`code-tag ${meta.color}`}>{SECTION_CODES.dentistry}</span>Стоматологія
          </Link>
        </nav>

        <div className="mt-6 grid gap-8 md:grid-cols-[14rem_1fr] md:items-end">
          <img src="/media/Stomatology/podcasts/banner.jpg" alt="Обкладинка подкасту" className="w-40 rounded-xl border border-line md:w-full" />
          <div>
            <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl" style={{ color: meta.hex }}>Подкасти з ортопедичної стоматології</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted">
              {episodes.length} випусків: від артикуляції й оклюзії до бюгельних протезів, а також розмови з професорами Миколою Рожком і Зіновієм Ожоганом.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap mt-10">
        <div className="sticky top-16 z-10 -mx-4 border-y border-line bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
          <p className="text-sm text-muted">Випуск {cur + 1} з {episodes.length}{playing ? ', грає' : ''}</p>
          <p className="mt-0.5 font-semibold leading-snug">{episodes[cur].title}</p>
          <audio
            ref={audio}
            key={episodes[cur].file}
            src={episodes[cur].file}
            controls
            preload="none"
            className="mt-3 w-full"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => cur < episodes.length - 1 && play(cur + 1)}
          />
        </div>

        <ol className="mt-4 divide-y divide-line">
          {episodes.map((ep, i) => {
            const active = i === cur
            return (
              <li key={ep.file}>
                <button type="button" onClick={() => play(i)} aria-current={active}
                  className={`flex w-full items-center gap-4 py-3.5 text-left hover:bg-white ${active ? 'font-semibold' : ''}`}>
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border ${active ? 'border-transparent text-white' : 'border-line bg-white'}`}
                    style={active ? { background: meta.hex } : undefined}>
                    {active && playing ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 2h3v10H3zM8 2h3v10H8z" fill="currentColor" /></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M4 2l8 5-8 5z" fill="currentColor" /></svg>
                    )}
                  </span>
                  <span className="w-8 shrink-0 text-sm tabular-nums text-muted">{i + 1}</span>
                  <span className="leading-snug">{ep.title}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
