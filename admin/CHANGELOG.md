# Changelog — Painel administrativo

## [0.3.7] - 2026-09-10

### Perfis de Catálogo, Modos de Compra, Sabores e Pedido Mínimo
- **Perfis de Catálogo e Capacidades Centralizadas**: Adicionada configuração de `catalog_profile` (`standard`, `food`, `marmitas`, `services`) e `minimum_order_quantity` no modal de loja (`catalogModal`) e no painel de resumo de pedidos. Módulo compartilhado `assets/catalog/profiles.js` centraliza capabilities sem acoplamento condicional por slug.
- **Gerenciamento Completo de Sabores**: Nova aba **Sabores** adicionada a **Configurações**, oferecendo CRUD completo (`flavors`): criação, edição, ativação/pausa, ordenação, foto com upload otimizado no Storage e exclusão segura bloqueada preventivamente caso o sabor esteja em uso por produtos.
- **Modos de Compra no Produto**: Introduzido campo `purchase_mode` (`simple`, `flavor_bundle`) no formulário de produtos. Para produtos em modo `flavor_bundle`, o painel dinâmico exibe os sabores cadastrados do catálogo com checkboxes, ordenação, acréscimos de preço (`additional_price`) e disponibilidade individual (`product_flavors`).
- **Catálogo Público com Modal de Sabores**: Produtos `flavor_bundle` contam com modal dedicado de distribuição exata de sabores (`sum(flavors) === target`), impedindo seleções incompletas ou excedentes, com cálculo dinâmico de acréscimos.
- **Carrinho e Mensagem do WhatsApp**: Carrinho atualizado para suportar itens bundle preservando compatibilidade retroativa com `localStorage` legado e produtos `simple`. Validação de pedido mínimo (`minimum_order_quantity`) bloqueia a finalização pelo WhatsApp com aviso amigável de progresso. Mensagem do WhatsApp detalha discriminadamente sabores, quantidades, acréscimos e subtotais.
- **Testes Automatizados**: Suíte de testes expandida para 104 verificações de banco no PGlite e 69 testes de interface DOM mockada cobrindo isolamento, RLS, regras de negócio e retrocompatibilidade.

## [0.3.6] - 2026-09-09

### Estabilização, limpeza, regressão e finalização (Etapa 5)
- **Consolidação do ciclo de lojas e configurações**: Finalização das 5 etapas de reorganização arquitetural do painel, garantindo suporte pleno a contas com 0 lojas (modo orientativo), 1 loja (seletor oculto) e múltiplas lojas (seletor ativo com isolamento rigoroso de catálogo).
- **Proteção ampliada contra salvamentos cruzados na troca de loja**: Além dos formulários de criação/edição inline e do modal de produto, o modal de edição de loja (`catalogModal`) e o modal de confirmação de exclusão (`deleteModal`) agora são fechados automaticamente ao alternar o catálogo no seletor.
- **Tratamento diferenciado de estados de erro vs vazio**: Estados de falha na consulta ao Supabase para Tipos e Grupos agora exibem mensagens de erro explícitas ("Não foi possível carregar os tipos. Tente novamente." / "Não foi possível carregar os grupos deste catálogo."), evitando mascarar falhas de rede ou acesso como listas vazias.
- **Correção de tema escuro nos avisos legados**: Seletor CSS alinhado ao padrão do projeto (`:root[data-theme="dark"] .product-legacy-warning` e `:root[data-theme="dark"] .product-group-chip--legacy`), garantindo contraste e legibilidade impecáveis em modo escuro.
- **Cache busting atualizado**: Query strings de versão no `admin/index.html` atualizadas para `?v=0.3.6` em todos os assets modificados (`admin.css`, `admin.js`, `config.js`, `organization.js`).
- **Limpeza de código e regras de desenvolvimento**: Removidas referências mortas e documentadas regras críticas em `GEMINI.md` para orientar futuras evoluções (proibição de reintroduzir criação de lojas ou inputs livres de tipo/grupo no painel, respeito ao modelo transitório de persistência e isolamento multiloja).
- **Validação e regressão completas**: Todos os testes automatizados de banco (63 checks no PGlite), interface (50 checks no DOM mockado) e resiliência (14 testes) passaram com 100% de sucesso.

## [0.3.5] - 2026-09-09

### Integração de Configurações ao Formulário de Produto (Etapa 4)
- **Seleção estruturada de Tipo**: O campo Tipo no formulário de produto foi substituído de input livre/datalist por um `<select>` nativo alimentado pelas opções cadastradas em `product_types` para o catálogo ativo (`activeCatalog.id`), ordenadas por `sort_order`. Tipo permanece opcional ("Nenhum tipo selecionado").
- **Seleção visual de Grupos**: O campo de texto livre com vírgulas e datalist para Grupos foi substituído por uma seleção múltipla visual e acessível baseada em chips e checkboxes (`#productGroupsContainer`), alimentada por `product_groups` do catálogo ativo e limitada a 10 seleções.
- **Hierarquia Categoria e Subcategoria no Produto**: O formulário agora dispõe de dois dropdowns coordenados — Categoria principal e Subcategoria vinculada. Ao selecionar a categoria raiz, o dropdown de subcategorias é preenchido dinamicamente apenas com as subcategorias filhas daquela raiz. Persistência transparente em `products.category_id` (ID da subcategoria se selecionada, ou ID da raiz se nenhuma subcategoria for escolhida).
- **Remoção de entrada livre e sugestões**: Não é mais possível digitar livremente tipos ou grupos nem criá-los dentro do formulário de produtos. O lojista é direcionado para a seção **Configurações**. Sugestões via `organization.facets` foram removidas do Admin (mantidas estritamente no catálogo público).
- **Compatibilidade e preservação de dados legados**: Produtos antigos com `product_type` ou `product_groups` que não estejam cadastrados em Configurações não têm seus dados apagados ao abrir ou fechar o modal. Avisos informativos (`#productTypeLegacyWarning`, `#productGroupsLegacyWarning`) alertam o usuário, e caso o formulário seja salvo sem alterações, as classificações legadas são mantidas.
- **Proteção contra exclusão e renomeação em uso**:
  - Se um Tipo configurado estiver em uso por algum produto do catálogo ativo, sua exclusão é bloqueada e sua renomeação é impedida no modal de edição de Configurações, exibindo mensagem de orientação ("Este tipo está sendo usado por X produto(s)..."). A alteração de `sort_order` continua permitida.
  - Se um Grupo configurado estiver em uso por algum produto do catálogo ativo, sua exclusão e renomeação também são bloqueadas de forma preventiva, preservando a consistência dos produtos sem disparar atualizações em cascata arriscadas.
- **Isolamento multiloja e concorrência**: Ao alternar o catálogo selecionado, o modal de produto é fechado automaticamente (`closeProductModal()`) para evitar salvar classificações ou dados no catálogo incorreto. Cache em memória e estado são invalidados e recarregados para a nova loja ativa.
- **Correção de layout (`.field-hint` vs `.field-counter`)**: Textos explicativos e orientações foram desacoplados da contagem de caracteres (`#descriptionCounter`), garantindo que `.field-hint` permaneça no fluxo vertical regular do documento, eliminando sobreposições sobre inputs em telas desktop e mobile.
- **Persistência inalterada**: `products.product_type` e `products.product_groups` permanecem nas tabelas existentes como camada de persistência e compatibilidade com o catálogo público e WhatsApp. Nenhuma migração ou alteração de banco foi realizada.

## [0.3.4] - 2026-09-09

### CRUD visual de Tipos e Grupos em Configurações (Etapa 3B)
- A área **Configurações** foi expandida com 4 abas estruturadas: **Categorias**, **Subcategorias**, **Tipos** e **Grupos**.
- Implementado CRUD persistente completo para **Tipos** (`product_types`): listagem ordenada por `sort_order`, cadastro com formulário dedicado, edição in-place, alteração de ordenação e exclusão confirmada por modal.
- Implementado CRUD persistente completo para **Grupos** (`product_groups`): listagem ordenada por `sort_order`, cadastro com formulário dedicado, edição in-place, alteração de ordenação e exclusão confirmada por modal.
- Textos orientativos na interface documentando que Grupos servem para classificar produtos em coleções (ex.: Promoções, Novidades, Mais pedidos), diferenciando expressamente de adicionais ou opções de montagem.
- Isolamento estrito multi-tenant derivado exclusivamente de `activeCatalog.id`: consultas filtradas por catálogo, `catalog_id` injetado pelo backend/cliente ativo sem input manual do usuário, e formulários de edição fechados automaticamente ao alternar entre lojas.
- Validações no frontend em conformidade com o banco: nome obrigatório de 1 a 60 caracteres (sanitizado com `trim`), ordenação inteira não negativa (`sort_order >= 0`) e proibição de vírgulas no nome de grupos.
- Tratamento de duplicidade: erro de unicidade (`23505`) capturado e apresentado com mensagens amigáveis ("Já existe um tipo com este nome neste catálogo." / "Já existe um grupo com este nome neste catálogo.") sem exibir erros SQL brutos.
- Estados vazios dedicados ("Nenhum tipo configurado." / "Nenhum grupo configurado.") e desativação segura das ações quando a conta não possui lojas vinculadas.
- **Importante (Transição de Etapa)**: O formulário de produto permanece utilizando temporariamente os campos legados `product_type` e `product_groups` (com input de texto e datalist de sugestões) até a Etapa 4. A exclusão ou edição de Tipos e Grupos nas novas tabelas não altera destrutivamente os produtos existentes.

## [0.3.3] - 2026-09-09

### Estrutura persistente de Tipos e Grupos (Etapa 3A)
- Criadas as tabelas persistentes `product_types` e `product_groups` vinculadas a catálogos (`catalog_id`) com integridade referencial `ON DELETE CASCADE`.
- Restrição de unicidade lógica por catálogo case-insensitive através de índices únicos em `(catalog_id, lower(name))`.
- Validações em banco: limite de 1 a 60 caracteres sem espaços nas pontas (`btrim`), sem vírgulas nos grupos e ordenação (`sort_order`) inteira não negativa.
- RLS configurado com isolamento multi-tenant estrito para usuários autenticados via `catalog.owner_id = auth.uid()` e negação total de acesso para o papel `anon`.
- Backfill transacional automático: migra e deduplica case-insensitively todos os valores existentes em `products.product_type` e `products.product_groups[]`, mantendo a caixa original mais antiga.
- Criado o script de verificação pós-migração `admin/setup/verify_catalog_types_and_groups.sql`.
- **Transição**: `product_types` e `product_groups` representam classificações configuráveis do catálogo e não grupos de adicionais. Os campos `products.product_type` e `products.product_groups` permanecem temporariamente como campos legados durante a transição até a integração definitiva de interface.

## [0.3.2] - 2026-09-09

### Configurações e organização do catálogo
- Substituída a antiga área e modal simples de "Categorias" por uma nova seção estruturada de "Configurações" (`#configuracoes`) com navegação interna por abas.
- Menu lateral atualizado: item "Categorias" substituído por "Configurações", com ícone vetorial de ajustes e contador de itens do catálogo.
- Implementada interface dedicada para **Categorias principais** (`parent_id = null`), permitindo listagem com contadores, cadastro, edição, ordenação e exclusão segura.
- Implementada interface dedicada para **Subcategorias** (`parent_id != null`), permitindo listagem com indicação visual da categoria principal vinculada, cadastro, edição, ordenação e exclusão segura.
- Regra de dois níveis preservada: a seleção de categoria pai restringe-se estritamente a categorias raiz do mesmo catálogo, impedindo a criação de um terceiro nível tanto no frontend quanto no handler de envio.
- Proteções contra exclusão indevida mantidas e aprimoradas com explicações claras ao usuário (bloqueio quando há produtos ou subcategorias vinculadas).
- Estado sem loja e alternância entre múltiplas lojas tratados: fechamento de formulários ativos na troca, isolamento estrito de dados por catálogo e preservação de `loadSequence`.
- Preservada total compatibilidade com os campos existentes de produtos (`product_type`, `product_groups`), catálogo público e WhatsApp.

## [0.3.1] - 2026-09-09

### Lojas e provisionamento
- Removido o fluxo de criação de novas lojas e catálogos pelo painel do lojista (`#newCatalogButton` removido da interface e dos scripts).
- `saveCatalog` passa a operar estritamente via `UPDATE` de loja existente; ausência de identificador aborta o salvamento sem executar `INSERT`.
- `openCatalogModal` opera exclusivamente para edição de loja existente e não abre sem catálogo válido.
- Ação destrutiva de exclusão definitiva de loja/catálogo retirada da interface do lojista para evitar perda acidental de acesso ou deixar contas sem loja provisionada.
- Tratamento explícito por quantidade de lojas:
  - **0 lojas**: exibe estado orientando contato com a Neoeffex para provisionamento e desabilita ações dependentes de loja sem gerar erro JS.
  - **1 loja**: seleciona automaticamente a loja existente e oculta o seletor.
  - **2 ou mais lojas**: exibe o seletor apenas para alternância entre lojas existentes com preservação de isolamento e proteção `loadSequence`.
- Preservadas edições de dados de loja, slug, WhatsApp, status (ativo/pausado), pedidos, produtos, categorias e proteções contra concorrência assíncrona.
- Atualizado versionamento de assets do Admin para renovação de cache.

## [0.2.0] - 2026-09-08

- Loja com exatamente um catálogo; conta pode administrar várias lojas.
- Migração transacional preserva catálogos existentes e suporta INSERT do Admin anterior.
- Categorias e subcategorias em dois níveis, com ordenação e proteção no banco.
- Tipo e grupos por produto, com sugestões no painel, busca e filtros combinados no público.
- Marca N original da Neoeffex substitui o símbolo genérico desenhado em CSS.
- Compatibilidade de leitura com o esquema anterior, sem alterar preço nem formato de carrinho.
- SETUP e checklist deixam de recomendar a antiga unicidade por conta.
- Regras comerciais de adicionais, variações e importação do cardápio não fazem parte desta versão estrutural.

## [0.1.12] - 2026-09-02

### Admin

- Fechamento dos modais por fundo exige que o clique comece e termine fora do card; arrastar do card para fora não fecha mais a edição.
- Login e logout avisam as demais abas do Admin na mesma origem, mantendo uma única conta ativa no navegador.
- O identificador acompanha automaticamente as alterações do nome até o cliente editá-lo manualmente.
- A edição manual do identificador remove espaços, acentos, maiúsculas e caracteres especiais em tempo real.
- Catálogos pausados exibem opção de exclusão com confirmação; catálogo ativo não pode ser excluído por esse fluxo.

### Logos e catálogo público

- Centralização e `object-position` das logos passam a fazer parte do estilo compartilhado, valendo para todas as contas.
- O editor aplica autoajuste inicial às logos de qualquer catálogo e tenta remover margens vazias detectáveis.
- Ao abrir o WhatsApp, o carrinho atual é salvo como último carrinho e então limpo.
- O carrinho vazio oferece `Restaurar último carrinho` quando houver um pedido anterior válido neste navegador.

### Banco e segurança

- Nova migration `010_delete_paused_catalog.sql` executa a exclusão em uma transação com `SECURITY INVOKER`.
- A função valida usuário autenticado, propriedade e status pausado antes de remover catálogo, produtos e categorias.
- Execução da função é revogada de `public` e `anon` e concedida somente a `authenticated`.
- Arquivos são removidos posteriormente pela Storage API, conforme a orientação do Supabase.

## [0.1.11] - 2026-09-02

### Regra do MVP

- Admin passa a operar com `1 conta → 1 catálogo`.
- `Novo catálogo` fica disponível apenas enquanto a conta não possui catálogo.
- Contas com exatamente um catálogo não exibem seletor desnecessário.
- Contas legadas com múltiplos catálogos continuam acessíveis, mas não podem criar novos.
- Nova migration 009 permite reforçar a regra também no banco por `owner_id`.

### Feedback

- Colisão de slug/endereço continua sendo validada pelo banco.
- A mensagem de endereço/identificador já utilizado agora também é exibida como toast.
- Tentativa de criar um segundo catálogo mostra toast e mensagem no formulário.

### Segurança e compatibilidade

- A migration 009 não apaga nem mescla dados.
- Se detectar contas com múltiplos catálogos, a migration é interrompida sem aplicar alterações.
- RLS, Auth, produtos, categorias, Storage, carrinho e WhatsApp permanecem inalterados.
- Nenhuma URL pública de catálogo existente é modificada.

## [0.1.10.1] - 2026-09-02

### Catálogo da Lu

- Substituído o marcador genérico “Lu Leve e Saudável” do cabeçalho pela logo oficial horizontal do pack atualizado.
- Cabeçalho usa composição com símbolo à esquerda e nome à direita.
- Hero passa a usar a versão quadrada oficial sem texto.
- Mantido arredondamento discreto apenas na própria imagem quadrada, sem moldura externa.
- Fundo do cabeçalho da Lu ajustado para integrar visualmente o fundo claro da arte.
- Outros catálogos permanecem inalterados.

### Segurança e compatibilidade

- Nenhuma migration.
- Nenhuma alteração em RLS, Auth, Storage ou lógica do carrinho.
- Correção restrita ao tema/ativos do slug `lu-leve-e-saudavel`.

## [0.1.10] - 2026-09-02

### Catálogo público

- Atualizada a logo específica do catálogo `lu-leve-e-saudavel` a partir do pack oficial recebido.
- Criado ativo quadrado dedicado em `catalogo/assets/images/brands/lu-leve-e-saudavel/logo-catalogo.webp`.
- Logo exibida sem moldura externa e com cantos discretamente arredondados.
- Logo cadastrada no Storage permanece como fallback caso o ativo local não carregue.
- Toast de “adicionado ao pedido” movido para cima do botão flutuante do carrinho.
- Toast passa a ignorar eventos de ponteiro para nunca impedir clique no carrinho.
- Ajuste mobile posiciona toast e carrinho com espaçamento consistente.

### Compatibilidade e segurança

- Nenhuma migration nova.
- Nenhuma alteração em tabelas, buckets, RLS, autenticação ou fluxo do WhatsApp.
- Outros catálogos continuam usando suas logos cadastradas normalmente.
- Tema da Lu continua isolado pelo slug.

## [0.1.9.4] - 2026-09-02

### Adicionado

- Primeiro tema visual específico por slug no catálogo compartilhado.
- Tema `lu-leve-e-saudavel` derivado das variáveis visuais da landing v0.1.18.
- Sora e Manrope reutilizadas a partir dos arquivos locais já existentes do site.
- Cabeçalho e rodapé do catálogo da Lu passam a retornar para `/sites/lu-leve-e-saudavel/`.
- Documento operacional `CATALOG_THEME_LU.md`.

### Visual

- Paleta verde, creme, sage e dourado aplicada ao catálogo da Lu.
- Cards, filtros, busca, hero, carrinho, botões e estados adaptados à identidade da marca.
- Hover dos cards deixa de deslocar o componente, seguindo o sistema visual da landing.
- Outros slugs continuam usando o tema padrão Neoeffex.

### Segurança e compatibilidade

- Tema é selecionado por whitelist fixa de slug.
- Nenhum CSS, HTML ou JavaScript arbitrário é aceito pela URL.
- Nenhuma migration, tabela, bucket, RLS ou fluxo de pedidos foi alterado.
- Núcleo de `catalogo.js` permanece intacto.

## [0.1.9.3] - 2026-09-02

### Adicionado

- Guia rápido do cliente em `docs/client/QUICK_START.md`.
- Política operacional de suporte.
- Documento de escopo do MVP.
- Aviso operacional de privacidade alinhado ao comportamento atual.
- Especificação e checklist do catálogo demo.
- Simulação final da Etapa 10 antes do cliente piloto.

### Atualizado

- Onboarding passa a entregar o guia rápido e explicar o escopo do MVP.
- Ficha de cliente registra entrega de guia, escopo e aviso de privacidade.
- Checklist de release referencia o catálogo demo formal.
- Painel identifica a versão operacional `0.1.9.3`.

### Privacidade e escopo

- Documentado que o carrinho público usa `localStorage` por catálogo.
- Documentado que o catálogo monta a mensagem e abre o WhatsApp sem persistir pedido em painel próprio.
- SLA, retenção e canais não definidos permanecem explicitamente pendentes.

### Segurança e compatibilidade

- Nenhuma migration, tabela, bucket, RLS ou autenticação foi alterada.
- Nenhum WhatsApp real foi incluído no catálogo demo.
- Fluxos funcionais do Admin e catálogo permanecem inalterados.

## [0.1.9.2] - 2026-09-02

### Adicionado

- Procedimento de backup separado entre código, banco e Storage.
- Procedimento de rollback de código sem reescrever histórico remoto.
- Critérios para avaliar rollback de banco sem reversão destrutiva automática.
- Checklist operacional completo para releases globais.
- Registro obrigatório de versão e commit estáveis antes de alterações de alto risco.

### Atualizado

- `PRODUCTION-CHECKLIST.md` passa a ser focado em segurança e deixa de orientar a reaplicação da migration 007 em todo release.
- Offboarding agora exige backup apropriado antes de exclusão definitiva.
- Ficha do cliente passa a registrar último backup e última validação.
- Painel identifica a versão operacional `0.1.9.2`.

### Segurança

- Backups de banco não são tratados como backup dos objetos do Storage.
- Connection strings e senhas não devem ser armazenadas no repositório.
- Rollback de banco exige análise e autorização; `DROP TABLE`/`DROP COLUMN` não são usados como reversão automática.
- Nenhuma migration, tabela, bucket ou política RLS foi alterada nesta versão.

### Compatibilidade

- A `v0.1.9.2` é operacional/documental.
- Fluxos de Admin, catálogo, imagens, carrinho e WhatsApp permanecem inalterados.

## [0.1.9.1] - 2026-09-02

### Adicionado

- Procedimento de suspensão temporária sem exclusão de dados.
- Procedimento de reativação reutilizando a mesma conta e o mesmo catálogo.
- Processo de cancelamento/offboarding com separação entre pausa, retenção e exclusão definitiva.
- Tratamento distinto para cancelamento de um catálogo e encerramento integral de uma conta.
- Campos de ciclo de vida adicionados à ficha operacional do cliente.

### Operação

- A pausa do catálogo passa a ser o mecanismo padrão de suspensão.
- Bloqueio de acesso administrativo, quando necessário, permanece uma ação manual controlada no Supabase.
- Offboarding exige conferência do proprietário, outros catálogos e arquivos do Storage antes de qualquer exclusão.
- Prazos de retenção e autorização final permanecem marcados como `PENDENTE DE DEFINIÇÃO COMERCIAL`.

### Segurança

- Suspensão não exclui usuário, catálogo, produtos, categorias ou imagens.
- Cancelamento não autoriza exclusão imediata.
- Nenhuma migration, tabela, bucket, política RLS ou fluxo de autenticação foi alterado.
- Nenhum comando destrutivo ou automação de exclusão em massa foi adicionado.

### Compatibilidade

- Fluxos de onboarding da `v0.1.9` permanecem válidos.
- Admin e catálogo público continuam usando a mesma base funcional.

## [0.1.9] - 2026-09-02

### Adicionado

- Estrutura inicial de operação em `docs/operations/`.
- Procedimento oficial de onboarding dos primeiros clientes.
- Ficha operacional reutilizável para cadastro e validação.
- Checklist obrigatório de identidade, produtos, mobile, aba anônima e pedido pelo WhatsApp.

### Atualizado

- `README.md` passou a refletir o estado atual do sistema de catálogo.
- `admin/setup/SETUP.md` agora inclui a migration `008_catalog_identity.sql` na ordem de instalação.
- Documentada a ordem crítica `007 → 008` quando o hardening de segurança for reaplicado.
- Painel passa a identificar o bloco atual como Etapa 10 / versão `0.1.9`.

### Segurança

- Onboarding mantém cadastro público fechado e criação manual de contas.
- O procedimento proíbe registrar senhas, tokens, secrets ou `service_role`.
- Nenhuma política RLS, bucket, tabela ou migration foi alterada nesta versão.

### Compatibilidade

- `v0.1.9` é uma atualização operacional e documental.
- Fluxos de catálogo, identidade, imagens, carrinho e WhatsApp permanecem inalterados.

## [0.1.8.3] - 2026-09-01

### Corrigido

- Removida a moldura branca fixa ao redor da logo no catálogo público.
- A logo agora respeita melhor o próprio formato e fundo do arquivo.
- Ajustados limites responsivos de largura e altura para logos horizontais, quadradas e verticais.
- Mantido `object-fit: contain`, evitando deformação da identidade visual.
- Adicionado apenas um acabamento discreto diretamente na imagem, sem criar um segundo cartão visual.

### Compatibilidade

- Nenhuma migration, tabela, coluna, bucket, RLS ou fluxo de upload foi alterado.
- O editor de imagens da v0.1.8.2 permanece intacto.

## [0.1.8.2] - 2026-09-01

### Adicionado

- Editor simples para enquadrar imagens de produtos e logos antes do upload.
- Produto com saída 4:3, zoom, arraste, grade, preencher, encaixar, centralizar e rotação.
- Logo com encaixe proporcional, zoom, arraste, rotação e remoção opcional de margens vazias.
- Otimização da imagem final em WebP mantendo os fluxos de upload e Storage existentes.

### Corrigido

- O carregamento do editor foi removido de `admin/config.js`; o arquivo de configuração voltou exatamente ao fluxo estável da v0.1.8.
- O editor agora é carregado de forma isolada pelo módulo de identidade, evitando bloquear a inicialização principal do Admin.

### Segurança e compatibilidade

- Nenhuma migration, tabela, coluna, bucket ou política RLS foi alterada.
- O upload continua usando os validadores e caminhos seguros já existentes.

## [0.1.8] - 2026-09-01

### Adicionado

- Identidade básica por catálogo com logo, descrição curta, região/endereço, horário e forma de atendimento.
- Upload opcional de logo JPEG, PNG e WebP com limite de 2 MB, prévia, troca e remoção.
- Exibição da identidade do comércio no topo do catálogo público, com fallback para catálogos antigos.
- Migração `008_catalog_identity.sql` com novos campos, bucket dedicado e políticas de Storage isoladas por proprietário e catálogo.
- Módulos de identidade separados do núcleo já validado do painel e do catálogo público.

### Segurança

- As regras RLS e os privilégios definidos na Etapa 9 permanecem intactos.
- Logos usam caminho `{owner_id}/{catalog_id}/{timestamp}.{ext}` e não usam `upsert`.
- O catálogo público continua lendo somente catálogos ativos e os novos textos são renderizados com `textContent`.
- Nenhuma chave secreta, `service_role` ou HTML/CSS arbitrário foi adicionado.

### Compatibilidade

- Catálogos existentes continuam funcionando sem preencher nenhum dos novos campos.
- A identidade é carregada como módulo adicional, sem alterar os arquivos centrais `admin.js`, `admin.css`, `catalogo.js` e `catalogo.css` da versão 0.1.7.

## [0.1.7] - 2026-09-01

### Adicionado

- Migração `007_security_hardening.sql` para reaplicar privilégios mínimos, RLS e políticas do Storage.
- Auditoria SQL somente de leitura para validar os controles essenciais antes da publicação.
- Checklist de produção com teste entre duas contas, teste anônimo, autenticação e rollback.
- Política de Segurança de Conteúdo e política de referência no painel, na redefinição de senha e no catálogo público.

### Segurança

- A sessão persistida agora é validada no servidor antes de liberar o painel.
- O catálogo lembrado é removido do navegador no logout.
- A lista de produtos passou a usar criação segura de elementos e `textContent`, sem montar HTML com dados cadastrados.
- Privilégios de `anon` são limitados às colunas públicas; escrita continua exclusiva de contas autenticadas e isolada por proprietário.
- Links externos em nova aba usam `noopener noreferrer`.

### Operação

- Versões de `/admin` e `/catalogo` sincronizadas em `0.1.7`.
- Configurações obrigatórias de cadastro fechado, redirect exato, SMTP próprio e MFA documentadas.

## [0.1.6] - 2026-08-31

### Adicionado

- Upload opcional de imagens JPEG, PNG e WebP para produtos, limitado a 5 MB.
- Prévia da imagem, substituição e remoção pelo formulário do produto.
- Exibição das imagens no painel e no catálogo público, com carregamento tardio e fallback.
- Migração `006_product_images.sql` para coluna pública, bucket e políticas do Storage.

### Segurança

- Upload exige produto pertencente a um catálogo da conta autenticada.
- Caminhos usam usuário, catálogo, produto e nome único para impedir colisões e cache antigo.
- Somente o caminho da imagem é liberado ao papel `anon`; nenhuma escrita pública foi adicionada.

### Corrigido

- Qualificada a coluna `storage.objects.name` nas políticas do Storage para evitar referência ambígua durante a execução da migração.

## [0.1.5] - 2026-08-31

### Adicionado

- Configuração de WhatsApp, ativação de pedidos e instrução própria para cada catálogo.
- Resumo da configuração de pedidos no painel administrativo.
- Carrinho público com quantidades, remoção, total e persistência local por catálogo.
- Mensagem estruturada com itens, subtotais e total para envio por `wa.me`.
- Migração `005_whatsapp_orders.sql` com validações e privilégios públicos mínimos.

### Segurança

- Nenhum pedido ou dado do visitante é gravado no banco nesta etapa.
- O papel `anon` continua sem escrita e recebe leitura somente dos novos campos públicos necessários.
- Número, ativação e instrução são validados no navegador e por restrições do banco.
- Políticas públicas agora se aplicam somente a `anon`, preservando o isolamento entre contas autenticadas.

## [0.1.4.1] - 2026-08-31

### Corrigido

- Corrigido o contraste das opções dos campos de seleção no tema escuro.
- As opções agora recebem cores explícitas de fundo e texto, inclusive antes de passar o mouse.

## [0.1.4] - 2026-08-31

### Adicionado

- Página pública em `/catalogo/?catalogo=identificador`, com busca e filtros por categoria.
- Botão **Ver catálogo** no painel para abrir o catálogo ativo em uma nova aba.
- Estado seguro para catálogo inexistente, pausado, vazio ou temporariamente indisponível.
- Compartilhamento do endereço público usando os recursos disponíveis no navegador.
- Migração `004_public_catalog_access.sql` para liberar somente a leitura pública necessária.
- Índices de ordenação para categorias e produtos públicos ativos.

### Segurança

- Visitantes visualizam somente catálogos ativos e produtos ativos.
- O papel `anon` recebe acesso apenas às colunas usadas pela página pública e nenhuma permissão de escrita.
- `owner_id` e dados administrativos não são disponibilizados ao visitante.
- A página pública usa um cliente sem persistência de sessão.

## [0.1.3.1] - 2026-08-31

### Corrigido

- Corrigido o botão de salvar categoria que ficava desabilitado após criar a primeira categoria com sucesso.

## [0.1.3] - 2026-08-30

### Adicionado

- Seletor de vários catálogos por conta, com lembrança da última escolha no navegador.
- Criação e edição de catálogo com nome, identificador único e status ativo.
- Cadastro, edição e exclusão protegida de categorias por catálogo.
- Migração SQL que converte as categorias de texto existentes em registros próprios.
- Produtos vinculados a uma categoria real, com validação no navegador e no banco.

### Segurança

- Nova tabela `categories` com RLS, permissões explícitas e políticas de proprietário do catálogo.
- Chave estrangeira composta que impede vincular um produto a uma categoria de outro catálogo.
- Exclusão de categoria bloqueada quando ainda há produtos vinculados.
- Nenhuma regra pública foi adicionada: visitantes anônimos continuam sem acesso aos dados.

## [0.1.2] - 2026-08-30

### Adicionado

- Cadastro de produtos vinculado ao catálogo da conta autenticada.
- Edição de nome, descrição, categoria, preço e status.
- Pausa e reativação rápidas pelo formulário de edição.
- Exclusão com confirmação explícita.
- Validação de dados no navegador antes de cada gravação.
- Atualização automática dos indicadores e da lista após alterações.

### Segurança

- Todas as operações usam o cliente autenticado e as regras RLS já criadas na Etapa 2.
- A interface não cria ou altera dados quando não há catálogo vinculado à conta.
- A exclusão não é acionada por clique único.

## [0.1.1] - 2026-08-30

### Adicionado

- Login por e-mail e senha usando Supabase Auth.
- Persistência de sessão, encerramento local de sessão e recuperação de senha.
- Página segura para definição de nova senha.
- Estrutura SQL de catálogos e produtos.
- Regras RLS: cada usuário autenticado acessa somente seus próprios catálogos e produtos; visitantes não recebem acesso aos dados.
- Consulta de catálogo e produtos no banco, com busca e filtro mantidos.
- Guia de configuração e arquivos SQL separados.

### Removido

- Dados locais de demonstração, para evitar divergência entre painel e banco de dados.

### Não incluído

- Cadastro, edição, pausa e exclusão de produtos.
- Gestão de vários catálogos na mesma sessão.
- Pedidos e integração com WhatsApp.

## [0.1.0] - 2026-08-30

### Adicionado

- Estrutura inicial isolada em `admin/`.
- Painel de produtos responsivo com tema claro e escuro.
- Dados locais de demonstração, busca e filtro por status.
- Indicadores de produtos, categorias e itens ativos.

### Deliberadamente não incluído

- Login e gestão de usuários.
- Banco de dados.
- Inclusão, edição e exclusão persistentes.
- Pedidos e integração com WhatsApp.

