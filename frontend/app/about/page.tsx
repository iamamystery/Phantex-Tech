import type { Metadata } from 'next'
import { getPageSEO } from '@/lib/api'
import { buildMetadata } from '@/components/seo/MetaTags'
import FadeIn from '@/components/ui/FadeIn'
import OrganizationSchema from '@/components/seo/schemas/OrganizationSchema'
import TestimonialMarquee from '@/components/ui/TestimonialMarquee'
import Link from 'next/link'
import { staggerDelay } from '@/lib/motion'

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('about')
  return buildMetadata(seo, {
    title: 'About Phantex Tech — We Engineer the Future',
    description:
      'Phantex Tech builds AI systems, automation platforms, backend infrastructure, and scalable digital products for ambitious companies worldwide.',
    path: '/about',
  })
}

// ─── Page data ────────────────────────────────────────────────────────────────

const CAPABILITIES = [
  {
    title: 'AI Systems',
    items: ['AI Agents', 'Workflow Automation', 'Custom Integrations', 'Intelligent Operations'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    title: 'Backend Engineering',
    items: ['Django & FastAPI', 'REST & GraphQL APIs', 'Scalable Infrastructure', 'Database Architecture'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    title: 'Full Stack Products',
    items: ['MVP Development', 'SaaS Platforms', 'Dashboards', 'Web Applications'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>
    ),
  },
  {
    title: 'Automation Systems',
    items: ['Browser Automation', 'Data Pipelines', 'Data Extraction', 'Business Process Automation'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
]

const PHILOSOPHY = [
  {
    number: '01',
    title: 'Automation First',
    body: 'Every manual process is a future bottleneck. We design systems where automation is the default, not the addition — reducing human error and operational overhead at every layer.',
  },
  {
    number: '02',
    title: 'Built For Scale',
    body: 'Architecture decisions made today determine what is possible tomorrow. We build foundations that grow without breaking — from first deployment to ten million users.',
  },
  {
    number: '03',
    title: 'AI With Purpose',
    body: 'We integrate AI where it creates measurable leverage, not for novelty. Intelligence should reduce friction, accelerate decisions, and surface insights — not add complexity.',
  },
  {
    number: '04',
    title: 'Engineering Excellence',
    body: 'Clean code, proper documentation, testable systems. Quality is not a delivery checkpoint — it is the engineering baseline we maintain from day one.',
  },
]

const METRICS = [
  { value: '50+',   label: 'Projects Delivered' },
  { value: '100k+', label: 'Records Processed Daily' },
  { value: '99.9%', label: 'Workflow Reliability' },
  { value: '<24h',  label: 'Average Response Time' },
]

const REGIONS = [
  { name: 'Americas', detail: 'United States · Canada · Latin America' },
  { name: 'Europe',   detail: 'UK · Germany · Netherlands · Nordics' },
  { name: 'MENA',     detail: 'UAE · Saudi Arabia · Egypt · Pakistan' },
]

// Leadership — static by design (no CMS/avatar dependency): the two founders.
const LEADERSHIP = [
  {
    name: 'Muhammad Jawad Ahmad',
    title: 'Founder & Chief Executive Officer',
    bio: "Leads Phantex's vision, business strategy, AI initiatives, product direction, engineering leadership, cybersecurity practice, client partnerships and long-term company growth. Drives innovation across intelligent software systems and scalable automation solutions.",
    expertise: ['AI Engineering', 'Automation', 'Cybersecurity', 'Product Strategy'],
  },
  {
    name: 'Awais',
    title: 'Co-Founder & Chief Technology Officer',
    bio: 'Leads technical architecture, backend engineering, cloud infrastructure, DevOps, platform reliability and software quality. Oversees the delivery of secure, scalable and high-performance systems across all Phantex products.',
    expertise: ['Backend Engineering', 'Cloud Infrastructure', 'DevOps', 'System Architecture'],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main style={{ background: '#FAFAF8' }}>
      <OrganizationSchema />

      {/* ════════════════════════════════════════════════════════════
          1 · HERO
      ════════════════════════════════════════════════════════════ */}
      <section className="pt-36 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            {/* Eyebrow — exact Testimonials pattern */}
            <span
              className="font-mono font-bold uppercase block mb-6"
              style={{ fontSize: '11px', letterSpacing: '0.35em', color: '#F59E0B' }}
            >
              About Phantex Tech
            </span>

            {/* Display headline */}
            <h1
              className="font-display font-black tracking-tight leading-[0.92] mb-8"
              style={{ fontSize: 'clamp(56px, 8vw, 108px)', color: '#111111' }}
            >
              WE ENGINEER<br />THE FUTURE
            </h1>

            {/* Amber rule — visual anchor below headline */}
            <div className="mb-8" style={{ width: '56px', height: '3px', background: '#F59E0B' }} />

            {/* Supporting copy — #555555 on #FAFAF8 = 7.5:1 */}
            <p
              className="font-body leading-relaxed"
              style={{ fontSize: '18px', color: '#555555', maxWidth: '520px' }}
            >
              Building AI systems, automation platforms, backend infrastructure,
              and scalable digital products for ambitious companies around the world.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          2 · VISION — dark card, mirrors featured testimonial
      ════════════════════════════════════════════════════════════ */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div
              className="relative overflow-hidden"
              style={{
                background: '#0C0C0C',
                borderRadius: '2rem',
                padding: 'clamp(2.5rem, 5vw, 5rem)',
              }}
            >
              {/* Ambient amber glow — bottom-right, same as featured testimonial */}
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: '-80px', right: '-80px',
                  width: '500px', height: '500px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)',
                }}
              />
              {/* Decorative large arrow — lightweight visual texture */}
              <span
                className="absolute font-display font-black pointer-events-none select-none"
                style={{
                  top: '1.5rem', right: '2.5rem',
                  fontSize: '140px', lineHeight: 1,
                  color: 'rgba(255,255,255,0.03)',
                }}
              >
                →
              </span>

              <div className="relative z-10 max-w-3xl">
                <span
                  className="font-mono font-bold uppercase block mb-6"
                  style={{ fontSize: '11px', letterSpacing: '0.35em', color: '#F59E0B' }}
                >
                  Vision
                </span>
                <h2
                  className="font-display font-black text-white leading-[1.05] tracking-tight mb-8"
                  style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
                >
                  The future isn't waiting.
                </h2>
                <div className="space-y-5">
                  <p
                    className="font-body leading-relaxed"
                    style={{ fontSize: '17px', color: 'rgba(255,255,255,0.68)' }}
                  >
                    Companies that embrace intelligent systems move faster, scale better, and operate
                    more efficiently than those that don't. AI is not a future capability — it is the
                    operating layer of modern business today.
                  </p>
                  <p
                    className="font-body leading-relaxed"
                    style={{ fontSize: '17px', color: 'rgba(255,255,255,0.68)' }}
                  >
                    Phantex Tech exists to build that competitive advantage. We design, engineer, and
                    deploy the automation systems, AI pipelines, and scalable infrastructure that turn
                    operational complexity into speed.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          3 · WHAT WE BUILD — 2×2 capability cards
      ════════════════════════════════════════════════════════════ */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="mb-14">
            <span
              className="font-mono font-bold uppercase block mb-4"
              style={{ fontSize: '11px', letterSpacing: '0.35em', color: '#F59E0B' }}
            >
              Capabilities
            </span>
            <h2
              className="font-display font-black tracking-tight"
              style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: '#111111' }}
            >
              What We Build
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CAPABILITIES.map(({ title, items, icon }, i) => (
              <FadeIn key={title} delay={staggerDelay(i)}>
                {/* Card — Testimonials secondary card pattern + hover */}
                <div
                  className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:border-amber-300/60"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #EDEAE4',
                    borderRadius: '20px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    padding: '2rem',
                  }}
                >
                  {/* Icon badge */}
                  <div
                    className="mb-5 flex items-center justify-center"
                    style={{
                      width: '44px', height: '44px',
                      background: 'rgba(245,158,11,0.10)',
                      border: '1px solid rgba(245,158,11,0.20)',
                      borderRadius: '12px',
                      color: '#F59E0B',
                    }}
                  >
                    {icon}
                  </div>

                  {/* Title — #111111 on #FFFFFF = 19:1 */}
                  <h3
                    className="font-display font-black mb-5"
                    style={{ fontSize: '20px', color: '#111111' }}
                  >
                    {title}
                  </h3>

                  {/* Capabilities list */}
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 font-body"
                        style={{ fontSize: '14px', color: '#555555' }}
                      >
                        <span
                          style={{
                            width: '5px', height: '5px',
                            borderRadius: '50%',
                            background: '#F59E0B',
                            flexShrink: 0,
                          }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          4 · HOW WE THINK — philosophy cards with amber left border
      ════════════════════════════════════════════════════════════ */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="mb-14">
            <span
              className="font-mono font-bold uppercase block mb-4"
              style={{ fontSize: '11px', letterSpacing: '0.35em', color: '#F59E0B' }}
            >
              Philosophy
            </span>
            <h2
              className="font-display font-black tracking-tight"
              style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: '#111111' }}
            >
              How We Think
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PHILOSOPHY.map(({ number, title, body }, i) => (
              <FadeIn key={title} delay={staggerDelay(i)}>
                <div
                  className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)]"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #EDEAE4',
                    borderLeft: '3px solid #F59E0B',
                    borderRadius: '20px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    padding: '2rem',
                  }}
                >
                  {/* Number — very light, structural only */}
                  <span
                    className="font-mono font-bold block mb-5"
                    style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#CCCCCC' }}
                  >
                    {number}
                  </span>
                  {/* Title */}
                  <h3
                    className="font-display font-black mb-3"
                    style={{ fontSize: '20px', color: '#111111' }}
                  >
                    {title}
                  </h3>
                  {/* Body — #666666 on #FFFFFF = 7.2:1 */}
                  <p
                    className="font-body leading-relaxed"
                    style={{ fontSize: '14px', color: '#666666' }}
                  >
                    {body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          LEADERSHIP TEAM — static founders section, dark glass cards
      ════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: '#0A0A0A', padding: 'clamp(5rem, 9vw, 9rem) 0' }}
      >
        {/* Ambient glows */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'rgba(245,158,11,0.06)', filter: 'blur(120px)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'rgba(245,120,11,0.04)', filter: 'blur(120px)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <FadeIn className="mb-16 text-center">
            <span
              className="font-mono font-bold uppercase block mb-4"
              style={{ fontSize: '11px', letterSpacing: '0.35em', color: '#F59E0B' }}
            >
              Leadership
            </span>
            <h2
              className="font-display font-black text-white tracking-tight"
              style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
            >
              Leadership Team
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {LEADERSHIP.map((leader, i) => (
              <FadeIn key={leader.name} delay={staggerDelay(i)} className="h-full">
                <div
                  className="group relative h-full overflow-hidden transition-all duration-[250ms] ease-out hover:-translate-y-1.5"
                  style={{
                    borderRadius: '24px',
                    background: 'rgba(255,255,255,0.035)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 50px -24px rgba(0,0,0,0.6)',
                  }}
                >
                  {/* Hairline gold accent — top edge only, very subtle */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)' }}
                  />
                  {/* Border glow on hover */}
                  <div
                    className="absolute inset-0 rounded-[24px] pointer-events-none opacity-0 transition-opacity duration-[250ms] ease-out group-hover:opacity-100"
                    style={{
                      boxShadow: '0 0 0 1px rgba(245,158,11,0.28), 0 24px 60px -20px rgba(245,158,11,0.12)',
                    }}
                  />

                  <div className="relative flex h-full flex-col p-9 sm:p-10">
                    {/* Name */}
                    <h3
                      className="font-display font-black text-white tracking-tight"
                      style={{ fontSize: 'clamp(22px, 2.4vw, 26px)' }}
                    >
                      {leader.name}
                    </h3>

                    {/* Title */}
                    <p
                      className="font-body font-medium mt-2 mb-6"
                      style={{ fontSize: '14.5px', color: 'rgba(245,158,11,0.85)' }}
                    >
                      {leader.title}
                    </p>

                    {/* Description */}
                    <p
                      className="font-body leading-relaxed"
                      style={{ fontSize: '15px', color: 'rgba(255,255,255,0.62)' }}
                    >
                      {leader.bio}
                    </p>

                    {/* Divider */}
                    <div
                      className="mt-8 mb-5"
                      style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }}
                    />

                    {/* Expertise chips */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {leader.expertise.map((skill) => (
                        <span
                          key={skill}
                          className="font-mono"
                          style={{
                            fontSize: '11px',
                            letterSpacing: '0.03em',
                            color: 'rgba(245,158,11,0.75)',
                            background: 'rgba(245,158,11,0.06)',
                            border: '1px solid rgba(245,158,11,0.16)',
                            borderRadius: '8px',
                            padding: '5px 10px',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          5 · GLOBAL BY DESIGN — two-column split
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: text */}
            <FadeIn>
              <span
                className="font-mono font-bold uppercase block mb-5"
                style={{ fontSize: '11px', letterSpacing: '0.35em', color: '#F59E0B' }}
              >
                Reach
              </span>
              <h2
                className="font-display font-black tracking-tight leading-[1.0] mb-7"
                style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', color: '#111111' }}
              >
                GLOBAL BY<br />DESIGN
              </h2>
              <div className="space-y-4">
                <p className="font-body leading-relaxed" style={{ fontSize: '16px', color: '#555555' }}>
                  We collaborate with startups, founders, and growing businesses
                  across multiple regions.
                </p>
                <p className="font-body leading-relaxed" style={{ fontSize: '16px', color: '#555555' }}>
                  Great engineering is not limited by geography. Our systems, workflows,
                  and communication practices are built for global collaboration —
                  async-first, documentation-driven, and delivery-focused.
                </p>
              </div>
            </FadeIn>

            {/* Right: region table — stats-bar treatment */}
            <FadeIn delay={0.15}>
              <div
                className="overflow-hidden"
                style={{ border: '1px solid #EDEAE4', borderRadius: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
              >
                {REGIONS.map(({ name, detail }, i) => (
                  <div
                    key={name}
                    className="flex items-center justify-between px-6 py-5"
                    style={{
                      background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8',
                      borderBottom: i < REGIONS.length - 1 ? '1px solid #F0EDE8' : 'none',
                    }}
                  >
                    {/* Region name — #111111 */}
                    <span
                      className="font-display font-black"
                      style={{ fontSize: '17px', color: '#111111' }}
                    >
                      {name}
                    </span>
                    {/* Detail — #777777 = 4.6:1 on white */}
                    <span
                      className="font-body text-right"
                      style={{ fontSize: '13px', color: '#777777' }}
                    >
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          6 · METRICS — exact Testimonials stats-bar pattern
      ════════════════════════════════════════════════════════════ */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div
              className="grid grid-cols-2 md:grid-cols-4 overflow-hidden"
              style={{ border: '1px solid #EDEAE4', borderRadius: '20px' }}
            >
              {METRICS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center py-10 px-4 text-center"
                  style={{
                    background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8',
                    borderRight: i < METRICS.length - 1 ? '1px solid #EDEAE4' : 'none',
                  }}
                >
                  <span
                    className="font-display font-black leading-none tracking-tight mb-2"
                    style={{ fontSize: 'clamp(28px, 3vw, 42px)', color: '#111111' }}
                  >
                    {value}
                  </span>
                  <span
                    className="font-mono font-bold uppercase"
                    style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#777777' }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TESTIMONIALS — existing component, retained
      ════════════════════════════════════════════════════════════ */}
      <TestimonialMarquee />

      {/* ════════════════════════════════════════════════════════════
          7 · CTA — dark card, mirrors Vision section
      ════════════════════════════════════════════════════════════ */}
      <section className="py-8 pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div
              className="relative overflow-hidden text-center"
              style={{
                background: '#0C0C0C',
                borderRadius: '2rem',
                padding: 'clamp(3rem, 6vw, 6rem) clamp(2rem, 5vw, 5rem)',
              }}
            >
              {/* Radial amber glow — center-bottom */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 110%, rgba(245,158,11,0.09) 0%, transparent 60%)',
                }}
              />

              <div className="relative z-10">
                <span
                  className="font-mono font-bold uppercase block mb-6"
                  style={{ fontSize: '11px', letterSpacing: '0.35em', color: '#F59E0B' }}
                >
                  Start Building
                </span>

                <h2
                  className="font-display font-black text-white tracking-tight leading-[1.0] mb-8 mx-auto"
                  style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', maxWidth: '760px' }}
                >
                  READY TO BUILD SOMETHING BIG?
                </h2>

                <p
                  className="font-body leading-relaxed mb-12 mx-auto"
                  style={{ fontSize: '17px', color: 'rgba(255,255,255,0.62)', maxWidth: '560px' }}
                >
                  Whether you're launching an MVP, building an AI-powered product,
                  automating operations, or scaling infrastructure — we're ready to
                  engineer the future with you.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Primary CTA — amber, same as Testimonials metric badge color family */}
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 font-display font-bold uppercase px-8 py-4 rounded-xl transition-colors duration-200 group"
                    style={{ fontSize: '12px', letterSpacing: '0.2em', background: '#F59E0B', color: '#111111' }}
                  >
                    Schedule Discovery Call
                    <svg
                      className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>

                  {/* Secondary — ghost */}
                  <Link
                    href="/work"
                    className="inline-flex items-center gap-2 font-mono font-bold uppercase transition-colors duration-200 hover:text-amber-400"
                    style={{ fontSize: '11px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.40)' }}
                  >
                    View Our Work
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </main>
  )
}
