# Sistema visual — v0.1.18

Nesta versão, broto sem linha de solo, haltere, folha, ramo de trigo, tigela com vegetais e sol complementam as curvas da v0.1.10. Os novos elementos alternam lados para não concentrar a decoração na borda direita. Os ícones usam traços finos, cores da mesma paleta e transparência independente; o haltere só aparece a partir de 60rem. Seus estilos estão em `decorations.css`, com controles `--decoration-*`. Veja `DECORACOES.md` para ajustar presença, posição ou desligar os ícones sem mexer nas ondas.

## Intenção

Uma identidade natural, moderna e espaçada, com contraste entre seções. A sensação de respiro deve vir das distâncias e da hierarquia, não de fontes excessivamente grandes.

## Paleta

As cores literais ficam em `styles/base/variables.css`. Não repita códigos hexadecimais em arquivos de seção.

| Variável | Cor | Aplicação |
| --- | --- | --- |
| `--color-primary` | `#153b2b` | Verde-escuro: hero, contato e ações sobre fundos claros |
| `--color-primary-light` | `#2b5b43` | Superfícies sobre verde-escuro e hover |
| `--color-background` | `#f7f2e8` | Fundo creme |
| `--color-surface` | `#fffcf7` | Superfícies claras e galeria |
| `--color-sage` | `#dce7d8` | Fitness e apoio sobre fundos escuros |
| `--color-accent-soft` | `#f4e8b9` | Como funciona, futuras promoções e ações sobre verde |
| `--color-accent` | `#e3c56b` | Destaques controlados e hover |
| `--color-text` | `#17211b` | Texto principal sobre fundos claros |
| `--color-text-muted` | `#59665d` | Texto secundário sobre fundos claros |
| `--color-text-light` | `#f9f6ed` | Texto sobre fundos escuros |

## Temas de seção

| Classe | Uso atual |
| --- | --- |
| `.theme--paper` | Cabeçalho, Instagram e barra mobile |
| `.theme--forest` | Hero, contato, chamada final e rodapé |
| `.theme--cream` | Tradicionais |
| `.theme--sage` | Fitness |
| `.theme--warm` | Como funciona |

Essas classes não ativam um modo escuro alternável: elas definem os contrastes da página clara. Os componentes herdam seus papéis de cor. O botão principal muda automaticamente para amarelo suave sobre verde-escuro.

## Tipografia

- Sora: títulos, peso 600, com caixa alta nos títulos principais.
- Manrope: corpo em peso 400, botões e rótulos em 700.
- Texto corrido: 1rem, sem caixa alta forçada, entrelinha 1,75.
- Texto secundário: 0,875rem; rótulos curtos: 0,8125rem.
- Hero: `clamp(2rem, 1.3rem + 2.8vw, 3.75rem)`.
- Títulos de seção: `clamp(1.35rem, 1rem + 1.2vw, 2.1rem)`.
- Espaçamento entre letras: 0,025em nos títulos e 0,1em nos rótulos.
- Parágrafos: largura máxima de 60ch.
- `.numeric`: algarismos tabulares para os preços; não altera o conteúdo.

Os preços por marmita usam 1rem, sem utilizar o tamanho reduzido dos rótulos. Títulos dos cards: 1,5rem; totais regulares: 1,25rem; total do combo destacado: 1,625rem. Todos são definidos em variáveis.

## Espaços e superfícies

- Contêiner principal: máximo de 70rem.
- Margens laterais fluidas: de 1rem a 3rem.
- Espaçamento vertical de seções: de 3,5rem a 6rem.
- Distância entre conteúdos: de 1,25rem a 1,75rem.
- Botões: altura mínima de 3rem, cantos arredondados e texto curto.
- `.surface`: preenchimento, borda, raio e sombra discretos reutilizáveis.

Altere `--space-section` para aproximar ou afastar seções. Altere `--font-size-title` apenas quando quiser mudar a tipografia. São controles independentes.

## Interação e verificação

Botões têm estados de hover, clique e foco por teclado; as transições de cor continuam com 180 ms. Títulos fora do hero mantêm a entrada de 480 ms, 0,5rem e opacidade de 0,9 a 1. A abertura usa quatro grupos com intervalo de 100 ms, 640 ms por grupo e total de 940 ms. O broto faz bubble 0 → 1,20 → 1; foto, borda e contorno animam juntos, e a legenda fica parada. `config.motion` controla intro, cards, contact, fork, prices, reveal e rolagem separadamente. A v0.1.17 acrescenta o garfinho em camada própria no card tradicional de 400 g; a v0.1.18 conta apenas valores monetários completos e restaura o texto original. Movimento reduzido, cores forçadas e impressão prevalecem. Veja `ANIMACOES.md`.

O verificador calcula a razão de contraste das 16 combinações textuais previstas e exige pelo menos 4,5:1. Isso verifica a paleta, não certifica a acessibilidade de toda a página: hierarquia visual, zoom, navegação e renderização ainda precisam da revisão em navegador.

## Cabeçalho e abertura

- Cabeçalho claro: logo oficial otimizado à esquerda, os três atalhos e Contato destacado.
- Até 60rem, atalhos abaixo da marca e contato; o cabeçalho permite linhas extras com texto ampliado, sem esconder o menu.
- Hero verde com texto curto, duas ações e imagem em moldura sálvia.
- Texto antes da foto no celular; duas colunas a partir de 60rem.
- `--radius-hero-image` controla a moldura; `--radius-hero-section` controla o canto da seção no visual-base. Com o teste orgânico ativo, a transição usa os controles descritos abaixo.
- A imagem ocupa uma moldura 4:3 no celular e quadrada no desktop, sem deformação.
- O contorno é um detalhe abstrato; não contém informação nem intercepta cliques. No visual-base é inclinado; no teste orgânico usa um raio assimétrico sem rotação.
- A fotografia é ilustrativa e a legenda permanece legível, fora da imagem.

Não há imagem de fundo atrás dos textos nem altura mínima de uma tela inteira. O título mantém a escala da Etapa 2. A entrada leve não exige esperar para ler ou clicar.

## Teste de fundos orgânicos

O `body` vem com a classe `organic-backgrounds`. A v0.1.10 usa duas formas separadas no hero, um contorno assimétrico ao redor da foto e três desenhos de transição em SVG: onda suave na saída da abertura, curva inclinada na entrada do fitness e outra onda na saída. Os paths contínuos substituem as uniões de elipses que produziam pontas. O fitness continua sálvia com cards claros; não virou uma seção verde-escura. Os temas, a escala de fontes e as medidas dos conteúdos foram preservados.

As cores reutilizam a paleta. A curva de saída do hero acompanha a seção seguinte: amarelo suave com promoção visível; creme com promoção oculta ou removida. Uma faixa sálvia discreta acompanha a curva superior do fitness. Nada disso adiciona texto ou imagem.

As regras permanecem em `styles/components/organic-backgrounds.css`, com controles `--organic-*` em `variables.css`. Apenas a geometria dos paths fica nos SVGs decorativos do HTML. Remover somente `organic-backgrounds` restaura os fundos-base. Os ícones decorativos são independentes, controlados por `decorative-elements`; retire ambas para voltar ao visual-base completo. A impressão e o modo de cores forçadas usam a base, sem as novas formas. Ondas e manchas permanecem estáticas; a animação do broto é separada, em `hero-intro.css`.

Os testes calculam contraste e espaço disponível, conferem separação das manchas e verificam tangentes e segundas derivadas contínuas nos paths. Também rejeitam exemplos com pontas ou fechamento inválido. A comparação visual ligada/desligada ainda está pendente. Veja `FUNDOS-ORGANICOS.md` antes de alterar os paths, a altura das curvas, o espaçamento ou a ordem das seções.

## Cards e acréscimos

- Mesmo componente para tradicionais e fitness, sobre os fundos creme e sálvia existentes.
- Superfície clara, borda discreta e separação entre unidade e combos.
- Combo de 10 com fundo sálvia, total maior e etiqueta verde “Mais pedido”.
- Os outros combos continuam visíveis, sem seleção ou expansão.
- Aviso de acréscimos em amarelo suave junto às duas categorias; não é uma promoção.
- Cards com largura confortável, empilhados no celular e lado a lado em telas amplas.
- Textos e preços se reorganizam em telas estreitas; não há altura fixa ou corte de conteúdo.

## Limites da etapa

Todas as seções, a barra mobile e os efeitos leves estão implementados, ainda com fotos ilustrativas e dados pendentes de confirmação. A Etapa 8 preparou a base para conferência; as versões v0.1.8 e v0.1.9 acrescentaram os experimentos decorativos e a v0.1.10 corrige as pontas de suas curvas. Não foram inventados preços promocionais nem criados carrinho ou montagem de pedido. A revisão visual continua pendente; veja `TESTES.md`. O histórico da conferência anterior está em `RELATORIO-ETAPA-8.md`.

## Como funciona e promoção

- O “Como funciona” mantém o fundo amarelo suave, com três números em círculos verdes discretos.
- Cada passo tem título curto em Sora e descrição em Manrope, sem caixas pesadas ou informações excessivas.
- No celular, números e textos ficam em uma sequência vertical; a partir de 60rem, os três passos ficam lado a lado.
- A promoção é uma faixa independente acima das tradicionais, não uma alteração nos cards.
- Título compacto, descrição em tamanho de corpo e botão de condições; no celular, o botão fica abaixo do texto.
- A faixa ocupa espaço somente quando ativada e preenchida. Não utiliza sobreposição, pop-up, temporizador ou animação de entrada.
- Todos os tons e medidas reutilizam as variáveis existentes. Nenhuma cor literal nova foi adicionada aos componentes.

## Contato, galeria e fechamento

- Contato verde-escuro com canais à esquerda e painel verde de apoio para recebimento à direita no desktop; empilhado no celular.
- Telefone, Instagram, regiões e formas de recebimento escritos por extenso; nenhuma informação depende apenas de um ícone.
- Galeria sobre fundo claro, com uma foto maior e duas menores. No celular, a principal vem acima das duas menores, sem rolagem lateral.
- Todas as fotos mantêm a proporção por meio de `object-fit: cover`; a legenda ilustrativa fica fora da imagem.
- Chamada final verde-escuro com canto superior curvo e título na escala normal de seção.
- Rodapé no mesmo verde, separado por uma borda suave; marca, canais e regiões legíveis.
- Os detalhes principais do contato usam tamanho de corpo. Apenas avisos, legendas e créditos têm tamanho secundário.
- Não foram introduzidas cores novas ou parallax. Somente os títulos dessas seções recebem a entrada leve.

## Barra mobile e foco

- Fundo claro e botão verde, usando os mesmos papéis de cor da página.
- Barra fixa apenas em larguras menores que 48rem e com aprimoramento JavaScript ativo.
- Em telas com até 24rem de altura, a barra volta ao fluxo, preservando área de leitura.
- Espaço inferior reservado pela altura real da barra, incluindo a área segura do dispositivo.
- Margens laterais consideram recortes da tela por `--page-gutter-safe`.
- Links de telefone, Instagram e crédito têm altura mínima de toque de 3rem.
- Seções recebem foco por âncora com contorno interno, sem tabulação artificial entre blocos.
- Nenhuma regra impede zoom ou seleção de textos e preços.

Para ajustar os efeitos, altere `--duration-reveal` e `--reveal-distance` em `variables.css`. Não adicione `opacity: 0` ao estado inicial dos conteúdos. Detalhes em `MOBILE-ACESSIBILIDADE.md`.
