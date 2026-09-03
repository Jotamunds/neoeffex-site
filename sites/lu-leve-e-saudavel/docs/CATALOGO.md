# Integração com o catálogo — v0.1.19

## Destino

O site da Lu usa o catálogo compartilhado da Neoeffex:

```text
https://neoeffex.com.br/catalogo/?catalogo=lu-leve-e-saudavel
```

## Ambiente local

Quando a landing está em localhost, IP privado, domínio `.local` ou aberta via `file:`, `scripts/catalog.js` resolve o destino relativo:

```text
../../catalogo/?catalogo=lu-leve-e-saudavel
```

Por isso, para testar site e catálogo juntos, sirva a raiz do repositório, mantendo as pastas irmãs:

```text
neoeffex-site/
├── catalogo/
└── sites/
    └── lu-leve-e-saudavel/
```

## Produção atual

Site:

```text
https://neoeffex.com.br/sites/lu-leve-e-saudavel/
```

Catálogo:

```text
https://neoeffex.com.br/catalogo/?catalogo=lu-leve-e-saudavel
```

## Domínio próprio no futuro

Se a landing migrar para outro domínio, por exemplo:

```text
https://luleveesaudavel.com.br/
```

o script continuará usando `catalog.productionUrl`, portanto o catálogo permanece na Neoeffex sem depender de `localStorage`, CORS ou troca de variáveis entre domínios.

## Pontos de entrada

Os links `[data-catalog-link]` existem em:

- cabeçalho;
- hero;
- promoção, quando ativa;
- fechamento de Tradicionais;
- fechamento de Fitness;
- Como funciona;
- CTA final;
- barra fixa mobile.

`Abrir cardápio` é o CTA prioritário.

O contato direto `Fale conosco` fica somente no fechamento final, como ação secundária.

O HTML mantém a URL oficial como fallback. O JavaScript altera o `href` somente quando identifica um ambiente local.

## Alterar o slug

A fonte de verdade fica em `scripts/config.js`:

```js
catalog: {
    slug: "lu-leve-e-saudavel",
    productionUrl: "https://neoeffex.com.br/catalogo/?catalogo=lu-leve-e-saudavel",
    localPath: "../../catalogo/?catalogo=lu-leve-e-saudavel"
}
```

Não espalhe outra URL do catálogo pelo JavaScript.

## Cabeçalho mobile

Em telas de celular (`max-width: 47.999rem`), o botão de catálogo do cabeçalho superior é ocultado para dar prioridade visual à marca.

A navegação ao catálogo continua disponível por:

- hero;
- blocos de produtos;
- Como funciona;
- CTA final;
- barra fixa mobile.

A logo do cabeçalho é centralizada e ampliada somente nesse breakpoint.
