# Preparação para publicação — v0.1.19

Este pacote é de pré-publicação. Não configura hospedagem, não envia alterações ao GitHub e não publica automaticamente. O código funciona sem instalação ou build; ferramentas Node.js são opcionais para manutenção e verificações.

## 1. Confirmar o conteúdo

Em `scripts/config.js`:

- O WhatsApp está configurado com `5511978766842`, informado no projeto. Se mudar, atualize também o bloco noscript do contato no HTML. Confira o destinatário com a responsável; formato válido não comprova titularidade.
- Informe a URL HTTPS oficial da Neoeffex para ativar o crédito clicável.
- Confirme Instagram, regiões, retirada e entrega; mantenha suas cópias estáticas no HTML sincronizadas.
- Preencha endereço e horários confirmados ou aprove conscientemente sua omissão. Não invente informações para passar no checklist.
- Deixe a promoção desativada se não existir uma oferta real. Quando ativa, confira condições, validade e desativação manual.
- Confirme `catalog.productionUrl` e o slug `lu-leve-e-saudavel`; o destino oficial deve continuar em `https://neoeffex.com.br/catalogo/`.

Revise todos os preços com a responsável. Os combos de 10 são “Mais pedido”, não necessariamente os mais baratos por unidade. O Fitness G de 15 custa R$ 370,00 no briefing e tem valor aproximado por unidade. Não acrescente a afirmação “130 g de proteína” sem esclarecer seu significado.

Se alterar regiões, confira também a descrição no `<head>`. A versão não inclui domínio canônico, mapa, horário, telefone ou informação comercial presumidos.

## 2. Substituir as imagens

- Troque as imagens da abertura e galeria por fotografias reais autorizadas, nas resoluções indicadas nos respectivos READMEs de assets.
- Atualize cada texto alternativo para descrever a nova fotografia, sem tratar as imagens geradas como reais.
- Atualize as legendas somente depois de substituir efetivamente os arquivos. Não basta apagar a palavra “ilustrativa”.
- Confirme com a responsável se a variação de logo aplicada ao cabeçalho é a versão oficial escolhida.
- Preserve dimensões, `srcset`, `sizes` e proporções; teste o recorte no celular.

Os testes aceitam legendas e descrições reais, sem exigir a palavra “ilustrativa”. Eles verificam arquivos e marcação, mas não conseguem confirmar a origem da fotografia. As imagens entregues nesta versão ainda são genéricas.

## 3. Executar as verificações técnicas

No terminal, na pasta do projeto:

```bash
node tools/build-menu.mjs --check
node tools/build-decorations.mjs --check
node tests/validate.mjs
node tools/check-release.mjs
```

Se alterou `data/menu.json`, execute antes `node tools/build-menu.mjs` sem `--check` e confira as diferenças. Não edite os preços gerados diretamente no HTML.

| Comando | Interpretação |
| --- | --- |
| `build-menu.mjs --check` | Detecta divergência entre JSON e preços publicados no HTML; não escreve |
| `build-decorations.mjs --check` | Detecta SVGs dessincronizados com os blocos DECORATION, sem escrever |
| `tests/validate.mjs` | Valida a base por código; erros retornam código 1 |
| `check-release.mjs` | Aponta pendências de liberação; não executa os outros testes |

No checklist, `OK` significa apenas que aquela regra foi atendida; `PENDENTE` exige revisão; `MANUAL` não pode ser confirmado pelo comando. Enquanto houver pendências automáticas, ele retorna código 1. Retorno 0 não autoriza a publicação nem comprova revisão visual, dados corretos ou fotos reais.

## 4. Concluir a revisão no navegador

Esta revisão não foi executada nesta entrega. Abra a página pelo navegador ou pelo Live Server do VS Code e use o roteiro completo de `TESTES.md`.

| Conferência | Resultado esperado |
| --- | --- |
| 320, 375 e 430px | Texto antes da foto; cards empilhados; nenhum preço cortado ou rolagem lateral |
| 767, 768, 1024 e 1440px | Transições de layout e da barra sem sobreposição |
| Barra e fim da página | Rodapé e crédito totalmente alcançáveis acima da barra fixa |
| Janela baixa e paisagem | Barra no fluxo, preservando área de leitura |
| Zoom de 200% e texto ampliado | Conteúdo e contatos legíveis, com quebras naturais |
| Tab, Shift+Tab e Enter | Foco visível, atalhos corretos e acesso ao conteúdo |
| Movimento reduzido | Sem animações de entrada nem rolagem suave |
| Abertura em grupos | Sem transbordamento, clique imediato e cancelamento ao interagir; estática em carga tardia ou âncora direta |
| Garfinho | Viaja uma vez até o card tradicional de 400 g; não desloca o card e fica estático com movimento reduzido |
| Contagem dos preços | Parte de R$ 0,00 e recupera exatamente o valor original; não altera telefone, quantidades ou textos |
| Sem JavaScript | Preços, fotos, Instagram e recebimento presentes; sem conversa fictícia |
| Número configurado | Telefone legível e botões apontando para o mesmo WhatsApp oficial |
| Catálogo | Em local abre `/catalogo/?catalogo=lu-leve-e-saudavel`; na URL pública abre o catálogo oficial da Neoeffex |
| Promoção | Ausente quando desativada; correta e independente dos preços quando ativa |
| Fundos orgânicos | Comparação com a classe ligada/desligada; curvas sem pontas, frestas ou recortes retos no meio; sem recortes de foco ou sobreposição de conteúdo |
| Ícones decorativos | Seis ícones discretos, broto sem solo, haltere só a partir de 60rem; sem rolagem lateral nem prejuízo à leitura |
| Impressão e cores forçadas | Sem as novas formas nem espaço vazio de SVG; informações e navegação preservadas |
| Rede e console | Arquivos locais carregados, sem erros de JavaScript ou recursos ausentes |

Confira também em aparelho real, especialmente a área segura inferior. Não envie mensagens ou faça chamadas para números fictícios dos testes. A inspeção do destino do link é suficiente para a verificação técnica; qualquer mensagem real depende de autorização.

O teste de fundos não precisa ficar ativo para publicar. Se a versão-base for a aprovada, remova `organic-backgrounds` e `decorative-elements` do `body` e confira novamente. Para remover apenas os novos ícones, retire somente `decorative-elements`. Se aprovar o efeito, mantenha suas regras no arquivo separado; não é necessário distribuí-las pelos demais componentes. Veja `FUNDOS-ORGANICOS.md`.

## 5. Liberar a versão aprovada

Somente depois dos passos anteriores:

1. Remova do `index.html` o bloco `<aside class="project-status" ...>` e seu comentário de pré-publicação.
2. Remova a meta `<meta name="robots" content="noindex, nofollow">` e seu comentário quando o site estiver aprovado para indexação.
3. Mantenha legendas honestas, textos alternativos, contatos e todas as referências locais.
4. Rode os quatro comandos novamente e confira `git diff` antes do commit.

Não existe uma configuração de JavaScript para liberar indexação. Não remova os avisos enquanto dados ou revisão estiverem pendentes. `noindex` não impede acesso público nem funciona como senha; mantenha a versão local ou use a proteção própria da hospedagem durante aprovação.

## 6. Preparar os arquivos da hospedagem

A parte pública precisa de:

- `index.html`.
- `styles/`.
- `scripts/`.
- Imagens e fontes usadas em `assets/`, preservando as licenças.

Mantenha os mesmos caminhos relativos e a caixa exata dos nomes. Não precisa hospedar `tests/`, `tools/`, `data/`, `docs/`, arquivos do VS Code, ZIPs, repositório `.git` ou arquivos privados. Os preços já estão no HTML; o JSON e o gerador ficam no repositório para manutenção.

A publicação prevista para esta versão é `/sites/lu-leve-e-saudavel/`. Se publicar em uma subpasta, coloque esses itens juntos dentro dela. Não troque caminhos relativos por `/assets/...`, pois isso aponta para a raiz do domínio. Não adicione uma tag `<base>` sem revisar todos os atalhos.

O destino final e o método de publicação precisam ser escolhidos por você. Este ZIP não altera a configuração do seu GitHub nem de outro site existente. Um commit, sozinho, só publica se já houver um fluxo de hospedagem configurado no repositório.

## 7. Conferir após publicar

Abra a URL final com HTTPS, confirme os arquivos carregados, teste os três atalhos de navegação, os CTAs do catálogo e todos os canais de contato. Verifique novamente imagens, preços, mobile e metadados na URL real. Não marque como concluído com base apenas no resultado local.

Se surgir um erro, use o histórico do seu repositório para recuperar a última versão aprovada. Não substitua sua pasta `.git` por outra e não use push forçado como rotina de atualização.
