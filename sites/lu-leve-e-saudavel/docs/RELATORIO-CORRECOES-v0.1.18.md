# Relatório de correções — v0.1.18

## Problemas encontrados

1. Os arquivos `price-countup.js` e `price-countup.css` estavam soltos na raiz e não eram carregados pelo site.
2. A configuração ativa, a faixa de revisão e a documentação principal ainda indicavam v0.1.16.
3. O pacote da v0.1.18 declarava depender da v0.1.17, mas o garfinho dessa versão não estava presente.
4. Não existia arquivo `VERSION`, embora os scripts temporários tentassem criá-lo.
5. O README descrevia apenas como aplicar um patch, não como manter e testar o projeto completo.
6. Os instaladores de aplicação e rollback continuavam dentro da pasta depois da tentativa de mesclagem.
7. As seis logos tinham nomes numéricos genéricos, ficavam em uma pasta redundante e não eram usadas pela página.
8. Os testes do patch verificavam textos dos instaladores, mas não comprovavam que CSS e JavaScript estavam conectados ao site.

## Correções aplicadas

- Módulos movidos para `scripts/` e `styles/components/` e conectados ao controlador central.
- Garfinho da v0.1.17 implementado e preservado pelo gerador do cardápio.
- Contagem da v0.1.18 restrita a valores em reais, um alvo por elemento, com cancelamento e restauração exata.
- Versão sincronizada em `VERSION`, configuração, HTML, README, histórico e documentação.
- Instaladores temporários removidos após a integração.
- Logos renomeados por composição; arte-fonte preservada e WebP leve aplicado ao cabeçalho.
- README refeito como documentação do projeto completo.
- Suítes novas para o garfinho e a contagem, além da atualização das regressões existentes.

## Resultado técnico

- `node tools/build-menu.mjs --check`: aprovado.
- `node tools/build-decorations.mjs --check`: aprovado.
- `node tests/validate.mjs`: 216 grupos aprovados, 0 falhas.
- Sintaxe de todos os arquivos JavaScript e MJS: aprovada.

## Pendências que exigem confirmação humana

- Aprovar a variação de logo escolhida com a responsável.
- Substituir as fotografias ilustrativas por fotos reais autorizadas.
- Confirmar preços, regiões, endereço/horários e destinatário do WhatsApp.
- Informar a URL oficial da Neoeffex, se o crédito deve ser clicável.
- Fazer a revisão visual final em navegadores e aparelhos reais antes de retirar `noindex` e a faixa de pré-publicação.
