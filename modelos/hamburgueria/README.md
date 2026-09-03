# Hamburgueria — modelo premium Neoeffex

Landing premium para hamburgueria integrada ao catálogo compartilhado da Neoeffex.

A partir da `v0.2.0`, o hero usa uma cena 3D em tempo real com:

- Vite;
- Three.js;
- GSAP;
- modelo local em `GLB`;
- materiais PBR;
- iluminação de estúdio com `HDRI` local;
- animação de montagem, flutuação, parallax e reação de luz ao ponteiro;
- fallback visual sem WebGL;
- `prefers-reduced-motion`.

Produtos, categorias, carrinho e pedido continuam centralizados no catálogo compartilhado da Neoeffex. A landing não mantém um segundo carrinho.

## Estrutura

```text
modelos/hamburgueria/
├── index.html
├── package.json
├── vite.config.js
├── VERSION
├── CHANGELOG.md
├── README.md
├── public/
│   ├── hdr/
│   │   └── burger-studio.hdr
│   └── models/
│       └── burger.glb
├── src/
│   ├── main.js
│   ├── config.js
│   ├── catalog.js
│   ├── site.js
│   ├── burger3d.js
│   └── site.css
└── tests/
    └── validate.mjs
```

## Catálogo Neoeffex

Por padrão, os CTAs usam:

```text
/catalogo/?catalogo=modelo-hamburgueria
```

O slug é configurado em:

```text
src/config.js
```

Exemplo:

```js
catalog: {
    slug: "brasa-burger",
    developmentOrigin: "http://localhost:8080",
    productionOrigin: "https://neoeffex.com.br",
    path: "/catalogo/"
}
```

O catálogo correspondente precisa existir no `/admin/`.

## Desenvolvimento

Na raiz do repositório, abra um terminal para o catálogo local:

```powershell
py -m http.server 8080
```

Em outro terminal:

```powershell
cd modelos/hamburgueria
npm install
npm run dev
```

O Vite exibirá o endereço da landing, normalmente em `http://localhost:5173/`. Em desenvolvimento, os CTAs usam `developmentOrigin` e levam para `http://localhost:8080/catalogo/?catalogo=...`, permitindo testar a landing Vite e o catálogo estático ao mesmo tempo.

## Build

```bash
npm run build
```

A pasta gerada é:

```text
dist/
```

O `vite.config.js` usa `base: "./"`, permitindo publicar o build em subpasta. Como o repositório Neoeffex publica arquivos estáticos, **o conteúdo destinado à produção deve ser o build de `dist/`**, não os módulos ES de desenvolvimento em `src/`.

## Modelo 3D e HDRI

Arquivos atuais:

```text
public/models/burger.glb
public/hdr/burger-studio.hdr
```

A `v0.2.0` já usa esses arquivos em produção. O `GLB` atual foi criado como base 3D otimizada e separa ingredientes por nomes de mesh, permitindo animar e substituir materiais individualmente.

Na etapa seguinte, o mesmo caminho pode receber um modelo ainda mais fotográfico sem alterar a arquitetura da landing.

## Performance

O renderer limita `devicePixelRatio`, reduz sombras e partículas em telas menores e pausa a renderização quando a aba fica oculta.

Se WebGL ou o modelo falhar, a composição CSS anterior permanece como fallback.

## Validação

```bash
npm run validate
npm run build
```

Antes de publicar como site real:

1. troque nome, telefone, endereço e horários em `src/config.js`;
2. configure o slug real do catálogo;
3. substitua textos e conteúdo demonstrativo;
4. valide desktop e mobile;
5. remova `noindex, nofollow` somente quando o cliente aprovar a publicação.
