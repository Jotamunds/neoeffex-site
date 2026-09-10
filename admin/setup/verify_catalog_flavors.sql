-- Somente leitura. Execute após a migration 20260910173000_catalog_flavors.sql.
-- Retorna JSON com validações de integridade, constraints, RLS e permissões de sabores.
with checks as (
    select
        -- Tabelas existem
        to_regclass('public.flavors') is not null as tabela_flavors_existe,
        to_regclass('public.product_flavors') is not null as tabela_product_flavors_existe,

        -- RLS ativo
        (select relrowsecurity from pg_class where oid = 'public.flavors'::regclass) as rls_flavors_ativo,
        (select relrowsecurity from pg_class where oid = 'public.product_flavors'::regclass) as rls_product_flavors_ativo,

        -- FKs compostas existem em product_flavors
        exists (
            select 1 from pg_constraint
            where conname = 'product_flavors_product_fk' and conrelid = 'public.product_flavors'::regclass
        ) as fk_composta_product_existe,
        exists (
            select 1 from pg_constraint
            where conname = 'product_flavors_flavor_fk' and conrelid = 'public.product_flavors'::regclass
        ) as fk_composta_flavor_existe,

        -- Privilégios authenticated
        has_table_privilege('authenticated', 'public.flavors', 'SELECT')
            and has_table_privilege('authenticated', 'public.flavors', 'INSERT')
            and has_table_privilege('authenticated', 'public.flavors', 'UPDATE')
            and has_table_privilege('authenticated', 'public.flavors', 'DELETE') as authenticated_gerencia_flavors,
        has_table_privilege('authenticated', 'public.product_flavors', 'SELECT')
            and has_table_privilege('authenticated', 'public.product_flavors', 'INSERT')
            and has_table_privilege('authenticated', 'public.product_flavors', 'UPDATE')
            and has_table_privilege('authenticated', 'public.product_flavors', 'DELETE') as authenticated_gerencia_product_flavors,

        -- Privilégios anon (somente leitura pública de colunas permitidas)
        has_column_privilege('anon', 'public.flavors', 'name', 'SELECT')
            and not has_table_privilege('anon', 'public.flavors', 'INSERT')
            and not has_table_privilege('anon', 'public.flavors', 'UPDATE')
            and not has_table_privilege('anon', 'public.flavors', 'DELETE') as anon_apenas_le_flavors,
        has_column_privilege('anon', 'public.product_flavors', 'additional_price', 'SELECT')
            and not has_table_privilege('anon', 'public.product_flavors', 'INSERT')
            and not has_table_privilege('anon', 'public.product_flavors', 'UPDATE')
            and not has_table_privilege('anon', 'public.product_flavors', 'DELETE') as anon_apenas_le_product_flavors
)
select json_build_object(
    'versao', 'Etapa 2 — Sabores e Relação Produto x Sabor',
    'status', case when (
        tabela_flavors_existe and
        tabela_product_flavors_existe and
        rls_flavors_ativo and
        rls_product_flavors_ativo and
        fk_composta_product_existe and
        fk_composta_flavor_existe and
        authenticated_gerencia_flavors and
        authenticated_gerencia_product_flavors and
        anon_apenas_le_flavors and
        anon_apenas_le_product_flavors
    ) then 'PASS' else 'FAIL' end,
    'verificacoes', row_to_json(checks.*),
    'totais', json_build_object(
        'flavors', (select count(*) from public.flavors),
        'product_flavors', (select count(*) from public.product_flavors)
    )
)::text as verificacao
from checks;
