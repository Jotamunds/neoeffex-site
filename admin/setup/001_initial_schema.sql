-- Etapa 2: autenticação e base de catálogos.
-- Execute este arquivo no SQL Editor do projeto Supabase.

create table if not exists public.catalogs (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users(id) on delete cascade,
    name text not null check (char_length(trim(name)) between 2 and 100),
    slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    catalog_id uuid not null references public.catalogs(id) on delete cascade,
    name text not null check (char_length(trim(name)) between 2 and 140),
    description text not null default '' check (char_length(description) <= 500),
    category text not null check (char_length(trim(category)) between 2 and 80),
    price numeric(10, 2) not null check (price >= 0),
    status text not null default 'active' check (status in ('active', 'paused')),
    sort_order integer not null default 0 check (sort_order >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists products_catalog_id_sort_order_idx
    on public.products (catalog_id, sort_order, created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists catalogs_set_updated_at on public.catalogs;
create trigger catalogs_set_updated_at
before update on public.catalogs
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

alter table public.catalogs enable row level security;
alter table public.products enable row level security;

revoke all on table public.catalogs from anon;
revoke all on table public.products from anon;
grant select, insert, update, delete on table public.catalogs to authenticated;
grant select, insert, update, delete on table public.products to authenticated;

drop policy if exists "catalogs_select_own" on public.catalogs;
create policy "catalogs_select_own"
on public.catalogs
for select
to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "catalogs_insert_own" on public.catalogs;
create policy "catalogs_insert_own"
on public.catalogs
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "catalogs_update_own" on public.catalogs;
create policy "catalogs_update_own"
on public.catalogs
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "catalogs_delete_own" on public.catalogs;
create policy "catalogs_delete_own"
on public.catalogs
for delete
to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "products_select_own_catalog" on public.products;
create policy "products_select_own_catalog"
on public.products
for select
to authenticated
using (
    exists (
        select 1
        from public.catalogs
        where catalogs.id = products.catalog_id
            and catalogs.owner_id = (select auth.uid())
    )
);

drop policy if exists "products_insert_own_catalog" on public.products;
create policy "products_insert_own_catalog"
on public.products
for insert
to authenticated
with check (
    exists (
        select 1
        from public.catalogs
        where catalogs.id = products.catalog_id
            and catalogs.owner_id = (select auth.uid())
    )
);

drop policy if exists "products_update_own_catalog" on public.products;
create policy "products_update_own_catalog"
on public.products
for update
to authenticated
using (
    exists (
        select 1
        from public.catalogs
        where catalogs.id = products.catalog_id
            and catalogs.owner_id = (select auth.uid())
    )
)
with check (
    exists (
        select 1
        from public.catalogs
        where catalogs.id = products.catalog_id
            and catalogs.owner_id = (select auth.uid())
    )
);

drop policy if exists "products_delete_own_catalog" on public.products;
create policy "products_delete_own_catalog"
on public.products
for delete
to authenticated
using (
    exists (
        select 1
        from public.catalogs
        where catalogs.id = products.catalog_id
            and catalogs.owner_id = (select auth.uid())
    )
);

revoke all on function public.set_updated_at() from public;
