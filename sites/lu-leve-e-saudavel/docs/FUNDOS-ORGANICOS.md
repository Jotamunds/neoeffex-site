# Fundos orgânicos — v0.1.10

Correção das pontas dos fundos da v0.1.9, preservando o visual-base v0.1.7, o conteúdo comercial e a organização do projeto. O pacote é local; nada foi publicado.

## O que foi corrigido

As ondas anteriores uniam duas elipses. Mesmo com a base preenchida, o encontro de contornos com direções diferentes podia formar uma ponta. A v0.1.10 substitui essa união por uma silhueta SVG contínua em cada transição.

- Saída da abertura: onda suave na cor da próxima seção visível.
- Entrada do fitness: curva inclinada e faixa sálvia com exatamente o mesmo desenho.
- Saída do fitness: outra onda suave, diferente da abertura.
- Manchas do hero: limites separados no celular e no desktop, sem cruzamento entre elas.
- Foto e chamada final: conservados os contornos por raios positivos, sem união de elipses.

Nos paths entregues, os segmentos cúbicos têm primeira e segunda derivadas iguais nas junções (continuidade C1/C2). Os controles avançam sempre em X, impedindo cúspides internas e auto-interseções do contorno. Não basta usar SVG: os pontos de controle também precisam respeitar essas condições.

## Organização dos arquivos

| Responsabilidade | Local |
| --- | --- |
| Desenho das ondas | Paths dos SVGs `.organic-wave` no `index.html` |
| Cores, medidas, posição, camadas e responsividade | `styles/components/organic-backgrounds.css` |
| Paleta e valores `--organic-*` | `styles/base/variables.css` |
| Import único e final do componente | `styles/main.css`, já existente |
| Contratos do efeito e casos de regressão | `tests/organic-backgrounds.mjs` |
| Leitura e validação matemática dos paths | `tests/curve-geometry.mjs` |

Aprovar o efeito não exige espalhar seus estilos nos outros componentes. Apenas a geometria vetorial reside no HTML, sem estilos inline. Os SVGs não dependem de arquivos externos, máscaras, biblioteca ou JavaScript e não precisam de requisições para funcionar em `file://`.

## Ligar e desligar

O `body` vem com `class="organic-backgrounds"`. Remova somente essa classe e recarregue para voltar aos fundos-base (v0.1.7). A partir da v0.1.11, o projeto também inclui `decorative-elements`, que controla os ícones separadamente: remova as duas classes para desligar todos os experimentos. Preserve outras classes locais. Recoloque-a para reativar.

Não remova o import CSS: a regra padrão `.organic-wave { display: none; }` evita espaço vazio de SVG no visual-base, na impressão e em cores forçadas. As regras que exibem a decoração exigem a classe e o modo de tela apropriado. O aviso de versão continua sendo o da entrega atual.

Para comparar com os experimentos v0.1.8 ou v0.1.9, use os respectivos ZIPs em pastas separadas.

## Ajustes simples por variáveis

Em `styles/base/variables.css`:

| Variável | Ajuste |
| --- | --- |
| `--organic-curve-height` | Altura das ondas: 1,25rem a 3rem, conforme a largura |
| `--organic-ribbon-width` | Espessura da faixa sálvia: 0,25rem |
| `--organic-shape-offset` | Afastamento interno das manchas |
| `--organic-shape-opacity` | Intensidade da mancha principal: 0,62 |
| `--organic-hero-accent-opacity` | Intensidade da mancha secundária: 0,3 |
| `--organic-hero-shape-radius` | Contorno da mancha principal |
| `--organic-hero-accent-radius` | Contorno da mancha secundária |
| `--organic-photo-outline-radius` | Contorno decorativo da foto |
| `--organic-hero-shape-color` | Cor das manchas, referenciada na paleta |
| `--organic-ribbon-color` | Cor da faixa, referenciada na paleta |

A cor de cada onda vem de `--section-background`, definido pelo tema da seção que chega. Para tornar a curva mais rasa ou profunda, prefira começar pela altura. A mudança de altura preserva sua continuidade, mas ainda precisa caber no respiro disponível.

As antigas variáveis `--organic-hero-wave-left/right`, `--organic-fitness-wave-left/right`, `--organic-curve-radius` e `--organic-curve-radius-alternate` foram removidas porque não controlam mais as ondas. Não as recrie esperando mudar o desenho.

## Alterar o desenho da curva

No `index.html`, procure os SVGs com a classe `organic-wave`, antes do conteúdo de cada seção:

| Onde está o SVG | Função | Cópias que devem permanecer iguais |
| --- | --- | --- |
| `#promocao` | Saída do hero quando há promoção | SVG de `#tradicionais` |
| `#tradicionais` | Saída do hero sem promoção | SVG de `#promocao` |
| Primeiro SVG de `#fitness` | Faixa sálvia, atrás da superfície | Segundo SVG de `#fitness` |
| Segundo SVG de `#fitness` | Superfície da entrada do fitness | Primeiro SVG de `#fitness` |
| `#como-funciona` | Saída do fitness | Nenhuma |

Cada `d` começa com `M`, usa curvas `C` e termina com `L 1440 100 L 0 100 Z`. Os comandos `L` fecham as laterais e a base; não devem aparecer no meio da onda visível. O `viewBox="0 0 1440 100"` define as coordenadas, e `preserveAspectRatio="none"` permite ocupar toda a largura sem deformar o conteúdo.

Cuidados ao editar os pontos:

- Mantenha os controles X estritamente crescentes dentro de cada curva.
- Mantenha os controles Y entre 0 e 100, sem encostar nas bordas superior/inferior.
- Preserve a mesma direção e intensidade dos controles nos encontros. Se alterar uma alça de uma junção, ajuste a vizinha; os testes também exigem suavidade da segunda derivada.
- Preserve as tangentes horizontais no início e no final da onda.
- Não acrescente stroke, polígonos ou uma segunda silhueta cruzada para corrigir a borda.
- Não mova os SVGs para dentro dos comentários `MENU:...`; o gerador substituiria esses trechos.
- Execute os testes após editar e depois confira no navegador. Não desative o teste de continuidade para aceitar uma curva com pontas.

Para as manchas do hero, os posicionamentos ficam no CSS do componente. No celular, a secundária termina em 30% da altura e a principal começa em 33%. No desktop, a secundária termina em 38% da largura e a principal começa em 42%. Preserve esses intervalos; a sobreposição de formas separadas pode criar uma nova ponta.

## Prevenções de layout e acessibilidade

- Fundos sólidos permanecem por baixo e as cores aprovadas continuam em variáveis.
- Decoração em posição absoluta, com isolamento local e camada atrás do conteúdo.
- SVGs com `aria-hidden="true"`, `focusable="false"` e sem controles interativos.
- `pointer-events: none` em todas as novas formas; cliques e foco não são interceptados.
- Recorte apenas do viewport de cada SVG. Nenhum novo recorte em seção, card, conteúdo ou ancestral da barra mobile.
- Largura de 100% da seção, sem 100vw, excedente horizontal ou transformação global.
- Altura tomada do respiro já existente da seção anterior; nenhum padding de conteúdo foi alterado.
- Recobrimento de 1px na base da onda para reduzir frestas de arredondamento. Isso não substitui a inspeção de pixels no navegador.
- Faixa sálvia deslocada em unidades CSS, com desenho idêntico e pintada antes da onda principal.
- Ondas e manchas sem animação; a abertura adicionada na v0.1.14 é independente e não altera sua geometria ou o funcionamento da barra.

### Promoção opcional

Promoção visível usa a onda amarela; promoção oculta ou removida usa a onda creme das tradicionais. Apenas uma cópia fica visível por vez. Sem JavaScript, a promoção continua oculta e a onda creme funciona pelo CSS.

Os seletores usam a ordem atual das seções, sem `:has()` ou lógica nova de promoção. Se inserir outra seção entre hero/promoção/tradicionais ou fitness/Como funciona, revise os seletores e os testes.

## Validação e limites

Execute:

```bash
node tools/build-menu.mjs --check
node tests/validate.mjs
```

A correção v0.1.10 introduziu 102 grupos: 82 da base e 20 dos fundos. A v0.1.12 acrescentou 15 grupos para os ícones; a v0.1.13 acrescentou 20 para os controles de movimento, totalizando 137. A v0.1.14 acrescenta 31 para a abertura, totalizando 168, sem alterar estas curvas. Incluem os paths reais, continuidade C1/C2, controles crescentes, fechamento correto, escalas positivas, cópias sincronizadas, casos inválidos, separação das manchas, contraste e espaço das curvas.

O teste antigo de cobertura da base não identificava encontros angulosos. A nova validação analisa as tangentes e a suavidade, e demonstra que exemplos defeituosos são rejeitados. Esses cálculos não executam um motor de layout nem validam antialiasing em aparelhos reais.

## Conferência visual pendente

Compare o efeito ligado/desligado em 320, 375, 430, 767, 768, 960, 1024 e 1440px, com zoom de 125% e 200%. Quando disponíveis, confira Chrome, Firefox e Safari.

Verifique as três transições inteiras, suas laterais, a faixa sálvia, as manchas da abertura e o contorno da foto. Não devem existir pontas, frestas, emendas angulosas ou cortes retos no meio das ondas.

Repita com promoção ativa, oculta e removida; sem JavaScript; impressão; cores forçadas; movimento reduzido; texto ampliado; teclado e janela baixa. Sem o efeito, não deve sobrar espaço de SVG. Preços, contatos, foco e rodapé devem continuar acessíveis, sem rolagem horizontal.

A revisão em navegador não foi executada nesta entrega. As pendências comerciais e de publicação continuam em `PUBLICACAO.md`.
