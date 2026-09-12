# Deployment

## Current state

The repo is already linked to a Vercel project (`.vercel/project.json`, gitignored):
project `antwerp-tea-party`, org `go2-grocer`. `.env.local` has a Vercel-CLI-issued
`VERCEL_OIDC_TOKEN` (development environment scope). **No production deployment, custom
domain, or payment configuration has been touched by this session.** The project brief
explicitly forbids changing production deployment/domain/payment config without approval and
credentials — none of that happened here.

## Preview deployment

Since the project is already linked and the existing workflow already supports it, a preview
deploy is permitted (per the brief: "A preview deployment is permitted only if the existing
project workflow and credentials already support it and it does not alter the Wix site, the
domain, current production payments, or the current production website"). It was **not run in
this session** — no Vercel CLI auth token/session was available to this agent. The exact
command to run it (from `webapp/`):

```bash
npx vercel deploy
```

or, for an explicitly-labeled preview:

```bash
npx vercel deploy --no-prod
```

This creates a preview URL on Vercel's `*.vercel.app` domain — it does not touch
antwerptea party's Wix site or its current live domain, and does not deploy to production
(`vercel deploy --prod` would; do not run that without explicit approval).

## Environment variables for a preview/production deploy

At minimum, whatever is added to `.env.example` needs to exist in the Vercel project's
Environment Variables settings for the relevant environment (Preview/Production):

- `COMMERCE_PREVIEW_TOKEN` — only if you want draft-preview mode reachable on the preview URL
  too (recommended for Preview, should stay **unset** for Production once real products exist).
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` —
  once a Supabase project is connected (see `docs/commerce-architecture.md`). Not set yet — no
  project exists. Setting these switches the storefront from the seed/demo provider to Supabase
  automatically.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — once a
  Stripe account is connected. Not set yet. `STRIPE_WEBHOOK_SECRET` must match whatever webhook
  endpoint is configured to point at `<deployment-url>/api/webhooks/stripe` for that specific
  environment (Preview and Production typically need separate Stripe webhook endpoints, since
  they have different URLs).
- `NEXT_PUBLIC_SITE_URL` — set to the deployment's actual URL once one exists; used to build the
  Stripe Checkout return URL.

`VERCEL_OIDC_TOKEN` is managed by Vercel itself — don't set it by hand.

## Database migrations

`supabase/migrations/0001_init.sql` and `0002_orders.sql` are not applied automatically by a
Vercel deploy — run them against the Supabase project directly (SQL editor, or
`supabase db push` with the CLI linked) before or as part of connecting Supabase. See
`docs/commerce-architecture.md`.

## Build command

Standard Next.js: `npm run build`, start with `npm run start`. Vercel's Next.js framework
preset handles this automatically once the project is deployed via `vercel deploy` or connected
to a Git push — no custom `vercel.json` was added or is currently needed.

## What's explicitly NOT done and requires the owner's/developer's decision first

- Activating a Shopify account (see `docs/commerce-architecture.md`).
- Choosing/activating a payment provider.
- Any change to the existing Wix site or the current production domain.
- Deploying to production (`--prod`) or pointing a real domain at this project.
