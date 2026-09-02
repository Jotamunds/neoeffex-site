-- Etapa 7: imagens opcionais dos produtos usando Supabase Storage.
-- Pode ser executado novamente: coluna, bucket, restrição, privilégios e políticas são idempotentes.

begin;

alter table public.products
    add column if not exists image_path text;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'products_image_path_check'
            and conrelid = 'public.products'::regclass
    ) then
        alter table public.products
            add constraint products_image_path_check
            check (
                image_path is null
                or image_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9]{10,16}\.(jpg|png|webp)$'
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
    'catalog-products',
    'catalog-products',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- O primeiro diretório é o usuário, o segundo é o catálogo e o terceiro é o produto.
-- As verificações no banco evitam gravar arquivos em pastas de outra conta.
drop policy if exists "catalog_product_images_select_own" on storage.objects;
create policy "catalog_product_images_select_own"
on storage.objects
for select
to authenticated
using (
    bucket_id = 'catalog-products'
    and (storage.foldername(storage.objects.name))[1] = (select auth.uid())::text
);

drop policy if exists "catalog_product_images_insert_own" on storage.objects;
create policy "catalog_product_images_insert_own"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'catalog-products'
    and (storage.foldername(storage.objects.name))[1] = (select auth.uid())::text
    and exists (
        select 1
        from public.products
        join public.catalogs on catalogs.id = products.catalog_id
        where products.id::text = (storage.foldername(storage.objects.name))[3]
            and catalogs.id::text = (storage.foldername(storage.objects.name))[2]
            and catalogs.owner_id = (select auth.uid())
    )
);

drop policy if exists "catalog_product_images_delete_own" on storage.objects;
create policy "catalog_product_images_delete_own"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'catalog-products'
    and (storage.foldername(storage.objects.name))[1] = (select auth.uid())::text
);

-- Visitantes recebem apenas o caminho da imagem. A leitura do arquivo usa o bucket público.
grant select (image_path) on table public.products to anon;

commit;
