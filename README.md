# Neoeffex Landing — v0.1.0

Primeira base do novo hero da landing page da Neoeffex.

## Objetivo desta versão

Validar **composição, hierarquia, tipografia, espaçamento e responsividade** antes de adicionar motion design.

Esta etapa é propositalmente estática.

## Arquivos

- `index.html` — estrutura do hero.
- `tokens.css` — tokens visuais centralizados.
- `landing.css` — layout e responsividade.
- `landing.js` — reservado para etapas futuras; não executa lógica nesta versão.
- `VERSION` — versão atual.
- `CHANGELOG.md` — histórico das versões.

## Como aplicar ao repositório atual

Copie estes arquivos para a raiz do repositório `neoeffex-site`.

O `index.html` e o `landing.css` atuais serão substituídos.
`tokens.css`, `VERSION` e `CHANGELOG.md` serão adicionados.
O `landing.js` passa a ficar sem lógica enquanto esta etapa estática estiver sendo validada.

Os demais arquivos e páginas do repositório podem permanecer como estão.

## Como testar

Abra `index.html` diretamente no navegador ou use a extensão Live Server no VSCode.

Teste pelo menos:

1. Desktop em tela cheia.
2. Janela estreita.
3. Celular / DevTools responsivo.
4. Zoom de 125% e 150%.
5. Verifique se nenhuma palavra importante encosta no título.

## Critério para avançar para v0.1.1

Sem animação alguma, o hero precisa parecer:
- premium;
- equilibrado;
- legível;
- reconhecível como Neo by Neoeffex;
- coerente em desktop e mobile.

Depois da aprovação visual, a v0.1.1 adicionará somente o **motion passivo da atmosfera/fumaça**.
