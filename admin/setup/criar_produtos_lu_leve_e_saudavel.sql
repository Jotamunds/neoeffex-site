-- =============================================================================
-- Lu Leve e Saudável — criação dos 5 produtos-base de marmitas
-- Fonte: prices-table-09092026.xlsx
--
-- IMPORTANTE:
-- - O campo products.price recebe o PREÇO AVULSO por marmita, pois o catálogo
--   público atual multiplica products.price pela quantidade selecionada.
-- - Os descontos de Combo 5/10/15/20 ficam registrados na descrição, mas ainda
--   NÃO são calculados automaticamente pelo frontend atual.
-- - Tradicional 400 g e 500 g exigem 2 tipos de carne por marmita segundo a
--   tabela; o seletor atual de sabores valida 1 escolha por unidade. Portanto,
--   essa regra ainda precisa de evolução específica antes do uso comercial final.
--
-- O script é idempotente: atualiza os 5 produtos se já existirem e cria se faltarem.
-- Também relaciona os 15 sabores/proteínas já cadastrados.
-- =============================================================================

begin;

set local lock_timeout = '10s';
set local statement_timeout = '60s';

do $$
declare
    v_catalog_id uuid;
    v_cat_tradicional uuid;
    v_cat_fitness uuid;
    v_prod_300 uuid;
    v_prod_400 uuid;
    v_prod_500 uuid;
    v_prod_fit_m uuid;
    v_prod_fit_g uuid;
    r record;
begin
    -- -------------------------------------------------------------------------
    -- 1. Catálogo alvo
    -- -------------------------------------------------------------------------
    select id
      into v_catalog_id
      from public.catalogs
     where slug = 'lu-leve-e-saudavel'
     limit 1;

    if v_catalog_id is null then
        raise exception 'Catálogo "lu-leve-e-saudavel" não encontrado.';
    end if;

    update public.catalogs
       set catalog_profile = 'marmitas',
           minimum_order_quantity = 5,
           updated_at = now()
     where id = v_catalog_id;

    -- -------------------------------------------------------------------------
    -- 2. Categorias principais
    -- -------------------------------------------------------------------------
    select id
      into v_cat_tradicional
      from public.categories
     where catalog_id = v_catalog_id
       and parent_id is null
       and lower(btrim(name)) = lower('Tradicional')
     order by created_at
     limit 1;

    if v_cat_tradicional is null then
        insert into public.categories (catalog_id, name, sort_order, parent_id)
        values (v_catalog_id, 'Tradicional', 0, null)
        returning id into v_cat_tradicional;
    end if;

    select id
      into v_cat_fitness
      from public.categories
     where catalog_id = v_catalog_id
       and parent_id is null
       and lower(btrim(name)) = lower('Fitness')
     order by created_at
     limit 1;

    if v_cat_fitness is null then
        insert into public.categories (catalog_id, name, sort_order, parent_id)
        values (v_catalog_id, 'Fitness', 1, null)
        returning id into v_cat_fitness;
    end if;

    -- -------------------------------------------------------------------------
    -- 3. Produto: Tradicional 300 g
    -- -------------------------------------------------------------------------
    select id
      into v_prod_300
      from public.products
     where catalog_id = v_catalog_id
       and lower(btrim(name)) = lower('Marmita Tradicional 300 g')
     limit 1;

    if v_prod_300 is null then
        insert into public.products (
            catalog_id,
            category_id,
            name,
            description,
            price,
            status,
            purchase_mode,
            product_type,
            product_groups,
            sort_order
        )
        values (
            v_catalog_id,
            v_cat_tradicional,
            'Marmita Tradicional 300 g',
            '1 tipo de carne. Escolha 1 tipo de legumes OU 1 tipo de verduras. Avulsa: R$ 16. Combo 5: R$ 75 (R$ 15/un). Combo 10: R$ 150 (R$ 15/un). Combo 20: R$ 290 (R$ 14,50/un).',
            16.00,
            'active',
            'flavor_bundle',
            null,
            ARRAY[]::text[],
            0
        )
        returning id into v_prod_300;
    else
        update public.products
           set category_id = v_cat_tradicional,
               description = '1 tipo de carne. Escolha 1 tipo de legumes OU 1 tipo de verduras. Avulsa: R$ 16. Combo 5: R$ 75 (R$ 15/un). Combo 10: R$ 150 (R$ 15/un). Combo 20: R$ 290 (R$ 14,50/un).',
               price = 16.00,
               status = 'active',
               purchase_mode = 'flavor_bundle',
               sort_order = 0,
               updated_at = now()
         where id = v_prod_300;
    end if;

    -- -------------------------------------------------------------------------
    -- 4. Produto: Tradicional 400 g
    -- -------------------------------------------------------------------------
    select id
      into v_prod_400
      from public.products
     where catalog_id = v_catalog_id
       and lower(btrim(name)) = lower('Marmita Tradicional 400 g')
     limit 1;

    if v_prod_400 is null then
        insert into public.products (
            catalog_id,
            category_id,
            name,
            description,
            price,
            status,
            purchase_mode,
            product_type,
            product_groups,
            sort_order
        )
        values (
            v_catalog_id,
            v_cat_tradicional,
            'Marmita Tradicional 400 g',
            '2 tipos de carne. Escolha 1 legume + 1 verdura OU 2 opções entre legumes/verduras. Lentilha e grão-de-bico disponíveis. Avulsa: R$ 20. Combo 5: R$ 95. Combo 10: R$ 190. Combo 20: R$ 370.',
            20.00,
            'active',
            'flavor_bundle',
            null,
            ARRAY[]::text[],
            1
        )
        returning id into v_prod_400;
    else
        update public.products
           set category_id = v_cat_tradicional,
               description = '2 tipos de carne. Escolha 1 legume + 1 verdura OU 2 opções entre legumes/verduras. Lentilha e grão-de-bico disponíveis. Avulsa: R$ 20. Combo 5: R$ 95. Combo 10: R$ 190. Combo 20: R$ 370.',
               price = 20.00,
               status = 'active',
               purchase_mode = 'flavor_bundle',
               sort_order = 1,
               updated_at = now()
         where id = v_prod_400;
    end if;

    -- -------------------------------------------------------------------------
    -- 5. Produto: Tradicional 500 g
    -- -------------------------------------------------------------------------
    select id
      into v_prod_500
      from public.products
     where catalog_id = v_catalog_id
       and lower(btrim(name)) = lower('Marmita Tradicional 500 g')
     limit 1;

    if v_prod_500 is null then
        insert into public.products (
            catalog_id,
            category_id,
            name,
            description,
            price,
            status,
            purchase_mode,
            product_type,
            product_groups,
            sort_order
        )
        values (
            v_catalog_id,
            v_cat_tradicional,
            'Marmita Tradicional 500 g',
            '2 tipos de carne. Escolha 1 legume + 1 verdura OU 2 opções entre legumes/verduras. Lentilha e grão-de-bico disponíveis. Avulsa: R$ 22. Combo 5: R$ 105. Combo 10: R$ 210. Combo 20: R$ 410.',
            22.00,
            'active',
            'flavor_bundle',
            null,
            ARRAY[]::text[],
            2
        )
        returning id into v_prod_500;
    else
        update public.products
           set category_id = v_cat_tradicional,
               description = '2 tipos de carne. Escolha 1 legume + 1 verdura OU 2 opções entre legumes/verduras. Lentilha e grão-de-bico disponíveis. Avulsa: R$ 22. Combo 5: R$ 105. Combo 10: R$ 210. Combo 20: R$ 410.',
               price = 22.00,
               status = 'active',
               purchase_mode = 'flavor_bundle',
               sort_order = 2,
               updated_at = now()
         where id = v_prod_500;
    end if;

    -- -------------------------------------------------------------------------
    -- 6. Produto: Fitness M
    -- -------------------------------------------------------------------------
    select id
      into v_prod_fit_m
      from public.products
     where catalog_id = v_catalog_id
       and lower(btrim(name)) = lower('Marmita Fitness M — 400 g')
     limit 1;

    if v_prod_fit_m is null then
        insert into public.products (
            catalog_id,
            category_id,
            name,
            description,
            price,
            status,
            purchase_mode,
            product_type,
            product_groups,
            sort_order
        )
        values (
            v_catalog_id,
            v_cat_fitness,
            'Marmita Fitness M — 400 g',
            'Peso total: 400 g. 130 g de proteína, legumes e vegetais. Avulsa: R$ 22. Combo 5: R$ 105. Combo 10: R$ 210. Combo 15: R$ 315.',
            22.00,
            'active',
            'flavor_bundle',
            null,
            ARRAY[]::text[],
            3
        )
        returning id into v_prod_fit_m;
    else
        update public.products
           set category_id = v_cat_fitness,
               description = 'Peso total: 400 g. 130 g de proteína, legumes e vegetais. Avulsa: R$ 22. Combo 5: R$ 105. Combo 10: R$ 210. Combo 15: R$ 315.',
               price = 22.00,
               status = 'active',
               purchase_mode = 'flavor_bundle',
               sort_order = 3,
               updated_at = now()
         where id = v_prod_fit_m;
    end if;

    -- -------------------------------------------------------------------------
    -- 7. Produto: Fitness G
    -- -------------------------------------------------------------------------
    select id
      into v_prod_fit_g
      from public.products
     where catalog_id = v_catalog_id
       and lower(btrim(name)) = lower('Marmita Fitness G — 500 g')
     limit 1;

    if v_prod_fit_g is null then
        insert into public.products (
            catalog_id,
            category_id,
            name,
            description,
            price,
            status,
            purchase_mode,
            product_type,
            product_groups,
            sort_order
        )
        values (
            v_catalog_id,
            v_cat_fitness,
            'Marmita Fitness G — 500 g',
            'Peso total: 500 g. 130 g de proteína, legumes e vegetais. Avulsa: R$ 25. Combo 5: R$ 125. Combo 10: R$ 245. Combo 15: R$ 370.',
            25.00,
            'active',
            'flavor_bundle',
            null,
            ARRAY[]::text[],
            4
        )
        returning id into v_prod_fit_g;
    else
        update public.products
           set category_id = v_cat_fitness,
               description = 'Peso total: 500 g. 130 g de proteína, legumes e vegetais. Avulsa: R$ 25. Combo 5: R$ 125. Combo 10: R$ 245. Combo 15: R$ 370.',
               price = 25.00,
               status = 'active',
               purchase_mode = 'flavor_bundle',
               sort_order = 4,
               updated_at = now()
         where id = v_prod_fit_g;
    end if;

    -- -------------------------------------------------------------------------
    -- 8. Relacionar os 15 sabores/proteínas já cadastrados aos 5 produtos
    -- -------------------------------------------------------------------------
    for r in
        select *
          from (values
            ('Pernil suíno',                 0.00::numeric,  0),
            ('Contra-filé suíno',            0.00::numeric,  1),
            ('Bisteca',                      0.00::numeric,  2),
            ('Carne moída',                  0.00::numeric,  3),
            ('Filé de frango',               0.00::numeric,  4),
            ('Coxa e sobrecoxa assada',      0.00::numeric,  5),
            ('Fígado acebolado em tiras',    0.00::numeric,  6),
            ('Carne de panela',              5.00::numeric,  7),
            ('Filé de frango à parmegiana',  5.00::numeric,  8),
            ('Filé de carne à parmegiana',   5.00::numeric,  9),
            ('Bife acebolado',               5.00::numeric, 10),
            ('Bife a rolê',                  5.00::numeric, 11),
            ('Filé de tilápia ao molho',     6.00::numeric, 12),
            ('Salmão',                       9.00::numeric, 13),
            ('Contra-filé',                  9.00::numeric, 14)
          ) as x(name, additional_price, sort_order)
    loop
        insert into public.product_flavors (
            catalog_id,
            product_id,
            flavor_id,
            additional_price,
            is_available,
            sort_order
        )
        select
            v_catalog_id,
            p.id,
            f.id,
            r.additional_price,
            true,
            r.sort_order
        from public.products p
        join public.flavors f
          on f.catalog_id = v_catalog_id
         and lower(btrim(f.name)) = lower(btrim(r.name))
        where p.id in (
            v_prod_300,
            v_prod_400,
            v_prod_500,
            v_prod_fit_m,
            v_prod_fit_g
        )
        on conflict (product_id, flavor_id) do update
           set additional_price = excluded.additional_price,
               is_available = true,
               sort_order = excluded.sort_order;
    end loop;
end
$$;

commit;

-- =============================================================================
-- CONFERÊNCIA
-- =============================================================================

select
    p.name,
    p.price,
    p.status,
    p.purchase_mode,
    cat.name as categoria,
    count(pf.flavor_id) as sabores_vinculados
from public.products p
join public.catalogs c
  on c.id = p.catalog_id
left join public.categories cat
  on cat.id = p.category_id
left join public.product_flavors pf
  on pf.product_id = p.id
 and pf.catalog_id = p.catalog_id
where c.slug = 'lu-leve-e-saudavel'
group by p.id, p.name, p.price, p.status, p.purchase_mode, cat.name, p.sort_order
order by p.sort_order, p.name;

select
    c.slug,
    c.catalog_profile,
    c.minimum_order_quantity,
    count(distinct p.id) as produtos,
    count(pf.flavor_id) as relacoes_produto_sabor
from public.catalogs c
left join public.products p
  on p.catalog_id = c.id
left join public.product_flavors pf
  on pf.product_id = p.id
 and pf.catalog_id = c.id
where c.slug = 'lu-leve-e-saudavel'
group by c.id, c.slug, c.catalog_profile, c.minimum_order_quantity;
