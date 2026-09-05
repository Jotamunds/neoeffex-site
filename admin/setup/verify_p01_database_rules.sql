-- ==============================================================================
-- Script de Diagnóstico e Auditoria de Leitura — Regras do Banco (P01)
-- Neoeffex Catalog Platform
--
-- Execução: Supabase Dashboard -> SQL Editor
-- Objetivo: Inspecionar o estado real do schema sem modificar nenhum dado.
-- ==============================================================================

-- 1. Verificar constraints de unicidade na tabela public.catalogs
-- Esperado após Migration 011: Ausência de restrição única em owner_id.
select
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(c.oid) as constraint_definition
from pg_constraint c
join pg_namespace n on n.oid = c.connamespace
where n.nspname = 'public'
  and c.conrelid = 'public.catalogs'::regclass;

-- 2. Verificar índices existentes em public.catalogs
-- Esperado após Migration 011: catalogs_owner_id_idx presente como índice relacional comum (não-único).
select
    indexname,
    indexdef
from pg_indexes
where schemaname = 'public'
  and tablename = 'catalogs';

-- 3. Inspecionar todas as políticas ativas de RLS em public.catalogs
-- Esperado após Migration 012: catalogs_delete_own exigindo (owner_id = auth.uid() and is_active = false).
-- Verificar se NÃO existem políticas residuais permitindo DELETE em catálogos com is_active = true.
select
    policyname,
    cmd,
    roles,
    qual as using_expression,
    with_check as with_check_expression
from pg_policies
where schemaname = 'public'
  and tablename = 'catalogs';

-- 4. Inspecionar a definição da função RPC delete_own_paused_catalog
-- Esperado: Função criada com SECURITY INVOKER (prosecdef = false) e transação íntegra.
select
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments,
    pg_get_functiondef(p.oid) as function_definition,
    p.prosecdef as is_security_definer
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'delete_own_paused_catalog';

-- 5. Inspecionar grants públicos das colunas de identidade
-- Esperado: anon e authenticated têm SELECT em colunas públicas de identidade.
select
    table_name,
    column_name,
    privilege_type,
    grantee
from information_schema.column_privileges
where table_schema = 'public'
  and table_name = 'catalogs'
  and column_name in ('logo_path', 'short_description', 'service_area', 'business_hours', 'fulfillment_mode');
