-- Somente leitura. Execute após a migration 20260910200000_catalog_logo_aspect_ratio.sql.
-- Retorna JSON com validações de integridade, colunas, permissões e restrições.
with checks as (
    select
        -- Coluna existe
        exists (
            select 1 from information_schema.columns
            where table_schema = 'public' and table_name = 'catalogs' and column_name = 'logo_aspect_ratio'
        ) as coluna_logo_aspect_ratio_existe,

        -- Constraint existe
        exists (
            select 1 from pg_constraint
            where conname = 'catalogs_logo_aspect_ratio_check' and conrelid = 'public.catalogs'::regclass
        ) as constraint_logo_aspect_ratio_existe,

        -- Permissões anon
        has_column_privilege('anon', 'public.catalogs', 'logo_aspect_ratio', 'SELECT') as anon_le_logo_aspect_ratio,

        -- Registros existentes possuem valores válidos
        not exists (
            select 1 from public.catalogs
            where logo_aspect_ratio is null or logo_aspect_ratio not in ('square', 'portrait_3_4', 'landscape_4_3')
        ) as todos_catalogos_tem_proporcao_valida
)
select json_build_object(
    'versao', 'Proporção de Logo do Comércio',
    'status', case when (
        coluna_logo_aspect_ratio_existe and
        constraint_logo_aspect_ratio_existe and
        anon_le_logo_aspect_ratio and
        todos_catalogos_tem_proporcao_valida
    ) then 'PASS' else 'FAIL' end,
    'verificacoes', row_to_json(checks.*),
    'totais', json_build_object(
        'catalogs', (select count(*) from public.catalogs)
    )
)::text as verificacao
from checks;
