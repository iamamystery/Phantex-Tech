import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:8000";

/**
 * Convert a relative media path (e.g. "/media/images/photo.jpg") into a full
 * URL pointing at the Django backend.  Returns `null` for falsy inputs so
 * callers can safely fall back to a placeholder.
 */
export function getMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  // Already an absolute URL – return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // Ensure a single leading slash
  const cleaned = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${cleaned}`;
}
