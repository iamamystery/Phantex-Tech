import type { Article } from '../types'

export const aiSystemsArchitecture: Article = {
  slug: 'ai-systems-architecture',
  title: 'AI Systems Architecture',
  subtitle:
    'Designing multi-agent systems, memory layers, and tool-use patterns that work reliably in production environments with real user traffic.',
  excerpt:
    'Designing multi-agent systems, memory layers, and tool-use patterns that work reliably in production environments with real user traffic.',
  author: 'priya-nair',
  category: 'ai-systems',
  tags: ['ai-agents', 'llms', 'rag', 'infrastructure', 'python'],
  date: '2025-06-09',
  editorsPick: true,
  popularity: 96,
  content: `There's a vast gap between an AI feature that demos well and an AI *system* that holds up under real traffic. The demo needs one good prompt and a happy path. The system needs memory that doesn't balloon, tools that fail safely, retrieval that stays grounded, evaluation that catches regressions, and cost that doesn't spiral. Architecture is what closes that gap.

This article lays out how we think about AI systems architecture: the components, how they fit together, and the patterns that keep generative systems predictable when real users are pushing on them.

## The layers of a production AI system

A robust AI system is not "a call to a model." It's a small architecture with distinct layers, each with one job. Drawing the boundaries clearly is what makes the system debuggable and changeable.

\`\`\`
   ┌──────────────────────────────────────────────┐
   │  Orchestration   (control flow, step budget)   │
   ├──────────────────────────────────────────────┤
   │  Reasoning       (the LLM call + prompts)       │
   ├──────────────────────────────────────────────┤
   │  Memory          (short-term + long-term)       │
   ├──────────────────────────────────────────────┤
   │  Retrieval       (RAG over your knowledge)      │
   ├──────────────────────────────────────────────┤
   │  Tools           (typed, guarded actions)       │
   ├──────────────────────────────────────────────┤
   │  Evaluation + Observability (always-on)         │
   └──────────────────────────────────────────────┘
\`\`\`

The model is just one layer. Most of the engineering — and most of the reliability — lives in the layers around it.

## Orchestration: control flow you own

The orchestration layer decides *what happens when*: which step runs next, when to stop, when to retry, when to escalate. The critical design choice is how much control you hand to the model.

A pure "agent decides everything" loop is flexible but unpredictable and expensive. A fully scripted workflow is predictable but rigid. In practice we use **constrained orchestration**: the model chooses among a bounded set of next steps, within a hard step budget, with deterministic guardrails around it.

\`\`\`python
async def orchestrate(goal: Goal, *, max_steps: int = 8) -> Result:
    state = State(goal=goal)
    for _ in range(max_steps):                       # hard budget bounds cost + loops
        decision = await reason(state)
        if decision.kind == "final":
            return decision.result
        if decision.kind == "tool":
            state.observe(await call_tool(decision.tool, decision.args))
        if should_escalate(state):
            return escalate(state)
    return escalate(state)                            # budget exhausted → human
\`\`\`

> [!TIP]
> The step budget is the most important reliability primitive in any agentic system. It caps cost, prevents infinite loops, and forces a decision (resolve or escalate) within bounded time. Choose the smallest budget that solves your real tasks — and route simple tasks to deterministic handlers that don't enter the loop at all.

## Memory: short-term and long-term are different problems

"Give the agent memory" is two distinct engineering problems that people conflate:

- **Short-term (working) memory** — the current conversation/task context. Bounded by the model's context window, so the real challenge is *what to keep*. Naively appending everything blows the window and the budget.
- **Long-term memory** — durable knowledge that persists across sessions (user preferences, past interactions, learned facts). Stored externally and *retrieved* when relevant, not carried in context.

\`\`\`python
def build_context(state: State, mem: Memory) -> list[Message]:
    msgs = [system_prompt(state.goal)]
    msgs += mem.relevant_long_term(state.goal, k=4)   # retrieved, not always-on
    msgs += summarize_if_needed(state.history)         # compress old turns
    msgs += state.recent_turns(n=6)                    # keep recent verbatim
    return msgs
\`\`\`

The key technique for short-term memory is **summarization under pressure**: when the conversation grows past a threshold, compress older turns into a summary and keep only recent turns verbatim. This keeps the most relevant detail sharp while preventing unbounded context growth.

> [!WARNING]
> Don't treat the context window as free storage. Stuffing it with everything "just in case" degrades quality (the model attends worse over very long contexts), inflates cost (you pay per token every call), and slows responses. Curate context deliberately — relevance beats volume.

## Retrieval: grounding the system in truth

For any system that answers questions about *your* domain, retrieval (RAG) is non-negotiable — it's what keeps answers grounded in your actual knowledge instead of the model's training data. The architecture decisions that matter:

- **Chunking strategy.** Split documents along semantic boundaries (sections, paragraphs), not arbitrary character counts, so each chunk is a coherent unit.
- **A relevance floor.** Discard weak matches. Retrieving nothing and saying "I don't know" beats retrieving loosely-related text that invites hallucination.
- **Hybrid retrieval.** Combine semantic (vector) search with keyword search; each catches what the other misses (exact terms, names, codes vs. paraphrased concepts).

\`\`\`python
async def retrieve(query: str, k: int = 6) -> list[Chunk]:
    semantic = await vector_store.search(await embed(query), k=k)
    keyword = await text_store.search(query, k=k)
    merged = rerank(dedupe(semantic + keyword), query)
    return [c for c in merged if c.score >= RELEVANCE_FLOOR][:k]
\`\`\`

## Tools: where the system acts on the world

Tools are how an AI system *does* things rather than just talking. Every tool is a typed function with validation and guardrails enforced in code. The model proposes a tool call; your code decides whether to honour it.

\`\`\`python
@tool(schema=CreateTicketArgs)
async def create_ticket(args: CreateTicketArgs, ctx: Context) -> dict:
    # Authorization and limits enforced here, never in the prompt.
    if not ctx.user.can_create_tickets:
        return {"error": "not authorized"}
    ticket = await tickets.create(args, owner=ctx.user.id)
    return {"id": ticket.id, "status": ticket.status}
\`\`\`

Two rules govern tool design. First, **many small, narrowly-scoped tools** beat one giant do-everything tool — they're easier to validate, easier for the model to use correctly, and limit blast radius. Second, **treat the model as an untrusted caller**: validate every argument and enforce every permission in code, because a user can influence what the model requests.

## Evaluation and observability: always on

The defining property of a *production* AI system, versus a prototype, is that it's measured continuously. Generative systems are non-deterministic; without evaluation you have no idea whether a prompt change improved things or broke them.

- **Offline evals.** A suite of cases with known-good outcomes that runs on every change — your regression net. Every production failure becomes a new case.
- **Online observability.** Log every interaction: inputs, retrieved context, tool calls, the model's output, latency, and cost. Trace a single request through all layers.
- **Quality signals.** Track refusal rates, escalation rates, tool-error rates, and (where possible) user feedback to catch drift before users complain.

\`\`\`python
async def run_evals(suite: list[EvalCase]) -> Report:
    results = [score(await system.run(c.input), c) for c in suite]
    return Report(
        pass_rate=mean(r.passed for r in results),
        regressions=[r for r in results if r.regressed],
    )
\`\`\`

> [!NOTE]
> "It feels better" is not an evaluation. The teams that ship reliable AI are the ones that turned quality into numbers — pass rates on a real eval suite, tracked over time. Without that, every prompt tweak is a coin flip and every regression is discovered by a user.

## Multi-agent: powerful, and usually premature

Multi-agent architectures — a planner delegating to specialist sub-agents — are genuinely useful for complex, decomposable tasks. They're also more expensive, slower, and harder to debug than a single well-designed agent. Reach for them only when a single agent provably can't handle the task's breadth.

When you do go multi-agent, keep the boundaries clean: each agent has a narrow responsibility and a typed interface, and a coordinator owns the overall flow and budget. The same principles (constrained orchestration, guarded tools, evaluation) apply at every level.

## Cost and latency as architecture

In an AI system, cost and latency aren't afterthoughts — they shape the design:

- **Route by difficulty.** Send easy requests to a small/cheap model or a deterministic handler; reserve the large model for genuinely hard ones.
- **Cache aggressively.** Cache embeddings, retrieval results, and even responses for repeated queries.
- **Stream output.** Streaming tokens to the user dramatically improves *perceived* latency even when total time is unchanged.
- **Parallelize independent work.** Run independent tool calls and retrievals concurrently.

## Common mistakes

- **Treating the model as the whole system.** The reliability lives in the layers around it.
- **Unbounded loops and context.** Always enforce a step budget and curate context.
- **Guardrails in prompts.** Enforce permissions and limits in code; the prompt is persuadable.
- **No relevance floor.** Forcing answers from weak retrieval causes hallucinations.
- **No evaluation suite.** Without numbers, every change is a gamble.
- **Multi-agent too early.** Exhaust a single well-designed agent first.

## Production considerations

- **Graceful degradation.** When the model provider has an outage, fall back to deterministic paths and human escalation rather than failing hard.
- **Versioning.** Version prompts, retrieval indexes, and tool schemas so you can roll back a regression precisely.
- **Privacy and safety.** Scope every tool and retrieval to the authenticated user; add content safety checks on inputs and outputs.
- **Reproducibility.** Log enough (inputs, context, model version, params) to replay any production interaction during debugging.

## Conclusion

A production AI system is an architecture, not a prompt. Orchestration you control, memory split into short- and long-term, retrieval that stays grounded, tools that fail safely, and evaluation that's always running — these layers are where reliability comes from. The model is one component among them.

Get the architecture right and the model becomes interchangeable: you can swap in a better one, route between several, or fall back when one is down, all without disturbing the system that makes the whole thing trustworthy.

## Key takeaways

- Design AI as layered architecture; the model is one layer, not the system.
- Use constrained orchestration with a hard step budget to bound cost and loops.
- Separate short-term (curated, summarized) from long-term (retrieved) memory.
- Ground answers with hybrid retrieval and a relevance floor.
- Make tools small, typed, and guarded in code; treat the model as untrusted.
- Run an always-on evaluation suite — turn quality into tracked numbers.`,
}
