import type { Article } from '../types'

export const eventDrivenSystemsPython: Article = {
  slug: 'event-driven-systems-python',
  title: 'Event-Driven Systems with Python',
  subtitle:
    'Event-driven architecture is not just for microservices giants. How to implement reliable async event processing for growing platforms.',
  excerpt:
    'Event-driven architecture is not just for microservices giants. How to implement reliable async event processing for growing platforms.',
  author: 'amir-karimi',
  category: 'backend-engineering',
  tags: ['event-driven', 'python', 'redis', 'apis', 'infrastructure'],
  date: '2025-05-14',
  popularity: 86,
  content: `"Event-driven architecture" sounds like something you adopt when you have fifty microservices and a platform team. In reality, the core idea is useful far earlier — the moment a single user action needs to trigger several follow-on effects. A user signs up, and now you must send a welcome email, provision a workspace, notify sales, and start a trial clock. Doing all of that inline in the signup handler is how request handlers turn into thousand-line monsters that are slow and fragile.

This article shows how to introduce event-driven patterns into an ordinary Python application — not a distributed-systems rewrite, just a cleaner way to decouple "something happened" from "here's everything that should happen next."

## The problem with doing everything inline

Here's the signup handler everyone writes first, and why it ages badly:

\`\`\`python
async def signup(data: SignupData):
    user = await users.create(data)
    await email.send_welcome(user)          # slow (external API)
    await workspaces.provision(user)        # slow, can fail
    await crm.create_lead(user)             # slow, third-party flaky
    await analytics.track("signup", user)   # not critical
    return user
\`\`\`

Three problems compound here. It's **slow** — the user waits for four external calls before getting a response. It's **fragile** — if the CRM is down, signup fails entirely, even though the user was created. And it's **coupled** — the signup handler now knows about email, workspaces, CRM, and analytics, and every new follow-on effect makes it longer.

The event-driven reframe: signup's job is to create a user and announce that it happened. *What happens next* is somebody else's problem.

\`\`\`python
async def signup(data: SignupData):
    user = await users.create(data)
    await events.publish(UserSignedUp(user_id=user.id, email=user.email))
    return user  # fast, and oblivious to downstream effects
\`\`\`

The handler is now two lines and knows nothing about email or CRM. Subscribers react to the \`UserSignedUp\` event independently.

## Events as first-class, typed objects

An event is a fact about something that has happened, in the past tense, immutable. We model events as typed dataclasses, which makes them self-documenting and lets the type checker catch mismatches between publishers and subscribers.

\`\`\`python
from dataclasses import dataclass
from datetime import datetime, timezone
import uuid

@dataclass(frozen=True)
class Event:
    id: str
    occurred_at: datetime

    @staticmethod
    def envelope() -> tuple[str, datetime]:
        return str(uuid.uuid4()), datetime.now(timezone.utc)

@dataclass(frozen=True)
class UserSignedUp(Event):
    user_id: int
    email: str
\`\`\`

Naming matters more than it seems. \`UserSignedUp\`, not \`SendWelcomeEmail\`. The event describes *what happened*, not *what to do about it* — that's the decoupling. Ten different things can react to one signup without the publisher knowing any of them exist.

> [!NOTE]
> Events are facts in the past tense (\`OrderPlaced\`, \`PaymentFailed\`), commands are requests in the imperative (\`SendEmail\`, \`ChargeCard\`). Mixing them up is the most common modelling error. If your "event" tells a specific subscriber what to do, it's secretly a command and you've recreated the coupling you were trying to remove.

## Reliable delivery: the transactional outbox

Here's the trap that catches almost everyone. If you write the user to the database and *then* publish the event, what happens if the process crashes in between? The user exists but no event was ever sent — no welcome email, no workspace, ever. If you publish *first* and the database write fails, you've announced something that didn't happen.

The fix is the **transactional outbox**: write the event to an \`outbox\` table *in the same database transaction* as the business change. A separate process relays outbox rows to the message broker. Because the write and the event are one atomic commit, they can never disagree.

\`\`\`python
async def signup(data: SignupData, db: AsyncSession):
    async with db.begin():                       # one atomic transaction
        user = await users.create(db, data)
        db.add(OutboxRow(
            type="UserSignedUp",
            payload={"user_id": user.id, "email": user.email},
        ))
    return user

# A separate relay drains the outbox to the broker, at-least-once.
async def relay_outbox(db, broker):
    rows = await db.fetch_unpublished_outbox(limit=100)
    for row in rows:
        await broker.publish(row.type, row.payload)
        await db.mark_published(row.id)
\`\`\`

This gives at-least-once delivery, which means subscribers *will* occasionally see the same event twice (a crash between publish and \`mark_published\`). Which leads directly to the next rule.

## Idempotent subscribers

Because delivery is at-least-once, every subscriber must be idempotent: processing the same event twice has the same effect as processing it once. The standard technique is to record processed event ids and skip duplicates.

\`\`\`python
async def on_user_signed_up(event: UserSignedUp, db):
    if await db.already_processed(subscriber="welcome_email", event_id=event.id):
        return  # duplicate delivery — safely ignore
    await email.send_welcome(event.email)
    await db.mark_processed(subscriber="welcome_email", event_id=event.id)
\`\`\`

> [!WARNING]
> "We'll just make sure events are delivered exactly once" is a tempting trap. Exactly-once delivery is effectively impossible in distributed systems. Don't fight it — embrace at-least-once delivery plus idempotent handlers, which is simpler to build and just as correct in practice.

## Choosing a transport

You don't need Kafka to start. Match the transport to your scale and reliability needs:

- **In-process event bus** — a simple dispatcher in a single app. Great for decoupling code; events are lost if the process dies. Fine for non-critical reactions.
- **Redis Streams / lists** — durable enough for most growing platforms, trivial to operate, and you probably already run Redis. This is our default recommendation for teams introducing events.
- **Dedicated broker (RabbitMQ, Kafka, SQS)** — when you need high throughput, multiple consumer groups, long retention, or cross-service fan-out.

\`\`\`python
class RedisStreamBus:
    async def publish(self, stream: str, payload: dict):
        await self.redis.xadd(stream, {"data": json.dumps(payload)})

    async def consume(self, stream: str, group: str, consumer: str):
        # Consumer groups give you load balancing + acked delivery for free.
        msgs = await self.redis.xreadgroup(group, consumer, {stream: ">"}, count=10)
        for _, entries in msgs:
            for msg_id, fields in entries:
                yield msg_id, json.loads(fields["data"])
\`\`\`

> [!TIP]
> Start with the simplest transport that meets your durability requirement and grow into a heavier one only when a real constraint forces you to. Most teams introducing event-driven patterns are well served by Redis Streams for years. Reaching for Kafka on day one is buying operational complexity you can't yet afford.

## Failure handling: retries and dead letters

Subscribers fail — a third-party API is down, a record is temporarily locked. Transient failures should be retried with backoff; persistent failures should land in a dead-letter stream for inspection, never block the queue or get silently dropped.

\`\`\`python
async def process(msg_id, event, handler, bus):
    for attempt in range(MAX_RETRIES):
        try:
            await handler(event)
            await bus.ack(msg_id)
            return
        except TransientError:
            await asyncio.sleep(backoff(attempt))
    await bus.dead_letter(msg_id, event)  # exhausted retries — quarantine
\`\`\`

The dead-letter stream is your safety net. A poison message that always fails would otherwise either crash the consumer in a loop or get dropped. Dead-lettering lets the rest of the stream keep flowing while a human investigates the one bad event.

## When NOT to go event-driven

Events are a tool, not a religion. Synchronous, inline code is the right choice when the caller genuinely needs the result before continuing — you can't render a checkout confirmation by firing a \`PaymentRequested\` event and hoping. Use events for *reactions and side effects*, not for the core request/response path where the caller needs an answer now.

The honest tradeoff: event-driven systems trade simplicity of *flow* for simplicity of *change*. A synchronous call is easy to read top-to-bottom; an event flow is harder to trace but far easier to extend. Make that trade where extensibility matters and avoid it where straightforward sequencing is all you need.

## Common mistakes

- **Publishing outside the transaction.** Use a transactional outbox so the business write and the event commit atomically.
- **Non-idempotent subscribers.** At-least-once delivery means duplicates happen; dedupe on event id.
- **Modelling commands as events.** Events are past-tense facts; if it tells a subscriber what to do, it's a command.
- **No dead-letter path.** A poison message will either loop forever or get dropped without one.
- **Reaching for Kafka too early.** Start with the simplest durable transport that fits.
- **Eventing the request/response path.** Keep events for side effects, not for results the caller needs immediately.

## Production considerations

- **Ordering.** Most brokers only guarantee ordering within a partition/stream. If two events must be processed in order, route them to the same partition key.
- **Schema evolution.** Version your event payloads and keep handlers tolerant of unknown fields so producers and consumers can deploy independently.
- **Observability.** Trace an event id from publish through every subscriber; track stream lag and dead-letter counts.
- **Replay.** Because events are durable facts, you can replay a stream to rebuild a downstream view or recover a failed subscriber.

## Conclusion

Event-driven architecture isn't a microservices-only luxury. Even in a single Python application, publishing facts instead of calling every downstream effect inline makes signup fast, resilient to a flaky CRM, and trivial to extend. The patterns that make it *reliable* — transactional outbox, idempotent subscribers, retries with dead letters — are the parts worth getting right from the start.

Adopt it where it earns its keep (side effects and reactions), keep it away from the synchronous path that needs an answer now, and grow your transport as your scale actually demands rather than as your ambitions imagine.

## Key takeaways

- Publish past-tense facts; let subscribers decide what to do — that's the decoupling.
- Use a transactional outbox so the business write and the event commit atomically.
- Embrace at-least-once delivery and make every subscriber idempotent.
- Start with the simplest durable transport (often Redis Streams) and grow into a broker.
- Retry transient failures with backoff; dead-letter the persistent ones.
- Keep events for side effects — not for the request/response path that needs a result now.`,
}
