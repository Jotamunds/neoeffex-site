# Tema do catálogo — Lu Leve e Saudável

## Versão

```text
v0.1.9.4
```

## Objetivo

Fazer o catálogo compartilhado da Neoeffex parecer uma continuação visual do site da Lu Leve e Saudável sem duplicar o núcleo do catálogo.

## Slug

```text
lu-leve-e-saudavel
```

URL local/produção:

```text
/catalogo/?catalogo=lu-leve-e-saudavel
```

## Site relacionado

```text
/sites/lu-leve-e-saudavel/
```

## Fonte visual

O tema foi derivado de:

```text
sites/lu-leve-e-saudavel/styles/base/variables.css
```

Site de referência:

```text
v0.1.18
```

### Cores principais

```text
Primary:          #153b2b
Primary light:    #2b5b43
Sage:             #dce7d8
Sage dark:        #aebfa8
Background:       #f7f2e8
Surface:          #fffcf7
Brand background: #f8f2ed
Accent soft:      #f4e8b9
Accent:           #e3c56b
WhatsApp:         #1f7a45
Text:             #17211b
Muted:            #59665d
Border:           #d6ded5
Border dark:      #62856c
```

### Tipografia

```text
Títulos: Sora
Corpo:   Manrope
```

As fontes são carregadas dos arquivos já existentes do site em `/sites/lu-leve-e-saudavel/assets/fonts/`.

### Formas

```text
Small:  0.625rem
Medium: 1rem
Large:  1.5rem
Pill:   999px
```

## Como funciona

`catalogo/config.js` valida o slug.

Somente o slug exato:

```text
lu-leve-e-saudavel
```

recebe o atributo:

```html
data-catalog-theme="lu-leve-e-saudavel"
```

e carrega:

```text
catalogo/assets/css/themes/lu-leve-e-saudavel.css
```

O CSS é todo escopado nesse atributo.

Outros catálogos permanecem com o visual padrão.

## Navegação

Quando o tema da Lu está ativo:

- o cabeçalho aponta para `/sites/lu-leve-e-saudavel/`;
- o nome no cabeçalho passa a ser `Lu Leve e Saudável`;
- o rodapé oferece `Voltar ao site`;
- a cor do navegador passa para o verde principal da marca.

## O que NÃO foi copiado

O CSS estrutural da landing não foi importado diretamente.

Não foram copiados:

- hero da landing;
- grid da landing;
- animações da landing;
- componentes de preço da landing;
- decoração SVG;
- scripts da landing.

Isso evita colisão com o catálogo compartilhado.

## O que foi adaptado

- paleta;
- tipografia;
- fundos;
- raios;
- sombras;
- cards;
- busca;
- filtros;
- botões;
- hero do catálogo;
- carrinho;
- WhatsApp;
- rodapé.

## Atualização futura

Se o design do site mudar:

1. enviar o novo arquivo de variáveis;
2. comparar os tokens;
3. atualizar somente `lu-leve-e-saudavel.css`;
4. testar o catálogo;
5. não alterar carrinho, produtos, RLS ou banco sem necessidade.

## Domínio separado no futuro

Se o site for migrado para, por exemplo:

```text
https://luleveesaudavel.com.br/
```

o catálogo poderá continuar em:

```text
https://neoeffex.com.br/catalogo/?catalogo=lu-leve-e-saudavel
```

Nesse momento, revisar somente:

- `siteUrl` no registro do tema;
- origem das fontes locais, caso a pasta `/sites/lu-leve-e-saudavel/` deixe de existir no domínio Neoeffex.

O tema não depende de `localStorage` compartilhado entre os dois domínios.

---

## v0.1.10 — logo do catálogo

A identidade pública da Lu passa a priorizar o ativo:

```text
catalogo/assets/images/brands/lu-leve-e-saudavel/logo-catalogo.webp
```

Esse arquivo foi recortado do símbolo presente no pack oficial recebido para a Lu.

Exibição:

```text
quadrada
sem moldura externa
cantos levemente arredondados
object-fit: cover
```

Tamanhos aproximados:

```text
desktop: 124 × 124 px
mobile:  108 × 108 px
até 420: 96 × 96 px
```

A imagem do Storage permanece como fallback caso o ativo local não carregue.

---

## v0.1.10.1 — pack de identidade atualizado

Pack recebido:

```text
logo-com-texto-na-direita.png
logo-com-texto-na-esquerda.png
logo-quadrada-com-texto.png
logo-quadrada-sem-texto.png
```

Ativos escolhidos para o catálogo:

```text
Cabeçalho:
logo-com-texto-na-esquerda.png
→ logo-header.webp

Hero:
logo-quadrada-sem-texto.png
→ logo-catalogo.webp
```

Motivo:

- o cabeçalho precisa de leitura horizontal rápida;
- o símbolo à esquerda cria continuidade natural com o conteúdo;
- no hero, o nome “Lu Leve e Saudável” já é exibido pelo catálogo, então a versão quadrada sem texto evita repetição;
- a imagem quadrada mantém somente um arredondamento discreto nos cantos, sem moldura externa.

