-- Neoeffex Admin / Catálogo — Perfis de catálogo e modos de compra (Etapa 1).
-- Executar UMA VEZ no SQL Editor, como postgres, após 20260909194500_catalog_product_types_groups.sql.
-- SQL transacional: qualquer erro cancela o conjunto.
-- Adiciona catalogs.catalog_profile, catalogs.minimum_order_quantity e products.purchase_mode.
-- Preserva compatibilidade retroativa total com registros existentes (default standard e simple).
begin;
set local lock_timeout = '10s';
set local statement_timeout = '60s';

do $$
begin
    if to_regclass('public.catalogs') is null
       or to_regclass('public.products') is null then
        raise exception 'Base incompatível. Verifique as migrações anteriores antes de continuar.';
    end if;
end;
$$;

lock table public.catalogs, public.products in share row exclusive mode;

alter table public.catalogs
    add column if not exists catalog_profile text not null default 'standard',
    add column if not exists minimum_order_quantity integer;

do $$
begin
    if not exists (
        select 1 from pg_constraint
        where conname = 'catalogs_catalog_profile_check'
          and conrelid = 'public.catalogs'::regclass
    ) then
        alter table public.catalogs
            add constraint catalogs_catalog_profile_check
            check (catalog_profile in ('standard', 'food', 'marmitas', 'services'));
    end if;

    if not exists (
        select 1 from pg_constraint
        where conname = 'catalogs_minimum_order_quantity_check'
          and conrelid = 'public.catalogs'::regclass
    ) then
        alter table public.catalogs
            add constraint catalogs_minimum_order_quantity_check
            check (minimum_order_quantity is null or minimum_order_quantity > 0);
    end if;
end;
$$;

alter table public.products
    add column if not exists purchase_mode text not null default 'simple';

do $$
begin
    if not exists (
        select 1 from pg_constraint
        where conname = 'products_purchase_mode_check'
          and conrelid = 'public.products'::regclass
    ) then
        alter table public.products
            add constraint products_purchase_mode_check
            check (purchase_mode in ('simple', 'flavor_bundle', 'configurable'));
    end if;
end;
$$;

-- Permissões públicas anônimas de leitura para o catálogo
grant select (catalog_profile, minimum_order_quantity) on public.catalogs to anon;
grant select (purchase_mode) on public.products to anon;

comment on column public.catalogs.catalog_profile is 'Perfil do catálogo (standard, food, marmitas, services); define capacidades e presets de recursos.';
comment on column public.catalogs.minimum_order_quantity is 'Quantidade mínima de itens para finalização do pedido; nulo quando sem restrição.';
comment on column public.products.purchase_mode is 'Modo de compra do produto: simple (fluxo direto) ou flavor_bundle (seleção de sabores).';

notify pgrst, 'reload schema';
commit;

select 'PERFIS_E_MODOS_DE_COMPRA_APLICADOS' as resultado,
       (select count(*) from public.catalogs) as catalogos_atualizados,
       (select count(*) from public.products) as produtos_atualizados;
