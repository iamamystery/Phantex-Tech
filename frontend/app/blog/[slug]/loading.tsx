// Loading skeleton for an individual article.
export default function ArticleLoading() {
  return (
    <main className="pt-28 pb-24" style={{ background: '#FAFAF8' }} aria-busy="true" aria-label="Loading article">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8 h-3 w-48 animate-pulse rounded bg-stone-200" />
        <div className="mb-4 h-5 w-32 animate-pulse rounded-full bg-stone-200" />
        <div className="mb-3 h-12 w-full animate-pulse rounded-xl bg-stone-200" />
        <div className="mb-8 h-12 w-2/3 animate-pulse rounded-xl bg-stone-200" />
        <div className="mb-10 h-16 w-full animate-pulse rounded-xl bg-stone-200" />
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-stone-200" style={{ width: `${90 - (i % 3) * 12}%` }} />
          ))}
        </div>
      </div>
    </main>
  )
}
