# Suspensão e reativação de cliente — Neoeffex

## Versão

```text
Procedimento: v0.1.9.1
Etapa: 10 — Operação e entrega ao cliente
```

## Objetivo

Definir um procedimento seguro para interromper temporariamente a publicação de um catálogo e, quando necessário, o acesso administrativo, **sem apagar os dados do cliente**.

Suspensão é reversível.

Suspensão não é cancelamento.

---

# 1. Conceitos

## Pausar catálogo

É a ação técnica principal da suspensão.

Na versão atual:

```text
catalogs.is_active = false
```

O painel já permite fazer isso pelo campo **Catálogo ativo**.

Resultado esperado:

- o catálogo deixa de ser exibido ao visitante;
- categorias permanecem;
- produtos permanecem;
- imagens permanecem;
- identidade permanece;
- configurações de WhatsApp permanecem;
- a conta administrativa não é excluída.

## Suspender cliente

É o processo operacional que inclui:

1. identificar o cliente correto;
2. registrar o motivo;
3. pausar o catálogo;
4. validar o resultado público;
5. decidir se o login administrativo também precisa ser bloqueado;
6. registrar data e responsável.

## Reativar cliente

É devolver o catálogo ao estado operacional utilizando os mesmos dados existentes.

A reativação **não deve exigir recriar o catálogo**.

---

# 2. Regra principal

Nunca use exclusão como forma de suspensão.

Durante uma suspensão temporária, não excluir:

```text
usuário
catálogo
categorias
produtos
imagens
logo
dados de identidade
```

Também não alterar o `owner_id`.

---

# 3. Antes de suspender

Abra a ficha operacional do cliente.

Confirme:

```text
[ ] Nome do comércio
[ ] Responsável
[ ] E-mail da conta
[ ] Slug
[ ] URL pública
[ ] Catálogo correto
[ ] Conta proprietária correta
```

Se a conta possui mais de um catálogo, identificar exatamente quais catálogos fazem parte da suspensão.

Não assumir que suspender um catálogo significa suspender todos os catálogos da conta.

---

# 4. Registrar a solicitação

Registrar:

```text
Data:
Hora:
Cliente:
Catálogo:
Solicitado por:
Motivo operacional:
Responsável Neoeffex:
Suspensão temporária: sim / não
Acesso administrativo deve ser bloqueado: sim / não / a confirmar
```

Não registrar dados sensíveis desnecessários.

---

# 5. Registrar o estado anterior

Antes de alterar o catálogo:

```text
Catálogo ativo: sim / não
Pedidos habilitados: sim / não
WhatsApp configurado: sim / não
Número de categorias:
Número de produtos:
URL pública:
```

O objetivo é facilitar a reativação e evitar alterações acidentais em configurações que não fazem parte da suspensão.

---

# 6. Suspender o catálogo

## Pelo Admin

1. entre na conta correta;
2. selecione o catálogo correto;
3. clique em **Editar catálogo**;
4. desmarque **Catálogo ativo**;
5. salve;
6. atualize o painel;
7. confirme que o catálogo está marcado como inativo.

Não desative produtos individualmente apenas para suspender o comércio.

A suspensão deve usar o status do catálogo.

---

# 7. Validar publicamente

Abra:

```text
/catalogo/?catalogo=SLUG
```

Faça o teste em aba anônima.

Resultado obrigatório:

```text
[ ] O catálogo ativo anteriormente não mostra mais o conteúdo público
[ ] Nenhum produto do catálogo suspenso fica navegável pela página pública
[ ] Não houve alteração em outro catálogo
```

Se outro catálogo da mesma conta permanecer ativo, testá-lo também.

---

# 8. Acesso administrativo

A versão atual do produto não possui um superadmin com botão próprio para suspender login de cliente.

Portanto, há duas situações.

## 8.1. Suspensão apenas do catálogo

Se o caso exige somente retirar o catálogo do público:

```text
manter a conta administrativa existente
```

Não redefinir a senha.

Não excluir a conta.

## 8.2. Suspensão também do acesso administrativo

Se houver decisão operacional para impedir temporariamente o login:

1. identificar o usuário correto no Supabase Authentication;
2. utilizar o mecanismo administrativo de bloqueio/desativação disponível no projeto;
3. registrar qual ação foi utilizada;
4. confirmar que não foi criada uma nova conta substituta;
5. não redefinir a senha apenas para bloquear o cliente;
6. não excluir o usuário.

O repositório atual não define um botão próprio para essa ação.

Por isso, antes do primeiro uso real desse bloqueio, confirmar o comportamento no Supabase Dashboard e fazer o teste com uma conta fictícia.

---

# 9. Checklist de suspensão

```text
[ ] Cliente correto identificado
[ ] Catálogo correto identificado
[ ] Outros catálogos da conta conferidos
[ ] Motivo registrado
[ ] Estado anterior registrado
[ ] Catálogo pausado
[ ] URL pública testada em aba anônima
[ ] Outro cliente não foi afetado
[ ] Produtos preservados
[ ] Categorias preservadas
[ ] Imagens preservadas
[ ] Identidade preservada
[ ] Usuário não foi excluído
[ ] Situação do acesso administrativo registrada
[ ] Data e responsável registrados
```

---

# 10. Registro da suspensão

Adicionar à ficha do cliente:

```text
Data da suspensão:
Catálogo(s):
Motivo:
Solicitado por:
Executado por:
Acesso administrativo bloqueado: sim / não
Resultado do teste público:
Observações:
```

---

# 11. Reativação — pré-requisitos

Antes de reativar:

```text
[ ] Solicitação de reativação confirmada
[ ] Cliente correto identificado
[ ] Catálogo correto identificado
[ ] Motivo da suspensão resolvido ou encerrado
[ ] Estado anterior consultado
[ ] Situação do acesso administrativo consultada
```

Não reativar um catálogo diferente por engano.

---

# 12. Restaurar acesso administrativo

Se o acesso administrativo não foi bloqueado:

```text
nenhuma alteração necessária
```

Se foi bloqueado:

1. localizar o mesmo usuário no Supabase Authentication;
2. reverter o bloqueio pelo mecanismo administrativo usado na suspensão;
3. preservar o mesmo e-mail;
4. não criar uma nova conta se a conta anterior ainda existe;
5. confirmar login com o cliente ou conta de teste apropriada.

---

# 13. Reativar catálogo

1. entre na conta correta;
2. selecione o catálogo;
3. abra **Editar catálogo**;
4. marque **Catálogo ativo**;
5. salve;
6. atualize o painel;
7. confirme status ativo.

Não alterar automaticamente:

```text
WhatsApp
identidade
produtos
preços
categorias
pedidos
```

A menos que exista uma solicitação separada para isso.

---

# 14. Testes após reativação

## Público

```text
[ ] URL abre
[ ] Logo aparece
[ ] Identidade aparece
[ ] Categorias aparecem
[ ] Produtos ativos aparecem
[ ] Produtos pausados continuam pausados
[ ] Busca funciona
[ ] Filtros funcionam
```

## Pedidos

Se **Receber pedidos** estava habilitado antes da suspensão:

```text
[ ] Carrinho funciona
[ ] Quantidades funcionam
[ ] Total está correto
[ ] WhatsApp correto
[ ] Mensagem correta
```

Fazer pelo menos um pedido de teste antes de considerar a reativação concluída.

---

# 15. Checklist de reativação

```text
[ ] Solicitação confirmada
[ ] Mesmo usuário preservado
[ ] Acesso administrativo restaurado, se necessário
[ ] Catálogo reativado
[ ] URL pública testada
[ ] Identidade conferida
[ ] WhatsApp conferido
[ ] Pedido de teste realizado quando aplicável
[ ] Outros catálogos não foram alterados
[ ] Data registrada
[ ] Responsável registrado
```

---

# 16. Registro da reativação

```text
Data:
Catálogo:
Solicitado por:
Executado por:
Acesso administrativo restaurado: sim / não / não aplicável
Teste público: aprovado / pendente
Pedido de teste: aprovado / não aplicável / pendente
Observações:
```

---

# 17. Quando NÃO usar este procedimento

Não usar suspensão para:

- excluir definitivamente um cliente;
- limpar dados antigos;
- transferir catálogo para outra conta;
- apagar produtos;
- resolver problema de cobrança por exclusão;
- remover permanentemente usuário.

Para encerramento, usar:

```text
docs/operations/CLIENT_OFFBOARDING.md
```

---

# 18. Critério de aprovação

A suspensão está correta quando:

- o catálogo ficou indisponível publicamente;
- nenhum dado foi apagado;
- nenhum outro cliente foi afetado;
- a decisão sobre acesso administrativo foi registrada.

A reativação está correta quando:

- o mesmo catálogo voltou;
- os mesmos dados foram preservados;
- o acesso necessário voltou;
- o catálogo público e o WhatsApp foram validados.
