import { useEffect } from 'react'

const BASE = 'Фаховий медичний коледж ІФНМУ'

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — Освітній хаб`
  }, [title])
}
