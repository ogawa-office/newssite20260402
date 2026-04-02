import type { NewsItem } from '../data/mockNews'

/** 1ポイントあたり「並び替え上の加算時間」（実際の日時は変えない） */
const MS_PER_SORT_BOOST = 12 * 60 * 60 * 1000

/** 新しい順（sortBoost が高いほど同じ日付帯で上に来やすい） */
export function newsSortKey(item: NewsItem): number {
  const t = new Date(item.publishedAt).getTime()
  const b = item.sortBoost ?? 0
  return t + b * MS_PER_SORT_BOOST
}

export function sortNewsItems(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => newsSortKey(b) - newsSortKey(a))
}
