import { useEffect, useState } from 'react'

export function Header() {
  const [elevated, setElevated] = useState(false)

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 px-4 py-3.5 backdrop-blur-md transition-shadow duration-200 sm:px-6 ${
        elevated ? 'shadow-sm shadow-slate-200/80' : ''
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <a
          href="/"
          className="group flex items-center gap-2.5 text-lg font-semibold tracking-tight text-slate-900"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-xs font-bold text-white shadow-md shadow-sky-500/25 transition group-hover:shadow-lg group-hover:shadow-sky-500/30"
            aria-hidden
          >
            新
          </span>
          <span>ニュースまとめ</span>
        </a>
        <a
          href="#feed"
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-900 underline decoration-sky-400/60 underline-offset-4"
        >
          ニュース
        </a>
      </div>
    </header>
  )
}
