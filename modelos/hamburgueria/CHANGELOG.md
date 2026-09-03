# v0.2.0.1

## Correção do pacote v0.2.0.1

- Corrigido o import de `GLTFLoader` e `RGBELoader` para `three/addons/...`, compatível com o import map do Live Server.
- Adicionado alias defensivo `three/examples/jsm/` no import map.
- A classe `.reveal` agora usa progressive enhancement: o conteúdo começa visível e só é animado pelo GSAP quando o runtime realmente carrega.
- Se CDN, GSAP, Three.js, WebGL, GLB ou HDRI falharem, a landing continua visível e o hambúrguer CSS permanece como fallback.
- Esta correção substitui o primeiro ZIP v0.2.0.1; a versão permanece `0.2.0.1` porque o pacote anterior não deve ser commitado.


- Corrige o fluxo de desenvolvimento para permitir testar novamente pela raiz do repositório com Live Server.
- O código-fonte Vite foi isolado em `source/`; a raiz de `modelos/hamburgueria/` volta a conter uma versão diretamente navegável.
- `npm run live:sync` sincroniza HTML, CSS, módulos JS, GLB e HDRI para a raiz da landing.
- No modo Live Server, Three.js e GSAP são resolvidos por import map; o build de produção continua empacotando as dependências pelo Vite.
- `npm run build` gera `dist/`.
- `npm run build:publish` gera o build e publica os arquivos estáticos na própria pasta `modelos/hamburgueria/`.
- O catálogo local passa a usar a mesma origem/porta quando a landing é aberta em `/modelos/hamburgueria/`, evitando a dependência fixa da porta 8080.
- Base Vite configurada com `base: "./"` para publicação segura em subpasta.
- Adicionados testes para detectar regressão de CSS não carregado, módulos Vite crus no Live Server e inconsistências entre assets 3D de origem/runtime.

# Changelog — Hamburgueria

## v0.2.0

- Pasta oficial alterada para `modelos/hamburgueria/`.
- Projeto migrado para Vite mantendo a landing separada do catálogo Neoeffex.
- Three.js adicionado somente para o hero 3D.
- GSAP e ScrollTrigger adicionados para montagem, parallax, scroll e revelações.
- Adicionado `public/models/burger.glb` local, sem dependência da Hostinger.
- Adicionado `public/hdr/burger-studio.hdr` local para iluminação ambiente.
- Materiais do hambúrguer convertidos para PBR com roughness, clearcoat, bump e texturas procedurais.
- Ingredientes do modelo recebem materiais diferentes: pão, carne, queijo, bacon, alface, picles, cebola, molho e gergelim.
- Hambúrguer monta as camadas na abertura e depois mantém flutuação suave.
- Câmera e luz principal reagem discretamente ao ponteiro em desktop.
- Cena reage ao scroll sem alterar o layout da landing.
- Adicionados vapor 3D e partículas de brasa.
- Qualidade do renderer é reduzida automaticamente em telas menores.
- Renderização pausa quando a aba fica oculta.
- Mantido fallback CSS caso WebGL, HDRI ou GLB não possam ser usados.
- Mantido `prefers-reduced-motion`.
- Cards informativos continuam sem hover de seleção/elevação.
- Integração com `/catalogo/?catalogo=...` preservada e centralizada em `src/catalog.js`.

## v0.1.1

- Hero gastronômico enriquecido em CSS.
- Adicionados vapor, faíscas, ingredientes extras e parallax 2D.
- Removido hover de seleção dos cards informativos.

## v0.1.0

- Removidas dependências específicas do e-commerce da Hostinger.
- Landing reescrita e integrada ao catálogo compartilhado da Neoeffex.