import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageSEO } from '@/lib/api'
import { buildMetadata } from '@/components/seo/MetaTags'
import SectionHeader from '@/components/ui/SectionHeader'
import FadeIn from '@/components/ui/FadeIn'
import TechBadge from '@/components/ui/TechBadge'
import GlassCard from '@/components/ui/GlassCard'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import FAQSchema from '@/components/seo/schemas/FAQSchema'
import ServiceSchema from '@/components/seo/schemas/ServiceSchema'

const SERVICES = {
  'web-scraping': {
    title: 'Web Scraping & Data Extraction',
    definition: 'Web scraping is the automated process of extracting structured data from websites for analysis, monitoring, or integration.',
    focusKeyword: 'web scraping service for startups',
    description: 'Scale your data acquisition with production-ready web scraping. We handle the complexity of modern anti-bot systems so you can focus on building your product.',
    tools: ['Playwright', 'Selenium', 'Python', 'Botasaurus'],
    faqs: [
      { question: 'How do you handle anti-bot systems like Cloudflare?', answer: 'We use advanced fingerprinting and proxy rotation techniques with Playwright and Botasaurus to remain undetected.' },
      { question: 'Can you scrape apps that require login?', answer: 'Yes, we automate authentication flows securely to extract data from behind login walls.' },
      { question: 'How often can the scrapers run?', answer: 'We can schedule scrapers to run daily, hourly, or in real-time depending on your requirements.' },
      { question: 'Is web scraping legal?', answer: 'We strictly follow robots.txt and public data extraction best practices to ensure your operations are compliant.' },
      { question: 'What format do you deliver the data in?', answer: 'We can deliver data in JSON, CSV, or push it directly to your API or database.' },
    ]
  },
  'automation': {
    title: 'Browser Automation',
    definition: 'Browser automation is the programmatic control of a web browser to simulate human interaction with websites and web applications.',
    focusKeyword: 'browser automation agency Playwright',
    description: 'Automate repetitive workflows, from form submissions to complex multi-step data entry. We build resilient automation that doesn’t break.',
    tools: ['Playwright', 'Selenium', 'TypeScript', 'Node.js'],
    faqs: [
      { question: 'What kind of workflows can you automate?', answer: 'Almost any human action in a browser: filling forms, clicking buttons, downloading reports, and navigating complex UIs.' },
      { question: 'How do you handle site updates?', answer: 'We use robust selectors and automated testing to ensure the automation remains stable even when the target site changes UI.' },
      { question: 'Can automation run in the cloud?', answer: 'Yes, we deploy headless browser clusters on VPS systems to run 24/7.' },
      { question: 'Is Playwright better than Selenium?', answer: 'For modern apps, Playwright is generally faster and more reliable, which is why it is our primary tool.' },
      { question: 'Can you automate social media tasks?', answer: 'Yes, we can automate interactions on platforms like LinkedIn or Twitter for lead generation or research.' },
    ]
  },
  'backend': {
    title: 'Backend Development',
    definition: 'Backend development involves building the server-side logic, database management, and API architectures that power web applications.',
    focusKeyword: 'FastAPI Django development service',
    description: 'Build robust, scalable APIs with Python. Whether it’s a complex Django monolith or a lightning-fast FastAPI microservice, we’ve got you covered.',
    tools: ['Python', 'Django', 'FastAPI', 'PostgreSQL'],
    faqs: [
      { question: 'Should I choose Django or FastAPI?', answer: 'Django is great for feature-rich admin-heavy applications, while FastAPI is best for high-performance data-intensive APIs.' },
      { question: 'Do you handle database migrations?', answer: 'Yes, we manage the entire database lifecycle including schema design and migrations.' },
      { question: 'How do you secure your APIs?', answer: 'We implement JWT authentication, CORS policies, and rate limiting to protect your data.' },
      { question: 'Can you integrate with my existing database?', answer: 'Absolutely. We have experience with PostgreSQL, MySQL, and NoSQL databases.' },
      { question: 'Do you provide API documentation?', answer: 'Every API we build comes with auto-generated Swagger/OpenAPI documentation.' },
    ]
  },
  'frontend': {
    title: 'Frontend Development',
    definition: 'Frontend development is the creation of the user interface and user experience of a website using HTML, CSS, and JavaScript.',
    focusKeyword: 'frontend development agency Next.js',
    description: 'Your UI should be as fast as your backend. We build premium, SEO-optimised frontends using Next.js 14 and modern design principles.',
    tools: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion'],
    faqs: [
      { question: 'Why use Next.js instead of plain React?', answer: 'Next.js provides Server-Side Rendering (SSR) and Static Site Generation (SSG), which are critical for SEO and performance.' },
      { question: 'Is my site mobile-friendly?', answer: 'Yes, we use a mobile-first responsive design approach for every project.' },
      { question: 'How do you handle animations?', answer: 'We use Framer Motion for subtle, performant animations that enhance the UX without slowing down the page.' },
      { question: 'Can you migrate my site from WordPress?', answer: 'Yes, we can rebuild your WordPress site in Next.js for better speed and security.' },
      { question: 'Do you use Tailwind CSS?', answer: 'Yes, Tailwind allows us to build custom, high-performance layouts quickly.' },
    ]
  },
  'api': {
    title: 'API Development & Integration',
    definition: 'API integration is the process of connecting multiple applications or systems via their APIs to share data and functionality.',
    focusKeyword: 'API integration development service',
    description: 'Connect your entire stack. We integrate everything from Stripe to custom CRMs, ensuring your data is always exactly where it needs to be.',
    tools: ['REST', 'GraphQL', 'OAuth', 'Webhooks'],
    faqs: [
      { question: 'Can you integrate Stripe for payments?', answer: 'Yes, we have deep experience with Stripe API, including subscriptions and webhooks.' },
      { question: 'Do you work with GraphQL?', answer: 'Yes, we can build and consume both REST and GraphQL APIs.' },
      { question: 'What is OAuth integration?', answer: 'It allows users to log in via Google, GitHub, or other providers securely.' },
      { question: 'Can you sync data between two different SaaS tools?', answer: 'Yes, we build custom synchronisation pipelines to keep your data consistent across platforms.' },
      { question: 'How do you handle API rate limits?', answer: 'We implement queuing and retry logic to handle rate-limited APIs gracefully.' },
    ]
  },
  'ai': {
    title: 'AI Integration & Pipelines',
    definition: 'AI integration involves embedding artificial intelligence capabilities like Large Language Models into existing software workflows.',
    focusKeyword: 'AI integration service for SaaS',
    description: 'Stop talking about AI and start using it. We build custom RAG pipelines and LLM integrations that solve real business problems.',
    tools: ['OpenAI', 'LangChain', 'LlamaIndex', 'GPT-4'],
    faqs: [
      { question: 'How can AI help my SaaS business?', answer: 'AI can automate customer support, generate content, or provide intelligent search over your own data.' },
      { question: 'What is a RAG pipeline?', answer: 'Retrieval-Augmented Generation (RAG) lets an AI answer questions based on your specific company documents.' },
      { question: 'Is my data safe when using OpenAI?', answer: 'We implement privacy-first AI solutions, ensuring sensitive data is filtered or anonymised.' },
      { question: 'Can you use open-source models like Llama?', answer: 'Yes, we can deploy open-source models if you require self-hosted AI solutions.' },
      { question: 'How much does AI integration cost?', answer: 'Costs vary based on token usage; we help you optimise prompts to keep expenses low.' },
    ]
  },
} as const

type ServiceSlug = keyof typeof SERVICES

export async function generateStaticParams() {
  return Object.keys(SERVICES).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = SERVICES[params.slug as ServiceSlug]
  if (!service) return {}

  const seo = await getPageSEO(`service-${params.slug}`)
  return buildMetadata(seo, {
    title: `${service.title} | ${service.focusKeyword} | Phantex Tech`,
    description: service.description,
    path: `/services/${params.slug}`,
  })
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = SERVICES[params.slug as ServiceSlug]
  if (!service) notFound()

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: service.title, href: `/services/${params.slug}` },
  ]

  return (
    <main className="pt-32 pb-24">
      <BreadcrumbSchema items={breadcrumbItems} />
      <ServiceSchema />
      <FAQSchema items={service.faqs} />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <FadeIn className="mb-16">
          <SectionHeader
            label="Service Detail"
            title={service.title}
          />
          <p className="mt-8 text-xl font-body text-[var(--text-primary)] font-medium max-w-3xl leading-relaxed">
            {service.definition}
          </p>
          <p className="mt-6 text-lg font-body text-[var(--text-muted)] max-w-3xl">
            {service.description}
          </p>
        </FadeIn>

        {/* Tech Stack */}
        <FadeIn className="mb-20" delay={0.2}>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-amber-500 mb-6">
            Tech Stack we use
          </h3>
          <div className="flex flex-wrap gap-3">
            {service.tools.map((tool) => (
              <TechBadge key={tool} name={tool} />
            ))}
          </div>
        </FadeIn>

        {/* FAQ Section */}
        <FadeIn className="mt-32 pt-16 border-t border-stone-200" delay={0.3}>
          <SectionHeader
            label="Common Questions"
            title="Everything You Need to Know"
            align="center"
          />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.faqs.map((faq, i) => (
              <GlassCard key={i} className="p-8 group hover:border-amber-500/30 transition-all duration-300">
                <h4 className="font-display text-lg font-bold text-[var(--text-primary)] mb-3 flex items-start gap-3">
                  <span className="text-amber-500 text-xl leading-none">Q.</span>
                  {faq.question}
                </h4>
                <p className="font-body text-sm text-[var(--text-muted)] leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </GlassCard>
            ))}
          </div>
        </FadeIn>
      </div>
    </main>
  )
}
