# Boafont — instruções específicas

Leia também `../GEMINI.md`.

## Regra principal

A implementação em `modelos/boafont/` deriva do Open Design. Preserve a composição visual, tipografia, cores, conteúdo e identidade atual. Não simplifique o site para um template genérico.

## Motion

Não remover as animações existentes. Melhorias de movimento são permitidas quando:

- são leves e coerentes com água/abastecimento;
- não alteram a leitura ou clicabilidade;
- evitam dependências pesadas sem necessidade;
- respeitam `prefers-reduced-motion`;
- não causam layout shift;
- mantêm bom desempenho em mobile.

## Assets

Todos os assets exclusivos devem ficar dentro de `assets/`. Não criar dependência de arquivos na raiz do repositório.

## Rota

A página deve funcionar abrindo `modelos/boafont/index.html` por Live Server e em `https://neoeffex.com.br/modelos/boafont/`.

## Integrações

Catálogo e contato devem continuar configuráveis em `BOAFONT_CONFIG`. Não criar carrinho ou catálogo paralelo dentro desta landing.
