# Plano de desenvolvimento

| Etapa | Versão prevista | Entrega | Estado |
| --- | --- | --- | --- |
| 1 | v0.1.0 | Fundação, estrutura de pastas, HTML semântico e configurações | Concluída |
| 2 | v0.1.1 | Sistema visual, fontes, escala, componentes básicos e variáveis completas | Concluída |
| 3 | v0.1.2 | Cabeçalho e hero com fotografia e composição final | Concluída |
| 4 | v0.1.3 | Tradicionais, fitness, preços, combos e acréscimos | Concluída |
| 5 | v0.1.4 | Como funciona e componente opcional de promoção | Concluída |
| 6 | v0.1.5 | Contato completo, galeria, chamada final e rodapé | Concluída |
| 7 | v0.1.6 | Refinamento mobile, barra do WhatsApp, acessibilidade e movimento | Concluída |
| 8 | v0.1.7 | Conferência integral, testes e preparação para publicação | Preparação técnica entregue; revisão visual pendente |

## Critérios de conclusão da Etapa 1

- Estrutura de pastas preservável no Git, com instruções nas pastas de assets vazias.
- HTML em português com landmarks, hierarquia de títulos e IDs únicos.
- Navegação nativa sem depender de JavaScript.
- CSS e JavaScript separados do HTML.
- Cores centralizadas.
- Contato configurável sem inventar número ou endereço.
- Base utilizável diretamente no navegador e no VS Code.
- ZIP sem `.git`, dependências ou credenciais.

## Direção que deve ser preservada

- Verde-escuro, creme, sálvia e amarelo suave, com contraste entre seções.
- Abertura curta, em caixa alta, com fontes modernas e tamanho moderado.
- Respiro visual por meio de espaçamento, não de fontes gigantes.
- Menu: Tradicionais, Fitness e Como funciona; contato destacado separadamente.
- Combos de 10 como “Mais pedido”, sem promessa automática de melhor custo-benefício.
- Preços sempre legíveis e sem rolagem horizontal.
- Contato explícito com número, Instagram, regiões e formas de recebimento.
- Sem fatos inventados, promoções fictícias ou informações nutricionais não confirmadas.

## Critérios de conclusão da Etapa 2

- Sora e Manrope carregadas de arquivos locais, com suas licenças.
- Escalas de tipografia e espaçamento controladas por variáveis independentes.
- Títulos em caixa alta com tamanhos moderados; textos corridos legíveis.
- Temas creme, papel, sálvia, amarelo suave e verde-escuro aplicados às seções.
- Botões e superfícies com estados consistentes em fundos claros e escuros.
- Cores literais restritas a `variables.css`.
- Verificações de contraste das combinações previstas e integridade dos arquivos.
- Preservação do escopo: não antecipar fotografias, preços nem carrinho.

## Critérios de conclusão da Etapa 3

- Cabeçalho com os três atalhos definidos e Contato separado, escrito por extenso.
- Navegação nativa e visível no celular, sem depender de JavaScript.
- Abertura curta, com título em caixa alta, duas ações e fotografia em perspectiva.
- Texto antes da imagem no celular; duas colunas a partir de 60rem.
- Moldura orgânica e contraste verde, sálvia e creme.
- Imagem ilustrativa identificada, arquivos WebP locais e instruções para substituição.
- Largura/altura declaradas, `srcset`, `sizes` e prioridade de carregamento da foto.
- CSS do cabeçalho e hero separados; nenhuma mudança de dados de contato.
- Validação estática, de imagens e lógica; revisão visual completa permanece nas Etapas 7 e 8.

## Critérios de conclusão da Etapa 4

- Cinco cards com preço individual e 15 combos permanentemente visíveis.
- Destaque apenas para os combos de 10, com “Mais pedido”.
- Total e preço por unidade separados; aproximação explícita no Fitness G de 15.
- Uma coluna no celular, sem carrossel, acordeão ou rolagem horizontal de preços.
- Acréscimos visíveis e consistentes junto às duas categorias.
- Dados em um único JSON, aparência em CSS separado e geração compartilhada.
- Cards já no HTML entregue, inclusive para navegação sem JavaScript.
- Botões após as categorias com o mesmo comportamento seguro do WhatsApp.
- Cabeçalho e abertura aprovados preservados.
- 31 grupos de validação; revisão em navegador ainda pendente.

## Critérios de conclusão da Etapa 5

- “Como funciona” em três passos curtos, com ordem semântica preservada.
- Passos empilhados no celular e em três colunas no desktop.
- Chamada de pedido direcionada ao atendimento, sem formulário ou carrinho.
- Promoção antes dos preços, com fundo amarelo suave e sem pop-up.
- Ativação explícita e textos obrigatórios; nenhuma oferta fictícia preenchida.
- Desativação sem espaço reservado e sem manter textos antigos no componente.
- CSS e lógica isolados, sem alterar dados ou apresentação dos preços permanentes.
- Documentação para ativar, desativar e remover; validade controlada manualmente.
- Cabeçalho, hero, cards e contatos preservados.
- 41 grupos de validação; revisão visual em navegador ainda pendente.

## Critérios de conclusão da Etapa 6

- Contato explícito, antes da galeria, com rótulos e texto legíveis.
- Regiões, retirada e entrega conforme as informações confirmadas.
- Telefone formatado e clicável no contato e rodapé quando configurado.
- Instagram acessível mesmo sem JavaScript, sem feed nem rastreador embutido.
- Campos vazios não inventam dados; links antigos são removidos ao invalidar a configuração.
- Galeria com três imagens locais: uma principal e duas menores, com legenda ilustrativa.
- Fotos em WebP, dimensões declaradas, `srcset` e carregamento adiado.
- Chamada final e rodapé com a identidade aprovada e estilos isolados.
- Crédito da Neoeffex preparado para link HTTPS; URL oficial ainda pendente.
- Cabeçalho, hero, preços, promoção e Como funciona preservados.
- 53 grupos de validação; revisão visual em navegador ainda pendente.

A implementação está concluída; telefone oficial, endereço, horários, URL da Neoeffex, logo e fotos reais ainda dependem de informação do responsável antes da publicação.

## Critérios de conclusão da Etapa 7

- Barra inferior com a mesma configuração de WhatsApp e fallback para contato.
- Espaço reservado conforme altura real, inclusive após carregar fontes e redimensionar.
- Áreas seguras laterais e inferiores; barra no fluxo em telas muito baixas ou sem JavaScript.
- Cabeçalho com quebra de linhas para texto ampliado, sem menu oculto.
- Seções focáveis por âncoras nativas, contorno visível e áreas de toque dos contatos ampliadas.
- Movimento discreto somente no hero e títulos; preços nunca ocultos nem animados.
- Preferência de movimento reduzido respeitada, inclusive ao mudar durante a sessão.
- Nenhum bloqueio de zoom, seleção de texto, rolagem ou histórico de navegação.
- Conteúdo, imagens, paleta e dados comerciais preservados.
- 68 grupos de validação estática e de lógica, sem dependências adicionais.

A implementação da etapa foi validada por código e simulações. A revisão visual, o teste em dispositivos e a avaliação integral de acessibilidade ainda fazem parte da conferência da Etapa 8.

## Entrega da Etapa 8

- Base completa revisada por código, com 82 grupos de validação aprovados.
- Confirmada a sincronização dos preços e mantidos os dados comerciais aprovados.
- Conferidos links, metadados, referências locais e caminhos para raiz/subpasta.
- Atualizada a descrição da página; nenhum domínio, telefone ou fato novo inventado.
- Retirados estilos sem uso dos antigos espaços reservados.
- Adicionado checklist somente de leitura, separado dos testes técnicos.
- Mantidos avisos de pré-publicação e indexação restrita até aprovação efetiva.
- Documentados arquivos de hospedagem, atualização segura e verificações antes/depois da publicação.
- ZIP completo sem repositório Git, dependências, caches ou dados privados.

### Pendências para encerrar a conferência integral

- Revisão visual em navegador e dispositivos reais, incluindo teclado, zoom, movimento reduzido e ausência de JavaScript.
- WhatsApp oficial, URL da Neoeffex e decisão sobre endereço/horários.
- Fotografias reais e logo, ou aprovação explícita da assinatura tipográfica.
- Confirmação final dos preços e informações pela responsável.
- Definição do destino e aprovação para publicação.

O ambiente de prévia disponível não executou este projeto estático; nenhuma avaliação visual foi marcada como aprovada. A publicação não faz parte de uma ação automática deste ZIP. Veja `RELATORIO-ETAPA-8.md` e `PUBLICACAO.md`. Não foi criada uma nona etapa.

## Experimento visual posterior — v0.1.8

- Fundos orgânicos na abertura e nas transições do fitness, com regras em um único CSS e variáveis próprias.
- Ativação por uma classe no `body`, sem JavaScript novo e com retorno ao visual-base ao removê-la.
- Preservados conteúdo, preços, fotos, paleta, tipografia, espaçamentos e comportamento mobile.
- Prevenções para camadas, foco, cliques, promoção, recortes, contraste, impressão e cores forçadas.
- 94 grupos de validação técnica: os 82 anteriores e 12 específicos do efeito.
- Comparação visual em navegador ainda pendente; instruções em `FUNDOS-ORGANICOS.md` e `TESTES.md`.

É um ajuste de design para avaliação, não uma Etapa 9 nem uma publicação automática.

## Variação das formas — v0.1.9

Mantém a organização do experimento e introduz dois volumes no hero, uma onda composta na sua saída, uma curva inclinada na entrada do fitness e outra onda invertida na saída. As alturas e os espaçamentos permanecem iguais. São 96 grupos de validação técnica; a revisão visual da nova variação continua pendente. Não acrescenta uma etapa ao plano original.

## Correção das curvas — v0.1.10

Substitui as uniões de elipses por silhuetas SVG contínuas, incluindo a faixa do fitness. Separa as manchas do hero e preserva a divisão dos estilos, as cores, o conteúdo e o funcionamento. São 102 grupos técnicos, incluindo testes que rejeitam novas pontas nas junções. A revisão em navegador continua pendente. É uma correção do experimento, não uma nova etapa do plano original.

## Elementos decorativos — v0.1.11

Acrescenta broto, haltere e folha discretos em um componente próprio, com SVGs locais e variáveis de aparência. As ondas anteriores permanecem intactas. São 114 grupos técnicos; a revisão visual em navegador continua pendente. Não acrescenta etapa ao plano original nem publica o site. Controles em `DECORACOES.md`.

## Ampliação da decoração — v0.1.12

Remove a linha de solo do broto e acrescenta trigo, tigela e sol em três outras seções. Os seis ícones compartilham o mesmo componente, com controles próprios e bordas alternadas. São 117 grupos técnicos; a revisão visual continua pendente. Não altera o plano original de oito etapas nem publica o site.

## Atualização de animações — etapa 1 — v0.1.13

Prepara a base de movimento sem adicionar os efeitos visuais das próximas etapas. Controles em `config.motion`; aparência em `styles/base/motion.css` e variáveis; ciclo de vida em `scripts/animations.js`. Inclui cancelamento seguro, foco, aba oculta, limpeza de recursos e 20 testes específicos, totalizando 137 grupos técnicos. O guia `ANIMACOES.md` registra as prevenções, o commit desta entrega e o plano independente de seis etapas. Não altera preços, contatos, formas ou imagens, nem publica o site.

## Atualização de animações — etapa 2 — v0.1.14

Acrescenta a abertura em grupos e bubble controlado: título, apoio, botões e foto/broto, em 940 ms no padrão. Novo `hero-intro.js` e `hero-intro.css`, com `motion.intro` e variáveis próprias. A tentativa é única, antes da pintura, sem interromper âncoras, foco, rolagem ou carregamento tardio. Botões ficam imóveis; foto contida; broto conserva rotação e desenho. Inclui cancelamento por interação/preferência e 31 grupos específicos, totalizando 168. A revisão visual permanece pendente. Não altera preços, contatos, SVGs, curvas ou imagens; não faz commits, pushes ou publicação. Próxima etapa: reação discreta dos cards ao mouse.

## Animações — etapa 4 — v0.1.16

WhatsApp informado integrado e pulinho do Fale conosco inicial implementado. Rótulo preserva a estrutura bubble; área clicável/foco estáveis. Motion.contact controla somente o efeito. Quatorze novos grupos, 206 no total e 64 combinações dos controles. Sem envio de mensagem, publicação, commit ou push. Revisão visual/app pendente. Próxima etapa: garfinho até o card tradicional de 400g. ZIP completo sem .git; sem carrinho.

## Animações — etapa 3 — v0.1.15

Destaque dos cinco cards por borda e sombra em 220 ms, sem deslocamento ou escala. CSS isolado, valores em variables.css e controle motion.cards no coordenador existente. Exige hover/ponteiro preciso e respeita acessibilidade. Sem listeners adicionais. Doze grupos novos, totalizando 192; 32 combinações dos controles verificadas. Revisão visual pendente. Próxima etapa: pulinho do contato e integração do WhatsApp informado (etapa 4). Sem garfinho ou carrinho nesta entrega. ZIP completo sem `.git`, sem commit, push ou publicação.

## Complemento da etapa 2 — v0.1.14.2

Foto, borda e contorno animam juntos em uma camada; legenda parada. Sem escala dupla, novo script ou mudança dos botões. Cinco grupos adicionais, totalizando 180; revisão visual pendente. A próxima etapa continua sendo a 3. ZIP completo sem `.git`, sem commit, push ou publicação.

## Complemento da etapa 2 — v0.1.14.1

Adiciona bubble 0,85 → 1,06 → 1 nos dois botões iniciais, por solicitação do usuário. Anima somente a superfície interna, mantendo link, foco e área de toque fixos. Reutiliza o terceiro grupo e os controles da intro, sem scripts novos. Sete grupos adicionais de regressão, totalizando 175. Não antecipa o pulinho ao clicar ou a integração do WhatsApp, previstos para a etapa 4. Próxima etapa continua sendo a 3, com reação dos cards ao mouse. Revisão visual pendente; ZIP completo sem `.git`.
