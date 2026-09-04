# Modelo Barbearia 1 — Contexto Específico

Estas instruções complementam os `GEMINI.md` superiores.

Leia também `README.md` antes de mudanças estruturais.

## Objetivo

Este projeto é um template demonstrativo reutilizável para venda e adaptação de sites de barbearias.

A implementação atual usa HTML, CSS e JavaScript puro, sem bibliotecas externas.

Não introduza framework sem benefício concreto.

## Organização existente

Preserve a separação modular atual.

CSS possui arquivos específicos para:

- tokens;
- base;
- header;
- hero;
- seções;
- WhatsApp;
- tema;
- lightbox;
- animações;
- responsividade;
- acessibilidade.

JavaScript possui módulos específicos para:

- configuração;
- conteúdo;
- WhatsApp;
- navegação;
- horários;
- galeria;
- animações;
- tema;
- dados estruturados.

Não recrie `style.css` ou `script.js` monolíticos.

## Personalização

`js/config.js` é o ponto preferencial para dados facilmente personalizáveis como:

- nome da barbearia;
- iniciais;
- chamada e descrição;
- serviços e preços;
- avaliações demonstrativas;
- WhatsApp;
- endereço;
- horários;
- mapa;
- Instagram.

Evite espalhar dados de cliente pelo HTML quando já houver configuração centralizada.

## Modo de demonstração de cores

O configurador de cores é uma funcionalidade do modelo.

Preserve:

- temas prontos;
- seletores de destaque e fundo;
- contraste automático;
- tons auxiliares;
- persistência da escolha;
- restauração do padrão.

Os presets ficam em `THEME_PRESETS` dentro de `js/config.js`.

A versão final de um cliente pode ocultar o configurador usando a configuração já existente; não remova o sistema do template apenas para escondê-lo.

## Identidade visual

A landing deve transmitir uma barbearia contemporânea e profissional.

Pode usar estética escura, fotografia forte, tipografia marcante e detalhes premium, mas deve continuar fácil de adaptar para marcas diferentes.

Não transformar o modelo em um site específico de uma barbearia sem solicitação.

## Galeria

Preserve proporções das imagens e o comportamento da lightbox.

Não reutilize uma única imagem em todos os cortes quando já existem assets individuais apropriados.

## WhatsApp

Use o módulo existente de WhatsApp.

Não duplique montagem de URL ou mensagem em diferentes pontos da página.

## Publicação

Preserve caminhos relativos e funcionamento em subpasta.

Antes de entregar para cliente real, telefone, endereço, avaliações, preços e redes sociais demonstrativos precisam ser substituídos por dados confirmados.
