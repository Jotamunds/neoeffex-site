# Changelog — Modelo Hamburgueria

## v0.1.0

- Removida toda a arquitetura React/Vite/Tailwind do projeto exportado pela Hostinger.
- Removidas dependências de `Hostinger Ecommerce`, checkout, booking, inventário e carrinho próprio.
- Removidos `package.json`, `package-lock.json`, componentes shadcn/Radix e hooks dependentes do ambiente original.
- Landing page reescrita em HTML, CSS e JavaScript puro.
- Hero original dependente de `images.hostinger.com` substituído por composição visual local em CSS.
- Navegação e animações implementadas sem bibliotecas externas de JavaScript.
- Adicionado suporte a `prefers-reduced-motion`.
- CTAs conectados ao catálogo compartilhado Neoeffex pelo slug configurável.
- Adicionado comportamento local/produção para links do catálogo.
- Informações comerciais centralizadas em `assets/js/config.js`.
- Adicionados testes estáticos de estrutura e ausência de dependências Hostinger.
