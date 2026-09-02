# Aviso operacional de privacidade — Catálogo Neoeffex

## Versão de referência

```text
v0.1.9.3
```

> Documento operacional inicial.
>
> Não substitui revisão jurídica ou política de privacidade definitiva.

---

## Conta administrativa

O painel utiliza o e-mail da conta para autenticação via Supabase Auth.

A senha é tratada pelo mecanismo de autenticação e não deve ser registrada nos documentos operacionais da Neoeffex.

---

## Dados públicos do comércio

O sistema pode armazenar e publicar:

- nome;
- slug;
- logo;
- descrição;
- região/endereço;
- horário;
- forma de atendimento;
- WhatsApp;
- instrução do pedido.

Esses dados devem ser revisados pelo responsável antes da ativação.

---

## Produtos

O sistema armazena:

- categoria;
- nome;
- descrição;
- preço;
- status;
- imagem;
- ordenação.

Produtos ativos podem aparecer publicamente.

Produtos pausados permanecem cadastrados, mas não devem aparecer no catálogo.

---

## Imagens

Logos e imagens de produtos são armazenadas no Supabase Storage.

Buckets usados pelo projeto:

```text
catalog-products
catalog-identities
```

Não enviar imagem que não deva ser publicada.

---

## Visitante do catálogo

No fluxo público atual:

- não é necessário login;
- o catálogo não mantém sessão administrativa;
- o visitante pode buscar, filtrar e montar um carrinho;
- o carrinho usa `localStorage` do navegador, por catálogo, quando disponível.

Se o armazenamento local estiver bloqueado, o carrinho pode continuar funcionando somente durante a visita atual.

---

## Pedido

O sistema atual não possui painel/tabela própria de pedidos.

Ao clicar em enviar:

1. o catálogo monta a mensagem no navegador;
2. inclui produtos, quantidades, valores e total;
3. cria um link para o WhatsApp configurado;
4. abre o WhatsApp.

O pedido **não é salvo como pedido no banco do catálogo antes desse encaminhamento**.

O envio real ocorre quando o usuário conclui a ação no WhatsApp.

---

## Dados do consumidor não persistidos pelo fluxo atual do pedido

O catálogo atual não possui formulário próprio para persistir:

```text
nome do consumidor
CPF
documento
endereço residencial
cartão
dados bancários
senha do WhatsApp
```

Se informações forem trocadas posteriormente dentro do WhatsApp, isso acontece fora do fluxo de persistência do catálogo atual.

---

## Analytics

Analytics não faz parte do escopo atual do catálogo.

Se analytics, pixel ou rastreamento forem adicionados, este documento precisa ser revisto.

---

## Infraestrutura

O sistema utiliza Supabase para componentes como:

- Auth;
- banco;
- Storage.

Credenciais privadas não devem aparecer em documentos públicos.

---

## Isolamento administrativo

O sistema foi estruturado para que contas administrativas acessem apenas os próprios catálogos e dados relacionados.

Suspeita de acesso entre clientes deve ser tratada como incidente de segurança.

---

## Retenção

```text
Prazo padrão:
PENDENTE DE DEFINIÇÃO COMERCIAL/JURÍDICA

Prazo de exclusão após cancelamento:
PENDENTE DE DEFINIÇÃO COMERCIAL/JURÍDICA
```

Até definição, o offboarding exige pausa, inventário, retenção e autorização antes de exclusão definitiva.

---

## Solicitações relacionadas a dados

```text
Canal oficial:
PENDENTE DE DEFINIÇÃO COMERCIAL/JURÍDICA
```

Antes de transformar este documento em política pública definitiva, definir responsável, canal, prazos e critérios.

---

## Revisar este aviso quando surgir

- pedido persistido;
- cadastro de consumidor;
- pagamento;
- endereço de entrega armazenado;
- analytics;
- cookies de rastreamento;
- CRM;
- integrações externas.
