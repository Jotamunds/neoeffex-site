# Configuração da Etapa 2

## 1. Criar o projeto

Crie um projeto no Supabase dedicado ao catálogo. Não reutilize um projeto de outro sistema.

## 2. Criar a estrutura do banco

No SQL Editor, execute `001_initial_schema.sql` inteiro. Ele cria as tabelas, índices, atualização automática de data, permissões e regras RLS.

As permissões são explícitas porque tabelas novas podem não ser expostas automaticamente pela Data API. Ainda assim, visitantes anônimos não recebem nenhuma permissão nos dados do painel.

## 3. Fechar o cadastro público

Em **Authentication > General Configuration**, desative **Allow new users to sign up** e **Allow anonymous sign-ins**. Este painel não terá cadastro aberto: novas contas devem ser criadas por você no painel do Supabase.

Mantenha a confirmação de e-mail ativada para contas criadas por convite ou fluxo de e-mail.

## 4. Criar a primeira conta

No painel do Supabase, abra **Authentication > Users** e crie o usuário administrador com e-mail e senha forte. Confirme o e-mail da conta quando necessário.

Copie o UUID desse usuário e execute `002_seed_example.sql`, substituindo o marcador pelo UUID real. O retorno exibirá o UUID do catálogo. Use-o, se desejar, para inserir os primeiros produtos do exemplo comentado.

## 5. Configurar URLs de autenticação

Em **Authentication > URL Configuration**, adicione:

```text
Site URL: https://neoeffex.com.br
Redirect URL: https://neoeffex.com.br/admin/reset-password.html
```

Para testes locais, também adicione a URL usada pelo Live Server, por exemplo `http://127.0.0.1:5500/admin/reset-password.html`.

## 6. Conectar o painel

No Supabase, copie a **Project URL** e a **publishable key**. Preencha os dois valores em `admin/config.js`:

```js
window.NEOEFFEX_SUPABASE_CONFIG = Object.freeze({
    url: "https://seu-projeto.supabase.co",
    publishableKey: "sb_publishable_..."
});
```

A chave publicável pode ficar no navegador porque as regras RLS protegem as tabelas. Nunca cole uma `service_role`, chave secreta ou senha do banco em qualquer arquivo de `admin/`.

## 7. Testar antes de publicar

1. Abra `admin/index.html`.
2. Entre com a conta criada.
3. Confirme que apenas o catálogo vinculado àquela conta é exibido.
4. Clique em **Sair** e confirme que o painel volta para o login.
5. Teste **Esqueci minha senha** e confirme que o link abre `reset-password.html`.

Para produção, configure SMTP próprio antes de depender de e-mails de recuperação em volume.
