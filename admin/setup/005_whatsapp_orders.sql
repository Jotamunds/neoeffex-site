-- Etapa 6: configuração de pedidos enviados pelo WhatsApp.
-- Pode ser executado novamente: colunas, restrições e privilégio público são idempotentes.

begin;

alter table public.catalogs
    add column if not exists whatsapp_number text,
    add column if not exists orders_enabled boolean not null default false,
    add column if not exists order_message text not null
        default 'Confirme disponibilidade, prazo e forma de pagamento pelo WhatsApp.';

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'catalogs_whatsapp_number_check'
            and conrelid = 'public.catalogs'::regclass
    ) then
        alter table public.catalogs
            add constraint catalogs_whatsapp_number_check
            check (whatsapp_number is null or whatsapp_number ~ '^[1-9][0-9]{9,14}$');
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'catalogs_order_message_check'
            and conrelid = 'public.catalogs'::regclass
    ) then
        alter table public.catalogs
            add constraint catalogs_order_message_check
            check (char_length(trim(order_message)) between 10 and 300);
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'catalogs_orders_require_whatsapp_check'
            and conrelid = 'public.catalogs'::regclass
    ) then
        alter table public.catalogs
            add constraint catalogs_orders_require_whatsapp_check
            check (not orders_enabled or whatsapp_number is not null);
    end if;
end;
$$;

-- Corrige instalações da Etapa 5 nas quais a política pública também incluía authenticated.
-- O usuário autenticado continua acessando somente os próprios registros pelas políticas de proprietário.
drop policy if exists "catalogs_public_select_active" on public.catalogs;
create policy "catalogs_public_select_active"
on public.catalogs
for select
to anon
using (is_active = true);

drop policy if exists "categories_public_select_active_catalog" on public.categories;
create policy "categories_public_select_active_catalog"
on public.categories
for select
to anon
using (
    exists (
        select 1
        from public.catalogs
        where catalogs.id = categories.catalog_id
            and catalogs.is_active = true
    )
);

drop policy if exists "products_public_select_active" on public.products;
create policy "products_public_select_active"
on public.products
for select
to anon
using (
    status = 'active'
    and exists (
        select 1
        from public.catalogs
        where catalogs.id = products.catalog_id
            and catalogs.is_active = true
    )
);

-- O visitante recebe somente os campos necessários para exibir o carrinho e montar o link wa.me.
-- Nenhuma permissão de escrita é adicionada e as políticas RLS da Etapa 5 continuam valendo.
grant select (whatsapp_number, orders_enabled, order_message)
on table public.catalogs
to anon;

commit;
