-- Neoeffex Admin / Catálogo — Estrutura de Sabores e Produto x Sabor (Etapa 2).
-- Executar UMA VEZ no SQL Editor, como postgres, após 20260910170000_catalog_profiles_purchase_mode.sql.
-- SQL transacional: qualquer erro cancela o conjunto.
-- Cria as tabelas flavors e product_flavors, RLS estrito, constraints relacionais anti-cruzamento e atualiza a RPC delete_own_paused_catalog.
begin;
set local lock_timeout = '10s';
set local statement_timeout = '60s';

do $$
begin
    if to_regclass('public.flavors') is not null
       or to_regclass('public.product_flavors') is not null then
        raise exception 'As tabelas flavors ou product_flavors já existem. Não reaplique.';
    end if;
    if to_regclass('public.catalogs') is null
       or to_regclass('public.products') is null then
        raise exception 'Base incompatível. Verifique as migrações anteriores antes de continuar.';
    end if;
end;
$$;

lock table public.catalogs, public.products in share row exclusive mode;

-- 1. Garante constraint unique (id, catalog_id) em products para integridade referencial composta
do $$
begin
    if not exists (
        select 1 from pg_constraint
        where conname = 'products_id_catalog_id_key'
          and conrelid = 'public.products'::regclass
    ) then
        alter table public.products
            add constraint products_id_catalog_id_key unique (id, catalog_id);
    end if;
end;
$$;

-- 2. Criação da tabela flavors
create table public.flavors (
    id uuid primary key default gen_random_uuid(),
    catalog_id uuid not null references public.catalogs(id) on delete cascade,
    name text not null check (char_length(btrim(name)) between 1 and 80 and name = btrim(name)),
    description text not null default '' check (char_length(description) <= 500),
    image_path text check (
        image_path is null
        or image_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9]{10,16}\.(jpg|png|webp)$'
    ),
    is_active boolean not null default true,
    sort_order integer not null default 0 check (sort_order >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint flavors_id_catalog_id_key unique (id, catalog_id)
);

create unique index flavors_catalog_name_lower_key on public.flavors(catalog_id, lower(name));
create index flavors_catalog_sort_idx on public.flavors(catalog_id, sort_order);

create trigger flavors_set_updated_at
    before update on public.flavors
    for each row execute function public.set_updated_at();

-- 3. Criação da tabela relacional product_flavors
create table public.product_flavors (
    product_id uuid not null,
    flavor_id uuid not null,
    catalog_id uuid not null references public.catalogs(id) on delete cascade,
    sort_order integer not null default 0 check (sort_order >= 0),
    additional_price numeric(10, 2) not null default 0.00 check (additional_price >= 0),
    is_available boolean not null default true,
    created_at timestamptz not null default now(),
    primary key (product_id, flavor_id),
    constraint product_flavors_product_fk
        foreign key (product_id, catalog_id)
        references public.products(id, catalog_id)
        on delete cascade,
    constraint product_flavors_flavor_fk
        foreign key (flavor_id, catalog_id)
        references public.flavors(id, catalog_id)
        on delete cascade
);

create index product_flavors_catalog_idx on public.product_flavors(catalog_id);
create index product_flavors_product_sort_idx on public.product_flavors(product_id, sort_order);

-- 4. RLS para flavors
alter table public.flavors enable row level security;
revoke all on public.flavors from public, anon, authenticated;

grant select, insert, update, delete on public.flavors to authenticated;
grant select (id, catalog_id, name, description, image_path, is_active, sort_order, created_at) on public.flavors to anon;

create policy flavors_select_own on public.flavors
    for select to authenticated
    using (
        exists (
            select 1 from public.catalogs c
            where c.id = flavors.catalog_id
              and c.owner_id = (select auth.uid())
        )
    );

create policy flavors_insert_own on public.flavors
    for insert to authenticated
    with check (
        exists (
            select 1 from public.catalogs c
            where c.id = flavors.catalog_id
              and c.owner_id = (select auth.uid())
        )
    );

create policy flavors_update_own on public.flavors
    for update to authenticated
    using (
        exists (
            select 1 from public.catalogs c
            where c.id = flavors.catalog_id
              and c.owner_id = (select auth.uid())
        )
    )
    with check (
        exists (
            select 1 from public.catalogs c
            where c.id = flavors.catalog_id
              and c.owner_id = (select auth.uid())
        )
    );

create policy flavors_delete_own on public.flavors
    for delete to authenticated
    using (
        exists (
            select 1 from public.catalogs c
            where c.id = flavors.catalog_id
              and c.owner_id = (select auth.uid())
        )
    );

create policy flavors_public_select_active on public.flavors
    for select to anon
    using (
        is_active = true
        and exists (
            select 1 from public.catalogs c
            where c.id = flavors.catalog_id
              and c.is_active = true
        )
    );

-- 5. RLS para product_flavors
alter table public.product_flavors enable row level security;
revoke all on public.product_flavors from public, anon, authenticated;

grant select, insert, update, delete on public.product_flavors to authenticated;
grant select (product_id, flavor_id, catalog_id, sort_order, additional_price, is_available) on public.product_flavors to anon;

create policy product_flavors_select_own on public.product_flavors
    for select to authenticated
    using (
        exists (
            select 1 from public.catalogs c
            where c.id = product_flavors.catalog_id
              and c.owner_id = (select auth.uid())
        )
    );

create policy product_flavors_insert_own on public.product_flavors
    for insert to authenticated
    with check (
        exists (
            select 1 from public.catalogs c
            where c.id = product_flavors.catalog_id
              and c.owner_id = (select auth.uid())
        )
    );

create policy product_flavors_update_own on public.product_flavors
    for update to authenticated
    using (
        exists (
            select 1 from public.catalogs c
            where c.id = product_flavors.catalog_id
              and c.owner_id = (select auth.uid())
        )
    )
    with check (
        exists (
            select 1 from public.catalogs c
            where c.id = product_flavors.catalog_id
              and c.owner_id = (select auth.uid())
        )
    );

create policy product_flavors_delete_own on public.product_flavors
    for delete to authenticated
    using (
        exists (
            select 1 from public.catalogs c
            where c.id = product_flavors.catalog_id
              and c.owner_id = (select auth.uid())
        )
    );

create policy product_flavors_public_select_active on public.product_flavors
    for select to anon
    using (
        is_available = true
        and exists (
            select 1 from public.products p
            join public.catalogs c on c.id = p.catalog_id
            where p.id = product_flavors.product_id
              and p.status = 'active'
              and c.is_active = true
        )
    );

-- 6. Atualização da policy de Storage para suportar imagens de sabores (quando storage estiver presente)
do $$
begin
    if to_regclass('storage.objects') is not null and exists (
        select 1 from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'storage' and p.proname = 'foldername'
    ) then
        execute 'drop policy if exists "catalog_product_images_insert_own" on storage.objects';
        execute $pol$
            create policy "catalog_product_images_insert_own"
            on storage.objects
            for insert to authenticated
            with check (
                bucket_id = 'catalog-products'
                and (storage.foldername(storage.objects.name))[1] = (select auth.uid())::text
                and (
                    exists (
                        select 1
                        from public.products
                        join public.catalogs on catalogs.id = products.catalog_id
                        where products.id::text = (storage.foldername(storage.objects.name))[3]
                            and catalogs.id::text = (storage.foldername(storage.objects.name))[2]
                            and catalogs.owner_id = (select auth.uid())
                    )
                    or
                    exists (
                        select 1
                        from public.flavors
                        join public.catalogs on catalogs.id = flavors.catalog_id
                        where flavors.id::text = (storage.foldername(storage.objects.name))[3]
                            and catalogs.id::text = (storage.foldername(storage.objects.name))[2]
                            and catalogs.owner_id = (select auth.uid())
                    )
                )
            )
        $pol$;
    end if;
end;
$$;

-- 7. Atualização da função RPC delete_own_paused_catalog para incluir sabores e suas imagens
create or replace function public.delete_own_paused_catalog(catalog_id_to_delete uuid)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
    current_user_id uuid := auth.uid();
    catalog_logo_path text;
    catalog_product_image_paths text[] := array[]::text[];
    catalog_flavor_image_paths text[] := array[]::text[];
    deleted_catalog_id uuid;
begin
    if current_user_id is null then
        raise exception using
            errcode = '42501',
            message = 'É necessário estar autenticado para excluir um catálogo.';
    end if;

    select catalog.logo_path
    into catalog_logo_path
    from public.catalogs as catalog
    where catalog.id = catalog_id_to_delete
        and catalog.owner_id = current_user_id
        and catalog.is_active = false
    for update;

    if not found then
        raise exception using
            errcode = 'P0001',
            message = 'O catálogo não existe, não pertence à conta ou não está pausado.';
    end if;

    select coalesce(
        array_agg(product.image_path) filter (where product.image_path is not null),
        array[]::text[]
    )
    into catalog_product_image_paths
    from public.products as product
    where product.catalog_id = catalog_id_to_delete;

    select coalesce(
        array_agg(flavor.image_path) filter (where flavor.image_path is not null),
        array[]::text[]
    )
    into catalog_flavor_image_paths
    from public.flavors as flavor
    where flavor.catalog_id = catalog_id_to_delete;

    delete from public.product_flavors as pf
    where pf.catalog_id = catalog_id_to_delete;

    delete from public.flavors as flavor
    where flavor.catalog_id = catalog_id_to_delete;

    delete from public.products as product
    where product.catalog_id = catalog_id_to_delete;

    delete from public.categories as category
    where category.catalog_id = catalog_id_to_delete;

    delete from public.catalogs as catalog
    where catalog.id = catalog_id_to_delete
        and catalog.owner_id = current_user_id
        and catalog.is_active = false
    returning catalog.id into deleted_catalog_id;

    if deleted_catalog_id is null then
        raise exception using
            errcode = 'P0001',
            message = 'O catálogo não pôde ser excluído.';
    end if;

    return jsonb_build_object(
        'catalog_id', deleted_catalog_id,
        'logo_path', catalog_logo_path,
        'product_image_paths', to_jsonb(catalog_product_image_paths || catalog_flavor_image_paths)
    );
end;
$$;

revoke execute on function public.delete_own_paused_catalog(uuid) from public, anon;
grant execute on function public.delete_own_paused_catalog(uuid) to authenticated;

comment on table public.flavors is 'Sabores ou composições configuráveis por catálogo para montagem de combos ou porções.';
comment on table public.product_flavors is 'Relação entre produtos flavor_bundle e os sabores disponíveis com acréscimo opcional.';

notify pgrst, 'reload schema';
commit;

select 'SABORES_E_PRODUTO_FLAVORS_APLICADOS' as resultado,
       (select count(*) from public.flavors) as flavors_criados,
       (select count(*) from public.product_flavors) as product_flavors_criados;
