# Modelo Hamburgueria — Neoeffex

Landing page estática derivada do conceito visual recebido da Hostinger, reescrita para funcionar sem React, Vite, Tailwind, Radix, shadcn, Framer Motion ou Hostinger Ecommerce.

## Objetivo

O módulo contém somente a landing page. Produtos, categorias, carrinho e pedido continuam centralizados no catálogo compartilhado da Neoeffex.

Por padrão, todos os elementos com `data-catalog-link` apontam para:

```text
/catalogo/?catalogo=modelo-hamburgueria
```

Em localhost/IP privado, `assets/js/catalog.js` resolve o catálogo local. Em produção, usa `https://neoeffex.com.br/catalogo/`.

## Estrutura

```text
modelos/modelo-hamburgueria/
├── index.html
├── VERSION
├── CHANGELOG.md
├── README.md
├── assets/
│   ├── css/
│   │   └── site.css
│   └── js/
│       ├── config.js
│       ├── catalog.js
│       └── site.js
└── tests/
    └── validate.mjs
```

## Personalização

Edite `assets/js/config.js` para alterar:

- nome do comércio;
- marca exibida no cabeçalho;
- telefone;
- endereço;
- horários;
- texto de delivery;
- slug do catálogo.

O slug deve corresponder ao catálogo criado no `/admin/`.

Exemplo:

```js
catalog: {
    slug: "brasa-burger",
    productionOrigin: "https://neoeffex.com.br",
    path: "/catalogo/"
}
```

## Teste local

A partir da raiz do repositório:

```powershell
py -m http.server 8080
```

Abra:

```text
http://localhost:8080/modelos/modelo-hamburgueria/
```

O botão de pedido deverá apontar para:

```text
http://localhost:8080/catalogo/?catalogo=modelo-hamburgueria
```

## Publicação

O módulo é estático e não precisa de `npm install`, build ou servidor Node.

Antes de usar como site real:

1. troque o conteúdo demonstrativo;
2. altere o slug em `config.js`;
3. crie/configure o catálogo correspondente no Admin;
4. confirme telefone, endereço e horários;
5. remova `noindex, nofollow` somente quando o site estiver pronto para indexação.

## v0.1.1 — movimento e hero gastronômico

- O hambúrguer do hero continua 100% local, agora com mais camadas visuais e textura.
- Não há dependência nova de React, Vite ou APIs externas para as animações.
- Cards informativos não mudam de posição nem recebem destaque ao passar o mouse.
- O movimento do hero, cards decorativos, números e revelações respeita `prefers-reduced-motion`.
