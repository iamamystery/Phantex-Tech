import type { Article } from '../types'

export const supabaseArchitectureSaas: Article = {
  slug: 'supabase-architecture-saas',
  title: 'Supabase Architecture for SaaS Products',
  subtitle:
    'Row-level security, realtime subscriptions, edge functions — how we use Supabase as a production backend for products that need to move fast.',
  excerpt:
    'Row-level security, realtime subscriptions, edge functions — how we use Supabase as a production backend for products that need to move fast.',
  author: 'amir-karimi',
  category: 'infrastructure',
  tags: ['supabase', 'postgresql', 'infrastructure', 'apis'],
  date: '2025-05-08',
  popularity: 80,
  content: `Supabase gets pitched as "the open-source Firebase," which undersells the part that actually matters: underneath the auth, realtime, and storage features is plain PostgreSQL. That means you get a managed backend that ships features fast *and* a real relational database you won't outgrow. Used carelessly, though, Supabase will happily let you build something insecure or unscalable very quickly.

This article covers how we architect Supabase for production SaaS — the patterns that let a small team move fast without the foot-guns.

## The mental model: it's Postgres, with services around it

The most important thing to internalize is that Supabase *is* Postgres. Your data lives in normal tables, your constraints are real constraints, and your queries are real SQL. The Supabase services — Auth, Realtime, Storage, Edge Functions, the auto-generated REST and GraphQL APIs — are layers *around* that database.

This reframing changes how you design. You don't design "for Supabase"; you design a good relational schema and then decide which Supabase services expose it. Everything good about Supabase architecture flows from taking the database seriously.

## Row-Level Security is not optional

Supabase exposes your tables directly to the client through its auto-generated API. That is the feature *and* the danger: without protection, anyone with your public anon key could read every row in every table. The protection is PostgreSQL **Row-Level Security (RLS)**, and on Supabase it is the single most important thing to get right.

RLS lets the database itself decide which rows each user may see or change. The policy lives next to the data, so it applies no matter how the data is accessed — REST API, GraphQL, or a direct query.

\`\`\`sql
-- Enable RLS — without this, the table is wide open.
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can only read their own projects.
CREATE POLICY "read own projects"
  ON projects FOR SELECT
  USING (auth.uid() = owner_id);

-- Users can only insert projects they own.
CREATE POLICY "insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
\`\`\`

> [!WARNING]
> The most common — and most dangerous — Supabase mistake is shipping a table with RLS disabled, or enabling RLS but forgetting to write policies (which denies everyone, so you "fix" it by disabling RLS again). Treat "RLS enabled with explicit policies on every table" as a release gate. A single unprotected table is a full data breach.

### Multi-tenancy with RLS

For B2B SaaS, the unit of isolation is usually a tenant/organization, not an individual user. Model membership explicitly and write policies against it. This keeps tenant isolation in the database where it can't be bypassed by an application bug.

\`\`\`sql
CREATE POLICY "members read org data"
  ON documents FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM memberships WHERE user_id = auth.uid()
    )
  );
\`\`\`

> [!TIP]
> Wrap the membership lookup in a \`SECURITY DEFINER\` SQL function and call it from your policies. It centralizes the tenancy rule in one place, keeps policies readable, and lets PostgreSQL cache the plan. When the rule changes, you change one function instead of every policy.

## Auth: let Supabase handle it, then extend it

Supabase Auth handles the genuinely hard, easy-to-get-wrong parts — password hashing, email verification, OAuth providers, JWT issuance, session refresh. Don't rebuild those. Where you *do* invest is connecting auth identities to your domain model.

The pattern we use everywhere: a trigger that creates a \`profiles\` row whenever a new auth user is created, so your application always has a domain record to hang data off.

\`\`\`sql
CREATE FUNCTION handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
\`\`\`

This keeps the auth system as the source of identity while your \`profiles\` table is the source of *application* truth — roles, preferences, tenant membership — that you fully control.

## Realtime, used deliberately

Supabase Realtime can stream database changes to clients over websockets. It's genuinely useful for collaborative features, live dashboards, and notifications. It's also easy to over-use into a performance problem, because every subscribed client gets every matching change.

\`\`\`ts
const channel = supabase
  .channel('room-42')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages', filter: 'room_id=eq.42' },
    (payload) => appendMessage(payload.new)
  )
  .subscribe()
\`\`\`

The discipline: subscribe narrowly (always filter), and only to data that genuinely benefits from being live. A dashboard that updates once a minute does not need realtime — a periodic refetch is simpler and cheaper. Reserve websockets for things where staleness is actually visible to the user, like chat or presence.

> [!NOTE]
> Realtime respects RLS, but only if you've configured it to. Changes are filtered through the same policies as queries — which is exactly what you want — but it means a missing policy can silently break a subscription. Test realtime under a real, non-admin user, not with the service role.

## Edge Functions for the logic that shouldn't live in the client

The auto-generated API is great for CRUD, but some logic must run on a trusted server: handling Stripe webhooks, calling third-party APIs with secret keys, or any operation where the client cannot be trusted to enforce the rules. That's what Edge Functions are for.

\`\`\`ts
// supabase/functions/stripe-webhook/index.ts
Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature')!
  const event = stripe.webhooks.constructEvent(await req.text(), sig, SECRET)
  if (event.type === 'checkout.session.completed') {
    await markSubscriptionActive(event.data.object)  // uses service role
  }
  return new Response('ok')
})
\`\`\`

The rule of thumb for where logic lives:

- **Client + RLS** — straightforward CRUD scoped to the user's own data.
- **Database functions/triggers** — invariants that must always hold (like the profile-creation trigger).
- **Edge Functions** — anything needing secrets, third-party calls, or trust the client can't be given.

## The service role: handle with extreme care

Supabase issues a **service role key** that *bypasses RLS entirely*. It's necessary for trusted server-side operations (Edge Functions, admin tasks), and it is the most dangerous credential in your system.

> [!WARNING]
> The service role key must NEVER reach the client — not in frontend code, not in a public environment variable, not in a mobile app bundle. It bypasses every security policy you wrote. It lives only in server-side environments (Edge Functions, your backend) and in a secret manager. Leaking it is equivalent to publishing your entire database.

## Migrations and environments: treat it like real Postgres

Because it's Postgres, you get real migrations — use them. Click-ops in the Supabase dashboard is fine for prototyping but becomes unrepeatable chaos in a team. We keep schema, policies, and functions in version-controlled migration files and apply them through CI.

\`\`\`bash
supabase migration new add_projects_rls
# edit the generated SQL file (table, RLS enable, policies)
supabase db push          # apply to a branch/staging project
\`\`\`

Maintain separate Supabase projects for development, staging, and production, and promote schema changes through them via migrations. RLS policies are part of your schema and must be migrated like everything else — an unprotected staging table has a way of becoming an unprotected production table.

## Common mistakes

- **RLS disabled or policy-less.** The number-one cause of Supabase data leaks. Gate releases on it.
- **Service role key in the client.** Catastrophic; it bypasses all security.
- **Over-using realtime.** Subscribe narrowly and only where live data is actually needed.
- **Click-ops schema changes.** Use version-controlled migrations like any real database.
- **Putting trusted logic in the client.** Secrets and webhooks belong in Edge Functions.
- **Skipping indexes.** It's still Postgres — your RLS policies and queries need supporting indexes to stay fast at scale.

## Production considerations

- **Connection pooling.** Use Supabase's pooler (PgBouncer) for serverless/edge workloads that open many short-lived connections, or you'll exhaust the connection limit.
- **Performance.** RLS policies run on every query; make sure the columns they filter on (\`owner_id\`, \`org_id\`) are indexed.
- **Backups and PITR.** Enable point-in-time recovery for production; it's a real database with real data to protect.
- **Cost at scale.** Realtime connections, storage egress, and Edge Function invocations all meter — monitor them as you grow.

## Conclusion

Supabase lets a small team ship a production SaaS backend remarkably fast, but the speed comes with a sharp edge: it exposes your database directly, so security has to live *in* the database. Get RLS right on every table, keep the service role key server-side, use realtime and edge functions deliberately, and treat the whole thing like the real PostgreSQL it is — migrations, indexes, environments and all.

Do that, and you get the best of both worlds: the velocity of a managed backend and the durability of a relational database you won't have to escape from later.

## Key takeaways

- Supabase is PostgreSQL with services around it — design a good schema first.
- Enable RLS with explicit policies on every table; make it a release gate.
- Model multi-tenancy in the database via membership-based policies.
- Never let the service role key reach the client.
- Use realtime narrowly and edge functions for anything needing secrets or trust.
- Manage schema and policies with version-controlled migrations across real environments.`,
}
