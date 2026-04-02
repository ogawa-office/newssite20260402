import type { NewsItem } from '../data/mockNews'
import { CATEGORY_BADGE, CATEGORY_PILL } from '../data/mockNews'
import { timeAgoJa } from '../lib/timeAgoJa'

type Props = {
  item: NewsItem
}

export function NewsCard({ item }: Props) {
  const pill = CATEGORY_PILL[item.category]
  const summary = item.summaryJa ?? item.summary

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-left shadow-sm shadow-slate-200/50 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300/90 hover:shadow-md hover:shadow-slate-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
      aria-label={`${item.title}（${item.sourceName}）の元記事を新しいタブで開く`}
    >
      <article className="flex h-full min-h-[520px] flex-col">
        <div className="flex items-start gap-3 px-4 pt-4">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg shadow-inner"
            aria-hidden
          >
            {item.sourceIcon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold tracking-wide text-slate-600">
              {item.sourceName}
            </div>
            <div className="text-xs text-slate-400">{timeAgoJa(item.publishedAt)}</div>
          </div>
        </div>

        <div
          className={`relative mx-4 mt-3 flex min-h-[120px] flex-col justify-end rounded-xl bg-gradient-to-br px-4 pb-3 pt-6 text-left ${item.bannerClass}`}
        >
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {item.isNew && (
              <span className="rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-600 shadow-sm">
                NEW
              </span>
            )}
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold shadow-sm ${pill.bg}`}
            >
              {CATEGORY_BADGE[item.category]}
            </span>
          </div>
          <h2 className="text-lg font-bold leading-snug text-white drop-shadow-sm">
            {item.title}
          </h2>
        </div>

        <div className="min-h-[16.5rem] flex-1 px-4 py-3">
          <p className="line-clamp-[15] text-sm leading-relaxed text-slate-600">
            {summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-slate-100/90 px-4 py-3.5">
          {item.keywords.map((kw) => (
            <span
              key={kw}
              className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200/80"
            >
              {kw}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-end gap-1 border-t border-slate-100 px-4 py-2.5 text-xs font-medium text-slate-400 transition group-hover:text-sky-700">
          <span>元記事を開く</span>
          <span aria-hidden className="translate-y-px">
            ↗
          </span>
        </div>
      </article>
    </a>
  )
}
