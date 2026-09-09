-- Neoeffex Admin / Catálogo v0.2.0 — estrutura de loja e organização.
-- Executar UMA VEZ no SQL Editor, como postgres, após migrations 001–008 e 010–012.
-- Não execute a antiga 009_single_catalog_per_owner.sql.
-- SQL transacional: qualquer erro cancela o conjunto. Não altera slug, dono, preços,
-- status ou imagens; não mescla lojas e não importa o cardápio.
begin;
set local lock_timeout = '10s';
set local statement_timeout = '60s';

do $$
begin
    if to_regclass('public.stores') is not null then
        raise exception 'A tabela stores já existe. Não reaplique; execute a verificação desta versão.';
    end if;
    if to_regprocedure('public.delete_own_paused_catalog(uuid)') is null
       or to_regclass('public.catalogs_owner_id_unique_key') is not null then
        raise exception 'Base incompatível. Confira as migrations 010, 011 e 012 antes de continuar.';
    end if;
end;
$$;

lock table public.catalogs, public.categories, public.products in share row exclusive mode;

create table public.stores (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique (id, owner_id)
);
create index stores_owner_id_idx on public.stores(owner_id);
alter table public.stores enable row level security;
revoke all on public.stores from public, anon, authenticated;
grant select, insert, delete on public.stores to authenticated;
create policy stores_select_own on public.stores for select to authenticated
    using (owner_id = (select auth.uid()));
create policy stores_insert_own on public.stores for insert to authenticated
    with check (owner_id = (select auth.uid()));
create policy stores_delete_own on public.stores for delete to authenticated
    using (owner_id = (select auth.uid()));

insert into public.stores (id, owner_id, created_at)
select id, owner_id, created_at from public.catalogs;
alter table public.catalogs add column store_id uuid;
update public.catalogs set store_id = id;
alter table public.catalogs
    alter column store_id set not null,
    add constraint catalogs_one_per_store unique (store_id),
    add constraint catalogs_store_owner_fk foreign key (store_id, owner_id)
        references public.stores(id, owner_id) deferrable initially deferred;

-- UNIQUE garante no máximo um catálogo. Esta FK inversa exige exatamente um
-- no commit; também remove a loja quando seu catálogo pausado é excluído.
alter table public.stores add constraint stores_require_catalog_fk
    foreign key (id) references public.catalogs(store_id)
    on delete cascade deferrable initially deferred;

-- Mantém o INSERT do Admin anterior: loja e catálogo nascem na mesma transação.
create function public.catalog_create_store()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
    if new.store_id is null then
        new.store_id := new.id;
        insert into public.stores (id, owner_id) values (new.store_id, new.owner_id);
    end if;
    return new;
end;
$$;
revoke execute on function public.catalog_create_store() from public, anon;
grant execute on function public.catalog_create_store() to authenticated;
create trigger catalog_create_store before insert on public.catalogs
    for each row execute function public.catalog_create_store();

-- Hierarquia limitada a dois níveis por FK, inclusive em gravações concorrentes.
-- Um pai precisa ser uma raiz do mesmo catálogo. Não há ciclos nem terceiro nível.
alter table public.categories
    add column parent_id uuid,
    add column is_root boolean generated always as (parent_id is null) stored,
    add column parent_requires_root boolean generated always as (true) stored,
    add constraint categories_root_reference unique (id, catalog_id, is_root),
    add constraint categories_parent_root_fk
        foreign key (parent_id, catalog_id, parent_requires_root)
        references public.categories(id, catalog_id, is_root);
create index categories_parent_idx on public.categories(parent_id, catalog_id);
grant select (parent_id) on public.categories to anon;

create function public.catalog_groups_valid(groups_to_check text[])
returns boolean language sql immutable security invoker set search_path = '' as $$
    select groups_to_check is not null
        and cardinality(groups_to_check) <= 10
        and (cardinality(groups_to_check) = 0 or array_ndims(groups_to_check) = 1)
        and not exists (
            select 1 from unnest(groups_to_check) g
            where g is null or char_length(g) not between 1 and 60 or g <> btrim(g) or position(',' in g) > 0
        )
        and (select count(*) = count(distinct lower(g)) from unnest(groups_to_check) g);
$$;
revoke execute on function public.catalog_groups_valid(text[]) from public, anon;
grant execute on function public.catalog_groups_valid(text[]) to authenticated;

alter table public.products
    add column product_type text,
    add column product_groups text[] not null default array[]::text[],
    add constraint products_type_check check (
        product_type is null or
        (char_length(product_type) between 1 and 60 and product_type = btrim(product_type))
    ),
    add constraint products_groups_check check (public.catalog_groups_valid(product_groups));
grant select (product_type, product_groups) on public.products to anon;

comment on table public.stores is 'Uma conta pode possuir várias lojas; cada loja possui exatamente um catálogo.';
comment on column public.catalogs.owner_id is 'Espelho de stores.owner_id mantido consistente por FK composta. Transferências administrativas atualizam ambos na mesma transação.';
comment on column public.categories.parent_id is 'Subcategoria de uma raiz do mesmo catálogo; no máximo dois níveis.';
comment on column public.products.product_type is 'Classificação opcional; não altera preço nem carrinho.';
comment on column public.products.product_groups is 'Até 10 grupos de classificação; não são grupos de adicionais.';

set constraints all immediate;
notify pgrst, 'reload schema';
commit;

select 'ESTRUTURA_APLICADA' as resultado,
       (select count(*) from public.stores) as lojas,
       (select count(*) from public.catalogs) as catalogos,
       (select count(*) from public.products) as produtos_preservados;
