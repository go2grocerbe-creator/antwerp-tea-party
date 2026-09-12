# Commerce Architecture

Status: **foundation built, no live commerce backend connected yet.** This document explains
what exists today, why, and exactly what's needed to connect Supabase and Stripe for real.

> **Update (2026-09-12, second pass):** the owner decided Shopify is not the direction for this
> project. The architecture below was rewritten from an earlier Shopify recommendation to
> **Next.js storefront + Supabase (Postgres/Auth/Storage/RLS) + a custom protected admin +
> Stripe**. See `docs/decision-log.md` DEC-T08. Nothing about the typed `CommerceProvider`
> interface changed — Supabase is just the adapter that implements it now, in the same place a
> Shopify adapter would have gone.

## The typed commerce interface

Every commerce operation the storefront needs goes through one interface:
`src/lib/commerce/types.ts` → `CommerceProvider`:

```ts
listPublishedProducts(opts?)
getProductByHandle(handle, opts?)
createCart()
getCart(cartId)
addCartLine(cartId, variantId, productHandle, quantity, opts?)
updateCartLine(cartId, lineId, quantity)
removeCartLine(cartId, lineId)
getCheckoutUrl(cartId)
```

No UI component imports a specific backend. Every route/component calls
`getCommerceProvider()` from `src/lib/commerce/index.ts`, which **automatically switches**:

```ts
export function getCommerceProvider(): CommerceProvider {
  return isSupabaseConfigured() ? supabaseCommerceProvider : seedCommerceProvider;
}
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` and the storefront starts
reading real Supabase data with zero other code changes — see "What connecting Supabase
actually requires" below.

## What's running today: the seed provider + five demo products

`src/lib/commerce/provider.ts` implements `CommerceProvider` against
`src/lib/commerce/seed-data.ts`. As of this pass, seed data is **five generic, published demo
teas** (Earl Grey Classic, English Breakfast, Green Sencha, Chamomile Blossom, Rooibos Vanilla)
with reasonable demonstration copy, prices, and imagery — not Daniele's real catalogue. Every
page that lists or shows them renders `<DemoCatalogueBanner>`
(`src/components/shop/DemoCatalogueBanner.tsx`) in any environment except a real production
deploy (`VERCEL_ENV === "production"`), and those pages are marked `noindex` in the same
condition. See `docs/product-model.md` "Demo catalogue vs. real data" for the full reasoning and
what replacing them with real data looks like.

Known, intentional limitations of the seed provider (shared with the Supabase provider — both
build on `src/lib/commerce/memory-cart.ts`):

- **Cart storage is in-memory.** It resets on server restart/redeploy. Fine for local dev/demo;
  not a production cart store. Price is always re-read from the product catalogue when a line is
  added or a checkout session is created — a cart line only ever stores `variantId + quantity`,
  never a price (see `memory-cart.ts` `addCartLine`).
- **`CommerceProvider.getCheckoutUrl()` always returns `null`.** That method models a
  *hosted-checkout* redirect (the pattern a platform like Shopify uses) — Stripe Embedded
  Checkout (see below) doesn't work that way, so the cart/checkout pages don't call it anymore;
  it's kept on the interface for completeness/future backends but is effectively unused now.

## Draft-preview mode

Draft products must never be publicly visible (`listPublishedProducts` filters them out by
default). The five current products are **published**, so they need no preview token — but the
mechanism still exists for the next real draft product:

Set `COMMERCE_PREVIEW_TOKEN` in the environment. Appending `?preview=<token>` to `/shop` or
`/shop/[handle]` shows drafts; the token is also threaded into the add-to-cart form (hidden
field) so a draft item can be added to a preview cart — `addToCartAction` independently
re-checks the token server-side before allowing a draft into the cart. Without the env var set,
preview mode is inert.

For the Supabase provider specifically, `includeDrafts=true` reads use the **service-role**
client (bypasses RLS) instead of the public anon client — see
`src/lib/commerce/supabase-provider.ts` `clientFor()`. This doesn't widen who can reach draft
data: the caller (the `/shop` routes) has already independently verified the preview token
before setting `includeDrafts`.

## Product administration: Supabase + custom admin

`/admin` (see `src/app/admin/`) is a small, protected CRUD UI: sign in, list products, add/edit
(titles/descriptions per locale, category, brewing info, variants, images, SEO fields),
publish/unpublish/archive. Built on:

- **Supabase Auth** (email/password) for sign-in — `src/lib/supabase/admin-auth.ts`.
- **Postgres + Row-Level Security** — `supabase/migrations/0001_init.sql`. Draft/published
  status is enforced **both** in the application data-access layer (never `SELECT` unpublished
  rows for a public caller) **and independently** via RLS, so a bug in one layer doesn't expose
  draft data through the other — this mirrors the pattern used successfully in the GreenNetEnergy
  project (see `E:\Obsidian_Second_Brain\...\GreenNetEnergy Ltd\02 Development\(C) Architecture &
  Technical Reference.md`).
- **`admin_users` allowlist table** — being a valid Supabase Auth user isn't enough; a row in
  `admin_users` is what RLS's `is_admin()` checks. Granting access today is a manual insert
  (service-role/SQL editor) — not self-service from the UI, deliberately, for a catalogue this
  small.
- **Zod validation** (`src/lib/admin/schema.ts`) on every Server Action, re-validating form input
  server-side regardless of what the client sent.
- **Supabase Storage** (`product-images` bucket, public read / admin write) is provisioned in
  the migration, but the admin form currently takes an image **src/URL** rather than a file
  upload widget — see `docs/handover.md` for that as a documented next step.

## Payment: Stripe (prepared, not activated)

Per the owner's direction, this project uses **Stripe** rather than Shopify Payments or a direct
Worldline integration. (Worldline's own ecommerce compatibility for this merchant remains
unconfirmed per `DISCOVERY_FINDINGS.md` in the Obsidian project memory — if that changes,
revisit this decision; nothing here forecloses it.)

**Stripe Embedded Checkout** — chosen over a redirect-to-Stripe hosted page so the customer
stays on the site (`src/app/[locale]/checkout/page.tsx` mounts
`<EmbeddedCheckoutClient>`, `src/components/checkout/EmbeddedCheckoutClient.tsx`):

1. Customer adds teas to the cart (server-authoritative, see above), goes to `/cart`, clicks
   Checkout — only shown when `isCheckoutAvailable()` (both `STRIPE_SECRET_KEY` and
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are set). Otherwise the cart shows the same honest
   "checkout is not connected yet" message it always has.
2. `/checkout` renders the embedded Stripe UI. It calls `POST /api/checkout/session`
   (`src/app/api/checkout/session/route.ts`), which **re-resolves the cart server-side**
   (`resolveCart()` — same function the cart page uses) and builds the Stripe line items from
   that, never from anything the browser sent. EUR only (Bancontact requires it).
3. Stripe redirects back to `/checkout/return?session_id=...`
   (`src/app/[locale]/checkout/return/page.tsx`), which only **reads** the session status back
   from Stripe to decide which message to show — it never creates anything.
4. **The only place an order is created** is the webhook,
   `src/app/api/webhooks/stripe/route.ts`, on a signature-verified
   `checkout.session.completed` event with `payment_status === "paid"`. If
   `SUPABASE_SERVICE_ROLE_KEY` is configured, it writes to `orders`/`order_items`
   (`supabase/migrations/0002_orders.sql`); if not, it still verifies and acknowledges the event
   but logs that nothing was persisted, rather than failing the webhook.

No fake success page exists anywhere in this flow — every state (checkout unavailable, payment
incomplete, payment complete) reflects something Stripe actually told the server.

## What connecting Supabase actually requires

1. Create a Supabase project.
2. Run `supabase/migrations/0001_init.sql` then `0002_orders.sql` (SQL editor, or
   `supabase db push` with the Supabase CLI linked to the project).
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY` (see `.env.example`).
4. Create the first admin: create a normal Supabase Auth user (Dashboard → Authentication →
   Add user, or invite by email), then insert their `auth.users.id` into `admin_users`:
   ```sql
   insert into public.admin_users (user_id, role) values ('<their-auth-user-id>', 'owner');
   ```
5. Sign in at `/admin`, enter the five demo products' real replacements (or new products) via
   `docs/content-intake-template.md`, publish when approved.
6. The storefront switches to Supabase automatically once step 3's env vars are set — no code
   change needed.

## What connecting Stripe actually requires

1. A Stripe account (test mode is enough to verify everything below).
2. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` from the Stripe Dashboard →
   Developers → API keys (test mode).
3. A webhook endpoint pointed at `/api/webhooks/stripe`:
   - Local: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` (Stripe CLI), copy
     the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`.
   - Deployed: Dashboard → Developers → Webhooks → Add endpoint →
     `https://<your-domain>/api/webhooks/stripe`, subscribe to `checkout.session.completed`,
     copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
4. Set `NEXT_PUBLIC_SITE_URL` to the deployment's real URL (used to build the Checkout
   `return_url`).
5. Test with Stripe's published test cards (e.g. `4242 4242 4242 4242`, any future expiry, any
   CVC) and the test Bancontact flow. See Stripe's own docs for the current list — don't rely on
   a hardcoded list here, test card numbers do change.
6. Once `SUPABASE_SERVICE_ROLE_KEY` is also set, a completed checkout writes a real row to
   `orders`/`order_items` — verify one end-to-end before considering this "done."

Verify the exact current Stripe SDK/Embedded Checkout requirements against Stripe's own docs
before going live — package versions in this repo (`stripe@22.x`, `@stripe/stripe-js@9.x`,
`@stripe/react-stripe-js@6.x`) were current as of this session but Stripe ships frequently.

None of this requires touching the Wix site, the domain, or activating production payments —
all of which remain untouched per the project's non-negotiable constraints.
