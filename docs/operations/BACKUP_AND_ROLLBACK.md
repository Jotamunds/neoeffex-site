# Backup e rollback — Neoeffex

## Versão

```text
Procedimento: v0.1.9.2
Etapa: 10 — Operação e entrega ao cliente
```

## Objetivo

Definir como proteger e recuperar o sistema antes de:

- atualizações globais;
- migrations;
- alterações de schema;
- exclusões em massa;
- offboarding definitivo;
- manutenção de dados;
- mudanças que possam afetar vários clientes.

Este documento separa quatro coisas diferentes:

```text
Código
Banco de dados
Storage
Serviços gerenciados do Supabase
```

Um único backup não deve ser tratado como se cobrisse tudo.

---

# 1. Regra principal

Antes de uma alteração de alto risco:

```text
identificar estado estável
        ↓
registrar commit
        ↓
proteger banco quando necessário
        ↓
proteger Storage quando necessário
        ↓
executar mudança
        ↓
testar
```

Não improvisar rollback depois que o incidente já aconteceu.

---

# 2. Estado estável

Antes de cada release, preencher:

```text
Versão estável atual:
Commit estável:
Branch:
Data:
Migration mais recente aplicada:
Último backup verificado:
Responsável:
```

## Estado observado durante a criação da v0.1.9.2

No remoto do GitHub consultado durante a preparação deste documento:

```text
Branch: neoeffex-catalog
Último commit confirmado no remoto: cb58d00ec9bc302c05155475cea99a0e3a51bc51
Mensagem: v0.1.9 - Onboarding + estrutura operacional
```

A `v0.1.9.1` foi validada no fluxo de desenvolvimento, mas não aparecia como commit no remoto consultado.

Portanto, antes de publicar a `v0.1.9.2`:

```text
[ ] confirmar se a v0.1.9.1 foi commitada
[ ] confirmar o SHA real da versão anterior
[ ] registrar esse SHA como rollback
```

Nunca usar um SHA antigo apenas porque ele aparece neste documento.

---

# 3. Backup de código

O Git já é a principal proteção do código, desde que a versão estável esteja commitada e disponível remotamente.

Antes de release:

```bash
git status
git diff --check
git log -1 --oneline
git branch --show-current
```

Resultado esperado:

```text
working tree sem alterações inesperadas
commit estável identificado
branch correta
```

## Cópia adicional

Para releases de maior risco, manter também o ZIP da versão anterior.

Exemplo de registro:

```text
Versão:
Commit:
ZIP:
Data:
Local privado da cópia:
```

Não colocar backup contendo dados de cliente em repositório público.

---

# 4. Backup do banco Supabase

## 4.1. Backups gerenciados

O Supabase disponibiliza backups de banco conforme o plano e as opções habilitadas no projeto.

Antes de depender disso:

1. abra **Database → Backups**;
2. confirme se existem backups disponíveis;
3. registre o ponto de restauração mais recente;
4. confira se o recurso disponível atende ao risco da alteração.

Não escrever na documentação que existe PITR ou uma determinada retenção sem confirmar isso no projeto real.

## 4.2. Backup lógico manual

Quando for necessário manter uma cópia lógica independente, usar o Supabase CLI.

A conexão deve ser obtida no Dashboard.

**Nunca salvar a connection string com senha no repositório.**

Exemplo, usando placeholders:

```bash
supabase db dump --db-url "[CONNECTION_STRING]" -f roles.sql --role-only
supabase db dump --db-url "[CONNECTION_STRING]" -f schema.sql
supabase db dump --db-url "[CONNECTION_STRING]" -f data.sql --use-copy --data-only -x "storage.buckets_vectors" -x "storage.vector_indexes"
```

Guardar os arquivos em diretório privado, fora do repositório público.

Estrutura sugerida:

```text
backup-YYYYMMDD-HHMM/
├── roles.sql
├── schema.sql
├── data.sql
└── BACKUP-INFO.txt
```

`BACKUP-INFO.txt` pode conter:

```text
Data:
Projeto:
Versão do catálogo:
Commit:
Migration mais recente:
Motivo do backup:
Responsável:
```

Não registrar senha de banco.

---

# 5. Limites do backup lógico

O backup lógico via `supabase db dump` não deve ser tratado como cópia completa de todos os serviços do projeto.

Em especial:

- objetos do Storage precisam de tratamento separado;
- serviços gerenciados como Auth possuem particularidades próprias;
- mudanças em schemas gerenciados precisam de validação específica;
- restauração em outro projeto não é equivalente a simplesmente importar três arquivos sem análise.

Para recuperação completa do projeto, validar os recursos reais disponíveis no plano/projeto antes de uma situação de emergência.

---

# 6. Backup de Storage

Os backups do banco não restauram os arquivos binários guardados nos buckets.

No projeto atual existem pelo menos os fluxos de:

```text
catalog-products
catalog-identities
```

Por isso:

```text
backup do banco ≠ backup das imagens
```

## Quando o backup de Storage é obrigatório

Antes de:

- exclusão definitiva de cliente;
- limpeza em massa;
- alteração de caminhos;
- mudança de buckets;
- mudança de política que envolva remoção;
- rotina que apague imagens em lote.

## Procedimento atual

O repositório ainda não possui automação própria de backup dos buckets.

Portanto, na v0.1.9.2:

1. identificar owner e catálogo;
2. identificar os prefixos dos arquivos;
3. copiar os objetos necessários por meio do Dashboard/API do Storage para um local privado;
4. confirmar a quantidade de arquivos;
5. manter a estrutura de pastas;
6. só depois executar a operação destrutiva.

Para um backup global, copiar os dois buckets relevantes.

Não colocar esses arquivos no GitHub público.

---

# 7. Verificação do backup

Um arquivo existente não significa que o backup está utilizável.

Registrar:

```text
[ ] roles.sql existe
[ ] schema.sql existe
[ ] data.sql existe
[ ] arquivos possuem tamanho maior que zero
[ ] Storage necessário foi copiado
[ ] quantidade de arquivos conferida
[ ] versão/commit registrados
[ ] backup está em local privado
```

Opcionalmente gerar hashes dos arquivos.

PowerShell:

```powershell
Get-FileHash roles.sql -Algorithm SHA256
Get-FileHash schema.sql -Algorithm SHA256
Get-FileHash data.sql -Algorithm SHA256
```

Guardar os hashes no `BACKUP-INFO.txt`.

---

# 8. Quando fazer backup

## Obrigatório

```text
[ ] migration estrutural
[ ] exclusão em massa
[ ] offboarding definitivo
[ ] alteração de schema de alto risco
[ ] mudança que possa afetar todos os clientes
[ ] operação manual destrutiva
```

## Avaliar conforme risco

```text
[ ] release somente de CSS
[ ] documentação
[ ] texto
[ ] ajuste visual sem banco
```

Uma atualização documental como a `v0.1.9.2` não exige dump novo apenas por mudar os arquivos do repositório.

---

# 9. Rollback de código

Rollback de código significa voltar os arquivos publicados para um estado estável.

Não significa automaticamente voltar o banco.

## Caso simples — release em um commit

Se a nova versão foi um único commit e precisa ser desfeita:

```bash
git log --oneline -10
git revert <COMMIT_DA_VERSAO_COM_PROBLEMA>
```

Depois:

```bash
git status
git diff --check
```

Testar antes de publicar o commit de reversão.

`git revert` é preferível a reescrever histórico remoto porque cria um novo commit explícito.

## Restaurar arquivos a partir de um commit estável

Quando for necessário recuperar somente um conjunto de arquivos:

```bash
git restore --source=<COMMIT_ESTAVEL> -- admin catalogo
git diff
```

Se a documentação também fizer parte da recuperação:

```bash
git restore --source=<COMMIT_ESTAVEL> -- admin catalogo docs/operations README.md
```

Depois revisar e criar um novo commit de rollback.

Não usar `git reset --hard` em branch compartilhada/publicada como procedimento padrão.

---

# 10. GitHub Pages

O repositório possui GitHub Pages habilitado.

Entretanto, a fonte exata de publicação não está codificada em workflow dentro da branch do catálogo.

Antes do primeiro rollback real:

```text
[ ] abrir Settings → Pages
[ ] registrar a fonte de publicação
[ ] registrar branch
[ ] registrar diretório
[ ] confirmar se há deploy automático após commit/merge
```

Preencher:

```text
Fonte do GitHub Pages:
Branch publicada:
Diretório:
Domínio:
Procedimento de publicação:
```

Se Pages estiver publicando de uma branch, o rollback só chega ao site quando o commit restaurado estiver na **fonte realmente publicada**.

Não assumir que `neoeffex-catalog` é a branch publicada apenas porque ela é a branch de desenvolvimento do catálogo.

---

# 11. Smoke test após rollback de código

Depois de publicar a versão restaurada:

```text
[ ] /admin abre
[ ] login funciona
[ ] catálogo existente abre
[ ] identidade aparece
[ ] imagens aparecem
[ ] categorias aparecem
[ ] busca funciona
[ ] filtro funciona
[ ] carrinho funciona
[ ] WhatsApp abre com dados corretos
[ ] mobile funciona
[ ] aba anônima funciona
```

---

# 12. Rollback de banco

Rollback de banco é uma operação diferente e potencialmente destrutiva.

Nunca executar automaticamente:

```sql
DROP COLUMN
DROP TABLE
```

apenas porque o frontend voltou de versão.

## Primeiro avaliar compatibilidade

Exemplo:

```text
migration adicionou coluna opcional
frontend anterior ignora a coluna
```

Nesse caso, pode ser mais seguro:

```text
voltar somente o frontend
manter o banco no schema mais novo
```

do que apagar a coluna.

---

# 13. Antes de restaurar banco

```text
[ ] incidente confirmado
[ ] versão afetada identificada
[ ] backup anterior identificado
[ ] horário do backup registrado
[ ] possível perda de dados após o backup estimada
[ ] Storage avaliado separadamente
[ ] Auth avaliado separadamente
[ ] downtime comunicado quando necessário
[ ] responsável autorizou
```

Não restaurar banco por tentativa e erro.

---

# 14. Restauração gerenciada

Se o projeto possuir backup gerenciado apropriado:

1. abrir **Database → Backups**;
2. escolher ponto anterior ao incidente;
3. revisar a data/hora;
4. avaliar perda de dados posteriores;
5. planejar indisponibilidade;
6. confirmar restauração somente depois da autorização;
7. executar smoke test completo.

A disponibilidade e a retenção dependem da configuração real do projeto.

---

# 15. Restauração lógica manual

A restauração manual por `psql` é uma operação avançada.

Não executar diretamente no banco de produção sem:

- ambiente de teste;
- backup atual;
- verificação dos arquivos;
- conexão correta;
- conhecimento do impacto sobre schemas e serviços gerenciados.

O procedimento oficial do Supabase para migração/restauração utiliza os arquivos de roles, schema e data e deve ser consultado na versão atual da documentação antes de uma restauração real.

A v0.1.9.2 não automatiza essa ação.

---

# 16. Migrations e rollback

As migrations do projeto estão em:

```text
admin/setup/
```

Na base atual:

```text
001
002
003
004
005
006
007
008
```

Regra já identificada:

```text
007
 ↓
008
```

Se a `007_security_hardening.sql` for reaplicada, a `008_catalog_identity.sql` deve ser reaplicada em seguida para restaurar as permissões públicas das colunas de identidade.

Não usar migrations antigas isoladamente sem revisar dependências das posteriores.

---

# 17. Cenários de recuperação

## A. CSS/JS quebrou

```text
rollback de código
→ republicar
→ smoke test
```

Normalmente não mexer no banco.

## B. Migration nova aplicada, frontend quebrou

```text
avaliar se frontend anterior é compatível com schema novo
→ se sim, rollback somente do código
→ investigar migration separadamente
```

## C. Dados foram apagados

```text
interromper operações
→ identificar backup
→ avaliar Storage
→ avaliar Auth
→ planejar restauração
```

## D. Imagens foram apagadas

```text
backup de banco sozinho não resolve
→ usar cópia do Storage
→ restaurar objetos
→ validar paths
```

## E. Release global afetou vários clientes

```text
interromper próxima publicação
→ registrar incidente
→ voltar código
→ smoke test no demo
→ testar cliente antigo
→ só depois liberar novamente
```

---

# 18. Registro de rollback

```text
Data:
Incidente:
Versão problemática:
Commit problemático:
Versão restaurada:
Commit estável:
Banco restaurado: sim / não
Storage restaurado: sim / não
Downtime:
Responsável:
Testes executados:
Resultado:
```

---

# 19. Critério de aprovação

O processo está pronto quando a equipe consegue responder rapidamente:

```text
Qual é a versão estável?
Qual é o commit?
Onde está o backup?
O backup inclui o quê?
Storage está protegido?
Como voltar o código?
O banco precisa realmente voltar?
Qual fonte do Pages precisa receber o rollback?
Quais testes executar depois?
```

Se alguma resposta depender apenas da memória de uma pessoa, o processo ainda precisa ser atualizado.

---

# 20. Referências técnicas a validar antes de uma restauração real

Consultar a documentação oficial atual do Supabase para:

- Database Backups;
- Backup and Restore using the CLI;
- referência de `supabase db dump`;
- comportamento do plano atual;
- restauração/PITR, quando disponível.

Não copiar comandos de fontes antigas durante um incidente sem conferir a documentação atual.
