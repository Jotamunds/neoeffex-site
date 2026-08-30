-- Execute somente depois de criar o primeiro usuário em Authentication > Users.
-- Substitua o UUID abaixo pelo id desse usuário e execute no SQL Editor.

insert into public.catalogs (owner_id, name, slug)
values ('35f1d754-ae41-4b14-9c0a-2fdac5629d79', 'Lu Leve e Saudável', 'lu-leve-e-saudavel')
returning id;

-- Copie o id retornado acima e use-o no campo catalog_id abaixo.
-- insert into public.products (catalog_id, name, description, category, price, status, sort_order)
-- values
--     ('bdced49c-2750-4f61-912f-faaff5c87998', 'Marmita tradicional 500g', 'Arroz, feijão, proteína e acompanhamentos do dia.', 'Tradicionais', 18.00, 'active', 1),
--     ('bdced49c-2750-4f61-912f-faaff5c87998', 'Marmita fitness 400g', 'Equilíbrio entre proteína, carboidrato e legumes.', 'Fitness', 20.00, 'active', 2);
--
--     Antigos:
--     ('SUBSTITUA-PELO-UUID-DO-CATALOGO', 'Marmita tradicional 500g', 'Arroz, feijão, proteína e acompanhamentos do dia.', 'Tradicionais', 18.00, 'active', 1),
--     ('SUBSTITUA-PELO-UUID-DO-CATALOGO', 'Marmita fitness 400g', 'Equilíbrio entre proteína, carboidrato e legumes.', 'Fitness', 20.00, 'active', 2);
