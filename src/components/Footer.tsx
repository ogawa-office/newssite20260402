export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200/90 bg-white/60 px-4 py-10 text-center text-sm text-slate-500 sm:px-6">
      <p className="mx-auto max-w-2xl leading-relaxed">
        記事一覧はこのブラウザに保存され、新しい記事は既存の一覧に追加されます（累積）。別の端末やブラウザでは共有されません。
      </p>
      <p className="mt-3 text-xs text-slate-400">© {new Date().getFullYear()} ニュースまとめ</p>
    </footer>
  )
}
