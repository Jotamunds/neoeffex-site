# Histórico

## v0.1.16 — Etapa 4: WhatsApp e pulinho do contato

- Número informado 5511978766842 integrado a todos os botões de pedido e ao telefone por extenso.
- Fale conosco inicial abre WhatsApp; o rótulo é atualizado sem destruir o span do bubble.
- Pulinho de 4px/280ms na superfície inicial, com WAAPI, controle motion.contact e área clicável estável.
- Cancelamento seguro, sem fila de saltos, espera de navegação, timer ou abertura de janela pelo JS.
- Preferências, saída, impressão e resize cancelam o salto; falha/ausência da API preserva o link.
- Contato sem JavaScript disponível em links estáticos no bloco noscript, com verificação de sincronização.
- Quatorze grupos novos; total de 206 e 64 combinações dos controles. Revisão visual/app pendente.
- Checklist reduzido a quatro pendências automáticas; não houve mensagem enviada ou publicação.
- ZIP completo sem .git; nenhum commit/push executado. Próxima etapa: garfinho.

## v0.1.15 — Etapa 3: destaque dos cards

- Borda e sombra suaves nos cinco cards de preço ao passar o mouse; sem escala ou deslocamento dos preços.
- Novo CSS isolado `card-hover.css` e variáveis `--card-hover-*`, com duração padrão de 220 ms e limite de 300 ms.
- Controle booleano `motion.cards`, independente da abertura, reveal e rolagem, integrado à chave geral.
- Requer ponteiro preciso/hover primários; respeita movimento reduzido, cores forçadas, impressão, aba oculta e destroy.
- Sem eventos por card, scripts extras, dependências, cursor de botão ou foco artificial.
- Doze novos grupos: total de 192; teste de controles ampliado para as 32 combinações. Revisão visual pendente.
- Preservados bubble, imagens, dados, contatos, geradores e curvas. Etapas 4 a 6 continuam planejadas.
- ZIP completo sem `.git`; sem commit, push ou publicação executados.

## v0.1.14.2 — Bubble no conjunto da foto

- Foto, borda e contorno decorativo animam juntos em `.hero__artwork`; a legenda fica fora.
- Removido o alvo da imagem, evitando escala dupla. Mantidos amplitude, duração e sequência.
- Contorno relativo à composição nos dois temas; crescimento ancorado na base, sem recorte do conjunto.
- Preservados recorte interno da foto, botões, acessibilidade, dados, imagens e curvas.
- Cinco novos grupos de regressão: total de 180. Revisão visual em navegador pendente.
- ZIP completo sem `.git`; nenhum commit, push ou publicação executado.

## v0.1.14.1 — Bubble nos botões da abertura

- “Ver preços” e “Fale conosco” recebem bubble 0,85 → 1,06 → 1 na superfície interna, sem animar o link ou o contorno de foco.
- Mantidos o terceiro grupo em 200 ms, a duração de 640 ms e o total de 940 ms da abertura. Não é o pulinho ao clicar da futura etapa 4.
- Variáveis `--intro-button-start` e `--intro-button-peak`, com limites de 0,8–1 e 1–1,08.
- Área de toque fixa cobre o pico máximo; intervalo horizontal comporta a expansão dos botões. Estados de hover/clique continuam ligados aos links.
- Foco, interação, movimento reduzido, impressão e cancelamento restauram o visual normal; sem timers, novos scripts ou alteração de destinos.
- Controlador acompanha os dois alvos separadamente. Sete novos grupos de regressão, totalizando 175.
- Validação de versão aceita o quarto número solicitado. Preços, contatos, imagens, SVGs e curvas preservados.

ZIP completo sem `.git`. Revisão visual em navegador pendente; nenhum commit, push ou publicação executado.

## v0.1.14 — Animações: etapa 2, abertura em grupos e bubble

- Entrada do título, texto de apoio, botões e foto/broto, com intervalo de 100 ms e duração total padrão de 940 ms.
- Bubble 0 → 1,20 → 1 no broto; foto 0,96 → 1,035 → 1 dentro da moldura existente. Botões não mudam posição ou tamanho.
- Removidos os dois `data-reveal` do hero, evitando transformar simultaneamente pais e filhos. Os demais títulos mantêm o efeito anterior.
- Controle `motion.intro`, novo módulo `scripts/hero-intro.js` e estilos isolados em `styles/components/hero-intro.css`; valores em `variables.css`.
- Abertura omitida após pintura, carga tardia, histórico, âncora externa ao início, rolagem ou foco anterior; preferência e aba oculta têm prioridade.
- Interação, impressão, saída, redimensionamento, desativação e erro cancelam a sequência; sem reexecução ao voltar ou reinicializar.
- Sem timers, bloqueio de página, dependência de imagens/fontes ou estilos retidos ao finalizar. Sem JavaScript, tudo permanece visível.
- 31 grupos novos, totalizando 168; contraste da intro conferido inclusive sobre manchas e broto.
- Assets, SVGs, curvas, preços, contatos, promoção e geradores preservados; sete scripts clássicos `defer`, sem bibliotecas novas.

Hover novo, pulinho/WhatsApp e garfinho permanecem planejados. Revisão visual em navegador pendente. ZIP completo sem `.git`; nenhum commit, push ou publicação executado.

## v0.1.13 — Animações: etapa 1, base segura

- Adicionados controles booleanos independentes para entrada suave e rolagem em `config.motion`, além da chave geral.
- Mantida a aparência da entrada: 480 ms, 0,5rem e opacidade inicial 0,9; curva de aceleração e opacidade agora têm variáveis próprias.
- CSS depende de ativação explícita do controlador; sem JavaScript, o conteúdo está visível e a rolagem é instantânea.
- Removida a retenção de `transform` após o fim; classes são limpas no fim, cancelamento, foco, aba oculta e desativação.
- Controlador com `init`, `configure`, `getState` e `destroy`, sem listeners duplicados ou repetição dos elementos já vistos.
- Movimento reduzido e cores forçadas prevalecem; suporte a listeners legados e alternativas seguras para APIs ausentes ou com falha.
- 20 grupos novos em `tests/motion.mjs`; 137 grupos técnicos no total, mantendo os testes anteriores.
- Nenhuma alteração de preços, contatos, imagens, SVGs, curvas, layout ou navegação. Os seis scripts existentes foram mantidos, sem dependências novas.
- Guia `docs/ANIMACOES.md` com riscos, controles, roteiro manual e commit indicado.

Bubble, hover dos cards, pulinho e garfinho ainda não implementados. A revisão visual em navegador continua pendente. ZIP completo sem `.git`; nenhum commit, push ou publicação executado.

## v0.1.12 — Mais três SVGs e broto sem solo

- Removida a linha horizontal inferior do `sprout.svg` e da cópia inline, preservando folhas e caule.
- Adicionados ramo de trigo nas tradicionais, tigela com vegetais em Como funciona e sol no contato.
- Seis ícones no total, distribuídos em bordas alternadas, menores no celular e com cores/medidas por variáveis.
- Reaproveitado `decorations.css`; sem novos estilos nos arquivos das seções ou alterações nas ondas.
- Gerador sincroniza os seis assets; círculos locais são aceitos com validação restrita para o sol.
- 117 grupos técnicos: 82 da base, 20 das ondas e 15 dos ícones. Incluem regressão do broto e verificação dos novos elementos.
- Preservados preços, textos, fotografias, fontes, contatos e funcionamento.

A revisão visual em navegador permanece pendente. Nada foi publicado; ZIP completo sem repositório Git.

## v0.1.11 — Elementos decorativos discretos

- Adicionados broto na abertura, haltere no fitness e folha na chamada final, com ícones locais do Lucide 1.8.0 e licença incluída.
- Novo `styles/components/decorations.css`, sem distribuir estilos nos arquivos de seção.
- Cores, opacidades, tamanhos, posições e inclinações por variáveis `--decoration-*`.
- Classe `decorative-elements` independente das ondas; sem espaços vazios ao desativar.
- Botânicos menores no mobile; haltere oculto abaixo de 60rem. Sem animações novas.
- Recorte somente da moldura decorativa, camadas atrás do conteúdo, sem cliques ou foco.
- SVGs inline sincronizados com `assets/decorations/` pelo gerador local `tools/build-decorations.mjs`; nenhuma biblioteca no navegador.
- Ondas da v0.1.10, preços, fotos, fontes, conteúdo e comportamento preservados.
- 114 grupos técnicos: 82 da base, 20 das ondas e 12 dos ícones. Revisão visual em navegador permanece pendente.

Nada foi publicado. O ZIP é completo e não contém repositório Git.

## v0.1.10 — Correção das pontas nas curvas

- Substituídas as ondas de elipses sobrepostas por SVGs inline com um único contorno cúbico contínuo por onda.
- Tangentes e segundas derivadas coincidem nas junções; controles avançam horizontalmente e evitam cúspides internas.
- Entrada do fitness e sua faixa usam cópias idênticas, sem stroke, máscara externa ou sombra de contorno.
- Separados os limites das manchas do hero no mobile para evitar pontas de interseção; mantida a separação no desktop.
- Cores, medidas e camadas permanecem no CSS isolado; paths decorativos ficam no HTML, fora do cardápio gerado.
- SVGs ocultos por padrão, sem espaço extra ao desligar o efeito, imprimir ou usar cores forçadas.
- Removidas somente as variáveis obsoletas de elipses e raios das transições. Paleta, fontes, preços, fotos, contatos e comportamento preservados.
- 102 grupos técnicos: 82 da base e 20 dos fundos. Incluem continuidade C1/C2, escalas, casos negativos e separação das manchas.

Os testes anteriores conferiam cobertura e contraste, mas não a suavidade das junções. Essa lacuna está coberta por testes geométricos nesta versão. A conferência visual em navegador permanece pendente; não há garantia de renderização baseada apenas nos cálculos. Nada foi publicado.

## v0.1.9 — Formas orgânicas mais variadas

- Redesenhadas as formas do hero com assimetria mais marcada e um segundo volume suave.
- Saída do hero com onda de dois volumes, entrada do fitness com curva inclinada e saída com outra onda de perfil invertido.
- Ondas compostas por gradientes CSS locais; sem SVG, máscara, imagem externa ou dependência nova.
- Mantidas as cores da próxima seção nos três estados da promoção.
- Preservadas altura das curvas, margem de segurança, camada decorativa sem cliques e exclusão em impressão/cores forçadas.
- Mesmo arquivo de estilos e mesma classe de ativação; nenhuma regra distribuída pelos outros componentes.
- Conteúdo, preços, fotografias, fontes, contatos, barra mobile e scripts de funcionamento preservados.
- 96 grupos técnicos: ampliados os cálculos de contraste para sobreposição e adicionados contratos para a segunda forma e para a cobertura das ondas.

A comparação visual desta variação em navegador continua pendente. O pacote anterior permanece como referência da primeira versão dos fundos. Nada foi publicado.

## v0.1.8 — Teste de fundos orgânicos

- Adicionado `styles/components/organic-backgrounds.css`, importado por último e ativado pela classe `organic-backgrounds` no `body`.
- Mantidas todas as regras do efeito nesse arquivo; cores e medidas usam variáveis exclusivas no sistema visual.
- Criada uma mancha verde suave, contida no hero, e refinado o contorno já existente da fotografia.
- Curva de saída da abertura recebe a cor da próxima seção: promoção visível, oculta ou removida, sem JavaScript novo.
- Adicionadas curvas de entrada/saída do fitness e uma faixa sálvia discreta no respiro superior.
- Preservados fundos sólidos, contraste dos textos, cards, preços, fotografias, fontes e dados comerciais.
- Sem recorte do conteúdo, dimensões de layout alteradas, transformação de contêiner global ou interferência na barra fixa.
- Efeito restrito à tela sem alto contraste; impressão e alto contraste usam os fundos anteriores. Sem nova animação.
- Testes ampliados de 82 para 94 grupos, com contratos de escopo, camadas, promoção, geometria e contraste.
- Documentado como desligar, comparar, ajustar e manter o efeito isolado após aprovação.

É um experimento posterior às oito etapas, não uma Etapa 9. A revisão visual em navegador permanece pendente, assim como as condições de publicação da v0.1.7. Nada foi publicado.

## v0.1.7 — Etapa 8

- Revisada a base completa, preservando seções, preços, contatos, fotos, fontes e interações aprovadas.
- Atualizada a descrição da página para destacar preços, combos e regiões atendidas.
- Atualizado o aviso para pré-publicação, mantendo `noindex, nofollow` enquanto houver pendências.
- Removidas somente regras CSS sem uso dos antigos espaços reservados; nenhum arquivo necessário foi excluído.
- Adicionado `tools/check-release.mjs`: checklist de leitura, sem rede, alterações ou publicação automática.
- Separados problemas detectáveis no código das confirmações humanas de dados, imagens e testes visuais.
- Ampliada a validação para 82 grupos, incluindo caminhos para subpastas, links, metadados e o novo checklist.
- Ajustados testes de legendas e textos alternativos para permitir a substituição das fotos, mantendo descrições acessíveis.
- Criados roteiro de publicação e relatório de revisão com resultados e limitações explícitas.
- Mantida a entrega completa, sem `.git`, dependências instaladas ou integração de publicação.

A preparação técnica foi entregue. A revisão em navegador não pôde ser executada no ambiente disponível para este projeto estático; não foi substituída por simulações apresentadas como testes visuais. Dados oficiais, fotos reais e aprovação manual continuam pendentes. O site não foi publicado.

## v0.1.6 — Etapa 7

- Adicionada barra inferior para contato/pedido no celular, com fallback seguro sem telefone.
- Separados aparência em `mobile-order.css` e medição de altura em `mobile-order.js`.
- Reservado espaço real para a barra e consideradas as áreas seguras dos dispositivos.
- Mantida alternativa no fluxo para JavaScript desativado e telas muito baixas; barra omitida no desktop e impressão.
- Refinado o cabeçalho mobile com quebra de linhas para texto ampliado.
- Adicionados destinos focáveis às seções, margens de rolagem e áreas de toque maiores nos contatos.
- Implementada entrada leve e única em hero/títulos, sem ocultar conteúdo ou animar preços.
- Respeitada a redução de movimento, com cancelamento de observadores e ignorando notificações antigas.
- Mantidas navegação e histórico nativos; sem bloqueio de zoom, seleção ou rolagem.
- Preservados cardápio, fotos, fontes, contato, promoção e composição geral.
- Ampliada a validação para 68 grupos, com simulações de APIs separadas em `tests/enhancements.mjs`.

Não houve revisão visual em navegador nesta entrega. A avaliação integral, os dispositivos reais e os dados pendentes de publicação permanecem para a Etapa 8.

## v0.1.5 — Etapa 6

- Finalizado o contato com canais por extenso, regiões, retirada e entrega.
- Adicionado telefone formatado e link `tel:` no contato e rodapé, condicionados ao número oficial.
- Evitado botão sem ação dentro do contato quando o telefone ainda está vazio.
- Mantidos Instagram e dados confirmados de recebimento no HTML para uso sem JavaScript.
- Criada a galeria de uma imagem principal e duas menores, com fotos ilustrativas geradas por IA.
- Adicionados seis WebP locais, `srcset`, dimensões, legenda e carregamento adiado.
- Inserida chamada final com estilos próprios, seguida do rodapé com canais, regiões e crédito.
- Preparado o crédito da Neoeffex para ativação por URL HTTPS, sem inventar endereço.
- Fortalecida a remoção de links inválidos e a rejeição de URLs com credenciais embutidas.
- Preservados preços, fontes, hero, cabeçalho, promoção e Como funciona.
- Ampliada a validação para 53 grupos e documentadas a troca das fotos e a configuração dos contatos.

Telefone, endereço, horários e URL da Neoeffex ainda precisam de confirmação. Fotos ilustrativas devem ser substituídas antes de publicar. A revisão visual em navegador e a barra fixa do WhatsApp continuam para as próximas etapas.

## v0.1.4 — Etapa 5

- Finalizado o “Como funciona” em três orientações curtas, com números discretos e layout responsivo.
- Integrado o botão “Montar meu pedido” ao WhatsApp existente, com fallback para contato.
- Criada a faixa promocional independente, antes dos preços, em amarelo suave e sem pop-up.
- Implementado `scripts/promotion.js`, com ativação estrita e título/descrição obrigatórios.
- Mantida a promoção desativada e vazia, sem inventar oferta, validade ou desconto.
- Garantida a limpeza de conteúdo antigo ao desativar e tolerância à remoção do componente.
- Preservados cabeçalho, hero, imagens, cardápio, gerador e dados de contato.
- Ampliados os testes para 41 grupos e documentada a atualização/remoção da promoção.

A validade da promoção é textual e precisa de desativação manual. Não há carrinho, agendamento, expiração automática nem revisão visual em navegador nesta etapa.

## v0.1.3 — Etapa 4

- Adicionados cinco cards: tradicionais de 300 g, 400 g e 500 g; fitness M e G.
- Incluídos preços individuais, 15 combos e valores calculados por marmita.
- Destacados os combos de 10 como “Mais pedido”, sem promessa de melhor custo-benefício.
- Identificado o arredondamento do Fitness G de 15 como aproximado, preservando o total de R$ 370,00.
- Incluídos avisos de acréscimos junto às duas categorias e botões de contato após os preços.
- Separados os dados em `data/menu.json`, os cálculos/modelos em `tools/` e os estilos nos arquivos próprios.
- Gerados os preços no HTML para consulta sem JavaScript, sem servidor ou dependências de execução.
- Mantidos o cabeçalho, o hero, as imagens e os dados de contato da Etapa 3.
- Ampliada a validação para 31 grupos, incluindo sincronização, arredondamento e todos os botões.

Não inclui ainda promoções, carrinho ou revisão visual em navegador. A informação de 130 g de proteína aguarda esclarecimento e não foi publicada como dado nutricional.

## v0.1.2 — Etapa 3

- Finalizado o cabeçalho com assinatura tipográfica provisória, três atalhos e Contato separado.
- Mantidos os atalhos visíveis no celular, sem adicionar dependências ou menu oculto.
- Criada a composição responsiva da abertura, com texto primeiro no celular e duas colunas no desktop.
- Adicionada uma fotografia ilustrativa gerada por IA, em WebP de 640 e 960 pixels.
- Aplicadas moldura orgânica, contraste sálvia/verde e terminação curva sobre o creme.
- Mantidos título em caixa alta, texto curto, botões e foco fora da área da fotografia.
- Incluídos `srcset`, dimensões e prioridade de carregamento para a imagem principal.
- Adicionadas quatro verificações para estrutura, contato explícito e arquivos de imagem.
- Preservados os dados de contato, scripts e espaços reservados das próximas etapas.

Não inclui ainda os cards de preços nem revisão visual em navegador. A fotografia deve ser substituída por uma imagem real antes da publicação.

## v0.1.1 — Etapa 2

- Adicionadas Sora e Manrope variáveis em WOFF2 local, com licenças.
- Criado o sistema visual: escalas tipográficas, espaçamentos, raios, sombras e duração dos estados.
- Aplicados títulos em caixa alta com tamanhos moderados e parágrafos em caixa normal.
- Separados temas de seção em `styles/base/themes.css`, mantendo as cores em `variables.css`.
- Refinados botões e criada a superfície reutilizável `.surface`.
- Adicionados estados de hover, foco, clique, redução de movimento e alto contraste.
- Atualizadas as verificações para fontes, contraste e temas, sem exigir dados de contato vazios.
- Preservados os IDs, links, informações e comportamento do WhatsApp da Etapa 1.

Ainda não inclui fotografia ou composição final do hero, cards de preços e revisão visual completa em navegador.

## v0.1.0 — Etapa 1

- Criada a estrutura estática do projeto.
- Separados estilos globais, layout, componentes e seções.
- Definidos IDs e âncoras do HTML semântico.
- Centralizadas cores e informações de contato.
- Preparados estados seguros para dados ainda não informados.
- Adicionados padrões de quatro espaços, documentação e validação local.
- Sem framework, dependências, build obrigatório ou publicação automática.

Esta entrega não inclui o design definitivo nem representa as oito etapas concluídas.
