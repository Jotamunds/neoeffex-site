-- Nova Etapa 8: identidade básica do comércio por catálogo.
-- Execute depois de 007_security_hardening.sql e antes de publicar o frontend da versão 0.1.8.
-- Preserva as políticas da Etapa 9 e adiciona somente os campos públicos e o Storage da logo.

begin;

alter table public.catalogs
    add column if not exists logo_path text,
    add column if not exists short_description text,
    add column if not exists service_area text,
    add column if not exists business_hours text,
    add column if not exists fulfillment_mode text;

do $$
begin
    if not exists (
        select 1 from pg_constraint
        where conname = 'catalogs_logo_path_check'
            and conrelid = 'public.catalogs'::regclass
    ) then
        alter table public.catalogs
            add constraint catalogs_logo_path_check
            check (
                logo_path is null
                or logo_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9]{10,16}\.(jpg|png|webp)$'
            );
    end if;

    if not exists (
        select 1 from pg_constraint
        where conname = 'catalogs_short_description_check'
            and conrelid = 'public.catalogs'::regclass
    ) then
        alter table public.catalogs
            add constraint catalogs_short_description_check
            check (
                short_description is null
                or char_length(trim(short_description)) between 1 and 200
            );
    end if;

    if not exists (
        select 1 from pg_constraint
        where conname = 'catalogs_service_area_check'
            and conrelid = 'public.catalogs'::regclass
    ) then
        alter table public.catalogs
            add constraint catalogs_service_area_check
            check (
                service_area is null
                or char_length(trim(service_area)) between 1 and 200
            );
    end if;

    if not exists (
        select 1 from pg_constraint
        where conname = 'catalogs_business_hours_check'
            and conrelid = 'public.catalogs'::regclass
    ) then
        alter table public.catalogs
            add constraint catalogs_business_hours_check
            check (
                business_hours is null
                or char_length(trim(business_hours)) between 1 and 200
            );
    end if;

    if not exists (
        select 1 from pg_constraint
        where conname = 'catalogs_fulfillment_mode_check'
            and conrelid = 'public.catalogs'::regclass
    ) then
        alter table public.catalogs
            add constraint catalogs_fulfillment_mode_check
            check (
                fulfillment_mode is null
                or fulfillment_mode in ('pickup', 'delivery', 'both')
            );
    end if;
end;
$$;

insert into storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
values (
    'catalog-identities',
    'catalog-identities',
    true,
    2097152,
    array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- A política pública de catálogos ativos da Etapa 9 continua limitando as linhas.
-- Somente as novas colunas de identidade são adicionadas à leitura anônima.
grant select (
    logo_path,
    short_description,
    service_area,
    business_hours,
    fulfillment_mode
) on table public.catalogs to anon;

-- Logo: {owner_id}/{catalog_id}/{timestamp}.{jpg|png|webp}
-- Não usa upsert: a logo anterior só é removida depois de a nova estar vinculada ao catálogo.
drop policy if exists "catalog_identity_logos_select_own" on storage.objects;
create policy "catalog_identity_logos_select_own"
on storage.objects
for select
to authenticated
using (
    bucket_id = 'catalog-identities'
    and (storage.foldername(storage.objects.name))[1] = (select auth.uid())::text
    and exists (
        select 1
        from public.catalogs as catalog
        where catalog.id::text = (storage.foldername(storage.objects.name))[2]
            and catalog.owner_id = (select auth.uid())
    )
);

drop policy if exists "catalog_identity_logos_insert_own" on storage.objects;
create policy "catalog_identity_logos_insert_own"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'catalog-identities'
    and storage.objects.name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/[0-9]{10,16}\.(jpg|png|webp)$'
    and (storage.foldername(storage.objects.name))[1] = (select auth.uid())::text
    and exists (
        select 1
        from public.catalogs as catalog
        where catalog.id::text = (storage.foldername(storage.objects.name))[2]
            and catalog.owner_id = (select auth.uid())
    )
);

drop policy if exists "catalog_identity_logos_delete_own" on storage.objects;
create policy "catalog_identity_logos_delete_own"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'catalog-identities'
    and (storage.foldername(storage.objects.name))[1] = (select auth.uid())::text
    and exists (
        select 1
        from public.catalogs as catalog
        where catalog.id::text = (storage.foldername(storage.objects.name))[2]
            and catalog.owner_id = (select auth.uid())
    )
);

commit;
