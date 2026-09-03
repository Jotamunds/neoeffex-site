-- v0.1.12 — exclusão segura de catálogo pausado pelo próprio proprietário.
--
-- Execute depois de 009_single_catalog_per_owner.sql.
-- A função remove somente dados do banco. Os arquivos retornados são apagados
-- pelo Admin através da Storage API, evitando objetos órfãos.

begin;

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
        'product_image_paths', to_jsonb(catalog_product_image_paths)
    );
end;
$$;

revoke execute on function public.delete_own_paused_catalog(uuid) from public;
revoke execute on function public.delete_own_paused_catalog(uuid) from anon;
grant execute on function public.delete_own_paused_catalog(uuid) to authenticated;

comment on function public.delete_own_paused_catalog(uuid) is
    'Exclui, em uma transação, somente um catálogo pausado pertencente ao usuário autenticado.';

-- Depois da exclusão do registro, a política ainda precisa permitir que o
-- proprietário remova a antiga logo via Storage API usando seu próprio prefixo.
drop policy if exists "catalog_identity_logos_delete_own" on storage.objects;
create policy "catalog_identity_logos_delete_own"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'catalog-identities'
    and (storage.foldername(storage.objects.name))[1] = (select auth.uid())::text
);

commit;
