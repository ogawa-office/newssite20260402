/** livedoor ブログの記事URLを https に揃え、http/https の重複を防ぐ */
export function normalizeNewsUrl(url: string): string {
  const base = url.split('#')[0]
  if (base.startsWith('http://blog.livedoor.jp/')) {
    return `https://${base.slice('http://'.length)}`
  }
  return base
}
