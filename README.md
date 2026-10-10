# ニュースまとめ（newssite20260402）

AI・保険・経済・マーケットの公開 RSS を集め、カード形式で一覧表示するフロントエンドサイトです。  
バックエンド API は持たず、**静的サイト + 定期取得した JSON** で動きます。

## 何ができるか

- 複数メディアの RSS を取り込み、カテゴリ別に表示
- カテゴリ絞り込み（すべて / AI / AI理論 / 保険 / 経済 / マーケット）
- タイトル・要約のキーワード検索
- カードから元記事へジャンプ
- 英語記事は取得時に日本語要約（`summaryJa`）を付与（可能な範囲）
- 特定ソース（やなはる・シンニチなど）を `sortBoost` で一覧上やや優先表示

## 全体アーキテクチャ

```text
[公開 RSS 各社]
        │
        ▼  npm run fetch-news / GitHub Actions（1日2回）
scripts/fetch-external-news.mjs
        │
        ▼  書き出し
public/news-feed.json
        │
        ▼  git push → ホスティング（Render 等）がビルド
ブラウザ（React + Vite）
  ├─ Header + カテゴリ（sticky）
  ├─ 検索・記事カード一覧
  └─ localStorage に累積アーカイブを保持
       └─ 起動時に /news-feed.json をマージ
```

ポイントは次の3層です。

| 層 | 役割 |
| --- | --- |
| **取得スクリプト** | RSS を読み、統一フォーマットの JSON を作る |
| **静的アセット** | `public/news-feed.json` をサイトと一緒に配信 |
| **フロント** | JSON を読み、フィルタ・並び替え・カード表示。過去分はブラウザに蓄積 |

## 主なファイル構成

```text
src/
  App.tsx                 # 画面全体（sticky カテゴリ、検索、一覧）
  components/
    Header.tsx            # サイトヘッダー
    NewsCard.tsx          # 記事カード
    Footer.tsx
  hooks/
    useNewsArchive.ts     # news-feed.json 取得 + localStorage 同期
  storage/
    newsArchive.ts        # アーカイブの読み書き・URL 単位マージ
  lib/
    newsSort.ts           # publishedAt + sortBoost で並び替え
    normalizeNewsUrl.ts   # livedoor 等の URL 正規化（http→https）
    timeAgoJa.ts          # 「〇時間前」表示
  data/
    mockNews.ts           # 型定義・カテゴリラベル・初回シード記事

scripts/
  fetch-external-news.mjs # RSS 取得・翻訳・news-feed.json 生成

public/
  news-feed.json          # 最新の取り込み結果（デプロイに含む）

.github/workflows/
  refresh-news-feed.yml   # 定期更新（UTC 0:00 / 12:00 ≒ JST 9:00 / 21:00）
```

## データの流れ（ブラウザ側）

1. 初回は `localStorage`（キー: `news-matome-archive-v1`）が空なら、バンドル内の `MOCK_NEWS` をシード保存
2. 起動後に `GET /news-feed.json` を取得
3. `mergeCumulative` で **同一 URL はフィード側で上書き**、なければ追加
4. `sortNewsItems` で新しい順（＋ `sortBoost`）に並べて表示

このため、サーバーに DB がなくても、ユーザーごとにブラウザ上で記事が積み上がります。  
※ ブラウザのストレージを消すと、その端末の累積分はリセットされます（次回ロードで最新フィードから再構築）。

## RSS 取得の仕組み

`scripts/fetch-external-news.mjs` が各フィードを直列取得し、次のような `NewsItem` に整形します。

- `id` / `title` / `summary` / `url` / `publishedAt` / `category`
- `sourceName` / `sourceIcon` / `bannerClass` / `keywords`
- 任意: `summaryJa`（英語ソース向け簡易翻訳）、`sortBoost`（並び優先）

フィード定義（カテゴリ・件数上限・優先度）はこのスクリプト内の `FEEDS` 配列にあります。  
代表ソース例:

- **AI**: TechCrunch, ITmedia AI
- **AI理論**: arXiv cs.AI, GIGAZINE
- **保険**: Insurance Journal, Artemis, マネープレス, やなはる, シンニチ, 金融庁, ニッセイ基礎研 など
- **経済**: BBC Business, NHK, Yahoo!, 東洋経済
- **マーケット**: CNBC
- **住宅・住宅ローン**: 住宅産業新聞, Mortgage News Daily, HousingWire, Redfin News

一部フィード（例: The Insurer 401、Risk.net 404）は取得失敗時にスキップされます。

### 並び優先（sortBoost）

`sortBoost` 1 ≒ 並び上 **12時間ぶん新しく見せる**加算です（実際の日時は変えません）。

- やなはる: `18`（週次まとめで日付が古くなりやすいため強め）
- シンニチ保険WEB: `5`

調整する場合は `FEEDS` の `sortBoost` を変更し、`npm run fetch-news` を再実行してください。

## 運用・デプロイ

1. **GitHub Actions**（`Refresh news feed`）が 1 日 2 回 `fetch-news` を実行
2. `public/news-feed.json` に差分があれば commit & push
3. ホスティング（Render 等）が `main` 更新を検知して静的ビルド

手動更新:

```bash
npm run fetch-news
git add public/news-feed.json
git commit -m "chore: refresh news-feed.json"
git push
```

または GitHub の Actions 画面から workflow を手動実行。

## ローカル開発

```bash
npm install
npm run fetch-news   # 任意: 最新フィードを取り込む
npm run dev          # http://localhost:5173
```

その他:

```bash
npm run build    # 本番ビルド
npm run preview  # ビルド結果の確認
npm run lint
```

## 画面の要点

- 上部: サイト名・カテゴリ（**スクロールしても sticky 固定**）
- 検索欄: タイトル / 要約 / 日本語要約
- グリッド: `NewsCard`（ソース、相対時刻、カテゴリ、要約、キーワード、元記事リンク）

## 技術スタック

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- rss-parser（取得スクリプト側）
- GitHub Actions（定期フィード更新）
- 静的ホスティング想定（Render など）
