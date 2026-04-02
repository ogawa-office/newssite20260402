export type NewsCategory =
  | 'ai'
  | 'ai_theory'
  | 'insurance'
  | 'economy'
  | 'market'

export interface NewsItem {
  id: string
  title: string
  summary: string
  sourceName: string
  sourceIcon: string
  publishedAt: string
  category: NewsCategory
  keywords: string[]
  bannerClass: string
  isNew?: boolean
  /** 元記事の permalink */
  url: string
}

export const CATEGORY_LABEL: Record<NewsCategory, string> = {
  ai: 'AI',
  ai_theory: 'AIに関する最新理論',
  insurance: '保険',
  economy: '経済',
  market: 'マーケット',
}

export const CATEGORY_BADGE: Record<NewsCategory, string> = {
  ai: 'AI',
  ai_theory: 'AI・最新理論',
  insurance: '保険',
  economy: '経済',
  market: 'マーケット',
}

export const CATEGORY_PILL: Record<
  NewsCategory,
  { bg: string; active: string }
> = {
  ai: {
    bg: 'bg-sky-100 text-sky-800',
    active: 'bg-sky-100 text-sky-900 border-sky-400 ring-1 ring-sky-300',
  },
  ai_theory: {
    bg: 'bg-rose-100 text-rose-900',
    active: 'bg-rose-100 text-rose-950 border-rose-400 ring-1 ring-rose-300',
  },
  insurance: {
    bg: 'bg-emerald-100 text-emerald-900',
    active: 'bg-emerald-100 text-emerald-950 border-emerald-400 ring-1 ring-emerald-300',
  },
  economy: {
    bg: 'bg-amber-100 text-amber-950',
    active: 'bg-amber-100 text-amber-950 border-amber-400 ring-1 ring-amber-300',
  },
  market: {
    bg: 'bg-violet-100 text-violet-900',
    active: 'bg-violet-100 text-violet-950 border-violet-400 ring-1 ring-violet-300',
  },
}

const ago = (hours: number) =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
const daysAgo = (d: number) =>
  new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString()

/** カテゴリごとに5件ずつ（計25件） */
export const MOCK_NEWS: NewsItem[] = [
  // --- AI（5件）---
  {
    id: 'ai-1',
    title: '推論APIのレイテンシ、中央値が前年比で32%改善とベンダー調査',
    summary:
      '国内外7社のマネージド推論APIを対象にした第三者計測では、同条件（入力2kトークン・出力512トークン）のp50レイテンシが平均820msから560msへ短縮。コールドスタート発生率も11.2%から6.4%に低下。利用側では月間リクエスト数が前年同月比で約2.1倍に伸び、単価あたり粗利を押し上げているとの試算も示されている。',
    sourceName: 'クラウドウォッチ',
    sourceIcon: '☁️',
    publishedAt: ago(3),
    category: 'ai',
    keywords: ['API', 'レイテンシ', '推論'],
    bannerClass: 'from-slate-800 to-slate-600',
    isNew: true,
    url: 'https://openai.com/index/api-prompt-caching/',
  },
  {
    id: 'ai-2',
    title: 'マルチモーダル評価：新ベンチでスコアが平均18ポイント上振れ',
    summary:
      '公開データセット3.2万件を用いた新ベンチでは、前世代比で画像＋表の組み合わせタスクの正答率が61%→79%に改善。長さ32kトークン超の文脈では、位置推定タスクの誤差中央値が0.38→0.12に縮小。評価コミュニティでは再現性のためのシード固定手順も公開され、再現実験のズレが±1.2ポイント以内に収まったと報告されている。',
    sourceName: 'Google AI Blog',
    sourceIcon: '🔵',
    publishedAt: ago(9),
    category: 'ai',
    keywords: ['AI', 'ベンチマーク', 'マルチモーダル'],
    bannerClass: 'from-indigo-950 to-blue-800',
    url: 'https://blog.google/products/gemini/gemini-3',
  },
  {
    id: 'ai-3',
    title: 'コードエージェント：大規模リポジトリでマージまでの時間が41%短縮',
    summary:
      '従業員500名規模の開発組織でのA/Bテストでは、エージェント導入群ではプルリク当たりのレビュー往復が平均2.7回→1.6回に減少。CI失敗の再試行率も22%→9%に低下し、1スプリントあたりのデプロイ回数が1.8→2.6回へ増加。試算では年間約1.2万時間の工数再配分が可能との試算が示された。',
    sourceName: 'Claude Code Releases',
    sourceIcon: '🧡',
    publishedAt: ago(14),
    category: 'ai',
    keywords: ['AI', '開発効率', 'エージェント'],
    bannerClass: 'from-orange-800 to-amber-600',
    url: 'https://www.anthropic.com/news/claude-code-on-the-web',
  },
  {
    id: 'ai-4',
    title: 'オンプレ推論：8bit量子化でスループットが2.3倍、精度低下は0.6pt',
    summary:
      '代表的な70B級モデルを対象に、重み8bit・KVキャッシュ最適化の組み合わせで、1台あたりのトークン処理量が1,850 tok/sから4,240 tok/sに向上。知識系タスクの平均スコアは78.4から77.8へと低下幅を抑制。電力消費は推論あたりで概算18%削減。製造業向けPoCでは月間推論コストを約37%圧縮できた事例が紹介されている。',
    sourceName: 'PyTorch Blog',
    sourceIcon: '🔥',
    publishedAt: daysAgo(2),
    category: 'ai',
    keywords: ['量子化', 'オンプレ', 'スループット'],
    bannerClass: 'from-violet-950 to-purple-700',
    url: 'https://pytorch.org/blog/pytorch2-5/',
  },
  {
    id: 'ai-5',
    title: '責任あるAI：ガバナンス指標チェックリストが120項目に拡張',
    summary:
      'リスク分類・データ系譜・人間承認ログを束ねるテンプレートが改訂され、監査サンプルでは不備検知率が前期比で14%改善。クラウド上のポリシー違反アラートは1万件/月→6,200件/月に減少。顧客向けレポートでは、重大インシデントの平均封じ込め時間が4.2時間→2.1時間になったと報告されている。',
    sourceName: 'Microsoft AI',
    sourceIcon: '⬛',
    publishedAt: daysAgo(5),
    category: 'ai',
    keywords: ['ガバナンス', '監査', 'コンプライアンス'],
    bannerClass: 'from-indigo-950 to-indigo-700',
    url: 'https://www.microsoft.com/en-us/ai/principles-and-approach',
  },

  // --- AIに関する最新理論（5件）---
  {
    id: 'th-1',
    title: 'Test-time compute：最適割り当てで小モデルが14倍大モデルに匹敵',
    summary:
      '同一FLOPs予算で比較した結果、ベストオブN探索と適応的停止を組み合わせると、7B級が特定の数学ベンチで比較対象の98B級を上回るケースが報告。探索幅Nを動的に変える戦略では、難易度上位20%の問題に計算の62%を集中させると、全体正答率が+9.3ポイント。再現用コードとシード付きログも公開された。',
    sourceName: 'arXiv / ML',
    sourceIcon: '◆',
    publishedAt: ago(6),
    category: 'ai_theory',
    keywords: ['推論時計算', 'スケーリング', 'AI理論'],
    bannerClass: 'from-rose-900 via-fuchsia-900 to-violet-900',
    isNew: true,
    url: 'https://arxiv.org/abs/2408.03314',
  },
  {
    id: 'th-2',
    title: 'LLM推論の効率化サーベイ：手法を3層に分類し比較表を更新',
    summary:
      'データ段階・モデル段階・システム段階の三層に整理し、代表的56手法をスループット・遅延・品質の3軸で比較。量子化とアテンション近似を併用した場合、エッジ端末では平均2.1倍の高速化が得られるとのメタ分析。引用文献は420本超。再現実験パッケージのダウンロード数は公開3週間で1.8万回を突破した。',
    sourceName: 'Hugging Face Papers',
    sourceIcon: '🤗',
    publishedAt: daysAgo(1),
    category: 'ai_theory',
    keywords: ['サーベイ', '効率化', 'LLM'],
    bannerClass: 'from-teal-900 to-cyan-700',
    url: 'https://huggingface.co/papers/2404.14294',
  },
  {
    id: 'th-3',
    title: '世界モデルとRL：想像上のロールアウトがサンプル効率を約3.8倍',
    summary:
      '連続制御タスクのベンチでは、環境モデルによる10ステップ先までの予測を用いた方策更新が、モデルフリー手法と比較して必要サンプル数を約3.8倍削減。長期ホライゾンでは誤差蓄積が課題となり、5ステップ以降は信頼度に応じて計画を切り替えるハイブリッドが最も安定。補助資料に学習曲線の生データも添付されている。',
    sourceName: 'NeurIPS 速報',
    sourceIcon: '◎',
    publishedAt: daysAgo(4),
    category: 'ai_theory',
    keywords: ['世界モデル', '強化学習', 'サンプル効率'],
    bannerClass: 'from-amber-950 to-orange-900',
    url: 'https://arxiv.org/abs/2305.15441',
  },
  {
    id: 'th-4',
    title: 'スパース注意：長系列でFLOPsを61%削減、精度差は0.8ポイント以内',
    summary:
      '長さ64kの合成タスクで、ブロックスパース＋動的マスクの併用が有効。フル注意と比較して学習収束までのステップ数は1.4倍に増える一方、推論時のメモリ占有を約55%削減。実装はオープンソース化され、コミュニティからのPRが2週間で47件寄せられた。',
    sourceName: 'Theory & Models',
    sourceIcon: '◇',
    publishedAt: ago(20),
    category: 'ai_theory',
    keywords: ['注意機構', '計算量', '長コンテキスト'],
    bannerClass: 'from-fuchsia-900 to-rose-800',
    url: 'https://arxiv.org/abs/2005.14165',
  },
  {
    id: 'th-5',
    title: '自己蒸留：教師なしで小型モデルが大型の92%性能に接近',
    summary:
      '同一アーキテクチャ内で段階的蒸留を繰り返す手法を提案し、12億パラメータモデルが720億モデルの出力分布に近づくまで学習。人手ラベル0の設定でも、多言語理解ベンチでスコアが68.1→74.6に向上。学習に要したGPU時間はフルファインチューン比で約41%に抑えられた。',
    sourceName: 'arXiv / ML',
    sourceIcon: '◆',
    publishedAt: daysAgo(8),
    category: 'ai_theory',
    keywords: ['蒸留', '自己教師', '効率学習'],
    bannerClass: 'from-slate-900 to-violet-900',
    url: 'https://arxiv.org/abs/2103.00020',
  },

  // --- 保険（5件）---
  {
    id: 'in-1',
    title: '損害査定の画像AI：一次判定の一致率が87%まで向上、再査定は−23%',
    summary:
      '国内3社の共同PoCでは、軽微事故の写真約4.2万件を対象に自動分類と損傷領域推定を導入。一次判定と最終支払のカテゴリ一致率は前年比で74%→87%に改善。再査定に入る案件は全体の19%→12%へ減少し、顧客あたりの平均リードタイムが6.3日→4.1日に短縮。説明ログは監査用に180日保管する運用とした。',
    sourceName: '保険ジャーナル',
    sourceIcon: '🛡️',
    publishedAt: ago(4),
    category: 'insurance',
    keywords: ['損害保険', 'AI査定', 'PoC'],
    bannerClass: 'from-slate-800 via-slate-700 to-amber-900/90',
    isNew: true,
    url: 'https://www.nli-research.co.jp/report/detail/id=75181?site=nli',
  },
  {
    id: 'in-2',
    title: '生命保険の動的積立：シナリオ5000本で充足率のばらつきを可視化',
    summary:
      '資産配分を四象限に分けたストレステストでは、最悪シナリオ下でも責任準備金の充足を維持できる割合が96.2%（前年試算は93.1%）。金利+100bpsの並行シフトでは契約者価値の中央値が−4.7%変動。開示テンプレは監督当局のQ&A改訂版に整合する形で、脚注に試算前提を28項目列挙した。',
    sourceName: 'Actuarial Review JP',
    sourceIcon: '📊',
    publishedAt: daysAgo(2),
    category: 'insurance',
    keywords: ['生命保険', 'ALM', 'ストレステスト'],
    bannerClass: 'from-emerald-950 to-teal-800',
    url: 'https://www.nli-research.co.jp/report/detail/id=85047?site=nli',
  },
  {
    id: 'in-3',
    title: '介護保険財政：第X期で標準報酬の改定幅が前回比+0.9%に',
    summary:
      '都道府県単位の試算では、給付費の伸びが人口構造要因で年率+2.3%となる一方、予防・支援の利用率向上で入院相当の抑制効果が年間約480億円相当と推計。保険料率のシミュレーションでは、基準ケースで将来10年の累積上昇幅が1.7ポイント以内に収まる設定が示された。',
    sourceName: '社会保障レポート',
    sourceIcon: '📋',
    publishedAt: daysAgo(6),
    category: 'insurance',
    keywords: ['介護保険', '財政試算', '保険料'],
    bannerClass: 'from-teal-900 to-emerald-800',
    url: 'https://www.nli-research.co.jp/report/detail/id=85064?site=nli',
  },
  {
    id: 'in-4',
    title: '海外子会社のSolvencyⅡ：相手国当局との資本連携で重複評価を12%削減',
    summary:
      'グループ内でのリスク移転と内部モデルの一部承認により、連結ベースの必要資本に占める重複計上が前年末比で約12%減。オペレーショナルリスクの自己評価は、インシデント件数ベースの頻度を四半期ごとに更新。監査法人のサンプリング調査では指摘件数が前年の31件から19件に減少した。',
    sourceName: '国際保険ウォッチ',
    sourceIcon: '🌐',
    publishedAt: ago(30),
    category: 'insurance',
    keywords: ['Solvency', '連結', '資本'],
    bannerClass: 'from-slate-900 to-slate-700',
    url: 'https://www.nli-research.co.jp/report/detail/id=65851?site=nli',
  },
  {
    id: 'in-5',
    title: '自動車保険：テレマティクス加入者の事故率が非加入比で−18%',
    summary:
      '匿名化された走行距離・急減速回数をスコア化し、年間保険料を最大12%割り引くプログラムの第2弾結果。走行データ提供に同意した約14万台のうち、スコア上位30%層は事故発生率が非加入群より18%低いことが統計的に有意。プライバシー設計では位置情報の粗いグリッド化と90日での再同意を義務付けた。',
    sourceName: '損保アナリティクス',
    sourceIcon: '🚗',
    publishedAt: ago(11),
    category: 'insurance',
    keywords: ['テレマティクス', '料率', 'UBI'],
    bannerClass: 'from-cyan-900 to-teal-900',
    url: 'https://www.nli-research.co.jp/report/detail/id=79644?site=nli',
  },

  // --- 経済（5件）---
  {
    id: 'ec-1',
    title: '世界GDP成長率：2025年見通しが+3.2%に下方修正、貿易摩擦が下振れ要因',
    summary:
      '先進国では設備投資の伸びが年率+1.1%と鈍化。新興国では半導体向け輸出が前年比+9%増と牽引した一方、資源国は価格下落で財政余力が縮小。インフレ鈍化ペースは各国でばらつき、サービス価格の残存圧力がCPIを年率+0.3ポイント押し上げているとの試算が付記されている。',
    sourceName: '経済ウォッチ',
    sourceIcon: '¥',
    publishedAt: ago(5),
    category: 'economy',
    keywords: ['GDP', 'IMF', '見通し'],
    bannerClass: 'from-stone-800 to-neutral-700',
    url: 'https://www.imf.org/en/Publications/WEO/Issues/2024/10/22/world-economic-outlook-october-2024',
  },
  {
    id: 'ec-2',
    title: '実質賃金：3か月平均で前年比+0.4%、物価連動ボーナスが寄与',
    summary:
      '定期昇給と一時金を合算した名目賃金の伸びは前年同月比+2.8%。消費者物価（生鮮除く）の上昇率+2.4%を上回り、実質ベースでは12か月ぶりのプラス圏。業種別では情報通信と運輸がそれぞれ+4.1%と+3.6%の伸び。残業時間は月あたり平均7.2時間と、前年比で−3%と抑制傾向が続く。',
    sourceName: '労働経済ニュース',
    sourceIcon: '👷',
    publishedAt: daysAgo(3),
    category: 'economy',
    keywords: ['賃金', '物価', '実質'],
    bannerClass: 'from-amber-900 to-yellow-900',
    url: 'https://www.imf.org/en/Publications/WEO/Issues/2024/10/22/world-economic-outlook-october-2024',
  },
  {
    id: 'ec-3',
    title: '財政規律：プライマリバランス改善幅が対GDP比で0.6ポイントに',
    summary:
      '歳出の自然増を社会保障改革と投資効率化で相殺し、税収は名目GDP成長に連動して+2.9%増。国債残存期間の加重平均は7.8年から8.1年へ延長。金利ショック試算では、長期金利が+100bpの場合、債務費が対GDP比で0.35ポイント押し上げられるとの感応度分析が添付された。',
    sourceName: '財政モニター',
    sourceIcon: '📎',
    publishedAt: daysAgo(9),
    category: 'economy',
    keywords: ['財政', '国債', 'プライマリ'],
    bannerClass: 'from-neutral-900 to-stone-800',
    url: 'https://www.imf.org/en/Publications/WEO/Issues/2024/10/22/world-economic-outlook-october-2024',
  },
  {
    id: 'ec-4',
    title: '生産年齢人口：2040年までに15%減少シナリオで潜在成長は年0.8%前後',
    summary:
      '労働供給シミュレーションでは、65歳以上の就業拡大で供給を年0.2ポイント補う一方、全要素生産性の年率+1.0%を達成しないと潜在成長は1%を下回る。移民・外国人材の受け入れを倍増させた場合でも、教育訓練投資が遅れると5年以内に生産性効果は半減するとの感度分析が示された。',
    sourceName: '人口経済研究所',
    sourceIcon: '👥',
    publishedAt: ago(18),
    category: 'economy',
    keywords: ['人口', '潜在成長', '生産性'],
    bannerClass: 'from-rose-950 to-orange-950',
    url: 'https://www.imf.org/en/Publications/WEO/Issues/2024/10/22/world-economic-outlook-october-2024',
  },
  {
    id: 'ec-5',
    title: '地方税収：観光関連の消費税取りが前年比+11%、宿泊税は6地域で増収',
    summary:
      '訪問者数の回復に伴い、土曜中心の稼働だった宿泊施設の平日稼働率が62%→71%に改善。小売・飲食のカード決済データを用いた推計では、地方中枢都市の夜間人口が前年比+4.2%。ただし人手不足でサービス業の時間外労働が法定上限に近い事業所は全体の13%に達した。',
    sourceName: '地域経済レター',
    sourceIcon: '🏯',
    publishedAt: daysAgo(1),
    category: 'economy',
    keywords: ['地方', '税収', '観光'],
    bannerClass: 'from-green-950 to-emerald-900',
    url: 'https://www.imf.org/en/Blogs/Articles/2024/10/22/as-inflation-recedes-global-economy-needs-policy-triple-pivot',
  },

  // --- マーケット（5件）---
  {
    id: 'mk-1',
    title: '主要株価指数：四半期リターンはMSCI世界が+6.1%、為替影響を除くと+4.8%',
    summary:
      'セクター別では半導体関連が指数寄与度の約22%を占め、エネルギーは在庫積み増し懸念で−3.4%。インプライド・ボラティリティは20近辺で推移し、実現ボラとのギャップが縮小。信用市場ではハイイールドスプレッドが基準比+38bp拡大し、投資適格級は−5bpと安定した。',
    sourceName: 'マーケット朝刊',
    sourceIcon: '📈',
    publishedAt: ago(2),
    category: 'market',
    keywords: ['株価', '指数', 'セクター'],
    bannerClass: 'from-indigo-950 to-blue-800',
    isNew: true,
    url: 'https://www.imf.org/en/Publications/GFSR/Issues/2024/10/22/global-financial-stability-report-october-2024',
  },
  {
    id: 'mk-2',
    title: '長期金利：10年国債利回りが一時1.85%、利下げ観測と長短ギャップが縮小',
    summary:
      'インスワップレートは1年×5年が−12bp、5年×10年が−8bpと逆転幅が縮小。外国投資家の国債買い越しは前月比+1,240億円。先物市場ではレートカット織り込みが年内2.25回から1.75回相当へ後退。実質金利は依然マイナス圏で、金利敏感株のPERは過去5年平均を約0.8σ上回る水準。',
    sourceName: '金利ストラテジー',
    sourceIcon: '📉',
    publishedAt: ago(7),
    category: 'market',
    keywords: ['金利', '国債', 'スワップ'],
    bannerClass: 'from-slate-900 to-blue-950',
    url: 'https://www.imf.org/en/Publications/GFSR/Issues/2024/10/22/global-financial-stability-report-october-2024',
  },
  {
    id: 'mk-3',
    title: '為替：実効レートが5年ぶりの水準、輸出企業のヘッジ比率は68%に上昇',
    summary:
      '対ドルはボラティリティ加重で見た年間変動幅が前年の11.2%から9.8%に低下。オプション市場ではリスクリバーサルのスキューが均衡に近づき、極端なショック価格が薄まった。企業アンケートでは為替ヘッジの平均満期が9.3か月から11.1か月へ延長。原材料調達のローカル化で為替感応度が低下した回答が全体の41%を占めた。',
    sourceName: 'FXインサイト',
    sourceIcon: '💱',
    publishedAt: daysAgo(4),
    category: 'market',
    keywords: ['為替', 'ヘッジ', 'オプション'],
    bannerClass: 'from-violet-950 to-indigo-900',
    url: 'https://www.imf.org/en/Publications/GFSR/Issues/2024/10/22/global-financial-stability-report-october-2024',
  },
  {
    id: 'mk-4',
    title: '商品：原油が週間で−4.2%、在庫増加と供給再開が重し',
    summary:
      '在庫は商業在庫で前週比+420万桶、戦略備蓄の放出自粛も一服。天然ガスは気象モデルの暖冬修正で−6.1%。貴金属は実質金利上昇を受けて金がオンスあたり−1.8%。農産物指数は穀物の輸出制限緩和で一時反発したが、週末にはトレンドライン下限を試す展開となった。',
    sourceName: 'コモディティ速報',
    sourceIcon: '🛢️',
    publishedAt: ago(1),
    category: 'market',
    keywords: ['原油', '商品', '在庫'],
    bannerClass: 'from-amber-950 to-red-950',
    url: 'https://www.imf.org/en/Publications/GFSR/Issues/2024/10/22/global-financial-stability-report-october-2024',
  },
  {
    id: 'mk-5',
    title: 'クレジット：投資適格社債のデフォルト率が12か月先で1.1%に低下見通し',
    summary:
      'レバレッジ比率の中央値は前年同期比で0.2回転改善。ローン市場ではシニアローンのスプレッドがS+185bp前後で横ばい。CLOの劣後トランチ利回りは要求水準が15bps低下し、新規発行は四半期で約180億ドル。地政学リスクを織り込んだストレステストでは格下げ率が+1.4ポイント上振れするシナリオも提示された。',
    sourceName: 'クレジットレター',
    sourceIcon: '📑',
    publishedAt: daysAgo(7),
    category: 'market',
    keywords: ['社債', 'スプレッド', 'CLO'],
    bannerClass: 'from-zinc-900 to-slate-800',
    url: 'https://www.imf.org/en/Publications/GFSR/Issues/2024/10/22/global-financial-stability-report-october-2024',
  },
]
