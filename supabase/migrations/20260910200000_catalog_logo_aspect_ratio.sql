-- Neoeffex Admin / Catálogo — Proporção configurável da logo do comércio.
-- Executar UMA VEZ no SQL Editor, como postgres, após 20260910173000_catalog_flavors.sql.
-- SQL transacional: qualquer erro cancela o conjunto.
-- Adiciona catalogs.logo_aspect_ratio com suporte a 'square' (1:1), 'portrait_3_4' (3:4) e 'landscape_4_3' (4:3).
-- Preserva compatibilidade retroativa total (default 'square').
begin;
set local lock_timeout = '10s';
set local statement_timeout = '60s';

do $$
begin
    if to_regclass('public.catalogs') is null then
        raise exception 'Base incompatível. Verifique as migrações anteriores antes de continuar.';
    end if;
end;
$$;

lock table public.catalogs in share row exclusive mode;

alter table public.catalogs
    add column if not exists logo_aspect_ratio text not null default 'square';

do $$
begin
    if not exists (
        select 1 from pg_constraint
        where conname = 'catalogs_logo_aspect_ratio_check'
          and conrelid = 'public.catalogs'::regclass
    ) then
        alter table public.catalogs
            add constraint catalogs_logo_aspect_ratio_check
            check (logo_aspect_ratio in ('square', 'portrait_3_4', 'landscape_4_3'));
    end if;
end;
$$;

-- Permissões públicas anônimas de leitura e autenticadas para o catálogo
grant select (logo_aspect_ratio) on public.catalogs to anon;
grant select, update (logo_aspect_ratio) on public.catalogs to authenticated;

comment on column public.catalogs.logo_aspect_ratio is 'Proporção da logo do comércio: square (1:1, padrão), portrait_3_4 (3:4) ou landscape_4_3 (4:3).';

notify pgrst, 'reload schema';
commit;

select 'PROPORCAO_DE_LOGO_APLICADA' as resultado,
       (select count(*) from public.catalogs) as catalogos_atualizados;
