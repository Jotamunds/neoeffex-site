# Neoeffex — plano seguro para simplificação de lojas e nova área de Configurações

**Projeto:** `Jotamunds/neoeffex-site`  
**Branch de trabalho:** `main`  
**Base obrigatória:** `ec32afc9a0b3d0a704df32c4b354748b7c5e1fed`  
**Commit:** `v0.3.0 - organiza lojas com catálogo único e filtros`  
**Objetivo:** remover do painel do lojista a criação de novas lojas, preservar a estrutura de catálogo único por loja e reorganizar categorias, subcategorias, tipos e grupos em uma área própria de **Configurações**, reduzindo riscos de regressão.

---

# 1. Decisão funcional principal

A partir desta revisão, o painel do **lojista** deve seguir esta lógica:

```text
conta autenticada
    ↓
loja previamente vinculada/provisionada
    ↓
um único catálogo por loja
    ↓
produtos + configurações
```

O lojista **não deve criar novas lojas nem novos catálogos pelo painel**.

A estrutura de backend pode continuar permitindo que a Neoeffex administre ou provisione múltiplas lojas para uma mesma conta no futuro. Portanto, esta etapa não deve transformar obrigatoriamente o banco em `1 conta = 1 loja`.

A regra deve ser:

```text
1 loja → entra diretamente nela
2+ lojas existentes → pode alternar entre elas
0 lojas → mostra estado de provisionamento
```

Nunca:

```text
lojista → Nova loja → novo catálogo
```

---

# 2. Problemas identificados na v0.3.0

## 2.1. `newCatalogButton` pode quebrar todo o JavaScript

Atualmente o botão `#newCatalogButton` é referenciado por vários arquivos.

Se o HTML remover o botão, mas qualquer JavaScript continuar executando algo como:

```js
newCatalogButton.addEventListener(...)
```

ou:

```js
document.getElementById("newCatalogButton").addEventListener(...)
```

o painel pode falhar durante a inicialização.

### Arquivos que obrigatoriamente devem ser revisados

- `admin/index.html`
- `admin/assets/js/admin.js`
- `admin/assets/js/catalog-identity.js`
- `admin/assets/js/image-editor.js`
- `tests/catalogo-unico/test-ui.cjs`

### Correção obrigatória

Fazer busca global por:

```text
newCatalogButton
```

e revisar **todas** as ocorrências antes de excluir o elemento.

Não esconder o botão apenas com CSS.

---

## 2.2. `saveCatalog()` ainda possui caminho de INSERT

Hoje o fluxo segue aproximadamente:

```text
se existe catalogId
    → UPDATE
senão
    → INSERT
```

Mesmo que o botão "Nova loja" desapareça, isso mantém um caminho oculto para criação.

### Correção obrigatória

No painel do lojista:

```text
sem catalogId
    → abortar
    → informar erro
```

Nunca usar `INSERT` como fallback.

A criação/provisionamento de loja deve ficar fora deste fluxo.

---

## 2.3. `openCatalogModal()` ainda diferencia "editar" e "criar"

Atualmente a ausência de catálogo pode fazer o modal entrar em modo:

```text
Nova loja
```

### Correção obrigatória

O modal deve ser somente de edição.

Conceitualmente:

```text
openCatalogModal(catalog)

se catalog não existe
    → não abrir
```

Pode ser renomeado futuramente para algo como:

```text
openStoreSettingsModal()
```

mas não é obrigatório nesta etapa.

---

## 2.4. Exclusão da loja pode deixar a conta inutilizável

Hoje existe fluxo de exclusão de catálogo pausado que também remove a loja.

Antes isso podia ser recuperado pelo botão "Nova loja".

Depois da remoção da criação, o fluxo poderia virar:

```text
loja
    ↓
pausar
    ↓
excluir
    ↓
conta sem loja
    ↓
sem botão para criar outra
```

### Correção recomendada

Retirar do painel do lojista a exclusão definitiva de loja/catálogo.

Manter apenas:

- editar dados;
- ativar/pausar;
- configurar pedidos;
- identidade;
- slug;
- WhatsApp.

A RPC e a estrutura do banco **não precisam ser apagadas nesta etapa**.

---

## 2.5. Conta com múltiplas lojas existentes não pode perder acesso

A arquitetura atual permite várias lojas pertencentes à mesma conta.

Portanto, não remova o seletor de forma absoluta.

### Regra correta

#### 0 lojas

Mostrar:

> Nenhuma loja vinculada a esta conta. Entre em contato com a Neoeffex para concluir a configuração.

Desabilitar:

- Novo produto;
- Configurações;
- Pedidos;
- edição de loja.

Não oferecer criação.

#### 1 loja

Mostrar o nome da loja sem `select`.

#### 2 ou mais lojas

Mostrar seletor apenas para alternar entre lojas existentes.

Não oferecer criação.

---

## 2.6. `loadSequence` não deve ser removido

A v0.3.0 possui proteção contra respostas assíncronas atrasadas ao trocar de loja.

Exemplo de problema evitado:

```text
abre loja A
requisição A demora

troca para loja B
requisição B termina

requisição A termina depois
```

Sem proteção, produtos da loja A podem sobrescrever a tela da loja B.

### Correção obrigatória

Preservar:

- `loadSequence`;
- verificações de catálogo ativo;
- descarte de respostas atrasadas.

Não "simplificar" esse fluxo.

---

## 2.7. `catalog-identity.js` e `image-editor.js` escutam eventos do modal

Esses arquivos dependem do fluxo do catálogo/loja.

Ao remover criação, não remover acidentalmente:

- edição da identidade;
- edição de imagens;
- configuração de pedidos.

### Correção

Remover apenas dependências de `newCatalogButton`.

Preservar:

- `editCatalogButton`;
- `configureOrdersButton`.

---

## 2.8. Os testes atuais validam "Nova loja"

A suíte de UI atual ainda espera encontrar o botão.

### Correção

Não apenas apagar o teste.

Alterar o objetivo:

```text
newCatalogButton não existe
```

e adicionar cenários de:

- zero lojas;
- uma loja;
- múltiplas lojas.

---

## 2.9. Cache pode combinar HTML novo com JavaScript antigo

Se o HTML remover um elemento e o navegador continuar usando JS antigo, podem surgir erros mesmo com o código correto no repositório.

### Correção

Revisar cache busting/versionamento dos assets modificados:

```text
admin.css
admin.js
catalog-identity.js
image-editor.js
```

Evitar:

```text
HTML novo + JS antigo
```

---

# 3. Problema atual de Categorias, Tipos e Grupos

Na v0.3.0:

- Categorias possuem tela própria;
- Tipo é `input` de texto com `datalist`;
- Grupos é `input` de texto com valores separados por vírgula;
- sugestões de Tipo/Grupo são extraídas dos próprios produtos existentes.

Isso gera uma arquitetura invertida:

```text
produto
    ↓
usuário digita grupo
    ↓
sistema passa a considerar o grupo existente
```

O desejado é:

```text
Configurações
    ↓
cadastro de categorias / subcategorias / tipos / grupos
    ↓
produto apenas seleciona
```

---

# 4. Bug visual atual do campo "Grupos"

O texto:

```text
Separe por vírgulas. Até 10 grupos de 60 caracteres.
```

está usando estilo de `.field-hint` com posicionamento absoluto.

Isso pode fazer a dica entrar sobre o campo.

### Correção

Separar estilos.

Exemplo conceitual:

```css
.field-hint {
    position: static;
}

.field-hint--counter {
    position: absolute;
}
```

Contadores internos, como quantidade de caracteres, podem continuar posicionados.

Textos explicativos devem ficar no fluxo normal do formulário.

Essa correção deve ocorrer junto da nova experiência de seleção de grupos.

---

# 5. Nova arquitetura da área "Configurações"

Substituir a entrada:

```text
Categorias
```

por:

```text
Configurações
```

## Estrutura proposta

```text
Configurações
├── Categorias
├── Subcategorias
├── Tipos
└── Grupos
```

---

## 5.1. Categorias

Responsabilidade:

- criar;
- editar;
- ordenar;
- excluir quando permitido.

Exemplos:

```text
Marmitas
Bebidas
Sobremesas
```

---

## 5.2. Subcategorias

Responsabilidade:

- criar;
- escolher categoria pai;
- editar;
- ordenar;
- excluir quando permitido.

Exemplo:

```text
Marmitas
├── Tradicionais
├── Fitness
└── Low Carb
```

Continuar respeitando o limite atual de dois níveis.

---

## 5.3. Tipos

Não usar mais texto livre no produto.

Criar estrutura persistente configurável.

Exemplos:

```text
Individual
Combo
Kit
Tradicional
```

O produto deve apenas selecionar um tipo cadastrado.

Pode continuar opcional.

---

## 5.4. Grupos

Não usar mais campo de texto separado por vírgulas.

Criar estrutura persistente configurável.

Exemplos:

```text
Mais pedidos
Promoções
Novidades
Destaques
```

No produto, usar seleção múltipla.

---

# 6. Estratégia recomendada de desenvolvimento

Não implementar tudo em uma única alteração.

Dividir em etapas para reduzir regressões.

---

# ETAPA 0 — Preparação e auditoria

## Objetivo

Confirmar que o código local está exatamente sobre a base correta.

## Antes de editar

1. Confirmar branch:

```bash
git branch --show-current
```

Esperado:

```text
main
```

2. Confirmar base:

```bash
git log -1 --oneline
```

Esperado:

```text
ec32afc v0.3.0 - organiza lojas com catálogo único e filtros
```

3. Verificar alterações locais:

```bash
git status
```

4. Fazer buscas globais por:

```text
newCatalogButton
openCatalogModal
saveCatalog
deleteCatalogButton
categoriesMenuLink
manageCategoriesButton
productType
productGroups
field-hint
loadSequence
```

5. Não editar banco nesta etapa.

## Critério de conclusão

Antes de programar, listar todos os arquivos afetados.

---

# ETAPA 1 — Remover criação de loja do painel do lojista

## Objetivo

Transformar o painel em gerenciamento de lojas já provisionadas.

## Alterações

### Remover

- botão `Nova loja`;
- eventos relacionados à criação;
- caminho `INSERT` no `saveCatalog`;
- modo "Nova loja" do modal;
- textos "Selecione ou crie";
- textos que incentivem criação;
- ação de exclusão definitiva da loja no painel.

### Preservar

- edição;
- slug;
- identidade;
- status;
- WhatsApp;
- pedidos;
- catálogo público;
- imagens;
- carrinho;
- RLS atual;
- múltiplas lojas já existentes.

---

## Estados obrigatórios

### 0 lojas

```text
Nenhuma loja vinculada a esta conta.
Entre em contato com a Neoeffex para concluir a configuração.
```

Sem botão de criação.

### 1 loja

Abrir automaticamente.

Ocultar seletor.

### 2+ lojas

Mostrar seletor.

Permitir apenas alternância.

---

## Salvaguardas

- não remover `loadSequence`;
- não quebrar `catalog-identity.js`;
- não quebrar `image-editor.js`;
- não apagar RPCs;
- não criar migration;
- não mudar RLS ainda;
- não transformar conta em `UNIQUE(owner_id)`.

---

## Testes mínimos

### Conta sem loja

- painel carrega;
- nenhum erro JS;
- novo produto desabilitado;
- nenhuma criação disponível.

### Conta com uma loja

- abre automaticamente;
- não mostra seletor;
- editar funciona;
- pedidos funcionam;
- identidade funciona;
- produto funciona.

### Conta com múltiplas lojas

- seletor aparece;
- troca corretamente;
- produtos não vazam entre lojas;
- respostas atrasadas não sobrescrevem loja ativa.

---

## Critério de conclusão

Não deve existir caminho normal no frontend que faça:

```text
INSERT em catalogs
```

para criar nova loja.

---

# ETAPA 2 — Criar a nova aba "Configurações"

## Objetivo

Substituir a navegação antiga de Categorias.

## Alterações

Trocar:

```text
Categorias
```

por:

```text
Configurações
```

Criar uma interface organizada contendo:

```text
Categorias
Subcategorias
Tipos
Grupos
```

---

## Cuidados

Não transformar a tela em um modal excessivamente grande.

Preferir:

- página/seção própria;
- abas internas;
- cards;
- blocos separados.

A interface deve funcionar bem em:

- desktop;
- tablet;
- mobile.

---

## Categorias e subcategorias

A lógica atual pode ser aproveitada.

Mas a UI deve separar claramente:

```text
Categoria principal
```

de:

```text
Subcategoria
```

Evitar obrigar o usuário a entender `parent_id`.

---

## Critério de conclusão

O usuário deve conseguir definir toda a estrutura de organização antes de editar qualquer produto.

---

# ETAPA 3 — Persistência de Tipos e Grupos

## Objetivo

Eliminar valores livres derivados dos produtos.

## Atenção

Esta é a primeira etapa que provavelmente exigirá alteração no banco.

Não improvisar campos JSON em produto sem planejamento.

---

## Estrutura recomendada

Pode ser implementada com tabelas próprias, por exemplo:

```text
product_types
product_groups
```

Cada registro deve estar ligado ao catálogo correto.

Exemplo conceitual:

```text
product_types
- id
- catalog_id
- name
- sort_order
- created_at

product_groups
- id
- catalog_id
- name
- sort_order
- created_at
```

---

## Requisitos

- RLS por proprietário;
- isolamento entre catálogos;
- nomes duplicados tratados;
- ordenação;
- exclusão protegida;
- compatibilidade com dados existentes;
- migration transacional;
- rollback por erro;
- verificação pós-migration.

---

## Migração de dados existentes

Produtos atuais podem possuir:

```text
product_type
product_groups[]
```

Não apagar esses dados.

Criar rotina para:

1. coletar tipos existentes;
2. criar registros únicos;
3. coletar grupos existentes;
4. criar registros únicos;
5. associar produtos;
6. conferir contagens;
7. somente depois avaliar remoção de campos legados.

Preferir manter compatibilidade por uma versão antes de remover campos antigos.

---

# ETAPA 4 — Produto passa a somente selecionar

## Objetivo

O formulário de produto deixa de criar classificações.

---

## Categoria

Usar select.

---

## Subcategoria

Pode ser:

```text
Categoria
[Marmitas ▼]

Subcategoria
[Fitness ▼]
```

A subcategoria deve ser filtrada pela categoria escolhida.

---

## Tipo

Trocar:

```text
input + datalist
```

por:

```text
select
```

---

## Grupos

Trocar:

```text
input separado por vírgulas
```

por seleção múltipla.

Possíveis interfaces:

```text
checkboxes
```

ou:

```text
multi-select com chips
```

Evitar exigir sintaxe manual com vírgulas.

---

## Estado sem configuração

Se não houver Tipos cadastrados:

```text
Nenhum tipo configurado.
Configure em Configurações.
```

Se não houver Grupos:

```text
Nenhum grupo configurado.
Configure em Configurações.
```

Não permitir criação silenciosa pelo formulário do produto.

---

# ETAPA 5 — Refinamento visual, testes e documentação

## Objetivo

Concluir a mudança sem deixar inconsistências.

---

## Corrigir `.field-hint`

Texto explicativo normal:

```css
position: static;
```

Contador:

```css
.field-hint--counter
```

ou classe equivalente.

---

## Revisar textos

Fazer busca final por:

```text
Nova loja
Novo catálogo
crie uma loja
criar loja
criar catálogo
Selecione ou crie
Categorias
Separe por vírgulas
```

Avaliar cada ocorrência.

Não remover textos técnicos/documentais históricos quando necessários.

---

## Atualizar documentação

Revisar pelo menos:

- `admin/README.md`
- `admin/GEMINI.md`
- `admin/CHANGELOG.md`
- arquivos em `docs/`
- checklist de produção relevante.

Adicionar decisão explícita:

> O painel do lojista administra lojas já provisionadas. Não restaurar o botão ou fluxo de criação de loja sem nova decisão de produto.

Isso evita que outra IA "corrija" o sistema restaurando o comportamento antigo.

---

# 7. Regras que NÃO devem ser alteradas sem nova autorização

## Não fazer

- não adicionar `UNIQUE(owner_id)`;
- não transformar automaticamente `1 conta = 1 loja`;
- não apagar lojas existentes;
- não apagar catálogos existentes;
- não mudar slugs existentes;
- não recriar IDs;
- não mover imagens de Storage nesta fase;
- não apagar RPCs apenas porque saíram da UI;
- não usar lógica específica por slug;
- não criar exceção para a Lu no código compartilhado;
- não remover `loadSequence`;
- não substituir a arquitetura por vários catálogos novamente;
- não permitir criação de Tipos/Grupos pelo campo do produto;
- não usar campo de grupos separado por vírgulas como solução final;
- não fazer `reset --hard`;
- não usar force push.

---

# 8. Checklist de regressão do Admin

Depois de cada etapa, validar:

## Autenticação

- login;
- logout;
- recuperação de senha;
- sessão persistente;
- sincronização entre abas.

## Loja

- carregamento;
- edição;
- slug;
- status;
- identidade;
- pedidos;
- WhatsApp.

## Produtos

- listar;
- buscar;
- criar;
- editar;
- pausar;
- ativar;
- excluir;
- imagem;
- preço;
- descrição.

## Organização

- categoria;
- subcategoria;
- ordem;
- proteção contra terceiro nível;
- proteção de exclusão com dependências.

## Catálogo público

- carrega pelo slug;
- produtos corretos;
- filtros;
- carrinho;
- WhatsApp;
- imagens.

## Segurança

- conta A não acessa loja B;
- visitante não recebe dados administrativos;
- IDs de catálogo continuam isolados;
- nenhuma mudança de RLS ocorre sem testes.

---

# 9. Testes novos recomendados

Adicionar cenários automatizados para:

```text
admin_zero_stores
admin_single_store
admin_multiple_existing_stores
admin_cannot_create_store
admin_cannot_delete_store_from_ui
admin_store_edit_still_works
admin_switch_store_discards_stale_response
settings_categories
settings_subcategories
settings_types
settings_groups
product_selects_existing_type
product_selects_existing_groups
product_cannot_create_group_inline
```

---

# 10. Estratégia de commits

Não concentrar tudo em um único commit.

Sugestão:

```text
admin - v0.3.1 - remove criação de lojas do painel do lojista
```

```text
admin - v0.3.2 - reorganiza categorias em configurações
```

```text
admin - v0.3.3 - adiciona cadastros persistentes de tipos e grupos
```

```text
admin - v0.3.4 - integra classificações ao formulário de produtos
```

```text
admin - v0.3.5 - finaliza testes documentação e refinamentos
```

Os números podem ser ajustados ao versionamento real do componente.

---

# 11. Prompt inicial recomendado para o Antigravity

```text
Trabalhe no repositório Jotamunds/neoeffex-site, diretamente na branch main.

BASE OBRIGATÓRIA:
ec32afc9a0b3d0a704df32c4b354748b7c5e1fed
v0.3.0 - organiza lojas com catálogo único e filtros

Leia integralmente o arquivo de planejamento:
[INSERIR CAMINHO DESTE ARQUIVO .MD]

Não tente implementar todas as etapas de uma vez.

Execute SOMENTE a ETAPA 0 e a ETAPA 1.

Antes de editar:
1. confirme a branch atual;
2. confirme o SHA da base;
3. confira git status;
4. faça busca global pelas dependências indicadas;
5. liste os arquivos que serão alterados.

OBJETIVO DA ETAPA 1:
remover do painel do lojista a criação de novas lojas e catálogos,
preservando lojas já existentes e todo o restante do sistema.

REGRAS CRÍTICAS:
- não quebrar contas com múltiplas lojas existentes;
- não deixar referências JS para #newCatalogButton;
- não permitir INSERT em catalogs pelo saveCatalog;
- não deixar openCatalogModal entrar em modo de criação;
- retirar exclusão definitiva de loja da interface;
- preservar edição, pedidos, identidade, imagens e catálogo público;
- preservar loadSequence;
- não alterar migrations, RLS, grants ou triggers nesta etapa;
- não avançar para Configurações sem autorização.

AO FINAL:
- execute os testes;
- informe arquivos alterados;
- informe testes executados;
- informe riscos residuais;
- informe qualquer capacidade de criação que ainda exista apenas no backend;
- sugira mensagem de commit;
- pare e aguarde autorização para a próxima etapa.
```

---

# 12. Critério final de sucesso

O desenvolvimento estará correto quando:

```text
lojista
    ↓
entra
    ↓
administra loja(s) já vinculada(s)
    ↓
não cria outra loja
    ↓
configura categorias/subcategorias/tipos/grupos
    ↓
produto apenas seleciona classificações existentes
```

E não quando:

```text
lojista
    ↓
continua criando lojas
    ↓
cada loja vira apenas um novo nome para "catálogo"
```

A mudança deve simplificar a experiência sem sacrificar a arquitetura, segurança, compatibilidade e possibilidade futura de administração central pela Neoeffex.
