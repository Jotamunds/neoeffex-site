# Changelog — Painel administrativo

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
