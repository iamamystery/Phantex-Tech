import type { Article } from '../types'

export const automatingBrowserWorkflowsPlaywright: Article = {
  slug: 'automating-browser-workflows-playwright',
  title: 'Automating Browser Workflows with Playwright',
  subtitle:
    "Playwright's capabilities go far beyond testing. We use it for production automation handling login sessions, data extraction, and form submissions.",
  excerpt:
    'Playwright capabilities go far beyond testing. We use it for production automation handling login sessions, data extraction, and form submissions.',
  author: 'leo-chen',
  category: 'automation',
  tags: ['playwright', 'automation', 'python', 'web-scraping', 'docker'],
  date: '2025-04-30',
  popularity: 82,
  content: `Playwright is marketed as a browser testing tool, and it's a great one. But the same capabilities that make it excellent for tests — reliable waits, multi-browser support, network interception, persistent sessions — make it a superb engine for *production automation*. When a business process lives behind a web UI with no API, Playwright is how you turn that UI into something programmable.

This article is about using Playwright for real automation work: logging into systems, navigating multi-step workflows, submitting forms, and extracting data, reliably enough to run unattended.

## Why Playwright over the alternatives

For automation that has to run unattended and not wake you up at night, Playwright's defaults matter:

- **Auto-waiting.** Playwright waits for elements to be actionable (visible, enabled, stable) before interacting. This eliminates the single largest source of flakiness in browser automation — acting on an element that isn't ready yet.
- **One API, three engines.** Chromium, Firefox, and WebKit through the same code. Some targets behave differently per browser; you can switch with a parameter.
- **First-class network control.** Intercept, mock, and inspect requests — invaluable for skipping heavy resources or grabbing data straight from an XHR response.
- **Persistent contexts.** Save and reuse authentication state so you log in once, not on every run.

\`\`\`python
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        await page.goto("https://app.example.com")
        # Auto-waiting: no explicit sleep needed before clicking.
        await page.click("text=Sign in")
\`\`\`

## Locators: the foundation of reliable automation

The biggest determinant of whether your automation survives a UI redesign is *how you find elements*. Brittle selectors (deep CSS paths, auto-generated class names) break the moment a designer touches the page. Playwright's locators encourage resilient, human-meaningful selection.

\`\`\`python
# Fragile — breaks when markup or styling changes:
await page.click("div.css-1x7q > button:nth-child(3)")

# Resilient — anchored to what the user actually sees / accessibility:
await page.get_by_role("button", name="Submit order").click()
await page.get_by_label("Email address").fill("user@example.com")
\`\`\`

> [!TIP]
> Prefer role-, label-, and text-based locators over CSS/XPath. They're more readable, more stable across redesigns, and they double as an accessibility check — if Playwright can't find a button by its accessible name, neither can a screen reader. Reach for a \`data-testid\` only when the team controls the target's markup.

## Session management: log in once, reuse everywhere

Logging in on every run is slow, fragile, and a great way to trip rate limits or fraud detection. Playwright lets you save authenticated state to a file and reuse it, so automation starts already logged in.

\`\`\`python
# One-time (or periodic) login that persists the session:
async def save_login():
    context = await browser.new_context()
    page = await context.new_page()
    await page.goto("https://app.example.com/login")
    await page.get_by_label("Email").fill(USERNAME)
    await page.get_by_label("Password").fill(PASSWORD)
    await page.get_by_role("button", name="Log in").click()
    await page.wait_for_url("**/dashboard")
    await context.storage_state(path="auth.json")   # persist cookies + storage

# Every subsequent run reuses it:
context = await browser.new_context(storage_state="auth.json")
\`\`\`

> [!WARNING]
> Stored session state contains live credentials — treat \`auth.json\` exactly like a password. Encrypt it at rest, keep it out of version control, and refresh it before it expires. Build in a fallback that detects an expired session (e.g., being redirected to the login page) and re-authenticates automatically, or your automation silently starts failing the day the cookie lapses.

## Network interception: the automation superpower

Often the data you want is already arriving in a clean JSON response that the page renders into messy HTML. Instead of scraping the rendered DOM, intercept the network response and take the structured data directly. It's faster, more reliable, and immune to layout changes.

\`\`\`python
async def capture_api_data(page):
    captured = []

    async def handle(response):
        if "/api/orders" in response.url and response.status == 200:
            captured.append(await response.json())

    page.on("response", handle)
    await page.goto("https://app.example.com/orders")
    await page.wait_for_load_state("networkidle")
    return captured
\`\`\`

You can also intercept *requests* to block heavy resources — images, fonts, analytics — cutting bandwidth and speeding up runs when you only need the data.

\`\`\`python
await page.route(
    "**/*.{png,jpg,jpeg,woff2}",
    lambda route: route.abort(),
)
\`\`\`

## Building a robust workflow

Real workflows are multi-step: navigate, fill, submit, verify, extract. The discipline that makes them reliable is **verifying each step succeeded** rather than blindly charging ahead. Auto-waiting handles timing; explicit assertions handle correctness.

\`\`\`python
async def submit_expense(page, expense: Expense):
    await page.get_by_role("link", name="New expense").click()
    await page.get_by_label("Amount").fill(str(expense.amount))
    await page.get_by_label("Category").select_option(expense.category)
    await page.get_by_role("button", name="Save").click()

    # Verify the workflow actually succeeded before reporting success.
    await page.get_by_text("Expense saved").wait_for(timeout=10_000)
    return await page.get_by_test_id("expense-id").inner_text()
\`\`\`

That final verification is the difference between automation that *runs* and automation you can *trust*. Without it, a workflow that silently failed on step three will happily report success and you'll discover the missing data weeks later.

## Running it in production

Local scripts and production automation are different beasts. For unattended runs:

- **Containerize it.** Use the official Playwright image, which ships the browsers and all their system dependencies. This eliminates "works on my machine" entirely.
- **Schedule and queue.** Trigger workflows on a schedule or from a queue, and run them as stateless jobs so a crash is a retry, not a catastrophe.
- **Capture evidence on failure.** On any error, save a screenshot, the full page HTML, and a trace. When a run fails at 3am, this is what lets you diagnose it at 9am without reproducing it.

\`\`\`python
try:
    await submit_expense(page, expense)
except Exception:
    await page.screenshot(path=f"failures/{run_id}.png", full_page=True)
    await context.tracing.stop(path=f"failures/{run_id}.zip")
    raise
\`\`\`

> [!NOTE]
> Playwright's tracing is the best debugging feature in browser automation. A trace captures a full timeline — DOM snapshots, network, console, screenshots — for every action. Open it in the Playwright trace viewer and you can scrub through exactly what the browser saw at the moment of failure. Always enable it for production runs.

## Idempotency and safety

Automation that *changes* data (submitting forms, placing orders) is far riskier than automation that only reads. Two safeguards are non-negotiable:

- **Check before you act.** Before creating a record, check whether it already exists. A retried run must not submit the same expense twice.
- **Dry-run mode.** A flag that walks the entire workflow and verifies every element is present without clicking the final submit. Run it after every target UI change to catch breakage before it does damage.

## Common mistakes

- **Fragile CSS/XPath selectors.** Use role/label/text locators that survive redesigns.
- **Manual sleeps.** Rely on auto-waiting and explicit assertions, not \`time.sleep\`.
- **Logging in every run.** Persist and reuse session state; auto-refresh when it expires.
- **Scraping the DOM when the API response is right there.** Intercept the network instead.
- **No success verification.** Assert each step worked, or you'll trust silent failures.
- **No failure evidence.** Capture screenshots and traces, or every 3am failure is unreproducible.

## Production considerations

- **Resource limits.** Browsers are memory-hungry; cap concurrency and recycle contexts between jobs.
- **Credential hygiene.** Login secrets and session state live in a secret manager, encrypted at rest.
- **Target fragility.** Build a dry-run health check that alerts when the target UI changes before it breaks a real run.
- **Legality and terms.** Automating a third-party UI may be restricted by its terms of service — confirm you're authorized, and prefer an official API when one exists.

## Conclusion

Playwright is far more than a test runner — it's a production-grade engine for automating any process that lives behind a web UI. Its auto-waiting kills flakiness, its locators survive redesigns, its network interception often beats DOM scraping, and its session persistence makes unattended runs practical. Wrap all of that in containerized, queued, evidence-capturing jobs with proper idempotency, and you get automation reliable enough to bet a business process on.

## Key takeaways

- Playwright's auto-waiting and locators make it the most reliable browser-automation engine.
- Prefer role/label/text locators over brittle CSS or XPath.
- Persist and reuse authenticated session state; auto-refresh on expiry.
- Intercept network responses to get clean data and block heavy resources.
- Verify every workflow step; never trust a silent success.
- Run containerized, queued jobs and capture screenshots + traces on failure.`,
}
