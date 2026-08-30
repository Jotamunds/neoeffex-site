-- Execute somente depois de criar o primeiro usuário em Authentication > Users.
-- Substitua o UUID abaixo pelo id desse usuário e execute no SQL Editor.

insert into public.catalogs (owner_id, name, slug)
values ('SUBSTITUA-PELO-UUID-DO-USUARIO', 'Lu Leve e Saudável', 'lu-leve-e-saudavel')
returning id;

-- Depois de executar 003_categories_and_multi_catalogs.sql, copie o id retornado acima
-- e crie as categorias de exemplo abaixo. Cada INSERT retornará o id da categoria.
-- insert into public.categories (catalog_id, name, sort_order)
-- values
--     ('SUBSTITUA-PELO-UUID-DO-CATALOGO', 'Tradicionais', 1),
--     ('SUBSTITUA-PELO-UUID-DO-CATALOGO', 'Fitness', 2);

-- Copie o id de uma categoria e use-o no campo category_id abaixo.
-- insert into public.products (catalog_id, category_id, name, description, price, status, sort_order)
-- values
--     ('SUBSTITUA-PELO-UUID-DO-CATALOGO', 'SUBSTITUA-PELO-UUID-DA-CATEGORIA', 'Marmita tradicional 500g', 'Arroz, feijão, proteína e acompanhamentos do dia.', 18.00, 'active', 1);
