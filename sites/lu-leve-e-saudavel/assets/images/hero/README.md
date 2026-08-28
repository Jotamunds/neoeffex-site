# Fotografia principal

Incluída na Etapa 3. Uma fotografia genérica gerada por IA, não uma foto de um produto real da Lu Leve e Saudável. A embalagem, os ingredientes e as porções não devem ser tratados como confirmação do cardápio. A página exibe a legenda “Imagem ilustrativa”.

## Arquivos servidos pelo site

| Arquivo | Dimensões | Tamanho |
| --- | --- | --- |
| `marmita-640.webp` | 640 × 640 | 59.078 bytes |
| `marmita-960.webp` | 960 × 960 | 120.178 bytes |

As duas resoluções são da mesma imagem. `srcset` e `sizes` permitem que o navegador escolha o arquivo apropriado. A imagem não depende de um serviço externo. O original gerado tinha 1254 × 1254 pixels; as cópias WebP foram apenas redimensionadas e comprimidas com qualidade 82, sem alterar a composição.

## Substituir pela fotografia real

1. Escolha uma foto própria/autorizada, em perspectiva e com espaço em volta da marmita.
2. Exporte duas versões quadradas de 640 e 960 pixels em WebP, mantendo os nomes acima.
3. Substitua os dois arquivos. Não é necessário alterar o CSS.
4. Atualize o texto `alt` no `index.html` para descrever o produto real. Remova “ilustrativa” e a legenda somente quando a imagem de fato retratar o produto.
5. Confira o recorte 4:3 no celular e 1:1 no desktop. Para mudar o ponto de enquadramento, ajuste `object-position` em `styles/sections/hero.css`.
6. Rode `node tests/validate.mjs`, se tiver Node.js, e confira o resultado no navegador.

Se escolher outros tamanhos, atualize também `srcset`, `width`, `height` e os testes de dimensões. Não coloque textos, preços ou botões dentro da fotografia.

## Origem e prompt

Modo de geração: ferramenta integrada `image_gen`, uma solicitação para um único asset, sem variantes. A imagem é usada como material ilustrativo durante o desenvolvimento. Não utiliza fotografia de terceiros como referência.

Prompt final:

```text
Use case: photorealistic-natural
Asset type: a single standalone in-page hero photograph for a healthy Brazilian meal-prep website, not a website mockup.
Scene/backdrop: warm light cream tabletop with the faintest sage undertone, clean background covering the entire canvas.
Subject: exactly one unbranded oval or softly rectangular kraft meal-prep container, filled with appetizing realistic grilled chicken, rice, roasted carrots, and broccoli.
Style/medium: photorealistic editorial commercial food photography, refined minimal composition with realistic natural food textures, individual rice grains, subtle natural imperfections, rich healthy colors without oversaturated processing.
Composition/framing: square image, ideally 1024 x 1024; three-quarter elevated camera perspective, not flat top-down. The whole container is centered, fully visible, with comfortable edge margins on every side for responsive cropping into rounded portrait or landscape frames. Close enough to clearly see food texture.
Lighting/mood: soft side daylight and a convincing gentle cast shadow, fresh and welcoming.
Constraints: this is an illustrative generic food photograph, not claimed to be a real brand product. No words, no labels, no UI, no price, no logo, no watermark. No hands, no people, no cutlery, no scattered ingredients, no additional containers. Exactly one photograph, no variants, no collage.
```
