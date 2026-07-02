import FadeIn from '@/components/ui/FadeIn'
import { staggerDelay } from '@/lib/motion'

interface StatItem {
  value: string
  label: string
  description: string
}

const STATS: StatItem[] = [
  {
    value: '50+',
    label: 'Projects Delivered',
    description: 'Scrapers, automations, and AI pipelines shipped to production',
  },
  {
    value: '30+',
    label: 'Happy Clients',
    description: 'SaaS startups that trust us to automate their critical workflows',
  },
  {
    value: '12+',
    label: 'Tools Mastered',
    description: 'From Playwright to LangChain — we pick the right tool every time',
  },
  {
    value: '98%',
    label: 'Satisfaction Rate',
    description: 'Clients who come back for the next project, and the one after that',
  },
]

export default function Stats() {
  return (
    <section className="py-24 md:py-32 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Amber gradient line top */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent mb-16" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((stat, i) => (
            <FadeIn key={stat.label} delay={staggerDelay(i)}>
              <div className="flex flex-col gap-2">
                <div className="font-display text-5xl md:text-6xl font-extrabold text-white tabular-nums">
                  {stat.value}
                </div>
                <div className="font-body text-sm font-semibold text-amber-500 uppercase tracking-wider">
                  {stat.label}
                </div>
                <p className="font-body text-sm text-stone-400 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Amber gradient line bottom */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent mt-16" />
      </div>
    </section>
  )
}
