# Barbearia 1 — template demonstrativo

Landing page reutilizável para demonstração e venda de sites para barbearias.
O projeto usa apenas HTML, CSS e JavaScript puro, sem bibliotecas externas.

## Estrutura

```text
barbearia1/
├── index.html
├── css/
│   ├── tokens.css
│   ├── base.css
│   ├── header.css
│   ├── hero.css
│   ├── sections.css
│   ├── whatsapp.css
│   ├── theme.css
│   ├── lightbox.css
│   ├── animations.css
│   ├── responsive.css
│   └── accessibility.css
├── js/
│   ├── config.js
│   ├── content.js
│   ├── whatsapp.js
│   ├── navigation.js
│   ├── hours.js
│   ├── gallery.js
│   ├── animations.js
│   ├── theme.js
│   └── structured-data.js
└── assets/
    └── images/
        ├── barbearia-hero.jpg
        ├── barbearia-galeria.jpg
        ├── barbearia-interior.jpg
        ├── corte-fade-classico.jpg
        ├── corte-social-moderno.jpg
        ├── corte-texturizado.jpg
        ├── corte-degrade.jpg
        ├── corte-barba.jpg
        └── corte-cacheado.jpg
```

## Organização do código

- `css/hero.css` contém somente o Hero e mantém `z-index: 1` no `.hero`.
- `css/whatsapp.css` e `js/whatsapp.js` controlam o WhatsApp.
- `css/theme.css` e `js/theme.js` controlam o modo demonstração.
- Galeria, navegação, horários e animações também possuem módulos próprios.
- `index.html` é a única página principal do projeto.

Os antigos `style.css` e `script.js` não são usados nesta versão. A separação
reduz o risco de uma alteração em um componente afetar recursos independentes.

As seis fotos com o prefixo `corte-` são usadas individualmente pela galeria.
Isso preserva a proporção das imagens nas miniaturas e no modo ampliado.

## Personalização rápida

Abra `js/config.js` para alterar:

- nome e iniciais da barbearia;
- chamada principal e descrição;
- três serviços principais e preços;
- avaliação usada no Hero;
- nomes e textos das duas avaliações exibidas;
- WhatsApp e mensagem automática;
- endereço, horários, mapa e Instagram.

Os valores atuais são demonstrativos. Troque telefone, endereço, avaliações e
números antes de publicar para um cliente real.

## Modo demonstração de cores

O botão flutuante **Cores**, no canto inferior esquerdo, abre um configurador com:

- seis temas prontos;
- seletor de cor de destaque;
- seletor da cor de fundo;
- cálculo automático de contraste e tons auxiliares;
- memorização da escolha no navegador;
- botão para restaurar o padrão.

Os temas ficam em `THEME_PRESETS`, dentro de `js/config.js`.

Para ocultar o configurador em uma versão final entregue ao cliente, altere
`enabled` para `false` dentro de `DEMO_CONFIG`.

## Publicação

Envie toda a pasta para o servidor preservando sua estrutura. Para publicar em
`neoeffex.com.br/barbearia1`, coloque o conteúdo dentro de:

```text
public_html/barbearia1/
```

O arquivo inicial já se chama `index.html`.
