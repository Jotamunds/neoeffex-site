-- v0.1.13 — Remoção da restrição de catálogo único por proprietário.
--
-- Restaura e formaliza o suporte a múltiplos catálogos por conta no banco de dados.
-- 1. Remove com segurança o índice/constraint exclusiva de owner_id se instalada pela migration 009;
-- 2. Cria um índice regular (não único) em owner_id para manter o desempenho das consultas filtradas por usuário;
-- 3. Preserva a unicidade global de slug (catalogs.slug) e todas as regras de isolamento RLS.
--
-- Execute depois de 010_delete_paused_catalog.sql.

begin;

-- Remove constraint se existir como restrição de tabela
alter table if exists public.catalogs
    drop constraint if exists catalogs_owner_id_unique_key;

-- Remove índice exclusivo caso tenha sido criado isoladamente como index
drop index if exists public.catalogs_owner_id_unique_key;

-- Cria índice não exclusivo para acelerar consultas administrativas por owner_id
create index if not exists catalogs_owner_id_idx
    on public.catalogs (owner_id);

comment on index public.catalogs_owner_id_idx is
    'Índice de apoio para consultas de catálogos por proprietário, permitindo múltiplos catálogos por conta.';

commit;
