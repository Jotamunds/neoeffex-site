# Sentinela Embalagens — Plano Autônomo de Correção UI

**Projeto:** `modelos/sentinela-embalagens/`  
**Objetivo:** corrigir autonomamente as irregularidades restantes do relatório `docs/UI_AUDIT.md`, preservando o design atual, validando cada lote e criando commits locais incrementais.

---

## Escopo

Este plano parte do princípio de que `UI-001` a `UI-005` já foram tratadas ou estão sendo tratadas em uma etapa anterior.

O trabalho autônomo desta etapa deve abranger:

- UI-006
- UI-007
- UI-008
- UI-009
- UI-010
- UI-011
- UI-012
- UI-013
- UI-014
- UI-015
- UI-016
- UI-017

Antes de iniciar, confirme no `docs/UI_AUDIT.md` o status real de `UI-001` a `UI-005`. Se alguma ainda estiver como `PARCIALMENTE RESOLVIDO`, não a altere silenciosamente nesta etapa: registre a dependência e só toque nela se for indispensável para corrigir uma UI do escopo.

---

## Regras de segurança

1. Trabalhar somente em `modelos/sentinela-embalagens/`.
2. Não alterar outras pastas de `modelos/`, nem outras áreas do repositório.
3. Antes de qualquer alteração, executar `git status`, registrar branch atual e verificar mudanças não relacionadas.
4. Não apagar, resetar ou sobrescrever mudanças do usuário.
5. Não usar `git reset --hard`, `git clean -fd`, rebase destrutivo ou force push.
6. Criar **commits locais** ao final de cada lote aprovado por testes.
7. **Não executar `git push`** nesta etapa.
8. Não incluir em commits screenshots temporárias, arquivos em `.agents/temp_*`, scripts descartáveis de auditoria, artefatos de debug ou arquivos fora de `modelos/sentinela-embalagens/`.
9. Se uma correção exigir alterar o visual aprovado em vez de apenas corrigir uma irregularidade, interromper essa correção específica, registrar no relatório e seguir para as demais.

---

## Arquivos que devem ser lidos antes de iniciar

Ler completamente:

- `modelos/sentinela-embalagens/docs/UI_AUDIT.md`
- `modelos/sentinela-embalagens/docs/PROJECT_MAP.md`
- `modelos/sentinela-embalagens/index.html`
- `modelos/sentinela-embalagens/assets/css/sentinela.css`
- `modelos/sentinela-embalagens/assets/js/ui.js`
- `modelos/sentinela-embalagens/assets/js/animations.js`
- `modelos/sentinela-embalagens/VERSION`
- `modelos/sentinela-embalagens/CHANGELOG.md`

---

# Estratégia de execução

Corrigir as UIs restantes em **4 lotes**, sempre executando auditoria e commit ao fim de cada lote.

---

# Lote A — Fundação visual e consistência

Corrigir:

- UI-014 — duplicação de `:root`
- UI-012 — containers inconsistentes
- UI-006 — hierarquia desigual de H2
- UI-013 — estilo inline do `40 × 40`
- UI-015 — H3 dos diferenciais pequeno demais
- UI-016 — legenda solta do produto em destaque

## UI-014 — Consolidar tokens CSS

### Problema
Existem dois blocos `:root` ativos com variáveis redefinidas.

### Ação
Consolidar os valores efetivamente utilizados em um único bloco `:root` no topo de `assets/css/sentinela.css`.

Não alterar o resultado visual intencional.

Antes de remover qualquer declaração duplicada, identificar qual valor vence atualmente pela cascata e manter esse valor como valor final do token.

Remover apenas redundância.

### Validação
Comparar screenshots antes/depois em:
- 390×844
- 1440×900
- 1920×1080

A consolidação não deve causar redesign.

---

## UI-012 — Harmonizar containers

### Problema
Existem larguras de conteúdo sem um sistema explícito:
- ~1240px
- ~1500px
- ~820px

### Ação
Criar tokens semânticos, por exemplo:

```css
--container-normal: 1240px;
--container-wide: 1440px;
--container-narrow: 820px;
```

Usar `normal` para estrutura principal, `wide` somente nas seções que realmente precisam apresentar composição visual mais ampla e `narrow` apenas em conteúdo deliberadamente editorial/CTA.

Não tornar todas as seções da mesma largura cegamente.

O objetivo é fazer os eixos laterais parecerem intencionais.

### Validação
Comparar os alinhamentos de header, diferenciais, soluções, manifesto, produto em destaque, CTA e footer em 1366, 1440 e 1920px.

---

## UI-006 — Harmonizar títulos H2

### Problema
Soluções/Manifesto chegam a uma escala editorial muito maior que Produto/CTA.

### Ação
Criar hierarquia deliberada.

Sugestão:
- `heading-editorial`: Soluções e Manifesto
- `heading-section`: Produto em destaque e demais títulos principais
- `heading-cta`: CTA final, podendo ser ligeiramente menor

Não transformar todos em exatamente o mesmo tamanho.

O objetivo é reduzir a diferença extrema sem perder o caráter editorial do Manifesto.

Usar `clamp()` e tokens reutilizáveis.

### Validação
Em 1440×900 e 1920×1080, nenhum H2 deve parecer quase metade de outro título de mesma importância sem razão. O Manifesto ainda pode ser o maior.

---

## UI-013 — Remover estilo inline do produto

Mover:

```html
style="font-size:.47em; white-space:nowrap;"
```

para uma classe semântica, por exemplo:

```css
.product-dimension
```

Preservar exatamente o resultado visual.

---

## UI-015 — Diferenciais

Ajustar `.trust-item h3`.

Objetivo:
- título compacto;
- claramente superior à descrição;
- coerente com a tipografia do restante do site.

Começar por algo equivalente a 15–16px com peso 700.

Não aumentar excessivamente.

---

## UI-016 — Legenda do produto

A legenda do produto em destaque não deve ficar como texto solto sem ancoragem.

Criar tratamento sutil:
- background translúcido;
- borda fina opcional;
- padding pequeno;
- sem aparência de card grande;
- radius coerente com os tokens atuais.

Manter aspecto premium e discreto.

---

## Validação do Lote A

Executar:
- 390×844
- 768×1024
- 1366×768
- 1440×900
- 1920×1080

Verificar ausência de regressões, containers, títulos, produto em destaque, CTA e diferenciais.

Atualizar `docs/UI_AUDIT.md`.

Marcar UI-006, UI-012, UI-013, UI-014, UI-015 e UI-016 como `RESOLVIDO` ou `PARCIALMENTE RESOLVIDO`.

### Commit do Lote A

Ler `VERSION`, incrementar **patch** em 1 e atualizar:
- `VERSION`
- `CHANGELOG.md`

Formato do commit:

```text
sentinela - vX.Y.Z - harmoniza tipografia, containers e tokens visuais
```

Não fazer push.

---

# Lote B — Mobile e usabilidade

Corrigir:

- UI-007 — vazio vertical excessivo do Hero
- UI-009 — carrossel mobile sem affordance
- UI-010 — bordas incorretas nos pilares mobile
- UI-017 — lazy loading + medição GSAP

## UI-007 — Hero mobile

### Problema
`100svh + justify-content: space-between` cria vazio excessivo entre conteúdo e produto.

### Ação
Depois das correções já feitas em UI-001, ajustar apenas mobile compacto.

Para telas pequenas:
- reduzir dependência de `space-between`;
- usar fluxo mais controlado;
- preservar primeira dobra;
- manter produto visível;
- não comprimir CTA.

Pode usar `justify-content: center`, `gap`, `min-height` adaptativo e ajustes de padding, desde que o resultado final preserve a composição aprovada.

### Validação
Testar especialmente:
- 360×800
- 390×844
- 430×932

O terço central do Hero não deve parecer vazio sem intenção.

---

## UI-009 — Affordance do carrossel

### Problema
O usuário não recebe indicação clara de que existem outros produtos horizontalmente.

### Ação
Criar indicação visual discreta.

Preferência:
- dots/bullets sincronizados com o item mais próximo;
ou
- uma barra/progresso discreta.

Evitar texto permanente grande como “arraste”.

Não mostrar indicador no desktop.

Se usar JS:
- integrar em `assets/js/ui.js`;
- não misturar com `animations.js` sem necessidade;
- não adicionar biblioteca nova.

O indicador deve atualizar com scroll horizontal.

---

## UI-010 — Pilares mobile

Aplicar borda superior apenas à segunda linha no grid 2×2.

Evitar linha superior nos primeiros dois itens.

Em telas onde os pilares virarem uma única coluna, usar divisórias coerentes entre itens, sem duplicação no primeiro.

---

## UI-017 — Lazy loading e ScrollTrigger

### Problema
A quarta imagem pode reportar `0×0` antes do carregamento.

### Ação
Não desativar lazy loading globalmente sem necessidade.

Preferência:
- garantir dimensão previsível através de `aspect-ratio`, width/height ou container estável;
- chamar `ScrollTrigger.refresh()` após imagens relevantes carregarem, se necessário.

Não criar layout shift.

Validar com cache limpo e throttle razoável.

---

## Validação do Lote B

Testar:
- 360×800
- 390×844
- 430×932
- 768×1024
- 820×1180

Também testar menu aberto, carrossel por toque/scroll, dots/progresso, pilares, carregamento com cache vazio e `prefers-reduced-motion: reduce`.

Atualizar `docs/UI_AUDIT.md`.

### Commit do Lote B

Incrementar novamente o patch.

Formato:

```text
sentinela - vX.Y.Z - corrige hero e usabilidade mobile
```

Atualizar `VERSION` e `CHANGELOG.md`.

Não fazer push.

---

# Lote C — Manifesto e animações

Corrigir:

- UI-008 — símbolo Sentinela invisível até ScrollTrigger

## UI-008 — Símbolo Sentinela

### Problema
A animação GSAP utiliza `autoAlpha: 0`, fazendo o símbolo ficar totalmente invisível até o gatilho.

### Ação
A identidade visual deve existir antes da animação.

Manter no CSS uma opacidade-base visível e baixa.

A timeline não deve zerar completamente o símbolo.

Usar GSAP apenas para:
- deslocamento sutil;
- parallax;
- pequena variação de opacidade;
- possível scale mínimo.

Não usar entrada dramática.

Preservar `prefers-reduced-motion`.

### Validação
Testar estado antes da seção entrar na viewport, entrada na viewport, scroll pelo Manifesto, retorno ao subir a página e reduced motion.

O símbolo deve funcionar sempre como background, nunca competir com produtos/texto.

---

## Validação do Lote C

Testar:
- 390×844
- 768×1024
- 1366×768
- 1440×900
- 1920×1080

Atualizar `docs/UI_AUDIT.md`.

### Commit do Lote C

Incrementar patch.

Formato:

```text
sentinela - vX.Y.Z - refina manifesto e animacao de marca
```

Atualizar `VERSION` e `CHANGELOG.md`.

Não fazer push.

---

# Lote D — Footer e acabamento de marca

Corrigir:

- UI-011 — placa branca da logo no footer

## UI-011 — Logo no footer

### Problema
A logo sobre placa branca sólida parece um adesivo colado no rodapé escuro.

### Ação
Primeiro verificar quais assets de logo já existem em `assets/sentinela-v2/`.

Não gerar uma nova identidade.

Se houver logo apropriada para fundo escuro, usar a variante existente.

Se não houver:
- manter o asset atual;
- reduzir o peso visual da placa;
- usar background translúcido;
- borda discreta;
- menos padding;
- integração melhor com o grafite.

Não aplicar filtros que deteriorem a legibilidade da marca.

### Validação
Testar em mobile, tablet e desktop.

O footer deve parecer parte do mesmo sistema premium.

---

## Validação do Lote D

Testar:
- 390×844
- 1440×900
- 1920×1080

Atualizar `docs/UI_AUDIT.md`.

### Commit do Lote D

Incrementar patch.

Formato:

```text
sentinela - vX.Y.Z - refina footer e aplicacao da marca
```

Atualizar `VERSION` e `CHANGELOG.md`.

Não fazer push.

---

# Auditoria final obrigatória

Depois de concluir os quatro lotes, executar novamente a auditoria completa nas resoluções:

- 360×800
- 390×844
- 430×932
- 768×1024
- 820×1180
- 1024×768
- 1366×768
- 1440×900
- 1920×1080

Verificar:
- overflow horizontal;
- Hero;
- Header;
- Showcase;
- pedestais;
- carrossel;
- Manifesto;
- símbolo Sentinela;
- pilares;
- Produto em Destaque;
- CTA;
- Footer;
- formulário;
- menu mobile;
- foco de teclado;
- reduced motion;
- console do navegador.

---

# Tratamento de regressões

Se uma correção gerar regressão:

1. não seguir acumulando mudanças sobre o erro;
2. identificar qual commit/lote introduziu a regressão;
3. corrigir dentro do mesmo lote antes do próximo commit;
4. não reverter mudanças do usuário;
5. documentar a regressão encontrada no `UI_AUDIT.md`.

Se a regressão só aparecer depois de um commit:
- corrigir em um novo commit;
- não reescrever histórico automaticamente.

---

# Git e versionamento

Antes de cada commit:

```bash
git status
git diff -- modelos/sentinela-embalagens/
```

Incluir apenas arquivos da Sentinela necessários à correção.

Não usar `git add .` se houver qualquer possibilidade de incluir arquivos externos ao escopo.

Preferir adicionar explicitamente os arquivos modificados.

Após commit:

```bash
git status
git log -1 --oneline
```

Confirmar que:
- commit foi criado;
- árvore relacionada ao lote está limpa;
- nenhum arquivo temporário entrou no commit.

---

# CHANGELOG

Para cada lote, registrar resumidamente:
- irregularidades corrigidas;
- arquivos principais alterados;
- impactos de responsividade;
- alterações de animação, quando houver.

Não transformar o changelog em relatório técnico extenso.

O detalhamento fica em `docs/UI_AUDIT.md`.

---

# Critério de conclusão

A tarefa só termina quando:

1. UI-006 a UI-017 estiverem `RESOLVIDO` ou explicitamente `PARCIALMENTE RESOLVIDO` com justificativa;
2. todos os lotes tiverem sido testados;
3. a auditoria final tiver sido executada;
4. não houver regressão crítica;
5. `VERSION` estiver atualizado;
6. `CHANGELOG.md` estiver atualizado;
7. cada lote tiver seu próprio commit;
8. nenhum push tiver sido feito;
9. `docs/UI_AUDIT.md` refletir o estado final.

---

# Relatório final do Antigravity

Ao terminar, responder no formato:

```text
Lote A
Commit:
Versão:
UIs resolvidas:
Arquivos alterados:
Testes:

Lote B
Commit:
Versão:
UIs resolvidas:
Arquivos alterados:
Testes:

Lote C
Commit:
Versão:
UIs resolvidas:
Arquivos alterados:
Testes:

Lote D
Commit:
Versão:
UIs resolvidas:
Arquivos alterados:
Testes:

Auditoria final:
Críticos restantes:
Altos restantes:
Médios restantes:
Baixos restantes:

Regressões encontradas:
Pendências:
```

Não fazer push.

Se todas as irregularidades forem corrigidas e a auditoria final estiver limpa, encerrar e aguardar instrução do usuário.
