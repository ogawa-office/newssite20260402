import type { NewsItem } from '../data/mockNews'
import { MOCK_NEWS } from '../data/mockNews'

const STORAGE_KEY = 'news-matome-archive-v1'

/** RSS/API 取り込み後に一覧を再読込するための同一タブ用イベント */
export const NEWS_ARCHIVE_CHANGED = 'news-matome-archive-changed'

function sortByDateDesc(items: NewsItem[]) {
  return [...items].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

/** 初回のみバンドル内のシードを保存。2回目以降は保存済み一覧を返す */
export function loadArchive(): NewsItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seed = [...MOCK_NEWS]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
      return seed
    }
    const parsed = JSON.parse(raw) as NewsItem[]
    return Array.isArray(parsed) ? parsed : [...MOCK_NEWS]
  } catch {
    return [...MOCK_NEWS]
  }
}

export function saveArchive(items: NewsItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* quota 等 */
  }
}

/**
 * 累積取り込み: URL が未登録の記事だけ追加（同一URLはスキップ）。
 * RSS/API 連携時はこの関数で既存アーカイブにマージする。
 */
export function mergeCumulative(
  existing: NewsItem[],
  incoming: NewsItem[],
): NewsItem[] {
  const byUrl = new Map<string, NewsItem>()
  for (const x of existing) {
    byUrl.set(x.url, x)
  }
  for (const x of incoming) {
    if (!byUrl.has(x.url)) {
      byUrl.set(x.url, x)
    }
  }
  return sortByDateDesc([...byUrl.values()])
}

/**
 * 新着記事を一覧に追加して保存し、画面を更新する。
 * RSS・定期 fetch などから呼び出し可能（`useNewsArchive` がイベントで再同期する）。
 */
export function appendToArchive(incoming: NewsItem[]) {
  if (incoming.length === 0) return
  const existing = loadArchive()
  const next = mergeCumulative(existing, incoming)
  saveArchive(next)
  window.dispatchEvent(new CustomEvent(NEWS_ARCHIVE_CHANGED))
}
