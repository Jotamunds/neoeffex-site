-- =============================================================================
-- Lu Leve e Saudável — sabores/proteínas completos da tabela de preços
-- Compatível com:
--   20260910170000_catalog_profiles_purchase_mode.sql
--   20260910173000_catalog_flavors.sql
--
-- O script:
--   1) configura o catálogo como "marmitas" e pedido mínimo 5;
--   2) normaliza nomes genéricos criados pelo script anterior;
--   3) cadastra/atualiza as 15 opções de proteína da tabela;
--   4) vincula as opções aos produtos Tradicional e Fitness;
--   5) aplica os acréscimos corretos;
--   6) mantém Lasanha/Torta/Suco/Sobremesa como produtos simples;
--   7) é idempotente e pode ser executado novamente.
--
-- IMPORTANTE:
-- "flavors" está sendo usado aqui como opção de proteína/sabor.
-- Não cadastra legumes, verduras, purês ou leguminosas como sabores.
-- =============================================================================

begin;

set local lock_timeout = '10s';
set local statement_timeout = '60s';

do $$
declare
    v_catalog_id uuid;
    v_old_id uuid;
    v_new_id uuid;
    r record;
begin
    -- -------------------------------------------------------------------------
    -- 1. Localizar catálogo
    -- -------------------------------------------------------------------------
    select id
      into v_catalog_id
      from public.catalogs
     where slug = 'lu-leve-e-saudavel'
     limit 1;

    if v_catalog_id is null then
        raise exception 'Catálogo "lu-leve-e-saudavel" não encontrado.';
    end if;

    -- -------------------------------------------------------------------------
    -- 2. Perfil e pedido mínimo
    -- -------------------------------------------------------------------------
    update public.catalogs
       set catalog_profile = 'marmitas',
           minimum_order_quantity = 5,
           updated_at = now()
     where id = v_catalog_id;

    -- -------------------------------------------------------------------------
    -- 3. Normalizar aliases eventualmente criados pelo script anterior
    --
    -- Frango          -> Filé de frango
    -- Pernil          -> Pernil suíno
    -- Peixe ao molho  -> Filé de tilápia ao molho
    --
    -- Primeiro cria/garante o nome canônico.
    -- Depois migra relacionamentos e remove somente o alias antigo.
    -- -------------------------------------------------------------------------
    for r in
        select *
          from (values
            (
                'Frango',
                'Filé de frango',
                'Filé de frango preparado com tempero caseiro.',
                0.00::numeric
            ),
            (
                'Pernil',
                'Pernil suíno',
                'Pernil suíno preparado com tempero caseiro.',
                0.00::numeric
            ),
            (
                'Peixe ao molho',
                'Filé de tilápia ao molho',
                'Filé de tilápia ao molho.',
                6.00::numeric
            )
          ) as aliases(old_name, new_name, description, additional_price)
    loop
        -- Garante sabor canônico
        insert into public.flavors (
            catalog_id,
            name,
            description,
            is_active,
            sort_order
        )
        values (
            v_catalog_id,
            r.new_name,
            r.description,
            true,
            0
        )
        on conflict (catalog_id, lower(name)) do update
           set description = excluded.description,
               is_active = true,
               updated_at = now()
        returning id into v_new_id;

        -- Procura alias antigo
        select id
          into v_old_id
          from public.flavors
         where catalog_id = v_catalog_id
           and lower(btrim(name)) = lower(btrim(r.old_name))
           and id <> v_new_id
         limit 1;

        if v_old_id is not null then
            -- Migra vínculos do alias para o nome canônico
            insert into public.product_flavors (
                catalog_id,
                product_id,
                flavor_id,
                sort_order,
                additional_price,
                is_available
            )
            select
                pf.catalog_id,
                pf.product_id,
                v_new_id,
                pf.sort_order,
                r.additional_price,
                pf.is_available
            from public.product_flavors pf
            where pf.catalog_id = v_catalog_id
              and pf.flavor_id = v_old_id
            on conflict (product_id, flavor_id) do update
               set additional_price = excluded.additional_price,
                   is_available = excluded.is_available,
                   sort_order = least(
                       public.product_flavors.sort_order,
                       excluded.sort_order
                   );

            delete from public.product_flavors
             where catalog_id = v_catalog_id
               and flavor_id = v_old_id;

            delete from public.flavors
             where catalog_id = v_catalog_id
               and id = v_old_id;
        end if;
    end loop;

    -- -------------------------------------------------------------------------
    -- 4. Cadastrar/atualizar as 15 opções de proteína da tabela
    -- -------------------------------------------------------------------------
    for r in
        select *
          from (values
            -- SEM ACRÉSCIMO
            ('Pernil suíno',                   'Opção de proteína sem acréscimo.',                                      0.00::numeric,  0),
            ('Contra-filé suíno',              'Opção de proteína sem acréscimo.',                                      0.00::numeric,  1),
            ('Bisteca',                        'Opção de proteína sem acréscimo.',                                      0.00::numeric,  2),
            ('Carne moída',                    'Carne moída; pode ser preparada com ou sem batata.',                     0.00::numeric,  3),
            ('Filé de frango',                 'Opção de proteína sem acréscimo.',                                      0.00::numeric,  4),
            ('Coxa e sobrecoxa assada',        'Opção de proteína sem acréscimo.',                                      0.00::numeric,  5),
            ('Fígado acebolado em tiras',      'Opção de proteína sem acréscimo.',                                      0.00::numeric,  6),

            -- COM ACRÉSCIMO
            ('Carne de panela',                'Opção de proteína com acréscimo de R$ 5 por marmita.',                  5.00::numeric,  7),
            ('Filé de frango à parmegiana',    'Opção de proteína com acréscimo de R$ 5 por marmita.',                  5.00::numeric,  8),
            ('Filé de carne à parmegiana',     'Opção de proteína com acréscimo de R$ 5 por marmita.',                  5.00::numeric,  9),
            ('Bife acebolado',                 'Opção de proteína com acréscimo de R$ 5 por marmita.',                  5.00::numeric, 10),
            ('Bife a rolê',                    'Opção de proteína com acréscimo de R$ 5 por marmita.',                  5.00::numeric, 11),
            ('Filé de tilápia ao molho',       'Opção de proteína com acréscimo de R$ 6 por marmita.',                  6.00::numeric, 12),
            ('Salmão',                         'Opção de proteína com acréscimo de R$ 9 por marmita.',                  9.00::numeric, 13),
            ('Contra-filé',                    'Opção de proteína com acréscimo de R$ 9 por marmita.',                  9.00::numeric, 14)
          ) as sabores(name, description, additional_price, sort_order)
    loop
        insert into public.flavors (
            catalog_id,
            name,
            description,
            is_active,
            sort_order
        )
        values (
            v_catalog_id,
            r.name,
            r.description,
            true,
            r.sort_order
        )
        on conflict (catalog_id, lower(name)) do update
           set description = excluded.description,
               is_active = true,
               sort_order = excluded.sort_order,
               updated_at = now();
    end loop;

    -- -------------------------------------------------------------------------
    -- 5. Produtos Tradicional e Fitness usam seleção de sabores
    -- -------------------------------------------------------------------------
    update public.products
       set purchase_mode = 'flavor_bundle',
           updated_at = now()
     where catalog_id = v_catalog_id
       and (
            name ilike '%Tradicional%'
            or name ilike '%Fitness%'
            or name ilike '%Marmita tradicional%'
            or name ilike '%Marmita fit%'
       );

    -- -------------------------------------------------------------------------
    -- 6. Vincular TODAS as 15 opções aos produtos Tradicional/Fitness
    --    com o acréscimo correto.
    -- -------------------------------------------------------------------------
    insert into public.product_flavors (
        catalog_id,
        product_id,
        flavor_id,
        sort_order,
        additional_price,
        is_available
    )
    select
        v_catalog_id,
        p.id,
        f.id,
        dados.sort_order,
        dados.additional_price,
        true
    from public.products p
    join (
        values
            ('Pernil suíno',                0.00::numeric,  0),
            ('Contra-filé suíno',           0.00::numeric,  1),
            ('Bisteca',                     0.00::numeric,  2),
            ('Carne moída',                 0.00::numeric,  3),
            ('Filé de frango',              0.00::numeric,  4),
            ('Coxa e sobrecoxa assada',     0.00::numeric,  5),
            ('Fígado acebolado em tiras',   0.00::numeric,  6),
            ('Carne de panela',             5.00::numeric,  7),
            ('Filé de frango à parmegiana', 5.00::numeric,  8),
            ('Filé de carne à parmegiana',  5.00::numeric,  9),
            ('Bife acebolado',              5.00::numeric, 10),
            ('Bife a rolê',                 5.00::numeric, 11),
            ('Filé de tilápia ao molho',    6.00::numeric, 12),
            ('Salmão',                      9.00::numeric, 13),
            ('Contra-filé',                 9.00::numeric, 14)
    ) as dados(name, additional_price, sort_order)
      on true
    join public.flavors f
      on f.catalog_id = v_catalog_id
     and lower(btrim(f.name)) = lower(btrim(dados.name))
    where p.catalog_id = v_catalog_id
      and (
           p.name ilike '%Tradicional%'
           or p.name ilike '%Fitness%'
           or p.name ilike '%Marmita tradicional%'
           or p.name ilike '%Marmita fit%'
      )
    on conflict (product_id, flavor_id) do update
       set additional_price = excluded.additional_price,
           is_available = true,
           sort_order = excluded.sort_order;

    -- -------------------------------------------------------------------------
    -- 7. Itens fechados permanecem simples
    -- -------------------------------------------------------------------------
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

commit;

-- =============================================================================
-- VERIFICAÇÃO
-- =============================================================================

-- Resumo
select
    c.slug,
    c.catalog_profile,
    c.minimum_order_quantity,
    (
        select count(*)
        from public.flavors f
        where f.catalog_id = c.id
          and lower(btrim(f.name)) in (
              lower('Pernil suíno'),
              lower('Contra-filé suíno'),
              lower('Bisteca'),
              lower('Carne moída'),
              lower('Filé de frango'),
              lower('Coxa e sobrecoxa assada'),
              lower('Fígado acebolado em tiras'),
              lower('Carne de panela'),
              lower('Filé de frango à parmegiana'),
              lower('Filé de carne à parmegiana'),
              lower('Bife acebolado'),
              lower('Bife a rolê'),
              lower('Filé de tilápia ao molho'),
              lower('Salmão'),
              lower('Contra-filé')
          )
    ) as sabores_canonicos,
    (
        select count(*)
        from public.products p
        where p.catalog_id = c.id
          and p.purchase_mode = 'flavor_bundle'
    ) as produtos_com_sabores,
    (
        select count(*)
        from public.product_flavors pf
        where pf.catalog_id = c.id
    ) as relacoes_produto_sabor
from public.catalogs c
where c.slug = 'lu-leve-e-saudavel';

-- Detalhamento dos 15 sabores e respectivos acréscimos
select
    f.name as sabor,
    min(pf.additional_price) as menor_acrescimo,
    max(pf.additional_price) as maior_acrescimo,
    count(distinct pf.product_id) as produtos_vinculados,
    f.is_active
from public.flavors f
join public.catalogs c
  on c.id = f.catalog_id
left join public.product_flavors pf
  on pf.flavor_id = f.id
 and pf.catalog_id = f.catalog_id
where c.slug = 'lu-leve-e-saudavel'
group by f.id, f.name, f.sort_order, f.is_active
order by f.sort_order, f.name;
