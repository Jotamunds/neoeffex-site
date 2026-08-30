# Organização do código

## Responsabilidades

| Pasta ou arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Conteúdo e estrutura semântica, sem CSS e eventos inline |
| `data/menu.json` | Fonte única de preços, combos, tamanhos e acréscimos |
| `tools/menu-template.mjs` | Validação, cálculos e geração dos trechos HTML do cardápio |
| `tools/build-menu.mjs` | Atualização local dos trechos marcados, fora do navegador |
| `tools/check-release.mjs` | Checklist de pré-publicação somente de leitura, fora do navegador |
| `assets/images/hero/` | Fotografia principal ilustrativa em WebP, em 640 e 960 pixels |
| `assets/images/products/` | Fotografias dos produtos |
| `assets/images/instagram/` | Três fotografias ilustrativas em seis WebP e instruções de substituição |
| `assets/images/brand/` | Seis logos-fonte renomeados e WebP leve usado no cabeçalho |
| `assets/icons/` | Reserva para ícones funcionais futuros |
| `assets/fonts/` | Sora e Manrope em WOFF2, com licenças e fontes de origem |
| `styles/base/` | Variáveis, fontes, reset, temas, tipografia e movimento global |
| `styles/layout/` | Contêineres, cabeçalho e rodapé |
| `styles/components/` | Botões, superfícies, cards de preço, contato, promoção e barra mobile |
| `styles/components/organic-backgrounds.css` | Formas decorativas opt-in, com camadas e responsividade isoladas |
| `styles/sections/` | Regras específicas de cada seção |
| `scripts/config.js` | Dados públicos editáveis |
| `scripts/main.js` | Inicialização dos contatos, promoção, barra mobile e movimento |
| `scripts/whatsapp.js` | Validação, links do WhatsApp, telefone legível e ligação por `tel:` |
| `scripts/promotion.js` | Exibição segura da faixa promocional independente |
| `scripts/navigation.js` | Reservado para navegação adicional |
| `scripts/animations.js` | Controle de entrada/rolagem, cancelamento e ciclo de vida dos movimentos |
| `scripts/hero-intro.js` | Tentativa única da abertura, elegibilidade, interrupção e limpeza |
| `scripts/fork-highlight.js` | Execução única do garfinho no card tradicional de 400 g |
| `scripts/price-countup.js` | Observação e contagem isolada de valores monetários |
| `styles/components/hero-intro.css` | Aparência da sequência e bubble, sem alterar estilos-base das decorações |
| `styles/components/fork-highlight.css` | Trajeto e halo do garfinho em camada própria |
| `styles/components/price-countup.css` | Algarismos tabulares durante a contagem |
| `tests/hero-intro.mjs` | Contratos e simulações específicos da abertura |
| `tests/intro-fixture.mjs` | Simulador de APIs da abertura; não renderiza CSS |
| `scripts/mobile-order.js` | Medição da altura da barra, sem regras visuais |
| `tests/validate.mjs` | Verificação estática e testes de lógica, sem dependências |
| `tests/enhancements.mjs` | Testes isolados da barra, foco e movimento, chamados pelo verificador |
| `tests/release.mjs` | Testes de entrega, links, metadados, caminhos e checklist |
| `tests/organic-backgrounds.mjs` | Contratos e cálculos dos fundos orgânicos, chamados pelo verificador |
| `tests/curve-geometry.mjs` | Parser restrito e validação de continuidade dos paths, apenas no desenvolvimento |
| `assets/decorations/` | Ícones SVG locais, origem e licença |
| `styles/components/decorations.css` | Camadas decorativas independentes, antes do CSS das ondas |
| `tools/build-decorations.mjs` | Atualiza somente os blocos DECORATION do HTML |
| `tests/decorations.mjs` | Geração, isolamento e contraste dos ícones |
| `docs/DECORACOES.md` | Controles e ativação dos elementos decorativos |
| `docs/FUNDOS-ORGANICOS.md` | Ativação, ajuste, reversão e roteiro de comparação do efeito |

## Estilos

`index.html` carrega apenas `styles/main.css`. Esse arquivo importa, nesta ordem: variáveis, fontes, reset, temas, tipografia, movimento, layout, componentes, seções o componente de ícones decorativos e, por último, o componente experimental de fundos orgânicos. Não coloque regras de aparência no arquivo agregador. Os dois preloads no HTML antecipam os mesmos arquivos de fontes referenciados no CSS.

As cores ficam em `variables.css`. Os demais arquivos usam `var(--color-...)`, `currentColor` ou `transparent`. Não use cores literais espalhadas pelo projeto.

Use nomes de classes ligados ao componente, por exemplo `.price-card`, `.price-card__total` e `.price-card--featured`. Evite seletores globais como `section div` ou `button` em arquivos de seção. A divisão dos arquivos reduz o alcance das alterações, mas não elimina a necessidade de testar a cascata do CSS.

As media queries ficam junto do componente ou seção que elas alteram. O cabeçalho e o hero passam ao layout desktop em 60rem. Isso evita um arquivo responsivo paralelo desatualizado.

Os temas alteram papéis de cor, como `--text-color`, `--button-background` e `--surface-background`. As seções consomem esses papéis, sem repetir as regras de botões para cada fundo. Use temas em seções irmãs; a configuração atual não foi projetada para alternar temas aninhados.

O arquivo `docs/SISTEMA-VISUAL.md` detalha os papéis, a tipografia e as combinações previstas. Os cards usam uma coluna no celular, duas para fitness a partir de 48rem e três para tradicionais a partir de 64rem. O conteúdo permanece no fluxo, sem carrossel ou rolagem interna.

### Fundos orgânicos isolados

Todas as regras do efeito ficam em `styles/components/organic-backgrounds.css`; os valores `--organic-*` ficam em `styles/base/variables.css`. Os seletores que exibem o efeito exigem a classe `organic-backgrounds`, entregue no `body`. A única exceção é `.organic-wave { display: none; }`, que impede espaço de SVG sem o efeito, na impressão e em cores forçadas. Retirar somente essa classe restaura os fundos e o contorno anteriores, sem mudar JavaScript, cards ou contatos. Os ícones decorativos usam outra classe, `decorative-elements`; remova ambas para retornar ao visual-base sem nenhum experimento. Aprovar o efeito não exige espalhar suas regras pelos arquivos antigos.

As manchas são pseudo-elementos; as ondas são SVGs decorativos inline com `aria-hidden="true"` e `focusable="false"`. Ambos ficam sem eventos de ponteiro, em camadas locais. As curvas pertencem à seção que chega e usam seu próprio `--section-background`, ocupando parte do espaço inferior já existente da seção anterior. Seletores de irmãos distinguem promoção visível, oculta e removida; não há nova lógica em `promotion.js`.

Na v0.1.10, cada onda tem um único path preenchido com curvas Bézier contínuas. Há cinco SVGs: duas cópias alternativas na saída do hero, duas sobrepostas com a mesma geometria na entrada do fitness (faixa e superfície) e uma na saída do fitness. Os paths ficam no HTML, fora dos marcadores do cardápio; cores, posição, opacidade e medidas ficam no CSS. Não há máscara, stroke, arquivo SVG externo ou JavaScript novo. As duas manchas do hero têm limites separados para evitar interseções.

O efeito não aplica recorte, transformação ou ocultação de overflow a contêineres globais. `overflow: hidden` limita apenas cada SVG decorativo ao seu próprio viewport. Atua somente em tela sem cores forçadas e não adiciona movimento. Se mudar a ordem das seções, os espaços verticais ou os temas, reveja os seletores e os testes: esses são contratos explícitos da decoração. Detalhes em `docs/FUNDOS-ORGANICOS.md`.

### Ícones decorativos independentes

A v0.1.12 contém seis SVGs de ícones em molduras `.section-decoration`, separados dos cinco SVGs de ondas. O broto está sem a linha de solo; trigo, tigela e sol complementam os elementos da v0.1.11. A classe `decorative-elements` controla esses ícones. O CSS novo mantém posição e isolamento nas seis seções; somente a moldura decorativa recebe recorte e somente o ícone recebe rotação. Não aplica clipping ao conteúdo nem às ondas.

As fontes ficam em `assets/decorations/`; `tools/build-decorations.mjs` sincroniza suas cópias inline nos blocos `DECORATION` do HTML, sem dependência no navegador. Isso permite cores por `currentColor` e uso local sem referências SVG externas. O gerador aceita apenas paths e círculos no formato restrito; o círculo do sol é validado sem aceitar eventos, links ou estilos. As regras de estilo ficam em `decorations.css`, com valores `--decoration-*` centralizados. Veja `DECORACOES.md`.

## JavaScript

Os scripts carregados usam `defer` na ordem `config.js`, `whatsapp.js`, `promotion.js`, `mobile-order.js`, `hero-intro.js`, `contact-jump.js`, `fork-highlight.js`, `price-countup.js`, `animations.js`, `main.js`. Cada arquivo isola seu escopo em uma função e expõe somente o necessário em `window.LuLeve`.

Essa escolha mantém a abertura direta do HTML, sem depender de um servidor para módulos ES. `navigation.js` continua reservado e não é carregado: as âncoras e o histórico são nativos, com a rolagem suave definida em CSS.

Não coloque aparência no JavaScript. Prefira classes para estado visual e `data-*` como pontos de integração. Use `textContent` para inserir textos de configuração.

A única medida escrita pelo JavaScript é `--mobile-order-height`, na raiz do documento. Ela representa a altura real da barra, não uma regra de cor ou layout. A posição, os breakpoints e o espaço aplicado pertencem ao CSS.

## Dados e geração do cardápio

`data/menu.json` guarda centavos inteiros. `tools/menu-template.mjs` valida os dados, calcula o preço por unidade, escapa textos e produz a mesma estrutura para todos os cards. `tools/build-menu.mjs` lê esses dados e substitui apenas as regiões `MENU:tradicionais` e `MENU:fitness` do HTML.

Esses módulos `.mjs` rodam somente no Node.js, durante uma edição. Não são carregados pelo navegador. O HTML gerado faz parte do pacote e deve ser versionado junto com os dados; assim, o consumidor consulta os preços até sem JavaScript. O modo `--check` e os testes detectam uma geração esquecida. Veja `docs/CARDAPIO.md`.

## Promoção e orientação do pedido

`promotion.js` usa apenas `config.promotion` e os elementos do bloco `data-promotion`. Exige `enabled === true` e dois textos não vazios. A marcação começa oculta, e a desativação também limpa os textos anteriores. Não há leitura de preços, chamadas de rede, HTML dinâmico executável, agendamento ou persistência no navegador.

O `main.js` inicializa os links do WhatsApp e depois a promoção. Remover o bloco promocional não interrompe o restante da página. A documentação `docs/PROMOCOES.md` descreve a ativação e os limites de validade manual.

O “Como funciona” é uma lista ordenada de três orientações no HTML. Sua apresentação fica em `styles/sections/how-it-works.css`: uma coluna no celular e três a partir de 60rem. O botão reutiliza `data-whatsapp`; não existe formulário ou seleção de produtos nessa seção.

## Contato, galeria e fechamento

O contato separa canais e recebimento. `styles/sections/contact.css` organiza a seção; `styles/components/contact-card.css` controla seus detalhes. O layout usa uma coluna até 60rem. Os dados continuam em `config.js`, com cópias estáticas de Instagram, regiões, retirada e entrega no HTML para uso sem JavaScript. `docs/CONTATOS.md` explica como mantê-las sincronizadas.

O telefone clicável usa `data-contact-phone-link`, com `tel:+` e o mesmo número validado do WhatsApp. Sem número válido, o link fica oculto e sem `href`; `data-contact-phone-fallback` apresenta o aviso por escrito. O bloco `data-whatsapp-only` dentro do contato só aparece quando há destino válido. Os demais botões continuam com fallback para `#contato`.

`main.js` atualiza Instagram, dados opcionais e crédito, usando texto literal e apenas URLs HTTPS sem credenciais embutidas. Apagar ou invalidar o Instagram remove também o destino anterior. O crédito fica como texto quando `developer.url` está vazio. Nenhum link é enviado ou aberto automaticamente.

`styles/sections/instagram.css` organiza uma imagem principal e duas menores: a principal ocupa toda a primeira linha no celular e duas linhas à esquerda a partir de 48rem. As fotos são `<img>` locais com `loading="lazy"`, `srcset` e dimensões. A legenda fica fora da área recortada. Não existe JavaScript de galeria, feed externo, iframe, carrossel ou lightbox.

`styles/sections/final-cta.css` cuida somente da chamada final. O rodapé tem estilos em `styles/layout/footer.css`; telefone, Instagram, regiões e ano usam os mesmos pontos de integração dos contatos. O crédito permanece discreto.

## Contrato de navegação

| Ação | Destino |
| --- | --- |
| Marca / Início | `#inicio` |
| Tradicionais / Ver preços | `#tradicionais` |
| Fitness | `#fitness` |
| Como funciona | `#como-funciona` |
| Contato / Fale conosco | `#contato` |
| Pular para o conteúdo | `#conteudo` |

Preserve os IDs para não quebrar links. Se um ID mudar, atualize todos os links e execute o verificador.

O cabeçalho usa navegação nativa, sempre visível. Não precisa carregar `navigation.js`. A fotografia e o texto são elementos separados; os controles não se sobrepõem à imagem. O HTML traz o texto antes da foto para manter essa ordem no celular.

## Fotografia da abertura

`index.html` referencia dois arquivos da mesma imagem em `srcset`. O atributo `sizes` orienta a escolha pelo navegador. Os arquivos mantêm proporção 1:1; o CSS usa `object-fit: cover` dentro da moldura 4:3 no celular e 1:1 no desktop. A imagem tem prioridade alta e não usa carregamento adiado. A legenda indica seu caráter ilustrativo.

Ao trocar a fotografia, siga `assets/images/hero/README.md` e atualize as duas resoluções, o texto alternativo e as dimensões se necessário. Não use uma captura de tela da página como imagem da abertura.

## Dados pendentes

A etapa 4 configura o WhatsApp informado, 5511978766842, em config.contact. O módulo whatsapp.js mantém o span animável ao atualizar o rótulo. O bloco noscript do contato tem cópia estática do telefone/WhatsApp e precisa acompanhar futuras trocas. Endereço, horários e URL da Neoeffex continuam pendentes. Nenhum contato foi reaproveitado de dados pessoais alheios ao projeto.

Não há promoção ativa nem afirmações nutricionais na base. Os preços e pesos do briefing já aparecem nos cards. A informação “130 g de proteína” continua pendente de esclarecimento e não foi apresentada como dado nutricional.

## Limites até esta etapa

Não foram adicionados carrinho, pagamento, montagem de pedido dentro do site, formulário, analytics, rastreadores, feed automático, backend ou integração com GitHub. Todas as seções, a barra mobile e o movimento leve estão implementados; a promoção está pronta, mas desativada. A preparação técnica da Etapa 8 foi entregue; revisão visual e aprovação de publicação continuam pendentes.

## Contato — etapa 4

contact-jump.js usa Web Animations API somente na superfície interna do Fale conosco inicial. O coordenador chama configure/destroy; nenhuma animação controla a navegação. O módulo cancela a intro antes do salto e substitui o salto anterior em cliques rápidos. Sem WAAPI, só o efeito é omitido. Altura/duração ficam em variables.css; contact-jump.css reserva a área clicável. Não há timers, janelas abertas pelo JS ou dependências. Dez scripts clássicos `defer`; links de pedido continuam independentes do coordenador.

## Cards — etapa 3

`card-hover.css` aplica borda/sombra somente aos filhos `.price-card` de `.products__grid`. As capacidades do ponteiro e as preferências são avaliadas pelo CSS; `animations.js` apenas publica a permissão `data-motion-cards`, sem eventos por card. Nenhum transform ou wrapper foi adicionado. As variáveis `--card-hover-*` ficam em `variables.css`. O controle `cards` é independente; ausência na configuração antiga usa o padrão true. Desativar a permissão remove também a transição, restaurando imediatamente a superfície-base. Conteúdo, medidas e gerador do cardápio não mudam.

## Aprimoramentos mobile

`mobile-order.js` adiciona `has-mobile-order` à raiz somente quando pode medir a barra. `ResizeObserver`, redimensionamento da janela e carregamento das fontes atualizam a reserva de altura. Sem o observador, continuam os eventos de janela e fontes. Em posição estática ou oculto no desktop, o componente informa altura reservada zero. Inicializações repetidas não duplicam observadores.

`animations.js` observa apenas elementos com `data-reveal`, agora fora do hero, e coordena os módulos opcionais. É configurado por `main.js` a partir de `config.motion`. Os controles `enabled`, `intro`, `cards`, `contact`, `fork`, `prices`, `reveal` e `smoothScroll` são independentes dos dados comerciais. Somente valores booleanos verdadeiros ativam opções explicitamente fornecidas. A configuração não é reescrita em execução.

Os atributos próprios `data-motion-intro`, `data-motion-cards`, `data-motion-fork`, `data-motion-prices`, `data-motion-reveal` e `data-motion-scroll` são adicionados à raiz somente em execução; não transformam a raiz nem mudam classes de outros módulos. A base fica em `styles/base/motion.css`; cada efeito visual tem seu componente. Não há estado-base invisível, atraso de navegação ou transformação de seções/ondas. Sem os módulos, o conteúdo é estático e a rolagem instantânea.

`hero-intro.js` tenta iniciar uma única vez, antes da pintura, sem aguardar imagens ou fontes. Verifica carga tardia, APIs, âncora, histórico, rolagem, foco e alvos efetivamente animáveis. A classe `is-intro-running` é somente um seletor dos filhos: não aplica transform ao hero. Somente o broto decorativo parte de escala zero, conservando sua rotação; na v0.1.14.2, foto, borda e contorno animam juntos em `hero__artwork`, com legenda fora da camada; os botões não deslocam a área clicável. A intro tem listeners próprios apenas enquanto ativa, canceláveis por interação, resize, impressão, saída e pelo coordenador. `stop` e `destroy` não apagam o histórico da tentativa. Não há timers ou nova dependência.

Um `WeakSet` evita repetição. `init` é idempotente; `configure` altera opções sem duplicar observadores; `getState` devolve uma cópia dos estados efetivos; `destroy` remove listeners, observador e marcas próprias, preservando o histórico de entradas vistas. Fim/cancelamento da animação, foco, aba oculta ou bloqueio por preferência limpam o estado visual. Callbacks de observadores antigos são ignorados. Listeners modernos e legados da preferência são suportados; o CSS também protege movimento reduzido, cores forçadas e impressão. Sem APIs ou com falha visual, o conteúdo permanece legível. Veja `ANIMACOES.md`.

O cabeçalho usa flex com quebra no mobile e grid a partir de 60rem. Os destinos das âncoras têm `tabindex="-1"`, sem entrar artificialmente na sequência de Tab. `scroll-padding` leva em conta a barra inferior. Veja `docs/MOBILE-ACESSIBILIDADE.md`.

Na v0.1.14.1, cada botão inicial é um link `hero__action` com um span `button hero__action-visual`. O span recebe `data-intro="action"` e o bubble; o link reserva o tamanho e mantém foco e interação. Um pseudo-elemento fixo cobre o pico de escala. A estrutura e os estados ficam em `hero.css`, sem alterar `buttons.css`. O controlador acompanha os dois spans separadamente, usando os mesmos eventos e controles. Com o WhatsApp integrado, preserve essa camada interna: não substitua todo o texto/conteúdo da âncora.

## Pré-publicação

`tools/check-release.mjs` lê somente o HTML e os scripts locais de configuração/telefone. Reutiliza a normalização do WhatsApp, sem duplicar sua regra. A função `reviewRelease` separa a análise dos arquivos e permite testes em memória. O comando não é carregado pelo site, não grava arquivos e não usa rede.

Pendências automáticas e itens de revisão humana são separados. Um resultado sem pendências automáticas não confirma fotos reais, titularidade de telefone, correção comercial, acessibilidade ou publicação. Não há sinalizador JavaScript que remova `noindex`: a liberação é uma edição explícita do HTML depois da revisão documentada.

O pacote de desenvolvimento contém os dados e ferramentas de manutenção. A hospedagem precisa apenas de `index.html`, `styles/`, `scripts/` e dos assets usados, preservando caminhos e licenças. Não existe build obrigatório. Consulte `docs/PUBLICACAO.md`.
