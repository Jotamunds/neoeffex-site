# Ícones decorativos locais

Origem: Lucide, versão 1.8.0, licença ISC. Os seis ícones foram exportados da distribuição oficial já disponível no ambiente de desenvolvimento. O broto foi adaptado na v0.1.12 apenas pela remoção do path `M5 21h14`, que desenhava a linha de solo. As folhas e o caule foram mantidos. A geometria dos outros cinco ícones foi preservada; a apresentação no site usa traço mais fino e cores/transparência definidos no CSS. A biblioteca não é instalada nem carregada pelo site.

| Arquivo | Ícone original | Uso |
| --- | --- | --- |
| `sprout.svg` | [Sprout](https://lucide.dev/icons/sprout), adaptado | Broto sem linha de solo na abertura |
| `dumbbell.svg` | [Dumbbell](https://lucide.dev/icons/dumbbell) | Haltere na seção fitness |
| `leaf.svg` | [Leaf](https://lucide.dev/icons/leaf) | Folha na chamada final |
| `wheat.svg` | [Wheat](https://lucide.dev/icons/wheat) | Ramo de trigo nas tradicionais |
| `salad.svg` | [Salad](https://lucide.dev/icons/salad) | Tigela com vegetais em Como funciona |
| `sun.svg` | [Sun](https://lucide.dev/icons/sun) | Sol na área de contato |

Licença original em `LICENSE-LUCIDE.txt`. Preserve-a ao redistribuir os arquivos. Não são fotografias nem alegações sobre o produto.

## Manutenção

Cor, intensidade, posição, inclinação e tamanho do desenho exibido são controlados por `--decoration-*` em `styles/base/variables.css`. A aplicação desses valores está em `styles/components/decorations.css`.

O HTML contém cópias inline para que `currentColor` herde as cores do CSS sem depender de máscaras ou referências externas em `file://`. Depois de editar um SVG aqui, execute na raiz do projeto:

```bash
node tools/build-decorations.mjs
node tests/validate.mjs
```

O gerador altera somente os seis blocos `DECORATION` do HTML. O modo `--check` confere sem escrever. Preserve o cabeçalho SVG e use apenas paths e círculos do formato documentado; scripts, eventos, links, imagens, estilos inline e referências externas são rejeitados. O gerador não é um sanitizador genérico para arquivos SVG não confiáveis.

Não edite diretamente as cópias geradas no `index.html`, pois serão substituídas na próxima geração. Para retirar temporariamente os seis elementos, remova apenas `decorative-elements` do `body`, preservando `organic-backgrounds` e outras classes. Veja `docs/DECORACOES.md`.
