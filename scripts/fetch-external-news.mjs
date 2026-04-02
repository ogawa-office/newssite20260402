/**
 * 公開 RSS から記事を取り込み、public/news-feed.json を上書きする。
 * GitHub Actions から 1 日 2 回実行する想定。ローカルでは `npm run fetch-news`。
 */
import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Parser from 'rss-parser'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'news-feed.json')

const parser = new Parser({
  timeout: 25000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (compatible; NewsMatomeFeed/1.0; +https://github.com/)',
    Accept: 'application/rss+xml, application/xml, text/xml, */*',
  },
})

/** @typedef {'ai'|'ai_theory'|'insurance'|'economy'|'market'} NewsCategory */

async function fetchTextWithTimeout(url, timeoutMs) {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; NewsMatomeFeed/1.0; +https://github.com/)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.text()
  } finally {
    clearTimeout(t)
  }
}

/** @type {Array<{ url: string; category: NewsCategory; sourceName: string; sourceIcon: string; bannerClass: string; max: number; lang?: 'ja' }>} */
const FEEDS = [
  // 取得元フィード設定（GitHub Actions で実行される）
  // --- 英語 ---
  {
    url: 'https://techcrunch.com/feed/',
    category: 'ai',
    sourceName: 'TechCrunch',
    sourceIcon: '📰',
    bannerClass: 'from-slate-800 to-slate-600',
    max: 5,
  },
  {
    url: 'https://arxiv.org/rss/cs.AI',
    category: 'ai_theory',
    sourceName: 'arXiv cs.AI',
    sourceIcon: '◆',
    bannerClass: 'from-rose-900 via-fuchsia-900 to-violet-900',
    max: 5,
  },
  {
    url: 'https://www.insurancejournal.com/feed/',
    category: 'insurance',
    sourceName: 'Insurance Journal',
    sourceIcon: '🛡️',
    bannerClass: 'from-slate-800 via-slate-700 to-amber-900/90',
    max: 5,
  },
  {
    url: 'https://reinsurancene.ws/feed/',
    category: 'insurance',
    sourceName: 'Reinsurance News',
    sourceIcon: '🔁',
    bannerClass: 'from-indigo-950 via-blue-900 to-slate-800',
    max: 6,
  },
  {
    url: 'https://www.theinsurer.com/feed/',
    category: 'insurance',
    sourceName: 'The Insurer',
    sourceIcon: '🏢',
    bannerClass: 'from-slate-900 via-indigo-950 to-blue-950',
    max: 5,
  },
  {
    url: 'https://www.artemis.bm/feed/',
    category: 'insurance',
    sourceName: 'Artemis',
    sourceIcon: '🎯',
    bannerClass: 'from-violet-950 via-purple-900 to-indigo-950',
    max: 6,
  },
  {
    url: 'https://www.risk.net/rss',
    category: 'insurance',
    sourceName: 'Risk.net',
    sourceIcon: '⚖️',
    bannerClass: 'from-zinc-900 via-slate-800 to-neutral-900',
    max: 5,
  },
  {
    url: 'http://feeds.bbci.co.uk/news/business/rss.xml',
    category: 'economy',
    sourceName: 'BBC Business',
    sourceIcon: '¥',
    bannerClass: 'from-stone-800 to-neutral-700',
    max: 5,
  },
  {
    url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    category: 'market',
    sourceName: 'CNBC',
    sourceIcon: '📈',
    bannerClass: 'from-indigo-950 to-blue-800',
    max: 5,
  },
  // --- 日本語 ---
  {
    url: 'https://rss.itmedia.co.jp/rss/2.0/ait.xml',
    category: 'ai',
    sourceName: 'ITmedia AI',
    sourceIcon: '🇯🇵',
    bannerClass: 'from-sky-900 to-slate-800',
    max: 5,
    lang: 'ja',
  },
  {
    url: 'https://gigazine.net/news/rss_2.0/',
    category: 'ai_theory',
    sourceName: 'GIGAZINE',
    sourceIcon: '🇯🇵',
    bannerClass: 'from-fuchsia-950 to-violet-900',
    max: 5,
    lang: 'ja',
  },
  {
    url: 'https://www.money-press.info/feed/',
    category: 'insurance',
    sourceName: 'マネープレス',
    sourceIcon: '🇯🇵',
    bannerClass: 'from-emerald-900 to-teal-800',
    max: 4,
    lang: 'ja',
  },
  {
    url: 'https://www.fsa.go.jp/fsaNewsListAll_rss2.xml',
    category: 'insurance',
    sourceName: '金融庁（新着情報）',
    sourceIcon: '🏛️',
    bannerClass: 'from-slate-900 to-slate-700',
    max: 8,
    lang: 'ja',
  },
  {
    url: 'https://www.nli-research.co.jp/rss/?data_format=xml&site=nli&tag_category_id=11',
    category: 'insurance',
    sourceName: 'ニッセイ基礎研（保険）',
    sourceIcon: '🇯🇵',
    bannerClass: 'from-teal-950 to-emerald-900',
    max: 8,
    lang: 'ja',
  },
  {
    url: 'https://www.nli-research.co.jp/rss/?data_format=xml&site=nli&tag_category_id=9',
    category: 'insurance',
    sourceName: 'ニッセイ基礎研（年金）',
    sourceIcon: '🇯🇵',
    bannerClass: 'from-cyan-950 to-teal-900',
    max: 6,
    lang: 'ja',
  },
  {
    url: 'https://www.nli-research.co.jp/rss/?data_format=xml&site=nli&tag_category_id=10',
    category: 'insurance',
    sourceName: 'ニッセイ基礎研（社会保障）',
    sourceIcon: '🇯🇵',
    bannerClass: 'from-emerald-950 to-green-900',
    max: 6,
    lang: 'ja',
  },
  {
    url: 'https://www.nli-research.co.jp/rss/?data_format=xml&site=nli&tag_category_id=7',
    category: 'insurance',
    sourceName: 'ニッセイ基礎研（金融・為替）',
    sourceIcon: '🇯🇵',
    bannerClass: 'from-blue-950 to-indigo-950',
    max: 6,
    lang: 'ja',
  },
  {
    url: 'https://www.nhk.or.jp/rss/news/cat0.xml',
    category: 'economy',
    sourceName: 'NHKニュース',
    sourceIcon: '🇯🇵',
    bannerClass: 'from-stone-800 to-neutral-700',
    max: 5,
    lang: 'ja',
  },
  {
    url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml',
    category: 'economy',
    sourceName: 'Yahoo!ニュース',
    sourceIcon: '🇯🇵',
    bannerClass: 'from-amber-900 to-orange-950',
    max: 5,
    lang: 'ja',
  },
  {
    url: 'https://toyokeizai.net/list/feed/rss',
    category: 'economy',
    sourceName: '東洋経済オンライン',
    sourceIcon: '🇯🇵',
    bannerClass: 'from-green-950 to-emerald-900',
    max: 5,
    lang: 'ja',
  },
]

function stripHtml(s) {
  return String(s ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const _jaTransCache = new Map()
let _jaTransCount = 0
const MAX_TRANSLATIONS_PER_RUN = 30

function hasJa(s) {
  return /[\u3040-\u30ff\u4e00-\u9faf]/.test(s)
}

async function translateToJa(text) {
  const t = String(text ?? '').trim()
  if (!t) return ''
  if (hasJa(t)) return t
  if (_jaTransCache.has(t)) return _jaTransCache.get(t)
  if (_jaTransCount >= MAX_TRANSLATIONS_PER_RUN) return ''

  // 非公式の無料エンドポイント（失敗したら英語のままにする）
  const q = t.slice(0, 420)
  const url =
    'https://translate.googleapis.com/translate_a/single' +
    '?client=gtx&sl=auto&tl=ja&dt=t&q=' +
    encodeURIComponent(q)

  try {
    _jaTransCount += 1
    const raw = await fetchTextWithTimeout(url, 12000)
    const data = JSON.parse(raw)
    const translated = Array.isArray(data?.[0])
      ? data[0].map((x) => String(x?.[0] ?? '')).join('')
      : ''
    const out = translated.trim()
    _jaTransCache.set(t, out)
    return out
  } catch {
    _jaTransCache.set(t, '')
    return ''
  }
}

function hashUrl(u) {
  return createHash('sha256').update(u).digest('hex').slice(0, 14)
}

/** 日本語タイトルから簡易キーワード（句読点・空白で分割、足りなければ先頭から区切り） */
function pickKeywordsJa(title) {
  const jaStop = new Set([
    'ため',
    'こと',
    'もの',
    'よう',
    'とき',
    'これ',
    'それ',
    'あれ',
    'さらに',
    'および',
    'ならびに',
    'について',
    'において',
    'による',
    'に対し',
    'として',
    'など',
    'こそ',
    'ある',
    'いる',
    'なる',
    'する',
    'できる',
    'ない',
    '最新',
    '記事',
    'ニュース',
  ])
  const t = stripHtml(title)
  const parts = t
    .split(/[、。．!！?？…‥　・\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2 && s.length <= 24 && !jaStop.has(s))
  if (parts.length >= 2) {
    return [...new Set(parts)].slice(0, 5)
  }
  const cleaned = t.replace(/\s+/g, '')
  const out = []
  for (let i = 0; i < cleaned.length && out.length < 5; i += 8) {
    const chunk = cleaned.slice(i, i + 12)
    if (chunk.length >= 2) out.push(chunk)
  }
  return out.length > 0 ? out : [cleaned.slice(0, 12) || 'ニュース']
}

function pickKeywordsEn(title) {
  const stop = new Set([
    'the',
    'and',
    'for',
    'with',
    'from',
    'that',
    'this',
    'are',
    'has',
    'will',
    'its',
    'new',
    'how',
    'what',
    'when',
    'can',
    'may',
    'into',
    'after',
    'before',
    'over',
    'more',
    'than',
    'your',
    'our',
    'all',
    'not',
    'but',
    'was',
    'were',
    'being',
    'their',
    'they',
    'have',
    'had',
    'about',
    'out',
    'one',
    'two',
    'first',
    'year',
    'years',
    'day',
    'week',
    'here',
    'there',
    'some',
    'such',
    'also',
    'just',
    'like',
    'get',
    'make',
    'made',
    'says',
    'say',
    'said',
    'who',
    'his',
    'her',
    'she',
    'him',
    'you',
    'any',
    'could',
    'would',
    'should',
    'which',
    'while',
    'during',
    'between',
    'against',
    'other',
    'only',
    'most',
    'many',
    'much',
    'very',
    'even',
    'still',
    'back',
    'way',
    'well',
    'both',
    'each',
    'these',
    'those',
    'than',
    'then',
    'them',
    'off',
    'per',
    'via',
    'now',
    'see',
    'why',
    'use',
    'used',
    'using',
    'based',
    'including',
    'because',
    'through',
    'where',
    'among',
    'under',
    'since',
    'until',
    'without',
    'within',
    'across',
    'around',
    'another',
    'against',
    'between',
    'business',
    'news',
    'report',
    'reports',
  ])
  const words = stripHtml(title)
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w.toLowerCase()))
  return [...new Set(words)].slice(0, 5)
}

/**
 * @param {string} title
 * @param {'ja' | undefined} lang
 */
function pickKeywords(title, lang) {
  if (lang === 'ja') return pickKeywordsJa(title)
  if (/[\u3040-\u30ff\u4e00-\u9faf]/.test(title)) return pickKeywordsJa(title)
  return pickKeywordsEn(title)
}

function toIso(pub) {
  if (!pub) return new Date().toISOString()
  const d = new Date(pub)
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

function isNewish(iso) {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return false
  return Date.now() - t < 48 * 60 * 60 * 1000
}

/**
 * @param {import('rss-parser').Item} item
 * @param {(typeof FEEDS)[number]} meta
 */
function itemToNews(item, meta) {
  const link =
    item.link ||
    item.guid ||
    (typeof item.id === 'string' ? item.id : '') ||
    ''
  if (!link) return null
  const title = stripHtml(item.title) || '(無題)'
  const raw =
    item.contentSnippet ||
    item.summary ||
    item.content ||
    item['content:encoded'] ||
    ''
  const summary = stripHtml(raw).slice(0, 520) || title.slice(0, 200)
  const publishedAt = toIso(item.pubDate || item.isoDate)
  return {
    id: `rss-${meta.category}-${hashUrl(link)}`,
    title: title.slice(0, 200),
    summary,
    sourceName: meta.sourceName,
    sourceIcon: meta.sourceIcon,
    publishedAt,
    category: meta.category,
    keywords: pickKeywords(title, meta.lang),
    bannerClass: meta.bannerClass,
    isNew: isNewish(publishedAt),
    url: link.split('#')[0],
  }
}

async function fetchFeed(meta) {
  try {
    // parseURL は内部でリクエストが止まらないことがあるため、
    // 先に fetch を AbortController で中断できるようにする
    const FEED_TIMEOUT_MS = 30000
    const xml = await fetchTextWithTimeout(meta.url, FEED_TIMEOUT_MS)
    const feed = await parser.parseString(xml)
    const out = []
    const items = feed.items ?? []
    for (const it of items) {
      if (out.length >= meta.max) break
      const n = itemToNews(it, meta)
      if (n) out.push(n)
    }
    // 英語記事の summary を日本語にして summaryJa に入れる
    if (meta.lang !== 'ja') {
      for (const x of out) {
        if (!x.summaryJa) {
          const ja = await translateToJa(x.summary)
          if (ja) x.summaryJa = ja
        }
      }
    }
    return out
  } catch (e) {
    console.warn(`[fetch-external-news] skip feed ${meta.url}:`, e.message)
    return []
  }
}

async function main() {
  // 同時取得（Promise.all）にすると、どれかが遅延した時に全体が長引くため直列取得にする
  const merged = []
  for (const f of FEEDS) {
    const part = await fetchFeed(f)
    merged.push(...part)
  }
  merged.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, JSON.stringify(merged, null, 2), 'utf8')
  console.log(`Wrote ${merged.length} items to public/news-feed.json`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
