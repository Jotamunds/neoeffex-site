-- Somente leitura. Execute após a migration 20260909194500_catalog_product_types_groups.sql.
-- Retorna JSON com validações de integridade, permissões e backfill.
with distinct_legacy_types as (
    select p.catalog_id, lower(btrim(p.product_type)) as norm_name
    from public.products p
    where p.product_type is not null and btrim(p.product_type) <> ''
    group by p.catalog_id, lower(btrim(p.product_type))
),
distinct_persisted_types as (
    select pt.catalog_id, lower(btrim(pt.name)) as norm_name
    from public.product_types pt
    group by pt.catalog_id, lower(btrim(pt.name))
),
distinct_legacy_groups as (
    select p.catalog_id, lower(btrim(g.val)) as norm_name
    from public.products p, unnest(p.product_groups) as g(val)
    where g.val is not null and btrim(g.val) <> ''
    group by p.catalog_id, lower(btrim(g.val))
),
distinct_persisted_groups as (
    select pg.catalog_id, lower(btrim(pg.name)) as norm_name
    from public.product_groups pg
    group by pg.catalog_id, lower(btrim(pg.name))
),
checks as (
    select
        -- Tabelas existem
        to_regclass('public.product_types') is not null as tabela_product_types_existe,
        to_regclass('public.product_groups') is not null as tabela_product_groups_existe,
        -- RLS ativo
        (select relrowsecurity from pg_class where oid = 'public.product_types'::regclass) as rls_product_types_ativo,
        (select relrowsecurity from pg_class where oid = 'public.product_groups'::regclass) as rls_product_groups_ativo,
        -- Anon sem acesso
        not has_table_privilege('anon', 'public.product_types', 'SELECT')
            and not has_table_privilege('anon', 'public.product_types', 'INSERT')
            and not has_table_privilege('anon', 'public.product_types', 'UPDATE')
            and not has_table_privilege('anon', 'public.product_types', 'DELETE') as anon_sem_acesso_types,
        not has_table_privilege('anon', 'public.product_groups', 'SELECT')
            and not has_table_privilege('anon', 'public.product_groups', 'INSERT')
            and not has_table_privilege('anon', 'public.product_groups', 'UPDATE')
            and not has_table_privilege('anon', 'public.product_groups', 'DELETE') as anon_sem_acesso_groups,
        -- Authenticated com privilégios
        has_table_privilege('authenticated', 'public.product_types', 'SELECT')
            and has_table_privilege('authenticated', 'public.product_types', 'INSERT')
            and has_table_privilege('authenticated', 'public.product_types', 'UPDATE')
            and has_table_privilege('authenticated', 'public.product_types', 'DELETE') as authenticated_pode_gerenciar_types,
        has_table_privilege('authenticated', 'public.product_groups', 'SELECT')
            and has_table_privilege('authenticated', 'public.product_groups', 'INSERT')
            and has_table_privilege('authenticated', 'public.product_groups', 'UPDATE')
            and has_table_privilege('authenticated', 'public.product_groups', 'DELETE') as authenticated_pode_gerenciar_groups,
        -- Todos os registros possuem catálogo válido
        not exists (
            select 1 from public.product_types pt
            left join public.catalogs c on c.id = pt.catalog_id
            where c.id is null
        ) as todos_types_possuem_catalogo_valido,
        not exists (
            select 1 from public.product_groups pg
            left join public.catalogs c on c.id = pg.catalog_id
            where c.id is null
        ) as todos_groups_possuem_catalogo_valido,
        -- Sem duplicidade lógica por catálogo
        not exists (
            select 1 from public.product_types
            group by catalog_id, lower(name)
            having count(*) > 1
        ) as sem_types_duplicados_por_catalogo,
        not exists (
            select 1 from public.product_groups
            group by catalog_id, lower(name)
            having count(*) > 1
        ) as sem_groups_duplicados_por_catalogo,
        -- Nomes válidos (não vazios, sem espaços nas pontas, sem vírgula nos grupos)
        not exists (
            select 1 from public.product_types
            where name is null or char_length(name) not between 1 and 60 or name <> btrim(name)
        ) as names_types_validos,
        not exists (
            select 1 from public.product_groups
            where name is null or char_length(name) not between 1 and 60 or name <> btrim(name) or position(',' in name) > 0
        ) as names_groups_validos,
        -- Sort order válido (>= 0)
        not exists (
            select 1 from public.product_types where sort_order < 0
        ) as sort_order_types_valido,
        not exists (
            select 1 from public.product_groups where sort_order < 0
        ) as sort_order_groups_valido,
        -- Backfill conferido: 100% dos tipos legados foram importados
        not exists (
            select 1 from distinct_legacy_types lt
            left join distinct_persisted_types pt on pt.catalog_id = lt.catalog_id and pt.norm_name = lt.norm_name
            where pt.catalog_id is null
        ) as backfill_types_completo,
        -- Backfill conferido: 100% dos grupos legados foram importados
        not exists (
            select 1 from distinct_legacy_groups lg
            left join distinct_persisted_groups pg on pg.catalog_id = lg.catalog_id and pg.norm_name = lg.norm_name
            where pg.catalog_id is null
        ) as backfill_groups_completo
)
select jsonb_pretty(jsonb_build_object(
    'verificacoes', (select to_jsonb(checks) from checks),
    'totais', jsonb_build_object(
        'product_types', (select count(*) from public.product_types),
        'product_groups', (select count(*) from public.product_groups)
    )
)) as verificacao;
