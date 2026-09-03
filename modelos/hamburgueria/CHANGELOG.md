# Changelog — Modelo Hamburgueria

## v0.1.1

- Hero gastronômico enriquecido com novas camadas: cebola, picles, bacon, molho, queijo com gotejamento e textura de chapa nos smash burgers.
- Pão recebeu volume, brilho, sementes e sombreamento mais natural.
- Adicionados vapor, faíscas, halo de calor, anéis decorativos e etiquetas flutuantes ao redor do hambúrguer.
- Adicionado movimento contínuo e suave no hero, com parallax pelo ponteiro em dispositivos compatíveis.
- Badge `Direto da chapa` ganhou brilho periódico e pulso discreto do ícone.
- Cards decorativos do catálogo agora se movimentam automaticamente, sem hover de seleção.
- Removido o hover que levantava/destacava os cards de diferenciais.
- Cabeçalho reage à rolagem com fundo e sombra mais definidos.
- Revelações no scroll receberam atraso escalonado e movimento mais orgânico.
- Métricas da seção Sobre agora contam até o valor final quando entram na tela.
- Mantido suporte integral a `prefers-reduced-motion`.

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
