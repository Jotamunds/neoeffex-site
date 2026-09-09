-- Somente leitura. Execute após 20260907235435_store_catalog_organization.sql.
-- Envie o JSON retornado. Não contém senhas, tokens nem chaves privadas.
with checks as (
    select
        not exists (
            select 1 from public.stores s left join public.catalogs c on c.store_id = s.id
            group by s.id having count(c.id) <> 1
        ) as cada_loja_tem_um_catalogo,
        not exists (
            select 1 from public.catalogs c left join public.stores s on s.id = c.store_id
            where s.id is null or s.owner_id <> c.owner_id
        ) as catalogos_com_loja_e_dono_corretos,
        not exists (
            select 1 from public.categories c left join public.categories p
                on p.id = c.parent_id and p.catalog_id = c.catalog_id
            where c.parent_id is not null and (p.id is null or p.parent_id is not null)
        ) as hierarquia_valida,
        (select relrowsecurity from pg_class where oid = 'public.stores'::regclass) as rls_lojas_ativo,
        not has_table_privilege('anon', 'public.stores', 'SELECT') as lojas_privadas,
        has_column_privilege('anon', 'public.categories', 'parent_id', 'SELECT')
            and has_column_privilege('anon', 'public.products', 'product_type', 'SELECT')
            and has_column_privilege('anon', 'public.products', 'product_groups', 'SELECT') as classificacao_publica_legivel,
        exists (
            select 1 from public.catalogs c join auth.users u on u.id = c.owner_id
            where c.slug = 'lu-leve-e-saudavel' and lower(u.email) = 'm.luzimarjw@gmail.com'
        ) as conta_lu_correta
)
select jsonb_pretty(jsonb_build_object(
    'verificacoes', (select to_jsonb(checks) from checks),
    'totais', jsonb_build_object(
        'lojas', (select count(*) from public.stores),
        'catalogos', (select count(*) from public.catalogs),
        'categorias', (select count(*) from public.categories),
        'produtos', (select count(*) from public.products)
    ),
    'lojas', (select jsonb_agg(jsonb_build_object(
        'loja_id', c.store_id, 'catalogo_id', c.id, 'nome', c.name, 'slug', c.slug,
        'ativo', c.is_active,
        'categorias', (select count(*) from public.categories x where x.catalog_id = c.id),
        'produtos', (select count(*) from public.products x where x.catalog_id = c.id)
    ) order by c.slug) from public.catalogs c)
)) as verificacao;
