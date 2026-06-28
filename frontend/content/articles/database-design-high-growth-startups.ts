import type { Article } from '../types'

export const databaseDesignHighGrowthStartups: Article = {
  slug: 'database-design-high-growth-startups',
  title: 'Database Design for High-Growth Startups',
  subtitle:
    'The schema decisions that save you from painful migrations at scale — normalization tradeoffs, indexing strategies, and partition patterns.',
  excerpt:
    'The schema decisions that save you from painful migrations at scale — normalization tradeoffs, indexing strategies, and partition patterns.',
  author: 'zara-malik',
  category: 'data-engineering',
  tags: ['postgresql', 'data-engineering', 'scaling', 'infrastructure'],
  date: '2025-04-22',
  popularity: 90,
  content: `The database is the one part of a startup's stack that's genuinely hard to change later. You can rewrite the frontend, swap frameworks, even re-platform the backend — but the schema has gravity. Every line of code, every report, every integration comes to depend on it. The decisions you make in the first month echo for years.

This article is about the schema decisions that matter most for products that intend to grow: where to normalize, how to choose keys, when and how to index, and how to leave yourself room to scale without betting on complexity you don't yet need.

## Design for the next 10x, not the next 1000x

The two failure modes are equally common and equally costly. Under-design — no constraints, everything nullable, JSON blobs everywhere — and you'll be untangling data corruption within a year. Over-design — sharding, microservice-per-table, eventual consistency on day one — and you'll spend your scarce early time building for scale you may never reach, while shipping slower than competitors who didn't.

The right target is the *next* order of magnitude. Build something clean that comfortably handles 10x your current load and won't require a *rewrite* (as opposed to an *extension*) to handle 100x. That usually means: one well-designed PostgreSQL database, properly normalized, properly indexed, with a couple of escape hatches left open.

> [!TIP]
> PostgreSQL on a single decent instance handles far more than most founders expect — tens of thousands of writes per second and terabytes of data with the right schema and indexes. The instinct to reach for distributed databases, sharding, or NoSQL "for scale" is, in the vast majority of startups, premature. Earn the complexity.

## Normalize first, denormalize deliberately

Start normalized. A normalized schema — each fact stored once, relationships expressed by foreign keys — prevents the update anomalies that quietly corrupt data. When a customer changes their name, you update one row, not every order they ever placed.

\`\`\`sql
-- Normalized: the customer's name lives in exactly one place.
CREATE TABLE customers (
    id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name  text NOT NULL,
    email citext UNIQUE NOT NULL
);

CREATE TABLE orders (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id bigint NOT NULL REFERENCES customers(id),
    total_cents integer NOT NULL CHECK (total_cents >= 0),
    created_at  timestamptz NOT NULL DEFAULT now()
);
\`\`\`

Denormalization is a *performance optimization*, not a starting point. Add it deliberately, when a real query is too slow and you've measured it — for example, caching an \`order_count\` on the customer row to avoid counting on every page load. When you do, own the consequence: you now have two copies of a fact that can drift, so keep them in sync with a trigger or a scheduled reconciliation.

> [!WARNING]
> Beware the JSON-blob shortcut. \`jsonb\` is excellent for genuinely schemaless or sparse data, but using it to avoid designing a schema ("I'll just dump everything in a \`data\` column") defers the design work to a moment when you have millions of rows and far less freedom. If a field is queried, filtered, or joined on, it should be a real column with a real type and a real constraint.

## Choose your keys carefully

Primary keys are forever, so choose deliberately:

- **Prefer surrogate keys** (\`bigint identity\` or UUID) over natural keys. Natural keys (email, username) change, and a changing primary key cascades pain through every foreign key that references it.
- **\`bigint\` vs UUID.** \`bigint\` is smaller, faster to index, and human-readable; UUID avoids exposing row counts and lets clients generate ids offline. For most startups, \`bigint\` identity columns are the pragmatic default; reach for UUIDs (specifically UUIDv7, which is time-ordered) when you need client-generated or non-enumerable ids.
- **Never expose sequential ids in URLs** if enumeration is a privacy concern — a competitor counting your \`/orders/1\`, \`/orders/2\` learns your volume. Use a separate public, random identifier when that matters.

\`\`\`sql
ALTER TABLE orders ADD COLUMN public_id uuid NOT NULL DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX ON orders (public_id);  -- expose this, keep bigint id internal
\`\`\`

## Indexing: the highest-leverage performance work

A missing index is the single most common reason a startup's database "suddenly gets slow." The fix is rarely more hardware; it's an index. The principles:

- **Index your foreign keys.** PostgreSQL does *not* index foreign keys automatically, and joins/lookups on unindexed FKs trigger sequential scans that get linearly slower as the table grows.
- **Match indexes to your real queries.** Index the columns you filter and sort on, in the order your \`WHERE\` and \`ORDER BY\` use them.
- **Use composite and partial indexes.** A composite index serves queries that filter on several columns; a partial index covers a common subset cheaply.

\`\`\`sql
-- Composite index for "this customer's recent orders".
CREATE INDEX ON orders (customer_id, created_at DESC);

-- Partial index: only the open orders, which is what dashboards query.
CREATE INDEX ON orders (created_at DESC) WHERE status = 'open';
\`\`\`

The way to find missing indexes is to ask the database, not to guess. \`EXPLAIN ANALYZE\` shows the actual plan; a \`Seq Scan\` over a large table in a hot query is your signal.

\`\`\`sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20;
\`\`\`

> [!NOTE]
> Indexes are not free — each one slows writes and consumes space. Don't index everything "just in case." Index the columns your real queries use, verify with \`EXPLAIN ANALYZE\`, and periodically drop indexes that aren't being used (PostgreSQL's \`pg_stat_user_indexes\` tells you which).

## Constraints are documentation the database enforces

Constraints — \`NOT NULL\`, \`CHECK\`, \`UNIQUE\`, foreign keys — are the cheapest data-quality insurance you will ever buy. They make invalid states *unrepresentable*. An application bug that tries to write a negative price or orphan an order simply can't; the database rejects it.

\`\`\`sql
CREATE TABLE subscriptions (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id bigint NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    plan        text NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
    seats       integer NOT NULL CHECK (seats > 0),
    -- A customer can have at most one active subscription.
    UNIQUE (customer_id) DEFERRABLE INITIALLY DEFERRED
);
\`\`\`

Teams that skip constraints "to move faster" always pay it back with interest, debugging data corruption that a one-line \`CHECK\` would have prevented at the source.

## Leaving room to scale

You don't need to scale on day one, but you should avoid decisions that make scaling *impossible*. The cheap escape hatches:

- **Timestamps everywhere.** \`created_at\` and \`updated_at\` on every table. They cost nothing and are indispensable for partitioning, auditing, and debugging later.
- **Design large append-only tables (events, logs, time-series) so they can be partitioned by time.** Even if you don't partition yet, keeping a clean \`created_at\` and avoiding cross-time queries means you can introduce range partitioning later without restructuring.

\`\`\`sql
-- Ready to partition by month when volume demands it.
CREATE TABLE events (
    id         bigint GENERATED ALWAYS AS IDENTITY,
    type       text NOT NULL,
    payload    jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2025_04 PARTITION OF events
    FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');
\`\`\`

- **Separate hot and cold data.** Keep the small, frequently-queried tables lean; move bulky historical data to its own tables (or partitions) so the hot path stays fast.
- **Read replicas before sharding.** When reads dominate, a read replica is a far simpler scaling step than sharding — reach for it first.

## Migrations: the discipline that keeps schemas evolvable

A startup schema changes constantly; the question is whether those changes are safe. Two rules:

- **Every change is a reversible, version-controlled migration** — never a manual edit in a database GUI. The schema's history lives in the repo.
- **Make changes online.** On a large table, adding a column with a default, or an index without \`CONCURRENTLY\`, can lock the table and take the app down. Learn the non-blocking variants (\`CREATE INDEX CONCURRENTLY\`, adding nullable columns then backfilling) before you have a table big enough to hurt.

## Common mistakes

- **Skipping constraints to move fast.** They prevent corruption at the source for almost no cost.
- **Unindexed foreign keys.** The most common cause of mysterious slowdowns at scale.
- **JSON blobs instead of schema.** Fine for sparse data; a debt trap when used to dodge design.
- **Natural primary keys.** They change; use stable surrogate keys.
- **Premature distribution.** A single tuned PostgreSQL instance scales further than most startups ever need.
- **Blocking migrations on big tables.** Use online, concurrent operations to avoid downtime.

## Production considerations

- **Backups and PITR.** Automated backups and point-in-time recovery are non-negotiable before you have customers.
- **Monitor slow queries.** \`pg_stat_statements\` surfaces the queries actually costing you; optimize those, ignore the rest.
- **Vacuum and bloat.** Understand autovacuum; high-churn tables need it tuned or they bloat and slow down.
- **Connection limits.** Put a pooler (PgBouncer) in front before your app's connection count outgrows the database's limit.

## Conclusion

Good startup database design is not about predicting your eventual scale — it's about making clean, constrained, well-indexed decisions that handle the next 10x and leave the door open for the one after. Normalize first and denormalize with evidence. Use surrogate keys, real columns, and real constraints. Index for your actual queries and verify with \`EXPLAIN ANALYZE\`. Leave cheap escape hatches — timestamps, partition-ready event tables, room for a read replica — without paying for complexity you don't need yet.

The schema is the part with gravity. Treat the early decisions with the seriousness they deserve, and you'll spend your growth years extending the database instead of escaping it.

## Key takeaways

- Design for the next 10x; a single tuned PostgreSQL goes further than you think.
- Normalize first; denormalize only with measured evidence and a sync strategy.
- Use stable surrogate keys, real typed columns, and enforced constraints.
- Index foreign keys and your real query patterns; verify with \`EXPLAIN ANALYZE\`.
- Add timestamps everywhere and keep big append-only tables partition-ready.
- Treat every schema change as a reversible, online, version-controlled migration.`,
}
