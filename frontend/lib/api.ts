import type {
  PaginatedResponse,
  Post,
  PostListItem,
  Project,
  Member,
  Testimonial,
  PageSEO,
  SitemapUrl,
  HowWeWorkSettings,
  WorkProcessStep,
} from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ─── Helper ──────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${url}`);
  }
  return res.json() as Promise<T>;
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<PaginatedResponse<PostListItem>> {
  return apiFetch<PaginatedResponse<PostListItem>>("/blog/posts/");
}

export async function getPost(slug: string): Promise<Post> {
  return apiFetch<Post>(`/blog/posts/${slug}/`);
}

export async function incrementViewCount(slug: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/blog/posts/${slug}/increment_view/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // fire-and-forget
  }
}

// ─── Portfolio ───────────────────────────────────────────────────────────────

export async function getProjects(): Promise<PaginatedResponse<Project>> {
  return apiFetch<PaginatedResponse<Project>>("/portfolio/projects/");
}

export async function getProject(slug: string): Promise<Project> {
  return apiFetch<Project>(`/portfolio/projects/${slug}/`);
}

// ─── Team ────────────────────────────────────────────────────────────────────

export async function getMembers(): Promise<Member[]> {
  const data = await apiFetch<PaginatedResponse<Member> | Member[]>(
    "/team/members/"
  );
  return Array.isArray(data) ? data : data.results;
}

// ─── Testimonials ────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await apiFetch<PaginatedResponse<Testimonial> | Testimonial[]>(
    "/testimonials/testimonials/"
  );
  return Array.isArray(data) ? data : data.results;
}

// ─── SEO ─────────────────────────────────────────────────────────────────────

export async function getPageSEO(
  pageIdentifier: string
): Promise<PageSEO | null> {
  try {
    return await apiFetch<PageSEO>(`/seo/${pageIdentifier}/`);
  } catch {
    return null;
  }
}

// ─── Sitemap ─────────────────────────────────────────────────────────────────

export async function getSitemapUrls(): Promise<SitemapUrl[]> {
  return apiFetch<SitemapUrl[]>("/sitemap/urls/");
}

// ─── Services / How We Work ─────────────────────────────────────────────────

export async function getHowWeWorkSettings(): Promise<HowWeWorkSettings | null> {
  try {
    const data = await apiFetch<
      PaginatedResponse<HowWeWorkSettings> | HowWeWorkSettings[]
    >("/services/how-we-work-settings/");
    const items = Array.isArray(data) ? data : data.results;
    return items[0] ?? null;
  } catch {
    return null;
  }
}

export async function getWorkProcesses(): Promise<WorkProcessStep[]> {
  try {
    const data = await apiFetch<
      PaginatedResponse<WorkProcessStep> | WorkProcessStep[]
    >("/services/work-processes/");
    return Array.isArray(data) ? data : data.results;
  } catch {
    return [];
  }
}
