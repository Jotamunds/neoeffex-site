-- Etapa 5: leitura pública segura dos catálogos ativos.
-- Pode ser executado novamente: privilégios e políticas são recriados de forma idempotente.

begin;

alter table public.catalogs enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- O visitante recebe acesso somente às colunas usadas pelo catálogo público.
-- owner_id, updated_at e qualquer operação de escrita continuam indisponíveis para anon.
revoke all on table public.catalogs from public;
revoke all on table public.categories from public;
revoke all on table public.products from public;
revoke all on table public.catalogs from anon;
revoke all on table public.categories from anon;
revoke all on table public.products from anon;

grant usage on schema public to anon;
grant select (id, name, slug, is_active) on table public.catalogs to anon;
grant select (id, catalog_id, name, sort_order, created_at) on table public.categories to anon;
grant select (
    id,
    catalog_id,
    name,
    description,
    category_id,
    price,
    status,
    sort_order,
    created_at
) on table public.products to anon;

create index if not exists categories_catalog_id_sort_order_idx
    on public.categories (catalog_id, sort_order, created_at);

create index if not exists products_public_active_order_idx
    on public.products (catalog_id, sort_order, created_at)
    where status = 'active';

drop policy if exists "catalogs_public_select_active" on public.catalogs;
create policy "catalogs_public_select_active"
on public.catalogs
for select
to anon
using (is_active = true);

drop policy if exists "categories_public_select_active_catalog" on public.categories;
create policy "categories_public_select_active_catalog"
on public.categories
for select
to anon
using (
    exists (
        select 1
        from public.catalogs
        where catalogs.id = categories.catalog_id
            and catalogs.is_active = true
    )
);

drop policy if exists "products_public_select_active" on public.products;
create policy "products_public_select_active"
on public.products
for select
to anon
using (
    status = 'active'
    and exists (
        select 1
        from public.catalogs
        where catalogs.id = products.catalog_id
            and catalogs.is_active = true
    )
);

commit;
