import { useEffect, useState } from 'react'

export default function Slider({ images, alts = [], className = '' }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = images.length

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (paused || reduce || n < 2) return
    const t = setTimeout(() => setI((v) => (v + 1) % n), 6000)
    return () => clearTimeout(t)
  }, [i, paused, n])

  const go = (d) => setI((v) => (v + d + n) % n)

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-line ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {images.map((src, k) => (
        <img
          key={src}
          src={src}
          alt={alts[k] || ''}
          aria-hidden={k !== i}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${k === i ? 'opacity-100' : 'opacity-0'}`}
          loading={k === 0 ? 'eager' : 'lazy'}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/55 to-transparent p-3 pt-10">
        <div className="flex gap-1.5">
          {images.map((_, k) => (
            <button key={k} type="button" onClick={() => setI(k)} aria-label={`Фото ${k + 1} з ${n}`} aria-current={k === i}
              className={`h-1.5 rounded-full transition-all ${k === i ? 'w-7 bg-white' : 'w-3 bg-white/50 hover:bg-white/80'}`} />
          ))}
        </div>
        <div className="flex gap-1">
          {[-1, 1].map((d) => (
            <button key={d} type="button" onClick={() => go(d)} aria-label={d < 0 ? 'Попереднє фото' : 'Наступне фото'}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink hover:bg-white">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d={d < 0 ? 'M9 2L4 7l5 5' : 'M5 2l5 5-5 5'} fill="none" stroke="currentColor" strokeWidth="2" /></svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
