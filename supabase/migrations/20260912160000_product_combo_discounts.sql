-- Neoeffex Admin / Catálogo — Descontos configuráveis para combos de 5, 10 e 15 unidades.
-- Executar UMA VEZ no SQL Editor, como postgres, após 20260910200000_catalog_logo_aspect_ratio.sql.
-- SQL transacional: qualquer erro cancela o conjunto.
-- Adiciona products.combo_discount_5, products.combo_discount_10 e products.combo_discount_15.
-- Preserva compatibilidade retroativa total com registros existentes (default 0.00%).
begin;
set local lock_timeout = '10s';
set local statement_timeout = '60s';

do $$
begin
    if to_regclass('public.products') is null then
        raise exception 'Tabela products não encontrada. Verifique as migrações anteriores antes de continuar.';
    end if;
end;
$$;

lock table public.products in share row exclusive mode;

alter table public.products
    add column if not exists combo_discount_5 numeric(5, 2) not null default 0.00,
    add column if not exists combo_discount_10 numeric(5, 2) not null default 0.00,
    add column if not exists combo_discount_15 numeric(5, 2) not null default 0.00;

do $$
begin
    if not exists (
        select 1 from pg_constraint
        where conname = 'products_combo_discount_5_check'
          and conrelid = 'public.products'::regclass
    ) then
        alter table public.products
            add constraint products_combo_discount_5_check
            check (combo_discount_5 >= 0.00 and combo_discount_5 <= 100.00);
    end if;

    if not exists (
        select 1 from pg_constraint
        where conname = 'products_combo_discount_10_check'
          and conrelid = 'public.products'::regclass
    ) then
        alter table public.products
            add constraint products_combo_discount_10_check
            check (combo_discount_10 >= 0.00 and combo_discount_10 <= 100.00);
    end if;

    if not exists (
        select 1 from pg_constraint
        where conname = 'products_combo_discount_15_check'
          and conrelid = 'public.products'::regclass
    ) then
        alter table public.products
            add constraint products_combo_discount_15_check
            check (combo_discount_15 >= 0.00 and combo_discount_15 <= 100.00);
    end if;
end;
$$;

grant select (combo_discount_5, combo_discount_10, combo_discount_15) on public.products to anon;

comment on column public.products.combo_discount_5 is 'Percentual de desconto (0 a 100) aplicado sobre o valor bruto no combo de 5 unidades.';
comment on column public.products.combo_discount_10 is 'Percentual de desconto (0 a 100) aplicado sobre o valor bruto no combo de 10 unidades.';
comment on column public.products.combo_discount_15 is 'Percentual de desconto (0 a 100) aplicado sobre o valor bruto no combo de 15 unidades.';

notify pgrst, 'reload schema';
commit;

select 'DESCONTOS_DE_COMBOS_APLICADOS' as resultado,
       (select count(*) from public.products) as produtos_atualizados;
