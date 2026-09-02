# Catálogo demo e checklist de regressão — Neoeffex

## Versão

```text
v0.1.9.3
```

## Objetivo

Manter um catálogo fictício para demonstração, regressão, treinamento e simulação de onboarding.

Nunca usar cliente real como ambiente primário de teste.

---

## 1. Registro do demo

```text
Catálogo demo criado: sim / não
Conta de teste:
Slug:
URL:
WhatsApp de teste autorizado:
Data da última validação:
Versão validada:
```

Enquanto não houver número autorizado:

```text
Receber pedidos = desativado
```

Não usar número aleatório.

---

## 2. Identidade sugerida

```text
Nome:
Catálogo Demo Neoeffex

Slug:
demo-neoeffex

Descrição:
Ambiente fictício para demonstração e testes do catálogo Neoeffex.

Região/endereço:
Ambiente de demonstração

Horário:
Seg–Sex • 09h–18h

Atendimento:
Retirada e entrega
```

Usar uma logo própria de teste.

---

## 3. Categorias

```text
Destaques
Bebidas
```

---

## 4. Produtos

### Produto Demo A
```text
Categoria: Destaques
Preço: R$ 19,90
Status: Ativo
Imagem: Sim
```

### Produto Demo B
```text
Categoria: Destaques
Preço: R$ 7,50
Status: Ativo
Imagem: Não
```

### Produto Demo C
```text
Categoria: Bebidas
Preço: R$ 22,35
Status: Pausado
Imagem: Opcional
```

### Produto Demo D
```text
Categoria: Bebidas
Preço: R$ 5,99
Status: Ativo
Imagem: Sim
```

---

## 5. WhatsApp de teste

Somente com número autorizado:

```text
Receber pedidos: ativado

Instrução:
PEDIDO DE TESTE — não preparar. Ambiente de demonstração Neoeffex.
```

---

## 6. Admin

```text
[ ] login
[ ] conta correta
[ ] demo selecionado
[ ] identidade
[ ] logo
[ ] categorias
[ ] A ativo
[ ] B ativo
[ ] C pausado
[ ] D ativo
[ ] editor de imagem
[ ] edição de catálogo
```

---

## 7. Público

```text
[ ] página abre
[ ] nome
[ ] logo
[ ] descrição
[ ] região
[ ] horário
[ ] atendimento
[ ] A aparece
[ ] B aparece com fallback
[ ] C não aparece
[ ] D aparece
```

---

## 8. Busca e filtros

```text
[ ] buscar Produto Demo A encontra A
[ ] busca inexistente mostra estado vazio
[ ] Todos mostra ativos
[ ] Destaques mostra A e B
[ ] Bebidas mostra D
[ ] C não aparece
```

---

## 9. Carrinho

Adicionar:

```text
2 × Produto Demo A
1 × Produto Demo D
```

Esperado:

```text
2 × R$ 19,90 = R$ 39,80
1 × R$ 5,99 = R$ 5,99
Total = R$ 45,79
```

Confirmar:

```text
[ ] quantidade total = 3
[ ] subtotal A
[ ] subtotal D
[ ] total R$ 45,79
```

---

## 10. Persistência local

Com carrinho preenchido:

1. atualize a página;
2. abra o carrinho.

Confirmar:

```text
[ ] carrinho recuperado quando localStorage está disponível
```

Depois use **Limpar pedido**.

---

## 11. WhatsApp

Com número autorizado:

```text
[ ] destinatário correto
[ ] 2x Produto Demo A
[ ] 1x Produto Demo D
[ ] total R$ 45,79
[ ] instrução de teste
```

Não é obrigatório enviar a mensagem em toda regressão.

---

## 12. Pausar catálogo

```text
[ ] desativar Catálogo ativo
[ ] URL pública deixa de mostrar conteúdo
[ ] reativar
[ ] dados voltam sem recriação
```

---

## 13. Desativar pedidos

```text
[ ] desativar Receber pedidos
[ ] botões de adicionar desaparecem
[ ] carrinho deixa de ser oferecido
[ ] produtos continuam visíveis
```

Depois restaurar a configuração do demo.

---

## 14. Mobile

```text
[ ] hero
[ ] logo
[ ] busca
[ ] filtros
[ ] cards
[ ] adicionar
[ ] carrinho
[ ] quantidades
[ ] WhatsApp
```

---

## 15. Aba anônima

```text
[ ] catálogo ativo abre sem login
[ ] produto pausado não aparece
[ ] carrinho funciona
[ ] painel administrativo não fica disponível como visitante
```

---

## 16. Compatibilidade com catálogo antigo

Além do demo:

```text
[ ] catálogo sem campos opcionais não quebra
[ ] catálogo sem logo não quebra
[ ] produto sem imagem não quebra
```

---

## 17. Simulação final da Etapa 10

```text
[ ] conta fictícia
[ ] login
[ ] recuperação de senha
[ ] criar catálogo
[ ] slug
[ ] identidade
[ ] logo
[ ] categorias
[ ] produtos
[ ] editor de imagens
[ ] pausa/reativação de produto
[ ] público
[ ] busca
[ ] filtros
[ ] carrinho
[ ] total
[ ] WhatsApp
[ ] mobile
[ ] anônimo
[ ] pausa/reativação de catálogo
[ ] simulação de suspensão
[ ] simulação de offboarding sem exclusão
[ ] backup entendido
[ ] rollback identificado
[ ] release checklist executado
[ ] QUICK_START usado como se fosse cliente
```

---

## 18. Registro

```text
Versão:
Commit:
Data:
Responsável:
Catálogo:
Admin: aprovado / pendente
Desktop: aprovado / pendente
Mobile: aprovado / pendente
Anônimo: aprovado / pendente
Carrinho: aprovado / pendente
WhatsApp: aprovado / pendente
Etapa 10: aprovada / pendente
Observações:
```

---

## 19. Critério para piloto

```text
[ ] demo criado/designado
[ ] demo validado
[ ] onboarding validado
[ ] suspensão/reativação validadas
[ ] offboarding simulado
[ ] backup compreendido
[ ] rollback identificado
[ ] release checklist executável
[ ] guia testado
[ ] suporte e pendências reconhecidos
[ ] escopo claro
[ ] aviso de privacidade revisado
[ ] nenhum secret publicado
```
