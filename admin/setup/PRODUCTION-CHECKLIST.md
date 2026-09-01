# Checklist de produção — Etapa 9

Use este documento antes de cadastrar o primeiro comércio e antes de toda atualização global.

## 1. Ordem obrigatória da atualização

1. Guarde uma cópia do banco e dos ZIPs atualmente publicados.
2. Execute `007_security_hardening.sql` no SQL Editor.
3. Execute `audits/production_security_audit.sql`.
4. Continue somente se todas as verificações retornarem `PASS`.
5. Publique `/admin` e `/catalogo` da mesma versão.
6. Faça os testes deste documento no domínio publicado.
7. Se um fluxo essencial falhar, restaure os ZIPs anteriores e investigue antes de atender clientes.

## 2. Configurações obrigatórias no Supabase

### Authentication → Sign In / Providers → Email

- Desative **Allow new users to sign up**. Os clientes devem ser criados manualmente por você.
- Mantenha **Allow anonymous sign-ins** desativado.
- Use confirmação de e-mail ou convites para novas contas.
- Use senhas únicas com pelo menos 12 caracteres.

### Authentication → URL Configuration

- Site URL: `https://neoeffex.com.br/admin/`
- Redirect URL: `https://neoeffex.com.br/admin/reset-password.html`
- Evite curingas no endereço de produção.

### Authentication → Emails

- Configure um SMTP próprio antes de tratar a recuperação de senha como serviço de produção.
- Teste o recebimento e o link de redefinição com um e-mail que não pertença à equipe do Supabase.
- Mantenha a validade dos links de recuperação em uma hora ou menos.

### Segurança da conta e do projeto

- Ative MFA na sua conta Supabase.
- Ative 2FA no GitHub que publica o site.
- Execute **Security Advisor** e corrija alertas relacionados às tabelas deste projeto.
- Execute **Performance Advisor** e revise índices sugeridos.
- Verifique SSL Enforcement e as opções de restrição de rede disponíveis para o plano.

## 3. Teste com duas contas

Crie duas contas exclusivas de teste: Comércio A e Comércio B.

### Preparação

1. Entre como Comércio A e crie um catálogo, uma categoria, um produto e uma imagem.
2. Copie o link público e saia do painel.
3. Entre como Comércio B e crie dados diferentes.

### Resultado obrigatório

- Comércio B não encontra o catálogo, as categorias ou os produtos do Comércio A no painel.
- O seletor do Comércio B não preserva o catálogo da conta anterior.
- Comércio B não consegue editar ou excluir os registros do Comércio A.
- Imagens enviadas pelo Comércio B usam a pasta do usuário B.
- Sair da conta remove a sessão e volta ao login.

Se qualquer item falhar, não publique para clientes.

## 4. Teste público em aba anônima

1. Abra o catálogo do Comércio A em uma aba anônima.
2. Confirme que o catálogo ativo aparece.
3. Pause um produto e atualize a aba anônima: ele deve desaparecer.
4. Pause o catálogo: o endereço deve informar que ele está pausado ou não foi encontrado.
5. Reative o catálogo e o produto.
6. Monte um carrinho, altere quantidades e confira o total.
7. Abra o WhatsApp e confirme o número, os itens, as quantidades e os valores.

Visitantes nunca devem receber acesso ao painel ou a operações de escrita.

## 5. Teste de imagens

- JPEG, PNG e WebP com até 5 MB são aceitos.
- GIF, SVG, PDF e arquivos acima de 5 MB são bloqueados.
- Substituir uma imagem remove a referência anterior.
- Remover a imagem mantém o produto e exibe o fallback.
- Excluir um produto remove sua imagem do Storage.

## 6. Teste de autenticação

- Login correto abre somente os dados da conta.
- Login incorreto usa uma mensagem genérica e não informa se o e-mail existe.
- Recuperação de senha sempre retorna uma mensagem genérica.
- O link recebido abre `/admin/reset-password.html`.
- Senhas com menos de 12 caracteres são recusadas pelo formulário.
- Depois da redefinição, a nova senha entra e a antiga deixa de funcionar.

## 7. Verificação dos arquivos publicados

- `admin/VERSION` e `catalogo/VERSION` mostram a mesma versão.
- `config.js` contém somente URL e chave publicável.
- Não existem `service_role`, secret key, senha de banco ou credenciais de cliente no repositório.
- A biblioteca do Supabase está fixada em uma versão específica, sem usar apenas `@2`.
- `/admin` não aparece em mecanismos de busca.
- O catálogo funciona em celular e computador.

## 8. Critério de liberação

O primeiro cliente pode ser cadastrado somente quando:

- A auditoria SQL retornar apenas `PASS`.
- Os testes com duas contas forem aprovados.
- A recuperação de senha estiver funcionando no domínio oficial.
- Um pedido completo chegar ao WhatsApp correto.
- Houver uma cópia da versão anterior para rollback.

Referências:

- [Production Checklist do Supabase](https://supabase.com/docs/guides/deployment/going-into-prod)
- [Configuração geral do Auth](https://supabase.com/docs/guides/auth/general-configuration)
- [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [SMTP próprio](https://supabase.com/docs/guides/auth/auth-smtp)
