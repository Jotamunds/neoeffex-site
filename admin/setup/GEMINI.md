# Admin Setup / Supabase — Regras de Segurança para Migrations

Estas instruções complementam `admin/GEMINI.md` e o `GEMINI.md` da raiz.

## Área crítica

Os arquivos desta pasta podem alterar schema, políticas, permissões e dados do Supabase.

Nunca trate migrations como arquivos comuns de frontend.

Antes de criar, editar, sugerir ou aplicar SQL:

1. leia `SETUP.md`;
2. leia `PRODUCTION-CHECKLIST.md` quando relevante;
3. consulte `../../DECISIONS.md`;
4. identifique quais migrations já foram aplicadas no banco alvo;
5. verifique dependências entre versões;
6. preserve dados existentes;
7. considere rollback ou caminho seguro de correção.

## Decisão atual sobre múltiplos catálogos

`../../DECISIONS.md` é a fonte de decisão arquitetural atual e determina que uma conta pode possuir mais de um catálogo.

Existe nesta pasta uma migration histórica chamada:

`009_single_catalog_per_owner.sql`

E `SETUP.md` ainda contém instruções relacionadas a ela.

Portanto, NÃO aplique, reaplique, recomende ou replique automaticamente uma restrição de catálogo único apenas porque essa migration existe.

Se uma tarefa tocar nesse ponto:

- sinalize a inconsistência entre documentação/migration e a decisão atual;
- preserve a regra atual de múltiplos catálogos;
- proponha uma migration nova e explícita para reconciliar o banco quando necessário;
- não reescreva migration já aplicada em produção como se nunca tivesse existido.

## Migrations

Prefira migrations novas e numeradas para mudanças de schema em vez de alterar silenciosamente migrations históricas já utilizadas.

Uma migration deve, quando possível:

- ser segura para dados existentes;
- evitar operações destrutivas sem proteção;
- considerar execução parcial ou repetida quando isso for relevante;
- documentar dependências;
- manter RLS e privilégios coerentes;
- não expor dados entre clientes.

## Segurança

Nunca adicionar ao repositório:

- `service_role`;
- secret key;
- senha de banco;
- token privado;
- senha de cliente.

Frontend deve utilizar somente configurações públicas apropriadas.

## RLS e acesso público

Mudanças em RLS ou GRANT/REVOKE exigem análise de impacto em:

- `/admin/` autenticado;
- `/catalogo/` público;
- isolamento entre contas;
- Storage;
- identidade de catálogo;
- uploads.

Não desative RLS como atalho para corrigir erro de permissão.

## Ordem de migrations

Não reordene migrations existentes sem entender dependências.

A documentação atual destaca dependência entre `007_security_hardening.sql` e `008_catalog_identity.sql`; preserve essa relação ao trabalhar na instalação atual.

## Exclusão

Qualquer operação destrutiva deve verificar:

- catálogo correto;
- proprietário correto;
- estado permitido;
- relacionamentos dependentes;
- confirmação no fluxo de UI quando aplicável.
