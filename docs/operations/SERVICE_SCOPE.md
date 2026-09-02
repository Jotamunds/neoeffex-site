# Escopo do MVP de catálogo — Neoeffex

## Versão de referência

```text
v0.1.9.3
```

Este documento descreve o produto tecnicamente disponível.

Condições comerciais e preço são definidos separadamente.

---

## Incluído no MVP

### Admin
- login por e-mail e senha;
- recuperação de senha;
- múltiplos catálogos por conta;
- criação/edição de catálogo;
- ativação e pausa;
- categorias;
- produtos;
- preço;
- descrição;
- status;
- imagens;
- editor simples de imagens;
- exclusão protegida de produto;
- configuração do WhatsApp.

### Identidade
- logo;
- descrição curta;
- região/endereço;
- horário;
- retirada;
- entrega;
- ambos.

### Catálogo público
- acesso sem login;
- identidade;
- categorias;
- produtos;
- preços;
- imagens;
- busca;
- filtros;
- compartilhamento.

### Pedido pelo WhatsApp
- carrinho;
- quantidade;
- remoção;
- total estimado;
- mensagem estruturada;
- instrução do comércio;
- abertura do WhatsApp.

---

## Como o pedido funciona

```text
cliente seleciona produtos
        ↓
carrinho no navegador
        ↓
total calculado
        ↓
mensagem montada
        ↓
WhatsApp aberto
        ↓
usuário conclui o envio
```

O sistema atual **não possui painel interno de pedidos**.

O pedido não é persistido como pedido no banco do catálogo antes do encaminhamento ao WhatsApp.

---

## Não incluído atualmente

```text
Pagamento online
Estoque
Baixa automática
Painel de pedidos
Persistência de pedidos
Status de pedido
Confirmação automática
Frete/taxa automática
Cupons
Fidelidade
Relatórios
Analytics
Aplicativo
ERP
Integração com delivery
Domínio individual por cliente
Multiusuário por comércio
Níveis de permissão
Tema completamente personalizado
Construtor visual
Importação em massa
```

---

## O que o WhatsApp não faz automaticamente

A abertura de `wa.me` não significa:

- pedido confirmado;
- pagamento aprovado;
- estoque reservado;
- entrega calculada;
- atendimento iniciado pelo comércio.

O comércio deve confirmar os detalhes.

---

## Responsabilidade sobre conteúdo

Antes da publicação, o cliente deve revisar:

- preços;
- descrições;
- disponibilidade;
- imagens;
- horário;
- endereço/região;
- WhatsApp;
- regras comerciais.

---

## Cadastro contínuo de conteúdo

Se a Neoeffex fará cadastro recorrente em nome do cliente:

```text
PENDENTE DE DEFINIÇÃO COMERCIAL
```

Não assumir cadastro ilimitado.

---

## Suporte

Usar:

```text
docs/operations/SUPPORT_POLICY.md
```

---

## Funcionalidade personalizada

Solicitações fora do núcleo devem ser avaliadas separadamente antes de entrar no sistema global.
