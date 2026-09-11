-- Neoeffex — proporção configurável da logo do catálogo
begin;

alter table public.catalogs
    add column if not exists logo_aspect_ratio text not null default 'square';

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'catalogs_logo_aspect_ratio_check'
          and conrelid = 'public.catalogs'::regclass
    ) then
        alter table public.catalogs
            add constraint catalogs_logo_aspect_ratio_check
            check (logo_aspect_ratio in ('square','portrait_3_4','landscape_4_3'));
    end if;
end
$$;

grant select (logo_aspect_ratio) on public.catalogs to anon;

comment on column public.catalogs.logo_aspect_ratio is
    'Proporção da logo: square, portrait_3_4 ou landscape_4_3.';

notify pgrst, 'reload schema';

commit;

select
    count(*) as catalogos,
    count(*) filter (where logo_aspect_ratio = 'square') as square,
    count(*) filter (where logo_aspect_ratio = 'portrait_3_4') as portrait_3_4,
    count(*) filter (where logo_aspect_ratio = 'landscape_4_3') as landscape_4_3
from public.catalogs;
