import type { Article } from '../types'

export const fastapiPatternsBackendTeams: Article = {
  slug: 'fastapi-patterns-backend-teams',
  title: 'FastAPI Patterns Every Backend Team Should Know',
  subtitle:
    'Dependency injection, background tasks, async database connections — the patterns that separate maintainable FastAPI code from brittle prototypes.',
  excerpt:
    'Dependency injection, background tasks, async database connections — patterns that separate maintainable FastAPI code from brittle prototypes.',
  author: 'zara-malik',
  category: 'backend-engineering',
  tags: ['fastapi', 'python', 'apis', 'postgresql', 'testing'],
  date: '2025-06-05',
  popularity: 92,
  content: `FastAPI makes it dangerously easy to ship a working API in an afternoon. The problem is that the patterns that get you to "working" are rarely the patterns that keep you at "maintainable" six months and three engineers later. This article collects the patterns we reach for on every FastAPI project — the ones that keep a codebase testable, observable, and pleasant to change as it grows.

None of these are exotic. They are the boring decisions that compound.

## Dependency injection is the whole game

FastAPI's dependency injection system is its best feature, and most teams use maybe 10% of it. Used well, it is how you keep request handlers thin, testing trivial, and cross-cutting concerns (auth, database sessions, pagination) in one place instead of copy-pasted everywhere.

The pattern: handlers declare *what they need*, not *how to get it*. A handler that needs the current user declares a dependency on \`get_current_user\` and never thinks about tokens again.

\`\`\`python
from fastapi import Depends, HTTPException, status

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    user = await users.from_token(db, token)
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "invalid token")
    return user


@router.get("/me")
async def read_me(user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(user)
\`\`\`

The handler is now three lines and has zero knowledge of how authentication works. That decoupling is what lets you change auth (add MFA, rotate to a new token format) without touching a single endpoint.

> [!TIP]
> Build dependencies in layers. \`get_db\` yields a session; \`get_current_user\` depends on \`get_db\`; \`require_admin\` depends on \`get_current_user\`. Each layer is small, testable in isolation, and composes into exactly the guarantee an endpoint needs.

### Dependencies make testing trivial

Because dependencies are declared, not imported, you can override them in tests. No mocking libraries, no patching module internals — just tell FastAPI to use a different function.

\`\`\`python
app.dependency_overrides[get_current_user] = lambda: test_user
app.dependency_overrides[get_db] = lambda: test_session
\`\`\`

This single capability is the reason FastAPI codebases that lean on DI are so much easier to test than those that reach for globals. Test a protected endpoint without ever generating a real token.

## Async database sessions, done correctly

The most common source of mysterious FastAPI bugs is mishandled database sessions: a session shared across requests, a connection leaked because an exception skipped cleanup, or a pool exhausted under load. The fix is a session-per-request dependency with guaranteed teardown.

\`\`\`python
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

engine = create_async_engine(DATABASE_URL, pool_size=20, max_overflow=10)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db() -> AsyncIterator[AsyncSession]:
    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
\`\`\`

The \`async with\` guarantees the session is closed even if the handler raises. The commit-on-success / rollback-on-failure pattern means handlers never manage transactions manually — they just do their work and either return (commit) or raise (rollback).

> [!WARNING]
> Never use a single global session. Sessions are not thread-safe or task-safe, and a shared session under concurrent requests produces data corruption that is maddening to reproduce. One session per request, every time.

## Pydantic models as your API contract

FastAPI's integration with Pydantic is its second superpower. Use distinct models for *input*, *output*, and *database* representations. Collapsing them into one model is a tempting shortcut that leaks internal fields and creates security holes.

\`\`\`python
class UserCreate(BaseModel):       # what the client may send
    email: EmailStr
    password: str

class UserOut(BaseModel):          # what the client may see — no password hash!
    id: int
    email: EmailStr
    created_at: datetime
    model_config = {"from_attributes": True}
\`\`\`

Separating these is not ceremony. \`UserCreate\` has a password; \`UserOut\` must never expose the hash. If they were one model, the only thing standing between you and leaking password hashes in an API response would be remembering to exclude a field — and people forget.

## Background tasks vs. real job queues

FastAPI's \`BackgroundTasks\` is perfect for fire-and-forget work that's cheap and non-critical: sending a confirmation email, writing an audit log. It runs *after* the response is sent, so the user isn't blocked.

\`\`\`python
@router.post("/signup")
async def signup(data: UserCreate, tasks: BackgroundTasks, db=Depends(get_db)):
    user = await users.create(db, data)
    tasks.add_task(send_welcome_email, user.email)  # don't block the response
    return UserOut.model_validate(user)
\`\`\`

But know its limits. \`BackgroundTasks\` runs in the same process and dies if the process restarts. For anything that *must* happen — payment processing, data exports, anything retryable — use a real job queue (Celery, Arq, RQ) backed by Redis. The rule of thumb:

- **BackgroundTasks**: cheap, non-critical, OK to lose occasionally.
- **Job queue**: important, retryable, must survive a deploy.

> [!NOTE]
> A surprising number of production incidents trace back to important work running in \`BackgroundTasks\`. The welcome email not arriving is fine. The "charge the customer" task vanishing on a deploy is a very bad day. Match the durability of the mechanism to the importance of the work.

## Structuring a project that grows

A FastAPI app that starts as one \`main.py\` and stays that way becomes unworkable around the time the third developer joins. We organize by feature, not by layer, so everything about "users" lives together:

\`\`\`
app/
  core/          # config, security, shared deps
  users/
    router.py    # endpoints
    schemas.py   # pydantic models
    service.py   # business logic
    models.py    # ORM models
  orders/
    router.py
    ...
  main.py        # wires routers together
\`\`\`

The key discipline: **routers call services; services contain the business logic.** Handlers should orchestrate, not implement. When a handler grows past a dozen lines, the business logic wants to move into a service function that can be tested without a HTTP layer at all.

## Error handling that clients can rely on

Clients need predictable, machine-readable errors. We register a small set of exception handlers that turn domain exceptions into consistent JSON, so the same kind of failure always looks the same to the client.

\`\`\`python
class DomainError(Exception):
    status_code = 400
    code = "domain_error"

@app.exception_handler(DomainError)
async def handle_domain_error(request, exc: DomainError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": exc.code, "message": str(exc)}},
    )
\`\`\`

Now a service can \`raise OrderNotFound()\` and trust it becomes a clean \`404\` with a stable error code — no \`HTTPException\` plumbing scattered through business logic.

## Common mistakes

- **One Pydantic model for everything.** Leaks internal fields; separate input/output/DB models.
- **Global database session.** Use one session per request via a dependency.
- **Business logic in route handlers.** Push it into services so it's testable without HTTP.
- **Critical work in BackgroundTasks.** Use a durable job queue for anything that must not be lost.
- **Blocking calls in async handlers.** A synchronous \`requests.get\` or a CPU-bound loop blocks the event loop and tanks throughput. Use async clients, or offload to a thread pool with \`run_in_executor\`.
- **No response_model.** Declaring \`response_model\` enforces the output contract and strips unexpected fields automatically.

## Production considerations

- **Connection pool sizing.** Match \`pool_size\` to your worker count and database limits. Too small starves requests; too large overwhelms the database.
- **Health checks.** A \`/health\` endpoint that actually pings the database catches problems load balancers can route around.
- **Observability.** Add request IDs via middleware and log them everywhere; correlate a slow request across services.
- **Graceful shutdown.** Handle SIGTERM so in-flight requests finish before the process exits during a deploy.

## Conclusion

FastAPI rewards teams that lean into its design instead of fighting it. Dependency injection keeps handlers thin and tests trivial. Session-per-request keeps your database safe under load. Distinct Pydantic models keep your contract honest. And knowing when to reach past \`BackgroundTasks\` for a real queue keeps important work from vanishing on a deploy.

These patterns won't make a demo any flashier. They are what make the difference between an API that's a joy to extend in year two and one everyone is afraid to touch.

## Key takeaways

- Lean hard on dependency injection — it's the key to thin handlers and trivial tests.
- One database session per request, with commit-on-success and rollback-on-error.
- Use separate Pydantic models for input, output, and persistence.
- Match durability to importance: BackgroundTasks for trivial work, a job queue for critical work.
- Keep business logic in services, not in route handlers.
- Organize by feature, and register consistent exception handlers for predictable errors.`,
}
