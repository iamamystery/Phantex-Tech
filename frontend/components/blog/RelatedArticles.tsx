import FadeIn from '@/components/ui/FadeIn'
import ArticleCard from './ArticleCard'
import type { ResolvedArticle } from '@/content/types'

// Related-articles rail. Always renders something when related articles exist;
// the parent only mounts it when there is at least one.
export default function RelatedArticles({ articles }: { articles: ResolvedArticle[] }) {
  if (articles.length === 0) return null

  return (
    <section aria-labelledby="related-heading" className="mt-16 pt-12" style={{ borderTop: '1px solid #EDEAE4' }}>
      <FadeIn className="mb-8">
        <span className="mb-3 block font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-amber-500">
          Keep reading
        </span>
        <h2 id="related-heading" className="font-display text-2xl font-black tracking-tight text-[#111111]">
          Related articles
        </h2>
      </FadeIn>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {articles.map((article, i) => (
          <ArticleCard key={article.slug} article={article} index={i} />
        ))}
      </div>
    </section>
  )
}
