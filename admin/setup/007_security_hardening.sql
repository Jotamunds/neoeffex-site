-- Etapa 9: endurecimento de segurança para produção.
-- Execute depois de 006_product_images.sql.
-- Pode ser executado novamente: privilégios, índices e políticas são recriados de forma idempotente.

begin;

alter table public.catalogs enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;

revoke all on function public.set_updated_at() from public, anon, authenticated;

-- Remove privilégios herdados ou adicionados automaticamente e libera somente o necessário.
revoke all on table public.catalogs from public, anon, authenticated;
revoke all on table public.categories from public, anon, authenticated;
revoke all on table public.products from public, anon, authenticated;

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on table public.catalogs to authenticated;
grant select, insert, update, delete on table public.categories to authenticated;
grant select, insert, update, delete on table public.products to authenticated;

grant select (
    id,
    name,
    slug,
    is_active,
    whatsapp_number,
    orders_enabled,
    order_message
) on table public.catalogs to anon;

grant select (
    id,
    catalog_id,
    name,
    sort_order,
    created_at
) on table public.categories to anon;

grant select (
    id,
    catalog_id,
    name,
    description,
    category_id,
    price,
    status,
    image_path,
    sort_order,
    created_at
) on table public.products to anon;

create index if not exists catalogs_owner_id_idx
    on public.catalogs (owner_id);

create index if not exists categories_catalog_id_sort_order_idx
    on public.categories (catalog_id, sort_order, created_at);

create index if not exists products_public_active_order_idx
    on public.products (catalog_id, sort_order, created_at)
    where status = 'active';

-- Políticas administrativas: cada conta acessa somente os próprios catálogos.
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

drop policy if exists "categories_select_own_catalog" on public.categories;
create policy "categories_select_own_catalog"
on public.categories
for select
to authenticated
using (
    exists (
        select 1
        from public.catalogs as catalog
        where catalog.id = categories.catalog_id
            and catalog.owner_id = (select auth.uid())
    )
);

drop policy if exists "categories_insert_own_catalog" on public.categories;
create policy "categories_insert_own_catalog"
on public.categories
for insert
to authenticated
with check (
    exists (
        select 1
        from public.catalogs as catalog
        where catalog.id = categories.catalog_id
            and catalog.owner_id = (select auth.uid())
    )
);

drop policy if exists "categories_update_own_catalog" on public.categories;
create policy "categories_update_own_catalog"
on public.categories
for update
to authenticated
using (
    exists (
        select 1
        from public.catalogs as catalog
        where catalog.id = categories.catalog_id
            and catalog.owner_id = (select auth.uid())
    )
)
with check (
    exists (
        select 1
        from public.catalogs as catalog
        where catalog.id = categories.catalog_id
            and catalog.owner_id = (select auth.uid())
    )
);

drop policy if exists "categories_delete_own_catalog" on public.categories;
create policy "categories_delete_own_catalog"
on public.categories
for delete
to authenticated
using (
    exists (
        select 1
        from public.catalogs as catalog
        where catalog.id = categories.catalog_id
            and catalog.owner_id = (select auth.uid())
    )
);

drop policy if exists "products_select_own_catalog" on public.products;
create policy "products_select_own_catalog"
on public.products
for select
to authenticated
using (
    exists (
        select 1
        from public.catalogs as catalog
        where catalog.id = products.catalog_id
            and catalog.owner_id = (select auth.uid())
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
        from public.catalogs as catalog
        where catalog.id = products.catalog_id
            and catalog.owner_id = (select auth.uid())
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
        from public.catalogs as catalog
        where catalog.id = products.catalog_id
            and catalog.owner_id = (select auth.uid())
    )
)
with check (
    exists (
        select 1
        from public.catalogs as catalog
        where catalog.id = products.catalog_id
            and catalog.owner_id = (select auth.uid())
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
        from public.catalogs as catalog
        where catalog.id = products.catalog_id
            and catalog.owner_id = (select auth.uid())
    )
);

-- Políticas públicas: visitantes recebem somente registros ativos.
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
        from public.catalogs as catalog
        where catalog.id = categories.catalog_id
            and catalog.is_active = true
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
        from public.catalogs as catalog
        where catalog.id = products.catalog_id
            and catalog.is_active = true
    )
);

-- Storage: upload e exclusão continuam restritos ao proprietário do caminho.
drop policy if exists "catalog_product_images_select_own" on storage.objects;
create policy "catalog_product_images_select_own"
on storage.objects
for select
to authenticated
using (
    bucket_id = 'catalog-products'
    and (storage.foldername(storage.objects.name))[1] = (select auth.uid())::text
);

drop policy if exists "catalog_product_images_insert_own" on storage.objects;
create policy "catalog_product_images_insert_own"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'catalog-products'
    and storage.objects.name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/[0-9]{10,16}\.(jpg|png|webp)$'
    and (storage.foldername(storage.objects.name))[1] = (select auth.uid())::text
    and exists (
        select 1
        from public.products as product
        join public.catalogs as catalog on catalog.id = product.catalog_id
        where product.id::text = (storage.foldername(storage.objects.name))[3]
            and catalog.id::text = (storage.foldername(storage.objects.name))[2]
            and catalog.owner_id = (select auth.uid())
    )
);

drop policy if exists "catalog_product_images_delete_own" on storage.objects;
create policy "catalog_product_images_delete_own"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'catalog-products'
    and (storage.foldername(storage.objects.name))[1] = (select auth.uid())::text
);

commit;
