# Animações — etapas 5 e 6 integradas — v0.1.18

A v0.1.17 implementa o garfinho até o card tradicional de 400 g. A v0.1.18 integra a contagem dos preços e conclui a junção dos módulos ao controlador central. As etapas anteriores continuam preservadas: abertura em grupos, bubble, hover dos cards, WhatsApp e pulinho do botão inicial. Não há tela de carregamento; o conteúdo essencial já existe e está visível no HTML/CSS de base.

## Plano desta atualização

| Etapa | Entrega | Situação |
| --- | --- | --- |
| 1 | Base, controles, cancelamento e isolamento | Implementada na v0.1.13 |
| 2 | Abertura em grupos e bubble controlado | v0.1.14; botões na v0.1.14.1; conjunto da foto na v0.1.14.2 |
| 3 | Reação discreta dos cards ao mouse | Implementada na v0.1.15 |
| 4 | Pulinho e integração do número informado ao WhatsApp | Implementada na v0.1.16 |
| 5 | Garfinho até o card tradicional de 400 g | Implementada na v0.1.17 |
| 6 | Contagem dos preços, integração e ajustes | Implementada na v0.1.18 |

O plano é independente das oito etapas originais. Cada implementação começa pela revisão dos riscos e recebe testes próprios; a etapa 6 não substitui as verificações intermediárias.

## Etapas 5 e 6 — garfinho e preços

O garfinho é um SVG decorativo, sem foco, observado somente no card tradicional de 400 g. Quando o card entra na viewport, ele percorre uma camada própria e mostra um halo curto. O card não recebe `transform`, não muda de posição e não vira um botão. O gerador do cardápio preserva essa marcação.

A contagem atua somente em elementos `.numeric` cujo texto inteiro corresponde a um valor em reais. Telefone, pesos e quantidades são ignorados. Cada preço é observado separadamente, começa em `R$ 0,00`, anima uma vez e recupera exatamente o texto original ao concluir ou cancelar.

Os controles são `motion.fork` e `motion.prices`. A chave geral, movimento reduzido, cores forçadas, impressão, aba oculta e ausência de APIs visuais mantêm a página estática e legível.

## Etapa 4 — contato e pulinho

O botão “Fale conosco” da abertura abre o WhatsApp da Lu: `https://wa.me/5511978766842`. O número não leva sinal de + no wa.me. Todos os botões com `data-whatsapp` usam o número e a mensagem de `config.contact`; telefone e ligação aparecem por extenso no contato/rodapé. O menu “Contato” continua levando à seção, onde também há Instagram e informações de atendimento.

Somente o botão inicial marcado com `data-contact-jump` recebe o pulinho. A superfície interna sobe 4px e volta em 280ms. A âncora e o foco ficam parados, com área transparente ampliada no topo para cobrir o pico de 6px. Não há pulinho em todos os links nem animação contínua.

### Riscos e prevenções

| Risco | Prevenção |
| --- | --- |
| WhatsApp atrasar ou abrir duas vezes | O clique segue a âncora nativa, sem preventDefault, window.open, timer ou espera pela animação. |
| Bubble desaparecer ao preencher o rótulo | whatsapp.js atualiza apenas o texto de data-whatsapp-text; mantém o span e seus atributos. |
| Duas transformações competirem | A intro é encerrada antes do salto; link e ancestrais não animam. |
| Cliques rápidos acumularem efeitos | O salto anterior é cancelado antes do próximo; callbacks antigos não limpam o novo. |
| Área clicável sair debaixo do mouse | A área permanece fixa e cobre a expansão vertical; o foco não se move. |
| Movimento indesejado | motion.contact controla só o salto; chave geral, preferência do sistema, aba oculta, impressão, resize e saída o cancelam. |
| Navegador sem API ou falha visual | Sem Web Animations API, o link funciona sem pulinho. |
| Contato errado ou configuração apagada | Número validado; destino deve corresponder à URL gerada; configuração inválida restaura #contato. |

A abertura do aplicativo/nova aba tem prioridade. O pulinho pode ser visto apenas parcialmente ou nem chegar a ser pintado antes da troca de tela; isso não é motivo para atrasar o contato. O wa.me prepara a conversa e a mensagem: não envia automaticamente.

### Ajustes e organização

- `scripts/contact-jump.js`: interação e animação com Web Animations API, sem bibliotecas.
- `styles/components/contact-jump.css`: somente a reserva da área clicável.
- `styles/base/variables.css`: `--contact-jump-duration: 280ms` (0–400ms) e `--contact-jump-height: 4px` (0–6px).
- `scripts/animations.js`: liga/desliga o módulo por `motion.contact`.
- `scripts/whatsapp.js`: URL e rótulos, independente dos movimentos.

Use ms e px, sem calc()/var() nesses dois valores lidos pelo módulo. Zero desliga o salto. Valores fora dos limites são limitados; unidades/textos inválidos usam o padrão. Não aumente a altura máxima sem rever a área clicável e o espaçamento.

Em configurações antigas, a chave contact ausente usa true. Use `contact: false` dentro de motion para desativar apenas o pulinho: o número e os links continuam ativos. Não confunda `motion.contact` com o objeto `config.contact`.

### Conferência manual

1. Clique no Fale conosco inicial: conferir a conversa da Lu, sem enviar mensagem de teste. Não basta a URL ter formato válido.
2. Verifique toque, Enter, cliques rápidos e Ctrl/Cmd+clique: uma abertura por ativação nativa, sem espera artificial.
3. Clique durante o bubble e nas bordas: superfície preservada, foco e área de toque estáveis.
4. Desligue motion.contact e depois enabled; o link deve continuar funcionando. Teste movimento reduzido, impressão e retorno do aplicativo.
5. Confirme o número por extenso, links dos demais botões e alternativa sem JavaScript.
6. Ao mudar o número, atualize também os links do bloco noscript do contato no index.html e execute os testes. Sem JS, essa cópia é estática.

Revisão visual e abertura real do aplicativo permanecem pendentes. Nenhuma mensagem foi enviada e não foi adicionado carrinho.

## Etapa 3 — destaque dos cards

Os três cards tradicionais e os dois fitness recebem borda sálvia mais marcada e sombra suave ao passar o mouse. A transição dura 220 ms na entrada e na saída. Não há escala, elevação, alteração dos preços, brilho contínuo ou movimento automático.

O efeito exige `motion.enabled` e `motion.cards`, além de `hover: hover`, `pointer: fine`, movimento permitido e cores normais. O CSS usa as capacidades do ponteiro principal, não a largura da tela nem `any-hover`. Em celulares com toque como entrada principal, os cards continuam estáticos. Em aparelhos híbridos, confirme também o comportamento alternando mouse e toque.

O card continua informativo: sem cursor de botão, clique, tabindex ou conteúdo escondido no hover. Não é necessário adicionar foco ao card para acessar preços. As regiões de hover permanecem fixas; não há risco de o próprio deslocamento retirar o mouse de uma borda e reativar o efeito.

### Riscos e prevenções da etapa 3

| Risco | Prevenção |
| --- | --- |
| Sobrepor cards, deslocar preços ou tremer nas bordas | Apenas cor da borda e sombra variam; tamanho, espessura da borda e posição ficam iguais. |
| Hover persistir no toque | CSS exige hover e ponteiro preciso primários; não simula toque com JavaScript. |
| Competir com bubble/reveal ou garfinho | CSS próprio e nenhum transform, keyframe ou pseudo-elemento no card. |
| Movimento reduzido ou chave desligada ainda animarem | Permissão removida pelo coordenador; CSS também bloqueia por preferência, impressão e capacidade. A saída é imediata quando desligado. |
| Excesso de trabalho de renderização | Só duas propriedades, duração limitada a 300 ms; sem transition: all, loop, listener por card ou will-change permanente. Sombra exige pintura: fluidez real ainda precisa de conferência. |
| Usuário interpretar o card como botão | Mantém semântica de artigo, seleção de texto e cursor normais; todos os preços já visíveis. |

### Como ajustar

Em `styles/base/variables.css`:

| Variável | Padrão | Uso |
| --- | --- | --- |
| --card-hover-duration | 220ms | Duração limitada pelo CSS entre 0 e 300ms |
| --card-hover-ease | var(--ease-standard) | Curva suave, sem overshoot |
| --card-hover-border | var(--color-sage-dark) | Cor da borda no hover |
| --card-hover-shadow | 0 8px 20px var(--color-shadow) | Sombra do destaque |

Use valores CSS válidos. Evite sombras muito extensas, pois podem alcançar cards vizinhos; não altere a espessura da borda nem adicione escala. Para desligar apenas este efeito, use `cards: false` em `scripts/config.js`. Para uma mudança temporária:

```js
window.LuLeve.animations.configure({ cards: false });
window.LuLeve.animations.configure({ cards: true });
```

`getState().cards` informa a permissão, não se existe mouse compatível ou um card está sob o ponteiro. Alterar essa chave não repete a abertura nem recria observadores de reveal. Configurações anteriores sem a chave são compatíveis e usam `cards: true` como padrão; strings como `"true"` não ligam o efeito.

### Conferência manual dos cards

1. Com mouse/trackpad, entre e saia de cada um dos cinco cards, incluindo suas bordas: destaque suave e posições estáveis.
2. Passe rapidamente entre cards e role a página; não deve haver efeito contínuo, conteúdo cortado ou alteração do combo “Mais pedido”.
3. Teste celular real e aparelho híbrido; toque e rolagem não devem exigir um segundo toque nem abrir ações do card.
4. Desative cards e enabled durante o hover: a aparência-base deve voltar imediatamente. Intro, reveal e scroll devem continuar independentes.
5. Teste movimento reduzido, cores forçadas, impressão, zoom de 200%, teclado, sem JavaScript e sem o CSS do efeito.
6. Compare 320, 375, 430, 768, 1024 e 1440px: grade e preços inalterados; sem rolagem lateral. CSS de capacidades não é uma simulação de dispositivo.

A revisão visual e a fluidez em dispositivos reais permanecem pendentes; testes de código não as comprovam.

## Sequência de abertura preservada

| Grupo | Início padrão | Movimento |
| --- | --- | --- |
| Rótulo e título | 0 ms | Deslocamento vertical de 0,5rem até a posição normal |
| Texto de apoio | 100 ms | Mesmo deslocamento suave |
| Botões | 200 ms | Cada superfície faz 0,85 → 1,06 → 1; links e foco ficam imóveis |
| Foto e broto | 300 ms | Foto, borda e contorno 0,96 → 1,035 → 1; broto 0 → 1,20 → 1 |

Cada grupo dura 640 ms; a sequência termina em cerca de 940 ms. Os grupos se sobrepõem no tempo, sem deixar a pessoa esperando um terminar para começar outro.

Somente o broto decorativo começa em escala zero. Foto, borda e contorno animam juntos; legenda, seções e ondas ficam imóveis. O recorte continua apenas dentro da moldura. Texto e botões nunca ficam invisíveis. A opacidade mínima de 0,97 foi escolhida após conferir o contraste sobre o fundo e o broto.

Os dois antigos `data-reveal` do hero foram removidos. O título, o texto, cada superfície de botão e o conjunto da foto têm atributos `data-intro` próprios. Não aplique `data-reveal` ao pai desses elementos: isso somaria transformações. Os títulos das demais seções continuam com a entrada de 480 ms da base; preços e combos não animam.

### Botões: separar aparência e interação

Cada link `hero__action` contém um span `button hero__action-visual`, com o texto uma única vez. Somente esse span tem `data-intro="action"`; o grupo e os links não animam. Sem JavaScript ou sem o CSS da intro, os botões continuam visíveis e utilizáveis.

A superfície tem `pointer-events: none`, para o link continuar recebendo a interação. Um pseudo-elemento transparente e fixo cobre até o pico permitido de 1,08; ele não encolhe no cancelamento. O intervalo entre os links foi ajustado para acomodar essa área, sem esconder overflow da página ou recortar foco. Os estados de hover/clique são aplicados pela âncora à superfície. O foco nativo fica na âncora e também interrompe a animação via CSS.

As regras estruturais ficam em `styles/sections/hero.css`; os frames continuam em `styles/components/hero-intro.css`. O componente global `buttons.css` não foi modificado. Com o WhatsApp já integrado, mantenha data-whatsapp-text na superfície interna: não substitua o conteúdo inteiro da âncora, pois isso removeria o span animável.

### Foto: uma camada, sem escala dupla

`hero__artwork` recebe `data-intro="photo"` e contém a moldura com a imagem. O contorno é seu `::before`, tanto no visual-base quanto no orgânico. A legenda fica fora. Não adicione outro alvo à imagem, moldura ou figura.

A estrutura fica em `hero.css`, o formato alternativo em `organic-backgrounds.css` e a animação em `hero-intro.css`. O ponto de transformação é `center calc(100% + var(--space-0))`: o pico cresce para cima e para os lados, preservando espaço para a legenda. Os insets do contorno independem da altura da legenda. Não há recorte na camada; somente a moldura recorta a fotografia. `--intro-photo-start` e `--intro-photo-peak` controlam o conjunto inteiro, sem novos scripts ou opções.

## Riscos verificados antes de desenvolver

| Risco | Prevenção implementada |
| --- | --- |
| Escala 1,20 transbordar ou encobrir leitura | Expansão completa só no broto, dentro da moldura decorativa existente; conjunto da foto com limite 1,06, respiro lateral e origem na base do contorno. |
| Rotação do broto desaparecer | Os frames compõem a escala com a mesma variável de rotação; o desenho não foi refeito. |
| Pai e filho ampliarem juntos | Hero/copy/figure não animam; a imagem não recebe escala própria além da camada pai. |
| Botão mudar de lugar no meio do clique | Grupo e links sem transform; somente o span visual cresce, dentro de uma área de toque fixa que cobre o pico. |
| Dois botões se sobreporem ou perderem os estados de interação | Pico limitado a 1,08, intervalo horizontal reservado e hover/clique aplicados pelo link. |
| Foco ser recortado ou deixar a superfície animando | Sem overflow no link; foco nativo e cancelamento também pelo foco no ancestral. |
| Texto perder contraste ao aparecer | Opacidade limitada entre 0,97 e 1, com teste de contraste das cores efetivas. |
| Conteúdo já visto desaparecer com carregamento lento | A intro é omitida após a primeira pintura, com documento completo ou inicialização depois de 1,5 segundo. |
| Interromper leitura, âncora ou posição restaurada | Não inicia fora do topo, em histórico, com foco anterior ou âncora diferente de #inicio. |
| Falha de JavaScript deixar a página escondida | Base visível; somente CSS de animação temporária, sem opacidade zero em informação essencial. |
| Repetir ao rolar, voltar à aba ou reconfigurar | Uma única tentativa por documento, inclusive quando omitida; sem armazenamento persistente. |
| Preferência de acessibilidade ser ignorada | Coordenador e CSS respeitam movimento reduzido, cores forçadas e impressão. |
| Decoração desativada nunca emitir término | Só entram na espera alvos renderizados com animação e duração positiva. |
| Eventos/listeners acumularem | Limpeza no fim, cancelamento, interação, ocultação, impressão, saída e destroy. |
| Animação atrasar atendimento | Sem timers, bloqueio de rolagem, preventDefault, espera por fontes/fotos ou mudanças de links. |

Cliques, toque, teclado, foco e rolagem cancelam imediatamente a abertura. Redimensionar a janela também cancela, evitando uma transição atravessando a mudança de layout. Os eventos continuam com seu comportamento nativo.

## Ligar e desligar

Em `scripts/config.js`:

```js
motion: {
    enabled: true,
    intro: true,
    cards: true,
    contact: true,
    reveal: true,
    smoothScroll: true
},
```

| Opção | O que controla |
| --- | --- |
| enabled | Chave geral dos efeitos e da rolagem |
| intro | Sequência de abertura e bubble, somente no hero |
| contact | Pulinho no botão inicial; não controla a disponibilidade dos links |
| cards | Permissão para borda/sombra ao mouse nos cinco cards de preço |
| reveal | Entrada suave dos elementos com data-reveal, fora do hero |
| smoothScroll | Rolagem suave dos atalhos nativos |

Use true/false sem aspas e recarregue. `intro: false` deixa o hero estático, sem retirar os desenhos; `reveal: false` não desliga a intro. `enabled: false` desliga os cinco aprimoramentos, mas não os links. Não remova arquivos, imports ou classes de fundos para desligar movimento.

A preferência do sistema prevalece. Sem JavaScript, sem o coordenador ou sem matchMedia, o conteúdo permanece estático. Sem IntersectionObserver, apenas reveal é omitido; a intro pode funcionar. Sem o módulo hero-intro.js, somente a abertura nova é omitida.

## Ajustar os valores

Todos ficam em `styles/base/variables.css`; a sequência e os frames ficam em `styles/components/hero-intro.css`.

| Variável | Padrão | Limite aplicado pelo CSS |
| --- | --- | --- |
| --intro-duration | 640ms | 0 a 900ms por grupo |
| --intro-stagger | 100ms | 0 a 120ms entre grupos |
| --intro-distance | 0.5rem | 0 a 0.75rem para os textos |
| --intro-start-opacity | 0.97 | 0.97 a 1 |
| --intro-photo-start | 0.96 | 0.94 a 1 |
| --intro-photo-peak | 1.035 | 1 a 1.06 |
| --intro-button-start | 0.85 | 0.8 a 1 |
| --intro-button-peak | 1.06 | 1 a 1.08 |
| --intro-bubble-peak | 1.20 | 1 a 1.20 |
| --intro-ease | cubic-bezier(0.2, 0.7, 0.2, 1) | Usar curva CSS válida e sem overshoot adicional |

Use ponto nos decimais; tempos precisam de ms ou s. Os limites reduzem erros de edição e mantêm a sequência em até 1,26 segundo, com valores válidos. A curva de aceleração ainda precisa ser válida; prefira manter a entregue. Não retire os limites de escala nem aplique o efeito ao link ou à seção inteira. O limite de 1,08 dos botões acompanha a área de toque e o espaçamento; não altere um sem revisar os outros.

Para deixar apenas os botões sem bubble, use `--intro-button-start: 1;` e `--intro-button-peak: 1;`. Isso mantém a foto, o broto e os textos animados. `intro: false` continua desligando toda a abertura.

Para tirar a expansão do broto, use `--intro-bubble-peak: 1;`. Para eliminar todo o movimento da abertura, use `intro: false`. Para ajustar as entradas das outras seções, continuam disponíveis `--duration-reveal`, `--reveal-distance`, `--reveal-start-opacity` e `--ease-reveal`.

Não altere a regra de movimento reduzido, que zera os tempos.

## Por que a abertura pode não animar?

Ela é um aprimoramento opcional, não uma condição para usar o site. Abra `index.html` no topo, sem outra âncora na URL, com movimento permitido e carregamento rápido. A tentativa acontece no init do coordenador, sem esperar load, imagens ou fontes.

Se já ocorreu pintura, o documento terminou de carregar, a inicialização chegou depois de 1,5 segundo ou o navegador não fornece Paint Timing/CSS compatível, o conteúdo fica estático. Isso também vale para aba inicialmente oculta, histórico, rolagem restaurada ou foco anterior. Não force reexecução escondendo os elementos ou rolando a página ao topo.

No console do navegador:

```js
window.LuLeve.animations.getState();
window.LuLeve.heroIntro.getState();
```

O primeiro informa os controles efetivos; `intro: true` significa permitido, não necessariamente executado. O segundo retorna uma cópia com `attempted`, `running` e `status`.

| Status mais comum | Significado |
| --- | --- |
| running / completed | Executando / terminou |
| disabled | Desligado, preferência restritiva ou aba oculta na tentativa |
| already-painted / late | Página já apareceu ou código chegou tarde |
| anchor / scrolled / focused / history | Navegação ou interação tem prioridade |
| unsupported | API de timing ou CSS necessário indisponível |
| no-hero / no-effects | Hero ausente ou sem alvos animáveis |
| interaction / resize / print / pagehide | Sequência interrompida pelo uso da página |
| cancelled / destroyed / error | Cancelada, desmontada ou omitida após falha |

Reativar a opção, voltar à aba ou executar destroy/init não repete a abertura. Para tentar novamente, recarregue normalmente. Se a intro já tiver terminado ou sido omitida, ela continuará nesse estado até a recarga.

## Organização e ciclo de vida

| Arquivo | Responsabilidade |
| --- | --- |
| scripts/config.js | Versão e opções públicas |
| scripts/animations.js | Coordenador: preferências, cards, reveal, rolagem e chamada do módulo |
| scripts/contact-jump.js | Pulinho por clique, cancelamento e fallback sem WAAPI |
| tests/contact-jump.mjs | 14 grupos de integração, URLs, eventos e simulação WAAPI |
| scripts/hero-intro.js | Elegibilidade, tentativa única, eventos e limpeza do hero |
| scripts/main.js | Inicia movimento depois dos contatos e da barra |
| styles/components/card-hover.css | Destaque de borda/sombra, capacidades do ponteiro e proteção CSS |
| tests/card-hover.mjs | 12 grupos de contratos e simulações da etapa 3 |
| styles/components/hero-intro.css | Frames, sequência e proteções específicas da abertura |
| styles/base/motion.css | Entrada suave anterior e rolagem |
| styles/base/variables.css | Valores visuais editáveis |
| tests/hero-intro.mjs | 43 grupos: 31 da etapa 2, 7 dos botões e 5 do conjunto da foto |
| tests/intro-fixture.mjs | Simulador de DOM/APIs, sem renderização real |

São dez scripts clássicos `defer`, com `hero-intro.js`, `contact-jump.js`, `fork-highlight.js` e `price-countup.js` antes de `animations.js`. Sem biblioteca nova, build obrigatório ou dependência de servidor. Os imports finais de decorações e fundos continuam na ordem anterior. O gerador do cardápio mantém a marcação do garfinho.

O coordenador mantém init, configure, getState e destroy. Configure aplica só as opções recebidas, sem reescrever config.motion. Destroy limpa os recursos próprios e preserva o histórico. As mudanças pelo console não persistem em arquivos.

```js
window.LuLeve.animations.configure({ intro: false });
window.LuLeve.animations.configure({ enabled: false });
```

O CSS usa backwards durante o atraso, sem forwards/both: terminado o efeito, libera as propriedades mesmo se o evento de término não chegar. Os eventos limpam adicionalmente a classe e os listeners. Nesse caso excepcional de evento perdido, o próximo cancelamento/interação ou destroy libera os recursos restantes. Não há loop por frame ou temporizador.

## Verificações e limites

```bash
node tests/validate.mjs
node tools/build-menu.mjs --check
node tools/build-decorations.mjs --check
node tools/check-release.mjs
```

216 grupos técnicos foram aprovados: os 206 anteriores, quatro grupos do garfinho e seis da contagem. Eles cobrem integração, alternativas estáticas, execução única, cancelamento, parser monetário, ordem dos scripts, acessibilidade e preservação do valor final.

As verificações são de código, cálculos e simulações em Node.js. Não executam navegador e não confirmam pixels, fluidez real, duração percebida, encaixe ou comportamento por dispositivo. A revisão visual continua pendente.

O checklist de publicação mantém quatro pendências automáticas: URL da Neoeffex, fotos provisórias, indexação e aviso de pré-publicação. O WhatsApp está configurado; a confirmação do destinatário continua humana. Nada foi publicado e nenhuma mensagem foi enviada.

## Conferência manual antes da publicação

1. Recarregue no topo sem âncora e observe título → apoio → botões → foto/broto. Se estático, confira o status pelo console.
2. Confira 320, 375, 430, 768, 960 e 1440px: foto, borda e contorno devem crescer juntos, sem rolagem lateral ou recorte; legenda parada. Teste o pico máximo 1,06 e também sem organic-backgrounds; restaure as opções depois.
3. Clique/toque no centro e nas bordas de Ver preços e Fale conosco durante o bubble: navegação imediata, sem deslocar a área clicável. Confira os dois botões lado a lado e empilhados, hover e foco visível.
4. Use Tab/Shift+Tab/Enter imediatamente; foco e leitura não devem esperar.
5. Role antes de terminar; a abertura deve voltar ao normal e não repetir ao subir.
6. Abra diretamente #tradicionais, #fitness e #contato; volte pelo histórico com posição restaurada.
7. Desligue intro, cards, contact, fork, prices, reveal e smoothScroll separadamente; depois desligue enabled.
8. Troque de aba, altere movimento reduzido/cores forçadas e abra impressão durante a entrada.
9. Remova só decorative-elements e recarregue: a sequência deve terminar sem o broto.
10. Teste sem JavaScript, com CSS da intro ausente, cache desativado e carga lenta: conteúdo visível, sem travamento.
11. Teste zoom de 200%, texto ampliado, rotação do celular e fim da página acima da barra.
12. Não marque a revisão visual como aprovada apenas porque os testes de código passaram.

## Atualização e commit indicado

Extraia em uma pasta separada e compare. Substitua somente a pasta `sites/lu-leve-e-saudavel`, preservando `.git` e alterações externas ao projeto. A versão, os módulos e seus controles já estão integrados; não execute instaladores adicionais.

Depois de conferir os arquivos e rodar os testes, faça um commit único:

```bash
git diff --stat
git diff
git add .
git commit -m "v0.1.18 - Integra animações, logos e contagem dos preços"
```

Revise o conteúdo antes de git add ., principalmente se houver outras alterações. Não execute git init novamente, force push ou apague arquivos. Nenhum commit ou push foi executado nesta entrega. O ZIP não contém .git, histórico, remotos, credenciais ou dependências.

## Referências técnicas

A retenção durante o atraso, sem conservar o estado depois do fim, segue o comportamento de [animation-fill-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-fill-mode). A decisão de omitir a entrada após uma pintura usa a API [PerformancePaintTiming](https://developer.mozilla.org/en-US/docs/Web/API/PerformancePaintTiming). Os limites de valores são definidos com [clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp).
