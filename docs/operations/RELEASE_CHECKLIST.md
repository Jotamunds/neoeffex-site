# Checklist de release — Neoeffex

## Versão

```text
Procedimento: v0.1.9.2
Etapa: 10 — Operação e entrega ao cliente
```

## Objetivo

Este é o checklist principal antes de uma atualização global do sistema de catálogo.

Use junto com:

```text
admin/setup/PRODUCTION-CHECKLIST.md
docs/operations/BACKUP_AND_ROLLBACK.md
```

O checklist de produção valida segurança.

Este documento valida **todo o release**.

---

# 1. Classificar a atualização

```text
Versão:
Responsável:
Data:
Branch:
Commit anterior:
Migration nova: sim / não
Mudança de banco: sim / não
Mudança de Storage: sim / não
Mudança de Auth: sim / não
Mudança de Admin: sim / não
Mudança de catálogo público: sim / não
```

## Risco

Classificar:

```text
Baixo
- documentação
- texto
- CSS isolado

Médio
- JavaScript
- fluxo de formulário
- upload
- carrinho

Alto
- migration
- RLS
- Storage policy
- autenticação
- exclusão/migração de dados
```

---

# 2. Antes de alterar

```text
[ ] Branch correta
[ ] Versão estável anterior identificada
[ ] Commit estável anterior registrado
[ ] Migration mais recente conhecida
[ ] Fonte de publicação conhecida
[ ] Mudanças planejadas possuem escopo definido
```

Se o commit anterior não estiver no remoto:

```text
PARE
```

Commitar/publicar a versão estável antes de avançar.

---

# 3. Git

Executar:

```bash
git status
git diff --check
git diff
git log -1 --oneline
```

Confirmar:

```text
[ ] Nenhum arquivo inesperado
[ ] Nenhum conflito
[ ] Nenhum secret
[ ] Nenhuma credencial de cliente
[ ] VERSION correta
[ ] CHANGELOG atualizado
```

---

# 4. Segredos

Pesquisar no diff por:

```text
service_role
sb_secret_
password
senha
token
DATABASE_URL
connection string
```

A existência de palavras como `senha` em documentação é aceitável.

O problema é existir um **valor secreto real**.

Nunca publicar:

```text
senha de cliente
senha do banco
secret key
service_role
token pessoal
access token
connection string com senha
```

---

# 5. Versionamento

O catálogo usa:

```text
admin/VERSION
catalogo/VERSION
```

Obrigatório:

```text
[ ] admin/VERSION = versão do release
[ ] catalogo/VERSION = versão do release
[ ] ambas iguais
[ ] painel mostra a versão correta
[ ] CHANGELOG contém a versão
```

O `VERSION` da raiz pertence à landing page e não precisa acompanhar a versão do catálogo.

---

# 6. Migration

## Sem migration nova

```text
[ ] Não executar SQL desnecessário
[ ] Não reaplicar 007 por rotina
[ ] Não tocar no schema apenas para publicar frontend
```

## Com migration nova

```text
[ ] Arquivo revisado
[ ] Ordem definida
[ ] Backup adequado realizado
[ ] Dependência das migrations anteriores revisada
[ ] Idempotência avaliada quando aplicável
[ ] RLS revisada
[ ] Grants revisados
[ ] Rollback/compatibilidade pensados antes da execução
```

Nunca executar migration destrutiva em produção sem cópia adequada.

---

# 7. Regra 007 → 008

Na base atual:

```text
007_security_hardening.sql
        ↓
008_catalog_identity.sql
```

Se a 007 for reaplicada:

```text
[ ] 008 será executada depois
```

Não deixar a aplicação apenas com os grants da 007.

---

# 8. Backup

Seguir:

```text
docs/operations/BACKUP_AND_ROLLBACK.md
```

## Obrigatório se release for de alto risco

```text
[ ] Backup do banco identificado/criado
[ ] Versão e commit registrados
[ ] Backup verificado
[ ] Storage copiado quando a operação puder apagar/alterar objetos
```

Para release sem banco e sem operação destrutiva:

```text
[ ] Commit anterior remoto identificado
[ ] ZIP anterior disponível quando necessário
```

---

# 9. Teste local

Antes de publicar:

```text
[ ] Admin abre
[ ] Login funciona
[ ] Catálogo seleciona corretamente
[ ] Categoria funciona
[ ] Produto funciona
[ ] Editor de imagem funciona
[ ] Logo funciona
[ ] Catálogo público abre
[ ] Busca funciona
[ ] Filtro funciona
[ ] Carrinho funciona
[ ] WhatsApp funciona
```

Se a mudança não envolve uma área, ainda realizar um smoke test mínimo.

---

# 10. Teste de catálogo antigo

Usar um catálogo criado antes da versão atual.

Confirmar:

```text
[ ] Abre
[ ] Campos opcionais vazios não quebram
[ ] Sem logo continua funcionando
[ ] Produto sem imagem continua funcionando
[ ] Carrinho continua funcionando
```

Isso protege compatibilidade retroativa.

---

# 11. Teste com catálogo de regressão/demo

Usar o catálogo definido em:

```text
docs/operations/DEMO_CATALOG_CHECKLIST.md
```

Se ele ainda não tiver sido criado, isso bloqueia a validação final para cliente piloto.

Nunca usar cliente real como ambiente primário.

Testar:

```text
[ ] Produto com imagem
[ ] Produto sem imagem
[ ] Produto ativo
[ ] Produto pausado
[ ] Mais de uma categoria
[ ] Carrinho com mais de um item
[ ] Quantidade > 1
[ ] Total com centavos
[ ] Logo
[ ] Identidade
```

O catálogo demo oficial será formalizado na `v0.1.9.3`.

---

# 12. Desktop

```text
[ ] Admin
[ ] Modal de produto
[ ] Modal de catálogo
[ ] Editor de imagem
[ ] Catálogo público
[ ] Carrinho
```

Não há necessidade de testar todas as resoluções possíveis.

O objetivo é identificar regressões visíveis.

---

# 13. Mobile

Testar pelo menos uma largura típica de celular.

```text
[ ] Login
[ ] Admin navegável
[ ] Formulários utilizáveis
[ ] Editor de imagem utilizável
[ ] Logo pública adequada
[ ] Cards adequados
[ ] Carrinho acessível
[ ] WhatsApp acessível
```

---

# 14. Aba anônima

Obrigatório antes de release que altere leitura pública ou segurança.

```text
[ ] Catálogo ativo abre
[ ] Catálogo pausado não expõe conteúdo
[ ] Produto pausado não aparece
[ ] Painel não fica público
[ ] Carrinho funciona sem login
```

---

# 15. Duas contas

Obrigatório para mudanças em:

```text
RLS
catálogos
categorias
produtos
Storage
Auth
owner
```

Confirmar:

```text
[ ] Conta B não lê dados administrativos da Conta A
[ ] Conta B não altera dados da Conta A
[ ] Imagens usam owner correto
[ ] Catálogo selecionado não vaza entre sessões
```

Para release exclusivamente documental, não é necessário repetir o teste completo.

---

# 16. WhatsApp

Quando pedidos estiverem habilitados:

```text
[ ] Número correto
[ ] Produtos corretos
[ ] Quantidades corretas
[ ] Subtotais corretos
[ ] Total correto
[ ] Instrução correta
```

Abrir o WhatsApp não significa pedido confirmado.

---

# 17. Antes da publicação

```text
[ ] Todos os testes aplicáveis passaram
[ ] Commit anterior registrado
[ ] Rollback conhecido
[ ] Backup adequado existe quando necessário
[ ] Versões sincronizadas
[ ] CHANGELOG pronto
[ ] Nenhuma migration pendente
[ ] Nenhuma decisão crítica ficou somente na memória
```

---

# 18. Commit

Criar o commit somente depois da revisão.

Formato recomendado:

```text
v0.1.x - descrição curta
```

Depois:

```bash
git status
git log -1 --oneline
```

Registrar o SHA criado.

---

# 19. Publicação

O repositório possui GitHub Pages habilitado, mas a fonte de Pages deve ser conferida em **Settings → Pages**.

Antes da primeira release usando este checklist, preencher:

```text
Fonte:
Branch:
Diretório:
Domínio:
Deploy após commit/merge:
```

Publicar pelo processo realmente configurado.

Não inventar outro caminho.

---

# 20. Smoke test pós-publicação

Imediatamente após publicar:

```text
[ ] Domínio abre
[ ] /admin abre
[ ] Login funciona
[ ] Catálogo público abre
[ ] Logo/identidade aparecem
[ ] Produto aparece
[ ] Imagem aparece
[ ] Busca funciona
[ ] Filtro funciona
[ ] Carrinho funciona
[ ] WhatsApp abre
[ ] Mobile abre
[ ] Aba anônima abre
```

Para alterações de segurança, repetir os testes específicos do:

```text
admin/setup/PRODUCTION-CHECKLIST.md
```

---

# 21. Se o smoke test falhar

Não continuar testando clientes reais esperando que o erro se resolva.

```text
1. interromper a liberação;
2. registrar o problema;
3. identificar se é código ou banco;
4. usar BACKUP_AND_ROLLBACK.md;
5. restaurar código quando apropriado;
6. testar novamente;
```

Não restaurar banco automaticamente se o problema for somente frontend.

---

# 22. Registro do release

```text
Versão:
Commit:
Data:
Responsável:
Migration:
Backup:
Fonte publicada:
Smoke test:
Rollback commit:
Problemas:
Resultado final:
```

---

# 23. Critério de liberação

Liberar quando:

```text
[ ] Git limpo
[ ] Versão correta
[ ] CHANGELOG correto
[ ] Sem secrets
[ ] Migration tratada
[ ] Backup tratado conforme risco
[ ] Admin aprovado
[ ] Público aprovado
[ ] Mobile aprovado
[ ] WhatsApp aprovado
[ ] Aba anônima aprovada
[ ] Rollback identificado
[ ] Smoke test pós-publicação aprovado
```

Se um fluxo essencial falhar:

```text
NÃO LIBERAR
```
