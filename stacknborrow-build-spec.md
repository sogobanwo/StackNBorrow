# StackNBorrow — Build Spec

**Project name:** StackNBorrow
**Tagline:** Stack stocks. Borrow against them. Never sell.
**One-line pitch:** Automate recurring stock buys on Solana, then borrow against your position instead of selling when you need cash — without a custom smart contract, built entirely on Jupiter's existing infrastructure.

**Deadline:** Submissions close Friday 18 September, 4:00pm ET.

---

## 1. Product scope

### Core user story
> As an investor, I want to automatically buy a fixed amount of a tokenized stock on a regular schedule, and if I ever need liquidity, borrow against what I've accumulated instead of selling and breaking my investing streak.

### Three screens, three jobs

| Screen | Job | Primary Jupiter API |
|---|---|---|
| `/setup` | Create a recurring buy order | Recurring API |
| `/portfolio` | Show accumulated position + order history | Recurring API + Price API + wallet RPC |
| `/borrow` | Deposit xStock as collateral, borrow USDC | Lend API |

### Explicit non-goals (do not build)
- No custom Solana program / Anchor contract of any kind
- No custom scheduler, cron job, or keeper — Jupiter Recurring executes on-chain natively
- No custom lending pool, oracle, or liquidation logic — use Jupiter Lend as-is
- No multi-collateral, no repayment automation, no auto-pause-DCA-when-borrowed logic
- No KYC/fiat on-ramp — assume user already has USDC in their wallet
- No mobile app — responsive web is enough

---

## 2. Tech stack

- **Single app, Next.js only — no separate backend framework.** This project is Next.js (App Router) end to end: frontend pages + Route Handlers (`app/api/.../route.ts`) for anything that needs to run server-side. **Do not scaffold a separate NestJS (or Express, Fastify, etc.) service.** There is no requirement here — no complex multi-domain business logic, no background job/queue system, no WebSocket gateways, no large team enforcing architectural layering — that a second backend framework would justify. Adding one would mean a second codebase, a second deploy target, and CORS/auth to wire between two apps, for workload that a handful of Next.js route handlers already cover.
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Auth / Wallet:** **Privy** (`@privy-io/react-auth` + Solana connector) — provides two sign-in paths in one provider: (a) email/Google login, where Privy creates and custodies an embedded Solana wallet via MPC, and (b) connect an existing external wallet (Phantom, Solflare, etc.). Both paths must produce a usable signer for the same transaction flows (Recurring order creation, Swap, Lend deposit/borrow) — use Privy's unified hooks rather than branching signing logic per auth type.
- **"Backend" = Next.js Route Handlers, nothing more:** used only to (a) hold the Jupiter API key server-side so it's never exposed in the client bundle, (b) proxy/aggregate Jupiter API calls (Recurring, Swap, Lend, Price), and (c) optionally shape/cache responses for the UI. No database required for MVP — Jupiter's APIs are the source of truth for order/position state. If a persistence layer is ever needed (e.g. caching streak history), reach for a Route Handler + Supabase/SQLite call, not a new service.
- **Network:** Solana **mainnet-beta** — this only works on mainnet since xStocks and Jupiter Lend pools are real, not devnet-deployed. Use small real amounts ($1–5) for testing/demo.
- **RPC:** Use a dedicated RPC provider (Helius, Triton, or QuickNode free tier) rather than the public Solana RPC — public RPC will rate-limit you during a live demo.
- **Deployment:** single Vercel deployment for the whole app (frontend + Route Handlers together) — no separate backend deploy/hosting to manage.

---

## 3. Coding conventions (non-negotiable)

- **TypeScript everywhere, fully typed — no `any`.** Every function parameter, return type, component prop, and API response shape must have an explicit type or interface. If a Jupiter API response shape is unknown ahead of time, define an interface for it based on the actual response (fetch it, inspect it, type it) rather than typing it as `any` or leaving it implicit.
- **One component per file, no matter how small.** Every component — including trivial ones like a single button or badge — gets its own file. Do not inline small components inside a parent component's file "to save time."
- **Comments: minimal, and never more than one line.** No block comments, no multi-line explanations, no commented-out code left in. A comment should only exist where the code genuinely isn't self-explanatory, and even then it's a single line.
- **No gradient colors anywhere in the UI.** Solid colors only — buttons, backgrounds, cards, indicators (including the LTV/health bar), etc. This applies across the whole app.

---

## 4. Pre-build checklist (do this before writing any UI code)

1. **Get a Jupiter API key** at `developers.jup.ag/portal`. A single key covers Swap, Recurring, Lend, and Price APIs.
2. **Get a Privy App ID** at `dashboard.privy.io` and configure it for Solana + email/Google login + external wallet connection (Phantom, Solflare at minimum). Confirm Privy's Solana embedded wallet produces a signer compatible with the transaction flows in Section 5 before building UI around it.
3. **Confirm the demo ticker(s)** by checking availability across all three products:
   - Recurring API: confirm the token pair (USDC → xStock) is supported for recurring orders
   - Swap API: confirm liquidity/routing exists (should be fine if Recurring supports it)
   - Lend API: confirm the xStock is listed as a **collateral asset** — this list is narrower than the full xStocks lineup. As of recent reporting, SPYx, QQQx, NVDAx, and TSLAx were confirmed Lend collateral assets — verify current state via the Lend API's markets/collateral list endpoint before committing.
   - **Pick 1 primary ticker for the demo** (recommend NVDAx or SPYx — most liquid) and build the whole flow around it first. Add more tickers only if time allows.
4. **Get devnet SOL / mainnet USDC** into a test wallet for building — since this is mainnet-only, budget a small amount of real USDC (~$20–30) for testing the full flow (order creation, swap execution, lend deposit, borrow) multiple times. For embedded wallets, remember these start at zero balance — you'll need to fund the Privy-generated address directly.
5. **Read the actual current docs** before coding against them (API shapes below are directionally correct but verify exact field names/endpoints, since Jupiter's API surface evolves):
   - `https://developers.jup.ag/docs/recurring-api`
   - `https://developers.jup.ag/docs/swap-api`
   - Jupiter Lend API docs (linked from `developers.jup.ag`)
   - `https://developers.jup.ag/docs/price-api`
   - Privy Solana docs (linked from `docs.privy.io`) — confirm current recommended pattern for extracting a signer from an embedded wallet for `@solana/web3.js` transactions

---

## 5. API integration spec

> **Important:** exact endpoint paths, field names, and request/response shapes below are based on Jupiter's documented product structure as of research done for this project, but Jupiter's APIs change — Claude Code should fetch and confirm the live docs at the URLs above before finalizing request/response handling, rather than trusting these shapes blindly.

### 5.1 Recurring API (DCA orders)

**Purpose:** Create an on-chain order that automatically swaps USDC → xStock on a fixed schedule. This replaces any custom scheduler.

**Flow:**
1. Frontend collects: `inputMint` (USDC), `outputMint` (chosen xStock, e.g. NVDAx mint address), `amount` per interval, `interval` (e.g. daily/weekly in seconds), number of cycles or "until cancelled".
2. Call Recurring API's "create order" endpoint with these params + the user's wallet public key → returns an unsigned transaction.
3. Frontend has the wallet adapter sign and send the transaction.
4. Order is now live on-chain; Jupiter's infrastructure executes each cycle automatically — no backend involvement needed.
5. To display order status/history: call Recurring API's "get orders" / "get order history" endpoint filtered by wallet address.
6. Provide a "cancel order" action calling the corresponding cancel endpoint (build the cancel tx, wallet signs).

**What the UI needs to handle:**
- Insufficient USDC balance for the full schedule (Jupiter may reject or partially fund — check docs for behavior)
- Order creation tx failure/rejection (user cancels signing, network error)
- Empty state: no active orders yet
- Cancelled vs. active vs. completed order states

### 5.2 Swap API

**Purpose:** One-off manual swaps — e.g. a "buy now" button outside the recurring schedule, or if you want a manual top-up demo action as a fallback if Recurring has any live-demo flakiness.

**Flow:**
1. `GET /quote` with `inputMint`, `outputMint`, `amount`, slippage tolerance → returns route + expected output amount + price impact.
2. Display quote to user (amount out, price impact, minimum received).
3. `POST /swap` with the quote response + user's public key → returns unsigned transaction.
4. Wallet signs and sends.

**Recommendation:** build this as a fallback/manual-buy button even if Recurring is your primary flow — it's a good demo safety net if a recurring order hasn't ticked yet during the live demo, and it's a small amount of extra code since Recurring likely uses similar routing under the hood.

### 5.3 Lend API (borrow against xStock)

**Purpose:** Deposit accumulated xStock as collateral, borrow USDC against it.

**Flow:**
1. Fetch available Lend markets/collateral list → confirm your xStock is listed, get current LTV limits and interest rates.
2. **Deposit (supply collateral):** call Lend API's deposit/supply endpoint with `asset` (xStock mint), `amount`, user pubkey → unsigned tx → wallet signs.
3. **Borrow:** call Lend API's borrow endpoint with `asset` (USDC), `amount` (must respect max LTV), user pubkey → unsigned tx → wallet signs.
4. **Fetch position/health:** call Lend API's account/position endpoint for the wallet → returns current collateral value, borrowed amount, current LTV, liquidation threshold. Use this to render the health bar.
5. **Repay/withdraw:** build these too if time allows (repay USDC, withdraw collateral) — not required for the demo narrative but shows completeness.

**What the UI needs to handle:**
- Max borrow amount = f(collateral value, max LTV) — never let the user submit a borrow request above the safe limit; show this as a slider or capped input
- Clear liquidation-risk visualization: e.g. green/yellow/red zones based on current LTV vs. liquidation threshold
- Empty state: no collateral deposited yet → prompt to deposit first

### 5.4 Price API

**Purpose:** USD valuation for the portfolio view (convert xStock token balances to dollar amounts).

**Flow:** `GET` price endpoint with a batch of mint addresses (USDC + your xStock tickers) → returns current USD prices. Poll on page load / at a reasonable interval (don't hammer it — cache for 10–30s).

---

## 6. Screen-by-screen feature plan

### `/setup` — Create DCA plan
- Ticker selector (limited to your pre-validated list, e.g. just NVDAx for MVP)
- Amount per buy (USDC)
- Interval selector (daily / weekly — check what intervals Recurring API actually supports)
- "Create Plan" button → builds + signs + sends the Recurring order creation tx
- Success state showing the new active order
- **Stretch:** basket mode — split one recurring USDC amount across 2–3 tickers (only if the Recurring API supports multiple orders created in one flow; likely just fire multiple orders under the hood)

### `/portfolio` — Position + streak view
- List of active/past Recurring orders (ticker, amount, interval, next execution, status)
- Current xStock holdings converted to USD via Price API
- Simple "streak" visual — e.g. count of completed executions, or $ total invested to date
- "Buy now" manual swap button (Swap API) as a demo safety net
- Cancel order action

### `/borrow` — Liquidity against position
- Shows eligible collateral (xStock balance from wallet/portfolio data)
- "Deposit as collateral" action → Lend deposit
- Borrow amount input, capped at safe LTV, with a live health/LTV indicator
- "Borrow" action → Lend borrow
- Position summary: collateral value, amount borrowed, current LTV, liquidation threshold, distance to liquidation
- **Stretch:** repay flow

---

## 7. Day-by-day build plan

Submissions close **Friday 4:00pm ET** — from a Monday start that's 4–5 working days, not 7. Plan against the calendar below, not against an abstract "Day 1–7" count.

| Calendar day | Focus |
|---|---|
| **Mon (Day 1)** | API key setup, RPC provider setup, confirm ticker availability across Recurring/Swap/Lend, confirm Recurring API's minimum supported interval (affects Demo Mode design — see below), scaffold Next.js app + wallet adapter, get one successful Recurring order creation working end-to-end on mainnet with a tiny real amount |
| **Tue–Wed (Days 2–3)** | Core plumbing: wire up Recurring order-creation, Swap fallback, and Lend supply/borrow transactions for the one verified ticker. Build `/portfolio` (order history, balances, USD pricing, streak visual) and `/borrow` (deposit, borrow, health/LTV display) |
| **Thu (Days 4–5, compressed)** | UI polish (loading states, error handling, empty states), build the Demo Mode toggle (see below), full end-to-end run-through, fix bugs |
| **Fri, before 4pm ET (Days 6–7, compressed)** | Record demo video, write submission copy, final bug fixes, submit — treat this as one continuous push from Thursday evening, not two clean separate days. Leave real buffer before 4pm; don't plan to submit at 3:59pm |

### Demo Mode — design note
A toggle that visibly accelerates the DCA "streak ticking up" for the video is a good idea, but **verify on Day 1 whether the Recurring API even accepts short intervals** (e.g. 15 seconds) — real DCA products are typically built for daily/weekly cadences and may enforce a minimum interval that's much longer. Two fallback designs depending on what you find:
- If short intervals *are* accepted: Demo Mode can create a real Recurring order with a short interval and let the audience watch it execute live.
- If they're not: build Demo Mode as a separate, clearly-labeled visual simulation (e.g. a local timer firing manual Swap API calls) rather than pretending it's the real Recurring mechanism — and be upfront about this distinction in the video narration, so the demo doesn't misrepresent how the product actually works.

---

## 8. Demo video script (~90 seconds)

1. **(10s) Hook:** Open on the tagline — "Stack stocks. Borrow against them. Never sell." — then one sentence of context: "Investing in stocks on-chain should be automatic, and you shouldn't have to sell your position to access cash."
2. **(25s) DCA flow:** Show `/setup`, create a recurring $20 weekly buy into NVDAx, show the on-chain order created, show `/portfolio` reflecting the position (may want to pre-seed a wallet with a few days of history so the streak looks real, or narrate over a fast-forward).
3. **(30s) Borrow flow:** Go to `/borrow`, deposit the NVDAx position as collateral, borrow USDC, show the LTV/health indicator update live.
4. **(15s) Why Solana:** Sub-cent fees, instant settlement, 24/7 execution — contrast with a traditional brokerage where this round-trip (invest + borrow) would take days and multiple institutions.
5. **(10s) Close:** Restate the pitch in one sentence, mention what's built on Jupiter (be explicit that Swap/Recurring/Lend are Jupiter's infrastructure — this is required disclosure per submission rules on open-source/third-party components).

---

## 9. Submission checklist

- [ ] Register on the hackathon site
- [ ] GitHub repo (public), named **StackNBorrow**, README leads with the tagline ("Stack stocks. Borrow against them. Never sell.") and explains: problem, user, architecture, explicitly states "built on Jupiter Swap/Recurring/Lend APIs — no custom smart contracts"
- [ ] Live demo link (deployed on Vercel or similar) — test this actually works with a fresh wallet before submitting
- [ ] Demo video (per script above) — upload/link
- [ ] Submit via "Submit Project" before Friday 4:00pm ET
- [ ] Invite teammates from the submit form
- [ ] Double check: does the submission clearly answer all four judging criteria? (real user/problem, working end-to-end demo, reason it belongs on Solana, quality of execution)

---

## 10. Verified vs. unverified technical details

To keep this spec honest, here's what's been confirmed against real sources vs. what still needs to be checked live before Claude Code relies on it.

**Confirmed:**
- SPYx, QQQx, NVDAx, and TSLAx are real Jupiter Lend collateral assets — Jupiter officially added these four as collateral, with borrowing (USDC or JupUSD) capped at a 75% loan-to-value ratio at launch.
- Risk tiering is real and matters for UX copy: index-based xStocks (SPYx, QQQx) are classified as medium risk since they track diversified baskets, while single-stock xStocks (TSLAx, NVDAx) are classified as high risk due to single-company volatility — worth reflecting in the `/borrow` screen's risk messaging.
- Each xStock has its own individual LTV, liquidation threshold, and liquidation penalty, viewable on the Jupiter Lend interface and Statistics page — this confirms a per-asset config table exists to pull from live.
- Jupiter endpoints return base64-encoded transactions, commonly Versioned Transactions — the frontend must deserialize with `VersionedTransaction.deserialize(Buffer.from(txBase64, 'base64'))` before handing off to `wallet.sendTransaction`. This is a common integration failure point.

**Not verified — do not hardcode, fetch live instead:**
- Specific numbers like exact market size in dollars or an exact liquidation-threshold percentage per asset (e.g. "SPYx: 85%, NVDAx: 75%") were not independently confirmed and may already be stale given how fast volume on Jupiter Lend has grown. **Claude Code should pull these live from the Lend API's markets/collateral endpoint or the Statistics page on Day 1**, not from any number written in this doc or relayed secondhand.
- Whether Jupiter currently recommends raw REST calls vs. their SDKs (`@jup-ag/api`, `@jup-ag/lend`) for transaction building/deserialization — check current docs, this guidance can change as SDKs mature.

**Strategic takeaway that holds regardless of exact numbers:** SPYx is the safer anchor for demo purposes if you want to show a wider borrow headroom (index-based, medium risk, historically higher LTV ceiling), while NVDAx has stronger name recognition for a judge audience. Pick based on live data confirmed on Day 1, using this only as a tiebreaker.

---

## 11. Edge case handling (required, not optional)

The happy-path flows in Sections 5–6 are the core to get working first, but **every flow must handle its failure/edge states before it's considered done.** A demo that only works when everything goes perfectly is a demo risk, not a finished feature. This is the consolidated list — build against it, don't just handle whatever comes up ad hoc.

**Wallet & connection**
- No user signed in (neither embedded wallet nor external wallet) when they try to take an action (setup/borrow/etc.) — prompt to sign in, don't let the action silently fail
- User rejects the signature request (either signing method) — show a clear, non-alarming message, don't treat it as a crash
- Wallet connected to the wrong network (not mainnet) — detect and block with a clear message
- Wallet disconnects / Privy session expires mid-flow (e.g. between quote and swap) — handle gracefully, don't leave the UI in a stuck loading state
- Email/Google login fails or times out via Privy — show a clear retry path, don't leave the user on a blank auth screen
- Embedded wallet has insufficient SOL for fees (more likely than with an external wallet, since a fresh email sign-up starts with a zero balance) — surface this clearly, since it's the most likely first-run edge case for a non-crypto-native user
- User signs in via email on one device, then later via wallet or a different email — treat these as distinct identities unless you explicitly build account linking; don't assume balances/positions carry over

**Balances & funds**
- Insufficient USDC for a DCA order or manual buy — block submission with a clear message before attempting the transaction, not after a failed on-chain call
- Insufficient SOL for transaction fees — same treatment, since this is easy to overlook and will otherwise fail silently or with a confusing RPC error
- Insufficient xStock balance to deposit as collateral — block with a clear message
- Zero balance / empty states — `/portfolio` with no orders yet, `/borrow` with no collateral deposited yet — these need real empty-state UI, not a blank screen or broken layout

**Transactions & network**
- Transaction fails/times out after being sent (network congestion, RPC error) — show status clearly, don't leave the user unsure if it went through; consider a "check status" affordance rather than assuming success
- RPC provider failure or rate limit — handle with a retry or clear error, don't let the whole app hang
- Double-submit protection — disable action buttons while a transaction is pending so users can't fire the same tx twice
- Price API failure or stale data — degrade gracefully (e.g. show "price unavailable" rather than a broken $0 or NaN)

**Borrow-specific**
- Borrow amount requested above max safe LTV — hard-cap the input, don't just warn after the fact
- Collateral value drops (price movement) such that an existing position is near/at liquidation threshold — reflect this live in the health indicator, don't just show a static number from deposit time

**Recurring order-specific**
- Order creation partially funds or fails validation (e.g. amount too small, unsupported interval) — surface the actual reason, not a generic error
- Cancelling an order that has already completed/expired — handle as a no-op with a clear message, not an error

**General**
- Loading states for every async action (quote fetching, tx building, tx confirming) — no silent waits with no feedback
- Component unmounts while an async call is still in flight — avoid state updates on unmounted components
- Any Jupiter API call returning an unexpected/error response shape — handle explicitly, don't assume the happy-path response shape always comes back

---

## 12. Notes for Claude Code

- Follow the coding conventions in Section 3 strictly: full TypeScript typing with no `any`, one component per file regardless of size, comments capped at a single line and used sparingly, no gradient colors anywhere in the UI.
- Treat every exact API field name, endpoint path, and parameter in Section 5 as **best-effort based on documented product structure, not verified live schemas** — fetch `developers.jup.ag/docs/recurring-api`, `/docs/swap-api`, and the Lend API docs directly before implementing each integration, and adjust field names/endpoints to match what's actually returned.
- Mainnet only — do not attempt to build/test this against devnet, since xStocks and Jupiter Lend pools don't exist there.
- Keep the Jupiter API key server-side (in a Next.js Route Handler), never exposed in client bundle.
- Prioritize getting the happy path (one ticker, one interval option) working reliably first — but **do not stop there.** Every flow must also handle its edge cases per Section 11, not just the ideal-path click-through. Breadth across many tickers/intervals is not being judged; robustness of the one flow you build is.
- If the Recurring API's execution timing can't be sped up for a live demo (i.e. can't force an immediate execution for demo purposes), plan to pre-seed a test wallet with a few days/executions of real history before recording the video, and use the manual "buy now" Swap button to show the mechanism live.
- Remember to deserialize returned transactions as Versioned Transactions (see Section 10) before signing — this is a known integration gotcha, not an edge case.
- Pull real, current numbers (market size, LTV, liquidation thresholds) from the live Lend API on Day 1 rather than from any figures quoted in planning documents or chat — those may be outdated by the time you build.
- Build one unified signing abstraction that works whether the user authenticated via Privy embedded wallet (email/Google) or an external wallet — every transaction flow (Recurring, Swap, Lend) should call the same signing interface regardless of auth path, rather than branching logic per auth type throughout the codebase.
- Treat Privy App ID and any Privy server-side secrets the same as the Jupiter API key — server-side only, never in the client bundle.
