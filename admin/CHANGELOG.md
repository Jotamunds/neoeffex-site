# Changelog — Painel administrativo

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
