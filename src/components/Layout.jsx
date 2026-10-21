import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { CONTACTS, SECTION_META, SECTION_ORDER, STUDENT_GUIDE, SECTION_CODES } from '../lib/catalog'

const NAV = [
  { to: '/nmt', label: 'НМТ' },
  { to: '/vacancies', label: 'Вакансії' },
  { to: '/about', label: 'Про коледж' },
]

function HubMenu({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc) }
  }, [])
  const active = pathname.startsWith('/hub') || pathname.startsWith('/material')
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-md px-3 py-2 font-medium hover:bg-ink/5 ${active ? 'text-brand' : ''}`}
      >
        Освітній хаб
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-line bg-white p-2 shadow-[0_12px_32px_-12px_rgba(26,31,36,.25)]">
          <Link to="/hub" onClick={onNavigate} className="block rounded-md px-3 py-2 hover:bg-paper">
            <span className="font-medium">Про хаб</span>
            <span className="block text-sm text-muted">Для кого і як влаштований</span>
          </Link>
          <div className="my-1 border-t border-line" />
          {SECTION_ORDER.map((k) => (
            <Link key={k} to={`/hub/${k}`} onClick={onNavigate} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-paper">
              <span className={`code-tag ${SECTION_META[k].color}`}>{SECTION_CODES[k]}</span>
              <span className="font-medium">{SECTION_META[k].short}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function Header() {
  const [drawer, setDrawer] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setDrawer(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
  }, [drawer])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="wrap flex h-16 items-center gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img src="/media/img/logo.png" alt="" className="h-10 w-10 shrink-0 object-contain" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[15px] font-semibold">Фаховий медичний коледж</span>
            <span className="block text-[13px] text-muted">ІФНМУ</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Головне меню">
          <HubMenu />
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `rounded-md px-3 py-2 font-medium hover:bg-ink/5 ${isActive ? 'text-brand' : ''}`}>
              {n.label}
            </NavLink>
          ))}
          <a href={STUDENT_GUIDE} target="_blank" rel="noopener" className="ml-2 rounded-md border border-ink/20 px-3 py-2 font-medium hover:border-ink hover:bg-white">
            Student Guide
          </a>
        </nav>

        <button
          type="button"
          className="ml-auto -mr-2 rounded-md p-2 lg:hidden"
          aria-label={drawer ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={drawer}
          onClick={() => setDrawer((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
            {drawer
              ? <path d="M6 6l14 14M20 6L6 20" stroke="currentColor" strokeWidth="2" />
              : <path d="M3 8h20M3 13h20M3 18h20" stroke="currentColor" strokeWidth="2" />}
          </svg>
        </button>
      </div>

      {drawer && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-paper lg:hidden">
          <nav className="wrap flex flex-col py-4 text-lg" aria-label="Мобільне меню">
            <Link to="/hub" className="border-b border-line py-3 font-display text-xl font-semibold">Освітній хаб</Link>
            {SECTION_ORDER.map((k) => (
              <Link key={k} to={`/hub/${k}`} className="flex items-center gap-3 border-b border-line py-3 pl-1">
                <span className={`code-tag ${SECTION_META[k].color}`}>{SECTION_CODES[k]}</span>
                {SECTION_META[k].short}
              </Link>
            ))}
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="border-b border-line py-3">{n.label}</Link>
            ))}
            <a href={STUDENT_GUIDE} target="_blank" rel="noopener" className="border-b border-line py-3">Student Guide ↗</a>
          </nav>
        </div>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white/80">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src="/media/img/logo.png" alt="" className="h-12 w-12 rounded-full bg-white object-contain p-0.5" />
            <p className="font-display text-lg font-semibold leading-tight text-white">Фаховий медичний<br />коледж ІФНМУ</p>
          </div>
          <p className="mt-4 max-w-sm text-[15px]">
            Структурний підрозділ <a className="underline underline-offset-2 hover:text-white" href="https://ifnmu.edu.ua/uk/" target="_blank" rel="noopener">Івано-Франківського національного медичного університету</a>.
          </p>
        </div>
        <div className="space-y-2 text-[15px]">
          <p className="mb-3 font-semibold text-white">Контакти</p>
          <a className="block hover:text-white" href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
          <a className="block hover:text-white" href={CONTACTS.phoneHref}>{CONTACTS.phone}</a>
          <a className="block hover:text-white" href={CONTACTS.map} target="_blank" rel="noopener">{CONTACTS.address}</a>
        </div>
        <div className="space-y-2 text-[15px]">
          <p className="mb-3 font-semibold text-white">Ми в мережах</p>
          {CONTACTS.social.map((s) => (
            <a key={s.name} className="block hover:text-white" href={s.href} target="_blank" rel="noopener">{s.name}</a>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-wrap justify-between gap-2 py-5 text-[13px] text-white/50">
          <p>© {new Date().getFullYear()} Фаховий медичний коледж ІФНМУ</p>
          <Link to="/authors" className="hover:text-white">Автори освітнього хабу</Link>
        </div>
      </div>
    </footer>
  )
}

export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">Перейти до змісту</a>
      <ScrollToTop />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

