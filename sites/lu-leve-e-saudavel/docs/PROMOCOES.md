# Promoção opcional

O componente fica depois da abertura e antes das tradicionais. Usa fundo amarelo suave e texto verde, no fluxo da página. Não é um pop-up, não fixa elementos na tela e não altera os preços do cardápio.

## Estado entregue

Não existe uma oferta ativa nesta entrega. Em `scripts/config.js`:

```js
promotion: {
    enabled: false,
    title: "",
    description: ""
}
```

O HTML começa com `hidden`. A faixa não ocupa espaço quando está desativada e também não aparece se o JavaScript estiver desabilitado. Nenhuma oferta ou telefone fictício foi incluído.

## Ativar uma oferta real

1. Confirme com a empresa o preço, os produtos participantes, a quantidade, a validade e quaisquer condições.
2. Preencha `title` com um título curto e `description` com essas informações em texto simples. Não utilize HTML.
3. Altere `enabled` para o booleano `true`, sem aspas.
4. Salve e recarregue o site. Confira a faixa e seu botão, incluindo no celular.
5. Ao publicar a alteração, envie o `scripts/config.js` atualizado junto do projeto e confirme o resultado.

Não rode `tools/build-menu.mjs` para atualizar a promoção. O gerador cuida apenas dos preços permanentes em `data/menu.json`.

## Comportamentos previstos

| Situação | Resultado |
| --- | --- |
| `enabled: false` | Faixa oculta e textos limpos |
| `enabled: true`, título e descrição preenchidos | Faixa visível |
| Título ou descrição vazios, só com espaços ou de tipo inválido | Faixa oculta |
| `enabled` escrito como `"true"` ou `"false"` | Faixa oculta; strings não ativam o componente |
| Sem JavaScript | Promoção oculta; cardápio permanente continua visível |
| WhatsApp configurado | Botão “Consultar promoção” abre a mensagem geral no número configurado |
| WhatsApp ausente ou inválido | Botão “Consultar condições” leva à seção de contato |

**A validade não é interpretada pelo código.** Não há expiração automática, contagem regressiva nem agendamento. Ao encerrar a oferta, volte `enabled` para `false`, salve e publique a mudança. A descrição deve deixar claras as condições para o consumidor.

## Desativar ou remover

A forma mais simples e recomendada é manter `enabled: false`. Isso remove a faixa da exibição sem precisar editar estrutura, estilos ou preços.

Se decidir retirar o componente do código, remova o bloco `<aside>` identificado por `id="promocao"` no `index.html`. O script tolera a ausência desse bloco. Se também remover `scripts/promotion.js`, retire sua referência no HTML; a inicialização em `main.js` já verifica se o módulo existe. Remover o CSS exige retirar o respectivo import de `styles/main.css`.

Os testes estáticos verificam a presença do componente solicitado nesta etapa. Uma remoção definitiva exige ajustar esses contratos, a ordem esperada dos scripts e a contagem de botões. Para apenas esconder uma oferta, não remova arquivos.

## Arquivos e isolamento

- Conteúdo e ativação: `scripts/config.js`, objeto `promotion`.
- Validação e exibição: `scripts/promotion.js`.
- Estrutura: bloco `data-promotion` do `index.html`.
- Aparência: `styles/components/promotion.css`.
- Cores: variáveis já existentes em `styles/base/variables.css`.

O módulo só procura elementos dentro de `data-promotion`. Insere título e descrição com `textContent`, sem interpretar código. Ativar, desativar ou editar a faixa não muda o JSON dos preços, o gerador nem os cards. O botão reutiliza a configuração geral do WhatsApp, sem criar um segundo número ou mensagem divergente.
