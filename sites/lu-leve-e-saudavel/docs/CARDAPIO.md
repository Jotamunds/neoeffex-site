# Editar o cardápio

## Um lugar para os dados

Preços, nomes dos tamanhos, quantidades e acréscimos estão em `data/menu.json`. O arquivo usa JSON válido: aspas duplas, sem comentários e sem vírgula depois do último item.

| Campo | Significado | Exemplo |
| --- | --- | --- |
| `unitPriceCents` | Preço de uma marmita em centavos | `1600` = R$ 16,00 |
| `combos[].quantity` | Quantidade de marmitas no combo | `10` |
| `combos[].totalCents` | Total do combo em centavos | `15000` = R$ 150,00 |
| `surcharges[].priceCents` | Acréscimo por marmita em centavos | `600` = R$ 6,00 |
| `featuredQuantity` | Quantidade destacada nos cards | `10` |
| `featuredLabel` | Etiqueta de destaque | `Mais pedido` |

Os valores foram transcritos do briefing fornecido, não de uma consulta a redes sociais. Os preços reais devem ser reconfirmados antes da publicação.

## Atualizar

Salve suas alterações ou faça commit antes de editar. Altere o JSON e execute na pasta que contém o `index.html`:

```bash
node tools/build-menu.mjs
node tests/validate.mjs
git diff
```

O gerador valida os dados antes de escrever e atualiza somente as duas regiões delimitadas pelos comentários `MENU` no `index.html`. Não modifica o cabeçalho, a abertura, os contatos nem as outras seções. Uma segunda execução, sem mudanças, não altera os arquivos.

Para apenas conferir a sincronização, sem escrever:

```bash
node tools/build-menu.mjs --check
```

Faça commit de `data/menu.json` e do `index.html` atualizado juntos. Não remova os marcadores. Erros de formato, IDs repetidos, quantidades fora de ordem, totais inválidos ou falta do combo destacado interrompem a geração.

## Alterar a aparência

- Estilos dos cards: `styles/components/price-card.css`.
- Distribuição dos cards e aviso de acréscimos: `styles/sections/products.css`.
- Cores e tamanhos de fonte: `styles/base/variables.css`.
- Estrutura HTML repetida: `tools/menu-template.mjs`; depois rode o gerador.

Os cards usam a mesma estrutura para tradicionais e fitness. Não há uma cópia de cálculos para cada categoria. O JSON fica disponível para reaproveitamento numa futura montagem de pedidos, mas não existe carrinho ou seleção nesta entrega.

## Totais e arredondamento

O total informado é a fonte de verdade. O preço por marmita é `totalCents / quantity`, arredondado para o centavo mais próximo apenas para exibição. Quando a divisão não resulta em centavos exatos, aparece “aprox.”.

Exemplo: R$ 370,00 ÷ 15 = aproximadamente R$ 24,67 por marmita. O total continua R$ 370,00; não é recalculado multiplicando o valor arredondado, o que produziria R$ 370,05.

Não são exibidos percentuais de economia nem a promessa “melhor custo-benefício”. “Mais pedido” foi usado para os combos de 10 conforme a informação fornecida pelo responsável no briefing. A promoção temporária da Etapa 5 é independente dos valores permanentes e fica em `config.promotion`, não neste JSON.

## Acréscimos e informações pendentes

Carne especial: R$ 6,00 por marmita. Salmão: R$ 9,00 por marmita. O mesmo aviso é gerado junto às duas categorias e informa que os totais não incluem acréscimos nem entrega. Não há cálculo automático de adicionais nesta versão; combinações de proteínas e condições são confirmadas no atendimento.

O peso total das fitness é 400 g (M) ou 500 g (G). A expressão “130 g de proteína” não foi publicada porque ainda precisa ser esclarecida como peso do alimento ou informação nutricional. Não foram inventados macros, calorias ou promessas de emagrecimento.

## Sem JavaScript

O HTML entregue já contém preços, quantidades e avisos. Abrir o site não executa o gerador e não exige Node.js, servidor ou acesso à internet. JavaScript preenche os contatos, ativa o WhatsApp configurado e controla a faixa promocional. Sem ele, a promoção fica oculta e os botões visíveis levam à seção de contato, com o link de Instagram disponível no aviso `noscript`.
