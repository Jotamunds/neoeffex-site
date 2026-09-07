# NEOEFFEX — MIGRAÇÃO DA PREVIEW-VITRINE PARA A HOME PRINCIPAL

## Plano técnico estrito para Antigravity

**Projeto:** Neoeffex  
**Destino:** `https://neoeffex.com.br/`  
**Branch:** trabalhar na branch atual; não trocar de branch automaticamente  
**Estratégia escolhida:** Opção 2 — `index.html` na raiz + assets da nova home isolados em `/assets/home/`  
**CTA principal do header:** `Pedir orçamento`  
**Home antiga atual:** versão `0.1.15`  
**Preview-vitrine atual:** versão `v0.6.0`  
**Versão planejada da preview após preparação:** `v0.6.1`  
**Versão planejada da nova home principal:** `0.2.0`

---

# 0. OBJETIVO DESTE DOCUMENTO

Este documento define, de forma fechada, como o Antigravity deve:

1. preservar e versionar a home antiga da Neoeffex;
2. versionar a `modelos/preview-vitrine` antes da promoção;
3. atualizar o header da preview para um header institucional;
4. transformar a `preview-vitrine` na nova home principal;
5. manter `https://neoeffex.com.br/` como URL final, sem `/home/` e sem redirect;
6. isolar os arquivos da nova home em `/assets/home/`;
7. preservar `/modelos/preview-vitrine/` como referência versionada e funcional;
8. não quebrar `/planos/`, `/modelos/`, `/admin/`, `/catalogo/` ou outras áreas existentes;
9. não alterar a física, visual ou comportamento já aprovado do N, do cursor ou do prisma WebGL;
10. executar testes de regressão antes de considerar a migração concluída.

Esta tarefa é uma **migração estrutural controlada**, não um redesign geral.

---

# 1. REGRA PRINCIPAL

A implementação atual em:

```text
/modelos/preview-vitrine/
```

é a base visual e técnica aprovada para a nova home.

A migração deve preservar o comportamento existente.

A ordem obrigatória é:

```text
AUDITAR
↓
ARQUIVAR HOME ANTIGA
↓
VERSIONAR PREVIEW
↓
ALTERAR HEADER NA PREVIEW
↓
TESTAR PREVIEW
↓
CRIAR /assets/home/
↓
PROMOVER PREVIEW PARA /index.html
↓
CORRIGIR CAMINHOS
↓
VERSIONAR NOVA HOME
↓
TESTAR TODAS AS ROTAS
↓
PARAR
```

Não pular etapas.

---

# 2. PROIBIÇÕES GERAIS

Durante esta tarefa, NÃO:

- fazer `git commit`;
- fazer `git push`;
- fazer `git reset`;
- fazer `git restore`;
- fazer `git checkout` de arquivos;
- trocar de branch;
- apagar histórico;
- alterar CNAME;
- alterar configuração do domínio;
- criar redirect de `/` para `/home/`;
- criar `/home/` como URL pública;
- alterar a física do N;
- alterar `targetProgress`;
- alterar `visualProgress`;
- alterar spring/damping do N;
- alterar shaders do N por preferência;
- alterar interação do mouse do N;
- alterar o prisma WebGL;
- recalibrar o drag do prisma;
- recalibrar a inércia do prisma;
- alterar câmera/material/renderOrder do prisma;
- alterar o cursor personalizado, salvo caminhos/imports necessários à migração;
- alterar Lenis;
- alterar ScrollTrigger do Hero;
- alterar a tipografia aprovada do Hero;
- substituir Bebas Neue;
- alterar `SEU SITE / PODE IR ALÉM`;
- adicionar biblioteca nova;
- adicionar framework;
- introduzir bundler;
- converter o projeto para Vite/React;
- renomear pastas não relacionadas;
- reorganizar `/admin/`, `/catalogo/`, `/planos/` ou `/modelos/` sem necessidade;
- excluir a preview após a promoção;
- excluir a home antiga sem arquivá-la primeiro.

---

# 3. ESTADO INICIAL ESPERADO

Antes de editar, verificar a estrutura real do repositório.

A home atual usa conceitualmente:

```text
/
├── index.html
├── VERSION
├── CHANGELOG.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    └── img/
        └── ...
```

A preview atual usa conceitualmente:

```text
/modelos/preview-vitrine/
├── index.html
├── VERSION
├── CHANGELOG.md
└── assets/
    ├── css/
    │   └── modelos-preview.css
    ├── js/
    │   ├── modelos-preview.js
    │   └── three/
    │       ├── scene.js
    │       ├── shaders.js
    │       ├── particle-logo.js
    │       ├── particle-source.js
    │       └── prism-scene.js
    └── ...
```

NÃO assumir que essa lista é completa.

Inspecionar fisicamente os arquivos atuais antes de copiar ou mover qualquer coisa.

---

# 4. VERSIONAMENTO — HOME ANTIGA

A home antiga deve ser preservada como snapshot da versão:

```text
0.1.15
```

Criar:

```text
/archive/home-v0.1.15/
```

Estrutura desejada:

```text
archive/
└── home-v0.1.15/
    ├── index.html
    ├── VERSION
    ├── CHANGELOG.md
    └── assets/
        ├── css/
        ├── js/
        └── img/
```

O objetivo é que a home antiga fique recuperável e, preferencialmente, visualizável de maneira independente.

---

# 5. VERSION DA HOME ANTIGA

Criar:

```text
/archive/home-v0.1.15/VERSION
```

Conteúdo EXATO:

```text
0.1.15
```

Não alterar para `0.1.16`.

O snapshot representa exatamente a home que existia antes da substituição.

---

# 6. CHANGELOG DA HOME ANTIGA

Criar:

```text
/archive/home-v0.1.15/CHANGELOG.md
```

Registrar no mínimo:

```markdown
# Changelog — Home Neoeffex arquivada

## 0.1.15

- Snapshot da home principal anterior à promoção da preview-vitrine.
- Preservada antes da migração da nova experiência visual para a raiz do domínio.
- Arquivo mantido apenas como referência histórica e rollback manual.
```

Se houver informações relevantes no `CHANGELOG.md` atual da raiz, NÃO apagar.

O arquivo do archive pode resumir o estado arquivado e apontar para o changelog histórico da raiz.

---

# 7. AUDITORIA DOS ASSETS DA HOME ANTIGA

Antes de mover `assets/css/style.css`, `assets/js/script.js` ou qualquer imagem:

Pesquisar referências em TODO o repositório.

Verificar se são usados por:

- `404.html`;
- `/planos/`;
- `/modelos/`;
- `/admin/`;
- `/catalogo/`;
- outras páginas da raiz;
- páginas arquivadas;
- documentos HTML antigos.

NÃO presumir que `/assets/` pertence exclusivamente à home antiga.

---

# 8. COMO ARQUIVAR OS ASSETS ANTIGOS

A prioridade é criar um snapshot autocontido.

Copiar para:

```text
/archive/home-v0.1.15/assets/
```

somente os arquivos necessários para reproduzir a home antiga.

Isso inclui:

- CSS realmente usado pelo `index.html` antigo;
- JS realmente usado pelo `index.html` antigo;
- imagens exclusivas;
- ícones exclusivos;
- fontes locais exclusivas, se houver;
- outros arquivos referenciados pelo HTML/CSS/JS antigo.

---

# 9. NÃO QUEBRAR ASSETS COMPARTILHADOS

Se um asset antigo também for utilizado por outra rota ativa:

```text
NÃO mover o original ainda.
```

Nesse caso:

1. copiar uma versão para o archive;
2. manter o original em seu local atual;
3. registrar que ele é compartilhado.

Somente assets comprovadamente exclusivos da home antiga podem ser removidos da estrutura ativa após a nova home funcionar.

Nesta tarefa, preferir **preservar** a **limpar agressivamente**.

---

# 10. CAMINHOS DA HOME ARQUIVADA

Depois de copiar a home antiga para:

```text
/archive/home-v0.1.15/
```

ajustar os caminhos do `index.html` arquivado para os assets arquivados quando necessário.

Exemplo:

ANTES:

```html
<link rel="stylesheet" href="assets/css/style.css">
```

Dentro do archive pode continuar:

```html
<link rel="stylesheet" href="assets/css/style.css">
```

se o snapshot possuir sua própria pasta `assets/`.

Evitar que o snapshot arquivado dependa do CSS da nova home.

---

# 11. URLS ABSOLUTAS NA HOME ANTIGA

Se existirem links absolutos como:

```text
/planos/
/modelos/
/img/...
```

não reescrever automaticamente.

Eles podem continuar apontando para rotas ativas do site.

O objetivo do archive é preservar a antiga interface, não transformar todo o site em um snapshot offline.

---

# 12. VERSIONAMENTO — PREVIEW-VITRINE

A `preview-vitrine` atual está na versão:

```text
v0.6.0
```

A atualização de header + preparação para promoção deve gerar:

```text
v0.6.1
```

Atualizar:

```text
/modelos/preview-vitrine/VERSION
```

para:

```text
v0.6.1
```

---

# 13. CHANGELOG DA PREVIEW — v0.6.1

Adicionar uma entrada no topo de:

```text
/modelos/preview-vitrine/CHANGELOG.md
```

Exemplo:

```markdown
## v0.6.1

- Substitui navegação específica de modelos por header institucional da Neoeffex.
- Altera CTA principal do header para "Pedir orçamento".
- Prepara a preview-vitrine para promoção como nova home principal.
- Preserva N WebGL, cursor personalizado, prisma Three.js e comportamento de scroll aprovados na v0.6.0.
```

Não apagar entradas anteriores.

---

# 14. PREVIEW-VITRINE DEVE CONTINUAR FUNCIONANDO

Depois da promoção, esta URL deve continuar abrindo:

```text
/modelos/preview-vitrine/
```

Ela passa a funcionar como:

- referência versionada;
- snapshot da base que originou a home `0.2.0`;
- ambiente histórico/comparativo.

NÃO redirecionar automaticamente para `/` nesta etapa.

NÃO apagar seus assets.

NÃO fazer a preview depender de `/assets/home/` se isso quebrar sua independência.

---

# 15. NOVO HEADER INSTITUCIONAL — PREVIEW

Antes de copiar a preview para a raiz, atualizar o header dentro da própria preview.

Estrutura desktop obrigatória:

```text
◇ neoeffex       Diferenciais    Modelos    Planos    Como funciona       Pedir orçamento →
```

A marca permanece à esquerda.

A navegação fica central/intermediária.

O CTA fica à direita.

---

# 16. LINKS DO NOVO HEADER

## Diferenciais

Apontar para a seção de diferenciais existente.

ID preferido:

```text
#diferenciais
```

Se já existir ID equivalente e estável, pode reutilizar.

Não duplicar a seção.

## Modelos

Apontar para a área de modelos da página ou para:

```text
/modelos/
```

Preferência desktop: seção local ou dropdown simples.

Preferência mobile: link direto simples.

## Planos

Apontar obrigatoriamente para:

```text
/planos/
```

## Como funciona

Apontar para:

```text
#como-funciona
```

Criar a seção apenas se não houver equivalente.

## Pedir orçamento

Usar exatamente:

```text
Pedir orçamento
```

---

# 17. CTA — PEDIR ORÇAMENTO

Não usar mais no header:

```text
Solicitar projeto
```

Trocar para:

```text
Pedir orçamento
```

O CTA não é um botão de compra.

NÃO utilizar:

- Comprar;
- Assinar;
- Fechar agora;
- Checkout;
- Pagar;
- Contratar agora.

---

# 18. DESTINO DO CTA

Se o formulário/modal de orçamento já estiver funcional no projeto e puder ser reutilizado sem nova arquitetura, o CTA pode abri-lo.

Caso contrário, nesta migração o CTA deve apontar para:

```text
/planos/
```

Não criar backend novo nesta tarefa.

Não criar integração de e-mail/WhatsApp nova por iniciativa própria.

A prioridade é promoção segura da home.

---

# 19. COMO FUNCIONA

Se não existir seção equivalente, criar uma seção curta e integrada ao design atual.

Conteúdo base:

```text
1. Você explica o projeto
2. A Neoeffex entende a necessidade
3. Definimos escopo e orçamento
4. Desenvolvemos e refinamos
5. Publicamos e acompanhamos
```

Não transformar em uma seção genérica de cards idênticos.

Preferir:

- linha de progresso;
- timeline horizontal;
- steps tipográficos;
- composição editorial aberta.

Preservar linguagem visual da preview.

---

# 20. HEADER — VISUAL

Manter:

- fundo escuro;
- blur;
- borda inferior sutil;
- posição fixed;
- largura total;
- conteúdo centralizado;
- links discretos;
- CTA arredondado;
- identidade azul Neoeffex.

Não fazer redesign agressivo do header.

---

# 21. HEADER — ALTURA

Preservar aproximadamente:

```text
72px a 76px
```

no desktop.

Em mobile, manter o tamanho responsivo já existente.

Não aumentar o header a ponto de competir com o Hero.

---

# 22. HEADER — SCROLL

Preservar:

```text
topo → fundo mais transparente
scroll → fundo mais opaco + blur + borda/sombra discreta
```

O header deve permanecer sempre visível.

Não reintroduzir comportamento de esconder header.

---

# 23. HEADER — MOBILE

Em mobile:

- manter marca;
- utilizar o mecanismo de menu já existente ou um menu simples coerente;
- não manter todos os links espremidos horizontalmente;
- incluir `Pedir orçamento` dentro do menu se necessário.

Itens:

```text
Diferenciais
Modelos
Planos
Como funciona
Pedir orçamento
```

---

# 24. TESTE OBRIGATÓRIO DA PREVIEW v0.6.1

ANTES de promover para a raiz, testar:

- desktop 1920px;
- desktop 1366px;
- notebook com altura reduzida;
- 1024px;
- tablet;
- mobile;
- header fixo;
- todos os links;
- `/planos/`;
- seção Modelos;
- Como funciona;
- CTA Pedir orçamento;
- N;
- scroll rápido;
- scroll reverso;
- cursor;
- prisma WebGL;
- touch no prisma;
- console.

Se a preview estiver quebrada, NÃO promover.

---

# 25. OPÇÃO 2 — ARQUITETURA FINAL ESCOLHIDA

A nova home deve usar:

```text
/index.html
```

na raiz.

Os assets específicos da nova home devem ficar em:

```text
/assets/home/
```

A URL pública continua:

```text
https://neoeffex.com.br/
```

Não criar:

```text
https://neoeffex.com.br/home/
```

Não criar redirect.

---

# 26. ESTRUTURA FINAL DESEJADA

```text
/
├── index.html                       ← NOVA HOME
├── VERSION                          ← 0.2.0
├── CHANGELOG.md
│
├── assets/
│   ├── home/
│   │   ├── css/
│   │   │   └── home.css
│   │   ├── js/
│   │   │   ├── home.js
│   │   │   └── three/
│   │   │       ├── scene.js
│   │   │       ├── shaders.js
│   │   │       ├── particle-logo.js
│   │   │       ├── particle-source.js
│   │   │       └── prism-scene.js
│   │   └── media/
│   │       └── somente arquivos específicos quando necessário
│   │
│   ├── css/
│   │   └── legado/compartilhado se ainda necessário
│   ├── js/
│   │   └── legado/compartilhado se ainda necessário
│   └── img/
│       └── compartilhado se ainda necessário
│
├── archive/
│   └── home-v0.1.15/
│       ├── index.html
│       ├── VERSION
│       ├── CHANGELOG.md
│       └── assets/
│
├── modelos/
│   ├── preview-vitrine/             ← preservada em v0.6.1
│   └── ...
│
├── planos/
├── admin/
├── catalogo/
└── ...
```

---

# 27. NÃO USAR `/home/` COMO PASTA PÚBLICA

Não implementar:

```text
/home/index.html
```

como destino do domínio.

Não fazer:

```text
/index.html → redirect → /home/
```

Não alterar o endereço canônico da home.

A raiz continua sendo a entrada real.

---

# 28. CRIAR `/assets/home/`

Criar:

```text
/assets/home/
```

com subpastas:

```text
/assets/home/css/
/assets/home/js/
/assets/home/js/three/
/assets/home/media/
```

A pasta `media` só precisa existir se houver arquivos específicos que realmente devam ser copiados para ela.

Não duplicar imagens globais sem necessidade.

---

# 29. COPIAR CSS DA PREVIEW

Partir do CSS aprovado da preview.

Origem aproximada:

```text
/modelos/preview-vitrine/assets/css/modelos-preview.css
```

Destino:

```text
/assets/home/css/home.css
```

A cópia deve preservar integralmente o visual aprovado.

Renomear referências apenas quando necessário.

Não aproveitar a cópia para reorganizar seletores.

Não minificar.

Não refatorar por estética.

---

# 30. COPIAR JS PRINCIPAL DA PREVIEW

Origem aproximada:

```text
/modelos/preview-vitrine/assets/js/modelos-preview.js
```

Destino:

```text
/assets/home/js/home.js
```

Preservar comportamento.

Corrigir apenas:

- caminhos;
- imports;
- IDs/links que mudaram por causa da nova raiz;
- referências de assets.

Não recalibrar animações.

---

# 31. COPIAR MÓDULOS THREE.JS

Copiar para:

```text
/assets/home/js/three/
```

os módulos necessários, incluindo quando presentes:

```text
scene.js
shaders.js
particle-logo.js
particle-source.js
prism-scene.js
```

Manter relação de imports equivalente à preview.

---

# 32. NÃO COMPARTILHAR OS MÓDULOS DA PREVIEW POR CAMINHO RELATIVO

A nova home NÃO deve fazer algo como:

```js
import ... from '/modelos/preview-vitrine/assets/js/three/scene.js'
```

Isso faria a home de produção depender da pasta de preview.

A nova home deve usar:

```text
/assets/home/js/three/...
```

A preview continua com seus próprios arquivos.

---

# 33. DUPLICAÇÃO CONTROLADA

Nesta migração, é aceitável existir:

```text
/modelos/preview-vitrine/assets/...
```

E:

```text
/assets/home/...
```

porque a preview será uma referência versionada e congelada.

Após a promoção:

- `preview-vitrine v0.6.1` = snapshot/reference;
- `home 0.2.0+` = linha de desenvolvimento da home principal.

Não manter alterações futuras em ambas automaticamente.

---

# 34. FONTE DE VERDADE APÓS A MIGRAÇÃO

Depois da promoção:

```text
/ + /assets/home/
```

passam a ser a fonte de verdade da home principal.

`/modelos/preview-vitrine/` deixa de ser a fonte de desenvolvimento da home.

Não editar a preview a cada atualização futura da home, salvo quando explicitamente solicitado.

---

# 35. NOVO `/index.html`

Substituir o conteúdo da raiz por uma versão derivada do:

```text
/modelos/preview-vitrine/index.html
```

já atualizado para `v0.6.1`.

Adaptar somente o necessário para funcionar em `/`.

---

# 36. HEAD DA NOVA HOME

Preservar ou atualizar corretamente:

- `lang="pt-BR"`;
- charset UTF-8;
- viewport;
- title;
- description;
- canonical;
- Open Graph;
- Twitter card;
- favicon;
- fontes;
- CSS;
- scripts.

Canonical obrigatório:

```text
https://neoeffex.com.br/
```

Não usar canonical da preview.

---

# 37. TITLE / DESCRIPTION

Não copiar metadata de demonstração que descreva a página como preview.

A nova home deve representar a Neoeffex institucionalmente.

Não inventar claims absurdos.

Pode manter linguagem coerente com:

- criação de sites;
- landing pages;
- sites institucionais;
- experiências digitais;
- modelos/demonstrações;
- desenvolvimento sob medida.

Não limitar a empresa apenas a uma demonstração específica.

---

# 38. CSS DA NOVA HOME

No novo `/index.html`, utilizar:

```html
<link rel="stylesheet" href="/assets/home/css/home.css">
```

ou caminho equivalente absoluto a partir da raiz.

Preferir caminhos absolutos para assets principais da home.

---

# 39. JS DA NOVA HOME

Carregar:

```text
/assets/home/js/home.js
```

E os módulos Three.js a partir de:

```text
/assets/home/js/three/
```

Não carregar JS antigo da home `0.1.15` por acidente.

---

# 40. AUDITORIA DE CAMINHOS DA PREVIEW

Antes de finalizar, localizar no HTML/CSS/JS todos os padrões:

```text
./assets/
../
../../
/modelos/preview-vitrine/
modelos/preview-vitrine
```

Verificar um a um.

Não usar replace cego global.

---

# 41. ASSETS ABSOLUTOS EXISTENTES

Se a preview já usa:

```text
/img/logos/neoeffex-n-logo-white.svg
```

pode preservar se o asset realmente existir e for compartilhado.

Não duplicar obrigatoriamente para `/assets/home/`.

---

# 42. SVG DO N

O N aprovado depende do SVG da marca.

Não alterar:

- arquivo SVG;
- viewBox;
- forma;
- densidade;
- caminho sem necessidade.

Somente confirmar que a URL continua resolvendo em `/`.

---

# 43. VÍDEOS / PREVIEWS DE MODELOS

Verificar todas as URLs dos vídeos e imagens da vitrine.

Ao migrar de:

```text
/modelos/preview-vitrine/
```

para:

```text
/
```

caminhos relativos podem mudar.

Corrigir apenas caminhos quebrados.

Não recomprimir vídeos nesta tarefa.

Não trocar arquivos por versões diferentes.

---

# 44. LINKS DOS MODELOS

Garantir que os cards continuem apontando para as rotas reais.

Exemplos conceituais:

```text
/modelos/hamburgueria/
/modelos/clinica-odontologica/
/modelos/hortifruti/
...
```

Não apontar cards para paths relativos que passem a resolver na raiz incorretamente.

---

# 45. LINK `/MODELOS/`

A navegação institucional deve permitir chegar em:

```text
/modelos/
```

sem depender da preview.

---

# 46. LINK `/PLANOS/`

Confirmar:

```text
https://neoeffex.com.br/planos/
```

continua funcionando.

Não copiar `/planos/` para dentro da home.

Não incorporar sua lógica no novo `home.js`.

---

# 47. ADMIN / CATÁLOGO

Não alterar:

```text
/admin/
/catalogo/
```

Somente garantir que a migração da raiz não afete assets compartilhados.

---

# 48. 404

Verificar se `404.html` utiliza algum asset da home antiga.

Se utilizar:

- não remover o asset ativo;
- ou atualizar o `404.html` somente se estritamente necessário para manter funcionamento.

Não redesenhar 404 nesta tarefa.

---

# 49. FAVICON / OG IMAGE

Se a home antiga possui assets globais usados como:

```text
/assets/img/favicon-*.png
/assets/img/og-neoeffex.jpg
```

não removê-los se a nova home ou outras páginas ainda precisarem deles.

Assets compartilhados continuam compartilhados.

---

# 50. ROOT VERSION — NOVA HOME

Após a promoção, atualizar:

```text
/VERSION
```

para:

```text
0.2.0
```

Motivo:

A substituição completa da experiência da home representa uma nova versão estrutural, não um patch da antiga `0.1.15`.

---

# 51. ROOT CHANGELOG — 0.2.0

Adicionar no topo de:

```text
/CHANGELOG.md
```

uma entrada semelhante a:

```markdown
## 0.2.0

- Promove a experiência `modelos/preview-vitrine` como nova home principal da Neoeffex.
- Isola os assets da nova home em `/assets/home/`.
- Arquiva a home anterior `0.1.15` em `/archive/home-v0.1.15/`.
- Preserva a preview-vitrine como referência versionada `v0.6.1`.
- Adota header institucional com Diferenciais, Modelos, Planos, Como funciona e CTA "Pedir orçamento".
- Preserva N WebGL, prisma Three.js, cursor personalizado e narrativa de scroll aprovados.
```

Não apagar histórico anterior.

---

# 52. NÃO CONFUNDIR VERSIONAMENTOS

Depois da migração existirão três referências distintas:

```text
HOME ANTIGA
/archive/home-v0.1.15/
VERSION = 0.1.15

PREVIEW CONGELADA
/modelos/preview-vitrine/
VERSION = v0.6.1

HOME PRINCIPAL
/
VERSION = 0.2.0
```

Não misturar esses números.

---

# 53. HOME ANTIGA NÃO DEVE SOBRESCREVER ROOT VERSION

Ao copiar a home antiga para archive:

NÃO copiar seu `VERSION` de volta para a raiz após a nova home estar instalada.

Root final = `0.2.0`.

---

# 54. PREVIEW NÃO DEVE SOBRESCREVER ROOT VERSION

Não copiar:

```text
/modelos/preview-vitrine/VERSION
```

para:

```text
/VERSION
```

A preview usa `v0.6.1`.

A home usa `0.2.0`.

---

# 55. NÃO MOVER TODA `/assets/`

NÃO fazer:

```text
/assets/ → /archive/home-v0.1.15/assets/
```

em bloco.

A pasta root pode possuir assets compartilhados.

Arquivar por dependência real.

---

# 56. NÃO APAGAR `style.css` E `script.js` SEM AUDITORIA

Depois que a nova home estiver funcionando:

verificar se:

```text
/assets/css/style.css
/assets/js/script.js
```

ainda são referenciados por qualquer página.

Se SIM:

manter.

Se NÃO:

podem permanecer temporariamente como legado nesta versão para reduzir risco.

Não é obrigatório limpar nesta migração.

---

# 57. PRINCÍPIO DE ROLLBACK

Antes de substituir `/index.html`, deve existir:

```text
/archive/home-v0.1.15/index.html
```

com seus arquivos necessários.

Se a migração falhar, deve ser possível restaurar manualmente a home antiga a partir do archive ou do Git.

---

# 58. N — CONGELADO

Na nova home, preservar exatamente o comportamento aprovado do N.

Não alterar:

- formação;
- desformação;
- scroll debt;
- visualProgress;
- targetProgress;
- speed limit;
- spring;
- deltaTime;
- breathing;
- repulsão;
- posição vertical;
- shader;
- quantidade de partículas.

Só corrigir caminhos/imports se necessário.

---

# 59. CURSOR — CONGELADO

Preservar:

- pointer único;
- cursor nativo ocultado somente com custom cursor funcional;
- data-cursor;
- smoothing já aprovado;
- pointer real para N e prisma;
- fallback mobile/reduced motion.

Não adicionar trails.

Não recalibrar velocidade.

---

# 60. PRISMA WEBGL — CONGELADO

Preservar:

- WebGLRenderer independente;
- camera;
- materiais;
- passes front/back;
- depthTest/depthWrite;
- edges;
- core;
- rings;
- drag;
- inércia;
- eixo vertical corrigido;
- touch;
- ResizeObserver;
- autopause.

Só corrigir import/path se necessário.

---

# 61. LENIS / GSAP / SCROLLTRIGGER — CONGELADOS

Não alterar calibração.

Ao mudar o HTML de pasta, garantir apenas que scripts sejam carregados na mesma ordem necessária.

---

# 62. ORDEM DE CARREGAMENTO

Inspecionar o `<head>` e final do `<body>` da preview.

Preservar ordem necessária de:

- fontes;
- CSS;
- GSAP;
- ScrollTrigger;
- Lenis;
- Three.js/import map, se houver;
- JS principal;
- módulos.

Não reorganizar por preferência.

---

# 63. IMPORT MAP

Se a preview utiliza `importmap`, copiar corretamente para o novo `/index.html`.

Não criar segunda versão conflitante de Three.js.

Não carregar Three.js duas vezes.

---

# 64. SEGURANÇA CONTRA DUPLICAÇÃO

Ao finalizar, verificar que a home não carrega simultaneamente:

```text
/assets/js/script.js
```

E:

```text
/assets/home/js/home.js
```

se o antigo `script.js` não for necessário.

A nova home deve usar sua própria lógica.

---

# 65. NÃO MISTURAR CSS ANTIGO E NOVO

A nova home NÃO deve carregar:

```text
/assets/css/style.css
```

e:

```text
/assets/home/css/home.css
```

simultaneamente só para “garantir”.

Isso pode gerar colisões.

Carregar somente o CSS necessário à nova home.

---

# 66. ISOLAMENTO DE NOMES

A pasta `/assets/home/` existe justamente para evitar conflito.

Não colocar arquivos da nova home diretamente em:

```text
/assets/css/style.css
/assets/js/script.js
```

sobrescrevendo os antigos.

Usar:

```text
/assets/home/css/home.css
/assets/home/js/home.js
```

---

# 67. SEO — HOME NOVA

Confirmar:

```html
<link rel="canonical" href="https://neoeffex.com.br/">
```

Confirmar Open Graph coerente.

Não deixar URLs contendo:

```text
/modelos/preview-vitrine/
```

como canonical ou og:url da home principal.

---

# 68. LINKS INTERNOS DA HOME

Quando estiver na raiz, usar preferencialmente:

```text
#diferenciais
#modelos
#como-funciona
```

para seções locais.

E caminhos absolutos:

```text
/planos/
/modelos/
```

para outras páginas.

---

# 69. HEADER APÓS PROMOÇÃO

Confirmar que o header da nova raiz é o mesmo aprovado na preview `v0.6.1`:

```text
Diferenciais
Modelos
Planos
Como funciona
Pedir orçamento
```

Não reintroduzir links individuais no header principal.

---

# 70. MODELOS INDIVIDUAIS

Hamburgueria, Clínica, Hortifruti e Lu Leve continuam disponíveis através da seção Modelos e/ou `/modelos/`.

Não precisam ocupar links fixos no header institucional.

---

# 71. TESTES — NOVA HOME LOCAL

Antes de considerar concluído, abrir a raiz pelo servidor local real do projeto.

Não testar apenas abrindo `file://`.

Usar o mesmo ambiente HTTP que já é utilizado no desenvolvimento.

---

# 72. TESTE — LOAD

Ao abrir `/`:

- nenhum 404 no console/network;
- CSS carrega;
- JS carrega;
- Three.js carrega;
- SVG do N carrega;
- vídeos/imagens carregam;
- fontes carregam;
- favicon carrega;
- Hero aparece.

---

# 73. TESTE — HEADER

Validar:

- logo;
- header fixed;
- estado inicial;
- estado scrolled;
- Diferenciais;
- Modelos;
- Planos;
- Como funciona;
- Pedir orçamento;
- mobile.

---

# 74. TESTE — HERO

Validar:

```text
SEU SITE
PODE IR ALÉM
```

Confirmar:

- Bebas Neue;
- escala;
- cores;
- entrada;
- centralização;
- responsividade.

---

# 75. TESTE — N

Testar:

- scroll lento;
- scroll normal;
- scroll rápido;
- scroll extremamente rápido;
- scroll reverso;
- parar abruptamente;
- mouse acima;
- mouse abaixo;
- mouse esquerda/direita;
- sair da janela;
- voltar.

Resultado deve ser equivalente à preview `v0.6.1`.

---

# 76. TESTE — CURSOR

Desktop:

- custom cursor aparece após input;
- nativo fica oculto corretamente;
- labels funcionam;
- header funciona;
- cards funcionam;
- prisma funciona;
- nenhuma duplicidade visual.

Mobile:

- custom cursor não aparece indevidamente.

---

# 77. TESTE — PRISMA

Validar:

- faces sem glitch;
- drag horizontal;
- drag vertical;
- vertical na direção correta;
- diagonais;
- inércia;
- soltar fora;
- touch;
- rings;
- resize.

---

# 78. TESTE — SEÇÃO MODELOS

Verificar todos os cards.

Para cada modelo:

- imagem/vídeo;
- título;
- descrição;
- CTA;
- link;
- hover;
- mobile.

---

# 79. TESTE — COMO FUNCIONA

Confirmar que a âncora chega corretamente à seção.

O header fixo não pode cobrir o título.

Utilizar `scroll-margin-top` ou compensação já existente se necessário.

---

# 80. TESTE — PLANOS

Abrir:

```text
/planos/
```

Confirmar:

- página carrega;
- CSS carrega;
- JS carrega;
- nenhum asset foi removido pela migração.

---

# 81. TESTE — MODELOS INDEX

Abrir:

```text
/modelos/
```

Confirmar que funciona.

---

# 82. TESTE — PREVIEW PRESERVADA

Abrir:

```text
/modelos/preview-vitrine/
```

Confirmar:

- continua funcional;
- header novo está presente;
- VERSION = `v0.6.1`;
- não depende de `/assets/home/` de forma acidental.

---

# 83. TESTE — HOME ARQUIVADA

Abrir quando possível:

```text
/archive/home-v0.1.15/
```

Confirmar que o snapshot antigo está preservado.

Não é obrigatório que integrações externas antigas funcionem como produção, mas a interface não deve estar destruída por falta de CSS/JS básico.

---

# 84. TESTE — ADMIN

Abrir:

```text
/admin/
```

Confirmar somente que a rota carrega e não perdeu assets globais.

Não testar funcionalidades profundas nesta migração salvo erro evidente.

---

# 85. TESTE — CATÁLOGO

Abrir uma rota funcional do catálogo.

Confirmar apenas ausência de regressão de assets globais.

---

# 86. TESTE — 404

Abrir uma URL inexistente no ambiente compatível.

Confirmar que `404.html` não ficou sem CSS/assets devido à limpeza.

---

# 87. TESTE — RESPONSIVIDADE

Executar no mínimo:

```text
1920 × 1080
1366 × 768
1024 × 768
768 × 1024
390 × 844
```

Não precisa reproduzir exatamente esses aparelhos, mas testar faixas equivalentes.

---

# 88. TESTE — NETWORK

Verificar Network.

Não pode haver 404 para arquivos da nova home.

Prestar atenção especial a:

- JS modules;
- `.svg`;
- vídeos;
- CSS;
- fontes;
- favicon;
- media.

---

# 89. TESTE — CONSOLE

Não aceitar novos:

- `ReferenceError`;
- `TypeError`;
- import errors;
- CORS de asset local;
- `Failed to fetch dynamically imported module`;
- `404` de módulo;
- erros WebGL;
- erros GSAP;
- erros de ScrollTrigger.

---

# 90. TESTE — VIEW SOURCE / PATHS

Verificar que o novo `/index.html` não aponta por engano para:

```text
/modelos/preview-vitrine/assets/...
```

A home deve usar `/assets/home/` para seus arquivos específicos.

---

# 91. TESTE — ROOT VERSION

Confirmar:

```text
/VERSION = 0.2.0
```

---

# 92. TESTE — ARCHIVE VERSION

Confirmar:

```text
/archive/home-v0.1.15/VERSION = 0.1.15
```

---

# 93. TESTE — PREVIEW VERSION

Confirmar:

```text
/modelos/preview-vitrine/VERSION = v0.6.1
```

---

# 94. ORDEM DE IMPLEMENTAÇÃO OBRIGATÓRIA

Executar exatamente nesta sequência operacional:

## BLOCO A — PRE-FLIGHT

1. verificar `git status` apenas para leitura;
2. confirmar estrutura real;
3. identificar home atual;
4. identificar preview atual;
5. mapear dependências.

## BLOCO B — ARCHIVE

6. criar `/archive/home-v0.1.15/`;
7. copiar `index.html` antigo;
8. criar VERSION do archive;
9. criar CHANGELOG do archive;
10. copiar dependências antigas necessárias;
11. validar snapshot.

## BLOCO C — PREVIEW v0.6.1

12. atualizar header;
13. alterar CTA para Pedir orçamento;
14. garantir links institucionais;
15. criar/reutilizar Como funciona;
16. atualizar VERSION;
17. atualizar CHANGELOG;
18. testar preview.

## BLOCO D — NOVA HOME

19. criar `/assets/home/`;
20. copiar CSS aprovado;
21. copiar JS aprovado;
22. copiar módulos Three.js;
23. copiar media específica necessária;
24. criar novo `/index.html` com base na preview;
25. adaptar caminhos;
26. atualizar metadata;
27. atualizar root VERSION para `0.2.0`;
28. atualizar root CHANGELOG.

## BLOCO E — VALIDAÇÃO

29. testar `/`;
30. testar preview;
31. testar archive;
32. testar `/planos/`;
33. testar `/modelos/`;
34. testar `/admin/` superficialmente;
35. testar catálogo superficialmente;
36. testar 404;
37. testar responsividade;
38. testar console/network.

## BLOCO F — PARAR

39. não fazer commit;
40. não fazer push;
41. entregar relatório.

---

# 95. SE ALGUMA DEPENDÊNCIA FOR COMPARTILHADA

Se durante a auditoria descobrir que um arquivo da home antiga é usado por outra rota:

NÃO mover.

Copiar para o archive e manter original.

Registrar no relatório.

---

# 96. SE ALGUM CAMINHO DA PREVIEW FOR AMBÍGUO

Não fazer replace global.

Identificar o consumidor:

- HTML;
- CSS;
- JS;
- shader;
- módulo;
- fetch;
- vídeo;
- link.

Corrigir localmente.

---

# 97. SE A NOVA HOME NÃO FUNCIONAR

Não tentar “consertar” reescrevendo N/prisma/cursor.

Primeiro verificar:

1. caminhos;
2. ordem de scripts;
3. importmap;
4. módulos;
5. IDs do HTML;
6. assets;
7. carregamento de fonte;
8. diferença de base URL.

A preview já funciona; portanto a migração deve preservar sua lógica.

---

# 98. SE A PREVIEW QUEBRAR APÓS O HEADER

Corrigir a regressão antes da promoção.

Não promover uma versão quebrada.

---

# 99. SE O ARCHIVE NÃO FICAR AUTOCONTIDO

Registrar quais recursos ainda são compartilhados.

Não duplicar indiscriminadamente toda a raiz só para tornar o archive independente.

Prioridade:

- HTML antigo preservado;
- CSS antigo preservado;
- JS antigo preservado;
- assets visuais essenciais preservados.

---

# 100. LIMPEZA DE LEGADO

NÃO fazer limpeza agressiva nesta versão `0.2.0`.

A remoção definitiva de assets antigos pode ser feita em uma etapa posterior depois de produção validada.

Nesta migração:

```text
segurança > limpeza
```

---

# 101. CRITÉRIOS DE ACEITE — HOME ANTIGA

A parte de archive só está concluída se:

- `/archive/home-v0.1.15/` existe;
- `index.html` antigo foi preservado;
- VERSION = `0.1.15`;
- CHANGELOG existe;
- CSS/JS necessários foram preservados;
- assets compartilhados não foram quebrados.

---

# 102. CRITÉRIOS DE ACEITE — PREVIEW

A preview só está pronta se:

- continua em `/modelos/preview-vitrine/`;
- VERSION = `v0.6.1`;
- CHANGELOG atualizado;
- novo header presente;
- `Pedir orçamento` presente;
- N funciona;
- cursor funciona;
- prisma funciona;
- console limpo.

---

# 103. CRITÉRIOS DE ACEITE — NOVA HOME

A nova home só está concluída se:

- `https://neoeffex.com.br/` é representada pelo `/index.html` da raiz;
- não há redirect para `/home/`;
- assets específicos estão em `/assets/home/`;
- root VERSION = `0.2.0`;
- header institucional está presente;
- N preservado;
- cursor preservado;
- prisma preservado;
- modelos preservados;
- Planos abre;
- responsividade preservada;
- console/network sem regressões.

---

# 104. CRITÉRIO DE ACEITE — ESTRUTURA

Estrutura final conceitual obrigatória:

```text
/index.html
/assets/home/...
/archive/home-v0.1.15/...
/modelos/preview-vitrine/... v0.6.1
/planos/...
/modelos/...
/admin/...
/catalogo/...
```

---

# 105. RELATÓRIO FINAL DO ANTIGRAVITY

Ao terminar, entregar relatório contendo exatamente:

1. `git status` inicial observado;
2. arquivos criados;
3. arquivos modificados;
4. arquivos movidos;
5. arquivos copiados;
6. arquivos removidos, se houver;
7. estrutura final de `/archive/home-v0.1.15/`;
8. assets antigos identificados como compartilhados;
9. VERSION da home arquivada;
10. VERSION da preview;
11. VERSION da nova home;
12. alterações do header;
13. destino de `Pedir orçamento`;
14. localização da seção Como funciona;
15. estrutura de `/assets/home/`;
16. caminhos alterados ao promover a preview;
17. módulos Three.js copiados;
18. confirmação de que N não foi recalibrado;
19. confirmação de que cursor não foi recalibrado;
20. confirmação de que prisma não foi recalibrado;
21. resultado dos testes da raiz;
22. resultado do teste da preview;
23. resultado do teste do archive;
24. resultado do teste `/planos/`;
25. resultado do teste `/modelos/`;
26. resultado superficial de `/admin/` e catálogo;
27. erros encontrados no console;
28. erros encontrados no Network;
29. riscos restantes;
30. confirmação de que não houve commit;
31. confirmação de que não houve push.

---

# 106. RESULTADO FINAL ESPERADO

Depois desta tarefa:

```text
neoeffex.com.br/
```

abre diretamente a nova experiência visual.

Internamente:

```text
/index.html
        ↓
/assets/home/
```

A home antiga permanece em:

```text
/archive/home-v0.1.15/
```

A preview que originou a nova home permanece em:

```text
/modelos/preview-vitrine/
```

na versão:

```text
v0.6.1
```

E a nova home passa a ser:

```text
0.2.0
```

---

# 107. COMANDO FINAL PARA O ANTIGRAVITY

Execute este documento de forma estrita.

Não faça alterações além das descritas.

Não faça melhorias extras.

Não faça refatoração geral.

Não altere N, cursor ou prisma além de ajustes de caminhos/imports indispensáveis para a migração.

Não faça commit.

Não faça push.

Ao terminar todos os testes, pare e apresente o relatório solicitado.
