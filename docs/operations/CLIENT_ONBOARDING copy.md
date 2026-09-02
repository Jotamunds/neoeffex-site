# Onboarding de cliente — Neoeffex

## Versão

```text
Procedimento: v0.1.9
Etapa: 10 — Operação e entrega ao cliente
```

## Objetivo

Cadastrar e entregar um novo comércio usando somente os mecanismos seguros já existentes.

Este procedimento deve permitir que outra pessoa da operação repita o onboarding sem depender da memória de quem desenvolveu o sistema.

---

# 1. Regras obrigatórias

Durante o onboarding:

- não anotar senha do cliente;
- não colocar senha em `CLIENT_TEMPLATE.md`;
- não enviar senha por commit, ZIP ou arquivo do projeto;
- não usar a conta de outro comércio;
- não reutilizar catálogo de outro cliente;
- não alterar RLS;
- não alterar políticas de Storage;
- não usar `service_role` no navegador;
- não ativar um catálogo incompleto;
- não considerar o pedido confirmado apenas porque o WhatsApp abriu.

Para os primeiros clientes, procedimentos manuais são aceitáveis.

Não criar superadmin apenas para acelerar o onboarding.

---

# 2. Pré-requisitos da plataforma

Antes de iniciar um cliente real:

```text
[ ] 001_initial_schema.sql aplicada
[ ] 003_categories_and_multi_catalogs.sql aplicada
[ ] 004_public_catalog_access.sql aplicada
[ ] 005_whatsapp_orders.sql aplicada
[ ] 006_product_images.sql aplicada
[ ] 007_security_hardening.sql aplicada
[ ] 008_catalog_identity.sql aplicada
[ ] Auditoria de segurança revisada
[ ] Cadastro público desativado
[ ] Login funcionando
[ ] Recuperação de senha funcionando
[ ] SMTP de produção validado
[ ] admin/VERSION e catalogo/VERSION sincronizados
[ ] Conta A x Conta B já foi testada
[ ] Há uma versão anterior identificável para rollback
```

## Ordem crítica de migrations

Se a migration 007 for reaplicada:

```text
007_security_hardening.sql
        ↓
008_catalog_identity.sql
```

A 008 deve vir depois para restaurar os grants públicos das colunas de identidade.

---

# 3. Abrir uma ficha de cliente

Crie uma cópia de:

```text
docs/operations/CLIENT_TEMPLATE.md
```

A ficha pode ficar fora do repositório quando contiver dados reais do cliente.

Se uma ficha real for mantida no repositório, verifique antes se isso está de acordo com a política de privacidade e com o processo comercial adotado.

Nunca registrar nela:

```text
senha
secret
service role
token
código de recuperação
```

---

# 4. Dados que precisam ser recebidos

## Identificação

```text
[ ] Nome do comércio
[ ] Nome do responsável
[ ] E-mail que será usado no Admin
[ ] WhatsApp que receberá pedidos
```

## Catálogo

```text
[ ] Slug desejado
[ ] Logo
[ ] Descrição curta
[ ] Região ou endereço comercial
[ ] Horário
[ ] Retirada, entrega ou ambos
```

## Produtos

```text
[ ] Categorias
[ ] Nome de cada produto
[ ] Preço
[ ] Descrição
[ ] Imagem
[ ] Produtos que devem começar pausados
```

## Confirmações

```text
[ ] Cliente confirmou o WhatsApp
[ ] Cliente aprovou o slug
[ ] Cliente sabe que logo e dados de identidade serão públicos
[ ] Cliente revisou os preços fornecidos
```

Não avance para a ativação se o número do WhatsApp não estiver confirmado.

---

# 5. Preparar as imagens

Antes de cadastrar:

## Logo

Preferir:

```text
JPEG, PNG ou WebP
até 2 MB no arquivo selecionado
```

Usar o editor do Admin quando necessário:

- Encaixar;
- Zoom;
- Centralizar;
- Girar;
- Remover margens quando fizer sentido.

A logo pública deve ser conferida depois no catálogo real, porque o enquadramento do editor não substitui a validação visual final.

## Produto

Preferir:

```text
JPEG, PNG ou WebP
até 5 MB no arquivo selecionado
```

O editor prepara a saída 4:3.

Conferir:

- foco do produto;
- ausência de corte importante;
- legibilidade;
- orientação;
- resultado mobile.

---

# 6. Criar a conta

## Regra

O cadastro público deve continuar desativado.

A conta é criada manualmente pela operação Neoeffex no Supabase.

## Procedimento

1. abra o projeto Supabase correto;
2. entre em **Authentication → Users**;
3. confirme novamente o e-mail informado pelo cliente;
4. crie ou convide o usuário usando o fluxo disponível no projeto;
5. prefira convite/confirmação de e-mail;
6. deixe o cliente definir a própria senha;
7. confirme que a conta aparece no projeto correto;
8. registre na ficha apenas que a conta foi criada;
9. não copie a senha para a ficha.

## Primeiro acesso

O cliente deve:

1. concluir o convite/definição de senha;
2. abrir `/admin/`;
3. entrar;
4. confirmar que vê somente os próprios dados.

Se o cliente precisar de ajuda para cadastrar o conteúdo inicial, prefira uma sessão de onboarding com o cliente autenticado.

Não peça para o cliente enviar a senha por mensagem.

---

# 7. Criar o catálogo

Com a conta correta autenticada:

1. clique em **Novo catálogo**;
2. informe o nome;
3. informe o slug;
4. durante o preenchimento inicial, deixe o catálogo **inativo**;
5. salve;
6. confirme que ele aparece no seletor da conta correta.

## Slug

Usar:

```text
letras minúsculas
números
hífens
```

Exemplo:

```text
cafe-do-centro
```

Evitar:

```text
espaços
acentos
caracteres especiais
nome de outro cliente
```

URL esperada:

```text
/catalogo/?catalogo=cafe-do-centro
```

---

# 8. Configurar a identidade

Edite o catálogo e preencha:

```text
[ ] Logo
[ ] Descrição curta
[ ] Região/endereço
[ ] Horário
[ ] Forma de atendimento
```

A forma de atendimento pode ser:

```text
Retirada
Entrega
Retirada e entrega
```

Depois de salvar, ainda mantenha o catálogo inativo até o conteúdo ser revisado.

---

# 9. Configurar pedidos por WhatsApp

No mesmo catálogo:

```text
[ ] Número do WhatsApp
[ ] Instrução ao cliente
[ ] Receber pedidos
```

## Número

Conferir:

```text
DDI
DDD
número
```

Não copiar número de catálogo demo ou de outro cliente.

## Instrução

Usar uma mensagem curta e realista.

Exemplo operacional:

```text
Confirme disponibilidade, prazo e forma de pagamento pelo WhatsApp.
```

Não prometer funcionalidades que o sistema não possui.

---

# 10. Criar categorias

Criar somente categorias necessárias.

Exemplos:

```text
Tradicionais
Fitness
Bebidas
Sobremesas
```

Evitar deixar categorias vazias apenas para uso futuro.

Para cada categoria:

```text
[ ] Nome revisado
[ ] Pertence ao catálogo correto
[ ] Possui produtos quando a loja for ativada
```

---

# 11. Criar produtos

Para cada produto:

```text
[ ] Nome
[ ] Categoria
[ ] Preço
[ ] Descrição
[ ] Imagem
[ ] Status
```

## Conferência de preço

Antes de salvar:

```text
Preço recebido:
Preço digitado:
Conferido por:
```

A verificação pode ser feita na ficha operacional sem registrar informações desnecessárias.

## Status

Produtos que ainda não devem aparecer podem ficar pausados.

Não excluir um produto apenas porque ele não está disponível temporariamente.

---

# 12. Revisão dentro do Admin

Antes de ativar:

```text
[ ] Nome do catálogo correto
[ ] Slug correto
[ ] Logo correta
[ ] Descrição correta
[ ] Região/endereço correto
[ ] Horário correto
[ ] Atendimento correto
[ ] WhatsApp correto
[ ] Categorias corretas
[ ] Produtos corretos
[ ] Preços corretos
[ ] Imagens corretas
[ ] Produtos indisponíveis estão pausados
```

---

# 13. Ativar o catálogo

Somente depois da revisão:

1. edite o catálogo;
2. marque **Catálogo ativo**;
3. salve;
4. abra **Ver catálogo**;
5. copie a URL final.

---

# 14. Validação pública

## Desktop

Conferir:

```text
[ ] Página abre
[ ] Nome aparece
[ ] Logo aparece corretamente
[ ] Descrição aparece
[ ] Região/endereço aparece
[ ] Horário aparece
[ ] Atendimento aparece
[ ] Categorias aparecem
[ ] Produtos aparecem
[ ] Preços aparecem
[ ] Imagens aparecem
[ ] Produto sem imagem usa fallback
[ ] Busca funciona
[ ] Filtros funcionam
```

## Mobile

Conferir em uma largura de celular:

```text
[ ] Hero não quebra
[ ] Logo não deforma
[ ] Textos cabem
[ ] Produtos são legíveis
[ ] Carrinho é acessível
[ ] Botões são clicáveis
[ ] Editor do Admin não é necessário para visualizar o público
```

---

# 15. Validação em aba anônima

Abra a URL em aba anônima.

Isso confirma o comportamento do visitante sem sessão administrativa.

Verificar:

```text
[ ] Catálogo ativo abre
[ ] Conteúdo público aparece
[ ] Painel não fica acessível
[ ] Produtos pausados não aparecem
[ ] Carrinho funciona
```

---

# 16. Pedido de teste obrigatório

Nenhum catálogo deve ser entregue sem este teste.

## Fluxo

1. abra o catálogo como visitante;
2. adicione um produto;
3. aumente a quantidade;
4. diminua a quantidade;
5. adicione um segundo produto;
6. confira subtotais;
7. confira total;
8. clique em **Enviar pedido pelo WhatsApp**;
9. confira o destinatário;
10. confira os itens;
11. confira quantidades;
12. confira valores;
13. confira a instrução final.

## Checklist

```text
[ ] Produto correto
[ ] Quantidade correta
[ ] Subtotal correto
[ ] Total correto
[ ] WhatsApp correto
[ ] Texto compreensível
[ ] Instrução correta
```

Abrir o WhatsApp **não significa que o pedido foi confirmado**.

### Envio real da mensagem

Se for necessário enviar a mensagem para concluir o teste:

- faça isso com autorização do responsável;
- deixe claro que é um pedido de teste;
- não use o número de outro cliente.

---

# 17. Testar pausa e reativação do catálogo

Antes da entrega, para o primeiro cliente piloto ou em uma conta de teste:

1. pause o catálogo;
2. atualize a URL pública;
3. confirme que fica indisponível;
4. reative;
5. confirme que os dados voltam;
6. faça novamente uma abertura pública.

A pausa não deve excluir:

```text
produtos
categorias
imagens
identidade
usuário
```

O procedimento completo de suspensão operacional será formalizado em `v0.1.9.1`.

---

# 18. Recuperação de senha

Antes de considerar o onboarding concluído:

1. saia do Admin;
2. abra o fluxo **Esqueci minha senha**;
3. use o e-mail do cliente com autorização;
4. confirme recebimento;
5. confirme que o link abre o domínio correto;
6. não conclua uma troca real de senha sem combinar com o cliente.

Para a primeira implantação, o cliente deve saber executar esse fluxo.

---

# 19. Entrega

Entregar ao cliente:

```text
URL do Admin
URL do catálogo
E-mail da conta
Canal de suporte
```

Não entregar:

```text
senha anotada
chave Supabase
token
service role
acesso ao banco
```

O guia simplificado do cliente será formalizado na `v0.1.9.3`.

Até lá, faça a entrega acompanhada e demonstre:

- entrar;
- editar catálogo;
- criar categoria;
- criar produto;
- editar produto;
- alterar imagem;
- pausar produto;
- conferir catálogo;
- fazer pedido de teste.

---

# 20. Checklist final de onboarding

```text
[ ] Dados recebidos
[ ] Ficha criada
[ ] Conta criada
[ ] E-mail confirmado
[ ] Primeiro acesso testado
[ ] Catálogo criado
[ ] Slug revisado
[ ] Identidade configurada
[ ] Logo revisada
[ ] WhatsApp revisado
[ ] Categorias revisadas
[ ] Produtos revisados
[ ] Preços revisados
[ ] Imagens revisadas
[ ] Catálogo ativado
[ ] Desktop testado
[ ] Mobile testado
[ ] Aba anônima testada
[ ] Pedido completo testado
[ ] Destinatário do WhatsApp conferido
[ ] Pausa/reativação conhecida
[ ] Recuperação de senha conhecida
[ ] URL do Admin entregue
[ ] URL pública entregue
[ ] Canal de suporte informado
[ ] Nenhuma senha registrada
[ ] Nenhum secret registrado
```

---

# 21. Critério de aprovação

O cliente está pronto para entrega somente se:

- consegue entrar;
- consegue recuperar a senha;
- vê somente os próprios dados;
- catálogo público abre;
- identidade está correta;
- produtos e preços estão corretos;
- WhatsApp está correto;
- pedido de teste está correto;
- mobile está utilizável;
- nenhum segredo foi armazenado no processo.

Se qualquer item essencial falhar:

> não entregar o catálogo ainda.

Corrigir o problema e repetir o teste afetado.

---

# 22. Itens que ainda não pertencem à v0.1.9

Não improvisar nesta versão:

```text
suspensão administrativa completa
offboarding definitivo
política de retenção
backup formal
rollback formal
release checklist novo
SLA
escopo contratual final
aviso jurídico final
catálogo demo oficial
```

Esses itens pertencem aos próximos blocos da Etapa 10.
