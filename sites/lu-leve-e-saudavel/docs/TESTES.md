# Verificação técnica — v0.1.16

A etapa 2 trouxe 31 grupos em `tests/hero-intro.mjs`; a v0.1.14.1 acrescenta mais 7 para o bubble nos botões. A v0.1.14.2 acrescenta 5 grupos para estrutura, contorno, escala única e ciclo de vida do conjunto da foto. O simulador fica em `tests/intro-fixture.mjs`. A v0.1.15 implementa hover nos cards, com 12 grupos em `tests/card-hover.mjs`. A v0.1.16 implementa WhatsApp e pulinho, com 14 grupos em `tests/contact-jump.mjs`. O garfinho ainda não foi implementado. Confira o roteiro específico em `ANIMACOES.md`. A validação desta etapa é de código, cálculos e simulações; nenhuma conferência visual em navegador foi executada nesta entrega.

Para conferir os novos ícones, execute também `node tools/build-decorations.mjs --check`. No navegador, compare as quatro combinações das classes `organic-backgrounds` e `decorative-elements`; abaixo de 60rem o haltere deve desaparecer, e os botânicos devem ficar menores. Confira ausência de rolagem lateral, cliques/foco livres e nenhuma interferência com preços, foto ou curvas. O roteiro completo dos elementos está em `DECORACOES.md`. Essa revisão visual ainda não foi executada.

## Verificador automatizado

Execute `node tests/validate.mjs` na raiz do projeto. Usa somente módulos nativos do Node.js, não acessa a rede e não modifica os arquivos.

Os 206 grupos conferem 82 contratos da base, 20 para os fundos orgânicos, 15 para os ícones decorativos, 20 para os controles de animação, 43 para a abertura, os botões e o conjunto da foto, 12 para o destaque dos cards e 14 para o contato:

- IDs únicos, destinos das âncoras e hierarquia mínima do HTML.
- Contato escrito por extenso, separado dos três atalhos do cabeçalho.
- Texto antes da fotografia, legenda e texto alternativo descritivo, compatíveis com a futura troca por fotos reais.
- Dimensões WebP, integridade do contêiner e descritores do `srcset`.
- Contratos CSS de layout mobile-first, sem ocultar navegação ou forçar altura de tela.
- Referências locais de CSS e JavaScript.
- Imports do CSS sem arquivos ausentes ou ciclos.
- Variáveis CSS declaradas e cores literais apenas no arquivo de variáveis.
- Fontes WOFF2 locais, arquivos de licença, preloads e `font-display: swap`.
- Contraste mínimo de 4,5:1 nas 16 combinações textuais previstas.
- Temas aplicados por seção, foco e redução de movimento.
- Ausência de estilos e eventos inline no HTML entregue; a medida dinâmica da barra é uma variável CSS escrita em execução.
- Sintaxe dos scripts e ordem de carregamento.
- Formatação, mensagem e fallback do WhatsApp.
- Campos opcionais ocultos e preenchimento dos contatos.
- Proteção básica contra links de protocolo inseguro.
- Indentação de quatro espaços nos arquivos de código.
- Preços em centavos, arredondamento e indicação de aproximação.
- Rejeição de dados inválidos, IDs repetidos e combos fora de ordem.
- Escape de textos do cardápio para evitar injeção de HTML.
- Sincronização do JSON com o HTML e idempotência da geração.
- Preservação das seções fora dos marcadores e rejeição de marcadores inválidos.
- Contagem dos cards, combos, destaques e avisos, sem conteúdo oculto.
- Layout dos preços e valor por marmita em tamanho de corpo.
- Ativação e fallback de todos os botões de pedido, não apenas do primeiro.
- Três orientações sem formulário e chamada de pedido encaminhada ao atendimento.
- Promoção antes dos preços, oculta inicialmente e mantida no fluxo da página.
- Ativação estrita, textos obrigatórios, limpeza ao desativar e tolerância à remoção do bloco.
- Inserção de texto literal, sem interpretar HTML fornecido na configuração.
- Integração da promoção sem modificar dados de contato, cardápio ou arquivos.
- Contato por extenso e informações de recebimento, com dados pendentes ocultos.
- Galeria de três fotos ilustrativas e seis WebP com dimensões e `srcset` corretos.
- Carregamento adiado das fotos da galeria, sem feed ou dependência externa.
- Ordem de contato, galeria e chamada final, com crédito e canais no rodapé.
- Contratos CSS de empilhamento do contato, galeria, chamada final e rodapé.
- Sincronização das cópias estáticas de Instagram e recebimento com o `config.js`.
- Ativação e limpeza dos links `tel:` em todos os locais, com fallback legível.
- Remoção dos destinos antigos do Instagram e rejeição de credenciais em URLs.
- Ativação do crédito HTTPS e retorno a texto quando a URL é removida.
- Endereço e horários com texto literal, que voltam a ficar ocultos quando apagados.
- Sincronização dos textos repetidos no contato e rodapé e do ano corrente.
- Barra mobile com rótulo legível, fallback e posição após o rodapé no HTML.
- Âncoras focáveis sem bloquear navegação, zoom ou histórico.
- Contratos CSS de área segura, reserva inferior, paisagem curta e impressão.
- Ausência de preços animados ou conteúdos escondidos pelo movimento.
- Áreas de toque nos contatos e cabeçalho flexível com texto ampliado.
- Medição da barra, carregamento de fontes, redimensionamento e inicialização idempotente.
- Liberação do espaço no desktop/fluxo e rejeição de medidas inválidas.
- Alternativas sem APIs de observação, sem componente ou sem movimento.
- Efeito aplicado uma única vez e respeito à preferência de movimento reduzido.
- Cancelamento e rejeição de notificações antigas após mudar a preferência.
- Ausência de rede, timers, persistência, bloqueio de rolagem ou HTML dinâmico nos aprimoramentos.
- Metadados coerentes com o cardápio e identificação da versão na documentação.
- Segurança dos links em nova aba e caminhos locais relativos para raiz/subpasta.
- Recursos CSS existentes, com caixa correta dos nomes, sem dependência externa.
- Ausência de serviços incorporados, ferramentas de desenvolvimento no HTML e estilos de placeholders sem uso.
- Checklist de pré-publicação com pendências automáticas separadas das confirmações humanas.
- Rejeição de telefones inválidos, URLs inseguras e promoção incompleta no checklist.
- Diretivas de indexação identificadas independentemente da ordem dos atributos; comentários ignorados.
- Revisões humanas preservadas mesmo quando não há pendências automáticas.
- Tolerância a configuração incompleta, sem inventar nem modificar dados.
- Execução do checklist fora da pasta do projeto e rejeição de argumentos de publicação.
- Import único e final do efeito, dependência da classe de ativação e ausência de JavaScript novo.
- Escopo dos seletores, variáveis exclusivas e preservação das regras dos conteúdos e componentes.
- Exclusão das formas na impressão e em cores forçadas, sem novas animações.
- Camadas isoladas, decoração sem cliques e contorno da foto sem modificar sua animação.
- Transição com a cor da seção seguinte para promoção visível, oculta ou removida.
- Uso dos fundos atuais do fitness e do Como funciona, com faixa apenas na borda.
- Curvas sem largura extra e com pequena sobreposição para cobrir a emenda.
- Cálculo de altura das curvas dentro dos espaços existentes, em dez larguras e três tamanhos de fonte.
- Cálculo de contraste dos textos do hero sobre as formas, inclusive na sobreposição e nos extremos de opacidade.
- Segunda forma com a mesma cor de apoio, posicionamento interno e regras mobile/desktop explícitas.
- Cinco SVGs decorativos locais, sem foco, scripts, referências externas ou contorno por stroke.
- Três perfis de onda; cópias idênticas nos estados da promoção e na faixa do fitness.
- Tangentes e segundas derivadas contínuas nas junções; controles X sempre crescentes.
- Controles dentro do SVG e fechamento apenas nas laterais e na base.
- Continuidade sob escalas positivas em dez larguras, cinco alturas e três fatores de zoom (cálculo, não renderização).
- Casos negativos: tangente quebrada, curvatura quebrada, controle parado/invertido, comandos inválidos e fechamento incorreto.
- Manchas do hero separadas no mobile e desktop, sem interseção de contornos.
- SVGs das ondas antes do conteúdo, fora dos blocos gerados e ocultos por padrão.
- Ícones locais com origem/licença e cópias inline sincronizadas com os assets.
- Gerador idempotente que altera somente os blocos `DECORATION`; argumentos e SVGs inadequados rejeitados.
- Camadas decorativas independentes, recorte/rotação restritos aos ícones e nenhum script de desenho ou carregamento remoto de SVG.
- Decoração oculta sem a classe, na impressão e em cores forçadas; haltere somente em desktop.
- Contraste dos textos mesmo com traços sobre o fundo e integração entre cinco ondas e seis ícones.
- Broto com folhas/caule preservados e sem barrinha inferior no asset ou no HTML.
- Círculo local do sol validado; raio inválido, atributos extras e eventos rejeitados.
- Trigo/sol posicionados à esquerda e tigela à direita, dentro das respectivas molduras.
- Configuração de movimento com chave geral e controles independentes, aceitando true/false sem exigir que estejam ligados.
- CSS dependente de ativação em execução, sem estado-base oculto ou retenção de transformações.
- Inicialização idempotente e configuração parcial sem reiniciar efeitos não relacionados.
- Rejeição de valores inválidos e cópia independente dos estados retornados.
- Limpeza ao terminar/cancelar a animação, foco, aba oculta, desativação e desmontagem.
- Preferências de movimento/cores forçadas, eventos legados e proteção contra callbacks antigos.
- Alternativas para APIs ausentes ou com falha, raiz/alvos ausentes e preferência sem eventos.
- Preservação de classes, atributos e medidas pertencentes a outros componentes.
- Integração da configuração após os contatos e a barra, sem modificar os dados fornecidos.
- Grupos explícitos do hero, sem animação duplicada de pai/filho ou movimento da área clicável.
- Contraste da intro durante a transparência, inclusive sobre manchas e broto.
- Limites das escalas, tempos, foto dentro do recorte e preservação da rotação decorativa.
- Todas as 64 combinações de opções; módulos ausentes/com falha não interrompem outros efeitos.
- Intro omitida após pintura, carga tardia, histórico, âncora direta, rolagem restaurada ou foco anterior.
- Finalização em ordens diferentes, cancelamento, clique, toque, teclado, foco, resize, impressão e saída da página.
- APIs, CSS, hero ou alvos ausentes; duração zero e decorações desligadas; nenhuma espera por evento impossível.
- Tentativa única, desmontagem, cópia de estado e descarte de callbacks antigos.
- Dois links nativos com spans visuais, sem alvo de foco adicional ou repetição de texto.
- Bubble local, limite correspondente à área de toque fixa e cálculo conservador de espaço horizontal.
- Hover/clique preservados no link, cancelamento por foco no ancestral e fim independente dos dois botões.

Os testes de lógica utilizam elementos simulados em memória. `tests/enhancements.mjs` separa os casos da Etapa 7; `tests/release.mjs`, os da Etapa 8; `tests/organic-backgrounds.mjs`, os contratos e cálculos do novo efeito. `tests/decorations.mjs` verifica os novos ícones e seu gerador. O módulo `tests/curve-geometry.mjs` analisa os paths reais do HTML e verifica continuidade C1/C2; os casos negativos confirmam que defeitos são rejeitados. Todos são chamados pelo verificador. As dimensões simuladas testam a lógica de reserva, não comprovam medidas renderizadas. Os cálculos das curvas usam os valores CSS atuais, não um motor de layout. A resolução de URLs não inicia requisições HTTP. Esses testes não substituem testes em navegador.

O verificador aceita dados de contato, preços, promoção e descrições de fotos atualizados. Para Instagram e recebimento, mantenha também as cópias sem JavaScript do HTML atualizadas, conforme `docs/CONTATOS.md`. Os casos inválidos são simulados em memória, sem limpar ou modificar `config.js` ou `menu.json`. Fontes, fotografias e preços foram preservados em relação à Etapa 7. As ofertas, telefones e endereços de teste existem somente na memória do verificador, sem acesso à rede. Ao trocar proporções ou resoluções das fotos, revise também os contratos de dimensão dos testes.

Para conferir somente se o cardápio está sincronizado, use `node tools/build-menu.mjs --check`. Esse modo não escreve arquivos. Depois de editar preços, use o comando sem `--check` antes de executar os testes.

## Checklist de publicação separado

`node tools/check-release.mjs` aponta as pendências detectáveis e lembra as verificações humanas. A versão entregue retorna código 1 por quatro pendências: URL da Neoeffex, fotos provisórias, indexação e aviso. O relatório da Etapa 8 é histórico; o WhatsApp agora está configurado. Não é falha dos 206 grupos técnicos. O comando não publica, não executa o verificador técnico e não escreve arquivos. Veja `PUBLICACAO.md` antes de remover qualquer aviso.

## Conferência manual sugerida no VS Code

Antes da sequência abaixo, execute também a conferência do pulinho/WhatsApp em ANIMACOES.md. Os testes não abrem aplicativos ou enviam mensagens. Execute a conferência dos cards descrita em `ANIMACOES.md`: cinco cards, mouse/toque, bordas, configurações, acessibilidade e retorno estático. A suite valida contratos CSS e controle, não renderiza hover real.

1. Abra o `index.html` e confirme a faixa “Teste de fundos orgânicos · Pré-publicação · v0.1.16”. Teste também a sequência, o bubble nos botões e o movimento conjunto de foto, borda e contorno conforme `ANIMACOES.md`; se omitida, confira o status pelo console.
2. Clique em Tradicionais, Fitness e Como funciona; confira o destino.
3. Clique em Contato; confirme que a seção mostra regiões e formas de recebimento.
4. Sem preencher o telefone, confirme que não é aberta uma conversa de WhatsApp.
5. Confirme que o Instagram aponta para o perfil correto.
6. Preencha o número oficial em `config.js`, recarregue e confira o destinatário antes de enviar qualquer mensagem.
7. Use Tab para conferir o foco e o link “Pular para o conteúdo”.
8. Confirme Sora nos títulos e Manrope nos textos; depois teste a abertura sem internet para verificar as fontes locais.
9. Confira os fundos verde, creme, sálvia e amarelo suave, além dos estados dos botões.
10. Reduza a janela para 320, 375 e 768 pixels: texto antes da foto, três atalhos visíveis, sem rolagem horizontal.
11. Amplie para 1024 e 1440 pixels: cabeçalho em uma linha e abertura em duas colunas.
12. Teste zoom de 200%: o cabeçalho deve reorganizar, sem cortar Contato ou os atalhos.
13. Confira a legenda “Imagem ilustrativa” e a fotografia sem deformação. Os cantos arredondados recortam apenas a área da foto.
14. Abra sem internet: a foto, as fontes e os atalhos internos devem continuar disponíveis. Os links externos naturalmente exigem conexão.
15. Confira os três cards tradicionais e dois fitness, cada um com três combos e apenas o de 10 destacado.
16. Confira especialmente R$ 370,00 para o Fitness G de 15 e “aprox. R$ 24,67 por marmita”.
17. Confira os acréscimos de R$ 6,00 e R$ 9,00 nas duas categorias.
18. Desative o JavaScript: todos os preços devem continuar visíveis, e os botões de pedido devem levar ao contato.
19. Em 320 e 375 pixels, consulte todos os combos sem arrastar para os lados; teste também zoom de 200%.
20. Confira os novos botões após os preços, primeiro sem telefone e depois com o número oficial configurado. Não envie mensagens de teste a terceiros.
21. Confira os três passos do “Como funciona” e seu botão, que muda para “Montar meu pedido” quando o telefone é válido.
22. Com a configuração entregue, confirme que não existe faixa promocional nem espaço vazio acima das tradicionais.
23. Apenas localmente, preencha uma promoção claramente marcada como teste e ative `enabled: true`: confira título, descrição e botão, sem alteração nos cards.
24. Desative a promoção e recarregue; depois teste título vazio e `enabled` como string, que devem manter a faixa oculta.
25. Antes de publicar, remova os dados de teste e deixe a promoção desativada ou substitua-os por uma oferta real confirmada.
26. Confira o contato: canais por extenso, regiões, retirada e taxa adicional de entrega visíveis.
27. Com número oficial configurado, confira o telefone no contato e rodapé e o destino `tel:`. Não é necessário iniciar uma chamada para verificar o link.
28. Apague o telefone e recarregue: links de ligação desaparecem, aviso retorna e os botões fora do contato levam a essa seção.
29. Preencha endereço e horários confirmados; confira as linhas. Apague-os e confirme que desaparecem sem espaço reservado.
30. Confira a galeria: uma foto grande e duas menores, legenda ilustrativa, sem deformação ou rolagem lateral.
31. Teste o Instagram nas três posições: contato, galeria e rodapé.
32. Confira a chamada final e o rodapé em 320, 375, 768, 1024 e 1440 pixels e com zoom de 200%.
33. Configure a URL oficial da Neoeffex; confirme o destino do crédito. Sem URL, deve permanecer apenas texto.
34. Desative o JavaScript: confira preços, imagens, regiões, retirada, entrega e os links estáticos do Instagram.
35. Confira no painel de rede que fotos e fontes são locais e que o feed do Instagram não é carregado automaticamente.
36. Em 320, 375 e 430 pixels, confira a barra inferior e role até o último crédito: ele deve ficar completamente acessível acima da barra.
37. Sem telefone, a barra deve mostrar “Fale com a Lu” e ir ao contato; com o número oficial, deve abrir o WhatsApp correto.
38. Amplie o texto e use zoom de 200%: confira quebra de linhas no cabeçalho e ajuste do espaço da barra.
39. Teste 767 e 768 pixels de largura, depois paisagem com até 384 pixels de altura: a barra deve ocultar no desktop ou voltar ao fluxo na paisagem curta.
40. Em aparelho com recorte de tela, confira as margens e a área segura inferior; teste retrato e paisagem.
41. Ative a preferência de movimento reduzido antes de abrir a página: não deve haver entrada animada nem rolagem suave.
42. Altere essa preferência com a página aberta: os movimentos devem parar sem ocultar conteúdo.
43. Navegue com Tab e Enter pelos atalhos: o foco deve seguir para a seção de destino; confira também Shift+Tab e “Pular para o conteúdo”.
44. Desative o JavaScript: preços continuam visíveis e a barra fica no fluxo após o rodapé, sem sobreposição.
45. Abra a visualização de impressão: a barra não deve aparecer ou deixar espaço extra.

## Comparação dos fundos orgânicos

Além do roteiro acima, compare com e sem `organic-backgrounds` no `body`, recarregando a página. Não remova outras classes. Use `FUNDOS-ORGANICOS.md` para os controles e limites.

- Confira as duas formas suaves e o contorno da fotografia no hero, sem deformação da imagem ou mudança das posições do conteúdo.
- Confira as curvas de entrada e saída do fitness e a faixa sálvia discreta; nenhum preço, aviso ou foco deve ficar coberto.
- Confira a onda após a abertura e a onda invertida na saída do fitness, sem frestas na base, pontas ou mudanças abruptas de direção nas curvas.
- Repita em 320, 375, 430, 767, 768, 960, 1024 e 1440px, com zoom de 125% e 200%, texto ampliado e janela baixa. Não deve surgir rolagem horizontal.
- Confira as laterais dos SVGs e a faixa sálvia do fitness em Chrome, Firefox e Safari quando disponíveis. Não devem aparecer pontas, frestas ou recortes retos no meio das ondas.
- Sem a classe, na impressão e com cores forçadas, os SVGs não devem reservar espaço vazio.
- Confira a saída do hero com promoção visível, oculta e removida em uma cópia local: amarelo quando a faixa aparece; creme quando tradicionais vem a seguir. Desfaça os dados de teste.
- Confira Tab e Shift+Tab, clique nas ações, navegação por âncora e a barra fixa até o fim da página.
- Desative JavaScript: fundos e preços permanecem; a barra usa o comportamento de fallback já existente.
- Teste impressão, cores forçadas/alto contraste e movimento reduzido. Impressão e cores forçadas devem usar os fundos-base; não há movimento novo para desativar.
- Remova somente a classe de ativação: as formas novas devem desaparecer, sem mexer nos outros componentes. Recoloque-a para confirmar o retorno.

## Limites de validação

Esta versão possui verificações estáticas, de arquivos, contraste, geração e lógica. Na Etapa 8, a prévia disponível não executou este projeto estático sem servidor. A arquitetura sem dependências foi preservada nesta atualização, que também não recebeu revisão visual em navegador. Não houve avaliação completa de responsividade, desempenho ou acessibilidade. Os testes de contratos CSS não comprovam a renderização; a conferência manual acima continua pendente antes da publicação. Não é uma certificação de acessibilidade.

Nenhum link externo foi acessado nem mensagem foi enviada como parte dos testes da base.
