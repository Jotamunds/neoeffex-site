-- v0.1.11 — regra operacional: uma conta autenticada possui um catálogo.
--
-- Objetivos:
-- 1. impedir que um mesmo owner_id crie um segundo catálogo;
-- 2. manter o slug globalmente único, como já ocorre desde a migration 001;
-- 3. não apagar, mesclar ou escolher automaticamente catálogos existentes.
--
-- IMPORTANTE:
-- Se já existir qualquer owner_id com mais de um catálogo, esta migration
-- interrompe a transação antes de criar o índice. Nenhum dado é alterado.
--
-- Execute depois de 008_catalog_identity.sql.

begin;

do $$
declare
    duplicate_owner_count integer;
begin
    select count(*)
    into duplicate_owner_count
    from (
        select owner_id
        from public.catalogs
        group by owner_id
        having count(*) > 1
    ) as duplicate_owners;

    if duplicate_owner_count > 0 then
        raise exception using
            errcode = 'P0001',
            message = format(
                'Migration 009 não aplicada: %s conta(s) possuem mais de um catálogo.',
                duplicate_owner_count
            ),
            hint = 'Revise manualmente essas contas antes de ativar a regra de um catálogo por cliente. Nenhum catálogo foi removido.';
    end if;
end;
$$;

create unique index if not exists catalogs_owner_id_unique_key
    on public.catalogs (owner_id);

commit;
