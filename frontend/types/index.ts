// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface Author {
  id: number
  name: string
  slug: string
  bio: string
  avatar: string | null
  role: string
  linkedin: string
  github: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Tag {
  id: number
  name: string
  slug: string
  is_active: boolean
}

export type PostStatus = 'draft' | 'published'

export interface PostListItem {
  id: number
  title: string
  slug: string
  excerpt: string
  author: Author
  category: Category
  tags: Tag[]
  status: PostStatus
  published_at: string | null
  featured_image: string | null
  read_time: number
  view_count: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Post extends PostListItem {
  content: string
}

// ─── Portfolio ───────────────────────────────────────────────────────────────

export type ServiceType =
  | 'scraping'
  | 'automation'
  | 'backend'
  | 'frontend'
  | 'api'
  | 'ai'

export type ProjectStatus = 'draft' | 'published'

export interface Project {
  id: number
  title: string
  slug: string
  description: string
  client: string
  service_type: ServiceType
  tech_stack: string[]
  challenge: string
  solution: string
  results: string
  thumbnail: string | null
  order: number
  is_featured: boolean
  status: ProjectStatus
  view_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── Team ────────────────────────────────────────────────────────────────────

export interface Member {
  id: number
  name: string
  slug: string
  role: string
  bio: string
  avatar: string | null
  skills: string[]
  github: string
  linkedin: string
  email?: string
  phone_number?: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── Testimonials ────────────────────────────────────────────────────────────

export interface Testimonial {
  id: number
  name: string
  username: string
  body: string
  avatar: string | null
  order: number
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export type BudgetChoice = 'under_5k' | '5k_15k' | '15k_50k' | 'over_50k'

export interface ContactFormData {
  name: string
  email: string
  service: ServiceType
  budget: BudgetChoice
  message: string
}

export interface ContactResponse {
  message: string
}

// ─── SEO ─────────────────────────────────────────────────────────────────────

export interface PageSEO {
  page_identifier: string
  meta_title: string
  meta_description: string
  og_title: string
  og_description: string
  og_image: string | null
  canonical_url: string
  schema_json: Record<string, unknown> | null
  focus_keyword: string
  secondary_keywords: string[]
  no_index: boolean
  is_active: boolean
  last_updated: string
  created_at: string
}

// ─── Sitemap ─────────────────────────────────────────────────────────────────

export interface SitemapUrl {
  url: string
  lastmod: string | null
  changefreq: string
  priority: number
  type: string
}

// ─── Services / How We Work ──────────────────────────────────────────────────

export interface HowWeWorkSettings {
  id: number
  section_label: string
  title_line_1: string
  title_line_2_highlight: string
  description: string
}

export interface WorkProcessStep {
  id: number
  order: number
  phase_number: string
  phase_label: string
  title: string
  description: string
  bullets?: string[]
  deliverable?: string
  duration?: string
  tags: string[]
  theme_color: string
}
