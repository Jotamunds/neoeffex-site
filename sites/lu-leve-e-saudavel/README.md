# Lu Leve e Saudável — v0.1.19

Landing page mobile-first e cardápio digital de marmitas tradicionais e fitness. O projeto é estático, não depende de bibliotecas externas e pode funcionar em uma subpasta, como `neoeffex.com/lu-leve-e-saudavel`.

## Estado desta versão

- Integração com o catálogo Neoeffex em `/catalogo/?catalogo=lu-leve-e-saudavel`.
- CTAs principais do cabeçalho, hero, Como funciona, fechamento e barra mobile levam ao catálogo.
- Em localhost/IP privado, `scripts/catalog.js` usa o catálogo local; fora do ambiente local, usa `https://neoeffex.com.br/catalogo/?catalogo=lu-leve-e-saudavel`.
- O WhatsApp direto continua disponível nas áreas de contato e nos atalhos já existentes do conteúdo.
- Base completa das versões v0.1.0 a v0.1.16 preservada.
- Garfinho da v0.1.17 integrado ao card tradicional de 400 g.
- Contagem dos preços da v0.1.18 integrada ao controlador central de movimento.
- Seis logos originais organizados em `assets/images/brand/` e versão leve aplicada ao cabeçalho.
- WhatsApp configurado para `+55 (11) 97876-6842`.
- Projeto ainda em pré-publicação: as fotos continuam ilustrativas e o `noindex` deve permanecer até a aprovação final.

## Abrir localmente

O `index.html` funciona diretamente, mas um servidor local reproduz melhor a publicação:

```powershell
py -m http.server 8080
```

Depois, abra `http://localhost:8080/sites/lu-leve-e-saudavel/` a partir da pasta que contém `sites/`.

## Arquivos principais

- `index.html`: conteúdo estático, marcação semântica e referências locais.
- `styles/main.css`: ponto único de entrada dos estilos.
- `scripts/config.js`: versão, catálogo, contatos, promoção, créditos e controles de movimento.
- `scripts/catalog.js`: resolve a URL local/produção e sincroniza os links `[data-catalog-link]`.
- `data/menu.json`: fonte editável de preços, combos e acréscimos.
- `tools/build-menu.mjs`: regenera apenas as regiões do cardápio no HTML.
- `tests/validate.mjs`: valida integração, acessibilidade, dados, assets e regressões.
- `docs/PUBLICACAO.md`: checklist antes de retirar a pré-publicação.

## Atualizar o cardápio

1. Edite os valores em centavos inteiros em `data/menu.json`.
2. Gere o HTML:

```bash
node tools/build-menu.mjs
```

3. Rode a validação completa:

```bash
node tests/validate.mjs
node tools/check-release.mjs
```

## Testes

Para executar cada suíte isoladamente:

```bash
for test_file in tests/*.mjs; do node "$test_file"; done
```

`tests/validate.mjs` é a suíte agregada. O checklist de publicação pode continuar indicando pendências manuais mesmo com todos os testes técnicos aprovados.

## Controles de animação

Em `scripts/config.js`, `motion.enabled` desliga todos os efeitos. Os controles `intro`, `cards`, `contact`, `fork`, `prices`, `reveal` e `smoothScroll` podem ser alterados separadamente. Movimento reduzido, cores forçadas, impressão e aba oculta mantêm o conteúdo estático e legível.

## Publicação

Antes de publicar, confirme preços, fotos, endereço/horários, regiões, Instagram e destinatário do WhatsApp com a responsável. A landing não envia mensagens automaticamente nem contém pagamento. O carrinho e a montagem do pedido ficam no catálogo compartilhado; a confirmação final continua no WhatsApp.
