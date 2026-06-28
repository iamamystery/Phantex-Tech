// Loading skeleton for the blog index. Shown during navigation/streaming.
export default function BlogLoading() {
  return (
    <main className="pt-36 pb-24" style={{ background: '#FAFAF8' }} aria-busy="true" aria-label="Loading articles">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 h-3 w-40 animate-pulse rounded bg-stone-200" />
        <div className="mb-4 h-16 w-3/4 animate-pulse rounded-xl bg-stone-200" />
        <div className="mb-12 h-4 w-1/2 animate-pulse rounded bg-stone-200" />
        <div className="mb-14 h-14 w-full animate-pulse rounded-2xl bg-stone-200" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-white" style={{ border: '1px solid #EDEAE4' }} />
          ))}
        </div>
      </div>
    </main>
  )
}
