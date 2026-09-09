# Testes do catálogo único

Execute nesta pasta `npm ci`, `node test-db.cjs` e `node test-ui.cjs`.
São testes locais: não acessam Supabase, GitHub ou contas reais.
O fixture reproduz o esquema e as políticas enviados no diagnóstico; os IDs
usados nos dados de teste são fictícios. O slug e o e-mail da Lu são usados
somente para testar o SQL de verificação direcionado ao piloto.

PGlite usa PostgreSQL 18.3; o projeto diagnosticado usa 17.6.
JSDOM verifica lógica e DOM, sem renderização visual e com Supabase simulado.
Não substitui o teste de produção com duas contas, Auth e Storage.
