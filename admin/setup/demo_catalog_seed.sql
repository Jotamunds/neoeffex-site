-- ==============================================================================
-- Fixture / Seed do Catálogo Demonstrativo Oficial (P04)
-- Neoeffex Catalog Platform
--
-- Execução: Supabase Dashboard -> SQL Editor (Ambiente de Teste ou Produção)
-- Conforme especificado em docs/operations/DEMO_CATALOG_CHECKLIST.md
-- ==============================================================================

-- 1. Criação do Catálogo Demo (associado ao auth.uid() do usuário de teste conectado)
-- NOTA: Execute conectado na conta administrativa que gerenciará a demonstração.

do $$
declare
    v_owner_id uuid := auth.uid();
    v_catalog_id uuid;
    v_cat_destaques_id uuid;
    v_cat_bebidas_id uuid;
begin
    -- Se executado no SQL Editor (onde auth.uid() é nulo), utiliza o primeiro usuário cadastrado
    if v_owner_id is null then
        select id into v_owner_id from auth.users order by created_at asc limit 1;
    end if;

    if v_owner_id is null then
        raise notice 'Atenção: nenhum usuário encontrado em auth.users. Crie uma conta no Supabase Auth primeiro.';
        return;
    end if;

    -- Inserir ou atualizar catálogo demo
    insert into public.catalogs (
        owner_id,
        name,
        slug,
        is_active,
        orders_enabled,
        whatsapp_number,
        order_message,
        short_description,
        service_area,
        business_hours,
        fulfillment_mode
    ) values (
        v_owner_id,
        'Catálogo Demo Neoeffex',
        'demo-neoeffex',
        true,
        true,
        '5511997763958',
        'PEDIDO DE TESTE — Ambiente de demonstração Neoeffex.',
        'Ambiente fictício para demonstração e testes do catálogo Neoeffex.',
        'Ambiente de demonstração',
        'Seg–Sex • 09h–18h',
        'both' -- Retirada e entrega (conforme catalogs_fulfillment_mode_check)
    )
    on conflict (slug) do update set
        name = excluded.name,
        is_active = excluded.is_active,
        fulfillment_mode = excluded.fulfillment_mode,
        order_message = excluded.order_message
    returning id into v_catalog_id;

    -- Inserir categorias
    insert into public.categories (catalog_id, name, sort_order)
    values (v_catalog_id, 'Destaques', 0)
    returning id into v_cat_destaques_id;

    insert into public.categories (catalog_id, name, sort_order)
    values (v_catalog_id, 'Bebidas', 1)
    returning id into v_cat_bebidas_id;

    -- Inserir Produtos de Demonstração
    -- Produto Demo A (Destaques, R$ 19,90, Ativo)
    insert into public.products (catalog_id, category_id, name, price, description, status, sort_order)
    values (v_catalog_id, v_cat_destaques_id, 'Produto Demo A', 19.90, 'Exemplo de produto destaque com descrição detalhada.', 'active', 0);

    -- Produto Demo B (Destaques, R$ 7,50, Ativo, sem imagem para testar fallback)
    insert into public.products (catalog_id, category_id, name, price, description, status, sort_order)
    values (v_catalog_id, v_cat_destaques_id, 'Produto Demo B', 7.50, 'Exemplo de produto sem foto para teste do placeholder visual.', 'active', 1);

    -- Produto Demo C (Bebidas, R$ 22,35, Pausado - NÃO deve aparecer no público)
    insert into public.products (catalog_id, category_id, name, price, description, status, sort_order)
    values (v_catalog_id, v_cat_bebidas_id, 'Produto Demo C (Pausado)', 22.35, 'Item indisponível temporariamente.', 'paused', 0);

    -- Produto Demo D (Bebidas, R$ 5,99, Ativo)
    insert into public.products (catalog_id, category_id, name, price, description, status, sort_order)
    values (v_catalog_id, v_cat_bebidas_id, 'Produto Demo D', 5.99, 'Bebida refrescante para complementar o pedido.', 'active', 1);

    raise notice 'Catálogo demo-neoeffex criado com sucesso. ID: %', v_catalog_id;
end $$;
