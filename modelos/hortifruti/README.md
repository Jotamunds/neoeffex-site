# Verde Viva — modelo Neoeffex · v0.1.0

Landing page estática de **hortifruti**, adaptada do ZIP `hortifruti(1).zip`.
O conteúdo do arquivo foi preservado. A pasta se chama `clinica-odontologica`
somente para atender à rota solicitada: `/modelos/clinica-odontologica/`.
**Este pacote não contém o visual ou o conteúdo de uma clínica odontológica.**

## Instalação

Copie a pasta `modelos/clinica-odontologica/` para a raiz do repositório Neoeffex.
Não substitua outras pastas. O pacote não modifica `/admin/` nem `/catalogo/`.
Não precisa de instalação de pacotes, build, React, Vite ou `node_modules`.

## Configuração

Edite `assets/js/config.js`:

- `catalog.slug`: identificação exata de um catálogo existente e ativo no `/admin`.
  O exemplo vem com `verde-viva`; **o pacote não cria esse catálogo e sua existência
  não foi confirmada**. Troque pelo identificador correto antes de publicar.
- `content`: marca e principais textos institucionais.
- `images`: caminhos locais das fotos, guardadas em `assets/img/`.
- `socials`: URLs HTTPS do Instagram e Facebook; vazias ficam ocultas.
- `theme.colors`: cores padrão.
- `theme.enabled`: use `false` para ocultar o botão Cores e ignorar preferências locais.

Textos complementares, diferenciais, inspirações, FAQ e avaliações estão no
`index.html`. Os estilos estão em `assets/css/style.css`. Não inclua credenciais.

## Catálogo único

Todos os botões com `data-catalog-link` abrem, na mesma aba, a rota oficial:

```text
/catalogo/?catalogo=IDENTIFICADOR
```

O contrato foi conferido em `catalogo/README.md`, `catalogo/config.js`,
`catalogo/assets/js/catalogo.js` e `catalogo/assets/js/catalog-identity.js`
da branch `main` de `Jotamunds/neoeffex-site` em 03/09/2026.

As categorias, produtos ativos, preços, pesquisa, filtros, carrinho, totais,
pedido pelo WhatsApp, limpeza e restauração do último carrinho continuam sob
responsabilidade do módulo central. As seis caixas da landing são inspirações
institucionais e não representam categorias ou disponibilidade em tempo real.

Nome, logo, descrição, endereço e horários cadastrados são exibidos pela página
pública oficial. O módulo de identidade atual depende do DOM e do cliente do
próprio catálogo; não fornece uma interface independente para esta landing.
Por isso, este modelo apresenta sua marca demonstrativa e direciona informações
operacionais para o catálogo, sem copiar o módulo ou abrir outra conexão ao banco.
Não existe telefone, e-mail, preço, estoque ou carrinho paralelo neste modelo.

Slug vazio, com maiúsculas, espaços ou caracteres inválidos mostra uma mensagem
na landing. Slug válido, mas inexistente ou pausado, é tratado pelo catálogo central.
O slug não é lido da URL desta landing; visitantes não podem escolher outro catálogo.

## Cores

O botão **Cores**, no canto inferior direito, oferece três paletas, quatro
seletores, restauração e cópia dos códigos. Os textos e botões ajustam o contraste
automaticamente. As escolhas ficam no navegador e separadas pelo caminho do modelo.

Para definir o tema de todos os visitantes, clique em **Copiar cores**, substitua
o objeto `theme.colors` em `config.js` pelos códigos copiados e publique o arquivo.
Use `theme.enabled: false` para entregar a versão final sem o painel de demonstração.
As cores do catálogo central são administradas separadamente por ele.

## Teste local

Abra **a raiz do repositório Neoeffex** com o Live Server do VS Code e navegue para
`/modelos/clinica-odontologica/`. Mantenha `catalog.developmentOrigin` vazio:
os botões usarão `/catalogo/` no mesmo servidor local.

Se você abrir somente esta pasta com o Live Server, configure
`catalog.developmentOrigin: "https://neoeffex.com.br"` para usar o catálogo publicado.
Ao abrir `index.html` diretamente por `file://`, o destino também será o domínio
de produção. Um servidor local é preferível para testar o site completo.

Use a barra final na URL da pasta ou abra `index.html`; servidores estáticos
normalmente redirecionam a pasta automaticamente.

## Verificação e dependências

Consulte `VALIDACAO.md` para os resultados e os testes que ainda dependem de um
catálogo ativo e do navegador. Nenhuma operação de administração, pedido real,
commit, push ou publicação foi realizada.

Runtime: HTML, CSS e JavaScript nativos. Google Fonts é usado apenas para as fontes
DM Sans, DM Mono e Playfair Display, com alternativas locais se a rede falhar.
As imagens originais foram otimizadas para WebP e incluídas no pacote; não precisam
do Unsplash para carregar. Fontes das fotos:

- Hero: https://images.unsplash.com/photo-1488459716781-31db52582fe9
- Banca: https://images.unsplash.com/photo-1542838132-92c53300491e
- Salada: https://images.unsplash.com/photo-1540420773420-3366772f4999
- Vegetais: https://images.unsplash.com/photo-1512621776951-a57141f2eefd

Marca, conteúdo e avaliações são demonstrativos. Antes de usar comercialmente,
substitua-os pelos dados institucionais do cliente e fotos adequadas.

Commit sugerido: `v0.1.0 – Adapta modelo ao catálogo Neoeffex e adiciona painel de cores`.
