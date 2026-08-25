# Barbearia 1 — template demonstrativo

Landing page reutilizável para demonstração e venda de sites para barbearias.
O projeto usa apenas HTML, CSS e JavaScript puro, sem bibliotecas externas.
O nome demonstrativo exibido no layout é **Nome da Barbearia**, deixando claro
onde a marca do cliente deverá ser inserida.

## Estrutura

```text
barbearia1/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   └── script.js
└── assets/
    └── images/
        ├── barbearia-hero.jpg
        ├── barbearia-galeria.jpg
        └── barbearia-interior.jpg
```

## Personalização rápida

Abra `js/config.js` para alterar:

- nome e iniciais da barbearia;
- chamada principal e descrição;
- serviços e preços;
- diferenciais e números;
- nomes e textos das avaliações;
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
