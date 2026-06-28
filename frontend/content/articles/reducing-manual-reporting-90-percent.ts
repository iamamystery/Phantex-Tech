import type { Article } from '../types'

export const reducingManualReporting: Article = {
  slug: 'reducing-manual-reporting-90-percent',
  title: 'How We Reduced Manual Reporting by 90%',
  subtitle:
    'The exact automation pipeline we built for a SaaS client — cutting 6 hours of weekly reporting down to a 20-minute scheduled job.',
  excerpt:
    'The exact automation pipeline we built for a SaaS client — cutting 6 hours of weekly reporting down to a 20-minute scheduled job.',
  author: 'leo-chen',
  category: 'automation',
  tags: ['automation', 'python', 'data-engineering', 'apis'],
  date: '2025-05-20',
  popularity: 84,
  content: `Every week, an analyst at our client spent the better part of a day building the same report. Log into four systems, export four spreadsheets, copy-paste into a master template, reconcile the numbers that never quite matched, build the charts, write a summary, and email it to the leadership team. Six hours, every week, of an expensive person doing work a machine should do.

We replaced it with a scheduled job that runs in twenty minutes with no human involved — a roughly 90% reduction in human time, and a 100% reduction in copy-paste errors. Here is exactly how, because the approach generalizes to almost any recurring manual report.

## Start by mapping the manual process precisely

The temptation is to jump straight to code. Don't. The first thing we do on any automation project is sit with the person doing the work and document every click. Not what they *think* they do — what they *actually* do, including the undocumented fixes.

That session almost always surfaces the parts that aren't written down anywhere:

- "Oh, and if the EU numbers look weird I divide by the exchange rate from this other tab."
- "I always drop the test accounts — you can tell because the email ends in @internal."
- "If the totals don't match I trust the billing system over the CRM."

Those judgment calls are the real specification. Automating the documented process while missing the tribal knowledge produces a report nobody trusts. We write the rules down explicitly, because an automated rule you can point to beats a human habit you can't.

> [!TIP]
> The goal of process mapping is not just to copy the human — it's to find the *decisions* the human makes. Those decisions become explicit, reviewable business rules. That alone often improves the report, because tribal knowledge becomes documented logic.

## The architecture: extract, reconcile, render, deliver

We model reporting automation as four stages, mirroring (and improving on) what the analyst did by hand.

\`\`\`
  Extract ─▶ Reconcile ─▶ Render ─▶ Deliver
  (sources)  (one truth)  (report)  (inbox)
\`\`\`

### Extract: get the data without the spreadsheets

The analyst exported CSVs because that was the interface they had. We go straight to the source: APIs where they exist, the database where we have access, and only as a last resort, automated browser export for systems with no API.

\`\`\`python
async def extract() -> dict[str, list[dict]]:
    billing, crm, product, support = await asyncio.gather(
        billing_api.invoices(period),
        crm_api.accounts(),
        warehouse.query(ACTIVE_USAGE_SQL, period),
        support_api.tickets(period),
    )
    return {"billing": billing, "crm": crm, "product": product, "support": support}
\`\`\`

Fetching all four sources concurrently is a small thing that turns minutes of sequential waiting into seconds. But the bigger win is reliability: an API pull returns the same structure every time, where a manual CSV export is one stray column-reorder away from breaking a paste.

### Reconcile: build one version of the truth

This is the stage that consumed most of the analyst's six hours — the numbers from different systems never matched, and reconciling them was tedious, error-prone manual judgment. We encode those judgment calls as explicit, tested rules.

\`\`\`python
def reconcile(data: dict) -> Report:
    accounts = {a["id"]: a for a in data["crm"] if not is_internal(a["email"])}
    revenue = sum_by_account(data["billing"])

    rows = []
    for account_id, account in accounts.items():
        rows.append(ReportRow(
            account=account["name"],
            # Documented rule: billing is source of truth for revenue.
            mrr=revenue.get(account_id, 0),
            active_users=count_active(data["product"], account_id),
            open_tickets=count_open(data["support"], account_id),
        ))
    return Report(rows=rows, generated_at=now())


def is_internal(email: str) -> bool:
    return email.endswith("@internal.example.com")  # the "drop test accounts" rule
\`\`\`

Every one of those rules — billing wins over CRM, drop internal accounts, how "active" is defined — is now a named function with a test. When leadership asks "why is this number different from last quarter," the answer is in the code, not in someone's memory.

> [!WARNING]
> Reconciliation is where silent automation failures hide. If the billing and CRM systems disagree about which accounts exist, naively trusting one can drop revenue from the report with no error. We emit an explicit *reconciliation report* — accounts present in one system but not the other — so discrepancies surface instead of vanishing.

### Render: generate the artifact

The output has to match what leadership already expects, or adoption fails. We render the same charts and tables the analyst built, programmatically, into a PDF (and a linked dashboard for those who want to drill in).

\`\`\`python
def render(report: Report) -> bytes:
    doc = PdfBuilder(title=f"Weekly Report — {report.period}")
    doc.kpi_row(report.totals())                    # the headline numbers
    doc.chart(report.mrr_by_segment(), kind="bar")
    doc.table(report.top_accounts(limit=20))
    doc.callout(report.reconciliation_warnings())   # surface discrepancies
    return doc.build()
\`\`\`

### Deliver: into the inbox, on schedule

The final stage emails the report to the distribution list on Monday at 7am, before anyone is at their desk. It also drops a copy in shared storage and posts a summary to the team channel.

\`\`\`python
async def deliver(pdf: bytes, report: Report):
    await email.send(
        to=DISTRIBUTION_LIST,
        subject=f"Weekly Report — {report.period}",
        body=report.executive_summary(),   # auto-generated 3-line summary
        attachments=[("weekly-report.pdf", pdf)],
    )
    await storage.put(f"reports/{report.period}.pdf", pdf)
    await slack.post(CHANNEL, report.slack_summary())
\`\`\`

## Scheduling and reliability

The whole pipeline runs on a schedule (a cron-triggered job). But "it runs on a schedule" is not the same as "it reliably produces a report," so we add three guarantees:

- **Idempotency.** Re-running for the same period produces the same report and overwrites cleanly — safe to retry after a failure.
- **Alerting on absence.** A separate check verifies that Monday's report actually landed. The most dangerous failure mode for a scheduled job is silence — it stops running and nobody notices for weeks.
- **A manual trigger.** Leadership can regenerate the report on demand (e.g., after a data correction) without waiting for the next schedule.

\`\`\`python
async def run(period: Period, *, force: bool = False):
    if await storage.exists(f"reports/{period}.pdf") and not force:
        return  # idempotent: already generated
    data = await extract()
    report = reconcile(data)
    pdf = render(report)
    await deliver(pdf, report)
    await heartbeat.ping("weekly-report")  # absence of this ping triggers an alert
\`\`\`

> [!NOTE]
> The heartbeat pattern — pinging a watchdog on success and alerting when the ping *doesn't* arrive — is the single most important reliability feature for any scheduled automation. A job that silently stops is worse than one that loudly crashes, because the crash gets fixed and the silence gets trusted.

## The results, and why they held

- **~6 hours/week → ~20 minutes of compute**, with zero analyst involvement on a normal week.
- **Copy-paste errors eliminated.** The numbers are derived from source systems by tested rules, not transcribed by hand.
- **Faster delivery.** The report lands before the work week starts instead of mid-Tuesday.
- **The analyst was freed** for actual analysis — investigating *why* the numbers moved instead of assembling them.

The reason it stuck, where many automation projects quietly get abandoned, is that we automated the *judgment*, not just the *clicks*. A report that captured the analyst's reconciliation rules earned trust. A naive export-and-paste bot would have produced subtly wrong numbers and been switched off within a month.

## Common mistakes

- **Automating clicks instead of decisions.** Capture the human's judgment calls as explicit rules.
- **Trusting one source blindly.** Emit a reconciliation report so discrepancies surface.
- **No absence alerting.** A scheduled job that silently dies is the most expensive failure mode.
- **Changing the output format.** Match what stakeholders already expect, or adoption fails.
- **Non-idempotent runs.** Make re-running safe so a failure is a retry, not a cleanup project.

## Production considerations

- **Access and secrets.** Each source's credentials are scoped to read-only and stored in a secret manager.
- **Auditability.** Every run archives the raw extracted data alongside the report, so any number can be traced back to its source.
- **Schema drift.** If a source changes its API, validation catches it and the run fails loudly rather than producing a wrong report.
- **Human override.** Keep a manual-trigger path for corrections and one-off reruns.

## Conclusion

Cutting six hours of weekly reporting to a twenty-minute job wasn't about a fancy tool — it was about taking the time to understand what the analyst actually did, encoding their judgment as explicit rules, and wrapping the whole thing in the boring reliability features (idempotency, reconciliation reports, absence alerting) that make automation trustworthy.

The same four-stage shape — extract, reconcile, render, deliver — fits almost any recurring manual report. The hard part is never the code. It's the listening.

## Key takeaways

- Map the real manual process first, including the undocumented judgment calls.
- Go to source systems via APIs; avoid re-creating brittle spreadsheet exports.
- Encode reconciliation logic as explicit, tested rules — and report discrepancies.
- Match the output to what stakeholders already expect.
- Make runs idempotent and add absence alerting via a heartbeat.
- Automate the decisions, not just the clicks — that's what earns lasting trust.`,
}
