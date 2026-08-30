# Changelog — Painel administrativo

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
