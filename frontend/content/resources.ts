import type { Resource } from './types'
import { formatDate } from './utils'

// ─────────────────────────────────────────────────────────────────────────────
// Downloadable resources. Each has a landing page at /resources/<slug> and a
// real, generated PDF at /resources/<slug>/download. The `document` field is the
// single source of truth used for both the on-page preview and the PDF.
// ─────────────────────────────────────────────────────────────────────────────

export const RESOURCES: Resource[] = [
  {
    slug: 'web-scraping-playbook',
    title: 'Web Scraping Playbook',
    subtitle: 'Ethical, scalable data extraction with Playwright, Selenium, and API-first approaches.',
    description:
      'A practical guide to building data-extraction systems that survive scale and hostile web environments — without crossing legal or ethical lines.',
    format: 'PDF Guide',
    pages: 4,
    version: '1.2',
    updated: '2025-06-01',
    tags: ['web-scraping', 'playwright', 'selenium', 'python'],
    author: 'leo-chen',
    document: {
      title: 'The Web Scraping Playbook',
      subtitle: 'Ethical, Scalable Data Extraction — by the Phantex Engineering Team',
      sections: [
        {
          heading: '1. Before You Scrape: Legality and Ethics',
          paragraphs: [
            'Web scraping sits in a legal and ethical grey area that depends heavily on jurisdiction, the data involved, and how you behave. Before writing a single line of code, confirm that you are authorized to access the data and that doing so does not violate the target\'s terms of service, applicable law, or the privacy of individuals.',
            'The single most important rule is to prefer official APIs. If a site offers an API, use it — it is faster, more stable, more clearly authorized, and far less likely to break. Scraping a rendered UI should be a last resort reserved for data that is genuinely not available any other way.',
          ],
          bullets: [
            'Read and respect the target\'s terms of service and robots directives.',
            'Never collect personal data you have no lawful basis to process.',
            'Identify yourself honestly where appropriate; do not impersonate a real user maliciously.',
            'Prefer official APIs over scraping rendered pages whenever they exist.',
          ],
        },
        {
          heading: '2. Choosing Your Tool',
          paragraphs: [
            'Not every scraping job needs a browser. For static HTML and JSON endpoints, a plain HTTP client is dramatically cheaper and faster — a request is stateless and finishes in milliseconds. Reach for a browser only when the data is rendered by JavaScript or hidden behind interactive flows.',
            'When you do need a browser, Playwright is our default. Its auto-waiting eliminates the largest source of flakiness, its locators survive redesigns, and its network interception often lets you grab clean JSON directly instead of parsing messy rendered HTML. Selenium remains a solid choice where an existing ecosystem demands it.',
          ],
          bullets: [
            'HTTP client + parser: static pages and JSON APIs — fastest and cheapest.',
            'Playwright: JavaScript-rendered pages, interactive flows, and network interception.',
            'Selenium: legacy ecosystems and broad language support.',
          ],
        },
        {
          heading: '3. Writing Resilient Extractors',
          paragraphs: [
            'The biggest determinant of whether your scraper survives a site update is how you locate data. Brittle selectors — deep CSS paths and auto-generated class names — break the instant a designer touches the page. Anchor selection to stable, human-meaningful attributes: roles, labels, visible text, and semantic structure.',
            'Always wait for conditions, never for fixed time. A hard-coded sleep is both too slow when the page is ready early and too fast when it is slow. Explicit waits for the element or network state you actually need are faster and more reliable.',
          ],
          bullets: [
            'Prefer role-, label-, and text-based locators over fragile CSS/XPath.',
            'Use explicit waits for elements and network idle, never fixed sleeps.',
            'Intercept network responses to capture structured data directly.',
            'Validate every extracted record against an explicit schema.',
          ],
        },
        {
          heading: '4. Scaling Across Machines',
          paragraphs: [
            'A single script scales to a wall surprisingly quickly because browsers are heavy, stateful, and crash dirtily. The path to scale is to treat browsers as expensive, disposable resources: pool and reuse them, recycle each after a fixed number of jobs to bound memory leaks, and run them headless with unnecessary resources blocked.',
            'To add capacity beyond one machine, distribute with a work queue rather than a bigger loop. Stateless, idempotent workers pull tasks from a shared queue, protected by a visibility timeout so a crashed worker\'s task simply reappears for another. Scaling out becomes a matter of running more identical workers.',
          ],
          bullets: [
            'Pool browsers and recycle them after N jobs to cap memory growth.',
            'Distribute work via a queue of stateless, idempotent workers.',
            'Rely on visibility timeouts so no task is lost when a worker dies.',
            'Rate-limit per domain and rotate identity responsibly.',
          ],
        },
        {
          heading: '5. Staying Unblocked Without Being Abusive',
          paragraphs: [
            'Scaling up means hitting a target harder, and targets defend themselves. Responsible scraping spreads load over time, honours rate-limit signals, and backs off on 429s and CAPTCHAs rather than retrying into a hard block. The goal is to be a polite, low-impact visitor, not an indistinguishable flood.',
            'Identity rotation — IPs and realistic fingerprints — has legitimate uses for distributing load, but it must never be a tool for evading a clear prohibition. If a site has told you not to scrape it, the answer is to stop, not to disguise yourself.',
          ],
          bullets: [
            'Back off exponentially on rate-limit and challenge responses.',
            'Spread requests over time; never burst against a single host.',
            'Treat identity rotation as load distribution, not prohibition evasion.',
          ],
        },
        {
          heading: '6. Observability and Maintenance',
          paragraphs: [
            'A scraper you cannot see is a scraper you cannot trust. Track success, retry, and dead-letter rates per domain; a rising dead-letter rate usually means a site changed its markup or began blocking. Capture a screenshot and the page HTML on every failure so a 3am break can be diagnosed at 9am without reproducing it.',
            'Scrapers are uniquely maintenance-heavy because they depend on systems you do not control. Build a dry-run health check that verifies your extractors still find what they expect, and run it on a schedule so target changes become proactive tickets instead of silent data loss.',
          ],
          bullets: [
            'Monitor success / retry / dead-letter rates per domain.',
            'Capture screenshots and HTML on failure for fast diagnosis.',
            'Run a scheduled dry-run health check to catch target changes early.',
          ],
        },
        {
          heading: '7. Parsing and Data Quality',
          paragraphs: [
            'Extraction is only half the job; the data you pull is worthless if it is wrong. Treat every scraped record as untrusted input and validate it against an explicit schema before it enters your system. A field that should be a price but arrives as "Call for quote" must be caught at the boundary, not three systems downstream.',
            'Quarantine records that fail validation rather than dropping them. A scraper that silently discards malformed rows lies to you about completeness; one that quarantines them turns a vendor markup change into a visible spike you can investigate.',
          ],
          bullets: [
            'Validate every record against a typed schema at the extraction boundary.',
            'Quarantine malformed rows instead of dropping them silently.',
            'Normalize early — currencies, dates, and units — so downstream code is simple.',
            'Deduplicate on a stable content fingerprint to make re-runs idempotent.',
          ],
        },
        {
          heading: '8. Storage and Incremental Scraping',
          paragraphs: [
            'Re-scraping everything on every run wastes bandwidth, hammers the target, and gets you blocked faster. Incremental scraping fetches only what changed since the last run, using timestamps, change feeds, or content hashes to detect deltas.',
            'Write raw responses to immutable storage before parsing. When your parser has a bug — and it will — you can replay from the raw landing zone instead of re-fetching from a target that may rate-limit you or no longer have the data.',
          ],
          bullets: [
            'Store raw responses immutably before parsing, so you can always replay.',
            'Scrape incrementally using timestamps, change feeds, or content hashes.',
            'Keep the warehouse as a derived view you can rebuild from raw data.',
          ],
        },
        {
          heading: '9. A Pre-Flight Checklist',
          paragraphs: [
            'Before you point a scraper at a new target, run through the essentials. A few minutes here prevents the most common failures: legal exposure, instant blocks, and silent data corruption.',
          ],
          bullets: [
            'Confirmed authorization, terms of service, and robots directives.',
            'Checked for an official API before resorting to scraping.',
            'Per-domain rate limiting and exponential backoff in place.',
            'Resilient locators and schema validation written.',
            'Raw-response storage and a dead-letter path configured.',
            'Failure screenshots, tracing, and a dry-run health check enabled.',
          ],
        },
      ],
    },
  },
  {
    slug: 'ai-agent-architecture-guide',
    title: 'AI Agent Architecture Guide',
    subtitle: 'Design production AI agents with memory, tool-use, and multi-step reasoning.',
    description:
      'How to build AI agents that behave predictably for real users — grounding, guarded tools, evaluation, and knowing when to escalate.',
    format: 'PDF Guide',
    pages: 4,
    version: '1.1',
    updated: '2025-06-10',
    tags: ['ai-agents', 'llms', 'rag'],
    author: 'priya-nair',
    document: {
      title: 'AI Agent Architecture Guide',
      subtitle: 'Building Production Agents That Earn Trust — by the Phantex Engineering Team',
      sections: [
        {
          heading: '1. What an Agent Really Is',
          paragraphs: [
            'Strip away the marketing and an agent is a loop: given a goal and a set of tools, the model decides the next step, observes the result, and repeats until the goal is met or it gives up. The intelligence is the model choosing the next action; your engineering job is to make every possible action safe.',
            'The defining mistake teams make is giving the model free rein. A production agent is constrained: a small set of well-defined tools, a hard budget of reasoning steps, and explicit rules about what it may never do on its own.',
          ],
          bullets: [
            'An agent is a constrained decide → act → observe loop.',
            'Bound it with a hard step budget to cap cost and prevent runaway loops.',
            'Constrain it to a small, well-defined set of tools.',
          ],
        },
        {
          heading: '2. Grounding: Never Let It Make Things Up',
          paragraphs: [
            'An agent that answers from the model\'s training data will be confidently wrong about your specific domain. Every answer must be grounded in your actual knowledge through retrieval. Split knowledge into static (docs, policies — embedded and retrieved) and live (account data — fetched per request through tools, never embedded).',
            'Enforce a relevance floor on retrieval. When the best matches are weak, the correct response is "I don\'t have that information, let me connect you with someone who does" — not a paragraph synthesized from loosely related text.',
          ],
          bullets: [
            'Ground every answer in retrieval and live tool results.',
            'Embed static knowledge; fetch live data per request, scoped to the user.',
            'Apply a relevance floor — retrieving nothing beats hallucinating.',
          ],
        },
        {
          heading: '3. Tools: Where the Agent Acts',
          paragraphs: [
            'Tools are how an agent does real work rather than just talking. Each tool is a typed function whose guardrails live in code, not in the prompt. A prompt rule like "never refund more than $100" is a suggestion the model can be talked out of; a check in the tool is a wall.',
            'Treat the model as an untrusted caller of your tools. Validate every argument, enforce every limit, and scope every action to the authenticated user\'s own data. Prefer many small, narrowly-scoped tools over one that does everything.',
          ],
          bullets: [
            'Enforce all permissions and limits in code, never in the prompt.',
            'Validate every tool argument; scope actions to the authenticated user.',
            'Favour many small tools over one do-everything tool.',
          ],
        },
        {
          heading: '4. Memory: Short-Term and Long-Term',
          paragraphs: [
            'Short-term (working) memory is the current task context, bounded by the model\'s window — the challenge is deciding what to keep. Summarize older turns under pressure and keep recent turns verbatim. Do not treat the context window as free storage; relevance beats volume.',
            'Long-term memory is durable knowledge that persists across sessions — preferences, past interactions, learned facts. Store it externally and retrieve what is relevant rather than carrying everything in context.',
          ],
          bullets: [
            'Curate short-term context: summarize old turns, keep recent ones sharp.',
            'Store long-term memory externally and retrieve it on relevance.',
            'Avoid stuffing the context window — it degrades quality and inflates cost.',
          ],
        },
        {
          heading: '5. Knowing When to Escalate',
          paragraphs: [
            'The feature that makes users trust an agent is how gracefully it admits what it cannot do. Escalation is a designed outcome, not a failure: trigger it on empty retrieval, user frustration, actions above an approval limit, or too many unproductive loops.',
            'A good handoff packages everything the agent learned — the conversation, what it tried, the relevant data — so a human starts with full context instead of asking the user to repeat themselves.',
          ],
          bullets: [
            'Escalate on weak retrieval, frustration, high-stakes actions, or loop limits.',
            'Package full context into every handoff.',
            'Treat escalation as a first-class outcome, not a failure mode.',
          ],
        },
        {
          heading: '6. Evaluation: Toys vs. Products',
          paragraphs: [
            'The line between a prototype and a product is continuous measurement. Generative systems are non-deterministic; without evaluation you cannot tell whether a change improved things or broke them. Maintain a suite of cases with known-good outcomes that runs on every change.',
            'Every production incident becomes a new eval case. Over time the suite becomes a regression net that catches the change that fixes one behaviour while breaking another — before a user does.',
          ],
          bullets: [
            'Run an offline eval suite on every change as a regression net.',
            'Turn every production failure into a new eval case.',
            'Track refusal, escalation, and tool-error rates to catch drift.',
          ],
        },
        {
          heading: '7. Latency and Cost as Architecture',
          paragraphs: [
            'In an agent, latency and cost are not afterthoughts — they shape the design. Every reasoning step is tokens, and tokens are money and time. Route easy, high-confidence requests to a small model or a deterministic handler, and reserve the full agent loop for genuinely open-ended tasks.',
            'Stream output to the user as it is generated; perceived latency matters as much as actual latency. Cache embeddings and retrieval results for repeated queries, and run independent tool calls and retrievals concurrently rather than in sequence.',
          ],
          bullets: [
            'Route by difficulty: cheap handlers for simple intents, the loop for hard ones.',
            'Stream responses to cut perceived latency.',
            'Cache embeddings and retrieval; parallelize independent work.',
            'Use the step budget as a cost ceiling, not just a safety limit.',
          ],
        },
        {
          heading: '8. Safety, Privacy, and Auditability',
          paragraphs: [
            'A production agent acts on real user data, so every action must be scoped to the authenticated user and logged. Treat the model as an untrusted caller: anything a malicious user could trick it into requesting, your tool layer must reject.',
            'Log every interaction — inputs, retrieved context, tool calls, outputs — so any production behaviour can be replayed and audited. When a customer disputes an action the agent took, you can show exactly what happened and why.',
          ],
          bullets: [
            'Scope every tool and retrieval to the authenticated user.',
            'Add content-safety checks on both inputs and outputs.',
            'Log enough to replay and audit any interaction.',
            'Require human approval for high-stakes actions.',
          ],
        },
        {
          heading: '9. When NOT to Build an Agent',
          paragraphs: [
            'Not everything should be an agent. The most cost-effective systems are hybrids: a router sends trivial, well-defined requests to cheap deterministic code and only escalates genuinely ambiguous ones to the LLM. Reaching for the full loop on every request is slower and more expensive than it needs to be.',
            'Multi-agent architectures are powerful for complex, decomposable tasks but are more expensive, slower, and harder to debug. Exhaust a single well-designed agent before reaching for several.',
          ],
          bullets: [
            'Use deterministic code for simple, well-defined intents.',
            'Reserve the agent loop for genuine ambiguity.',
            'Exhaust a single agent before going multi-agent.',
          ],
        },
      ],
    },
  },
  {
    slug: 'backend-scalability-checklist',
    title: 'Backend Scalability Checklist',
    subtitle: 'A field checklist covering APIs, databases, caching, and deployment.',
    description:
      'The concrete checks we run before a backend faces real traffic — across APIs, data, caching, reliability, and operations.',
    format: 'PDF Checklist',
    pages: 3,
    version: '2.0',
    updated: '2025-05-15',
    tags: ['apis', 'postgresql', 'infrastructure', 'scaling'],
    author: 'zara-malik',
    document: {
      title: 'Backend Scalability Checklist',
      subtitle: 'Pre-Production Checks for Real Traffic — by the Phantex Engineering Team',
      sections: [
        {
          heading: '1. API Layer',
          paragraphs: [
            'An API ready for real traffic handles the unglamorous concerns that surround its features. Work through each item below before you expose an endpoint to clients you do not control.',
          ],
          bullets: [
            'Every request is authenticated and every resource checks object-level ownership.',
            'One consistent error shape and correct HTTP status codes throughout.',
            'All list endpoints are paginated (prefer cursors) with a hard size cap.',
            'Per-client rate limiting returns 429 with Retry-After.',
            'Creates and payments are idempotent via idempotency keys.',
            'The API is versioned from v1 and designed additive-by-default.',
            'Docs are generated from code so they cannot drift.',
          ],
        },
        {
          heading: '2. Database',
          paragraphs: [
            'The database is the hardest layer to change later, so its readiness matters most. Verify the schema is constrained, indexed for real queries, and operationally sound.',
          ],
          bullets: [
            'Foreign keys are indexed (Postgres does not do this automatically).',
            'Indexes match real query patterns, verified with EXPLAIN ANALYZE.',
            'Constraints (NOT NULL, CHECK, UNIQUE, FK) make invalid states impossible.',
            'Schema changes go through reversible, version-controlled migrations.',
            'Large migrations use online/concurrent operations to avoid locking.',
            'A connection pooler sits in front of the database.',
            'Automated backups and point-in-time recovery are enabled.',
          ],
        },
        {
          heading: '3. Caching and Performance',
          paragraphs: [
            'Caching is leverage, but a cache you cannot reason about is a source of subtle bugs. Confirm your caching is deliberate and your hot paths are measured.',
          ],
          bullets: [
            'Expensive, repeatable reads are cached with sensible TTLs.',
            'Cache invalidation strategy is explicit and tested.',
            'Slow queries are surfaced (pg_stat_statements) and the worst optimized.',
            'N+1 query patterns are eliminated on hot paths.',
            'Heavy or non-critical work runs in a durable job queue, not inline.',
          ],
        },
        {
          heading: '4. Reliability and Failure Handling',
          paragraphs: [
            'At scale, something fails every day. The question is whether failures are contained. Confirm the system degrades gracefully and recovers on its own.',
          ],
          bullets: [
            'Transient failures retry with exponential backoff and jitter.',
            'Exhausted retries land in a dead-letter queue, never silently dropped.',
            'External calls have timeouts and circuit breakers.',
            'Critical operations are idempotent so retries are safe.',
            'The service degrades gracefully when a dependency is down.',
          ],
        },
        {
          heading: '5. Observability and Operations',
          paragraphs: [
            'A system you cannot see is a system you cannot operate. Ensure you will find out about problems in minutes, not from customers.',
          ],
          bullets: [
            'Structured logs carry a request id correlated across services.',
            'Metrics cover latency, error rate, and throughput per endpoint.',
            'Alerts fire on SLO violations, not just on hard crashes.',
            'Health checks actually exercise dependencies (e.g., ping the database).',
            'Deploys are zero-downtime with graceful shutdown (SIGTERM handling).',
            'Secrets live in a secret manager, never in code or committed env files.',
          ],
        },
        {
          heading: '6. Background Work and Queues',
          paragraphs: [
            'Anything slow, retryable, or non-critical should run outside the request/response path. Confirm heavy work is offloaded to a durable job queue and that the durability matches the importance of the work.',
          ],
          bullets: [
            'Important, retryable work runs in a durable job queue, not in-process.',
            'Jobs are idempotent so retries are always safe.',
            'Failed jobs retry with backoff, then dead-letter for inspection.',
            'Queue depth and job age are monitored and drive autoscaling.',
            'Scheduled jobs have absence alerting (a heartbeat watchdog).',
          ],
        },
        {
          heading: '7. Concurrency and Scaling Order',
          paragraphs: [
            'Scaling has an order that matters. Tune a single instance before adding more, and apply concurrency before parallelism. Adding machines to an inefficient service just multiplies the inefficiency and the bill.',
          ],
          bullets: [
            'Apply bounded concurrency before scaling horizontally.',
            'Batch boundary-crossing operations to amortize fixed overhead.',
            'Add read replicas before sharding when reads dominate.',
            'Make services stateless so they scale out trivially.',
            'Find concurrency limits by measurement, not by guessing.',
          ],
        },
        {
          heading: '8. Security Essentials',
          paragraphs: [
            'Security is not a phase; it is a property of every layer. Run this list before any backend faces untrusted traffic.',
          ],
          bullets: [
            'Every endpoint authenticates and checks object-level ownership.',
            'Input is validated and output is encoded against injection.',
            'HTTPS is enforced and security headers are set.',
            'Rate limiting protects public and authentication endpoints.',
            'Dependencies are scanned and patched on a schedule.',
          ],
        },
      ],
    },
  },
  {
    slug: 'saas-mvp-blueprint',
    title: 'SaaS MVP Blueprint',
    subtitle: 'Go from idea to deployed product in under 30 days.',
    description:
      'The architecture, stack decisions, and sequencing we use to ship production SaaS MVPs fast — without the rewrite that usually follows.',
    format: 'PDF Blueprint',
    pages: 4,
    version: '1.0',
    updated: '2025-04-20',
    tags: ['apis', 'postgresql', 'supabase', 'infrastructure'],
    author: 'amir-karimi',
    document: {
      title: 'The SaaS MVP Blueprint',
      subtitle: 'Idea to Production in Under 30 Days — by the Phantex Engineering Team',
      sections: [
        {
          heading: '1. The Goal: Fast Without a Rewrite',
          paragraphs: [
            'The classic MVP trap is a choice between two bad outcomes: build it properly and miss the window, or build it as a throwaway prototype and pay for it with a painful rewrite the moment it succeeds. The blueprint below threads the needle by moving fast on everything cheap to change and being disciplined about the few decisions that are expensive to reverse.',
            'Speed comes from clean sequencing and ruthless scope, not from cutting the foundational decisions. You can rewrite a frontend; you cannot easily re-tenant a database that was built single-tenant.',
          ],
          bullets: [
            'Move fast on UI, copy, and features — they are cheap to change.',
            'Be disciplined on tenancy, schema, and API contracts — they are not.',
            'Aim for an evolution path to scale, not a rewrite.',
          ],
        },
        {
          heading: '2. Choosing the Stack',
          paragraphs: [
            'Optimize the stack for velocity without painting yourself into a corner. Our default is Next.js for the frontend, a typed API (FastAPI), PostgreSQL for data, a managed auth/database layer such as Supabase to avoid rebuilding solved problems, and Stripe for billing.',
            'Resist premature complexity. A single well-designed PostgreSQL instance scales further than most startups ever reach; microservices, sharding, and exotic databases are velocity taxes you cannot afford at the MVP stage.',
          ],
          bullets: [
            'Frontend: Next.js. API: a typed framework like FastAPI.',
            'Data: PostgreSQL; lean on managed auth/storage to skip solved problems.',
            'Billing: Stripe, with webhooks processed idempotently.',
            'Avoid microservices and sharding until a real constraint forces them.',
          ],
        },
        {
          heading: '3. The Non-Negotiable Foundation',
          paragraphs: [
            'Three things must be right from day one because retrofitting them is enormously expensive. Multi-tenancy must be modelled in the database with isolation enforced there (row-level security), not in application code that a single bug can bypass. The schema must be constrained and migrated through version control. And the API must be versioned and additive-by-default.',
            'Get these right and growth is an evolution. Get them wrong and the successful MVP becomes a migration everyone resents.',
          ],
          bullets: [
            'Model multi-tenancy in the database with enforced isolation (RLS).',
            'Use constraints and version-controlled migrations from the first commit.',
            'Version the API from v1 and design responses to be extensible.',
          ],
        },
        {
          heading: '4. Sequencing the 30 Days',
          paragraphs: [
            'Sequence ruthlessly, building each layer on a finished one. Authentication and tenancy come first because everything depends on them. The core product workflow comes next — the one thing the product must do. Billing comes last, because you can onboard design partners before money changes hands.',
            'Each phase ships to a real environment behind a flag. Nothing waits for a big-bang launch; the product is continuously deployable from week one.',
          ],
          bullets: [
            'Week 1: auth, organizations/tenancy, and the data model.',
            'Week 2–3: the core product workflow, end to end.',
            'Week 4: billing, polish, and production hardening.',
            'Deploy continuously behind flags; avoid a big-bang launch.',
          ],
        },
        {
          heading: '5. Production Hardening Before Launch',
          paragraphs: [
            'Before real users arrive, run the essentials: backups and point-in-time recovery, basic observability (structured logs with request ids, error tracking), rate limiting on public endpoints, and idempotent handling of anything that touches money.',
            'You do not need a platform team\'s worth of infrastructure for an MVP, but you do need to know within minutes when something breaks and to never lose customer data.',
          ],
          bullets: [
            'Enable automated backups and point-in-time recovery.',
            'Add error tracking and structured logging with request ids.',
            'Rate-limit public endpoints and process payment webhooks idempotently.',
            'Set up alerting so failures surface in minutes, not from customers.',
          ],
        },
        {
          heading: '6. After Launch: Evolving the MVP',
          paragraphs: [
            'A successful MVP earns the right to grow. Because the foundation was built properly, scaling is a series of targeted extensions — add a read replica when reads dominate, introduce a job queue as background work grows, partition large append-only tables when volume demands. None of these require touching the core.',
            'Let real usage, not speculation, drive every scaling decision. Measure the actual bottleneck and address that one, in the order the system reveals.',
          ],
          bullets: [
            'Scale with targeted extensions, not rewrites.',
            'Add read replicas and job queues as real load demands.',
            'Let measurement, not speculation, drive each next step.',
          ],
        },
        {
          heading: '7. Designing the Data Model',
          paragraphs: [
            'The database is the hardest layer to change later, so invest the most care here. Start normalized, use stable surrogate keys, and enforce constraints so invalid states are impossible. Index your foreign keys and your real query patterns from the start.',
            'Add timestamps to every table and keep large append-only tables partition-ready, even if you do not partition yet. These cheap escape hatches mean you can scale later by extension rather than restructuring.',
          ],
          bullets: [
            'Normalize first; denormalize only with measured evidence.',
            'Use surrogate keys, typed columns, and enforced constraints.',
            'Index foreign keys and real query patterns; verify with EXPLAIN ANALYZE.',
            'Add created_at/updated_at everywhere; keep event tables partition-ready.',
          ],
        },
        {
          heading: '8. The API Contract',
          paragraphs: [
            'Your API is a contract paid for by everyone who builds against it. Be relentlessly consistent, state contracts explicitly, and design additive-by-default so new fields and parameters never break existing consumers.',
            'Decouple API models from database models with an explicit mapping layer. That seam lets your internals evolve freely behind a stable external contract — the difference between v2 being an evolution and v2 being a rewrite.',
          ],
          bullets: [
            'Keep naming, envelopes, and behaviour consistent across all endpoints.',
            'Design additive-by-default; version only for unavoidable breaks.',
            'Map between API and database models so internals can change freely.',
            'Generate docs from the schema so they never drift.',
          ],
        },
        {
          heading: '9. Launch Readiness Checklist',
          paragraphs: [
            'Before real users arrive, confirm the essentials are in place. You do not need a platform team for an MVP, but you must never lose data and must know within minutes when something breaks.',
          ],
          bullets: [
            'Automated backups and point-in-time recovery enabled.',
            'Error tracking and structured logging with request ids.',
            'Rate limiting on public endpoints; idempotent payment webhooks.',
            'Multi-tenant isolation enforced in the database and tested.',
            'Alerting that surfaces failures in minutes, not from customers.',
          ],
        },
      ],
    },
  },
]

const BY_SLUG = new Map(RESOURCES.map((r) => [r.slug, r]))

export function getResource(slug: string): Resource | undefined {
  return BY_SLUG.get(slug)
}

export function getResources(): Resource[] {
  return RESOURCES
}

export function getResourceSlugs(): string[] {
  return RESOURCES.map((r) => r.slug)
}

export function formatResourceDate(slug: string): string {
  const r = BY_SLUG.get(slug)
  return r ? formatDate(r.updated) : ''
}
