-- Neoeffex Admin / Catálogo v0.3.3 — estrutura persistente de Tipos e Grupos (Etapa 3A).
-- Executar UMA VEZ no SQL Editor, como postgres, após 20260907235435_store_catalog_organization.sql.
-- SQL transacional: qualquer erro cancela o conjunto.
-- Cria as tabelas product_types e product_groups, define RLS, constraints, triggers
-- e realiza o backfill automático dos valores existentes em products.product_type e products.product_groups.
-- Não altera tabelas ou colunas existentes de products, catalogs, stores ou categories.
-- Não remove os campos legados products.product_type nem products.product_groups.
begin;
set local lock_timeout = '10s';
set local statement_timeout = '60s';

do $$
begin
    if to_regclass('public.product_types') is not null
       or to_regclass('public.product_groups') is not null then
        raise exception 'As tabelas product_types ou product_groups já existem. Não reaplique; execute a verificação desta versão.';
    end if;
    if to_regclass('public.stores') is null
       or to_regclass('public.catalogs') is null
       or to_regclass('public.products') is null then
        raise exception 'Base incompatível. Confira a migration 20260907235435_store_catalog_organization.sql antes de continuar.';
    end if;
end;
$$;

lock table public.catalogs, public.products in share row exclusive mode;

-- 1. Criação de product_types
create table public.product_types (
    id uuid primary key default gen_random_uuid(),
    catalog_id uuid not null references public.catalogs(id) on delete cascade,
    name text not null,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint product_types_name_check check (char_length(name) between 1 and 60 and name = btrim(name)),
    constraint product_types_sort_order_check check (sort_order >= 0)
);

create unique index product_types_catalog_name_lower_key on public.product_types(catalog_id, lower(name));
create index product_types_catalog_sort_idx on public.product_types(catalog_id, sort_order);

alter table public.product_types enable row level security;
revoke all on public.product_types from public, anon, authenticated;
grant select, insert, update, delete on public.product_types to authenticated;

create policy product_types_select_own on public.product_types
    for select to authenticated
    using (
        exists (
            select 1 from public.catalogs as catalog
            where catalog.id = product_types.catalog_id
              and catalog.owner_id = (select auth.uid())
        )
    );

create policy product_types_insert_own on public.product_types
    for insert to authenticated
    with check (
        exists (
            select 1 from public.catalogs as catalog
            where catalog.id = product_types.catalog_id
              and catalog.owner_id = (select auth.uid())
        )
    );

create policy product_types_update_own on public.product_types
    for update to authenticated
    using (
        exists (
            select 1 from public.catalogs as catalog
            where catalog.id = product_types.catalog_id
              and catalog.owner_id = (select auth.uid())
        )
    )
    with check (
        exists (
            select 1 from public.catalogs as catalog
            where catalog.id = product_types.catalog_id
              and catalog.owner_id = (select auth.uid())
        )
    );

create policy product_types_delete_own on public.product_types
    for delete to authenticated
    using (
        exists (
            select 1 from public.catalogs as catalog
            where catalog.id = product_types.catalog_id
              and catalog.owner_id = (select auth.uid())
        )
    );

create trigger product_types_set_updated_at
    before update on public.product_types
    for each row execute function public.set_updated_at();

-- 2. Criação de product_groups
create table public.product_groups (
    id uuid primary key default gen_random_uuid(),
    catalog_id uuid not null references public.catalogs(id) on delete cascade,
    name text not null,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint product_groups_name_check check (char_length(name) between 1 and 60 and name = btrim(name) and position(',' in name) = 0),
    constraint product_groups_sort_order_check check (sort_order >= 0)
);

create unique index product_groups_catalog_name_lower_key on public.product_groups(catalog_id, lower(name));
create index product_groups_catalog_sort_idx on public.product_groups(catalog_id, sort_order);

alter table public.product_groups enable row level security;
revoke all on public.product_groups from public, anon, authenticated;
grant select, insert, update, delete on public.product_groups to authenticated;

create policy product_groups_select_own on public.product_groups
    for select to authenticated
    using (
        exists (
            select 1 from public.catalogs as catalog
            where catalog.id = product_groups.catalog_id
              and catalog.owner_id = (select auth.uid())
        )
    );

create policy product_groups_insert_own on public.product_groups
    for insert to authenticated
    with check (
        exists (
            select 1 from public.catalogs as catalog
            where catalog.id = product_groups.catalog_id
              and catalog.owner_id = (select auth.uid())
        )
    );

create policy product_groups_update_own on public.product_groups
    for update to authenticated
    using (
        exists (
            select 1 from public.catalogs as catalog
            where catalog.id = product_groups.catalog_id
              and catalog.owner_id = (select auth.uid())
        )
    )
    with check (
        exists (
            select 1 from public.catalogs as catalog
            where catalog.id = product_groups.catalog_id
              and catalog.owner_id = (select auth.uid())
        )
    );

create policy product_groups_delete_own on public.product_groups
    for delete to authenticated
    using (
        exists (
            select 1 from public.catalogs as catalog
            where catalog.id = product_groups.catalog_id
              and catalog.owner_id = (select auth.uid())
        )
    );

create trigger product_groups_set_updated_at
    before update on public.product_groups
    for each row execute function public.set_updated_at();

-- 3. Backfill de Tipos existentes a partir de products.product_type
insert into public.product_types (catalog_id, name, sort_order)
select
    catalog_id,
    name,
    (row_number() over (partition by catalog_id order by min_created, name) - 1)::integer as sort_order
from (
    select
        p.catalog_id,
        (array_agg(btrim(p.product_type) order by p.created_at asc, p.id asc))[1] as name,
        min(p.created_at) as min_created
    from public.products p
    where p.product_type is not null
      and btrim(p.product_type) <> ''
    group by p.catalog_id, lower(btrim(p.product_type))
) distinct_types;

-- 4. Backfill de Grupos existentes a partir de products.product_groups
insert into public.product_groups (catalog_id, name, sort_order)
select
    catalog_id,
    name,
    (row_number() over (partition by catalog_id order by min_created, name) - 1)::integer as sort_order
from (
    select
        p.catalog_id,
        (array_agg(btrim(g.val) order by p.created_at asc, p.id asc))[1] as name,
        min(p.created_at) as min_created
    from public.products p,
         unnest(p.product_groups) as g(val)
    where g.val is not null
      and btrim(g.val) <> ''
    group by p.catalog_id, lower(btrim(g.val))
) distinct_groups;

comment on table public.product_types is 'Classificações de tipo de produto configuráveis por catálogo; não alteram preço nem carrinho.';
comment on table public.product_groups is 'Grupos de classificação configuráveis por catálogo; não são grupos de adicionais nem opções de montagem.';

notify pgrst, 'reload schema';
commit;

select 'TIPOS_E_GRUPOS_PERSISTENTES_APLICADOS' as resultado,
       (select count(*) from public.product_types) as product_types_importados,
       (select count(*) from public.product_groups) as product_groups_importados;
