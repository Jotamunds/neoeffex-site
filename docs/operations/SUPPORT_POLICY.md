# Política operacional de suporte — Neoeffex

## Versão de referência

```text
v0.1.9.3
```

Este documento diferencia suporte técnico, dúvida de uso, alteração de conteúdo e nova funcionalidade.

## Dados comerciais ainda não definidos

```text
Canal oficial:
PENDENTE DE DEFINIÇÃO COMERCIAL

Horário:
PENDENTE DE DEFINIÇÃO COMERCIAL

Prazo inicial de resposta:
PENDENTE DE DEFINIÇÃO COMERCIAL

Atendimento em finais de semana/feriados:
PENDENTE DE DEFINIÇÃO COMERCIAL
```

Enquanto estiverem pendentes, não prometer SLA específico.

---

## Incidente

É quando algo que já existe deixa de funcionar como esperado.

Exemplos:

- login indisponível;
- recuperação de senha quebrada;
- catálogo ativo indisponível;
- produtos corretos não aparecem;
- carrinho deixa de funcionar;
- WhatsApp deixa de abrir;
- regressão após atualização.

Primeiro reproduzir e identificar o escopo.

---

## Incidente de segurança

Exemplos:

- cliente visualiza dados administrativos de outro cliente;
- usuário altera dados que não pertencem à sua conta;
- segredo aparece publicamente;
- suspeita de acesso indevido;
- Storage permite escrita indevida.

Procedimento:

1. interromper alterações desnecessárias;
2. registrar o ocorrido;
3. preservar evidências;
4. avaliar suspensão;
5. usar backup/rollback quando necessário;
6. não apagar dados para tentar esconder o problema.

---

## Dúvida de uso

Exemplos:

- cadastrar produto;
- trocar logo;
- pausar item;
- configurar WhatsApp.

Primeiro encaminhar:

```text
docs/client/QUICK_START.md
```

---

## Alteração de conteúdo

Exemplos:

- cadastrar muitos produtos;
- trocar fotos;
- revisar preços;
- reorganizar categorias.

Tratamento comercial:

```text
PENDENTE DE DEFINIÇÃO COMERCIAL
```

Não classificar automaticamente como defeito do sistema.

---

## Nova funcionalidade

Exemplos:

- pagamento online;
- estoque;
- cupom;
- frete;
- painel de pedidos;
- integração;
- relatório;
- domínio próprio;
- novo tema.

Registrar como evolução separada.

Não prometer implementação durante um chamado de suporte.

---

## Informações mínimas para suporte

```text
Nome do comércio
E-mail da conta
Slug
Descrição
O que era esperado
O que aconteceu
Dispositivo/navegador, quando relevante
Print, quando ajudar
Horário aproximado
```

Nunca pedir:

```text
senha
token
service_role
```

---

## Prioridade interna

### Crítica
- possível vazamento entre clientes;
- vários catálogos fora;
- autenticação global quebrada.

### Alta
- um cliente sem acesso;
- catálogo ativo indisponível;
- WhatsApp quebrado para um cliente.

### Normal
- dúvida;
- ajuste visual;
- alteração não impeditiva.

Essa classificação não representa SLA contratual.

---

## Registro de incidente relevante

```text
Data:
Cliente:
Versão:
Categoria:
Prioridade:
Descrição:
Causa:
Correção:
Rollback:
Validação:
Responsável:
```
