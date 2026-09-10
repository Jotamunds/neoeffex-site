# PLANO — Layout, imagens e branding Neoeffex

## Objetivo

Atualizar o catálogo e o Admin para:

- auditar e corrigir inconsistências de layout;
- permitir logo do comércio em **1:1, 3:4 ou 4:3**, com **1:1 como padrão**;
- padronizar fotos de **produtos e sabores em 1:1**;
- disponibilizar o editor/popup de imagem em **produto, sabor e logo**, inclusive para imagens já salvas;
- aplicar a identidade da **Neoeffex** de forma consistente nas páginas da plataforma;
- preservar compatibilidade com dados e catálogos existentes.

---

## 1. Estado atual a considerar

Antes de editar, auditar o repositório real.

Já existe um editor reutilizável em:

```text
admin/assets/js/image-editor.js
```

Ele deve ser evoluído, não duplicado.

No estado observado, a configuração atual usa aproximadamente:

```text
Produto: 1200 × 900 (4:3)
Logo:    1050 × 600
```

A nova regra deve ser:

```text
Produto: 1200 × 1200
Sabor:   1200 × 1200

Logo:
1:1  → 1000 × 1000  (padrão)
3:4  → 900 × 1200
4:3  → 1200 × 900
```

Auditar também versões/cache-busting de:

```text
catalogo.css
catalogo.js
admin.css
admin.js
image-editor.js
flavors.js
profiles.js
organization.js
```

---

## 2. Arquitetura

Manter um único editor de imagem configurável.

Não criar editores separados para produto, sabor e logo.

O módulo deve aceitar configurações por contexto:

```js
productImage -> 1:1 fixo
flavorImage  -> 1:1 fixo
catalogLogo  -> proporção dinâmica
```

### Logo

Persistir a proporção escolhida no catálogo, se não houver campo equivalente.

Sugestão:

```text
catalogs.logo_aspect_ratio
```

Valores:

```text
square
portrait_3_4
landscape_4_3
```

Default:

```text
square
```

Criar migration nova. Não alterar migration já aplicada.

---

## 3. Editor da logo

No formulário da loja:

```text
Formato da logo

(●) Quadrada — 1:1 — recomendado
( ) Vertical — 3:4
( ) Horizontal — 4:3
```

A escolha deve:

1. atualizar a prévia;
2. atualizar o canvas do editor;
3. persistir no catálogo;
4. controlar o container da logo no catálogo público;
5. funcionar com imagem nova e imagem já salva.

Ao trocar a proporção dentro do editor:

- não perder o arquivo fonte;
- manter o editor aberto;
- recalcular escala;
- preservar posição/zoom quando possível;
- limitar offsets;
- redesenhar a grade.

---

## 4. Produto e sabor quadrados

Toda nova imagem de produto ou sabor deve sair do editor em:

```text
1:1
```

No frontend:

```css
aspect-ratio: 1 / 1;
object-fit: cover;
```

Aplicar onde essas imagens aparecem:

- preview do Admin;
- lista/tabela do Admin;
- cards públicos;
- modal de sabores;
- carrinho, se exibir imagem.

Não deformar imagens antigas.

Imagens antigas não quadradas devem continuar sendo exibidas com `object-fit`, sem reprocessamento destrutivo automático.

---

## 5. Popup/editor em todas as edições com foto

Cobertura obrigatória:

```text
Produto
Sabor
Logo do comércio
```

Cada fluxo deve permitir, quando aplicável:

```text
Selecionar imagem
Editar/Ajustar foto
Remover imagem
Prévia
```

### Imagem já existente

Fluxo esperado:

```text
Editar produto/sabor/loja
→ carregar imagem atual
→ Editar foto
→ abrir popup
→ reposicionar/zoom/recortar
→ Aplicar imagem
→ salvar formulário
```

Não exigir selecionar novamente o arquivo original.

Se CORS impedir carregar uma imagem atual, mostrar erro claro e oferecer seleção de novo arquivo, sem quebrar a edição dos outros campos.

---

## 6. Reaproveitar o editor existente

Preservar funcionalidades úteis:

```text
arrastar
zoom
centralizar
girar
preencher
encaixar
auto ajustar
grade
```

Produto/sabor:

```text
proporção bloqueada em 1:1
```

Logo:

```text
1:1 / 3:4 / 4:3
```

Cancelar por X, Esc, overlay ou botão Cancelar não deve aplicar alterações.

Somente `Aplicar imagem` confirma o resultado.

---

## 7. Flavor image

Integrar `flavorImage` ao mesmo editor.

Fluxos:

```text
Novo sabor
→ selecionar imagem
→ popup automático
→ recorte 1:1
→ aplicar
→ preview quadrado
→ salvar
```

e:

```text
Editar sabor existente
→ Editar foto
→ popup com imagem atual
→ aplicar
→ salvar
```

Evitar pipeline separado de upload e edição.

---

## 8. Gerenciamento de Blob/Object URL

Auditar:

```text
URL.createObjectURL
URL.revokeObjectURL
Blob
File
canvas
WeakMap
```

Evitar:

- vazamento de memória;
- URL revogada antes da hora;
- preview antigo reaparecendo;
- imagem de um produto aplicada em outro;
- imagem de outra loja sendo reutilizada por engano.

O preview deve refletir exatamente o Blob/File que será enviado.

---

## 9. Logo do comércio no catálogo público

Respeitar `logo_aspect_ratio`.

Containers:

```text
square          -> 1/1
portrait_3_4    -> 3/4
landscape_4_3   -> 4/3
```

Usar limites responsivos de largura/altura para uma logo vertical não dominar o hero.

A logo do comércio continua sendo a marca principal do catálogo.

---

## 10. Branding Neoeffex

Auditar e padronizar a presença da marca nas páginas da plataforma.

Reutilizar assets reais já existentes em `/img/logos`.

Exemplos conhecidos:

```text
/img/logos/neoeffex-n-logo-white.svg
/img/logos/png-neoeffex-logo-text-right-blue.png
```

Confirmar os arquivos antes do uso.

Prioridade:

```text
/
admin/
catalogo/
planos/
```

Não inserir branding invasivo em modelos/sites de clientes se isso prejudicar a apresentação do modelo.

No catálogo de cliente, Neoeffex deve aparecer de forma discreta como:

```text
Tecnologia Neoeffex
```

e não competir com a identidade da loja.

---

## 11. Auditoria de layout

### Catálogo público

Revisar:

- header;
- logo;
- hero;
- busca;
- filtros;
- categorias;
- cards;
- imagens;
- preços;
- badges;
- botões;
- modal de sabores;
- carrinho;
- pedido mínimo;
- WhatsApp;
- toast;
- footer;
- loading;
- erro;
- estado vazio.

### Admin

Revisar:

- login;
- sidebar;
- topbar;
- seletor da loja;
- resumo;
- produtos;
- configurações;
- categorias;
- subcategorias;
- tipos;
- grupos;
- sabores;
- modais;
- previews;
- editor de imagem;
- mobile.

Procurar especialmente:

```text
overflow horizontal
padding inconsistente
border-radius inconsistente
botões com alturas diferentes
ícones desalinhados
cards quebrando
textos cortados
z-index
modal atrás de overlay
toast cobrindo ação
footer desalinhado
imagens deformadas
proporções diferentes entre previews
```

---

## 12. Modal de sabores

Revisar:

- foto do sabor 1:1;
- nomes longos;
- botões +/−;
- acréscimos;
- scroll interno;
- footer do modal;
- botão Confirmar sempre acessível em mobile;
- sem overflow horizontal.

---

## 13. Responsividade

Testar pelo menos:

```text
320 × 568
360 × 640
375 × 667
390 × 844
412 × 915
430 × 932
768 px
1024 px
1366 px
1440 px
1920 px
```

Testar também landscape em mobile/tablet.

---

## 14. Acessibilidade

Preservar/melhorar:

```text
aria-label
aria-hidden
aria-live
role="dialog"
aria-modal
inert
ordem de Tab
Esc
focus trap
restauração de foco
```

Editor aberto não pode deixar o usuário navegar por teclado no modal/página atrás dele.

---

## 15. CSP e segurança

Não enfraquecer CSP.

Não adicionar:

```text
*
unsafe-inline
```

sem necessidade comprovada.

Assets da Neoeffex devem preferir `'self'`.

Preservar `blob:` e `data:` somente onde o fluxo de preview realmente exige.

---

## 16. Conferência frontend × schema

Durante a auditoria, comparar consultas JS com o schema REAL.

Atenção especial:

```text
flavors.is_active
product_flavors
purchase_mode
catalog_profile
minimum_order_quantity
logo_path
image_path
```

Não mascarar erro de banco como lista vazia.

Exemplo a evitar:

```text
consulta falha
→ flavors = []
→ "Nenhum sabor disponível"
```

Se a query falhar, registrar o erro real e tratar como falha de carregamento.

---

## 17. Cache-busting e versões

Depois de alterar JS/CSS:

atualizar referências `?v=` de forma coerente.

Conferir:

```text
admin/VERSION
catalogo/VERSION
admin/CHANGELOG.md
HTML
CSS
JS
```

Não deixar CSS antigo em cache com JS novo.

---

# Etapas

## ETAPA 0 — Auditoria técnica e visual

Sem alterar inicialmente:

1. confirmar branch/status;
2. commits recentes;
3. versões;
4. editor atual;
5. campos de imagem;
6. schema/migrations;
7. queries de `flavors`;
8. catálogo;
9. Admin;
10. branding;
11. testes.

Após a auditoria, continuar automaticamente.

## ETAPA 1 — Corrigir inconsistências críticas

Antes de layout:

- corrigir queries incompatíveis com schema;
- evitar erros silenciosos;
- corrigir versões/cache-busting incoerentes;
- garantir que sabores carreguem corretamente.

Testar e commit.

## ETAPA 2 — Proporção de logo no banco

Se necessário, criar:

```text
catalogs.logo_aspect_ratio
```

Default `square`.

Constraint para os três valores.

Não aplicar migration remotamente.

## ETAPA 3 — Editor universal

Evoluir `image-editor.js` para:

```text
produto 1:1
sabor 1:1
logo dinâmica
```

Sem duplicação.

## ETAPA 4 — Produtos 1:1

Atualizar editor, preview, thumbnails, cards e testes.

## ETAPA 5 — Sabores 1:1

Integrar `flavorImage`, inclusive imagem existente.

Atualizar modal público e testes.

## ETAPA 6 — Logo 1:1 / 3:4 / 4:3

Adicionar seletor no Admin, persistência, preview e renderização pública.

## ETAPA 7 — Editar foto em todas as edições

Garantir `Editar/Ajustar foto` em:

```text
produto
sabor
logo
```

novo arquivo e arquivo salvo.

## ETAPA 8 — Correção de layout do catálogo

Auditar visualmente mobile/tablet/desktop e corrigir inconsistências sem redesign arbitrário.

## ETAPA 9 — Branding Neoeffex

Padronizar logo/assinatura nas páginas da plataforma reutilizando assets existentes.

## ETAPA 10 — Revisão do Admin

Revisar layout e responsividade após novos controles.

## ETAPA 11 — Regressão

Rodar testes antigos + novos.

Testar:

```text
standard
food
marmitas
services
simple
flavor_bundle
```

## ETAPA 12 — Versão e documentação

Atualizar versões, changelog, cache-busting e documentação.

---

# Testes obrigatórios

Adicionar/ajustar testes para:

```text
product_image_square
flavor_image_square
logo_ratio_default_square
logo_ratio_square
logo_ratio_portrait_3_4
logo_ratio_landscape_4_3
logo_ratio_legacy_fallback
image_editor_product
image_editor_flavor
image_editor_logo
image_editor_existing_product
image_editor_existing_flavor
image_editor_existing_logo
image_editor_cancel
image_editor_apply
image_editor_escape
image_editor_focus_restore
image_editor_object_url_cleanup
catalog_logo_responsive
product_card_square_image
flavor_modal_square_image
frontend_schema_flavors
neoeffex_brand_catalog
neoeffex_brand_admin
```

---

# Principais riscos e mitigação

## Produto 4:3 → 1:1

Riscos:

- corte visual de imagens antigas;
- cards mais altos;
- mudança do grid.

Mitigar com `object-fit: cover`, testes e sem reprocessamento automático.

## Logo vertical

Pode dominar o hero.

Mitigar com `max-width`, `max-height` e limites responsivos.

## Troca de proporção

Pode perder posição/zoom.

Manter imagem fonte durante a sessão e recalcular canvas.

## Editor sobre outros modais

Pode causar z-index, scroll lock e foco incorretos.

Editor deve ser a camada superior e restaurar o modal anterior.

## CORS ao editar imagem salva

Manter fallback claro para selecionar arquivo novamente.

## Object URLs

Limpar URLs temporárias cuidadosamente.

## Cache

Atualizar `?v=` e versões.

## Branding

Não competir com a identidade do cliente.

---

# Commits sugeridos

```text
catalogo - corrige inconsistencias de schema e carregamento
catalogo - adiciona proporcoes configuraveis de logo
admin - torna editor de imagens reutilizavel
admin - padroniza imagens de produtos e sabores em 1x1
admin - adiciona edicao de foto em produtos sabores e logo
catalogo - ajusta layout e imagens responsivas
neoeffex - padroniza branding na plataforma
catalogo - estabiliza layout imagens e branding
```

---

# Modo autônomo

O Antigravity pode:

- editar/criar arquivos;
- criar migrations;
- criar/alterar testes;
- executar testes;
- executar browser automation local;
- corrigir erros;
- fazer commits;
- avançar de etapa automaticamente.

Não precisa pedir autorização após cada etapa.

## Não pode sem autorização

```text
aplicar migration no Supabase remoto
apagar dados
reset --hard
force push
apagar migrations antigas
alterar secrets/credenciais
remover RLS
enfraquecer CSP
```

Só interromper em caso de:

- risco real de perda de dados;
- operação destrutiva necessária;
- segredo exposto;
- requisito realmente contraditório;
- conflito Git impossível de resolver com segurança.

---

# Critérios de aceite

1. produto e sabor sempre 1:1;
2. logo suporta 1:1, 3:4 e 4:3;
3. 1:1 é padrão;
4. imagens antigas continuam funcionando;
5. imagens existentes podem ser reeditadas;
6. editor funciona em produto, sabor e logo;
7. não existe pipeline duplicado;
8. catálogo não possui overflow relevante;
9. modal de sabores funciona em mobile;
10. Neoeffex possui branding consistente;
11. logo do cliente continua prioritária no catálogo;
12. frontend consulta colunas reais do schema;
13. falha de query não vira silenciosamente "sem sabores";
14. CSP permanece segura;
15. cache-busting está coerente;
16. todos os testes passam;
17. nenhuma migration remota foi aplicada automaticamente.

---

# Relatório final obrigatório

Ao concluir, informar:

- branch e commit inicial;
- commits criados;
- arquivos alterados;
- inconsistências encontradas/corrigidas;
- migrations criadas;
- editor final;
- proporções suportadas;
- páginas com branding Neoeffex;
- testes executados e resultados;
- testes visuais realizados;
- pendências;
- migrations/SQL que precisam ser executados manualmente no Supabase.
