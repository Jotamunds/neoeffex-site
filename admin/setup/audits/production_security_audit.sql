-- Auditoria somente de leitura para a v0.1.12.
-- Execute depois de 010_delete_paused_catalog.sql.
-- O resultado esperado é PASS em todas as linhas.

with
required_authenticated_privileges (table_name, privilege_type) as (
    values
        ('catalogs', 'SELECT'),
        ('catalogs', 'INSERT'),
        ('catalogs', 'UPDATE'),
        ('catalogs', 'DELETE'),
        ('categories', 'SELECT'),
        ('categories', 'INSERT'),
        ('categories', 'UPDATE'),
        ('categories', 'DELETE'),
        ('products', 'SELECT'),
        ('products', 'INSERT'),
        ('products', 'UPDATE'),
        ('products', 'DELETE')
),
required_anon_columns (table_name, column_name) as (
    values
        ('catalogs', 'id'),
        ('catalogs', 'name'),
        ('catalogs', 'slug'),
        ('catalogs', 'is_active'),
        ('catalogs', 'whatsapp_number'),
        ('catalogs', 'orders_enabled'),
        ('catalogs', 'order_message'),
        ('catalogs', 'logo_path'),
        ('catalogs', 'short_description'),
        ('catalogs', 'service_area'),
        ('catalogs', 'business_hours'),
        ('catalogs', 'fulfillment_mode'),
        ('categories', 'id'),
        ('categories', 'catalog_id'),
        ('categories', 'name'),
        ('categories', 'sort_order'),
        ('categories', 'created_at'),
        ('products', 'id'),
        ('products', 'catalog_id'),
        ('products', 'name'),
        ('products', 'description'),
        ('products', 'category_id'),
        ('products', 'price'),
        ('products', 'status'),
        ('products', 'image_path'),
        ('products', 'sort_order'),
        ('products', 'created_at')
),
checks (check_name, passed, details) as (
    select
        'RLS habilitado nas tabelas públicas',
        count(*) = 3 and bool_and(table_class.relrowsecurity),
        'catalogs, categories e products precisam estar com RLS habilitado'
    from pg_class as table_class
    join pg_namespace as table_schema on table_schema.oid = table_class.relnamespace
    where table_schema.nspname = 'public'
        and table_class.relname in ('catalogs', 'categories', 'products')

    union all

    select
        'RLS habilitado no Storage',
        count(*) = 1 and bool_and(table_class.relrowsecurity),
        'storage.objects precisa permanecer protegido por RLS'
    from pg_class as table_class
    join pg_namespace as table_schema on table_schema.oid = table_class.relnamespace
    where table_schema.nspname = 'storage'
        and table_class.relname = 'objects'

    union all

    select
        'authenticated possui CRUD explícito',
        not exists (
            select 1
            from required_authenticated_privileges as expected
            where not has_table_privilege(
                'authenticated',
                format('public.%I', expected.table_name),
                expected.privilege_type
            )
        ),
        'o painel precisa de SELECT, INSERT, UPDATE e DELETE nas três tabelas'

    union all

    select
        'anon não possui escrita',
        not exists (
            select 1
            from (values ('catalogs'), ('categories'), ('products')) as expected(table_name)
            where has_table_privilege('anon', format('public.%I', expected.table_name), 'INSERT')
                or has_table_privilege('anon', format('public.%I', expected.table_name), 'UPDATE')
                or has_table_privilege('anon', format('public.%I', expected.table_name), 'DELETE')
        ),
        'visitantes não podem cadastrar, editar ou excluir dados'

    union all

    select
        'anon possui somente as colunas públicas necessárias',
        not has_table_privilege('anon', 'public.catalogs', 'SELECT')
        and not has_table_privilege('anon', 'public.categories', 'SELECT')
        and not has_table_privilege('anon', 'public.products', 'SELECT')
        and not exists (
            select 1
            from required_anon_columns as expected
            where not has_column_privilege(
                'anon',
                format('public.%I', expected.table_name),
                expected.column_name,
                'SELECT'
            )
        )
        and not exists (
            select 1
            from information_schema.column_privileges as privilege
            left join required_anon_columns as expected
                on expected.table_name = privilege.table_name
                and expected.column_name = privilege.column_name
            where privilege.table_schema = 'public'
                and privilege.grantee = 'anon'
                and privilege.privilege_type = 'SELECT'
                and privilege.table_name in ('catalogs', 'categories', 'products')
                and expected.column_name is null
        ),
        'owner_id, updated_at e demais campos administrativos devem permanecer privados'

    union all

    select
        'políticas administrativas pertencem somente a authenticated',
        count(*) = 12
            and bool_and(policy.roles = array['authenticated']::name[]),
        'esperadas 12 políticas de proprietário para catálogo, categoria e produto'
    from pg_policies as policy
    where policy.schemaname = 'public'
        and policy.tablename in ('catalogs', 'categories', 'products')
        and policy.policyname in (
            'catalogs_select_own',
            'catalogs_insert_own',
            'catalogs_update_own',
            'catalogs_delete_own',
            'categories_select_own_catalog',
            'categories_insert_own_catalog',
            'categories_update_own_catalog',
            'categories_delete_own_catalog',
            'products_select_own_catalog',
            'products_insert_own_catalog',
            'products_update_own_catalog',
            'products_delete_own_catalog'
        )

    union all

    select
        'políticas públicas pertencem somente a anon',
        count(*) = 3
            and bool_and(policy.roles = array['anon']::name[]),
        'authenticated não deve herdar as políticas públicas de catálogos ativos'
    from pg_policies as policy
    where policy.schemaname = 'public'
        and policy.policyname in (
            'catalogs_public_select_active',
            'categories_public_select_active_catalog',
            'products_public_select_active'
        )

    union all

    select
        'bucket público possui limites seguros',
        count(*) = 1
            and bool_and(bucket.public)
            and bool_and(bucket.file_size_limit = 5242880)
            and bool_and(
                bucket.allowed_mime_types @> array['image/jpeg', 'image/png', 'image/webp']::text[]
                and cardinality(bucket.allowed_mime_types) = 3
            ),
        'catalog-products deve aceitar somente JPEG, PNG e WebP de até 5 MB'
    from storage.buckets as bucket
    where bucket.id = 'catalog-products'

    union all

    select
        'bucket de logos possui limites seguros',
        count(*) = 1
            and bool_and(bucket.public)
            and bool_and(bucket.file_size_limit = 2097152)
            and bool_and(
                bucket.allowed_mime_types @> array['image/jpeg', 'image/png', 'image/webp']::text[]
                and cardinality(bucket.allowed_mime_types) = 3
            ),
        'catalog-identities deve aceitar somente JPEG, PNG e WebP de até 2 MB'
    from storage.buckets as bucket
    where bucket.id = 'catalog-identities'

    union all

    select
        'políticas do Storage pertencem somente a authenticated',
        count(*) = 3
            and bool_and(policy.roles = array['authenticated']::name[]),
        'upload, consulta administrativa e exclusão precisam exigir sessão autenticada'
    from pg_policies as policy
    where policy.schemaname = 'storage'
        and policy.tablename = 'objects'
        and policy.policyname in (
            'catalog_product_images_select_own',
            'catalog_product_images_insert_own',
            'catalog_product_images_delete_own'
        )

    union all

    select
        'políticas das logos pertencem somente a authenticated',
        count(*) = 3
            and bool_and(policy.roles = array['authenticated']::name[]),
        'consulta, upload e exclusão de logos precisam exigir sessão autenticada'
    from pg_policies as policy
    where policy.schemaname = 'storage'
        and policy.tablename = 'objects'
        and policy.policyname in (
            'catalog_identity_logos_select_own',
            'catalog_identity_logos_insert_own',
            'catalog_identity_logos_delete_own'
        )

    union all

    select
        'função de atualização usa SECURITY INVOKER sem execução pública',
        count(*) = 1
            and bool_and(not routine.prosecdef)
            and not has_function_privilege('anon', 'public.set_updated_at()', 'EXECUTE')
            and not has_function_privilege('authenticated', 'public.set_updated_at()', 'EXECUTE'),
        'set_updated_at não pode executar com privilégios elevados nem aceitar chamadas da API'
    from pg_proc as routine
    join pg_namespace as routine_schema on routine_schema.oid = routine.pronamespace
    where routine_schema.nspname = 'public'
        and routine.proname = 'set_updated_at'

    union all

    select
        'exclusão de catálogo usa SECURITY INVOKER e privilégio mínimo',
        count(*) = 1
            and bool_and(not routine.prosecdef)
            and coalesce(not has_function_privilege(
                'anon',
                to_regprocedure('public.delete_own_paused_catalog(uuid)'),
                'EXECUTE'
            ), false)
            and coalesce(has_function_privilege(
                'authenticated',
                to_regprocedure('public.delete_own_paused_catalog(uuid)'),
                'EXECUTE'
            ), false),
        'somente authenticated pode chamar delete_own_paused_catalog e a função não pode elevar privilégios'
    from pg_proc as routine
    join pg_namespace as routine_schema on routine_schema.oid = routine.pronamespace
    where routine_schema.nspname = 'public'
        and routine.proname = 'delete_own_paused_catalog'
)
select
    check_name as verificacao,
    case when passed then 'PASS' else 'FAIL' end as resultado,
    details as orientacao
from checks
order by case when passed then 1 else 0 end, check_name;
