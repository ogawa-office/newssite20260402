import { useCallback, useEffect, useState } from 'react'
import type { NewsCategory, NewsItem } from '../data/mockNews'

const CATEGORIES: readonly NewsCategory[] = [
  'ai',
  'ai_theory',
  'insurance',
  'economy',
  'market',
]

function isCategory(s: string): s is NewsCategory {
  return (CATEGORIES as readonly string[]).includes(s)
}
import {
  NEWS_ARCHIVE_CHANGED,
  loadArchive,
  mergeCumulative,
  saveArchive,
} from '../storage/newsArchive'

function isNewsItem(x: unknown): x is NewsItem {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.summary === 'string' &&
    typeof o.url === 'string' &&
    typeof o.publishedAt === 'string' &&
    typeof o.category === 'string' &&
    isCategory(o.category) &&
    typeof o.sourceName === 'string' &&
    typeof o.sourceIcon === 'string' &&
    typeof o.bannerClass === 'string' &&
    Array.isArray(o.keywords) &&
    (o.summaryJa === undefined || typeof o.summaryJa === 'string')
  )
}

/**
 * 記事一覧（localStorage と同期・累積型）。
 * `appendItems` は同一アプリ内から追加する場合に使用。
 * 外部スクリプトからは `appendToArchive`（storage）を呼ぶ。
 */
export function useNewsArchive() {
  const [items, setItems] = useState<NewsItem[]>(() => loadArchive())

  useEffect(() => {
    saveArchive(items)
  }, [items])

  useEffect(() => {
    const sync = () => setItems(loadArchive())
    window.addEventListener(NEWS_ARCHIVE_CHANGED, sync)
    return () => window.removeEventListener(NEWS_ARCHIVE_CHANGED, sync)
  }, [])

  /** CI が 1 日 2 回更新する public/news-feed.json を取り込む（URL 単位でマージ） */
  useEffect(() => {
    let cancelled = false
    fetch('/news-feed.json')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: unknown) => {
        if (cancelled || !Array.isArray(data)) return
        const incoming = data.filter(isNewsItem)
        if (incoming.length === 0) return
        setItems((prev) => mergeCumulative(prev, incoming))
      })
      .catch(() => {
        /* オフラインや未デプロイ時は無視 */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const appendItems = useCallback((incoming: NewsItem[]) => {
    setItems((prev) => mergeCumulative(prev, incoming))
  }, [])

  return { items, appendItems }
}
