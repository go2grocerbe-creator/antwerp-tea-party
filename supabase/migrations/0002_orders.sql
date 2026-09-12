-- Orders created from verified Stripe webhook events only (see
-- src/app/api/webhooks/stripe/route.ts). Nothing else in the app ever writes to these tables.
-- Untested against a live project — no Supabase/Stripe credentials were available while writing
-- this (see docs/handover.md).

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text,
  customer_email text,
  currency text not null default 'eur',
  subtotal numeric(10, 2) not null,
  status text not null default 'paid' check (status in ('paid', 'refunded', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_handle text not null,
  variant_id text not null,
  title_snapshot text not null,
  weight_label_snapshot text not null,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 2) not null
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- No insert/update/delete policy for anon or authenticated roles anywhere on these tables —
-- only the service-role client (src/lib/supabase/service-client.ts, used exclusively by the
-- Stripe webhook handler) can write orders, and service-role bypasses RLS entirely by design.
-- Admins can read, to support a future admin order-list view (not built yet — see
-- docs/handover.md).

create policy "orders_admin_read"
  on public.orders for select
  to authenticated
  using (public.is_admin());

create policy "order_items_admin_read"
  on public.order_items for select
  to authenticated
  using (public.is_admin());
