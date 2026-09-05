-- v0.1.13 — Garantia de exclusão exclusiva para catálogos pausados no nível RLS.
--
-- Alinha a política de DELETE direto na tabela public.catalogs com a regra de negócio da RPC 010:
-- Somente catálogos com is_active = false podem ser excluídos pelo proprietário autenticado.
-- Isso impede que um catálogo ativo seja excluído acidentalmente via chamada direta à API da tabela.
--
-- Execute depois de 010_delete_paused_catalog.sql e 011_remove_single_catalog_per_owner.sql.

begin;

-- Substitui a política catalogs_delete_own por uma regra que exige explicitamente is_active = false
drop policy if exists "catalogs_delete_own" on public.catalogs;

create policy "catalogs_delete_own"
on public.catalogs
for delete
to authenticated
using (
    (select auth.uid()) = owner_id
    and is_active = false
);

comment on policy "catalogs_delete_own" on public.catalogs is
    'Permite que o proprietário autenticado exclua somente catálogos que estejam em estado pausado (is_active = false).';

commit;
