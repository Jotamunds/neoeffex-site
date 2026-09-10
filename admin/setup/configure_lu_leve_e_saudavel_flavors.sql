-- ==============================================================================
-- Configuração de Dados: Perfil, Pedido Mínimo e Sabores - Lu Leve e Saudável (Etapa 10)
-- Neoeffex Catalog Platform
--
-- Aplicação orientada estritamente a dados e configurações do catálogo,
-- SEM criar exceções ou regras condicionais específicas por slug no código-fonte.
--
-- Execução: Supabase Dashboard -> SQL Editor (Ambiente de Produção ou Homologação)
-- ==============================================================================

do $$
declare
    v_catalog_id uuid;
    v_fl_carne_panela uuid;
    v_fl_frango_ervas uuid;
    v_fl_pernil_suino uuid;
    v_fl_carne_moida uuid;
    v_fl_peixe_molho uuid;
    v_prod_tradicional uuid;
    v_prod_fitness uuid;
    v_prod_lasanha uuid;
    v_prod_torta uuid;
begin
    -- 1. Localizar o catálogo pelo slug
    select id into v_catalog_id
    from public.catalogs
    where slug = 'lu-leve-e-saudavel';

    if v_catalog_id is null then
        raise notice 'Catálogo "lu-leve-e-saudavel" não encontrado. Verifique se o catálogo já foi provisionado.';
        return;
    end if;

    -- 2. Atualizar perfil do catálogo e pedido mínimo
    -- catalog_profile = 'marmitas'
    -- minimum_order_quantity = 5
    update public.catalogs
    set
        catalog_profile = 'marmitas',
        minimum_order_quantity = 5,
        updated_at = now()
    where id = v_catalog_id;

    raise notice 'Catálogo atualizado com perfil "marmitas" e pedido mínimo de 5 unidades.';

    -- 3. Cadastrar ou reativar Sabores para o catálogo
    -- Sabor 1: Carne de panela
    insert into public.flavors (catalog_id, name, description, status, sort_order)
    values (v_catalog_id, 'Carne de panela', 'Carne bovina macia cozida lentamente com cenoura e batata', 'active', 0)
    on conflict (catalog_id, name) do update set
        description = excluded.description,
        status = 'active',
        sort_order = excluded.sort_order,
        updated_at = now()
    returning id into v_fl_carne_panela;

    -- Sabor 2: Frango
    insert into public.flavors (catalog_id, name, description, status, sort_order)
    values (v_catalog_id, 'Frango', 'Filé de peito grelhado em tiras com ervas finas e legumes no vapor', 'active', 1)
    on conflict (catalog_id, name) do update set
        description = excluded.description,
        status = 'active',
        sort_order = excluded.sort_order,
        updated_at = now()
    returning id into v_fl_frango_ervas;

    -- Sabor 3: Pernil
    insert into public.flavors (catalog_id, name, description, status, sort_order)
    values (v_catalog_id, 'Pernil', 'Pernil suíno assado e desfiado com tempero caseiro', 'active', 2)
    on conflict (catalog_id, name) do update set
        description = excluded.description,
        status = 'active',
        sort_order = excluded.sort_order,
        updated_at = now()
    returning id into v_fl_pernil_suino;

    -- Sabor 4: Carne moída
    insert into public.flavors (catalog_id, name, description, status, sort_order)
    values (v_catalog_id, 'Carne moída', 'Carne moída magra refogada com azeitonas e cheiro-verde', 'active', 3)
    on conflict (catalog_id, name) do update set
        description = excluded.description,
        status = 'active',
        sort_order = excluded.sort_order,
        updated_at = now()
    returning id into v_fl_carne_moida;

    -- Sabor 5: Peixe ao molho (exemplo com acréscimo especial)
    insert into public.flavors (catalog_id, name, description, status, sort_order)
    values (v_catalog_id, 'Peixe ao molho', 'Filé de tilápia fresca com molho de tomates frescos e pimentões', 'active', 4)
    on conflict (catalog_id, name) do update set
        description = excluded.description,
        status = 'active',
        sort_order = excluded.sort_order,
        updated_at = now()
    returning id into v_fl_peixe_molho;

    raise notice 'Sabores cadastrados com sucesso para o catálogo.';

    -- 4. Configurar produtos bundle (Tradicional e Fitness usam flavor_bundle)
    -- Localiza produtos que contenham "Tradicional" no nome
    for v_prod_tradicional in
        select id from public.products
        where catalog_id = v_catalog_id
          and (name ilike '%Tradicional%' or name ilike '%Marmita tradicional%')
    loop
        update public.products
        set purchase_mode = 'flavor_bundle', updated_at = now()
        where id = v_prod_tradicional;

        -- Vincular sabores disponíveis ao produto tradicional
        insert into public.product_flavors (catalog_id, product_id, flavor_id, additional_price, is_available, sort_order)
        values
            (v_catalog_id, v_prod_tradicional, v_fl_carne_panela, 5.00, true, 0),
            (v_catalog_id, v_prod_tradicional, v_fl_frango_ervas, 0.00, true, 1),
            (v_catalog_id, v_prod_tradicional, v_fl_pernil_suino, 0.00, true, 2),
            (v_catalog_id, v_prod_tradicional, v_fl_carne_moida, 0.00, true, 3),
            (v_catalog_id, v_prod_tradicional, v_fl_peixe_molho, 5.00, true, 4)
        on conflict (catalog_id, product_id, flavor_id) do update set
            additional_price = excluded.additional_price,
            is_available = excluded.is_available,
            sort_order = excluded.sort_order,
            updated_at = now();
    end loop;

    -- Localiza produtos que contenham "Fitness" ou "Fit" no nome
    for v_prod_fitness in
        select id from public.products
        where catalog_id = v_catalog_id
          and (name ilike '%Fitness%' or name ilike '%Marmita fit%')
    loop
        update public.products
        set purchase_mode = 'flavor_bundle', updated_at = now()
        where id = v_prod_fitness;

        -- Vincular sabores disponíveis ao produto fitness
        insert into public.product_flavors (catalog_id, product_id, flavor_id, additional_price, is_available, sort_order)
        values
            (v_catalog_id, v_prod_fitness, v_fl_frango_ervas, 0.00, true, 0),
            (v_catalog_id, v_prod_fitness, v_fl_carne_panela, 5.00, true, 1),
            (v_catalog_id, v_prod_fitness, v_fl_peixe_molho, 5.00, true, 2)
        on conflict (catalog_id, product_id, flavor_id) do update set
            additional_price = excluded.additional_price,
            is_available = excluded.is_available,
            sort_order = excluded.sort_order,
            updated_at = now();
    end loop;

    -- 5. Garantir que produtos como Lasanha, Torta, Sucos e Sobremesas permaneçam como 'simple'
    update public.products
    set purchase_mode = 'simple', updated_at = now()
    where catalog_id = v_catalog_id
      and (name ilike '%Lasanha%' or name ilike '%Torta%' or name ilike '%Suco%' or name ilike '%Sobremesa%');

    raise notice 'Configuração de produtos concluída: marmitas como flavor_bundle e itens avulsos como simple.';
end $$;
