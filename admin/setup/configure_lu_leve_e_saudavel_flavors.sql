-- Correção do script de configuração da Lu Leve e Saudável
-- Compatível com as migrations de perfis/modos de compra e sabores.

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
begin
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

    insert into public.flavors (catalog_id, name, description, is_active, sort_order)
    values (v_catalog_id, 'Carne de panela', 'Carne bovina macia cozida lentamente com cenoura e batata', true, 0)
    on conflict (catalog_id, lower(name)) do update set
        description = excluded.description,
        is_active = true,
        sort_order = excluded.sort_order,
        updated_at = now()
    returning id into v_fl_carne_panela;

    insert into public.flavors (catalog_id, name, description, is_active, sort_order)
    values (v_catalog_id, 'Frango', 'Filé de peito grelhado em tiras com ervas finas e legumes no vapor', true, 1)
    on conflict (catalog_id, lower(name)) do update set
        description = excluded.description,
        is_active = true,
        sort_order = excluded.sort_order,
        updated_at = now()
    returning id into v_fl_frango_ervas;

    insert into public.flavors (catalog_id, name, description, is_active, sort_order)
    values (v_catalog_id, 'Pernil', 'Pernil suíno assado e desfiado com tempero caseiro', true, 2)
    on conflict (catalog_id, lower(name)) do update set
        description = excluded.description,
        is_active = true,
        sort_order = excluded.sort_order,
        updated_at = now()
    returning id into v_fl_pernil_suino;

    insert into public.flavors (catalog_id, name, description, is_active, sort_order)
    values (v_catalog_id, 'Carne moída', 'Carne moída magra refogada com azeitonas e cheiro-verde', true, 3)
    on conflict (catalog_id, lower(name)) do update set
        description = excluded.description,
        is_active = true,
        sort_order = excluded.sort_order,
        updated_at = now()
    returning id into v_fl_carne_moida;

    insert into public.flavors (catalog_id, name, description, is_active, sort_order)
    values (v_catalog_id, 'Peixe ao molho', 'Filé de tilápia fresca com molho de tomates frescos e pimentões', true, 4)
    on conflict (catalog_id, lower(name)) do update set
        description = excluded.description,
        is_active = true,
        sort_order = excluded.sort_order,
        updated_at = now()
    returning id into v_fl_peixe_molho;

    for v_prod_tradicional in
        select id
          from public.products
         where catalog_id = v_catalog_id
           and (name ilike '%Tradicional%' or name ilike '%Marmita tradicional%')
    loop
        update public.products
           set purchase_mode = 'flavor_bundle',
               updated_at = now()
         where id = v_prod_tradicional;

        insert into public.product_flavors (
            catalog_id, product_id, flavor_id, additional_price, is_available, sort_order
        )
        values
            (v_catalog_id, v_prod_tradicional, v_fl_carne_panela, 5.00, true, 0),
            (v_catalog_id, v_prod_tradicional, v_fl_frango_ervas, 0.00, true, 1),
            (v_catalog_id, v_prod_tradicional, v_fl_pernil_suino, 0.00, true, 2),
            (v_catalog_id, v_prod_tradicional, v_fl_carne_moida, 0.00, true, 3),
            (v_catalog_id, v_prod_tradicional, v_fl_peixe_molho, 5.00, true, 4)
        on conflict (product_id, flavor_id) do update set
            additional_price = excluded.additional_price,
            is_available = excluded.is_available,
            sort_order = excluded.sort_order;
    end loop;

    for v_prod_fitness in
        select id
          from public.products
         where catalog_id = v_catalog_id
           and (name ilike '%Fitness%' or name ilike '%Marmita fit%')
    loop
        update public.products
           set purchase_mode = 'flavor_bundle',
               updated_at = now()
         where id = v_prod_fitness;

        insert into public.product_flavors (
            catalog_id, product_id, flavor_id, additional_price, is_available, sort_order
        )
        values
            (v_catalog_id, v_prod_fitness, v_fl_frango_ervas, 0.00, true, 0),
            (v_catalog_id, v_prod_fitness, v_fl_carne_panela, 5.00, true, 1),
            (v_catalog_id, v_prod_fitness, v_fl_peixe_molho, 5.00, true, 2)
        on conflict (product_id, flavor_id) do update set
            additional_price = excluded.additional_price,
            is_available = excluded.is_available,
            sort_order = excluded.sort_order;
    end loop;

    update public.products
       set purchase_mode = 'simple',
           updated_at = now()
     where catalog_id = v_catalog_id
       and (
            name ilike '%Lasanha%'
            or name ilike '%Torta%'
            or name ilike '%Suco%'
            or name ilike '%Sobremesa%'
       );
end
$$;

select
    c.slug,
    c.catalog_profile,
    c.minimum_order_quantity,
    (select count(*) from public.flavors f where f.catalog_id = c.id) as flavors_criados,
    (select count(*) from public.product_flavors pf where pf.catalog_id = c.id) as product_flavors_criados
from public.catalogs c
where c.slug = 'lu-leve-e-saudavel';