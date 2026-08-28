# Contato e fechamento — v0.1.16

## O que já aparece

- Contato e atendimento, separado dos três atalhos do cabeçalho.
- Telefone e WhatsApp por extenso, Instagram e formas de recebimento.
- Atendimento em Cotia, Vargem Grande Paulista, Itapevi e região.
- Retirada no local, com orientação para consultar o endereço antes de sair.
- Entrega por aplicativo, com taxa adicional e confirmação no atendimento.
- Chamada final, rodapé e crédito da Neoeffex.

Não há formulário, cadastro, carrinho, mapa de endereço desconhecido ou envio automático de mensagens.

O WhatsApp foi configurado com o número informado para Maria Luzimar: +55 (11) 97876-6842. Todos os botões de pedido, incluindo Fale conosco da abertura, usam a configuração central. O wa.me prepara a mensagem; o cliente ainda precisa enviá-la.

## Configuração

Edite `scripts/config.js`. Não coloque informações privadas nesse arquivo: ele será público quando o site for publicado.

| Campo | Uso |
| --- | --- |
| `contact.whatsappNumber` | Número oficial com `55`, DDD e número, entre aspas |
| `contact.whatsappMessage` | Mensagem inicial dos botões de pedido |
| `contact.instagramUrl` | Link HTTPS para o perfil oficial |
| `contact.instagramHandle` | Nome de usuário exibido na página |
| `contact.regions` | Regiões atendidas no contato e rodapé |
| `contact.pickup` | Condições de retirada |
| `contact.delivery` | Condições de entrega e eventual adicional |
| `contact.address` | Endereço confirmado; vazio mantém a linha oculta |
| `contact.openingHours` | Dias e horários confirmados; vazio mantém a linha oculta |
| `developer.name` | Nome exibido no crédito |
| `developer.url` | URL oficial HTTPS da Neoeffex; vazio mantém apenas texto |

O formato válido do telefone não comprova sua existência nem sua titularidade. Confirme o número com a responsável antes de publicar. Não use seu número pessoal como substituto.

## Comportamento do telefone

- Sem número ou com formato inválido: nenhum link de ligação fica ativo; os botões de pedido levam ao contato, e o aviso permanece visível.
- Dentro da própria seção de contato, o botão de pedido fica oculto enquanto não há destino válido. O Instagram continua acessível.
- Com número válido: o telefone aparece formatado no contato e rodapé. Tocar no número abre o recurso de ligação do dispositivo; tocar no botão abre o WhatsApp com a mensagem configurada.
- Com JavaScript, apagar o número remove também os destinos antigos. Atualize/remova também os links estáticos no bloco noscript. Não há mensagem enviada automaticamente.

Os links externos abrem em nova aba com `noopener noreferrer`. Instagram e crédito aceitam somente HTTPS sem nome de usuário ou senha embutidos na URL. Dados são inseridos como texto literal, não como HTML.

## Conteúdo sem JavaScript

Preços, fotos, regiões, retirada, entrega e links do Instagram já estão no HTML. Endereço, horários, ano atualizado e crédito clicável dependem do JavaScript. O bloco noscript do contato traz WhatsApp e telefone estáticos; os botões da página levam a essa seção sem JavaScript.

Se alterar telefone, Instagram, regiões, retirada ou entrega no `config.js`, atualize também as cópias de emergência no `index.html`:

| Dado | Pontos de atualização no HTML |
| --- | --- |
| Telefone | href wa.me, href tel: e rótulo do bloco noscript no contato |
| Regiões | Textos com `data-contact-regions`, no contato e rodapé |
| Retirada | Texto com `data-contact-pickup` |
| Entrega | Texto com `data-contact-delivery` |
| URL do Instagram | `href` dos três links com `data-instagram-link` |
| Perfil do Instagram | Textos com `data-instagram-handle` |

Para texto no HTML, escreva `&amp;` no lugar de `&` e escape outros caracteres de marcação quando necessário. Não apague os atributos `data-*`. Execute `node tests/validate.mjs`: o teste de dados de emergência avisa se as cópias divergirem da configuração. Dados locais já personalizados devem ser mesclados ao atualizar o ZIP.

## Fotos e aparência

As imagens da galeria não são publicações reais do Instagram. São ilustrações genéricas geradas por IA, com legenda visível. Consulte `assets/images/instagram/README.md` para trocar os seis arquivos WebP correspondentes às três fotos.

Os estilos estão separados em `contact.css`, `contact-card.css`, `instagram.css`, `final-cta.css` e `footer.css`. Para cores, continue usando somente `styles/base/variables.css`.

## Antes de publicar

- Confirmar telefone, endereço e dias/horários com a responsável.
- Configurar a URL oficial da Neoeffex para ativar o crédito clicável.
- Substituir o nome provisório pelo logo e as imagens ilustrativas por fotos reais autorizadas.
- Conferir os dados sem JavaScript e o destinatário dos botões, sem enviar testes a terceiros.
- Fazer a revisão visual e responsiva da Etapa 8, incluindo os aprimoramentos mobile já implementados.
- Manter o aviso de desenvolvimento e `noindex` até a revisão de publicação.

A Etapa 8 inclui `node tools/check-release.mjs` para apontar pendências detectáveis, sem alterar os contatos. O roteiro completo está em `PUBLICACAO.md`. A revisão visual não foi executada e não deve ser presumida a partir dos testes de lógica.

## Barra do celular — Etapa 7

A barra inferior usa o mesmo `contact.whatsappNumber` e a mesma mensagem dos demais botões. Sem número, mostra “Fale com a Lu” e leva ao contato. Não preencha outro telefone somente para ativá-la.

Ela é fixa apenas no mobile com JavaScript; sem JavaScript ou em telas muito baixas, fica após o rodapé no fluxo normal. Veja `MOBILE-ACESSIBILIDADE.md` para os estados e as regras de espaço reservado.
