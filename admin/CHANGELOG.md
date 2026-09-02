# Changelog — Painel administrativo

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
