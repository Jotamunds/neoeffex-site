# Lu Leve e Saudável

Animações — Etapa 4: contato e pulinho — v0.1.16.

Projeto estático em HTML, CSS e JavaScript. Esta versão ativa o WhatsApp da Lu (11 97876-6842) e o pulinho do botão inicial, sem atrasar a navegação. Mantém destaque de borda e sombra nos cinco cards ao passar o mouse, com controle independente `motion.cards`. O pacote completo mantém bubble em “Ver preços” e “Fale conosco”: a superfície visual faz 0,85 → 1,06 → 1, com links e foco imóveis. A abertura mantém a ordem título, apoio, botões e foto/broto, em aproximadamente 0,94 segundo. O broto continua com 0 → 1,20 → 1 e foto, borda e contorno crescem juntos, com legenda parada. Preços, fotografias, desenhos SVG e curvas foram preservados. Garfinho e revisão integrada ficam para as próximas etapas. Nada foi publicado.

Leia `docs/ANIMACOES.md` para ligar/desligar os efeitos, ajustar as variáveis, entender as prevenções e consultar o plano das próximas etapas. Os valores visuais ficam em CSS; o JavaScript controla estados e o pulinho via Web Animations API.

A alteração foi verificada por código, cálculos e testes automatizados. A revisão visual em navegador e aparelhos reais continua pendente, junto com a confirmação dos dados oficiais. Veja `docs/FUNDOS-ORGANICOS.md` para comparar os visuais, `docs/RELATORIO-ETAPA-8.md` para o histórico da base e `docs/PUBLICACAO.md` para o roteiro de liberação.

## Comparar com e sem decoração

No `index.html`, esta versão vem com:

```html
<body class="organic-backgrounds decorative-elements">
```

Para retirar apenas os seis ícones e manter as curvas da v0.1.10, remova `decorative-elements` e recarregue:

```html
<body class="organic-backgrounds">
```

As duas classes são independentes. Remova `organic-backgrounds` para desligar as ondas e manchas; remova ambas para voltar ao visual-base v0.1.7. Preserve outras classes locais e os imports CSS. As decorações ocultas não reservam espaço. O número da versão permanece igual. Veja `docs/DECORACOES.md` para os novos controles e `docs/FUNDOS-ORGANICOS.md` para as curvas.

## Abrir no VS Code

1. Extraia o ZIP em uma pasta nova.
2. No VS Code, escolha **Arquivo > Abrir Pasta**.
3. Selecione a pasta `lu-leve-e-saudavel`, que contém o `index.html`.
4. Abra o `index.html` no navegador para visualizar a base.

Não precisa de Node.js, `npm install`, API, banco de dados ou serviço de hospedagem para visualizar. Se já utiliza Live Server, também pode abrir o HTML por ele. Os estilos, scripts, configurações, fontes e fotografias são locais. Sora e Manrope já estão incluídas no ZIP, com suas licenças.

Os scripts carregados pelo navegador são clássicos e usam `defer`, sem módulos ES ou `fetch` de arquivos locais. Por isso, o site também funciona pelo protocolo `file://`. Os preços já estão no HTML: continuam visíveis mesmo sem JavaScript. A pasta `tools/` contém ferramentas de desenvolvimento, não scripts carregados pelo site.

## O que está pronto

- Pastas separadas para imagens, fontes, estilos, scripts, documentação e testes.
- HTML semântico com cabeçalho, conteúdo principal, seções e rodapé.
- Menu com Tradicionais, Fitness e Como funciona; Contato como ação separada.
- Cabeçalho com assinatura tipográfica provisória e atalhos sempre visíveis, inclusive no celular.
- Abertura com texto primeiro no celular, fotografia em perspectiva e duas colunas no desktop.
- Fotografia gerada por IA, identificada como ilustrativa, em duas resoluções WebP leves.
- Moldura orgânica e transição curva para o fundo creme, sem texto sobre a foto.
- IDs e âncoras estáveis para navegação.
- Sistema visual com cores, tipografia, espaçamentos, raios, sombras e durações em variáveis.
- Sora nos títulos e Manrope nos textos, carregadas de arquivos WOFF2 locais.
- Caixa alta nos títulos e rótulos, mantendo os parágrafos em caixa normal.
- Seções contrastantes em verde-escuro, creme, sálvia e amarelo suave.
- Botões e superfícies reutilizáveis, com foco visível e estados de interação.
- Cards das tradicionais de 300 g, 400 g e 500 g e das fitness M e G.
- Preço individual e todos os combos visíveis, com os de 10 destacados como “Mais pedido”.
- Total e valor por marmita com duas casas; indicação de aproximação quando necessário.
- Acréscimos de carne especial e salmão próximos às duas categorias.
- Botões de atendimento depois das tradicionais e das fitness.
- Preços centralizados em `data/menu.json`, com gerador que atualiza somente os trechos do cardápio.
- “Como funciona” com três orientações, números discretos e chamada para o atendimento.
- Botão “Montar meu pedido” que abre o WhatsApp configurado, sem simular um carrinho.
- Promoção opcional em amarelo suave, antes dos preços, sem pop-up ou rolagem bloqueada.
- Exibição da promoção somente com ativação explícita, título e descrição válidos.
- Configuração central dos contatos e comportamento seguro quando o WhatsApp está vazio.
- Campos de endereço e horários ocultos enquanto não forem informados.
- Contato explícito com telefone, Instagram, regiões, retirada e entrega separados por rótulos.
- Telefone legível e link de ligação no contato e rodapé, ativados pelo número configurado.
- Informações de região e links do Instagram disponíveis também sem JavaScript.
- Galeria com uma foto principal e duas menores, sem feed, carrossel ou rolagem lateral.
- Três fotografias ilustrativas geradas por IA, com carregamento adiado e versões WebP locais.
- Chamada final em verde-escuro, com botão de pedido e acesso aos contatos.
- Rodapé com marca, canais, regiões e crédito da Neoeffex, que vira link ao configurar sua URL.
- Barra inferior no celular, com espaço calculado para manter o rodapé acessível.
- Tratamento das áreas seguras de telas com recortes e alternativa para paisagem curta.
- Cabeçalho flexível para texto ampliado, mantendo os três atalhos visíveis.
- Seções com foco nativo por âncora e áreas de toque maiores nos links de contato.
- Entrada leve nos títulos e abertura em grupos no hero, sem ocultar conteúdo essencial nem animar os preços.
- Rolagem suave e respeito à preferência de movimento reduzido do dispositivo.
- Controles `motion.enabled`, `motion.intro`, `motion.reveal` e `motion.smoothScroll`, sem dependências novas.
- Limpeza ao finalizar/cancelar uma entrada, receber foco, ocultar a aba ou desativar o movimento.
- API de configuração e desmontagem que preserva os elementos já vistos e não duplica observadores.
- Checklist local de pré-publicação separado dos testes técnicos.
- Verificação de links, metadados e caminhos relativos para publicação em subpasta.
- Roteiro final de revisão, publicação e atualização segura do repositório.
- Indentação de quatro espaços e configurações básicas para o VS Code.
- Verificador local sem bibliotecas externas.
- Formas orgânicas estáticas e reversíveis, com estilos isolados em `organic-backgrounds.css`.
- Ondas SVG locais com tangentes e curvatura contínuas; testes de regressão contra novas pontas.
- Transições que respeitam a promoção opcional e as cores próprias das seções.
- Controle por variáveis, preservação de contraste e alternativas para impressão/alto contraste.
- Seis ícones vetoriais locais, sem biblioteca no navegador; broto sem a linha de solo.
- Decoração independente, oculta em impressão/cores forçadas; haltere somente a partir de 60rem.
- Hover dos cinco cards: borda e sombra suaves, sem deslocamento, apenas com ponteiro preciso e movimento permitido.
- Abertura em grupos e bubble, com CSS/JS próprios e controle `motion.intro`.
- Bubble nos dois botões iniciais, com superfície visual separada da área clicável e variáveis `--intro-button-start` e `--intro-button-peak`.
- Intro omitida se a página já apareceu, foi aberta por outra âncora, está rolada ou já recebeu foco; interrupção imediata ao interagir.

## O que ainda não está pronto

- Conferência humana do destinatário do WhatsApp, já configurado com o número informado.
- Endereço, horários e URL oficial da Neoeffex.
- Garfinho e revisão integrada: etapas seguintes, ainda não implementadas.
- Conteúdo de uma promoção real, caso a empresa queira ativá-la.
- Logo oficial e fotografias reais dos produtos.
- Revisão visual e responsiva completa, em navegador e aparelhos reais.
- Aprovação da publicação e confirmação do domínio/pasta de destino.

A faixa “Teste de fundos orgânicos · Pré-publicação” é intencional e continua enquanto a revisão estiver pendente. Não há espaços reservados visíveis para seções. A página inclui `noindex, nofollow` para desencorajar indexação antecipada; isso não é proteção de acesso. Não remova esses avisos apenas para fazer o checklist passar.

## Onde alterar cada coisa

| Alteração | Arquivo |
| --- | --- |
| Número do WhatsApp, mensagem, Instagram e atendimento | `scripts/config.js` |
| Ativação e textos da promoção | `scripts/config.js`, objeto `promotion` |
| Comportamento da promoção | `scripts/promotion.js` |
| Aparência da promoção | `styles/components/promotion.css` |
| Cores, famílias de fontes e medidas base | `styles/base/variables.css` |
| Distribuição das cores por seção | `styles/base/themes.css` |
| Carregamento das fontes locais | `styles/base/fonts.css` |
| Tipografia e hierarquia | `styles/base/typography.css` |
| Ordem de carregamento do CSS | `styles/main.css` |
| Estrutura, títulos e textos fora dos blocos de cardápio | `index.html` |
| Preços, tamanhos, combos e acréscimos | `data/menu.json` |
| Estrutura compartilhada dos cards e cálculos | `tools/menu-template.mjs` |
| Atualização dos cards no HTML | `tools/build-menu.mjs` |
| Cabeçalho | `styles/layout/header.css` |
| Abertura | `styles/sections/hero.css` |
| Fotografia da abertura e instruções de substituição | `assets/images/hero/` |
| Categorias | `styles/sections/products.css` |
| Aparência dos cards | `styles/components/price-card.css` |
| Destaque dos cards ao mouse | `styles/components/card-hover.css`; variáveis `--card-hover-*` |
| Aparência compartilhada de superfícies | `styles/components/surfaces.css` |
| Como funciona | `styles/sections/how-it-works.css` |
| Contato | `styles/sections/contact.css` |
| Canais e detalhes de recebimento | `styles/components/contact-card.css` |
| Galeria | `styles/sections/instagram.css` |
| Fotos da galeria e instruções de substituição | `assets/images/instagram/` |
| Chamada final | `styles/sections/final-cta.css` |
| Rodapé | `styles/layout/footer.css` |
| Aparência e breakpoints da barra mobile | `styles/components/mobile-order.css` |
| Medição do espaço da barra | `scripts/mobile-order.js` |
| Ativação geral, entradas e rolagem | `scripts/config.js`, objeto `motion` |
| Aparência das entradas e regras de movimento | `styles/base/motion.css` |
| Aparência e sequência da abertura/bubble | `styles/components/hero-intro.css` |
| Elegibilidade, interrupção e limpeza da abertura | `scripts/hero-intro.js` |
| Pulinho do contato e sua área clicável | `scripts/contact-jump.js`, `styles/components/contact-jump.css` |
| Controle, cancelamento e ciclo de vida dos movimentos | `scripts/animations.js` |
| Guia, prevenções e plano da atualização de animações | `docs/ANIMACOES.md` |
| Testes específicos dos controles de movimento | `tests/motion.mjs` |
| Testes da abertura e simulador de APIs | `tests/hero-intro.mjs`, `tests/intro-fixture.mjs` |
| Checklist de pré-publicação, sem alterações automáticas | `tools/check-release.mjs` |
| Testes de entrega e checklist | `tests/release.mjs` |
| Passos para liberar o site e arquivos a hospedar | `docs/PUBLICACAO.md` |
| Resultados e limitações da revisão | `docs/RELATORIO-ETAPA-8.md` |
| Cores, medidas, camadas e regras responsivas do efeito | `styles/components/organic-backgrounds.css` |
| Desenho das ondas, sem estilos inline | SVGs `.organic-wave` no `index.html` |
| Verificação matemática das curvas | `tests/curve-geometry.mjs` |
| Controle, prevenção de problemas e comparação dos fundos | `docs/FUNDOS-ORGANICOS.md` |
| Ícones decorativos e licença | `assets/decorations/` |
| Estilos isolados dos ícones | `styles/components/decorations.css` |
| Sincronização dos SVGs com o HTML | `tools/build-decorations.mjs` |
| Guia para mudar cor, tamanho, posição e intensidade | `docs/DECORACOES.md` |

Os dados de contato exibidos com JavaScript vêm do `config.js`. Para manter o atendimento sem JavaScript, o HTML também contém cópias estáticas dos dados já confirmados: Instagram, regiões, retirada e entrega; os links do WhatsApp/telefone no bloco noscript do contato também são estáticos. Atualize essas cópias se um desses dados mudar. O verificador aponta divergências. Veja `docs/CONTATOS.md`.

## Configurar o WhatsApp

O pacote já usa `5511978766842`, informado para a Lu. Para alterar, em `scripts/config.js`, preencha `contact.whatsappNumber` com o número oficial brasileiro completo, incluindo `55` e DDD, entre aspas e apenas com dígitos.

- Vazio ou inválido: não abre uma conversa; mantém a ação na seção de contato e mostra o aviso.
- Preenchido em formato válido: mostra o telefone formatado no contato e rodapé, habilita a ligação por `tel:` e ativa os botões com a mensagem configurada.
- Validar o formato não confirma que o número existe ou pertence à empresa. Confira o destinatário antes de publicar.

Endereço, horários, promoção e URL da Neoeffex permanecem vazios/desativados. Não foi inventado nenhum dado para preencher esses campos. O botão do “Como funciona” mostra “Fale conosco” enquanto não existir um número válido; depois passa a “Montar meu pedido”, com a mesma mensagem geral dos outros botões.

O botão dentro da própria seção de contato fica oculto sem telefone, evitando uma ação que apenas volta à mesma seção. Os demais botões continuam levando a `#contato`, onde o Instagram permanece disponível. A chamada final usa “Fale com a Lu” nesse estado.

Para ativar o crédito clicável, preencha `developer.url` com o endereço oficial HTTPS da Neoeffex. Endereço e horários da Lu só aparecem quando preenchidos. Campos inválidos não conservam links antigos. Veja `docs/CONTATOS.md` para todas as configurações e as pendências antes de publicar.

## Barra mobile e movimento

A barra aparece em larguras menores que 48rem. Com JavaScript, fica fixa na parte inferior e sua altura real determina o espaço reservado. Em telas com até 24rem de altura, volta ao fluxo para não consumir a área de leitura. Sem JavaScript, fica no fluxo após o rodapé; no desktop e na impressão, não aparece.

Sem telefone configurado, o botão mostra “Fale com a Lu” e leva ao contato. Com número válido, mostra “Pedir pelo WhatsApp”. Ele usa a mesma configuração dos outros botões.

As animações são opcionais e não escondem conteúdo essencial. A abertura usa grupos próprios; os títulos das outras seções conservam a entrada leve. Preços e acréscimos permanecem sem animação. Em `scripts/config.js`, `motion.enabled: false` desliga os efeitos e a rolagem suave. `intro`, `cards`, `contact`, `reveal` e `smoothScroll` controlam cada um separadamente. Use booleanos sem aspas e recarregue. Não é necessário remover arquivos ou imports.

Para experimentar a abertura, abra `index.html` sem `#tradicionais` ou outra âncora na URL, no topo e sem movimento reduzido. A tentativa acontece uma vez, antes da primeira pintura e até 1,5 segundo após o início da navegação. Se o navegador não oferecer a medição necessária ou o carregamento chegar tarde, o hero fica estático por segurança. Não force o efeito escondendo a página. O console `window.LuLeve.heroIntro.getState()` explica se ele foi executado ou omitido; veja `docs/ANIMACOES.md`.

Movimento reduzido, cores forçadas e impressão mantêm o conteúdo estático. Sem o módulo de animação ou sem JavaScript, a rolagem é instantânea e o conteúdo continua visível. Ocultar a aba cancela entradas em andamento; voltar não repete os elementos já vistos. Os estilos não retêm o `transform` ao terminar. Veja `docs/ANIMACOES.md` e `docs/MOBILE-ACESSIBILIDADE.md` para ajustes e testes manuais.

## Ativar ou desativar uma promoção

Em `scripts/config.js`, use o objeto `promotion`:

- Preencha `title` com o título de uma oferta real.
- Preencha `description` com as condições e a validade, em texto simples.
- Altere `enabled` para `true`, sem aspas, e recarregue a página.
- Para retirar a faixa, volte para `false` e recarregue. Nenhum espaço fica reservado.

Não é necessário rodar o gerador do cardápio. A faixa não modifica `data/menu.json`. Dados incompletos ou ativação escrita como string não exibem a promoção. Sem JavaScript, ela permanece oculta e os preços normais continuam visíveis.

A validade é informativa: **não há agendamento nem expiração automática**. Desative manualmente quando a oferta encerrar. Veja `docs/PROMOCOES.md` para os cuidados e a forma de remover o componente.

## Alterar os preços

1. Edite somente `data/menu.json`. Os valores são centavos inteiros: `1600` significa R$ 16,00 e `15000` significa R$ 150,00.
2. No terminal do VS Code, na raiz do projeto, execute os comandos abaixo.
3. Revise as diferenças e faça commit do JSON e do HTML atualizado.

```bash
node tools/build-menu.mjs
node tests/validate.mjs
```

Node.js é necessário para regenerar os cards, mas não para abrir o site entregue. Nenhum pacote precisa ser instalado. Não edite preços diretamente entre os comentários `MENU:...:START` e `MENU:...:END` do HTML: a próxima geração substitui esses trechos. O valor por marmita é calculado pelo gerador; nunca precisa ser digitado separadamente.

Veja `docs/CARDAPIO.md` para exemplos e regras de arredondamento. Promoções temporárias não devem substituir os preços permanentes desse arquivo.

## Atualizar seu repositório da v0.1.15

1. Salve ou faça commit das alterações que você já realizou.
2. Extraia este ZIP em uma pasta separada para conferir o conteúdo.
3. Copie o conteúdo de `lu-leve-e-saudavel` para a raiz do seu projeto, onde já está o `index.html`. Não crie outra pasta aninhada.
4. Preserve a sua pasta `.git`. Se já alterou contatos ou promoção, mantenha seus dados em `scripts/config.js`. Atualize `version: "0.1.16"`; preserve suas opções de `motion`, contatos e demais configurações. Adicione `contact: true` ao objeto `motion` para explicitar o novo controle; use `false` para desativá-lo. A ausência dessa chave em configurações antigas usa o padrão `true`.
5. Confira `contact.whatsappNumber`: esta entrega usa `5511978766842`. Se mantiver seu config antigo com o campo vazio, preencha-o para ativar a integração. Preserve uma eventual atualização de número que você já tenha confirmado e sincronize o bloco noscript.
6. Confira as diferenças antes de fazer o commit.

O ZIP é completo: inclui as oito etapas originais, as decorações e as etapas 1, 2, 3 e 4 de animações. Não é necessário apagar nenhum arquivo antigo. Se você também alterou HTML, CSS, preços ou outras funcionalidades localmente, compare e mescle; não substitua suas alterações sem revisar. Preserve todas as classes locais do `body`. São oito scripts de runtime: `hero-intro.js` e `contact-jump.js` carregam antes de `animations.js`. Os geradores não mudaram. Não são necessárias dependências ou um novo repositório.

```bash
git diff --stat
git diff
git add .
git commit -m "v0.1.16 - Integra WhatsApp e pulinho do contato"
```

Não execute `git init` novamente se o projeto já for um repositório.

## Começar um repositório, apenas se ainda não houver um

O ZIP não contém pasta `.git`, remoto, histórico, credenciais ou configurações de publicação. Os arquivos `.gitignore` e `.gitattributes` são apenas regras de versionamento, não um repositório.

No terminal do VS Code, dentro da pasta que contém o `index.html`:

```bash
git init -b main
git add .
git commit -m "v0.1.16 - Landing page com contato animado"
```

Depois, conecte ao repositório vazio que você criar no GitHub. Para evitar um histórico inicial diferente, crie esse repositório sem adicionar outro README, licença ou `.gitignore` pelo GitHub.

Ao receber atualizações, preserve a pasta `.git` criada no seu computador. Atualize apenas os arquivos do projeto e confira `git diff` antes de fazer o próximo commit. Este pacote não modifica remotos nem configura publicação automática.

## Verificar a base

Se tiver Node.js instalado, execute na raiz do projeto:

```bash
node tests/validate.mjs
```

O Node.js é usado no desenvolvimento para verificar o projeto e regenerar os cards. Nenhuma dependência precisa ser instalada. São 206 grupos: os 192 anteriores e 14 da etapa do contato. As opções de movimento são verificadas nas 64 combinações. Conferem agrupamento, legenda independente, contorno nos dois temas, escala única, término e cancelamento. Incluem links estáveis, superfície visual, limites de escala/espaçamento, foco, estados de interação, finalização independente e cancelamento dos dois botões. Os testes de curvas, ícones, preços, contatos e demais movimentos continuam ativos. Veja `docs/TESTES.md` e `docs/ANIMACOES.md`. Testes de código não comprovam a renderização em navegador.

## Alterar os ícones de fundo

Ajuste `--decoration-*` em `styles/base/variables.css` para mudar cores, tamanhos, posições, transparência e inclinação. Os detalhes estão em `docs/DECORACOES.md`.

Depois de editar um desenho em `assets/decorations/`, execute:

```bash
node tools/build-decorations.mjs
node tests/validate.mjs
```

Não edite as cópias entre os comentários `DECORATION` no HTML. O comando `node tools/build-decorations.mjs --check` apenas confere a sincronização, sem escrever. Nenhum desses comandos é necessário para visualizar o site.

## Conferir a publicação

```bash
node tools/check-release.mjs
```

Esse segundo comando apenas informa `OK`, `PENDENTE` e `MANUAL`. A versão entregue possui quatro pendências automáticas esperadas: URL da Neoeffex, imagens provisórias, indexação e aviso de pré-publicação. Ele retorna código 1 enquanto existir alguma pendência automática; isso não significa que os testes técnicos falharam. Código 0 também não comprova aprovação humana.

Não altera arquivos, não abre links, não envia mensagens, não executa os outros testes nem publica o site. Siga `docs/PUBLICACAO.md` para resolver as pendências e concluir a conferência manual. O projeto continua sem build obrigatório ou `npm install`.

Veja `docs/SISTEMA-VISUAL.md` para ajustar a aparência sem misturar espaçamento, tipografia e cores.

## Fotografia e marca provisórias

A imagem da abertura e as três da galeria são ilustrativas e foram geradas por IA. Não retratam marmitas reais da empresa nem confirmam embalagem, ingredientes ou porções do cardápio. Não são publicações do Instagram. Substitua pelos produtos reais antes de publicar; as instruções e a origem estão em `assets/images/hero/README.md` e `assets/images/instagram/README.md`. O nome em texto também pode ser trocado pelo logo oficial, sem mudar os atalhos.

As oito etapas originais foram entregues. Esta versão continua uma atualização independente de animações em seis etapas; as quatro primeiras estão implementadas. Compare a abertura e conclua as pendências de revisão e conteúdo antes de publicar. Não há carrinho implementado nesta entrega.
