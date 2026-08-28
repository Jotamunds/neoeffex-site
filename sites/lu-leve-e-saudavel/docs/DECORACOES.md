# Elementos de fundo — v0.1.12

Seis ícones leves complementam os fundos orgânicos sem alterar os preços, textos, fotografias, espaçamentos ou funcionamento da página.

| Elemento | Local | Comportamento |
| --- | --- | --- |
| Broto sem barrinha inferior | Abertura | Próximo à foto no celular; canto superior direito no desktop |
| Haltere | Fitness | Contorno claro e discreto, somente a partir de 60rem |
| Folha | Chamada final | Parcialmente escondida na borda inferior direita |
| Ramo de trigo | Tradicionais | Canto superior esquerdo, parcialmente escondido |
| Tigela com vegetais | Como funciona | Canto inferior direito, em baixa intensidade |
| Sol | Contato | Canto inferior esquerdo, em tom sálvia |

No celular, os elementos botânicos são menores. O CSS-base dos ícones continua estático. A v0.1.14 acrescenta somente o bubble do broto na abertura, em um módulo independente; veja `ANIMACOES.md`. Os ícones têm origem no Lucide e ficam em `assets/decorations/`, com licença e instruções próprias. Não exigem biblioteca ou conexão durante o uso.

## Onde editar

| O que mudar | Arquivo |
| --- | --- |
| Cores, opacidades, tamanhos, posições e inclinações | `styles/base/variables.css`, variáveis `--decoration-*` |
| Regras do componente e comportamento por largura | `styles/components/decorations.css` |
| Desenhos dos seis elementos | SVGs em `assets/decorations/` |
| Sincronização dos desenhos com o HTML | `tools/build-decorations.mjs` |
| Testes do componente | `tests/decorations.mjs` |

Os estilos não foram misturados em `hero.css`, `products.css` ou `final-cta.css`. Aprovar a decoração não exige mover suas regras. As ondas suaves continuam no componente orgânico, separado destes ícones.

## Ligar ou desligar

O `body` vem assim:

```html
<body class="organic-backgrounds decorative-elements">
```

- Remover `decorative-elements`: retira apenas os seis ícones; mantém as curvas da v0.1.10.
- Remover `organic-backgrounds`: desliga apenas as ondas e manchas experimentais; os ícones permanecem.
- Remover ambas: volta ao visual-base v0.1.7, sem os dois efeitos.

Preserve outras classes locais. Não apague os imports CSS: as regras de ocultação padrão impedem espaço vazio dos SVGs. O número da versão não muda ao desligar o efeito.

Para ocultar somente um ícone sem alterar o HTML, coloque sua variável de opacidade em `0`. Ele continuará decorativo, sem receber cliques ou foco. O haltere é oculto por `display: none` abaixo de 60rem, independentemente da opacidade.

## Controles manuais

Os grupos são `--decoration-hero-*`, `--decoration-fitness-*`, `--decoration-final-*`, `--decoration-traditional-*`, `--decoration-steps-*` e `--decoration-contact-*`. Os três novos elementos ficam menores no celular e usam baixa intensidade; o haltere continua oculto abaixo de 60rem.

| Final da variável | Efeito |
| --- | --- |
| `color` | Cor referenciada na paleta do site |
| `opacity` | Transparência: 0 esconde, 1 exibe a cor completa |
| `size` | Largura e altura do ícone, sem alterar a seção |
| `right` / `left` | Distância da borda usada pelo elemento; negativo esconde uma parte para fora |
| `rotation` | Inclinação em graus, somente do ícone |
| `bottom` / `top` | Distância da borda inferior/superior, conforme o elemento |

Na abertura, `--decoration-hero-bottom` vale abaixo de 60rem. No desktop, `--decoration-hero-top-desktop` passa a controlar a posição. `--decoration-stroke-width` controla a espessura relativa do traço dos seis desenhos; a entrega usa `0.3` no sistema de coordenadas 24 × 24.

Exemplo para diminuir e esconder mais a folha final:

```css
--decoration-final-size: clamp(8rem, 15vw, 14rem);
--decoration-final-right: -4rem;
--decoration-final-opacity: 0.08;
```

O haltere usa creme sobre sálvia: sua opacidade de 0,6 não equivale ao contraste dos elementos claros sobre verde-escuro. Não aumente valores ou troque cores sem conferir a leitura; os testes calculam o contraste inclusive caso o traço encontre um texto.

## Broto sem a barrinha

O arquivo `sprout.svg` mantém os dois paths de folhas/caule. A linha horizontal `M5 21h14` foi removida do asset e do bloco gerado no HTML. O teste de regressão impede que ela volte sem ser detectada. Não é necessário regenerar o pacote entregue: as cópias já estão sincronizadas.

## Alterar os arquivos SVG

Depois de mudar um desenho em `assets/decorations/`, execute:

```bash
node tools/build-decorations.mjs
node tools/build-decorations.mjs --check
node tests/validate.mjs
```

O HTML já vem pronto: Node.js não é necessário para abrir o site. Ele serve apenas para manutenção e testes. O gerador preserva tudo fora dos comentários `DECORATION:...`, incluindo as ondas e os blocos `MENU`.

As cópias inline permitem alterar cores por CSS e abrir o HTML diretamente, sem `fetch`, máscara externa ou `<use href="arquivo.svg">`. O formato é intencionalmente restrito a paths e círculos locais. Os círculos usam atributos numéricos `cx`, `cy` e `r`, nessa ordem, raio positivo e limites dentro do viewBox 24 × 24; eventos, estilos e referências continuam proibidos. Para adotar outro tipo de SVG, revise o gerador e os testes; não aceite scripts ou referências de origem desconhecida.

## Prevenções

- Cada decoração tem uma moldura absoluta limitada à seção, com `overflow: hidden` e raio herdado.
- Somente essa moldura é recortada. Textos, foco, cards e as ondas externas da seção não são recortados.
- A rotação aplica-se somente ao SVG, sem mudar ancestrais da barra fixa.
- Camadas locais ficam atrás do conteúdo e não recebem cliques.
- SVGs e molduras usam `aria-hidden="true"`; os SVGs também usam `focusable="false"`, sem `tabindex` ou conteúdo interativo.
- Nenhum padding, margem ou tamanho de conteúdo foi alterado.
- Impressão e cores forçadas ocultam os ícones, sem reservar espaço.
- Ausência de JavaScript não esconde o cardápio nem impede os desenhos de carregar.
- Os testes de continuidade das ondas da v0.1.10 continuam ativos, separados dos paths dos ícones.

## Conferência

A v0.1.12 reuniu 117 grupos técnicos: 82 da base, 20 das ondas e 15 das decorações. A v0.1.13 acrescentou 20 para os controles de movimento, totalizando 137; a v0.1.14 acrescenta 31 para a abertura, totalizando 168, sem alterar os desenhos. Há verificações específicas para a remoção do solo do broto, o círculo do sol e a alternância de bordas. Eles conferem geração, rejeição de entradas inválidas, origem/licença, isolamento CSS, acessibilidade, contraste e integração.

A revisão visual em navegador não foi executada nesta entrega. Confira em 320, 375, 430, 768, 960, 1024 e 1440px; zoom de 125% e 200%; texto ampliado; impressão; cores forçadas; efeito ligado/desligado. Os ícones devem ficar discretos e parcialmente escondidos, sem rolagem horizontal, sem competir com os preços e sem recolocar pontas nas ondas.

Se quiser mais presença depois dessa comparação, ajuste primeiro a posição ou o tamanho em pequenos passos. Não aumente tudo simultaneamente.
