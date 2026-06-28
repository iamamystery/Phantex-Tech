import type { Article } from '../types'

export const buildingProductionReadyRestApis: Article = {
  slug: 'building-production-ready-rest-apis',
  title: 'Building Production-Ready REST APIs',
  subtitle:
    'Authentication, rate limiting, versioning, error handling, documentation — the complete checklist for APIs ready for real traffic.',
  excerpt:
    'Authentication, rate limiting, versioning, error handling, documentation — the complete checklist for APIs ready for real traffic.',
  author: 'zara-malik',
  category: 'backend-engineering',
  tags: ['rest', 'apis', 'fastapi', 'python', 'infrastructure'],
  date: '2025-04-15',
  popularity: 89,
  content: `An API that works in development and an API that's ready for production are separated by a long list of concerns that have nothing to do with your core features: authentication, rate limiting, versioning, consistent errors, pagination, idempotency, observability, and documentation. None of them are glamorous. All of them are the difference between an API people can build on and one they'll curse.

This is the checklist we run through before any REST API we build goes live. It's framework-agnostic in principle; the examples use FastAPI because that's our default.

## Design resources around nouns, not verbs

A clean REST API models *resources* (nouns) and uses HTTP methods (verbs) to act on them. This isn't pedantry — consistent, predictable URL structure is what makes an API learnable.

\`\`\`
GET    /v1/orders            # list
POST   /v1/orders            # create
GET    /v1/orders/{id}       # retrieve
PATCH  /v1/orders/{id}       # partial update
DELETE /v1/orders/{id}       # delete
GET    /v1/orders/{id}/items # nested sub-resource
\`\`\`

Use the right method for the right semantics, and respect their guarantees: \`GET\` is safe (no side effects), \`PUT\` and \`DELETE\` are idempotent (repeating them has the same effect), \`POST\` is neither. Clients and infrastructure (caches, proxies, retry logic) rely on these guarantees, so honour them.

## Authentication and authorization

These are two different things and both matter. *Authentication* is "who are you"; *authorization* is "what may you do." Get authentication via a standard mechanism — short-lived bearer tokens (JWT) for user sessions, API keys for server-to-server — and never invent your own crypto.

\`\`\`python
async def require_user(token: str = Depends(bearer)) -> User:
    try:
        claims = jwt.decode(token, PUBLIC_KEY, algorithms=["RS256"])
    except jwt.InvalidTokenError:
        raise HTTPException(401, "invalid token")
    user = await users.get(claims["sub"])
    if user is None or not user.is_active:
        raise HTTPException(401, "unknown or inactive user")
    return user
\`\`\`

Authorization then happens per-resource: this user may read *this* order because they own it. Enforce it at the data boundary, and scope every query to the caller's permissions.

> [!WARNING]
> The most common API vulnerability — top of the OWASP API Security list — is broken object-level authorization: an endpoint that returns \`/orders/{id}\` for *any* id without checking the caller owns it. Authentication alone doesn't protect you; a logged-in attacker just increments the id. Always verify ownership, never trust the id in the URL.

## Consistent, useful error responses

Clients need errors that are predictable and actionable. Pick one error shape and use it everywhere — a machine-readable code, a human-readable message, and field-level detail for validation failures.

\`\`\`json
{
  "error": {
    "code": "validation_error",
    "message": "The request body is invalid.",
    "details": [
      { "field": "email", "issue": "not a valid email address" }
    ]
  }
}
\`\`\`

Use HTTP status codes correctly — \`400\` for client mistakes, \`401\`/\`403\` for auth, \`404\` for missing resources, \`409\` for conflicts, \`422\` for validation, \`429\` for rate limits, \`5xx\` only for genuine server faults. Returning \`200\` with an error in the body, a habit some APIs fall into, breaks every client's error handling.

> [!TIP]
> Include a unique request id in every response (a header like \`X-Request-Id\`) and in your logs. When a customer reports "request X failed," you can find the exact log lines instantly instead of guessing. It's a tiny addition that pays for itself the first time something breaks.

## Versioning from day one

The moment a third party depends on your API, you can't make breaking changes freely. Version from the start — even at v1 — so you have a path to evolve. URL-path versioning (\`/v1/...\`) is the simplest and most visible approach.

The discipline is knowing what's breaking and what isn't. *Adding* an optional field or a new endpoint is backward-compatible. *Removing* a field, renaming one, changing a type, or tightening validation is breaking and requires a new version. Design responses to be *extensible* — clients should ignore unknown fields — so you can add without breaking.

## Pagination, filtering, and sorting

Any list endpoint will eventually return too much data. Paginate from the start; retrofitting pagination onto an endpoint clients already consume unpaginated is a breaking change.

\`\`\`
GET /v1/orders?limit=50&cursor=eyJpZCI6MTAwfQ&status=open&sort=-created_at
\`\`\`

Prefer **cursor-based pagination** over offset for large or frequently-changing datasets. Offset pagination (\`?page=500\`) gets slower the deeper you go and skips or duplicates rows when the underlying data changes between requests. A cursor (an opaque pointer to "where you left off") is stable and fast at any depth.

\`\`\`python
@router.get("/orders")
async def list_orders(limit: int = Query(50, le=100), cursor: str | None = None):
    rows = await orders.page(after=decode_cursor(cursor), limit=limit + 1)
    has_more = len(rows) > limit
    rows = rows[:limit]
    return {
        "data": rows,
        "next_cursor": encode_cursor(rows[-1]) if has_more else None,
    }
\`\`\`

Note the \`le=100\` cap on \`limit\` — never let a client request unbounded data, or one request can exhaust your database.

## Rate limiting and abuse protection

A public API without rate limiting is a denial-of-service waiting to happen — accidental (a client's buggy loop) or deliberate. Limit per client (per API key or user), return \`429\` with a \`Retry-After\` header when the limit is hit, and tell clients their budget via headers.

\`\`\`python
async def rate_limit(user: User = Depends(require_user)):
    key = f"ratelimit:{user.id}"
    count = await redis.incr(key)
    if count == 1:
        await redis.expire(key, 60)            # 60-second window
    if count > USER_RATE_LIMIT:
        raise HTTPException(429, "rate limit exceeded",
                            headers={"Retry-After": "60"})
\`\`\`

> [!NOTE]
> Expose rate-limit state to well-behaved clients via \`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\`, and \`X-RateLimit-Reset\` headers. Good clients will back off on their own when they can see they're running low — turning rate limiting from a wall they hit into a budget they manage.

## Idempotency for unsafe operations

Networks fail. A client that doesn't get a response to \`POST /orders\` doesn't know if the order was created, so it retries — and now you have two orders. **Idempotency keys** solve this: the client sends a unique key, and the server guarantees the operation runs at most once.

\`\`\`python
@router.post("/orders")
async def create_order(data: OrderIn, idempotency_key: str = Header(...)):
    existing = await idempotency.get(idempotency_key)
    if existing is not None:
        return existing                         # safe replay — same result
    order = await orders.create(data)
    await idempotency.store(idempotency_key, order, ttl=hours(24))
    return order
\`\`\`

This is essential for anything that creates resources or moves money, and it's the difference between a retry being safe and a retry being a duplicate charge.

## Documentation that stays true

An undocumented API is an unusable API. The best documentation is *generated from the code* so it can't drift — FastAPI produces an OpenAPI spec and interactive docs automatically from your route signatures and Pydantic models. Lean into that: rich response models, descriptions, and examples on your schemas become accurate, always-current docs for free.

## Common mistakes

- **Broken object-level authorization.** Always verify the caller owns the resource, never trust the id.
- **Inconsistent error shapes.** Pick one error format and one set of status codes; use them everywhere.
- **No pagination from the start.** Retrofitting it is a breaking change.
- **Offset pagination on large datasets.** Use cursors for stable, fast paging.
- **No rate limiting.** A public API needs per-client limits and \`429\` responses.
- **No idempotency on creates/payments.** Retries will duplicate resources without it.
- **Versionless APIs.** You'll need to evolve; version from v1.

## Production considerations

- **Observability.** Emit metrics (latency, error rate, throughput) per endpoint, structured logs with request ids, and traces for slow requests.
- **Timeouts and limits.** Cap request body size, set per-request timeouts, and bound pagination — protect the server from any single request.
- **CORS and security headers.** Configure CORS narrowly; set security headers; enforce HTTPS.
- **Backward-compatible deploys.** Roll out additive changes safely; gate breaking changes behind a new version with a deprecation window.

## Conclusion

Building a production-ready REST API is mostly about the unglamorous concerns that surround your features: authenticating and authorizing every request, returning predictable errors, paginating and rate-limiting every list, making unsafe operations idempotent, versioning so you can evolve, and documenting so people can actually use it.

None of it is hard individually. The discipline is doing all of it *before* you have real traffic — because every one of these is far cheaper to build in at the start than to retrofit onto an API that clients already depend on.

## Key takeaways

- Model resources as nouns and respect HTTP method semantics.
- Authenticate every request and verify object-level ownership on every resource.
- Use one consistent error shape and correct status codes, with request ids.
- Paginate (prefer cursors), filter, and cap list sizes from day one.
- Rate-limit per client and make creates/payments idempotent via idempotency keys.
- Version from v1 and let your docs generate from code so they never drift.`,
}
