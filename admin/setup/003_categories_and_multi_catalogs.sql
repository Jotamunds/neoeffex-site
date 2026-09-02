-- Etapa 4: categorias próprias e suporte a vários catálogos por conta.
-- Execute uma única vez, depois de 001_initial_schema.sql e 002_seed_example.sql.
-- O bloco é transacional: se qualquer etapa falhar, nenhuma alteração parcial será aplicada.

begin;

create table public.categories (
    id uuid primary key default gen_random_uuid(),
    catalog_id uuid not null references public.catalogs(id) on delete cascade,
    name text not null check (char_length(trim(name)) between 2 and 80),
    sort_order integer not null default 0 check (sort_order >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (id, catalog_id)
);

create unique index categories_catalog_id_name_lower_key
    on public.categories (catalog_id, lower(name));

-- Cria uma categoria para cada texto de categoria já existente nos produtos.
insert into public.categories (catalog_id, name, sort_order)
select
    catalog_id,
    min(trim(category)) as name,
    min(sort_order) as sort_order
from public.products
group by catalog_id, lower(trim(category));

alter table public.products
    add column category_id uuid;

update public.products as product
set category_id = category.id
from public.categories as category
where category.catalog_id = product.catalog_id
    and lower(category.name) = lower(trim(product.category));

alter table public.products
    alter column category_id set not null,
    add constraint products_category_catalog_fk
        foreign key (category_id, catalog_id)
        references public.categories (id, catalog_id)
        on delete restrict;

alter table public.products
    drop column category;

create index products_catalog_id_category_id_idx
    on public.products (catalog_id, category_id);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;

revoke all on table public.categories from anon;
grant select, insert, update, delete on table public.categories to authenticated;

drop policy if exists "categories_select_own_catalog" on public.categories;
create policy "categories_select_own_catalog"
on public.categories
for select
to authenticated
using (
    exists (
        select 1
        from public.catalogs
        where catalogs.id = categories.catalog_id
            and catalogs.owner_id = (select auth.uid())
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
        from public.catalogs
        where catalogs.id = categories.catalog_id
            and catalogs.owner_id = (select auth.uid())
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
        from public.catalogs
        where catalogs.id = categories.catalog_id
            and catalogs.owner_id = (select auth.uid())
    )
)
with check (
    exists (
        select 1
        from public.catalogs
        where catalogs.id = categories.catalog_id
            and catalogs.owner_id = (select auth.uid())
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
        from public.catalogs
        where catalogs.id = categories.catalog_id
            and catalogs.owner_id = (select auth.uid())
    )
);

commit;
