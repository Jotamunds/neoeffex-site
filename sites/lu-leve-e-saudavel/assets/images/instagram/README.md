# Galeria local — Etapa 6

Três fotografias ilustrativas geradas por IA em 27/08/2026, com a ferramenta integrada de geração de imagens. Uma única geração por foto, sem variantes ou novas tentativas. Os arquivos foram inspecionados e convertidos para WebP, sem alteração do conteúdo.

Não são fotos de produtos reais da Lu nem publicações retiradas do Instagram. Não confirmam porções, ingredientes ou embalagens. A legenda ilustrativa deve permanecer até a substituição por fotos reais autorizadas.

## Arquivos usados pelo site

| Foto | Arquivos e dimensões | Tamanho de cada arquivo |
| --- | --- | --- |
| Duas marmitas em perspectiva, principal | `marmitas-640.webp`, 640 × 640; `marmitas-960.webp`, 960 × 960 | 67.370 e 136.200 bytes |
| Detalhe dos legumes e frango | `legumes-400.webp`, 400 × 400; `legumes-640.webp`, 640 × 640 | 27.302 e 75.248 bytes |
| Três marmitas vistas de cima | `rotina-400.webp`, 400 × 400; `rotina-640.webp`, 640 × 640 | 26.782 e 66.360 bytes |

Total das seis versões: 399.262 bytes. O navegador escolhe uma versão por foto, de acordo com `srcset`, `sizes` e densidade da tela. Todas usam `loading="lazy"`, pois ficam abaixo do conteúdo inicial. Os PNGs originais de 1254 × 1254 não são necessários para executar o projeto e não acompanham o ZIP.

Os prompts completos estão em `PROMPTS.md`. As imagens não têm pessoas, marcas, textos ou preços. A principal e o detalhe têm recipientes próximos à borda; evite recortes adicionais intensos. Os estilos usam `object-fit: cover` e recorte central.

## Substituir pelas fotografias reais

1. Selecione três fotos autorizadas: uma principal e duas de apoio, com assuntos legíveis em telas pequenas.
2. Exporte cada foto em formato WebP nas duas dimensões indicadas acima, preferencialmente mantendo o enquadramento quadrado.
3. Substitua os arquivos correspondentes dentro desta pasta, preservando os nomes. Não basta renomear um JPG para `.webp`: converta o formato.
4. No `index.html`, atualize os textos `alt` de cada imagem para descrever seu conteúdo real.
5. Se mudar as dimensões, os nomes ou a proporção, atualize também `src`, `srcset`, `width` e `height`.
6. Só remova a legenda “Imagens ilustrativas” depois de trocar todas as fotos e confirmar que são da empresa.
7. Execute `node tests/validate.mjs` e confira os recortes no celular e desktop. Ao substituir ilustrações por fotos reais, atualize também os testes de legenda e texto alternativo para refletir a nova procedência.

A galeria não faz requisições ao Instagram. Somente o link “Ver no Instagram” leva ao perfil; seu endereço fica em `scripts/config.js`, com uma cópia de emergência no HTML. Veja `docs/CONTATOS.md` na raiz do projeto.
