import type { Article } from '../types'

export const dataPipeline100kRecords: Article = {
  slug: 'data-pipeline-100k-records',
  title: 'How We Built a Data Pipeline Processing 100,000+ Records Daily',
  subtitle:
    'A deep dive into designing reliable ingestion pipelines, handling failures gracefully, and scaling data operations from prototype to production.',
  excerpt:
    'A deep dive into designing reliable ingestion pipelines, handling failures gracefully, and scaling data operations from prototype to production.',
  author: 'amir-karimi',
  category: 'data-engineering',
  tags: ['data-engineering', 'python', 'postgresql', 'scaling', 'infrastructure'],
  date: '2025-06-18',
  featured: true,
  popularity: 98,
  content: `When a client first came to us, their "data pipeline" was a single Python script run by hand every morning. It pulled records from three vendor APIs, did some cleanup in pandas, and wrote a CSV that an analyst imported into a dashboard. It worked — until it didn't. A vendor changed a field name, the script crashed silently at 6am, and the company made pricing decisions on three-day-old data for a week before anyone noticed.

This article is the story of how we rebuilt that system into a pipeline that reliably processes more than 100,000 records a day, recovers from failure on its own, and tells us the moment something goes wrong. It is not a story about exotic technology. It is a story about applying a handful of boring, durable ideas consistently.

## What "reliable" actually means

Before writing a line of code, it helps to define reliability concretely, because "make it reliable" is not an engineering requirement — it is a wish. For a data pipeline, we hold ourselves to four properties:

- **Correctness**: the data that lands is the data that was sent, transformed by rules we can point to.
- **Completeness**: every record that should be processed is processed exactly once, even across retries and restarts.
- **Timeliness**: data is fresh within an agreed window (for this client, 30 minutes).
- **Observability**: when any of the above is violated, a human finds out in minutes, not days.

Every decision below maps back to one of these four properties. If a piece of architecture doesn't serve one of them, it is complexity for its own sake.

> [!NOTE]
> The hardest of these is *completeness*. "Exactly once" is famously difficult in distributed systems. We don't actually achieve exactly-once delivery — almost nobody does. We achieve *at-least-once delivery with idempotent processing*, which is observably equivalent and far simpler to build.

## The shape of the pipeline

We model every pipeline as four distinct stages, each with a single responsibility. Keeping them separate is what makes the system debuggable.

\`\`\`
  ┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐
  │  Ingest    │──▶│  Validate  │──▶│ Transform  │──▶│   Load     │
  │ (raw I/O)  │   │ (contracts)│   │ (business) │   │ (sink)     │
  └────────────┘   └────────────┘   └────────────┘   └────────────┘
        │                │                │                │
        ▼                ▼                ▼                ▼
   raw landing      rejected rows    derived fields   warehouse +
   (immutable)      (quarantine)     (auditable)      idempotent upsert
\`\`\`

The single most important rule: **ingestion writes raw data to immutable storage before anything else touches it.** If a transform has a bug, we can replay from the raw landing zone instead of re-pulling from a vendor that may rate-limit us or no longer have the data.

### Stage 1 — Ingest

Ingestion does as little as possible. It fetches bytes, records where they came from, and writes them down unchanged. No parsing logic, no business rules. This is deliberate: the more an ingestion stage "understands" its data, the more reasons it has to fail, and ingestion failures are the most expensive because they lose data you can't always re-fetch.

\`\`\`python
from dataclasses import dataclass
from datetime import datetime, timezone
import hashlib

@dataclass(frozen=True)
class RawRecord:
    source: str
    fetched_at: datetime
    payload: bytes

    @property
    def fingerprint(self) -> str:
        """Stable content hash — the basis for idempotency downstream."""
        h = hashlib.sha256()
        h.update(self.source.encode())
        h.update(self.payload)
        return h.hexdigest()


async def ingest(source: VendorClient) -> list[RawRecord]:
    now = datetime.now(timezone.utc)
    records = []
    async for page in source.paginate():
        records.append(
            RawRecord(source=source.name, fetched_at=now, payload=page.raw_bytes)
        )
    return records
\`\`\`

The \`fingerprint\` is the quiet hero of this whole design. Because it is a deterministic hash of the source plus the raw bytes, the same record fetched twice produces the same fingerprint. We use that fingerprint as a natural key everywhere downstream, which is what lets retries be safe.

### Stage 2 — Validate

Validation is where we enforce *contracts*. A contract is our explicit statement of what a record must look like to be processable. We use Pydantic models as executable contracts because a validation rule that lives in a docstring is a validation rule that will eventually be violated.

\`\`\`python
from pydantic import BaseModel, field_validator, ValidationError

class ProductRecord(BaseModel):
    sku: str
    price_cents: int
    currency: str
    updated_at: datetime

    @field_validator("price_cents")
    @classmethod
    def price_must_be_sane(cls, v: int) -> int:
        if v < 0 or v > 100_000_000:  # $1M ceiling — anything higher is a bug
            raise ValueError(f"implausible price: {v}")
        return v


def validate(raw: dict) -> ProductRecord | None:
    try:
        return ProductRecord.model_validate(raw)
    except ValidationError as exc:
        quarantine(raw, reason=str(exc))
        return None
\`\`\`

Note what happens to bad rows: they go to a **quarantine** table, not the floor. A pipeline that silently drops malformed records is a pipeline that lies to you about completeness. When a vendor renames a field, the quarantine table fills up immediately and our alerting catches it — instead of the data simply vanishing.

> [!WARNING]
> The most common pipeline bug we see in client code is *fail-open validation*: a \`try/except\` that swallows the error and continues with partial data. This converts a loud, fixable problem (a crash) into a silent, corrosive one (wrong numbers in a dashboard that everyone trusts). Always fail toward visibility.

### Stage 3 — Transform

Transformation applies business logic: currency normalization, deduplication, joins against reference data, derived fields. The rule here is **purity**. A transform is a function from validated input to derived output with no side effects. Pure transforms are trivially testable and trivially replayable.

\`\`\`python
def transform(record: ProductRecord, fx: FxRates) -> CanonicalProduct:
    return CanonicalProduct(
        sku=record.sku.upper().strip(),
        price_usd=fx.to_usd(record.price_cents, record.currency),
        updated_at=record.updated_at,
    )
\`\`\`

Because \`transform\` takes its dependencies (the FX rates) as an argument rather than reaching out to a database, we can run ten thousand transforms in a unit test without a network connection. When the FX provider changes, we change one boundary, not a hundred call sites.

### Stage 4 — Load

The load stage writes to the warehouse using an **idempotent upsert** keyed on the record fingerprint or a natural business key. This is what makes at-least-once delivery safe: running the same load twice produces the same warehouse state.

\`\`\`sql
INSERT INTO products (sku, price_usd, updated_at, fingerprint)
VALUES ($1, $2, $3, $4)
ON CONFLICT (sku) DO UPDATE
SET price_usd  = EXCLUDED.price_usd,
    updated_at = EXCLUDED.updated_at,
    fingerprint = EXCLUDED.fingerprint
WHERE products.updated_at < EXCLUDED.updated_at;  -- never overwrite newer data
\`\`\`

The \`WHERE products.updated_at < EXCLUDED.updated_at\` clause matters more than it looks. Pipelines reprocess data out of order all the time — a retry of yesterday's batch must never clobber today's fresher value. Encoding that rule in SQL means it holds regardless of which code path triggered the write.

## Handling failure as a first-class concern

At 100,000 records a day, something fails every single day. A vendor times out, a network blips, the database briefly rejects connections during a failover. The question is never *whether* failures happen — it is whether they are *contained*.

### Retries with backoff and jitter

Transient failures get retried with exponential backoff and jitter. The jitter is not optional: without it, a fleet of workers that all failed at the same moment will all retry at the same moment, producing a thundering herd that knocks the dependency over again.

\`\`\`python
import asyncio, random

async def with_retry(fn, *, attempts=5, base=0.5, cap=30.0):
    for attempt in range(attempts):
        try:
            return await fn()
        except TransientError:
            if attempt == attempts - 1:
                raise
            sleep = min(cap, base * 2 ** attempt)
            await asyncio.sleep(sleep * (0.5 + random.random()))  # full jitter
\`\`\`

### Dead-letter queues

After retries are exhausted, the unit of work goes to a **dead-letter queue** (a table, in our case) with the full context needed to reprocess it later: the raw payload, the error, and the stage it died in. Nothing is ever thrown away. A human can inspect the dead-letter table, fix the root cause, and replay — turning a 3am page into a 9am ticket.

### Checkpointing and idempotency

The pipeline records a checkpoint after each batch commits. If the process is killed mid-run, it resumes from the last checkpoint. Combined with idempotent loads, this means a crash costs us at most one batch of *re-work*, never any data.

> [!TIP]
> Design every stage so that "run it again from the start" is always a safe operation. If you can re-run any stage without fear, you have eliminated an entire category of 3am decisions about whether it's safe to retry.

## Scaling from hundreds to hundreds of thousands

The first version of this pipeline processed a few thousand records sequentially in a couple of minutes. Getting to 100,000+ required three changes, applied in this order — because you should never scale a system you can't yet observe.

1. **Concurrency, not parallelism, first.** Most of the time was spent waiting on vendor I/O, so we moved from synchronous requests to \`asyncio\` with a bounded concurrency semaphore. This alone gave a 10x throughput improvement with no new infrastructure.

2. **Batch the writes.** Writing one row at a time is the classic pipeline bottleneck. Batching inserts into chunks of 500–1,000 rows inside a single transaction cut database round-trips by three orders of magnitude.

3. **Partition the work horizontally.** Only once a single worker was saturated did we shard by source and run multiple workers. Each worker owns a disjoint slice of the keyspace, so they never contend on the same rows.

\`\`\`python
sem = asyncio.Semaphore(20)  # bound concurrency to protect the vendor + ourselves

async def process(record):
    async with sem:
        validated = validate(record)
        if validated is None:
            return
        await load(transform(validated, fx))

await asyncio.gather(*(process(r) for r in batch))
\`\`\`

The bounded semaphore is doing real work here. Unbounded concurrency is a denial-of-service attack on your own dependencies. Twenty concurrent requests was the number where vendor latency stayed flat; we found it by measuring, not guessing.

## Observability: the part people skip

A pipeline you can't see is a pipeline you don't control. We instrument three layers:

- **Metrics**: records ingested, validated, quarantined, and loaded per run; end-to-end latency; retry counts. These feed a dashboard and, crucially, alerts.
- **Structured logs**: every log line carries the run id and record fingerprint, so we can trace a single record through all four stages.
- **Data quality checks**: after each load, automated assertions run against the warehouse — row counts within expected bounds, no nulls in required columns, freshness within the SLA.

\`\`\`python
def assert_freshness(warehouse, max_lag_minutes=30):
    lag = warehouse.minutes_since_latest("products")
    if lag > max_lag_minutes:
        alert(f"products is stale by {lag}m (SLA {max_lag_minutes}m)")
\`\`\`

The freshness check is the one that has saved this client the most pain. It doesn't care *why* data is stale — a crashed worker, a vendor outage, a slow query. It just notices that the contract with the business has been violated and raises a hand.

## Common mistakes we see (and made ourselves)

- **Coupling ingestion to transformation.** When fetch logic and business logic live in the same function, you can't replay one without re-running the other. Separate them.
- **Treating the warehouse as the source of truth.** The immutable raw landing zone is the source of truth. The warehouse is a *derived view* you can always rebuild.
- **Scaling before observing.** Adding workers to a pipeline you can't measure just makes failures faster and harder to diagnose.
- **Silent error handling.** Every swallowed exception is a future incident with the evidence already deleted.
- **No quarantine.** Without a place to put bad rows, you are forced to choose between crashing and lying. Quarantine lets you do neither.

## Production considerations

A few things that only matter once the system is real:

- **Schema evolution.** Vendors change their payloads. Because raw data is immutable and validation is explicit, a schema change shows up as a spike in quarantined rows rather than as corrupted output. We version our contracts and can run two versions during a migration window.
- **Backfills.** Reprocessing six months of history uses the *same code path* as the daily run, pointed at the raw landing zone. There is no separate, untested "backfill script" to rot.
- **Cost.** Batching and bounded concurrency are also cost controls — fewer warehouse writes and fewer vendor calls translate directly into a smaller bill.
- **Security.** Vendor credentials live in a secret manager, never in code or environment files committed to the repo. Raw payloads that contain PII are encrypted at rest in the landing zone.

## Conclusion

The pipeline that processes 100,000+ records a day for this client is not clever. It is *disciplined*. Ingestion is dumb and immutable. Validation is explicit and fails loudly. Transformation is pure. Loading is idempotent. Failures are retried, then dead-lettered, never dropped. And every stage is observable enough that the system tells us when one of its four promises — correctness, completeness, timeliness, observability — is about to break.

That discipline is what turned a hand-run script that quietly served stale data into infrastructure the business can actually bet on.

## Key takeaways

- Define reliability concretely: correctness, completeness, timeliness, observability.
- Write raw data to immutable storage *before* transforming it, so you can always replay.
- Make every stage idempotent so "run it again" is always safe.
- Quarantine bad rows instead of dropping them — fail toward visibility.
- Scale in order: concurrency, then batching, then horizontal partitioning — and only after you can observe the system.
- A freshness/quality check that knows your SLA is worth more than any dashboard.`,
}
