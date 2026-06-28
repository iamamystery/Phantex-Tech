import type { Article } from '../types'

export const designingMaintainableApis: Article = {
  slug: 'designing-maintainable-apis',
  title: 'Designing Maintainable APIs',
  subtitle:
    'API design decisions made at v1 determine whether v2 is an evolution or a rewrite. The framework we use for every API we design.',
  excerpt:
    'API design decisions made at v1 determine whether v2 is an evolution or a rewrite. The framework we use for every API we design.',
  author: 'zara-malik',
  category: 'backend-engineering',
  tags: ['apis', 'rest', 'fastapi', 'testing', 'infrastructure'],
  date: '2025-04-08',
  editorsPick: true,
  popularity: 87,
  content: `Every API has two lifespans: the time it takes to build, and the years you spend living with it. The second is far longer and far more expensive, and it's almost entirely determined by decisions made during the first. A maintainable API is one where v2 is an *evolution* of v1 — adding capability without breaking anyone — rather than a rewrite that forces every consumer to migrate.

This article is the framework we apply to every API we design, focused not on getting it working but on keeping it changeable for years.

## Maintainability is about change, not perfection

You will not design the perfect API up front — you don't yet know how it'll be used. So the goal isn't perfection; it's *changeability*. A maintainable API can absorb new requirements gracefully. That comes down to a handful of properties: consistency, explicit contracts, loose coupling, and the ability to evolve without breaking consumers.

> [!NOTE]
> The cost of an API decision is paid by everyone who builds against it, multiplied by how long the API lives. A small inconsistency that's trivial to fix on day one becomes nearly impossible to change once a hundred clients depend on it. Design as if every decision is permanent — because for your consumers, it nearly is.

## Consistency is the highest virtue

A consistent API is *learnable*: once a developer understands one endpoint, they can predict the others. Inconsistency forces them to relearn your API endpoint by endpoint, and it's the most common reason APIs feel painful to use. Decide your conventions once and apply them everywhere:

- **Naming.** Pick \`snake_case\` or \`camelCase\` and never mix them. Plural resource names (\`/orders\`). Consistent verb semantics.
- **Structure.** Every list response has the same envelope. Every error has the same shape. Timestamps are always ISO 8601 UTC.
- **Behaviour.** Pagination works the same on every collection. Filtering uses the same query-param grammar everywhere.

\`\`\`json
{
  "data": [ /* ... */ ],
  "pagination": { "next_cursor": "...", "has_more": true }
}
\`\`\`

This envelope being identical across every collection endpoint means a client writes pagination handling *once*. The moment one endpoint returns a bare array and another wraps it, every consumer needs special cases — and special cases are where bugs and maintenance cost live.

## Explicit contracts over implicit behaviour

A maintainable API states its contract explicitly rather than relying on undocumented behaviour that consumers reverse-engineer and then depend on. Use a schema (OpenAPI, generated from typed models) as the single source of truth for what every endpoint accepts and returns.

\`\`\`python
class OrderOut(BaseModel):
    id: int
    public_id: str
    status: Literal["pending", "paid", "shipped", "cancelled"]
    total_cents: int
    created_at: datetime
\`\`\`

The \`Literal\` status type is a contract: these are the only values, documented and enforced. When a consumer sees it, they know exactly what to handle. The danger of *implicit* contracts is that consumers come to depend on accidents — an undocumented field, a particular ordering, a quirk of error formatting — and then any "internal" change breaks them. If it's observable, it's part of your contract whether you intended it or not.

## Design for extension: additive change should never break

The single most important maintainability property is that you can *add* without *breaking*. Design every response and request so new fields can appear without disrupting existing consumers:

- **Responses**: clients must ignore unknown fields. Then adding a field is always safe.
- **Requests**: new parameters are optional with sensible defaults. Then existing callers keep working unchanged.
- **Enums**: document that new values may be added, and have clients handle the unknown case gracefully rather than crashing.

\`\`\`python
# Adding 'priority' later is non-breaking: it's optional with a default.
class OrderIn(BaseModel):
    items: list[ItemIn]
    priority: Literal["normal", "rush"] = "normal"   # new, optional
\`\`\`

Get this right and the vast majority of your future changes are additive and safe — which is what makes "v2 is an evolution" possible.

> [!WARNING]
> The flip side: *removing* or *renaming* a field, *tightening* validation, or *changing* a type is always breaking, no matter how small it seems. Removing a field "nobody uses" is famous last words — someone is using it. Breaking changes require a new version and a deprecation window, never a silent edit.

## Version deliberately, and only when you must

Versioning is your escape hatch for the changes that *can't* be additive. But each version you maintain is a cost — more code paths, more tests, more surface area. So the discipline is twofold: version from v1 so you *have* the mechanism, but make breaking changes rarely enough that you don't proliferate versions.

When you must break compatibility, run old and new in parallel and give consumers a real window and clear communication to migrate. A version is a contract with your consumers' time; don't change it casually, and don't strand them when you do.

## Decouple the API from your internals

A maintainable API is a *deliberate interface*, not a window into your database. When your API response mirrors your table structure one-to-one, every internal refactor leaks out as a breaking change — rename a column and you've broken every client.

The fix is a translation layer: API models are distinct from your persistence models, and you map between them. This costs a little boilerplate and buys enormous freedom — you can restructure your database, split a service, or change an internal representation, and consumers never notice.

\`\`\`python
def to_api(order: OrderRow) -> OrderOut:
    # The mapping is the seam: internal changes stop here.
    return OrderOut(
        id=order.id,
        public_id=order.public_id,
        status=order.status,
        total_cents=order.amount,        # internal name differs — hidden from clients
        created_at=order.created_at,
    )
\`\`\`

> [!TIP]
> Treat your API schema and your database schema as two independent things that happen to be related. The mapping function between them is a feature, not overhead — it's the seam that lets your internals evolve freely behind a stable external contract.

## Make the API testable as a contract

Maintainability requires confidence that a change didn't break the contract. **Contract tests** assert the API's observable behaviour — the response shapes, status codes, and pagination — independent of the implementation. They're your safety net for refactoring: change the internals freely, and the contract tests confirm consumers still see the same thing.

\`\`\`python
async def test_orders_contract(client):
    resp = await client.get("/v1/orders")
    assert resp.status_code == 200
    body = resp.json()
    assert "data" in body and "pagination" in body          # stable envelope
    assert set(body["data"][0]) >= {"id", "public_id", "status", "total_cents"}
\`\`\`

## Documentation and developer experience

An API's maintainability includes how easily others can *use* it correctly. Generated, always-current docs (from your OpenAPI schema), realistic examples, clear error messages, and a changelog that records what changed and when — these reduce the support burden and the misuse that leads to "please don't change that, we depend on it" surprises.

## Common mistakes

- **Inconsistency.** Mixed naming, varying envelopes, and per-endpoint quirks make an API unlearnable.
- **Leaking the database.** One-to-one mapping of tables to responses turns every refactor into a breaking change.
- **Implicit contracts.** Undocumented behaviour becomes a dependency you can't change.
- **Breaking changes without versioning.** Removing/renaming/retyping fields silently breaks consumers.
- **No contract tests.** Without them, you can't refactor with confidence.
- **Over-versioning.** Proliferating versions for changes that could have been additive.

## Production considerations

- **Deprecation process.** A documented path — announce, dual-run, sunset — with telemetry on who still uses the old version.
- **Backward-compatible deploys.** Roll out additive changes safely behind feature flags where needed.
- **Telemetry.** Track which fields and endpoints are actually used, so you know what's safe to change.
- **Schema as source of truth.** Generate clients, docs, and validation from one schema to prevent drift.

## Conclusion

A maintainable API is designed for the years you'll live with it, not just the sprint you build it in. Consistency makes it learnable. Explicit contracts make it dependable. Additive-by-default design makes most changes safe. A translation layer decouples your external promise from your internal freedom. And contract tests let you refactor without fear.

Get those right at v1, and v2 becomes an evolution — new capability layered on without breaking a single consumer. Get them wrong, and v2 becomes a migration everyone resents. The decisions are the same size either way; only the consequences differ.

## Key takeaways

- Optimize for changeability, not perfection — you'll learn how the API is used over time.
- Be relentlessly consistent in naming, structure, and behaviour.
- State contracts explicitly; remember that anything observable is part of the contract.
- Design additive-by-default so new fields and params never break existing consumers.
- Decouple API models from database models with an explicit mapping seam.
- Write contract tests and version deliberately — only for changes that can't be additive.`,
}
