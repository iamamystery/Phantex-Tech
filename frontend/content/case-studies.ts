import type { CaseStudy } from './types'
import { formatDate } from './utils'

// ─────────────────────────────────────────────────────────────────────────────
// Client case studies. Each has a dedicated page at /blog/case-studies/<slug>.
// ─────────────────────────────────────────────────────────────────────────────

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'revenue-analytics-saas',
    client: 'Revenue Analytics SaaS',
    tag: 'SaaS',
    category: 'Data Engineering',
    title: 'Automating Revenue Reporting for a Analytics SaaS',
    summary:
      'Automated data aggregation and report generation pipeline replacing 6+ hours of manual analyst work per week.',
    metric: '6 Hours',
    metricLabel: 'Saved Per Analyst Weekly',
    date: '2025-03-18',
    duration: '5 weeks',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Airflow'],
    outcomes: [
      { value: '6 hrs', label: 'Saved per analyst, weekly' },
      { value: '100%', label: 'Reduction in copy-paste errors' },
      { value: '< 20 min', label: 'End-to-end run time' },
    ],
    problem:
      'A revenue analytics SaaS had three analysts each spending the better part of a day every week assembling the same board-level report. The process meant logging into four systems, exporting spreadsheets, reconciling figures that never quite matched, and rebuilding charts by hand. The numbers were frequently stale by the time leadership saw them, and a copy-paste slip had twice led to wrong figures in a board deck.',
    architecture:
      'We built a four-stage pipeline — extract, reconcile, render, deliver. Source data is pulled concurrently from the billing API, CRM, product warehouse, and support system. A reconciliation layer encodes the analysts\' judgment calls (billing wins over CRM for revenue, internal accounts are dropped) as explicit, tested rules. A rendering stage produces a pixel-matched PDF plus a live dashboard, and a delivery stage emails it to the distribution list on a schedule.',
    solution:
      'The pipeline runs on a schedule every Monday at 7am, before the work week starts. Every run is idempotent and archives the raw extracted data so any figure can be traced to its source. A reconciliation report surfaces any accounts present in one system but not another, so discrepancies are visible instead of silently dropping revenue. A heartbeat watchdog alerts the team if a scheduled run ever fails to produce a report.',
    challenges:
      'The hardest part was not the code but capturing the tribal knowledge — the undocumented adjustments analysts made by instinct. We ran working sessions to document every judgment call, then encoded each as a named, tested function. A secondary challenge was reconciling systems that disagreed about which accounts existed; we solved it with an explicit reconciliation report rather than blindly trusting one source.',
    results:
      'Six hours of weekly work per analyst collapsed to a 20-minute unattended run. Copy-paste errors were eliminated entirely because every figure is now derived from source systems by tested rules. The report lands before Monday standup instead of mid-week, and analysts were freed to investigate why the numbers moved rather than assembling them.',
    lessons:
      'Automating the analyst\'s judgment, not just their clicks, is what earned the system\'s trust. A naive export-and-paste bot would have produced subtly wrong numbers and been switched off within a month. The reconciliation report and heartbeat alerting were the unglamorous features that made the automation dependable enough to bet a board report on.',
  },
  {
    slug: 'ecommerce-platform-sync',
    client: 'E-commerce Platform',
    tag: 'E-commerce',
    category: 'Automation',
    title: 'Real-Time Product Sync Across 12 Marketplaces',
    summary:
      'Real-time product sync, pricing automation, and inventory management across 12 marketplace integrations.',
    metric: '50,000+',
    metricLabel: 'Products Processed Daily',
    date: '2025-02-10',
    duration: '8 weeks',
    stack: ['Python', 'Playwright', 'Redis', 'PostgreSQL', 'Docker'],
    outcomes: [
      { value: '50K+', label: 'Products synced daily' },
      { value: '12', label: 'Marketplace integrations' },
      { value: '99.7%', label: 'Sync success rate' },
    ],
    problem:
      'An e-commerce platform was managing listings across twelve marketplaces, several of which had no usable API. Staff were manually updating prices and stock levels, which meant listings were perpetually out of date, oversells were common, and pricing lagged the market by days. As the catalogue grew past tens of thousands of SKUs, manual management became impossible.',
    architecture:
      'We built a queue-based sync engine. A producer enqueues per-SKU sync tasks; a fleet of stateless workers pulls from the queue. For marketplaces with APIs we use them directly; for those without, Playwright automates the listing UI with persisted sessions. Every write is idempotent and keyed on a content fingerprint, so a SKU is only updated when something actually changed.',
    solution:
      'Pricing rules run as a transform stage that computes each marketplace price from a base price plus per-channel rules. Inventory is reconciled against a single source of truth to prevent oversells. Workers are bounded by per-domain rate limits so no single marketplace is hammered, and a dead-letter queue captures any SKU that fails repeatedly for human review.',
    challenges:
      'The marketplaces without APIs were the core challenge — their UIs changed without notice and employed anti-automation measures. We addressed this with resilient role/label-based locators, persisted authenticated sessions with automatic refresh, and a dry-run health check that alerts when a target UI changes before it breaks a live run. Per-domain rate limiting kept the automation from tripping fraud detection.',
    results:
      'The platform now syncs over 50,000 products daily across all twelve channels at a 99.7% success rate. Oversells dropped to near zero, pricing tracks the market within minutes instead of days, and the staff previously tied up in manual updates were redeployed to merchandising and growth.',
    lessons:
      'Treating each browser as a disposable, recyclable resource and every sync as idempotent was what let the system scale across three orders of magnitude without a rewrite. The dry-run health check proved invaluable: it turned marketplace UI changes from production incidents into proactive tickets.',
  },
  {
    slug: 'b2b-startup-mvp',
    client: 'B2B Startup',
    tag: 'B2B',
    category: 'Product Development',
    title: 'From Requirements to Production SaaS in Three Weeks',
    summary:
      'Full-stack SaaS platform from requirements to production deployment, including auth, billing, and API layer.',
    metric: '3 Weeks',
    metricLabel: 'MVP to Production',
    date: '2025-01-22',
    duration: '3 weeks',
    stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Stripe', 'Supabase'],
    outcomes: [
      { value: '3 wks', label: 'Requirements to production' },
      { value: '100%', label: 'Core features shipped' },
      { value: '0', label: 'Rewrites needed post-launch' },
    ],
    problem:
      'A B2B startup had validated their idea with design-partner interviews and needed a production MVP fast to capture momentum, but they had no engineering team. They needed authentication, team/organization management, a billing system, and a core product workflow — all production-grade, not a throwaway prototype — on a three-week runway.',
    architecture:
      'We chose a stack optimized for velocity without painting them into a corner: Next.js for the frontend, FastAPI for the API, PostgreSQL via Supabase for the database and auth, and Stripe for billing. Multi-tenancy was modelled in the database from day one with row-level security, so tenant isolation could never be bypassed by an application bug.',
    solution:
      'We sequenced ruthlessly: authentication and tenancy first (the foundation everything depends on), then the core product workflow, then billing. Every schema change went through version-controlled migrations. The API was designed additive-by-default and versioned from v1 so the team could evolve it without breaking the early integrations their design partners were building.',
    challenges:
      'The constraint was time, so the discipline was saying no to everything non-essential while refusing to cut corners on the foundation. We resisted premature complexity — no microservices, no sharding, a single well-designed PostgreSQL instance — which kept the team shippable. The billing edge cases (proration, failed payments, plan changes) consumed more time than expected and were handled with Stripe webhooks processed through an idempotent endpoint.',
    results:
      'The startup went from requirements to a production deployment in three weeks, with authentication, multi-tenant team management, Stripe billing, and their core workflow all live. A year on, the platform has scaled with their growth as an evolution of the original architecture rather than the rewrite that so often follows a rushed MVP.',
    lessons:
      'Getting the foundation right under time pressure — tenancy, constraints, migrations, versioned APIs — is what prevented the classic "successful MVP, painful rewrite" trajectory. Speed came from clean sequencing and disciplined scope, not from cutting the decisions that are expensive to reverse.',
  },
]

const BY_SLUG = new Map(CASE_STUDIES.map((c) => [c.slug, c]))

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return BY_SLUG.get(slug)
}

export function getCaseStudies(): CaseStudy[] {
  return CASE_STUDIES
}

export function getCaseStudySlugs(): string[] {
  return CASE_STUDIES.map((c) => c.slug)
}

export function formatCaseStudyDate(slug: string): string {
  const c = BY_SLUG.get(slug)
  return c ? formatDate(c.date) : ''
}
