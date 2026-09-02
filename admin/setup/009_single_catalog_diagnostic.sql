-- Diagnóstico somente leitura para a migration 009.
-- Resultado vazio = nenhuma conta possui mais de um catálogo.

select
    owner_id,
    count(*) as catalog_count,
    array_agg(name order by created_at) as catalog_names,
    array_agg(slug order by created_at) as catalog_slugs
from public.catalogs
group by owner_id
having count(*) > 1
order by catalog_count desc, owner_id;
