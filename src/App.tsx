import { useMemo, useState } from 'react'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { NewsCard } from './components/NewsCard'
import {
  CATEGORY_LABEL,
  CATEGORY_PILL,
  type NewsCategory,
} from './data/mockNews'
import { useNewsArchive } from './hooks/useNewsArchive'
import { sortNewsItems } from './lib/newsSort'

const CATEGORY_ROWS = [
  ['all', 'すべて'],
  ['ai', CATEGORY_LABEL.ai],
  ['ai_theory', CATEGORY_LABEL.ai_theory],
  ['insurance', CATEGORY_LABEL.insurance],
  ['economy', CATEGORY_LABEL.economy],
  ['market', CATEGORY_LABEL.market],
] as const

export default function App() {
  const { items: articles } = useNewsArchive()
  const [category, setCategory] = useState<NewsCategory | 'all'>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = articles.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (q) {
        const ja = item.summaryJa ?? ''
        const blob = `${item.title} ${item.summary} ${ja}`.toLowerCase()
        if (!blob.includes(q)) return false
      }
      return true
    })
    return sortNewsItems(base)
  }, [articles, category, query])

  return (
    <div className="min-h-svh bg-[#f7f7f9]">
      <Header />

      <main id="feed" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div
          className="sticky top-14 z-30 -mx-4 mb-2 flex flex-wrap gap-2 border-b border-slate-200/70 bg-[#f7f7f9]/95 px-4 py-2.5 backdrop-blur-sm sm:-mx-6 sm:px-6"
          aria-label="カテゴリで絞り込み"
        >
          {CATEGORY_ROWS.map(([id, label]) => {
            const active = category === id
            const pill =
              id === 'all'
                ? {
                    bg: 'bg-slate-100 text-slate-700',
                    active:
                      'bg-white text-slate-900 border-slate-400 ring-1 ring-slate-300',
                  }
                : CATEGORY_PILL[id]
            return (
              <button
                key={id}
                type="button"
                onClick={() => setCategory(id)}
                className={`rounded-full border px-3 py-1.5 text-left text-xs font-medium leading-snug transition sm:px-3.5 sm:text-sm ${
                  id === 'ai_theory' ? 'max-w-[11rem] sm:max-w-none' : ''
                } ${
                  active
                    ? `${pill.active} shadow-sm`
                    : `${pill.bg} border-transparent hover:opacity-90`
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <div className="relative mt-8">
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="タイトル・要約で検索..."
            className="w-full rounded-2xl border border-slate-200/90 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm shadow-slate-200/40 outline-none ring-0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200/80 pb-3">
          <p className="text-sm text-slate-600">
            <span className="font-semibold tabular-nums text-slate-900">
              {filtered.length}
            </span>
            件
            {articles.length > filtered.length && (
              <span className="ml-2 text-slate-400">
                （全{articles.length}件中）
              </span>
            )}
          </p>
          {filtered.length > 0 && (
            <p className="text-xs text-slate-400">新しい順に並べています</p>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">すべての記事</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="mt-16 rounded-2xl border border-dashed border-slate-300/90 bg-white/60 px-6 py-14 text-center">
            <p className="text-base font-medium text-slate-700">
              条件に合う記事がありません
            </p>
            <p className="mt-2 text-sm text-slate-500">
              カテゴリや検索語を調整してください。
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
