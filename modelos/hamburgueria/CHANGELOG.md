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
