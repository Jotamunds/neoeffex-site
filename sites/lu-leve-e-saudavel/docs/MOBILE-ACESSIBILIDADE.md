# Mobile, acessibilidade e movimento — v0.1.18

## Barra de pedido

A marcação está no fim do `index.html`, depois do rodapé. O botão reutiliza o comportamento de `scripts/whatsapp.js` e não envia mensagens automaticamente.

| Situação | Comportamento |
| --- | --- |
| Largura menor que 48rem, JavaScript ativo e altura acima de 24rem | Barra fixa na parte inferior, com espaço reservado |
| Mesma largura, mas altura de até 24rem | Barra no fluxo após o rodapé, liberando espaço de leitura |
| Sem JavaScript ou sem API para medir estilos | Barra no fluxo, com link nativo para contato |
| Largura a partir de 48rem | Barra oculta; botões das seções continuam disponíveis |
| Impressão | Barra oculta e sem reserva de espaço |

Com tamanho de fonte padrão, 48rem equivalem a 768px e 24rem a 384px. O uso de `rem` permite acompanhar preferências de fonte. Não há detecção por modelo de aparelho ou user agent.

Sem telefone configurado, o texto é “Fale com a Lu”. Com telefone válido, é “Pedir pelo WhatsApp”. Não foi adicionado um número fictício para demonstração.

### Como o espaço é reservado

`scripts/mobile-order.js` mede a altura completa da barra e a registra em `--mobile-order-height`. `ResizeObserver` acompanha mudanças do componente; eventos de janela e o término do carregamento de fontes também atualizam a medida. Inicializar novamente não duplica observadores.

O CSS usa essa medida no espaço inferior da página e no afastamento de rolagem. A medição inclui a área segura inferior e eventuais quebras de texto. Quando a barra está estática ou oculta, a reserva é zero. Não aplique `transform` ao `body`: isso pode mudar o referencial de posicionamento de elementos fixos.

A posição e os breakpoints ficam somente em `styles/components/mobile-order.css`. O JavaScript não decide se a tela é mobile e não define cores. Se retirar a barra do projeto, remova também seu import de CSS, script e inicialização.

## Layout e leitura

- O cabeçalho permite quebra de linhas em telas estreitas e com fonte ampliada.
- Os três atalhos permanecem visíveis, sem menu que dependa de JavaScript.
- A abertura continua com texto antes da foto; os preços continuam empilhados no celular.
- Margens laterais e superiores consideram recortes da tela; a barra considera também a área segura inferior.
- Links de telefone, Instagram e crédito têm área de toque mínima de 3rem de altura.
- Zoom, seleção de texto e rolagem não são bloqueados.

## Teclado e âncoras

Os IDs das seções foram preservados. Cada destino usa `tabindex="-1"` para poder receber foco quando acessado por âncora, sem adicionar todas as seções à sequência normal de Tab. O link “Pular para o conteúdo” continua apontando para o conteúdo principal.

`scroll-padding` e `scroll-margin` afastam destinos e controles da barra. O foco mantém contorno visível; nas seções de largura total, o contorno fica para dentro para não ser cortado. Não há `preventDefault`, controle manual de histórico ou `tabindex` positivo.

## Movimento discreto

`styles/base/motion.css` define a entrada dos títulos fora do hero. `scripts/animations.js` coordena preferências e limpeza a partir de `config.motion`. A abertura usa `scripts/hero-intro.js` e `styles/components/hero-intro.css`.

- Os títulos fora do hero recebem uma entrada de 480ms com deslocamento de 0,5rem e opacidade inicial 0,9.
- O hero entra em grupos, em 940ms no total: título, apoio, botões, foto/broto. Texto mantém opacidade mínima 0,97; somente o broto decorativo parte de escala zero.
- Foto, borda e contorno crescem juntos na v0.1.14.2; legenda parada, recorte somente da imagem, sem escala dupla. Os botões não mudam a área clicável. Nenhum texto fica escondido aguardando JavaScript ou rolagem.
- Na v0.1.14.1, somente a superfície interna dos dois botões iniciais recebe bubble 0,85 → 1,06 → 1. Os links, o foco e a área de toque ficam fixos. Há respiro para o pico de escala, sem recortar conteúdo ou alterar o componente global de botões.
- Valores em reais fazem uma contagem curta uma vez; quantidades, pesos, telefone e textos permanecem estáticos.
- Interagir por foco interrompe o efeito do elemento.
- A intro também para em clique, toque, teclado, rolagem, resize, impressão e saída. Não inicia após pintura/carga tardia, em outra âncora ou posição restaurada.
- Sem as APIs necessárias, os efeitos são omitidos e tudo continua visível.
- Reduzir movimento ou usar cores forçadas desativa entradas e rolagem suave. Mudanças durante a sessão são observadas por eventos modernos ou legados, quando disponíveis; o CSS também aplica essa proteção.
- Ocultar a aba cancela entradas; retornar não repete as que já aconteceram.
- Não há retenção de transformações depois do fim, mesmo sem evento de término.
- A navegação suave é CSS nativo; não há interceptação dos links nem timers.

Na etapa 4, o pulinho anima só a superfície do botão inicial, sem mover foco ou atrasar o WhatsApp. A área clicável cobre o pico de 6px; toque e Enter mantêm comportamento nativo. Movimento reduzido desativa o salto, não os links. A mudança para o aplicativo pode interromper a percepção do efeito.

Na etapa 3, os cards mudam somente sombra e cor de borda. A interação exige hover e ponteiro preciso primários; não adiciona foco, clique, escala ou conteúdo oculto. Movimento reduzido, cores forçadas e impressão mantêm a superfície-base. O destaque usa `--card-hover-*`; valide também dispositivos híbridos com mouse e toque.

Ajuste `--duration-reveal`, `--reveal-distance`, `--reveal-start-opacity`, `--ease-reveal`, os valores `--intro-*` e `--fork-highlight-*` em `styles/base/variables.css`. Para retirar a entrada de um elemento fora do hero, remova seu `data-reveal`. Para desligar tudo, use `motion.enabled: false` em `scripts/config.js`; para controlar separadamente, use `intro`, `cards`, `contact`, `fork`, `prices`, `reveal` e `smoothScroll`. Sem JavaScript, todos os aprimoramentos ficam desativados e tudo permanece visível. Veja `ANIMACOES.md`.

## Verificação

Execute `node tests/validate.mjs`. São 216 grupos, incluindo quatro do garfinho e seis da contagem, além de toda a base anterior. Os testes de mobile, publicação, fundos, ícones e controles de movimento permanecem ativos.

Os testes simulam dimensões, redimensionamento, ausência de APIs e mudanças de preferência. Também conferem regras CSS e estrutura HTML. Eles não executam um navegador nem confirmam o resultado em telas reais.

A revisão em navegador não pôde ser executada na Etapa 8 e permanece pendente nesta versão: testar 320, 375, 430, 767, 768, 960, 1024 e 1440px; zoom de 200%; texto ampliado; teclado; movimento reduzido; impressão; retrato/paisagem e áreas seguras em dispositivo real. O roteiro atual está em `TESTES.md`; `RELATORIO-ETAPA-8.md` mantém os resultados históricos da base anterior.

## Novos SVGs decorativos

A página contém seis ícones locais e cinco ondas. Os ícones têm tamanho limitado por `clamp()` e ficam menores no celular; o haltere continua oculto abaixo de 60rem. Apenas a moldura decorativa recebe recorte, sem bloquear foco ou cliques. Os novos elementos também são ocultos na impressão e em cores forçadas. Confira o resultado nas duas bordas da tela; veja `DECORACOES.md`.

## Prevenções dos fundos orgânicos

As novas formas são estáticas e não recebem cliques. Nenhum texto, link ou preço foi incluído em pseudo-elementos ou SVGs; eles são apenas decoração. Os SVGs têm `aria-hidden="true"`, `focusable="false"`, não têm `tabindex` e permanecem ocultos sem a classe do efeito. A classe de ativação não altera os scripts, a posição da barra ou a reserva inferior. Não há recorte nos contêineres de conteúdo nem transformação de um ancestral da barra. O recorte novo se limita ao viewport de cada SVG decorativo, sem filhos interativos.

As curvas usam espaços já existentes. O cálculo de dimensões considera diferentes larguras e tamanhos de fonte, mas a verificação de foco, zoom e ausência de sobreposição precisa ser repetida no navegador com o efeito ligado e desligado. As regras que exibem o efeito atuam apenas em tela sem cores forçadas: impressão e alto contraste mantêm o visual-base. A regra de ocultação padrão dos SVGs continua ativa nesses modos, sem reservar espaço. Veja `FUNDOS-ORGANICOS.md`.
