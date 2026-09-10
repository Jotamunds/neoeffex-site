-- Somente leitura. Execute após a migration 20260910170000_catalog_profiles_purchase_mode.sql.
-- Retorna JSON com validações de integridade, colunas, permissões e restrições.
with checks as (
    select
        -- Colunas existem
        exists (
            select 1 from information_schema.columns
            where table_schema = 'public' and table_name = 'catalogs' and column_name = 'catalog_profile'
        ) as coluna_catalog_profile_existe,
        exists (
            select 1 from information_schema.columns
            where table_schema = 'public' and table_name = 'catalogs' and column_name = 'minimum_order_quantity'
        ) as coluna_minimum_order_quantity_existe,
        exists (
            select 1 from information_schema.columns
            where table_schema = 'public' and table_name = 'products' and column_name = 'purchase_mode'
        ) as coluna_purchase_mode_existe,

        -- Constraints existem
        exists (
            select 1 from pg_constraint
            where conname = 'catalogs_catalog_profile_check' and conrelid = 'public.catalogs'::regclass
        ) as constraint_catalog_profile_existe,
        exists (
            select 1 from pg_constraint
            where conname = 'catalogs_minimum_order_quantity_check' and conrelid = 'public.catalogs'::regclass
        ) as constraint_minimum_order_quantity_existe,
        exists (
            select 1 from pg_constraint
            where conname = 'products_purchase_mode_check' and conrelid = 'public.products'::regclass
        ) as constraint_purchase_mode_existe,

        -- Permissões anon
        has_column_privilege('anon', 'public.catalogs', 'catalog_profile', 'SELECT') as anon_le_catalog_profile,
        has_column_privilege('anon', 'public.catalogs', 'minimum_order_quantity', 'SELECT') as anon_le_minimum_order_quantity,
        has_column_privilege('anon', 'public.products', 'purchase_mode', 'SELECT') as anon_le_purchase_mode,

        -- Registros existentes possuem valores válidos
        not exists (
            select 1 from public.catalogs
            where catalog_profile is null or catalog_profile not in ('standard', 'food', 'marmitas', 'services')
        ) as todos_catalogos_tem_perfil_valido,
        not exists (
            select 1 from public.products
            where purchase_mode is null or purchase_mode not in ('simple', 'flavor_bundle', 'configurable')
        ) as todos_produtos_tem_purchase_mode_valido
)
select json_build_object(
    'versao', 'Etapa 1 — Perfis e Modos de Compra',
    'status', case when (
        coluna_catalog_profile_existe and
        coluna_minimum_order_quantity_existe and
        coluna_purchase_mode_existe and
        constraint_catalog_profile_existe and
        constraint_minimum_order_quantity_existe and
        constraint_purchase_mode_existe and
        anon_le_catalog_profile and
        anon_le_minimum_order_quantity and
        anon_le_purchase_mode and
        todos_catalogos_tem_perfil_valido and
        todos_produtos_tem_purchase_mode_valido
    ) then 'PASS' else 'FAIL' end,
    'verificacoes', row_to_json(checks.*),
    'totais', json_build_object(
        'catalogs', (select count(*) from public.catalogs),
        'products', (select count(*) from public.products)
    )
)::text as verificacao
from checks;
