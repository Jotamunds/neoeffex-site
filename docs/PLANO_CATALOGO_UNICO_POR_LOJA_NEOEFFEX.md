# Neoeffex — plano de catálogo único por loja

Data: 07/09/2026. Revisão 2: base v0.4.7 da vitrine, implementação diretamente na main e uso das logos existentes da Neoeffex. Status: planejamento para implementação; nenhuma alteração aplicada ao site, às branches ou ao banco.

## 1. Objetivo e regra central

Cada loja terá um único catálogo público, um endereço principal, uma identidade comercial, um destino de WhatsApp e um carrinho. Categorias, subcategorias, coleções, marcadores, variações e grupos de opções organizarão o conteúdo dentro desse catálogo.

Uma conta poderá administrar mais de uma loja. Isso não autoriza criar vários catálogos independentes para a mesma loja. E-mail identifica o acesso; o identificador interno da loja identifica o negócio.

Para quem administra apenas uma loja, o painel abrirá diretamente seus produtos. Para quem administra várias, haverá seleção de loja, com o nome da loja ativa sempre visível. A criação da loja também criará seu catálogo, em uma operação única.

O catálogo continuará sendo um recurso compartilhado da Neoeffex, configurável por dados. As regras comerciais da Lu não devem ser colocadas como exceções de slug no JavaScript compartilhado.

## 2. Base examinada e limites da verificação

Referência obrigatória atualizada: repositório `Jotamunds/neoeffex-site`, branch de origem `modelos-vitrine-v2`, commit `b709ff44120d22d1bb6815845ccb715f439bf87d` (`b709ff4`), mensagem `v0.4.7 - preview-vitrine - corrige coordenadas do mouse nas particulas`.

O usuário se referiu à branch como `modelos-vitrine`; a branch encontrada no GitHub contendo esse commit se chama `modelos-vitrine-v2`. Usar o SHA acima como referência fixa para não incorporar, por engano, futuros commits da branch enquanto este plano é executado.

Destino da implementação: **main diretamente**, conforme orientação do usuário. A branch de origem serve de base de conteúdo; não é a branch de desenvolvimento deste trabalho.

`modelos/preview-vitrine/VERSION` está em `v0.4.7`. `admin/VERSION` e `catalogo/VERSION` continuam em `0.1.13`: são versões de componentes diferentes. Não renumerar admin e catálogo como v0.4.7 apenas por usarem esse snapshot do repositório.

Na comparação realizada, a main estava em `57f42b97349fa8c789c09203aa0b1029233231ff`, e a referência v0.4.7 estava oito commits à frente, sem commits exclusivos da main. Os arquivos de `/admin/` e `/catalogo/` não mudaram nesse intervalo; por isso, as constatações funcionais abaixo permanecem válidas na nova base. As diferenças incluem a vitrine, o `GEMINI.md` da raiz e decisões sobre a vitrine em `DECISIONS.md`. Preservar também as orientações de autonomia acrescentadas ao `GEMINI.md`.

| Constatação no repositório | Consequência para o plano |
| --- | --- |
| Existem `catalogs`, `categories` e `products`; não há entidade própria de loja nas migrations examinadas. | Acrescentar a identidade interna de loja sem renomear todas as tabelas existentes. |
| Categorias e produtos já possuem `catalog_id`; a categoria do produto é validada também contra o catálogo. | Aproveitar os vínculos e ampliar esse cuidado às variações e opções. |
| A migration 009 restringia catálogo por proprietário; a 011 remove essa restrição. | Não reaplicar a 009: a nova unicidade será por loja, não por usuário. |
| O carrinho usa um mapa de `product_id` para quantidade. | Ele ainda não diferencia composições ou variações do mesmo produto. |
| O produto atual possui preço único e descrição limitada a 500 caracteres. | Acrescentar estrutura própria de preços/opções; não colocar o cardápio inteiro em descrições. |
| O catálogo público é resolvido por slug; carrinho e último carrinho usam o ID interno do catálogo. | Preservar slug e ID reduz rupturas em links e carrinhos. |
| Produtos e logos no Storage usam caminhos com ID do proprietário e do catálogo. | Transferir propriedade exige conferir acesso a imagens antigas, além de alterar o dono no banco. |
| Há divergência documental: `SETUP.md` já contempla 011/012, enquanto README e checklist ainda descrevem parte da regra antiga. | Atualizar instruções junto com a implementação para evitar que outra IA restaure a arquitetura anterior. |

O projeto Supabase do Neoeffex não estava disponível na conexão consultada. Portanto, estrutura efetivamente instalada, migrations aplicadas, conteúdo atual, permissões em produção e transferência para `m.luzimarjw@gmail.com` ainda precisam de conferência. A revisão acima é do código e dos scripts versionados; não confirma o estado do banco publicado.

Fontes do projeto: [commit de referência v0.4.7](https://github.com/Jotamunds/neoeffex-site/commit/b709ff44120d22d1bb6815845ccb715f439bf87d), [schema inicial](https://github.com/Jotamunds/neoeffex-site/blob/b709ff44120d22d1bb6815845ccb715f439bf87d/admin/setup/001_initial_schema.sql), [categorias e vínculos](https://github.com/Jotamunds/neoeffex-site/blob/b709ff44120d22d1bb6815845ccb715f439bf87d/admin/setup/003_categories_and_multi_catalogs.sql), [migration 011](https://github.com/Jotamunds/neoeffex-site/blob/b709ff44120d22d1bb6815845ccb715f439bf87d/admin/setup/011_remove_single_catalog_per_owner.sql) e [carrinho público](https://github.com/Jotamunds/neoeffex-site/blob/b709ff44120d22d1bb6815845ccb715f439bf87d/catalogo/assets/js/catalogo.js).

### Preparação da main para a execução

1. Antes de editar código, conferir estado local, branch atual, mudanças não commitadas e referências remotas. Atualizar as informações do remoto e comparar novamente a main com o SHA de referência; a situação pode ter mudado desde esta revisão.
2. Trabalhar e registrar os commits diretamente na **main**. Não criar branch de implementação nem exigir PR como condição para seguir este plano.
3. Se a main já contiver `b709ff4` em seu histórico, continuar a partir da main atual, preservando os commits posteriores.
4. Se a main continuar sendo ancestral de `b709ff4`, incorporar essa referência por fast-forward na main antes das alterações. Não copiar a árvore completa sobre o projeto nem usar `reset --hard`.
5. Se houver divergência, integrar o commit indicado com merge que preserve as mudanças válidas de ambos os lados. Resolver conflitos examinando o conteúdo; não escolher uma branch inteira como solução automática. Não usar force push.
6. Guardar o SHA anterior da main no registro de execução e manter commits por etapa. A recuperação deve respeitar trabalho posterior e alterações locais do usuário; não depender de recriar uma branch para desenvolver.
7. Conferir se um push na main aciona publicação automática. Planejar o corte compatível de frontend/banco antes de publicar commits intermediários. Autorização para implementar diretamente na main não significa que mudanças incompletas devam entrar no ar.
8. Depois da integração, validar que as melhorias da vitrine v0.4.7 e as instruções atualizadas continuam presentes. A implementação do catálogo será incremental sobre essa base.

Esta revisão altera apenas o planejamento. A integração na main, os commits de implementação e a publicação serão realizados quando a execução do plano for solicitada.

## 3. Organização do catálogo

Esses recursos têm funções diferentes. Nenhum produto deve ser obrigado a preencher todos eles.

| Recurso | Função e regra proposta | Exemplo |
| --- | --- | --- |
| Categoria | Seção principal; um produto possui uma categoria principal. | Marmitas tradicionais, Fitness, Bebidas. |
| Subcategoria | Divisão opcional, com no máximo dois níveis no início. | Bebidas → Sucos. |
| Coleção | Agrupa produtos de categorias diferentes, sem duplicá-los. | Ofertas da semana. |
| Marcador | Identificação e filtro adicional, independente da categoria. | Mais pedido, Novidade. |
| Tipo de produto | Define o comportamento de compra. | Simples, configurável ou combo configurável. |
| Variação | Combinação comprável com preço e disponibilidade próprios. | Tradicional, 400 g, pacote com 10. |
| Grupo de opções | Escolhas da montagem com quantidade mínima/máxima. | Escolha as carnes; escolha os acompanhamentos. |
| Opção | Item escolhido dentro do grupo, com acréscimo quando aplicável. | Filé de frango; salmão. |

Categorias organizam navegação; variações definem a versão comprada; opções descrevem sua composição. Na Lu, avulsa e combo serão escolhas de quantidade/pacote, evitando replicar produtos em subcategorias apenas para representar preços diferentes.

Subcategorias deverão impedir ciclos, vínculo com outra loja e criação de terceiro nível. Categorias com filhos ou produtos precisarão de reassociação antes de exclusão. Coleções e marcadores permitirão associação múltipla, sempre aos mesmos IDs de produto.

A pausa de uma categoria ocultará seus descendentes na vitrine sem reescrever o status individual dos produtos; a reativação respeitará produtos que já estavam pausados. No painel, esse efeito deve ser explicado.

## 4. Estrutura de dados proposta

Os nomes abaixo são uma proposta a conciliar com o schema real antes da implementação. O plano preserva `catalogs.id`, `catalogs.slug` e os vínculos existentes por `catalog_id`.

| Entidade | Responsabilidade |
| --- | --- |
| `stores` | ID estável do negócio, proprietário e dados internos de administração. |
| `catalogs` | Catálogo único da loja; mantém apresentação pública, slug, ativação, WhatsApp e identidade já existentes. Recebe `store_id`. |
| `categories` | Mantém a base atual; recebe referência opcional à categoria pai e estado de publicação. |
| `products` | Nome, descrição, categoria, imagem, ordenação, status e tipo de compra. Produtos simples continuam com o contrato atual de preço. |
| `product_variants` | Combinações válidas, preço total, rótulos, disponibilidade, ordenação e quantidade de unidades no pacote. |
| `option_groups` e `options` | Grupos reutilizáveis e respectivas escolhas pertencentes ao catálogo. |
| Vínculos produto/variação–grupo | Aplicabilidade, limites e regras específicas por variação, sem copiar o grupo inteiro. |
| `collections` / `tags` e tabelas de vínculo | Organização transversal sem duplicação de produto. |
| `catalog_aliases` | Endereços antigos apontando ao catálogo principal quando houver consolidação. |

### Unicidade e propriedade

- `catalogs.store_id` terá referência obrigatória a `stores.id` e unicidade após a migração dos dados. Uma loja não poderá receber um segundo catálogo, mesmo com duas tentativas simultâneas.
- `UNIQUE(store_id)` garante no máximo um catálogo; a criação transacional de loja e catálogo e a proteção contra exclusão isolada garantirão que uma loja operacional tenha seu catálogo.
- `stores.owner_id` será a autoridade de propriedade no modelo final. Durante compatibilidade, `catalogs.owner_id` poderá existir como espelho controlado no servidor, sem edição independente e sem se tornar uma segunda fonte de autorização.
- A criação, transferência e exclusão precisarão respeitar essa unidade. O frontend não deverá inserir uma loja e depois, em outra requisição independente, tentar criar o catálogo.
- Não adicionar `UNIQUE(owner_id)`: duas lojas legítimas da mesma conta devem continuar funcionando.
- Categorias e produtos podem continuar usando `catalog_id`, que leva à loja através do vínculo único. Evitar duplicar `store_id` em todas as tabelas sem necessidade.
- Novos vínculos devem impedir que uma variação use grupo, opção ou categoria de outro catálogo, inclusive quando os dois negócios pertencem à mesma conta. Reutilizar chaves compostas quando apropriado.
- Uma alteração de e-mail não muda IDs, slug ou propriedade automaticamente. Uma transferência usa o UUID correto da conta autenticada no projeto correto.
- Rever a exclusão em cascata de usuário existente no schema antes da mudança de autoridade: excluir uma conta não deve apagar acidentalmente uma loja em processo de transferência.

### Acesso e imagens

Toda nova tabela exposta deverá ter privilégios e RLS correspondentes ao papel: visitante lê somente conteúdo público elegível; proprietário administra somente sua loja. Não usar metadados editáveis do usuário como prova de propriedade, nem expor dados internos da conta. As políticas precisam ser testadas pelas identidades de visitante e de dois proprietários, pois uma consulta administrativa bem-sucedida não comprova isolamento. Referência: [RLS no Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).

Para imagens, planejar autorização baseada no vínculo atual com a loja/catálogo, em vez de depender apenas do prefixo do antigo proprietário. Compatibilidade com caminhos antigos deve incluir leitura administrativa, substituição, remoção e limpeza após exclusão. Não copiar ou apagar todos os arquivos na primeira migration. Para limpeza após remoção do registro, usar uma lista controlada de objetos ou operação confiável, sem conceder exclusão ampla do bucket.

Não considerar banco e Storage uma única transação: upload, atualização de referência e remoção do arquivo antigo precisam de compensação ou retomada em caso de falha. Conferir especificamente as imagens da Lu após a transferência já relatada.

## 5. Experiência administrativa e pública

### Painel do lojista

Menu proposto: **Produtos**, **Organização**, **Opções de montagem**, **Aparência e dados da loja**, **Configurações de pedidos**, além de **Ver catálogo** e **Copiar link**.

Em Organização, reunir categorias/subcategorias, coleções e marcadores. No cadastro de produto, apresentar primeiro os campos simples. Variações e montagem só aparecem quando o lojista ativa esses recursos. A loja não deve receber grupos vazios ou campos obrigatórios de alimentação quando vender outro tipo de produto.

Substituir a criação de catálogos pelo fluxo de criação de loja com catálogo automático. A troca de loja deve descartar respostas atrasadas da loja anterior e alertar sobre edição não salva. O fluxo de exclusão passa a considerar o negócio e suas dependências, preservando a exigência atual de pausa e confirmação.

### Catálogo do cliente

Manter como endereço principal inicial da Lu:

[Catálogo da Lu Leve e Saudável](https://neoeffex.com.br/catalogo/?catalogo=lu-leve-e-saudavel)

A URL já resolve a loja desejada por seu catálogo. Não é necessário criar uma rota nova para obter o benefício de catálogo único.

Categorias e filtros funcionarão dentro da mesma página e do mesmo carrinho. Links opcionais para uma categoria poderão usar parâmetro ou âncora, mas resolverão o mesmo catálogo. Se futuramente houver endereço mais curto, manter o anterior como alias; uma nova rota depende do suporte real da hospedagem e não será requisito deste trabalho.

Produto simples continua com ação direta de adicionar. Produto configurável abre montagem acessível, com preço atualizado e resumo visível. No celular, manter o botão de adicionar alcançável e informar as escolhas que ainda faltam. Usar teclado, foco de retorno e fechamento de modal coerentes com os componentes atuais.

Mostrar “A partir de” somente com um valor realmente comprável: considerar variações ativas e adicionais obrigatórios de uma configuração válida. Se não for possível calcular um mínimo confiável, apresentar o preço após a seleção, sem usar zero como valor provisório.

### Identidade Neoeffex e uso das logos existentes

Usar as logos presentes em `/img/logos/` na base v0.4.7. A Neoeffex identifica o sistema administrativo e a tecnologia do catálogo; a marca cadastrada da loja identifica o estabelecimento e o pedido. Para a Lu, preservar os ativos próprios de cabeçalho e catálogo já existentes.

As versões horizontais azul e branca foram abertas e inspecionadas nesta revisão. Ambas são PNG RGBA de 2172 × 724 px. A azul está visualmente adequada como referência de aplicação. A branca apresenta resíduos visíveis ao redor do símbolo e das letras e precisa de revisão de exportação antes de uso direto. O símbolo branco em SVG existente foi conferido como arquivo vetorial; sua aparência em tamanho final ainda deverá ser validada no navegador.

| Área de aplicação | Arquivo existente de referência | Orientação |
| --- | --- | --- |
| Login, recuperação de senha e painel com fundo claro | `/img/logos/png-neoeffex-logo-text-right-blue.png` | Preferir a assinatura horizontal completa, preservando símbolo, texto e proporções. |
| Painel com fundo escuro | `/img/logos/neoeffex-n-logo-white.svg` | Usar o símbolo existente com identificação textual acessível da Neoeffex enquanto a assinatura horizontal branca não passar pela revisão visual. |
| Assinatura horizontal branca | `/img/logos/png-neoeffex-logo-text-right-white.png` | Ativo encontrado, mas com resíduos visíveis; não aplicar automaticamente só por ter o sufixo white. |
| Espaços compactos e menu recolhido em fundo claro | `/img/logos/png-neoeffex-logo-blue.png` | Candidato ao símbolo isolado; conferir aparência e área transparente antes de implementar. |
| Espaços compactos em fundo escuro | `/img/logos/neoeffex-n-logo-white.svg` | Preservar a geometria; conferir legibilidade no tamanho final. |
| Rodapé e identificação de plataforma no catálogo público | Assinatura horizontal azul ou símbolo branco, conforme o fundo | Acompanhar o texto “Tecnologia Neoeffex” quando necessário; evitar repetir o nome desnecessariamente se já estiver legível na imagem. |
| Cabeçalho e apresentação da loja Lu | `/catalogo/assets/images/brands/lu-leve-e-saudavel/logo-header.webp` e `/catalogo/assets/images/brands/lu-leve-e-saudavel/logo-catalogo.webp` | Continuam pertencendo à identidade comercial da Lu. |

Requisitos de implementação:

- Substituir os marcadores genéricos `.brand__mark` nos pontos de identificação Neoeffex do login, painel e catálogo pelo ativo adequado. Conferir os módulos e temas que manipulam esses elementos antes de removê-los ou trocar sua estrutura.
- Manter duas configurações distintas: identidade da plataforma, compartilhada; identidade da loja, resolvida pelo catálogo. A conta do lojista não deve conseguir sobrescrever a logo da plataforma ao editar sua própria logo.
- No catálogo da Lu, o cabeçalho que já usa a logo da loja continua com essa função. Aplicar Neoeffex na assinatura de plataforma/rodapé, sem disputar a identificação do estabelecimento.
- Preservar desenho, cores e proporções dos ativos existentes. Não reconstruir o N por CSS nem substituir o wordmark por uma fonte apenas parecida. O texto ao lado do símbolo branco, quando usado como fallback, é um rótulo de interface e não uma nova versão da logo.
- Resolver claro/escuro conforme o fundo real da área da marca. Trocar arquivos apropriados; não aplicar filtros de cor indiscriminados aos PNGs. Não usar a versão azul sobre fundo escuro sem contraste suficiente.
- Verificar as margens transparentes internas. Definir tamanho pelo resultado visual, evitando uma assinatura aparentemente minúscula dentro de um arquivo grande ou recorte que corte as letras.
- Usar dimensões reservadas, proporção preservada e `object-fit: contain`. Uma assinatura completa pode ter `alt="Neoeffex"`; símbolo decorativo ao lado de texto equivalente deve evitar leitura duplicada.
- Centralizar referências dos ativos da plataforma em um ponto compartilhado ou contrato explícito de configuração, sem copiar a mesma imagem para cada loja. Os caminhos `/img/logos/` deverão ser incluídos nos pacotes/deploys que publicam admin e catálogo separadamente.
- Os PNGs horizontais têm cerca de 260–280 KB; derivar arquivos menores para os tamanhos usados, se necessário, com preservação visual e dos originais. Confirmar fundo transparente e ausência de halos antes de publicar qualquer derivado.
- O SVG branco existente é preferível para o símbolo compacto quando passar pela validação visual. A correção da assinatura branca não exige redesenhar a marca nem bloquear as demais etapas: usar os ativos limpos disponíveis durante essa revisão.
- Aplicar identidade Neoeffex ao painel preservando tema claro/escuro e legibilidade dos formulários. Consultar `docs/brand-spec.md` como referência de marca; a troca de logos não exige trocar todas as fontes nem reimplementar o layout.
- Os efeitos de partículas e Three.js da vitrine permanecem na vitrine; as telas administrativas e de compra devem continuar leves e focadas em suas funções.

Fontes visuais: [ativos da Neoeffex na base v0.4.7](https://github.com/Jotamunds/neoeffex-site/tree/b709ff44120d22d1bb6815845ccb715f439bf87d/img/logos) e [referência de marca](https://github.com/Jotamunds/neoeffex-site/blob/b709ff44120d22d1bb6815845ccb715f439bf87d/docs/brand-spec.md).

## 6. Aplicação à Lu Leve e Saudável

### Produtos e matriz de preços

Proposta inicial: dois produtos configuráveis, **Marmita tradicional** e **Marmita fitness**, em suas categorias correspondentes. Serão 20 variações comerciais explícitas: 12 tradicionais e 8 fitness. Caso a apresentação visual precise destacar tamanhos, usar atalhos de seleção para essas mesmas variações.

| Produto/tamanho | Avulsa | 5 marmitas | 10 marmitas | 15 marmitas | 20 marmitas |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tradicional 300 g | R$ 16,00 | R$ 75,00 | R$ 150,00 | Não oferecido | R$ 290,00 |
| Tradicional 400 g | R$ 20,00 | R$ 95,00 | R$ 190,00 | Não oferecido | R$ 370,00 |
| Tradicional 500 g | R$ 22,00 | R$ 105,00 | R$ 210,00 | Não oferecido | R$ 410,00 |
| Fitness M — 400 g | R$ 22,00 | R$ 105,00 | R$ 210,00 | R$ 315,00 | Não oferecido |
| Fitness G — 500 g | R$ 25,00 | R$ 125,00 | R$ 245,00 | R$ 370,00 | Não oferecido |

Fonte dos valores e regras de composição: `tabela.xlsx`, aba `Planilha1`, linhas 2–61, enviada nesta conversa.

O preço total da planilha é a fonte de verdade. O combo Fitness G de 15 custa R$ 370,00; R$ 24,67 é uma média arredondada e não deverá ser multiplicada para chegar ao total. O combo Fitness G com 5 custa R$ 125,00, mesmo sem desconto sobre a avulsa. Não inventar descontos progressivos.

O destaque “Mais pedido” se aplica às cinco variações de 10 marmitas. Não transferir esse destaque automaticamente para todos os tamanhos/pacotes.

### Grupos de composição

Usar sete grupos: proteínas incluídas, proteínas especiais, acompanhamentos, legumes, verduras, leguminosas e arroz/feijão/substituições. Os dois primeiros podem aparecer juntos na tela “Escolha suas carnes”, pois ambos precisam respeitar o mesmo limite de carnes. Grupos independentes não podem dobrar esse limite.

| Grupo | Opções da planilha |
| --- | --- |
| Proteínas incluídas | Pernil suíno; contra-filé suíno; bisteca; carne moída com ou sem batata; filé de frango; coxa e sobrecoxa assada; fígado acebolado em tiras. |
| Proteínas especiais | Carne de panela, filé de frango à parmegiana, filé de carne à parmegiana, bife acebolado e bife a rolê: +R$ 5,00; filé de tilápia ao molho: +R$ 6,00; salmão e contra-filé: +R$ 9,00. Valores por marmita. |
| Acompanhamentos | Legumes de berinjela; purê de batata; purê de abóbora. |
| Legumes | Mix de legumes; cenoura; abóbora; abobrinha; chuchu; vagem cozida ou assada; batata; batata-doce; mandioquinha; inhame. |
| Verduras | Mix de verduras; acelga; escarola; couve-flor; brócolis. |
| Leguminosas | Lentilha e grão-de-bico; somente para marmitas de 400 g e 500 g. |
| Arroz, feijão e substituições | Manter ou solicitar substituição de um ou ambos; preço e substituições permitidas precisam de regra comercial antes de cálculo automático. |

Legumes e verduras devem compartilhar o limite de acompanhamentos descrito por tamanho: 300 g permite uma escolha entre os dois grupos; 400 g/500 g permitem duas, distribuídas conforme a planilha. Preservar essas classificações comerciais ao importar.

“Sem acréscimo” indica opção incluída na montagem. Não significa item independente gratuito e ilimitado no carrinho. Acréscimos devem mostrar sua unidade de cobrança.

### Combos com composição distribuída

Proposta: permitir repetir a mesma composição em todas as marmitas ou distribuir o pacote em lotes de composição. Exemplo: um combo de 10 pode ter 5 marmitas com frango e 5 com carne moída.

Cada lote guarda quantidade e escolhas. A soma dos lotes precisa ser exatamente a quantidade do pacote. Oferecer “Aplicar a todas” e “Duplicar composição” para reduzir trabalho. Inicialmente, todos os lotes de um pacote usam o mesmo tamanho e tipo escolhidos na variação; misturar pesos e tipos exige outra regra de preço.

Se houver um único adicional de R$ 5,00 em 3 marmitas de um combo tradicional 300 g com 10, o total será R$ 150,00 + R$ 15,00 = R$ 165,00. Se o adicional estiver nas 10, será R$ 200,00. Dois combos idênticos do primeiro exemplo custam R$ 330,00 e contêm 20 marmitas.

Não calcular preço de combo pelo número global de marmitas soltas no carrinho. Cada pacote possui preço e quantidade próprios.

### Regras comerciais que ainda precisam ser definidas

Essas pendências não impedem construir a base de loja única. Impedem publicar seletores que cobrem valores ou imponham limites sem informação suficiente:

1. Confirmar se “130 g de proteína” significa peso da porção de carne e quantos tipos de carne a Fitness permite.
2. Confirmar se os dois tipos de carne das tradicionais 400 g/500 g são obrigatórios ou um limite máximo.
3. Confirmar a cobrança quando uma marmita tem duas carnes especiais: soma, maior adicional ou outra regra. Não assumir cobrança duplicada.
4. Definir se purês/acompanhamentos e leguminosas consomem as mesmas vagas de legumes/verduras e os respectivos limites.
5. Confirmar quais regras de acompanhamentos por tamanho também se aplicam às Fitness.
6. Definir substituições de arroz/feijão, disponibilidade e preços. Enquanto isso, oferecer consulta pelo WhatsApp fora do total fechado.
7. Validar comercialmente o modo de distribuir composições dentro do combo, proposto neste plano.

Pedidos com um único ingrediente seguem por “Combinar pedido personalizado pelo WhatsApp”. A página e a mensagem devem informar prazo previamente combinado e pagamento antecipado. Usar o número informado para a Lu, `5511978766842`, após conferir a configuração atual da loja.

## 7. Preços, carrinho e WhatsApp

### Contrato novo de item

Cada linha guarda: ID da loja/catálogo, ID do produto, ID da variação quando aplicável, quantidade de pacotes, composição ou lotes, observações e versão da estrutura. Dois itens só se unem quando sua configuração completa é equivalente.

Usar identificador de linha próprio ou assinatura normalizada da configuração. Ordenar escolhas sem significado de ordem antes de comparar, mas preservar quantidades de lotes e observações. A mesma marmita com outra carne não pode sobrescrever a anterior.

O número de pacotes do carrinho e o número de marmitas dentro de cada pacote são medidas diferentes. Mostrar ambos quando útil, sem multiplicar duas vezes.

### Fonte de preço e disponibilidade

Manter dinheiro no banco como valor decimal de duas casas ou centavos inteiros; nos cálculos do navegador, trabalhar em centavos. Reutilizar a mesma função de cálculo na montagem, resumo, carrinho e mensagem.

O preço do pacote vem da variação cadastrada. Os adicionais dos lotes são somados conforme sua unidade de cobrança e depois o total do pacote é multiplicado pela quantidade de pacotes. Não reutilizar um total de `localStorage` como fonte autoritativa.

Ao restaurar, editar ou preparar envio, revalidar produto, variação, opções, limites e preços atuais. Alterações de preço precisam aparecer para revisão. Opções removidas ou indisponíveis deixam o item pendente de correção, sem substituição silenciosa. Se a revalidação falhar, preservar o carrinho e permitir nova tentativa.

No escopo atual, WhatsApp produz uma solicitação com total estimado; não há pedido persistido nem pagamento on-line. Se houver checkout ou registro de pedido no futuro, o servidor também precisará recalcular e validar a configuração antes de aceitá-la.

### Compatibilidade com carrinhos existentes

- Preservar as chaves ligadas ao `catalogs.id`, com formato versionado no conteúdo ou nova chave acompanhada de conversão explícita.
- Migrar automaticamente somente itens simples com correspondência inequívoca. Itens que passaram a exigir montagem precisam de revisão pelo cliente.
- Manter cópia local do formato anterior durante a transição para permitir recuperação, sem autorizar envio de configuração inválida.
- Aplicar a mesma política ao último carrinho e às abas abertas. Não sobrescrever formato novo com gravação de uma aba antiga.
- Catálogos consolidados precisam de mapa de IDs antigo→novo para migração. Endereços antigos passam a resolver o ID canônico; não somar silenciosamente carrinhos legados distintos.

### Envio e restauração

A mensagem conterá nome da loja, produto, tamanho, quantidade de pacotes, total de marmitas, distribuição por composição, adicionais, subtotais, total estimado e instruções comerciais.

Preservar restauração do último carrinho. Preparar e guardar a mensagem e o estado necessário antes da limpeza. Falha de preparação ou abertura bloqueada não deve causar perda irrecuperável. O clique em `wa.me` não comprova envio nem recebimento: o texto da interface deve refletir essa limitação.

Para combos extensos, agrupar composições iguais e prever “Copiar pedido” quando o compartilhamento por link falhar ou ficar impraticável. Não inventar limite universal de caracteres sem verificar o comportamento nos dispositivos usados.

## 8. Migração dos dados e links existentes

1. Inventariar schema real, contas, catálogos, URLs divulgadas, categorias, produtos, arquivos e volume de dados. Registrar contagens antes da mudança.
2. Mapear catálogo atual → loja → catálogo canônico. Mesmo e-mail não prova que dois catálogos pertencem à mesma loja; não mesclar por dono, nome parecido ou telefone sem identificação do negócio.
3. Onde não houver consolidação confirmada, migrar cada catálogo existente para sua própria loja, mantendo ID, slug, conteúdo e proprietário. Isso preserva todos os negócios administrados por uma conta.
4. Quando houver vários catálogos confirmados da mesma loja, escolher explicitamente o principal e registrar conflitos de nome, identidade, WhatsApp, preços e categorias. Preservar diferenças legítimas; não usar o preço mais recente como escolha automática.
5. Preparar cópia e mapa de origem/destino antes da consolidação. Atualizar produtos e categorias de forma coordenada por causa das chaves compostas. Mapear coleções, opções e imagens se já existirem.
6. Converter links antigos em aliases para o principal, sem cadeias ou ciclos. Reservar nomes antigos para impedir que sejam usados por outro negócio. Um namespace comum ou verificação no banco deverá evitar colisões entre slug canônico e alias.
7. Ao consolidar, guardar os registros de origem em arquivo de migração protegido antes de retirar as linhas substituídas da tabela operacional; não deixar um segundo catálogo comprável ligado à mesma loja. Em migração sem fusão, nenhuma retirada é necessária.
8. Só finalizar `NOT NULL` e unicidade quando o mapa estiver completo, sem catálogo operacional órfão. Na transição, leitores atuais permanecem compatíveis.
9. Validar contagens, valores, URLs, imagens e acesso do dono. Para a Lu, conferir também a transferência relatada, sem recriar sua conta de acesso.

Alterar nome, e-mail ou proprietário não deverá regenerar o slug publicado. Edição explícita do slug deverá preservar o anterior como alias. Acesso por alias e por link principal precisa encontrar a mesma loja e o mesmo carrinho.

## 9. Etapas de implementação, riscos e conclusão

O trabalho será incremental, diretamente na main, sobre a base v0.4.7 identificada na seção 2. Antes de desenvolver cada etapa, revisar seus riscos contra o código e o banco naquele momento. Cada etapa deve ter commit próprio na main, migrations novas quando necessárias, evidência de validação e lista curta de pendências. A adaptação da marca Neoeffex faz parte da etapa 3 e de sua validação na etapa 8.

| Etapa | Entrega | Riscos principais | Critério de conclusão |
| --- | --- | --- | --- |
| 1. Diagnóstico e decisões | Conferência/integração da base v0.4.7 na main; banco real, mapa de lojas/catálogos, backup recuperável, regras comerciais pendentes e atualização das decisões arquiteturais. | Usar base antiga; sobrescrever trabalho posterior da main; trabalhar no projeto Supabase errado; confundir proprietário com loja. | main contém a referência indicada sem perda de trabalho; origem/destino identificados; versões reais conhecidas; mapa sem ambiguidade; restauração ensaiada em ambiente de teste. |
| 2. Loja e catálogo único | Estrutura aditiva, criação transacional, vínculo único, propriedade, RLS, plano de imagens e compatibilidade dos links. | Segundo catálogo por concorrência; perda de acesso após transferência; catálogo sem loja; permissões inconsistentes. | Uma conta consegue administrar duas lojas isoladas; uma loja não aceita dois catálogos; links atuais funcionam; imagens podem ser geridas pelo dono correto. |
| 3. Painel, organização e marca | Navegação por loja, produtos, categorias/subcategorias, coleções, marcadores, filtros públicos e logos Neoeffex nos pontos da plataforma. | Estado de uma loja aparecer na outra; categorias cíclicas; duplicar produtos; pausa inconsistente; logo sem contraste ou confundida com a da loja. | Loja única abre diretamente; troca de loja segura; produto mantém seu ID; categorias vazias/pausadas tratadas; marca Neoeffex legível nos dois temas, com marca comercial preservada. |
| 4. Variações e preços | Tipo de produto, matriz explícita de combinações e preço/disponibilidade de cada versão. | Gerar combinações não vendidas; sobrescrever preços; anunciar mínimo impossível; frontend antigo tratar variação como produto barato. | Produtos simples continuam válidos; combinações inválidas não são compráveis; preços batem com a fonte; publicação de recursos novos fica controlada até existir comprador compatível. |
| 5. Montagem e combos | Grupos, escolhas, limites, aplicabilidade por variação e lotes de composição. | Exceder limite repartido entre grupos; opções obrigatórias indisponíveis; pacote incompleto; adicionais multiplicados incorretamente. | Configuração completa validada; lotes somam o pacote; cada regra tem resultado esperado; montagem pode ser pré-visualizada antes de liberar compra. |
| 6. Carrinho e WhatsApp | Linhas configuradas, edição, cálculo compartilhado, migração do formato antigo, restauração e mensagem detalhada. | Unir composições distintas; perda de carrinho; preço desatualizado; perda ao abrir WhatsApp; mensagens extensas. | Carrinho/WhatsApp exibem os mesmos valores; configurações diferentes são preservadas; restauração e atualização de preços funcionam; fallback de cópia disponível. |
| 7. Cardápio da Lu | Importação das 20 variações, grupos, opções e avisos com dados da planilha e regras comerciais resolvidas. | Duplicar carga; importar em outra loja; transformar adicional em produto grátis; supor regras ausentes; editar conteúdo existente sem querer. | Prévia de diferenças conferida; repetição da carga não duplica; valores reconciliados; proprietário e catálogo corretos; somente regras conhecidas publicadas. |
| 8. Piloto e publicação | Ensaio completo, piloto controlado, corte compatível a partir da main, revisão das logos, documentação alinhada e liberação gradual. | Push acionar deploy de etapa incompleta; mistura de versões; abas antigas gravarem dados; regressão na vitrine ou em outros clientes; rollback apagar edições recentes. | Fluxos reais aprovados; logos conferidas; base v0.4.7 preservada; release compatível; monitoramento e recuperação documentados. |

As etapas 1–3 resolvem a organização em um catálogo por loja para produtos simples. As etapas 4–6 acrescentam a montagem. A importação definitiva da Lu fica depois dessa base para evitar nova conversão de cardápio.

Recursos de compra novos só serão ativados por catálogo quando o consumidor compatível estiver publicado. Durante desenvolvimento, usar prévia de rascunho ou ambiente de teste; não expor produtos configuráveis incompletos com preço simples.

### Arquivos e áreas de impacto

- `admin/assets/js/admin.js`, `admin/index.html` e estilos administrativos: contexto de loja, organização e edição de produtos.
- `catalogo/assets/js/catalogo.js`, `catalogo/index.html` e estilos públicos: leitura, filtros, montagem, carrinho e mensagem.
- Módulos de identidade em admin/catálogo: manter nome, logo e contato da loja ligados ao mesmo catálogo canônico; manter a marca Neoeffex em configuração de plataforma distinta.
- `img/logos/`, `admin/reset-password.html` e estilos/elementos de marca do login, painel e rodapé público: aplicar as logos existentes conforme a seção 5, incluindo dependências de deploy e seleção por contraste.
- `admin/setup/`: migrations novas, auditorias e scripts de pré-verificação/importação. Não reescrever 009/011 para fingir uma história diferente.
- `GEMINI.md`, `admin/GEMINI.md`, `admin/setup/GEMINI.md`, `catalogo/GEMINI.md`, `DECISIONS.md` e `PROJECT_CONTEXT.md`: registrar a regra “conta pode ter várias lojas; loja tem um catálogo” e a execução deste trabalho diretamente na main com base em `b709ff4`. Preservar as instruções de autonomia e as decisões de vitrine já presentes na v0.4.7. A decisão atual do usuário substitui a premissa antiga de catálogos independentes por loja.
- `admin/README.md`, `catalogo/README.md`, `SETUP.md`, `PRODUCTION-CHECKLIST.md` e documentos operacionais: reconciliar instalação, onboarding, release, backup e rollback.
- `admin/VERSION`, `catalogo/VERSION` e changelog: registrar cada entrega seguindo o padrão existente. A numeração final deve partir do estado real na execução; não usar a v0.4.7 da vitrine nem versões da landing da Lu como versão do sistema de catálogo. Não incrementar a versão da vitrine apenas por implementar o catálogo.
- Landings e modelos: conferir seus links e integrações; alterar referências somente se necessário. O tema atual da Lu continua aproveitável.

## 10. Validação necessária

Esses são testes planejados; não foram executados nesta revisão.

| Caso | Resultado esperado |
| --- | --- |
| Verificar base antes da implementação | main contém `b709ff4` e preserva mudanças posteriores válidas; commits desta implementação ficam na main. |
| Logos em login, recuperação, painel e assinatura pública | Ativos Neoeffex corretos, legíveis, sem distorção e sem resíduos visíveis. |
| Alternar tema claro/escuro e abrir em celular | Logo mantém contraste e tamanho visual adequado, sem saltos de layout. |
| Editar logo da Lu ou de outra loja | Identidade comercial muda somente na loja correspondente; marca da plataforma permanece correta. |
| Publicar somente admin/catálogo | Dependências em `/img/logos/` estão acessíveis; fallback preserva identificação da plataforma. |
| Abrir a vitrine após a integração na main | Melhorias da v0.4.7, incluindo header e coordenadas do mouse, continuam presentes. |
| Uma conta possui duas lojas | Produtos, grupos, configurações e carrinhos continuam separados. |
| Conta B tenta alterar a loja A pela API | Operação negada; validar também grupos, opções, aliases e imagens. |
| Criar dois catálogos simultaneamente na mesma loja | Apenas um vínculo operacional é aceito. |
| Login do novo dono da Lu | Acesso correto a produtos, dados e gerenciamento de imagens anteriores. |
| Abrir URL principal e alias antigo | Mesma loja e catálogo canônico, sem cadeias de redirecionamento. |
| Renomear categoria ou loja | IDs e endereço publicado permanecem estáveis. |
| Produto em categoria e coleção | Mesmo produto e mesma configuração no carrinho, sem cópia de estoque/preço. |
| Mesma marmita, duas composições | Duas linhas distinguíveis, com edição e remoção independentes. |
| Combo 10 tradicional 300 g; adicional +R$ 5 em 3 marmitas | R$ 165,00. |
| Dois pacotes do caso anterior | R$ 330,00 e 20 marmitas. |
| Combo Fitness G 15 sem adicionais | R$ 370,00, sem reconstrução pelo preço médio. |
| Lotes somam 9 ou 11 em pacote de 10 | Adição bloqueada com explicação do que falta/correção. |
| Trocar de 500 g para 300 g | Revalidar limites e opções; pedir revisão das escolhas incompatíveis. |
| Restaurar item com opção pausada ou preço alterado | Informar divergência e solicitar correção/revisão antes de envio. |
| Produto simples de outro cliente | Compra atual continua funcionando sem grupos obrigatórios. |
| Importar a planilha duas vezes | Nenhuma duplicação; mostrar diferenças de atualização explicitamente. |
| Usuário muda de loja durante carregamento/edição | Resposta antiga não preenche a nova loja e não salva no contexto errado. |
| Revalidação sem rede ou falha no compartilhamento | Preservar carrinho e permitir repetir/copiar. |
| Celular, desktop e teclado | Montagem, foco, modais e CTA funcionam sem obstrução de conteúdo essencial. |
| Pausar a loja/categoria/produto/opção | Leitura e compra obedecem ao estado, inclusive após restaurar carrinho. |

## 11. Publicação e recuperação

1. Desenvolver e registrar as etapas diretamente na **main**, usando a preparação descrita na seção 2. Ensaiar migrations em ambiente isolado com dados representativos; trabalhar na main não muda a exigência de testar fora da produção.
2. Aplicar primeiro mudanças aditivas compatíveis. Manter produtos simples funcionando até o novo consumidor estar pronto.
3. Para o corte, controlar escrita de painéis antigos e atualizar admin e catálogo como release compatível; arquivos em cache e abas abertas precisam de revisão de versão.
4. Se houver consolidação de dados, usar janela curta de manutenção da loja afetada ou mecanismo equivalente de bloqueio de edição, com backup e mapa produzidos imediatamente antes.
5. Ativar o novo fluxo em piloto, testar a loja da Lu e uma loja de outra conta. Só então ampliar a liberação.
6. Preferir desligar o recurso novo e corrigir adiante em caso de erro. Não remover tabelas/colunas com dados novos durante uma reversão de frontend.
7. Uma restauração de backup antigo pode apagar edições feitas depois do corte. Se houver novas gravações, reconciliar essas mudanças com registro de migração antes de qualquer retorno de dados. Nunca executar rollback destrutivo genérico.
8. Remover campos de compatibilidade somente em entrega posterior, após confirmar ausência de leitores e gravadores antigos. Essa limpeza não é condição para disponibilizar o catálogo único.

O escopo termina quando cada loja opera pelo seu catálogo principal, toda organização permanece interna, o carrinho diferencia configurações e os links antigos continuam encontrando o negócio correto. Pagamento on-line, estoque avançado, gestão de funcionários e registro completo de pedidos no banco ficam para decisões futuras.
