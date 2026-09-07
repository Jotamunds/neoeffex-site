# /modelos — Plano de desenvolvimento em 4 etapas
## Neoeffex
### Direção visual: menos texto, mais demonstração, partículas como fio condutor da experiência
### Modelo recomendado no Antigravity: Gemini 3.1 Pro High ou Gemini 3.8 Flash High

> Revisão das instruções: 07/09/2026. Incorpora riscos, correções preventivas e critérios de teste às quatro etapas originais. Este documento é um plano de implementação; não indica que as etapas já foram executadas.

---

# Visão geral

A página `/modelos` deve evoluir para uma experiência mais autoral, limpa e demonstrativa.

A principal mudança é abandonar a lógica de “hero com muito texto + objeto visual preso ao lado” e adotar uma experiência em que o próprio sistema de partículas participa da narrativa da página.

A nova headline principal será:

> **SEU SITE**  
> **PODE IR ALÉM**

A página deve usar menos texto e mais demonstração visual.

O sistema do “N” em partículas deve deixar de existir dentro de um quadrado, retângulo ou bloco limitado. As partículas devem poder ocupar uma área ampla do hero e continuar aparecendo em menor quantidade ao longo da página, criando continuidade visual.

O comportamento desejado é:

```text
entrada
↓
partículas aparecem junto com o hero
↓
headline entra
↓
partículas ficam atrás do texto
↓
scroll
↓
N começa a se formar
↓
N fica completo
↓
scroll continua
↓
N começa a se desfazer
↓
parte das partículas permanece no fundo da página
↓
página continua com demonstrações e projetos
```

Ao voltar para cima, esse comportamento deve acontecer ao contrário.

---

# Escopo real e preparação comum às quatro etapas

## Base da análise

O diagnóstico que originou esta revisão foi feito por leitura do código da branch `main`, no commit `57f42b97349fa8c789c09203aa0b1029233231ff`, cuja mensagem anuncia `/modelos v0.3.1`. Não foi uma medição de desempenho nem um teste visual em navegador.

Antes de implementar, conferir o checkout atual e o `git diff`: os problemas descritos podem já ter sido corrigidos em alterações posteriores. Preservar essas correções e evitar implementações duplicadas.

## Arquivos e rotas

Na base analisada, `/modelos/index.html` apenas redireciona para `/modelos/preview-vitrine/`. A vitrine está nesta segunda pasta.

| Responsabilidade | Arquivo ou pasta existente |
| --- | --- |
| Redirecionamento de entrada | `modelos/index.html` |
| Estrutura da vitrine | `modelos/preview-vitrine/index.html` |
| Layout, tipografia, cores e camadas | `modelos/preview-vitrine/assets/css/modelos-preview.css` |
| Hero, Lenis, GSAP, temas e previews | `modelos/preview-vitrine/assets/js/modelos-preview.js` |
| Cena, câmera, ciclo de renderização e scroll do N | `modelos/preview-vitrine/assets/js/three/scene.js` |
| Geometria e material das partículas | `modelos/preview-vitrine/assets/js/three/particle-logo.js` |
| Amostragem do SVG | `modelos/preview-vitrine/assets/js/three/particle-source.js` |
| Interpolação, movimento e aparência dos pontos | `modelos/preview-vitrine/assets/js/three/shaders.js` |
| Marca usada como origem da geometria | `img/logos/neoeffex-n-logo-white.svg` |
| Versão e histórico da vitrine | `modelos/preview-vitrine/VERSION` e `modelos/preview-vitrine/CHANGELOG.md` |

Trabalhar nos arquivos da vitrine. Não mover a implementação para `/modelos/index.html` por conveniência. Se uma mudança de rota for necessária e fizer parte do escopo autorizado, revisar todos os caminhos de scripts, vídeos, imagens, SVG, links relativos, âncoras e navegação de retorno.

As quatro prévias desta vitrine são vídeos com posters. Preservar essa estrutura e os links para os projetos. As incorporações existentes na página inicial também devem ser preservadas.

## Decisões técnicas antes da etapa 1

Esta preparação faz parte da etapa 1; não cria uma quinta etapa.

1. Definir um único renderer WebGL principal e uma camada de canvas dimensionada pela viewport, reutilizável do hero ao rodapé.
2. Posicionar essa camada fora dos ancestrais que recebem `transform` de parallax. Definir a ordem entre fundo, partículas, conteúdo e navegação.
3. Usar a mesma geometria de partículas desde a etapa 1. A etapa 2 refina a entrada, a etapa 3 acrescenta a formação por scroll e a etapa 4 conclui a persistência e as demonstrações.
4. Separar os controles de entrada, formação, visibilidade ambiente e movimento contínuo. A entrada pode controlar opacidade; a forma deve depender do scroll.
5. Planejar posições estáveis para hero disperso, N formado e fundo ambiente. Reutilizar a correspondência entre os pontos ao descer e subir.
6. Definir os intervalos de formação, permanência do N completo e dispersão, com ajustes para desktop e mobile. Não usar a altura de toda a página como única referência: acrescentar projetos não deve mudar a duração da formação.
7. Manter o conteúdo HTML utilizável quando a cena 3D ou alguma dependência falhar.

Não criar um sistema temporário de partículas no hero para substituí-lo depois. Reaproveitar e ajustar o sistema existente.

---

# Direção visual geral

A identidade principal deve ser azul.

O laranja pode continuar apenas como detalhe pontual, especialmente em algum card, pequena interação ou microdestaque.

O hero, o sistema de partículas, halos, luzes, backgrounds e sensação geral da página devem ser predominantemente:

```text
azul escuro
azul Neoeffex
azul vivo
azul claro
quase branco
```

Evitar que o laranja seja a cor dominante da página.

Também evitar o estilo genérico que muitas IAs criam:

```text
cards com borda fina
caixas arredondadas em excesso
pílulas em todos os elementos
glassmorphism genérico
contornos apenas para separar conteúdo
```

A separação entre seções deve acontecer mais por:

```text
espaço
contraste
movimento
escala
luz
fundo
tipografia
imagem
vídeo
```

---

# Etapa 1 — Novo hero, nova tipografia e menos texto

## Objetivo

Reestruturar o hero para ficar mais limpo, menos pesado e mais sofisticado.

A headline principal deve mudar para:

```text
SEU SITE
PODE IR ALÉM
```

## Tipografia

A headline deve:

- estar em maiúsculas;
- ser menor que a atual;
- usar uma fonte visualmente mais fina;
- ainda ter presença;
- evitar peso 800/900;
- preferir 600 ou 700;
- ter line-height controlado;
- ter bastante espaço ao redor;
- não parecer um bloco muito grosso.

Sugestões de famílias:

```text
Inter
Manrope
Sora
Plus Jakarta Sans
```

O título deve parecer premium e limpo.

Não usar uma tipografia brutalista pesada.

## Texto de apoio

Reduzir o texto do hero.

Não usar parágrafo longo.

Preferir algo curto, por exemplo:

```text
Design, tecnologia e movimento
para transformar presença em experiência.
```

ou outro texto curto de até duas linhas.

## Botões

Manter no máximo dois CTAs.

Exemplo:

```text
Explorar projetos
Falar com especialista
```

Evitar botões grandes demais.

## Layout

O hero deve ter muito espaço vazio.

A estrutura pode ser algo como:

```text
__________________________________________________

        SEU SITE
        PODE IR ALÉM

        texto de apoio curto

        [ CTA ] [ CTA ]

__________________________________________________
```

O hero não deve parecer lotado.

## Partículas nesta etapa

As partículas já devem existir no hero, mas em menor quantidade.

Elas devem aparecer como fundo da cena.

Não formar o N ainda nesta etapa.

Objetivo:

```text
partículas presentes
mas ainda dispersas
```

## Critérios de aceitação

- headline trocada;
- headline menor;
- tipografia visualmente mais fina;
- menos texto;
- mais espaço negativo;
- menos bordas genéricas;
- partículas visíveis no fundo;
- hero mais limpo e premium.

## Riscos e instruções obrigatórias — etapa 1

| Risco identificado | Instrução de implementação |
| --- | --- |
| O título continuar pesado mesmo com outra fonte. O CSS analisado usa peso `900`, tamanho elevado e espaçamento fechado. | Ajustar família, peso, tamanho, espaçamento entre letras e altura das linhas em conjunto. Começar a avaliação pelo peso `600`; não manter regras antigas sobrescrevendo a nova tipografia. |
| A frase em maiúsculas quebrar em três linhas no celular. | Testar a frase completa em 320, 360, 390 e 430 px. Usar tamanho fluido, margens adequadas e duas linhas intencionais na apresentação padrão. Em zoom ampliado, permitir reorganização sem cortar conteúdo ou desativar zoom. |
| A troca tardia de fonte alterar a composição e os marcos da rolagem. | Carregar os pesos efetivamente usados, escolher uma fonte de reserva compatível e recalcular medidas relevantes após o carregamento das fontes. |
| O hero iniciar laranja ou voltar com a cor de outro projeto. O HTML inicia com `data-active-theme="hamburgueria"` e o observer altera o tema global. | Manter azul como identidade global. Restringir as cores dos segmentos aos respectivos cards e detalhes locais; não recolorir hero, partículas, halo ou fundo global ao visualizar um projeto. |
| Criar partículas provisórias que precisem ser substituídas na etapa 2. | Instalar a estrutura definitiva da camada de partículas nesta etapa, usando o sistema existente. Mostrar apenas a composição dispersa e impedir a formação automática do N. |
| Os textos novos preservarem um CTA com rota inexistente. Há links para `/contato`, mas o contato encontrado está na home. | Confirmar o destino atual e usar `/#contato` ou outro endereço válido. Conferir também a âncora de explorar projetos e os quatro links de abertura das landings. |

Não remover informação essencial de navegação ao reduzir texto. Preservar um único título principal semântico, nomes acessíveis dos links e área de toque adequada dos botões.

## Verificação do checkpoint — etapa 1

- [ ] Headline correta em duas linhas na apresentação padrão de desktop e mobile.
- [ ] Peso, tamanho e espaçamento avaliados em conjunto; nenhuma regra antiga mantém o peso `900` no hero.
- [ ] Azul permanece dominante ao abrir a página, percorrer os cards e voltar ao topo.
- [ ] Partículas dispersas pertencem à cena definitiva e o N não se forma automaticamente.
- [ ] CTAs e links dos projetos abrem os destinos corretos.
- [ ] Fonte de reserva e zoom ampliado não escondem texto ou botões.

---

# Etapa 2 — Entrada sincronizada do hero com partículas

## Objetivo

Fazer o sistema de partículas participar da entrada da página.

Quando o usuário entrar:

```text
hero aparece
+
headline entra
+
partículas surgem junto
```

As partículas devem aparecer atrás do texto.

## Canvas

O canvas não pode ficar preso em:

```text
quadrado
retângulo
bloco lateral
container pequeno
```

O canvas deve poder ocupar uma área ampla do hero.

Todo canvas possui uma superfície retangular. A restrição visual significa não mostrar uma caixa, bordas ou recortes que prendam a composição do N a um bloco pequeno.

Para a continuidade pedida neste plano, preferir uma camada única fixa à viewport:

```css
position: fixed;
inset: 0;
pointer-events: none;
```

Esse exemplo define apenas posicionamento e interação; a ordem das camadas precisa ser resolvida no layout real. `position: absolute; inset: 0` só preenche o ancestral de referência e, sozinho, não garante persistência abaixo do hero.

O canvas deve cobrir a viewport e permitir composição ampla no hero. Não usar a altura total do documento como altura do buffer de renderização.

## Comportamento

Ao entrar:

```text
partículas quase invisíveis
↓
partículas aparecem
↓
headline entra
↓
partículas continuam movimentando lentamente
```

As partículas não devem cobrir a headline.

Criar uma zona de baixa densidade próxima à copy.

## Distribuição

A maior concentração pode ficar mais próxima da região em que o N será formado depois.

Mas algumas partículas devem existir espalhadas pelo restante do hero.

## Movimento

As partículas devem ter:

- movimento lento;
- pequenas variações de profundidade;
- brilho discreto;
- posições levemente dinâmicas.

Não criar caos.

## Cor

Predominância:

```text
azul escuro
azul vivo
azul claro
```

Pouquíssimos pontos quase brancos.

Laranja apenas como detalhe raro, se for mantido.

## Critérios de aceitação

- partículas entram junto com o hero;
- canvas amplo;
- nenhuma caixa visível;
- partículas atrás da copy;
- copy legível;
- movimento leve;
- identidade azul dominante.

## Riscos e instruções obrigatórias — etapa 2

| Risco identificado | Instrução de implementação |
| --- | --- |
| A headline entrar antes de as partículas estarem prontas. O SVG é carregado de forma assíncrona e a timeline do hero começa separadamente. | Expor um estado de cena pronta e coordenar a entrada visual com ele. Usar um limite de espera definido; se o efeito não ficar pronto, revelar o conteúdo e usar a alternativa visual. Não deixar o HTML aguardando indefinidamente. |
| O N se formar durante a entrada. `setupParticles()` cria uma animação de `2,2 s` que leva `uProgress` até `1`. | Remover ou substituir esse tween de formação. A entrada controla visibilidade; o scroll será o responsável pela forma na etapa 3. |
| O canvas continuar confinado. O CSS atual tem `max-width: 700px`, proporção `4 / 3` e uma seção com `overflow: hidden`. | Revisar o container e seus ancestrais. Retirar os limites incompatíveis com a camada global e manter somente recortes que façam parte do layout do conteúdo. |
| As partículas dispersas ficarem paradas. O shader atual multiplica o movimento interno por `uProgress`, zerando-o no estado disperso. | Dar ao movimento ambiente amplitude própria, pequena e independente da formação. Respeitar a preferência por movimento reduzido. |
| Pontos brilhantes prejudicarem a headline ou a camada decorativa bloquear cliques. | Atualizar a zona de baixa densidade com a posição real da copy em cada tamanho de tela. Aplicar `pointer-events: none` à camada decorativa inteira e mantê-la fora da navegação por teclado. |
| Falha do SVG ou de uma biblioteca deixar a área vazia. O erro assíncrono atual apenas é registrado. | Tratar falhas na preparação da geometria, criação do renderer e carregamento das dependências. Manter uma alternativa estática disponível no HTML/CSS; ocultá-la somente após o primeiro quadro válido. |

Sincronizar o conteúdo e a cena por um controlador explícito de entrada. Não criar dois controladores escrevendo simultaneamente na mesma propriedade. Limitar os seletores da entrada ao hero para não animar badges de outras seções no carregamento.

No modo de movimento reduzido, renderizar a composição estática somente depois de a geometria estar pronta. Não depender de um evento posterior de scroll para fazer o primeiro desenho.

## Verificação do checkpoint — etapa 2

- [ ] Texto e partículas aparecem de forma coordenada, sem formação prematura do N.
- [ ] Rolagem iniciada durante a entrada não causa saltos nem desaparecimento da copy.
- [ ] Container amplo, sem caixa visível e sem recortes inesperados.
- [ ] Copy legível e CTAs utilizáveis por mouse, toque e teclado.
- [ ] Rede lenta, falha do SVG e ausência de bibliotecas mantêm o conteúdo acessível.
- [ ] Preferência por movimento reduzido mostra a composição estática após o carregamento, sem exigir rolagem.

---

# Etapa 3 — Formação e dispersão do N com o scroll

## Objetivo

Transformar o N em uma peça narrativa da rolagem.

Quando o usuário começa a rolar:

```text
partículas dispersas
↓
começam a convergir
↓
N se forma
```

O N deve ficar claramente reconhecível.

Depois:

```text
scroll continua
↓
N começa a se desfazer
↓
algumas partículas saem da forma
↓
parte delas continua na página
```

## Scroll reversível

Ao voltar para cima:

```text
partículas dispersas
↓
voltam para o N
↓
N se forma novamente
↓
continua subindo
↓
N volta ao estado disperso do hero
```

Esse comportamento deve ser reversível.

Não fazer animação apenas “de ida”.

## Implementação

Usar:

```text
Three.js
THREE.Points
BufferGeometry
ShaderMaterial
GSAP
ScrollTrigger
Lenis
```

Evitar criar milhares de tweens.

Preferir uniforms como:

```text
uProgress
uScroll
uTime
```

## Formação

Usar:

```text
startPosition
targetPosition
```

O N deve ser montado por interpolação.

## Partículas

O N deve continuar usando partículas pequenas.

Evitar:

```text
bolas grandes
glow exagerado
branco estourado
```

## Movimento interno

Mesmo quando o N estiver formado, ele não deve ficar congelado.

Adicionar:

- micro rotação;
- micro movimento interno;
- pequenas mudanças de profundidade;
- highlight lento;
- deslocamento suave de algumas partículas.

O N deve parecer vivo.

## Área do N

O N deve ter bastante espaço.

Ele pode ocupar uma área grande da tela.

Regras:

```text
não cortar
não prender em container pequeno
não encostar nas bordas
```

O enquadramento deve seguir a intenção de `contain`: mostrar o N inteiro com margem. Isso precisa ser calculado na câmera e na escala da geometria; aplicar `object-fit: contain` ao canvas não enquadra os objetos do Three.js.

## Critérios de aceitação

- N se forma com scroll;
- N se desfaz com scroll;
- processo reversível;
- partículas persistem depois;
- N não fica preso em quadrado;
- N não é cortado;
- animação fluida;
- sem explosões;
- sem excesso de glow.

## Riscos e instruções obrigatórias — etapa 3

| Risco identificado | Instrução de implementação |
| --- | --- |
| Entrada e scroll disputarem `uProgress`. | Usar um único controlador para o progresso da forma e manter a entrada em um controle separado de visibilidade. Não permitir que uma timeline por tempo sobrescreva a formação dirigida pelo scroll. |
| O N não voltar ao estado correto na subida. Em `applyScrollTransforms()`, o trecho `p <= 0.3` não redefine `uProgress`. | Calcular todos os estados necessários a partir da posição atual. Não depender de qual direção foi percorrida antes nem de callbacks que podem ser pulados numa rolagem rápida. |
| O N completo passar rápido demais ou a animação exigir rolagem excessiva. | Definir intervalos explícitos para formação, permanência legível e dispersão. Ajustá-los em desktop e mobile antes de aprovar a etapa. |
| O N ser cortado quando a viewport ficar estreita ou mudar de orientação. | Calcular o enquadramento com as dimensões reais da geometria, a proporção da viewport, profundidade e margens para rotação, deslocamento e tamanho dos pontos. Recalcular câmera e renderer no redimensionamento. |
| A rolagem ficar irregular. O Lenis atual recebe atualizações do próprio `requestAnimationFrame` e do ticker do GSAP. | Manter uma única fonte de atualização do Lenis. Ao usar o ticker do GSAP, remover o loop redundante e preservar a sincronização de `ScrollTrigger.update`. Evitar duas suavizações concorrentes nas âncoras. |
| Recarregar no meio da página, abrir uma âncora ou usar Voltar mostrar uma fase incorreta. | Aplicar a posição real de scroll assim que a cena estiver pronta. Tratar restauração de navegação e recálculo do layout; não forçar o visitante ao topo para esconder inconsistências. |

## Contrato de estados da animação

| Região da experiência | Estado esperado |
| --- | --- |
| Hero inicial | Poucas partículas visíveis, dispersas e com movimento ambiente discreto. |
| Formação | Convergência progressiva das mesmas partículas para o N. |
| Permanência | N completo, reconhecível e com micro movimento controlado. |
| Dispersão | Saída gradual da forma e redução suave da quantidade visível. |
| Conteúdo abaixo | Subconjunto de partículas persistente no fundo, com baixa intensidade. |

A forma principal deve ser determinada pela posição de rolagem. O tempo pode controlar o micro movimento, sem alterar a fase de formação. Ao voltar à mesma posição de scroll, a forma e a quantidade visível devem ser equivalentes, mesmo que o pequeno movimento ambiente esteja em outro instante.

Gerar as posições de referência uma vez por inicialização válida e preservar a correspondência entre pontos. Não sortear uma nova geometria a cada entrada de seção ou mudança de direção.

Quando as posições finais do fundo diferirem das posições dispersas do hero, usar destinos separados para hero, logo e ambiente, ou interpolação equivalente. Um único valor de formação que volte a zero não deve causar uma troca abrupta entre dois fundos diferentes.

## Medidas e atualização do scroll

- Recalcular os marcos com `ScrollTrigger.refresh()` depois de mudanças relevantes de layout e do carregamento das fontes, sem chamar esse método a cada quadro.
- Reservar proporção e espaço dos conteúdos para reduzir deslocamentos tardios.
- Se houver fixação de seção (`pin`), definir a duração e o espaço de saída, sem criar uma faixa vazia excessiva ou encobrir os projetos.
- Manter a cena global fora dos elementos que recebem parallax ou transformações de entrada.
- Não atualizar cada partícula com um tween individual; interpolar os atributos da geometria no shader e atualizar poucos controles globais.
- Conferir tamanho e opacidade no shader: a implementação atual usa pontos de destaque grandes e mistura aditiva. Reduzir a contagem não corrige sozinho excesso de brilho.

## Verificação do checkpoint — etapa 3

- [ ] Descida e subida completas repetidas pelo menos três vezes, sem mudança indevida da forma.
- [ ] Mudança de direção durante a formação e durante a dispersão, sem saltos.
- [ ] Rolagem rápida e salto por âncora aplicam diretamente o estado correto.
- [ ] Recarregamento no meio da página e navegação Voltar/Avançar preservam coerência visual.
- [ ] N completo permanece legível por um intervalo definido de rolagem.
- [ ] N inteiro em celular, tablet, notebook e tela ampla, inclusive ao mudar de orientação.
- [ ] Lenis recebe atualização de um único loop.

---

# Etapa 4 — Partículas persistentes, demonstrações e continuidade da página

## Objetivo

Depois que o N se desfizer, parte das partículas deve continuar existindo ao fundo da página.

Elas devem funcionar como fio condutor visual.

O usuário deve perceber que a mesma identidade continua presente enquanto rola.

## Partículas persistentes

As partículas devem:

- continuar em quantidade baixa;
- ficar atrás do conteúdo;
- não prejudicar leitura;
- se mover lentamente;
- responder à posição de scroll;
- continuar em tons de azul.

Elas não devem desaparecer completamente logo após o N.

## Continuidade

O fundo da página pode ter:

```text
partículas
halo azul
grid muito discreto
gradientes escuros
```

Tudo em baixa intensidade.

## Demonstrações

Depois da experiência do N, a página deve mostrar o que a Neoeffex consegue criar.

Menos texto.

Mais demonstração.

Exemplos:

```text
SEU SITE PODE TER
ELEMENTOS 3D
```

com uma demonstração visual do outro lado.

Depois:

```text
PODE TER FOTOS
REAIS DO SEU NEGÓCIO
```

com uma composição visual diferente.

Depois:

```text
MOTION
INTERAÇÃO
PERFORMANCE
```

com exemplos visuais.

## Layout

Evitar vários blocos fechados.

Preferir composição aberta.

Exemplo:

```text
__________________________________________________

SEU SITE PODE TER
ELEMENTOS 3D

                               [ demonstração ]

__________________________________________________

                               [ imagem ]

                  PODE TER FOTOS
                  REAIS DO SEU NEGÓCIO

__________________________________________________
```

## Cards

Os cards de projetos podem continuar.

Mas:

- manter os previews;
- reduzir texto;
- retirar bordas desnecessárias;
- usar mais vídeo/imagem;
- usar títulos curtos;
- usar menos descrição.

Exemplos:

```text
HAMBURGUERIA
produto em movimento
```

```text
CLÍNICA
presença sofisticada
```

```text
HORTIFRUTI
frescor visual
```

```text
LU LEVE
pedido simplificado
```

## Critérios de aceitação

- partículas continuam abaixo do hero;
- partículas ficam atrás do conteúdo;
- demonstrações ganham mais espaço;
- menos texto;
- cards preservados;
- menos bordas;
- página continua visualmente conectada ao hero;
- identidade azul consistente.

## Riscos e instruções obrigatórias — etapa 4

| Risco identificado | Instrução de implementação |
| --- | --- |
| As partículas sumirem quando a seção do N sair da tela. O observer atual pausa a cena conforme a visibilidade desse container. | Revisar a condição de pausa para a nova cena global. Sair do hero muda a composição e a intensidade; não deve interromper a persistência pedida. |
| Um canvas com altura de toda a página consumir memória e processamento desnecessários. | Dimensionar o buffer pela viewport, respeitando o DPR definido. Atualizar os elementos da cena conforme o scroll, sem criar uma superfície do tamanho do documento inteiro. |
| O fundo desaparecer sob seções opacas ou ficar preso a um ancestral transformado. | Validar as camadas reais, transparências e ordem de empilhamento. Manter as partículas visíveis nos espaços de composição, preservando superfícies opacas onde forem necessárias à leitura. |
| A saída do N parecer uma troca brusca de efeito. | Desvanecer progressivamente parte das partículas e preservar um subconjunto estável para o ambiente. Reutilizar os destinos ao voltar; não recriar o renderer ou trocar a geometria a cada seção. |
| Vídeos, blur, parallax, partículas e nova demonstração 3D pesarem em conjunto. | Medir o conjunto da página, preservar pausa dos vídeos fora da tela e controlar área, tamanho e sobreposição dos pontos. Planejar a demonstração 3D interativa para compartilhar o renderer principal. |
| O modo de movimento reduzido continuar com vídeos automáticos. | Mostrar os posters nesse modo e disponibilizar reprodução por escolha do visitante, com controle acessível. Evitar autoplay de fundo e movimentos contínuos decorativos. |

Não duplicar um site completo dentro de uma nova demonstração apenas para reutilizar um efeito. Preservar os previews atuais e os arquivos das landings protegidas. Para cada demonstração nova, deixar explícito se a experiência será interativa ou gravada e implementar o comportamento apresentado ao visitante.

Pausar vídeos quando a aba ficar oculta. Ao retornar, retomar apenas os que estiverem visíveis e cuja reprodução seja permitida pela preferência de movimento e pela escolha do usuário. Se autoplay for bloqueado, manter o poster e o acesso ao projeto funcionando.

As seções de fotos reais devem usar imagens adequadas à afirmação apresentada. Não descrever uma imagem ilustrativa como fotografia real de um cliente.

## Verificação do checkpoint — etapa 4

- [ ] Partículas persistem até os projetos e o CTA final, com quantidade baixa.
- [ ] Voltar dos projetos reconstrói o N e depois restaura o hero disperso, sem troca brusca.
- [ ] Não há segundo renderer criado para repetir o sistema de partículas.
- [ ] Vídeos visíveis funcionam, vídeos fora da tela pausam e posters permanecem utilizáveis quando a reprodução é bloqueada.
- [ ] Aba oculta interrompe trabalho desnecessário; retorno não provoca saltos perceptíveis.
- [ ] Modo de movimento reduzido usa composição estática e vídeos sem reprodução automática.
- [ ] Novas demonstrações e cards funcionam empilhados no mobile.
- [ ] Comparação com a versão anterior confirma desempenho utilizável no conjunto da página.

---

# Comportamento completo esperado

```text
HEADER

↓

SEU SITE
PODE IR ALÉM

partículas aparecem atrás do texto

↓

scroll

↓

partículas começam a convergir

↓

N se forma

↓

N ganha movimento interno

↓

scroll continua

↓

N se desfaz

↓

algumas partículas permanecem na tela

↓

demonstração de 3D

↓

demonstração de fotos reais

↓

motion / performance / interação

↓

projetos

↓

CTA final
```

Ao voltar:

```text
projetos
↑
partículas continuam
↑
N começa a reaparecer
↑
N se forma novamente
↑
N se dispersa
↑
hero inicial
```

---

# Regras importantes

Não criar:

- canvas preso em quadrado;
- container visível do N;
- excesso de bordas;
- excesso de cards;
- muito texto;
- headline gigante;
- partículas grandes;
- glow excessivo;
- laranja como cor principal.

Priorizar:

- azul;
- espaço;
- movimento;
- demonstração;
- tipografia limpa;
- N grande;
- partículas pequenas;
- continuidade visual.

---

# Performance

Continuar usando:

```text
THREE.Points
BufferGeometry
ShaderMaterial
```

Evitar múltiplos canvases.

Ideal:

```text
1 canvas principal
```

ou no máximo um sistema global compartilhado.

Limitar DPR:

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
```

Mobile:

```text
1.0–1.25
```

Reduzir quantidade de partículas no mobile.

Pausar ou reduzir render quando página estiver em background.

## Controle de custo e ciclo de vida

- A restrição de canvas único se refere ao renderer WebGL principal visível. Um canvas 2D temporário para amostrar o SVG não representa uma segunda cena animada.
- Manter o DPR do renderer e os controles de tamanho dos pontos coerentes, incluindo inicialização, redimensionamento e mudança de orientação. Reaplicar o limite mobile quando necessário.
- Avaliar o tamanho dos pontos, a mistura aditiva e o brilho juntos. Muitos pontos grandes e sobrepostos podem manter o custo elevado mesmo com contagem reduzida.
- Diminuir opacidade não garante economia proporcional de GPU. Se houver degradação, ajustar a quantidade efetivamente desenhada e a resolução com transições visuais estáveis.
- Evitar criar novos tweens para todos os elementos a cada movimento do mouse. Reutilizar controles e limitar efeitos aos elementos relevantes, preservando as interações aprovadas.
- Tratar `visibilitychange` e a restauração da página. Ao retomar, sincronizar o scroll e o tempo da cena para evitar saltos causados por longos intervalos sem renderização.
- Tratar perda de contexto WebGL com recuperação controlada ou alternativa estática. O conteúdo e os links devem continuar utilizáveis.
- Em descarte ou reinicialização, cancelar loops, remover listeners e observers próprios, encerrar triggers da cena e liberar geometria, material e renderer. Uma preparação assíncrona concluída depois do descarte não pode reinstalar a cena antiga.
- Medir a página com os previews e as demonstrações presentes. Registrar o aparelho, navegador e condições usadas; não declarar fluidez universal a partir de uma única máquina.

---

# Mobile

No mobile:

- menos partículas;
- menos profundidade;
- menos interação;
- headline menor;
- N inteiro visível;
- sem crop;
- demonstrações empilhadas;
- manter a lógica de formação e dispersão.

Prioridade:

```text
fluidez > quantidade de efeito
```

Testar no mínimo 320, 360, 390 e 430 px de largura, além de tablet, notebook e desktop amplo. Conferir retrato, paisagem e mudanças de altura da viewport provocadas pela interface do navegador.

Não tratar `pointer: coarse` como medida suficiente do tamanho da tela ou da capacidade gráfica. Usar as dimensões disponíveis para layout e enquadramento; usar o tipo de ponteiro para habilitar ou desabilitar interações de mouse.

Separar dois comportamentos:

- **Mobile com movimento permitido:** preservar a formação e a dispersão, com intensidade e custo reduzidos.
- **Preferência por movimento reduzido, em qualquer aparelho:** usar uma composição estática legível, sem rolagem suavizada, parallax ou animação contínua obrigatória. Mostrar posters dos vídeos até uma ação explícita de reprodução.

A redução de movimento prevalece sobre os requisitos de movimento contínuo deste plano. A experiência estática deve ser uma alternativa completa e utilizável.

---

# Não alterar

Não modificar:

```text
/modelos/hamburgueria/
/modelos/clinica-odontologica/
/modelos/hortifruti/
/sites/lu-leve-e-saudavel/
```

Barbearia continua fora.

Não alterar:

```text
/admin
/catalogo
Supabase
autenticação
sistema de pedidos
```

Não modificar os sites incorporados na vitrine da página inicial nem alterar sua estratégia de incorporação. A exclusão de barbearia se refere à seleção desta vitrine de quatro projetos; não autoriza excluir seus arquivos ou retirá-la de outras áreas do site.

Ao concluir cada etapa, verificar `git diff --name-only` e o conteúdo do diff para confirmar que as mudanças ficaram nos arquivos necessários da vitrine e em sua documentação de entrega. Comparar com o estado inicial para distinguir alterações preexistentes; não desfazê-las automaticamente.

---

# Versionamento sugerido

## Conciliação do ponto de partida

No commit analisado, a mensagem anuncia `v0.3.1`, mas `modelos/preview-vitrine/VERSION` ainda informa `v0.3.0` e o changelog termina nessa versão. Antes de iniciar `v0.4.0`, conferir o histórico real e registrar corretamente o estado de partida.

Se a divergência ainda existir, conciliar a versão e acrescentar a entrada ausente com base nas mudanças verificadas, preservando as entradas anteriores. Não inventar uma release nem apagar histórico para fazer os números coincidirem.

Os números abaixo são destinos previstos. Só atualizar `VERSION` e acrescentar a entrada correspondente no `CHANGELOG.md` quando a respectiva etapa estiver implementada e validada. A atualização deste plano não significa que a vitrine já está em `v0.4.0`.

## Etapa 1

```text
/modelos v0.4.0
```

## Etapa 2

```text
/modelos v0.4.1
```

## Etapa 3

```text
/modelos v0.4.2
```

## Etapa 4

```text
/modelos v0.4.3
```

---

# Commits sugeridos

## Etapa 1

```text
modelos - v0.4.0 - atualiza hero, tipografia e reduz densidade textual
```

## Etapa 2

```text
modelos - v0.4.1 - integra partículas ao hero e remove limitação visual do canvas
```

## Etapa 3

```text
modelos - v0.4.2 - adiciona formação e dispersão reversível do N pelo scroll
```

## Etapa 4

```text
modelos - v0.4.3 - adiciona partículas persistentes, demonstrações e refinamento dos projetos
```

---

# Instrução final para o Antigravity

Implementar uma etapa de cada vez.

Antes de cada etapa:

1. revisar o estado atual;
2. revisar `git diff`;
3. preservar alterações válidas;
4. conferir os arquivos e rotas reais indicados neste plano;
5. identificar quais correções preventivas já foram aplicadas;
6. registrar o comportamento inicial relevante para comparação.

Depois de cada etapa:

1. executar o checklist específico da etapa;
2. testar visualmente em desktop e mobile;
3. verificar console, carregamento de assets, links e navegação por teclado;
4. conferir o diff para preservar as áreas protegidas;
5. registrar o que foi testado e qualquer limitação real;
6. atualizar a versão e o changelog apenas da etapa concluída;
7. apresentar o checkpoint antes de iniciar uma etapa adicional que não tenha sido solicitada.

## Matriz de testes obrigatórios

| Cenário | Resultado exigido | Checkpoint principal |
| --- | --- | --- |
| Abrir `/modelos/` e o endereço direto da vitrine no servidor local e na publicação | Redirecionamento, scripts, SVG, posters, vídeos e links resolvem corretamente. | 1 e revisão final |
| Percorrer cards e voltar ao topo | Identidade global permanece azul e destinos dos CTAs continuam válidos. | 1 |
| Rolar enquanto a entrada está em andamento | Conteúdo utilizável e nenhum conflito entre entrada e formação. | 2 e 3 |
| Simular rede lenta, falha do SVG e ausência de dependências | Conteúdo visível, links funcionando e alternativa visual disponível. | 2 |
| Descer e subir repetidamente, inclusive com rolagem rápida e mudança de direção | Formação e dispersão reversíveis, com fases coerentes e sem saltos. | 3 |
| Abrir âncora, recarregar no meio e usar Voltar/Avançar | Cena corresponde à posição real, sem forçar retorno ao topo. | 3 |
| Redimensionar e alternar retrato/paisagem | N inteiro, copy legível, botões acessíveis e marcos recalculados. | 3 e 4 |
| Percorrer até o CTA final e retornar | Partículas persistem abaixo do hero e recompõem o N na volta. | 4 |
| Trocar de aba e retornar | Trabalho desnecessário é pausado e a retomada mantém a cena e os vídeos coerentes. | 4 |
| Ativar movimento reduzido ou impedir autoplay | Composição estática pronta e posters utilizáveis; vídeos reproduzem somente por escolha no modo reduzido. | 2 e 4 |
| Indisponibilidade ou perda de contexto WebGL | Página permanece utilizável com alternativa estática. | 2 e 4 |
| Revisar o conjunto em celular e notebook básico | Desempenho avaliado com partículas, previews e demonstrações presentes. | 3 e 4 |
| Inspecionar o diff de cada checkpoint | Arquivos protegidos preservados e mudanças preexistentes identificadas. | Todas |

Usar servidor HTTP local para testes, respeitando a raiz do projeto; abrir o HTML diretamente por `file://` não valida módulos e caminhos de produção. Se ainda não houver publicação da etapa, registrar a validação em produção como pendente, sem afirmar que foi executada.

## Formato de entrega por etapa implementada

- Identificar etapa e versão efetivamente concluídas.
- Disponibilizar o `.zip` quando solicitado, com os arquivos alterados em seus caminhos originais, incluindo `modelos/preview-vitrine/`.
- Resumir atualizações e arquivos principais.
- Explicar como testar e informar quais validações foram realmente executadas.
- Apresentar o commit recomendado em bloco copiável.
- Informar pendências concretas, sem marcar testes não executados como aprovados.

Não implementar as quatro etapas de uma vez sem checkpoints.

O objetivo principal é:

> **menos texto, mais demonstração e uma experiência visual contínua em torno do N da Neoeffex.**

---

# Referências do diagnóstico incorporado

As referências do repositório estão fixadas no commit usado na análise. Conferir a versão de trabalho antes de aplicar qualquer correção descrita como existente.

- [Commit de referência — v0.3.1](https://github.com/Jotamunds/neoeffex-site/commit/57f42b97349fa8c789c09203aa0b1029233231ff).
- [Entrada e redirecionamento de `/modelos`](https://github.com/Jotamunds/neoeffex-site/blob/57f42b97349fa8c789c09203aa0b1029233231ff/modelos/index.html).
- [HTML da vitrine: temas, links, dependências e previews](https://github.com/Jotamunds/neoeffex-site/blob/57f42b97349fa8c789c09203aa0b1029233231ff/modelos/preview-vitrine/index.html).
- [CSS: tipografia, cores e limitação do canvas](https://github.com/Jotamunds/neoeffex-site/blob/57f42b97349fa8c789c09203aa0b1029233231ff/modelos/preview-vitrine/assets/css/modelos-preview.css).
- [JavaScript principal: Lenis, entrada, temas e vídeos](https://github.com/Jotamunds/neoeffex-site/blob/57f42b97349fa8c789c09203aa0b1029233231ff/modelos/preview-vitrine/assets/js/modelos-preview.js).
- [Cena Three.js: carregamento, rolagem e pausa](https://github.com/Jotamunds/neoeffex-site/blob/57f42b97349fa8c789c09203aa0b1029233231ff/modelos/preview-vitrine/assets/js/three/scene.js).
- [Shaders: formação, movimento e opacidade](https://github.com/Jotamunds/neoeffex-site/blob/57f42b97349fa8c789c09203aa0b1029233231ff/modelos/preview-vitrine/assets/js/three/shaders.js).
- [Versão registrada na vitrine](https://github.com/Jotamunds/neoeffex-site/blob/57f42b97349fa8c789c09203aa0b1029233231ff/modelos/preview-vitrine/VERSION).
- [Lenis: integração com GSAP ScrollTrigger](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger).
- [GSAP ScrollTrigger: progresso, fixação e recálculo](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).
- [Three.js: dimensões e resolução do canvas](https://threejs.org/manual/en/responsive.html).
- [MDN: efeito de transformações sobre elementos posicionados](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform).
