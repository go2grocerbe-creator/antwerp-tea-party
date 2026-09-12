-- Antwerp Tea Party — product administration schema.
-- Applied via `supabase db push` or the Supabase SQL editor. See docs/commerce-architecture.md
-- and docs/deployment.md for the exact setup sequence. Untested against a live project — no
-- Supabase credentials were available while writing this (see docs/handover.md) — review before
-- running against a real database.
--
-- Pattern follows GreenNetEnergy's proven approach (see
-- E:\Obsidian_Second_Brain\...\GreenNetEnergy Ltd\02 Development\(C) Architecture & Technical
-- Reference.md): draft/published status is enforced BOTH in the application data-access layer
-- (src/lib/commerce/provider.ts / supabase-provider.ts never SELECT unpublished rows for a
-- public caller) AND independently here via Row-Level Security, so a bug in one layer doesn't
-- expose draft data through the other.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------------------------
-- admin_users — allowlist of Supabase Auth users permitted to manage the catalogue.
-- Adding a row here is the entire "grant access" workflow: create the person a normal Supabase
-- Auth user (email invite or Admin API), then insert their auth.users id here.
-- ---------------------------------------------------------------------------------------------

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- An admin can see the allowlist (so the admin UI can show who has access); only the service
-- role (server-side, never exposed to the browser) can modify it — granting access is
-- deliberately not self-service from the admin UI in this first version.
create policy "admin_users_select_self_or_admin"
  on public.admin_users for select
  to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------------------------

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  handle text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  category text,
  origin text,
  tea_type text,
  flavour_notes text[] not null default '{}',
  caffeine_level text not null default 'unknown'
    check (caffeine_level in ('none', 'low', 'medium', 'high', 'unknown')),
  brewing_temperature_celsius integer,
  brewing_time_minutes integer,
  dosage_grams_per_litre numeric(6, 2),
  featured boolean not null default false,
  title_en text not null,
  title_nl text not null,
  title_fr text not null,
  short_description_en text not null default '',
  short_description_nl text not null default '',
  short_description_fr text not null default '',
  full_description_en text not null default '',
  full_description_nl text not null default '',
  full_description_fr text not null default '',
  ingredients_en text,
  ingredients_nl text,
  ingredients_fr text,
  allergens_en text,
  allergens_nl text,
  allergens_fr text,
  seo_title_en text,
  seo_title_nl text,
  seo_title_fr text,
  seo_description_en text,
  seo_description_nl text,
  seo_description_fr text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_status_idx on public.products (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

alter table public.products enable row level security;

create policy "products_public_read_published"
  on public.products for select
  to anon, authenticated
  using (status = 'published');

create policy "products_admin_read_all"
  on public.products for select
  to authenticated
  using (public.is_admin());

create policy "products_admin_write"
  on public.products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------------------------
-- product_images
-- ---------------------------------------------------------------------------------------------

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  src text not null,
  alt text not null default '',
  sort_order integer not null default 0
);

create index if not exists product_images_product_id_idx on public.product_images (product_id);

alter table public.product_images enable row level security;

create policy "product_images_public_read"
  on public.product_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.status = 'published'
    )
  );

create policy "product_images_admin_read_all"
  on public.product_images for select
  to authenticated
  using (public.is_admin());

create policy "product_images_admin_write"
  on public.product_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------------------------
-- product_variants
-- ---------------------------------------------------------------------------------------------

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  weight_label text not null,
  weight_grams integer,
  price numeric(10, 2) not null default 0,
  currency text not null default 'EUR',
  sku text,
  stock_status text not null default 'unknown'
    check (stock_status in ('in_stock', 'low_stock', 'out_of_stock', 'unknown')),
  inventory_quantity integer,
  sort_order integer not null default 0
);

create index if not exists product_variants_product_id_idx on public.product_variants (product_id);
create unique index if not exists product_variants_sku_key on public.product_variants (sku) where sku is not null;

alter table public.product_variants enable row level security;

create policy "product_variants_public_read"
  on public.product_variants for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.products p
      where p.id = product_variants.product_id and p.status = 'published'
    )
  );

create policy "product_variants_admin_read_all"
  on public.product_variants for select
  to authenticated
  using (public.is_admin());

create policy "product_variants_admin_write"
  on public.product_variants for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------------------------
-- Storage: product images bucket. Public read (published product images only need to be
-- reachable by URL), admin-only write.
-- ---------------------------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_bucket_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "product_images_bucket_admin_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_bucket_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_bucket_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
