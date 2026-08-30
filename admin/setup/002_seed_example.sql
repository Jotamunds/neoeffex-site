-- Execute somente depois de criar o primeiro usuário em Authentication > Users.
-- Substitua o UUID abaixo pelo id desse usuário e execute no SQL Editor.

insert into public.catalogs (owner_id, name, slug)
values ('SUBSTITUA-PELO-UUID-DO-USUARIO', 'Lu Leve e Saudável', 'lu-leve-e-saudavel')
returning id;

-- Copie o id retornado acima e use-o no campo catalog_id abaixo.
-- insert into public.products (catalog_id, name, description, category, price, status, sort_order)
-- values
--     ('SUBSTITUA-PELO-UUID-DO-CATALOGO', 'Marmita tradicional 500g', 'Arroz, feijão, proteína e acompanhamentos do dia.', 'Tradicionais', 18.00, 'active', 1),
--     ('SUBSTITUA-PELO-UUID-DO-CATALOGO', 'Marmita fitness 400g', 'Equilíbrio entre proteína, carboidrato e legumes.', 'Fitness', 20.00, 'active', 2);
