# Neoeffex Catalog — Perfis de catálogo, recursos modulares e modos de compra

## Objetivo

Evoluir o catálogo da Neoeffex para suportar diferentes perfis de negócio sem criar códigos exclusivos por cliente e sem duplicar o sistema inteiro.

A arquitetura deve separar claramente:

```text
PERFIL DO CATÁLOGO
    ↓
define recursos disponíveis/padrões

RECURSOS
    ↓
sabores, pedido mínimo, adicionais, etc.

PRODUTO
    ↓
define como aquele item específico é comprado
```

Exemplo:

```text
Catálogo: Lu Leve e Saudável
Perfil: marmitas

Recursos:
✓ sabores
✓ pedido mínimo
✓ adicionais
✓ combos

Produtos:
- Tradicional 400 g → flavor_bundle
- Fitness M → flavor_bundle
- Lasanha → simple
- Torta → simple
```

---

# 1. Princípios obrigatórios

## 1.1. Não criar lógica específica por cliente

Nunca usar:

```js
if (catalog.slug === "lu-leve-e-saudavel") {
    ...
}
```

ou qualquer exceção por:

- slug;
- nome da loja;
- owner_id;
- ID fixo;
- cliente específico.

---

## 1.2. Não duplicar o catálogo inteiro

Evitar:

```text
catalogo-marmitas.js
catalogo-servicos.js
catalogo-restaurante.js
```

com cópias independentes de:

- carrinho;
- Supabase;
- produtos;
- imagens;
- filtros;
- pedidos.

Deve existir um único core compartilhado.

---

## 1.3. Perfil não deve controlar tudo sozinho

O perfil habilita recursos.

O produto define o fluxo de compra.

Exemplo:

```text
catalog.profile = marmitas
```

não significa que todos os produtos escolhem sabores.

Dentro do mesmo catálogo podem existir:

```text
Lasanha → simple
Torta → simple
Tradicional → flavor_bundle
Fitness → flavor_bundle
```

---

# 2. Arquitetura alvo

```text
NEOEFFEX CATALOG
│
├── Core
│   ├── catálogo
│   ├── produtos
│   ├── categorias
│   ├── carrinho
│   ├── pedidos
│   ├── imagens
│   └── Supabase
│
├── Perfil do catálogo
│   ├── standard
│   ├── food
│   ├── marmitas
│   └── services
│
├── Recursos
│   ├── flavors
│   ├── minimum_order
│   ├── options
│   ├── addons
│   └── future modules
│
└── Produtos
    ├── simple
    ├── flavor_bundle
    └── configurable (futuro)
```

---

# 3. Perfis iniciais

Criar inicialmente somente os perfis necessários.

## standard

Catálogo genérico.

```text
sabores = false
pedido mínimo = false
adicionais = false
opções = false
```

---

## food

Base para alimentação.

Pode habilitar:

```text
observações = true
sabores = opcional
pedido mínimo = opcional
```

---

## marmitas

Preset voltado para marmitas e refeições montadas.

```text
sabores = true
pedido mínimo = true
adicionais = true
opções = true
```

---

## services

Perfil para serviços.

Nesta fase não precisa implementar agendamento.

Pode existir apenas como perfil simples.

---

# 4. Modos de compra do produto

Adicionar conceito:

```text
purchase_mode
```

Valores iniciais:

```text
simple
flavor_bundle
```

Reservar:

```text
configurable
```

para uma etapa futura.

---

## simple

Fluxo atual:

```text
produto
→ quantidade
→ carrinho
```

Exemplos:

```text
Lasanha
Torta
Bebida
Produto comum
```

---

## flavor_bundle

Fluxo:

```text
produto
→ quantidade
→ escolher sabores
→ validar distribuição
→ carrinho
```

Exemplos:

```text
Tradicional 300 g
Tradicional 400 g
Tradicional 500 g
Fitness M
Fitness G
```

---

# 5. Pedido mínimo

Adicionar ao catálogo:

```text
minimum_order_quantity
```

Exemplo:

```text
Lu Leve e Saudável
minimum_order_quantity = 5
```

Importante:

O sistema deve permitir adicionar menos de 5 unidades ao carrinho.

O bloqueio ocorre somente ao finalizar.

Exemplo:

```text
3 marmitas no carrinho

Pedido mínimo: 5
Adicione mais 2 para continuar.
```

---

# 6. Sabores

Criar uma nova entidade:

```text
flavors
```

Estrutura conceitual:

```text
id
catalog_id
name
description
image_path
is_active
sort_order
created_at
updated_at
```

Exemplos:

```text
Carne de panela + purê
Frango com legumes
Pernil suíno + legumes
Fígado acebolado
Carne moída + purê
Frango + verduras + abóbora
```

As fotos devem pertencer ao sabor, não ao combo/tamanho.

---

# 7. Relação produto × sabor

Criar:

```text
product_flavors
```

Estrutura conceitual:

```text
product_id
flavor_id
sort_order
additional_price
is_available
```

Isso permite:

```text
Tradicional 400 g
├ Carne moída
├ Frango
├ Pernil
└ Carne de panela + R$ 5
```

e:

```text
Fitness M
├ Frango com legumes
├ Pernil com legumes
└ Tilápia + R$ 6
```

---

# 8. Regra da quantidade de sabores

Para `flavor_bundle`:

```text
quantidade do item
=
soma das quantidades dos sabores
```

Exemplo:

```text
Combo 10

Carne de panela      3
Frango               2
Pernil               3
Carne moída          2
----------------------
Total                10
```

O botão de confirmação só pode ser habilitado quando:

```text
selecionado === quantidade
```

---

# 9. Acréscimos

Cada relação `product_flavors` pode possuir:

```text
additional_price
```

Exemplo:

```text
Carne de panela
+ R$ 5
```

Se o cliente escolher 3:

```text
3 × 5 = R$ 15
```

Total:

```text
Combo 10        R$ 190
Acréscimos      R$ 15
----------------------
Total           R$ 205
```

---

# 10. Admin — perfil do catálogo

Criar configuração do catálogo para:

```text
Perfil do catálogo
[ standard / food / marmitas / services ]

Pedido mínimo
[ 5 ]

Recursos habilitados
✓ Sabores
✓ Pedido mínimo
✓ Adicionais
```

O perfil deve funcionar como preset.

Não deve impedir ajustes específicos posteriormente.

---

# 11. Admin — sabores

Adicionar em:

```text
Configurações
```

nova seção:

```text
Sabores
```

Resultado:

```text
Configurações
├── Categorias
├── Subcategorias
├── Tipos
├── Grupos
└── Sabores
```

Cada sabor deve permitir:

- criar;
- editar;
- pausar/ativar;
- ordenar;
- imagem;
- descrição;
- excluir quando não estiver em uso.

---

# 12. Admin — configuração do produto

No formulário de produto adicionar:

```text
Comportamento de compra
```

Opções:

```text
Produto simples
Escolha de sabores
```

Se for `simple`:

```text
nenhuma configuração extra
```

Se for `flavor_bundle`:

mostrar:

```text
Sabores disponíveis
```

com seleção dos sabores cadastrados.

Permitir configurar:

```text
preço adicional
```

por sabor.

---

# 13. Catálogo público

## simple

Continua funcionando como atualmente.

```text
Adicionar ao carrinho
```

---

## flavor_bundle

Ao adicionar:

```text
produto
→ abre tela/modal de seleção de sabores
```

Exemplo:

```text
Escolha os sabores das suas 10 marmitas

Carne de panela     [-] 3 [+]
Frango              [-] 2 [+]
Pernil              [-] 3 [+]
Carne moída         [-] 2 [+]

10 de 10 escolhidas

[ Confirmar sabores ]
```

---

# 14. Carrinho

Cada item de carrinho precisa suportar dados adicionais.

Exemplo conceitual:

```json
{
    "product_id": "...",
    "name": "Tradicional 400 g",
    "quantity": 10,
    "unit_price": 19,
    "flavors": [
        {
            "flavor_id": "...",
            "name": "Carne de panela",
            "quantity": 3,
            "additional_price": 5
        }
    ]
}
```

Não alterar o formato atual sem compatibilidade.

Itens `simple` devem continuar funcionando.

---

# 15. Mensagem do WhatsApp

Para item simples:

```text
1x Lasanha
R$ 35,00
```

Para `flavor_bundle`:

```text
10x Tradicional 400 g

Sabores:
3x Carne de panela
2x Frango
3x Pernil
2x Carne moída

Acréscimos: R$ 15
Subtotal: R$ 205
```

---

# 16. Compatibilidade

Mudanças novas não podem quebrar:

- catálogos existentes;
- produtos atuais;
- carrinho atual;
- pedidos;
- WhatsApp;
- imagens;
- filtros;
- categorias;
- tipos;
- grupos;
- múltiplas lojas;
- RLS.

Todos os catálogos existentes devem assumir automaticamente:

```text
profile = standard
purchase_mode = simple
```

quando não configurados.

---

# 17. RLS

Todas as novas tabelas precisam seguir o padrão atual.

Validar:

- Conta A não acessa sabores da Conta B;
- anon somente lê o necessário para catálogo público;
- authenticated gerencia apenas os seus;
- `catalog_id` deve ser a base do isolamento.

Não duplicar `owner_id` sem necessidade.

---

# 18. Não confundir conceitos

Manter separados:

```text
GRUPOS
= classificação de produto
```

```text
SABORES
= opções de composição de um produto
```

```text
ADICIONAIS
= valor adicional em uma escolha
```

```text
GRUPOS DE OPÇÕES
= recurso futuro para montagem avançada
```

---

# 19. Etapas de implementação

# ETAPA 0 — Auditoria

Antes de qualquer mudança:

1. confirmar branch main;
2. git status;
3. último commit;
4. revisar migrations;
5. revisar Admin;
6. revisar catálogo público;
7. revisar carrinho;
8. revisar WhatsApp;
9. revisar testes;
10. listar arquivos afetados.

Não editar ainda.

---

# ETAPA 1 — Banco: perfil e modo de compra

Adicionar migration para:

```text
catalogs.catalog_profile
catalogs.minimum_order_quantity
products.purchase_mode
```

Valores default:

```text
catalog_profile = standard
purchase_mode = simple
```

Pedido mínimo pode ser:

```text
null
```

ou:

```text
0
```

conforme padrão escolhido.

Adicionar constraints.

Não criar sabores ainda.

Executar testes de compatibilidade.

---

# ETAPA 2 — Banco: sabores

Criar:

```text
flavors
product_flavors
```

Adicionar:

- FKs;
- índices;
- RLS;
- policies;
- constraints;
- updated_at;
- verificação.

Não alterar o catálogo público ainda.

---

# ETAPA 3 — Admin: perfil do catálogo

Adicionar no Admin:

```text
Perfil do catálogo
Pedido mínimo
Recursos
```

O perfil deve funcionar como preset.

Não criar código específico por slug.

Não quebrar edição atual da loja.

---

# ETAPA 4 — Admin: CRUD de sabores

Adicionar:

```text
Configurações > Sabores
```

CRUD completo:

- criar;
- editar;
- status;
- ordenar;
- imagem;
- excluir.

Testar múltiplas lojas.

---

# ETAPA 5 — Admin: produto × sabor

Adicionar ao produto:

```text
purchase_mode
```

Se `flavor_bundle`:

mostrar sabores cadastrados.

Permitir:

- selecionar;
- ordenar;
- preço adicional;
- disponibilidade.

Se `simple`:

ocultar tudo.

---

# ETAPA 6 — Catálogo público: seleção de sabores

Implementar fluxo:

```text
Adicionar
→ selecionar sabores
→ validar quantidade
→ confirmar
```

Preservar `simple`.

Não mexer no carrinho ainda além do necessário para preparar os dados.

---

# ETAPA 7 — Carrinho

Atualizar estrutura do carrinho para suportar:

```text
flavors
additional_price
```

Manter retrocompatibilidade com itens simples.

Calcular subtotal corretamente.

---

# ETAPA 8 — Pedido mínimo

Implementar regra:

```text
total de unidades qualificadas >= minimum_order_quantity
```

Bloquear finalização, não adição ao carrinho.

Mostrar progresso:

```text
3 de 5
```

---

# ETAPA 9 — WhatsApp

Atualizar mensagem do pedido.

Listar:

- produto;
- quantidade;
- sabores;
- quantidades;
- acréscimos;
- subtotal;
- total.

Preservar mensagens de produtos simples.

---

# ETAPA 10 — Aplicação na Lu Leve e Saudável

Somente depois de toda a arquitetura estar estável:

Configurar:

```text
catalog_profile = marmitas
minimum_order_quantity = 5
```

Criar sabores reais.

Relacionar aos produtos.

Adicionar fotos.

Definir acréscimos.

Não criar nenhuma exceção por slug.

---

# ETAPA 11 — Testes e estabilização

Testar:

## Standard

Produto simples.

## Marmitas

Produto com sabores.

## Misto

Mesmo catálogo com:

```text
Lasanha → simple
Tradicional → flavor_bundle
```

## Carrinho

Itens mistos.

## Múltiplas lojas

Sem vazamento de dados.

## Pedido mínimo

Bloqueio correto.

## Acréscimos

Cálculo correto.

## WhatsApp

Mensagem completa.

---

# 20. Salvaguardas obrigatórias

Durante todo o desenvolvimento:

- não usar slug como condição;
- não usar IDs fixos;
- não criar exceção para Lu;
- não duplicar catálogo;
- não copiar carrinho;
- não criar arquivos paralelos completos;
- não quebrar produtos simple;
- não alterar preço base silenciosamente;
- não remover product_type;
- não remover product_groups;
- não remover categorias;
- não remover loadSequence;
- não alterar RLS antigo sem necessidade;
- não fazer reset --hard;
- não usar force push.

---

# 21. Testes obrigatórios

Criar testes para:

```text
catalog_profile_default_standard
catalog_profile_marmitas
product_purchase_mode_default_simple
product_purchase_mode_flavor_bundle
flavors_crud
flavors_rls
product_flavors_relation
product_flavors_isolation
flavor_bundle_quantity_exact
flavor_bundle_quantity_under
flavor_bundle_quantity_over
flavor_additional_price
cart_simple_compatibility
cart_flavor_bundle
minimum_order_block
minimum_order_allow
whatsapp_simple
whatsapp_flavor_bundle
mixed_catalog_products
multiple_store_isolation
```

---

# 22. Critérios de aceite

A implementação estará correta quando:

1. catálogo antigo funciona sem alteração manual;
2. produto simple funciona como antes;
3. produto flavor_bundle abre seleção de sabores;
4. quantidade de sabores precisa bater com quantidade comprada;
5. acréscimos são calculados corretamente;
6. pedido mínimo bloqueia apenas finalização;
7. carrinho aceita itens simples e itens com sabores;
8. WhatsApp descreve o pedido;
9. sabores possuem imagem;
10. mesmo catálogo pode ter produtos simple e flavor_bundle;
11. nenhuma regra depende do slug Lu;
12. múltiplas lojas continuam isoladas.

---

# 23. Ordem recomendada de commits

```text
catalogo - adiciona perfis e modos de compra
```

```text
catalogo - adiciona estrutura de sabores
```

```text
admin - adiciona perfil de catálogo
```

```text
admin - adiciona gerenciamento de sabores
```

```text
admin - integra sabores aos produtos
```

```text
catalogo - adiciona seleção de sabores
```

```text
catalogo - integra sabores ao carrinho
```

```text
catalogo - adiciona pedido mínimo
```

```text
catalogo - detalha sabores no pedido via whatsapp
```

```text
catalogo - estabiliza perfis e sabores
```

---

# 24. Prompt inicial para o Antigravity

```text
Trabalhe no repositório Jotamunds/neoeffex-site na branch main.

Leia integralmente:
PLANO_PERFIS_CATALOGO_SABORES_NEOEFFEX.md

NÃO implemente todas as etapas.

Execute SOMENTE a ETAPA 0.

Objetivo:
auditar o estado atual do projeto antes de introduzir perfis de catálogo,
modos de compra e sabores.

Antes de qualquer modificação:

1. confirme branch;
2. confira git status;
3. confira último commit;
4. leia migrations;
5. leia Admin;
6. leia catálogo público;
7. leia carrinho;
8. leia fluxo de WhatsApp;
9. leia testes;
10. identifique todos os arquivos que seriam afetados.

Procure especialmente por:

catalogs
products
cart
addToCart
checkout
WhatsApp
image_path
loadSequence
product_type
product_groups

NÃO crie migration.
NÃO altere arquivo.
NÃO faça commit.

Ao final, entregue:

- arquitetura atual relevante;
- arquivos envolvidos;
- riscos encontrados;
- conflitos com o plano;
- sugestões antes da Etapa 1.

Pare e aguarde autorização.
```

---

# 25. Regra de evolução futura

Novos perfis podem ser adicionados no futuro:

```text
restaurant
bakery
services
appointments
retail
```

Mas novos perfis devem preferencialmente combinar módulos existentes.

A regra é:

```text
novo perfil
≈ novo preset
```

e não:

```text
novo perfil
= novo sistema inteiro
```

O core deve permanecer compartilhado.
