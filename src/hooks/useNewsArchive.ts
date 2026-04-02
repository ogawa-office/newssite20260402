import { useCallback, useEffect, useState } from 'react'
import type { NewsItem } from '../data/mockNews'
import {
  NEWS_ARCHIVE_CHANGED,
  loadArchive,
  mergeCumulative,
  saveArchive,
} from '../storage/newsArchive'

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

  const appendItems = useCallback((incoming: NewsItem[]) => {
    setItems((prev) => mergeCumulative(prev, incoming))
  }, [])

  return { items, appendItems }
}
