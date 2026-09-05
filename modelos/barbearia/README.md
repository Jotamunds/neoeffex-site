# Modelo Barbearia Editorial

Landing page institucional responsiva para barbearias conectada ao catálogo público da Neoeffex. A página não replica catálogo, carrinho, WhatsApp ou gestão de pedidos.

## Estrutura

- `index.html`: conteúdo e estrutura semântica.
- `assets/css/style.css`: layout, responsividade e variáveis de marca.
- `assets/js/main.js`: slug do catálogo, seletor de temas, menu e avaliações.
- `assets/img/`: fotografia local do modelo.

## Configurando o catálogo

Em `assets/js/main.js`, altere somente `SITE_CONFIG.catalogSlug`. Todos os links comerciais usam essa configuração para apontar para `/catalogo/<slug>`.

## Alterando as cores

As CSS Custom Properties ficam no início de `assets/css/style.css`, na seção `THEME / BRAND COLORS`. As principais são `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-primary`, `--color-primary-hover` e `--color-border`.

Para trocar o tema inicial, edite `SITE_CONFIG.theme.defaultPreset` em `assets/js/main.js`. Os presets demonstrativos apenas atualizam as variáveis CSS, sem alterar configurações do catálogo. Para entregar o modelo a um cliente real sem o seletor, remova o bloco `.theme-wrap` de `index.html` e as regras `.theme-*` correspondentes no CSS.

## Personalização rápida

Centralize textos institucionais, imagens e dados da unidade antes de publicar. Quando localização, horário, telefone e rede social existirem no sistema central Neoeffex, use-o como fonte oficial em vez de duplicar esses dados.
