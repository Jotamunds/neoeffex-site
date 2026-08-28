# Relatório de revisão — v0.1.7

Situação: preparação técnica entregue, com revisão visual e liberação de publicação pendentes. Nada foi publicado, nenhum repositório remoto foi alterado e nenhum contato externo recebeu mensagens.

## Resultados

| Área | Resultado | Limite |
| --- | --- | --- |
| Verificador local | 82 grupos aprovados, zero falhas | Arquivos, regras estáticas e lógica simulada |
| Cardápio | HTML sincronizado com `data/menu.json` | Preços conferem com os dados fornecidos; validade comercial depende da responsável |
| Contato e promoção | Estados vazios, válidos e inválidos testados | Não comprova existência/titularidade dos canais |
| Mobile e movimento | Contratos CSS e lógica aprovados | Não equivale a layout renderizado ou teste em aparelho |
| Cores e fontes | 16 combinações de contraste e arquivos locais verificados | Não é auditoria completa de acessibilidade |
| Referências | Caminhos locais e resolução em raiz/subpasta conferidos | Não é teste HTTP da hospedagem final |
| Checklist de publicação | Cinco pendências automáticas esperadas | Não remove avisos, não altera dados e não publica |
| Navegador | Não executado | Prévia disponível incompatível com o projeto estático sem etapa de servidor |
| Aparelhos reais | Não executado | Inclui áreas seguras, zoom, teclado e impressão |
| Publicação | Não realizada | Domínio, hospedagem e aprovação pendentes |

## Alterações nesta versão

- Descrição da página atualizada com foco em preços, combos e regiões confirmadas.
- Aviso de pré-publicação atualizado; `noindex, nofollow` mantido deliberadamente.
- CSS sem uso dos antigos espaços reservados removido, sem mudança nos componentes ativos.
- Checklist de liberação e testes específicos separados do código executado no navegador.
- Testes de textos alternativos e legendas preparados para receber fotos reais.
- Documentação de publicação e manutenção concluída.

O cabeçalho, hero, cinco cards, 15 combos, acréscimos, Como funciona, contato, galeria, rodapé, barra e animações foram preservados. O `config.js` mudou apenas a versão; os valores comerciais e canais não foram preenchidos por suposição.

## Pendências automáticas da entrega

1. WhatsApp oficial ainda vazio.
2. URL oficial da Neoeffex ainda vazia.
3. Fotografias e legendas provisórias.
4. Meta de restrição de indexação mantida até aprovação.
5. Faixa de pré-publicação mantida até aprovação.

Endereço, horários, logo, origem das fotos, confirmação comercial, revisão visual e destino da hospedagem também exigem decisão humana. Ausência desses dados não é corrigida com conteúdo fictício.

## Como concluir

Siga `PUBLICACAO.md` e o roteiro detalhado em `TESTES.md`. Mantenha a estrutura estática aprovada. A impossibilidade de executar a prévia não motivou adição de framework, dependências, servidor, configuração de hospedagem ou publicação não solicitada.

Este relatório descreve a versão entregue. Depois de modificar contatos, preços, fotos ou layout, execute as verificações novamente e registre os resultados da revisão manual. Nenhuma certificação de acessibilidade ou medição de desempenho em navegador é alegada.
