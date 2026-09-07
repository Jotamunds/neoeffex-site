# Neoeffex — refinamento da preview-vitrine em 6 etapas

Documento de execução para o Antigravity. Revisão do plano: 1.0 — 07/09/2026.

Área principal: `modelos/preview-vitrine/`.

## Objetivo e contexto

Corrigir a interação vertical do mouse nas partículas, suavizar a formação e a desformação do N, manter movimento discreto no N formado, recuperar a interação do prisma demonstrativo, manter o header fixo e utilizar o cursor personalizado do site.

O usuário relata que o eixo X acompanha corretamente o mouse, mas o eixo Y parece espelhado. Também relata uma parada abrupta quando as partículas terminam de formar o N. O header deve permanecer visível, e o N deve ficar um pouco mais abaixo para ganhar distância dele.

O diagnóstico fornecido pelo Antigravity aponta diferenças entre `interactive3dViewport` / `demo-3d-viewport` no HTML e `spatialViewport` / `.spatial-viewport` no JavaScript e CSS do prisma. Esses trechos são evidências fornecidas na conversa; confirmar sua presença na versão atual antes de editar. Os arquivos completos e a versão atual do repositório não foram inspecionados na preparação deste plano.

Este documento complementa as instruções existentes. Preserve requisitos anteriores compatíveis. O pedido mais recente de header sempre visível substitui especificamente qualquer comportamento anterior de ocultação durante a rolagem. Não substituir ou reescrever documentos antigos sem necessidade.

## Regras de execução

1. Executar uma etapa por solicitação, na ordem abaixo. O prompt inicial autoriza somente a etapa 1. Concluir implementação, validação e entrega dessa etapa; as demais ficam para solicitações posteriores.
2. Não trabalhar em etapas simultaneamente. Mesmo quando compartilham um arquivo, cada alteração deve pertencer ao escopo da etapa ativa. Não criar agentes paralelos para essas correções.
3. Antes de editar, ler as instruções aplicáveis, como `AGENTS.md` e `GEMINI.md`, na raiz e nas pastas envolvidas. Respeitar as instruções explícitas do usuário.
4. Conferir branch, versão e alterações locais existentes. Não apagar, sobrescrever ou reverter trabalho prévio do usuário. Se houver uma alteração parcial, entender e continuar o que já existe, evitando duplicação.
5. Fazer mudanças pequenas e relacionadas ao objetivo. Manter a arquitetura, bibliotecas e forma de execução existentes. Não introduzir React, uma nova engine, dependências ou uma migração de build apenas para estes ajustes.
6. Preservar textos, identidade visual, logo aprovada, tamanho atual do N, centralização do hero e botões, header de ponta a ponta, footer e demais decisões anteriores compatíveis.
7. Preservar os sites incorporados e seu carregamento intencional na vitrine. Não trocar iframes por imagens, nem alterar os projetos dentro das prévias para resolver o cursor da página principal.
8. Manter a camada de partículas sem bloquear cliques. Não resolver a captação do mouse tornando toda a camada de fundo um interceptador de eventos.
9. Não duplicar listeners, renderizadores, geometria ou loops de animação. Reutilizar o fluxo existente de atualização e a estratégia atual de CPU ou GPU.
10. Guardar os parâmetros ajustáveis em um ponto claro do código ou na configuração existente, com nomes descritivos e comentários curtos. Não espalhar números mágicos por CSS, JavaScript e shaders.
11. A etapa só está concluída depois da validação do seu escopo e da ausência de regressões nas etapas já concluídas. Um defeito preexistente reservado para uma etapa futura deve ser registrado; não ampliar a etapa atual para corrigi-lo.
12. Usar o ambiente de execução previsto pelo projeto. Não trocar caminhos ou imports apenas para acomodar uma forma de execução incompatível. Informar a URL local efetivamente testada.
13. Não fazer commit, push, merge ou deploy automaticamente. Entregar as alterações e sugerir o commit. Se um comando ou teste não puder ser executado, informar a limitação sem declarar sucesso.

## Divisão e dependências

| Etapa | Responsabilidade exclusiva | Resultado verificável |
| --- | --- | --- |
| 1 | Header fixo e enquadramento do N | Header não desaparece; N ganha uma pequena distância abaixo dele. |
| 2 | Coordenadas da interação do mouse | A região afetada coincide com o cursor nos quatro quadrantes. |
| 3 | Ritmo da formação e da desformação | Chegada e saída graduais, inclusive com interrupção e inversão do scroll. |
| 4 | Oscilação do N formado e repulsão suave | Forma legível e viva, com afastamento e retorno graduais. |
| 5 | Estrutura e interação do prisma | Perspectiva correta, arraste funcional e toque compatível com a rolagem. |
| 6 | Cursor personalizado e integração final | Um único ponteiro onde suportado, com precisão, estados e fallback. |

O header e o enquadramento vêm antes da correção de coordenadas para que o cálculo do mouse seja validado no layout final. O cursor personalizado fica por último, depois que as interações e o arraste estão estabilizados.

Os números 1 a 6 pertencem a este plano; não renumeram etapas de documentos anteriores.

## Inspeção inicial — parte da etapa 1

Localizar os arquivos reais e mapear responsabilidades. Os caminhos e nomes abaixo são pontos de partida, não autorização para criar arquivos duplicados:

- `modelos/preview-vitrine/index.html`;
- `modelos/preview-vitrine/assets/css/modelos-preview.css`;
- `modelos/preview-vitrine/assets/js/modelos-preview.js`;
- `scene.js`, `particle-source.js` e shaders/imports efetivamente usados na cena de partículas;
- implementação atual do cursor, do header e da rolagem;
- `VERSION`, `CHANGELOG.md` e instruções locais, quando existirem.

Registrar de forma breve:

- posição do canvas: fixo, absoluto ou no fluxo; seus contêineres e transformações;
- câmera e espaço em que as posições das partículas são calculadas;
- origem do progresso de scroll e filtros de suavização existentes;
- local de captura do mouse e ponto em que sua posição é convertida;
- código que altera visibilidade/transformação do header;
- responsáveis pela escrita das posições das partículas e da rotação do prisma;
- comportamento atual de movimento reduzido, celular e iframes.

Não executar uma refatoração geral durante essa inspeção. Registrar os problemas de etapas futuras para tratá-los na ordem prevista.

## Etapa 1 — header sempre visível e N ligeiramente mais abaixo

### Implementar

1. Manter o header preso ao topo, cobrindo a largura prevista do viewport, inclusive ao rolar para baixo, para cima ou rapidamente.
2. Remover ou desativar apenas a lógica de ocultação: classes, `transform`, opacidade ou listeners responsáveis por fazê-lo desaparecer. Preservar comportamentos úteis, como abrir o menu e mudar discretamente o fundo.
3. Conferir os ancestrais do header para que transformações e contextos de empilhamento não prejudiquem sua fixação e visibilidade. Usar uma ordem de camadas coerente, sem uma sequência de `z-index` arbitrários.
4. Garantir contraste dos links sobre partículas e seções. Preservar o estilo existente do header.
5. Compensar a altura real do header no conteúdo quando necessário. Evitar compensação duplicada e manter o hero bem enquadrado com seus botões.
6. Compensar a navegação por âncoras para que o início de cada seção não fique escondido atrás do header. Reutilizar a altura medida ou a variável existente.
7. Deslocar levemente para baixo o centro/alvo de formação do N. Usar aproximadamente 24 px visuais adicionais no desktop como ponto inicial de ajuste, não como valor obrigatório ou unidade de mundo da cena.
8. Fazer esse deslocamento no posicionamento correto da cena, considerando câmera, escala e layout. Não aplicar uma transformação CSS apenas ao canvas para maquiar o alinhamento. Documentar o deslocamento para que a etapa 2 use a mesma geometria.
9. No mobile, ajustar o afastamento à altura do header e ao espaço disponível. Preservar o tamanho do N, sem cortes, sobreposição excessiva ou aumento desnecessário de áreas vazias.

### Fora desta etapa

Não ajustar curva de formação, intensidade do mouse, oscilação, prisma ou cursor. Não aumentar o percurso de rolagem como solução para a transição brusca.

### Validar

- Header visível no topo, meio e final da página, nos dois sentidos de rolagem.
- Menu desktop e mobile funcionam; links e botões permanecem clicáveis.
- Âncoras posicionam os títulos abaixo do header, inclusive ao abrir um link direto.
- Hero mantém bom enquadramento; N fica discretamente mais abaixo sem ser redimensionado.
- Sem rolagem horizontal ou espaços compensados duas vezes.
- Redimensionamento e mudança de orientação não sobrepõem header, título e botões.

### Conclusão

Informar o mecanismo de ocultação removido e onde o deslocamento do N foi aplicado. Registrar qualquer desalinhamento de mouse já existente para a etapa 2.

## Etapa 2 — corrigir o eixo Y e a correspondência do mouse

### Implementar

1. Localizar a cadeia completa: evento do ponteiro, coordenadas da tela, normalização, projeção e comparação com as partículas. Não confundir a interação do N com a interação do prisma.
2. Usar `clientX/clientY` com o retângulo visual correto do canvas. Não misturar coordenadas da página com coordenadas do viewport, nem usar pixels do framebuffer como se fossem pixels CSS.
3. Quando a implementação precisar de coordenadas normalizadas de dispositivo, usar como referência:

```js
const rect = canvas.getBoundingClientRect();

// Exemplo de conversão para NDC; adaptar à implementação existente.
// Executar somente com rect.width e rect.height maiores que zero.
const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
const mouseY = 1 - ((event.clientY - rect.top) / rect.height) * 2;
```

4. Essa fórmula cobre apenas tela → NDC. Não comparar esses valores diretamente com posições locais ou de mundo. Quando necessário, projetar o ponteiro no plano de interação e converter o resultado para o espaço das partículas, considerando os transforms do grupo e o deslocamento da etapa 1. Se a interação já ocorre em espaço de tela, manter ambos nesse espaço.
5. Verificar se o eixo Y já foi invertido na geração da forma a partir da imagem/SVG, no shader ou em outra transformação. Corrigir o ponto efetivamente errado sem espelhar a logo ou inverter a força para compensar.
6. Atualizar a geometria de referência quando o layout mudar. Se o canvas se deslocar com scroll, a referência precisa acompanhar isso; se for fixo, não acrescentar `scrollY` indiscriminadamente.
7. Garantir captação do movimento mesmo com a camada de partículas em `pointer-events: none`, usando o listener apropriado no fluxo existente. Não disparar eventos sintéticos nem colocar um overlay bloqueando os controles.
8. Criar, somente em modo de depuração temporário, uma marca visual do ponto de interação projetado. Desativar a marca e os logs antes da entrega.

### Fora desta etapa

Preservar raio, intensidade, amortecimento e ritmo atuais. O objetivo é acertar a região afetada. Uma partícula abaixo do cursor pode mover-se ainda mais para baixo por repulsão; o teste deve observar o centro da influência, não exigir que o deslocamento copie o movimento do mouse.

### Validar

| Cursor | Região que deve reagir |
| --- | --- |
| Superior esquerdo | Partículas próximas do cursor no superior esquerdo. |
| Superior direito | Partículas próximas do cursor no superior direito. |
| Inferior esquerdo | Partículas próximas do cursor no inferior esquerdo. |
| Inferior direito | Partículas próximas do cursor no inferior direito. |
| Centro | Partículas ao redor do centro, sem desvio sistemático. |

Repetir a verificação após rolar, redimensionar, mudar o zoom do navegador e com o N formado no enquadramento da etapa 1. Testar a saída e reentrada na janela sem alterar ainda o desenho da suavização.

### Conclusão

Descrever a causa encontrada e o espaço de coordenadas adotado. Não declarar que o prisma foi corrigido nesta etapa.

## Etapa 3 — formação e desformação contínuas

### Comportamento desejado

| Fase | Sensação de movimento |
| --- | --- |
| Formação inicial/intermediária | Deslocamento perceptível; referência relativa de 8/10. |
| Aproximação da forma final | Desaceleração progressiva; referência de 4/10 e acomodação suave. |
| N formado | Forma estável, preparada para a oscilação da etapa 4. |
| Início da desformação | Saída discreta que começa lentamente. |
| Dispersão avançada | Aceleração gradual; referência relativa de 8/10. |

Os números representam intenção visual, não velocidades literais, multiplicadores fixos ou uma troca de estado de 8 para 4.

### Implementar

1. Identificar como o progresso da rolagem determina a formação. Preservar a relação com o scroll e os marcos visuais das seções.
2. Revisar as curvas e a transição de pesos entre dispersão, forma e movimentos existentes. Evitar condições que desliguem instantaneamente um movimento ao atingir um limite.
3. Desacelerar antes de o N estar completo. Curvas de interpolação devem se encontrar sem saltos de posição ou mudanças bruscas de velocidade perceptível. Um `ease` isolado não resolve a troca abrupta de outra camada.
4. Se houver suavização de scroll ou progresso, calibrá-la antes de acrescentar novos filtros. Evitar a soma de atraso de scroll, atraso de progresso e atraso de posição.
5. Manter atualização coerente com o tempo entre quadros. Limitar avanços anormais depois de aba oculta ou pausa, conforme a arquitetura, sem recomeçar a animação do zero.
6. Se usar pequeno desencontro na chegada das partículas, gerar variações determinísticas uma única vez. Usar uma faixa curta, dentro do intervalo da formação, garantindo que todas consigam atingir o estado final. Não sortear atrasos a cada quadro.
7. Fazer o caminho inverso funcionar com as mesmas regras: rolar para cima, parar na transição ou alternar o sentido não deve reiniciar a formação nem provocar saltos.
8. Ao carregar a página em posição intermediária ou por âncora, inicializar o estado de acordo com o scroll atual. Evitar reproduzir toda a animação a partir do topo.
9. Preservar a correspondência do mouse da etapa 2. A posição-base da forma deve continuar identificável para receber os efeitos da etapa 4; evitar uma refatoração ampla ou a substituição desnecessária do renderizador.

### Fora desta etapa

Não redesenhar o efeito do mouse, não aumentar a oscilação do N formado e não alterar header, prisma ou cursor. Não tentar resolver tudo aumentando a altura da seção ou a duração total.

### Validar

- Rolar lenta e rapidamente nos dois sentidos.
- Parar quando o N estiver quase formado e observar a acomodação.
- Inverter o scroll imediatamente antes e depois da formação completa.
- Confirmar que o N continua acompanhando a seção, sem atraso prolongado.
- Reabrir a aba após alternar para outra janela; carregar diretamente no meio da página.
- Confirmar que a suavidade existe sem depender do movimento do mouse.

### Conclusão

Informar as curvas/filtros alterados, os parâmetros principais e como foi evitada a parada abrupta. Movimento reduzido deve continuar com apresentação legível e limitada, conforme o padrão do projeto.

## Etapa 4 — N vivo e repulsão com retorno suave

### Implementar

1. Preservar a formação-base aprovada na etapa 3. Compor o resultado em um único ponto de atualização por partícula, respeitando a implementação existente:

```text
posição final = posição-base da formação
             + deslocamento discreto de oscilação
             + deslocamento amortecido de interação
```

2. Essa composição é conceitual; pode ocorrer no shader ou no JavaScript existente. Não criar uma segunda cópia da animação. Não somar deslocamentos indefinidamente às posições finais do quadro anterior; um estado de velocidade/deslocamento controlado é diferente de deformar permanentemente a forma-base.
3. Manter oscilação de baixa amplitude no N formado, com variações suaves ao longo do tempo. Preferir funções contínuas e fases estáveis por partícula a posições aleatórias por quadro.
4. Fazer a influência dessa oscilação entrar e sair gradualmente conforme o estado da formação, sem ligar/desligar no limite exato em que o N fica pronto.
5. Aplicar repulsão local ao redor da posição correta do cursor, com influência que desaparece suavemente na borda do raio. Evitar uma fronteira dura em que as partículas começam a fugir de repente.
6. Limitar a força e o deslocamento máximo para preservar a leitura do N. Tratar distância zero sem divisão inválida ou direção indefinida.
7. Aplicar amortecimento no afastamento e no retorno, com tempo entre quadros. Evitar excesso de mola, tremor ou demora que pareça falta de resposta.
8. Ao sair da janela, perder foco, mudar para toque ou desativar a interação, reduzir a influência progressivamente. Não mover o alvo para o centro ou para coordenadas muito distantes como forma de desligar a força.
9. Na reentrada, atualizar primeiro a posição real do mouse e depois reativar sua influência. Não animar um cursor antigo atravessando o N.
10. Em touch, preservar a navegação da página e não criar repulsão persistente a partir de coordenadas antigas. Respeitar movimento reduzido, limitando ou desativando os efeitos decorativos sem esconder a logo.

### Fora desta etapa

Não reposicionar o N novamente, não alterar a curva aprovada na etapa 3 e não mexer no prisma ou cursor visual. Se descobrir uma regressão de coordenadas, corrigi-la de forma localizada antes de calibrar a força.

### Validar

- Cursor parado: N legível, com movimento discreto e sem deriva.
- Aproximação lenta e rápida: influência cresce sem salto na borda.
- Passagem pelo centro de uma partícula: sem explosão, tremor ou valores inválidos.
- Saída, reentrada e perda de foco: retorno gradual e nenhuma força presa.
- Interação enquanto forma/desforma: camadas não disputam a posição.
- Rolagem reversa e movimento reduzido preservam os resultados anteriores.

### Conclusão

Informar onde ficam os parâmetros de oscilação, raio, limite de deslocamento e amortecimento. Explicar como a forma-base é preservada.

## Etapa 5 — estrutura e interação do prisma demonstrativo

### Implementar em sequência dentro desta etapa

1. Confirmar no código atual se persistem os conflitos de IDs/classes relatados. Buscar todas as referências antes de renomear. Não supor que os números de linha do relatório continuam válidos.
2. Unificar HTML, CSS e JavaScript em nomes consistentes, sem IDs duplicados. Se os nomes existentes no CSS/JS forem confirmados, `spatialViewport` e `.spatial-viewport` são candidatos naturais, mas a decisão deve considerar todas as referências reais.
3. Validar primeiro a estrutura estática: perspectiva, alinhamento, dimensões, faces e responsividade. Conferir `transform-style`, recortes por `overflow` e regras sobrescritas quando necessário. A ausência de perspectiva pode explicar parte do defeito visual, mas não é prova de que seja a única causa.
4. Posicionar a instrução visual sobre a cena sem deslocar o prisma. Usar `pointer-events: none` somente na sobreposição decorativa; controles reais continuam interativos.
5. Depois da estrutura validada, adicionar ou corrigir arraste com Pointer Events, aproveitando a lógica existente. Usar captura do ponteiro quando apropriado e tratar `pointerup`, `pointercancel`, perda de captura e perda de foco.
6. Iniciar o arraste a partir da rotação atual para evitar saltos. Usar o identificador do ponteiro ativo e ignorar dedos/botões adicionais que não pertençam ao gesto em andamento.
7. Organizar a prioridade das rotações: durante o arraste, ele controla a interação principal. A inclinação por movimento livre do mouse não deve sobrescrever a orientação do arraste. Se ambas forem mantidas, compor base, inclinação limitada e inércia em um único ponto de escrita.
8. Implementar inércia leve, limitada e amortecida pelo tempo entre quadros. Ao iniciar um novo arraste, interromper ou absorver a inércia anterior sem salto. Evitar retorno forçado inesperado à posição inicial e saltos ao atravessar 360 graus.
9. Desktop: permitir rotação horizontal completa e movimento vertical controlado, sem exigir física complexa. O cursor nativo pode continuar usando `grab`/`grabbing` até a etapa 6.
10. Mobile: priorizar arraste horizontal para girar e gesto vertical para rolar a página. Configurar `touch-action` apenas na área necessária, preservando rolagem e zoom quando compatíveis. Não bloquear os gestos da página inteira para oferecer giro livre em dois eixos.
11. Sem movimento reduzido, manter a interação planejada. Com movimento reduzido, apresentar o prisma corretamente e permitir manipulação direta sem inércia ou movimentos automáticos intensos.
12. Não iniciar loops repetidos em cada movimento do mouse. Pausar trabalho fora de visibilidade quando a arquitetura permitir e retomar sem duplicação.

### Fora desta etapa

Não modificar as partículas do N, o header, o tamanho da seção de formação ou os projetos incorporados. A troca visual do cursor pertence à etapa 6.

### Validar

- Prisma bem enquadrado antes de qualquer interação, em desktop e mobile.
- Começar a arrastar em orientações diferentes, soltar fora da área e arrastar novamente.
- Não haver salto entre hover, arraste e inércia.
- Cancelar o gesto, alternar de janela e retomar sem estado preso.
- No celular, girar horizontalmente e rolar verticalmente a partir da área do prisma.
- Badge não bloqueia a interação; N e header mantêm o comportamento aprovado.

### Conclusão

Informar os nomes definitivos adotados e quais causas do relatório foram confirmadas ou descartadas na versão atual.

## Etapa 6 — cursor do site como único ponteiro e integração final

### Implementar

1. Reutilizar o cursor personalizado existente. Não criar outro ponto/círculo ou um segundo loop para o mesmo efeito.
2. O ponto que representa a posição de clique deve acompanhar as coordenadas reais do mouse, sem atraso perceptível. Um anel decorativo pode seguir com suavização independente.
3. Manter um contrato único de coordenadas de entrada: cursor visual usa o espaço da tela; partículas recebem a conversão validada na etapa 2. Não usar a posição atrasada do anel como origem da repulsão ou dos cliques.
4. Esconder o cursor nativo somente quando o cursor do site estiver ativo, visível e posicionado. Usar uma classe de estado ou mecanismo equivalente e aplicar `cursor: none` apenas às áreas suportadas nesse estado.
5. Não colocar `cursor: none` permanentemente no CSS inicial. Se a inicialização não ocorrer, se o efeito for desativado ou se o componente for desmontado, o cursor nativo deve continuar disponível/ser restaurado. Tratar as falhas detectáveis do componente sem prometer recuperação de todo travamento possível do navegador.
6. Detectar uso de mouse ou dispositivo apropriado, incluindo mudança de modalidade em equipamentos híbridos. Interações por toque não devem deixar um cursor artificial preso na tela. Não decidir isso somente pela largura da janela.
7. Garantir contraste em fundos claros/escuros e visibilidade sobre header, menus e modais da página. O elemento do cursor deve ser decorativo, ignorado por tecnologia assistiva e incapaz de interceptar cliques (`pointer-events: none`). Preservar o foco visível de teclado.
8. Definir estados visuais discretos para links/botões e para o arraste do prisma. Ajustar as regras `grab`/`grabbing` para não fazer a mão nativa reaparecer quando o personalizado estiver ativo. Indicar áreas editáveis quando existirem; usar fallback nativo se necessário para preservar usabilidade.
9. Ao sair da janela, esconder o cursor visual. Ao reentrar, posicioná-lo no mouse real antes de exibi-lo. Não mostrar um deslocamento desde a última posição conhecida.
10. Em movimento reduzido, manter somente a indicação precisa se ela for adequada, eliminando rastro, pulsação e atraso decorativo; ou usar o cursor nativo. Nunca esconder ambos.

### Política para sites incorporados e áreas especiais

- A página principal não recebe automaticamente todos os eventos que acontecem dentro de um iframe. Não prometer cobertura uniforme do cursor apenas com CSS no contêiner pai.
- Não interceptar a interação com iframes por meio de um overlay transparente para manter o cursor personalizado.
- Preservar os projetos incorporados. Ao interagir com uma prévia em que o cursor personalizado não consegue acompanhar o ponteiro, ocultar o cursor visual da página principal e manter o ponteiro disponível dentro da prévia.
- Em iframe de outra origem, não tentar acessar seu DOM contornando restrições do navegador. Não adicionar uma integração entre projetos como parte desta etapa.
- O objetivo de ponteiro único se aplica às áreas controladas da página. Controles do navegador e contextos incorporados com limitações próprias mantêm o comportamento disponível. Registrar as exceções testadas.

### Validação específica do cursor

- Um único ponteiro na área principal, incluindo botões, header e prisma.
- Centro visual coincide com a posição real de clique e com a interação do N.
- Arraste mostra o estado correto e termina mesmo fora do prisma.
- Contraste legível sobre todas as seções e sobre menus abertos.
- Saída e reentrada na janela sem salto ou ponteiro fantasma.
- Sem JavaScript ou com inicialização do cursor desativada para teste: ponteiro nativo disponível.
- Prévia incorporada continua clicável e não deixa o usuário sem ponteiro.
- Uso por toque e teclado funciona sem interferência do efeito decorativo.

## Validação integrada — parte da etapa 6

Executar uma passagem completa após as verificações específicas. Não criar uma sétima etapa para esta validação.

| Cenário | Resultado esperado |
| --- | --- |
| Topo, meio e final da página | Header fixo e visível; nenhuma sobreposição indevida. |
| Âncora e recarga no meio da página | Conteúdo não escondido e partículas inicializadas no estado correspondente. |
| Scroll lento, rápido, interrompido e reverso | Formação/desformação contínuas, sem atraso excessivo. |
| Mouse nos quatro quadrantes do N | Repulsão na região correta, inclusive com o enquadramento deslocado. |
| Mouse parado e saída/reentrada | N legível e vivo; retorno suave; nenhum alvo antigo atravessando a cena. |
| Arraste do prisma e soltura externa | Rotação estável, gesto encerrado e inércia controlada. |
| Mobile e orientação diferente | N sem cortes, menu utilizável e rolagem vertical preservada. |
| Movimento reduzido e teclado | Conteúdo legível, foco visível e efeitos decorativos limitados. |
| Iframes em interação | Sites preservados, cliques funcionais e ponteiro disponível. |
| Aba oculta e retorno | Sem salto exagerado, inicialização duplicada ou animação reiniciada à toa. |

Testar pelo menos em um navegador desktop disponível, em uma largura mobile e com movimento reduzido. Quando disponíveis, conferir Chrome e Firefox e um dispositivo touch real. Diferenciar claramente emulação, teste real e itens não testados.

Para animação, uma captura estática não comprova suavidade. Usar observação durante interação ou gravação curta quando a ferramenta permitir. Verificar o console e executar apenas os comandos de build/lint/teste existentes que sejam pertinentes. Comparar o comportamento de desempenho com a situação anterior e investigar quedas concretas; não aumentar partículas, DPR ou cálculos caros para obter suavidade.

Não criar testes extensos que apenas repitam o código. Se necessário, automatizar verificações pequenas de maior risco, como transformação de coordenadas ou término de gesto. Corrigir regressões de forma localizada, repetindo o teste afetado antes da entrega.

## Riscos transversais e prevenção

| Risco | Prevenção |
| --- | --- |
| Efeitos disputam a posição final | Um ponto de composição; base, oscilação e interação com responsabilidades separadas. |
| Tranco apenas muda de lugar | Verificar continuidade na entrada/saída de cada peso de movimento e na reversão do scroll. |
| Excesso de suavização gera atraso | Inventariar filtros existentes e calibrar uma camada por vez. |
| Partículas nunca terminam de formar | Variações determinísticas e limitadas, com extremos do progresso respeitados. |
| Correção do Y vira inversão de força | Validar o ponto projetado antes de alterar o vetor de repulsão. |
| Geometria muda e o mouse volta a errar | Enquadramento definitivo na etapa 1 e conversão comum validada na etapa 2. |
| Novo código duplica loops ou eventos | Reutilizar ciclo de vida existente e verificar inicialização/limpeza. |
| Cursor bonito, clique impreciso | Ponto principal no mouse real; atraso apenas no elemento decorativo. |
| Fallback deixa usuário sem ponteiro | Esconder o nativo condicionado ao funcionamento do cursor e ao contexto suportado. |
| Arraste bloqueia a navegação touch | Gesto horizontal de rotação, vertical de rolagem e cancelamento tratado. |

## Versão, documentação e entrega de cada etapa

Ler a versão real do componente e seguir o padrão já utilizado no repositório. Atualizar `VERSION` e `CHANGELOG.md` somente quando esses arquivos fizerem parte do fluxo existente e documentar a etapa concluída. Não inventar a versão atual nem usar a versão do `/admin` como se fosse a da vitrine.

Quando houver versionamento semântico simples para correções, usar o próximo patch compatível com as instruções locais. Os textos abaixo são sugestões de descrição, sem número presumido:

| Etapa | Descrição sugerida para o commit |
| --- | --- |
| 1 | preview-vitrine - fixa header e ajusta enquadramento do N |
| 2 | preview-vitrine - corrige coordenadas do mouse nas particulas |
| 3 | preview-vitrine - suaviza formacao e desformacao do N |
| 4 | preview-vitrine - refina oscilacao e repulsao das particulas |
| 5 | preview-vitrine - corrige estrutura e arraste do prisma |
| 6 | preview-vitrine - integra cursor personalizado e valida interacoes |

Ao finalizar cada etapa, responder no modelo do projeto:

1. **Etapa X — nome:** dizer o que foi concluído.
2. **Arquivos .zip baixáveis:** quando o ambiente permitir gerar e disponibilizar o pacote, incluir os arquivos alterados com caminhos relativos à raiz, como `modelos/preview-vitrine/assets/js/...`. Não achatar a estrutura nem incluir caches, dependências ou segredos. Se houver remoções, documentar separadamente, pois extrair um ZIP não apaga arquivos antigos. Se não houver suporte a download, informar isso e listar os arquivos locais alterados, sem inventar um link.
3. **Atualizações:** causa confirmada, comportamento resultante e arquivos envolvidos.
4. **Como testar:** passos específicos, URL usada, verificações realizadas e limitações reais.
5. **Commit recomendado:** mensagem copiável com a versão efetivamente determinada, por exemplo `vX.Y.Z - descrição da etapa`, substituindo o marcador antes de entregar.
6. **Próxima etapa:** identificar somente a seguinte e encerrar a execução atual. Não avançar automaticamente.

Manter um registro breve de progresso neste plano ou no mecanismo já utilizado pelo projeto, sem duplicar sistemas de acompanhamento:

- [x] Etapa 1 — header e enquadramento.
- [x] Etapa 2 — coordenadas do mouse.
- [x] Etapa 3 — formação e desformação.
- [x] Etapa 4 — oscilação e repulsão.
- [ ] Etapa 5 — prisma.
- [ ] Etapa 6 — cursor e integração final.

## Referências técnicas de apoio

Estas referências fundamentam mecanismos gerais; não confirmam o estado atual do código do projeto. Consultar a API compatível com a versão efetivamente instalada.

- [Three.js — damp e amortecimento com tempo entre quadros](https://threejs.org/docs/pages/global.html#damp).
- [MDN — Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).
- [MDN — captura do ponteiro](https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture).
- [MDN — cancelamento do gesto](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event).
- [MDN — propriedade cursor e cursor: none](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/cursor).

## Prompt inicial para o Antigravity

Leia integralmente o arquivo `PLANO_6_ETAPAS_REFINAMENTO_PREVIEW_VITRINE_NEOEFFEX.md` anexado ou presente no projeto e as instruções aplicáveis da raiz e de `modelos/preview-vitrine/`.

Execute somente a ETAPA 1 deste plano: header fixo e sempre visível, com o N ligeiramente mais abaixo. Faça a inspeção inicial prevista, confira o estado atual do Git e implemente as alterações no código existente. Preserve mudanças locais e os requisitos anteriores compatíveis.

Remova a lógica que esconde o header durante a rolagem, ajuste a compensação de sua altura e a navegação por âncoras, e desloque discretamente o N no posicionamento correto da cena, preservando seu tamanho. Use os 24 px visuais apenas como ponto inicial de ajuste no desktop e valide o resultado responsivo.

Mantenha as outras cinco etapas pendentes: não altere ainda coordenadas/força do mouse, curvas de formação, oscilação, prisma ou cursor personalizado. Registre problemas encontrados nessas áreas sem antecipar suas correções. Preserve os sites incorporados e seu carregamento.

Teste a etapa 1 e confira se não houve regressão no layout, nos botões, no menu e nas âncoras. Ao terminar, entregue no modelo descrito no documento, com arquivos alterados, ZIP quando disponível, testes realizados, limitações e commit recomendado com a versão real. Não faça commit, push ou deploy. Encerre após a etapa 1.
