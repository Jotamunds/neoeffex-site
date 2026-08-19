# Neoeffex Landing — v0.1.4

Base do hero da Neoeffex com tipografia oficial e primeira atmosfera passiva animada.

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

## Critério para avançar para v0.1.4

Sem animação alguma, o hero precisa parecer:
- premium;
- equilibrado;
- legível;
- reconhecível como Neo by Neoeffex;
- coerente em desktop e mobile.

Depois da aprovação visual, a v0.1.4 adicionará somente o **motion passivo da atmosfera/fumaça**.


## Tipografia da v0.1.4

| Papel | Fonte |
|---|---|
| Título principal | Michroma |
| Assinatura / microtítulos / palavras-chave | Josefin Sans |
| Texto corrido | IBM Plex Sans |
| Números / estados / UI técnica | IBM Plex Mono |

As fontes são carregadas pelo Google Fonts e possuem fallbacks locais. Nenhum arquivo de fonte é incluído no projeto.


## Motion da v0.1.4

A fumaça é implementada como uma camada independente em `atmosphere.css`.

Ela usa quatro massas de gradientes elípticos sobrepostas. Cada massa possui:
- trajetória própria;
- velocidade diferente;
- escala diferente;
- rotação discreta;
- variação leve de opacidade.

A animação não responde ao mouse nesta etapa.

### Teste visual obrigatório

Abra o hero e permaneça **5 segundos sem mover o mouse**.

Critério:
> deve ser claramente perceptível que a atmosfera está circulando pela tela, sem parecer frenética.

Depois teste:
1. desktop em tela cheia;
2. janela reduzida;
3. mobile;
4. scroll e responsividade;
5. `prefers-reduced-motion`.

## Próxima etapa prevista

A v0.1.4 deverá adicionar apenas a revelação das palavras-chave por proximidade do cursor, sem transformar toda a fumaça em uma simulação interativa.


## Correção de continuidade da v0.1.4

Na v0.1.2 algumas nuvens saíam parcialmente da cena e o fim do `@keyframes`
não coincidia com o começo. Quando o ciclo reiniciava, a camada voltava
instantaneamente à posição inicial.

A v0.1.4 usa trajetórias fechadas:

`0% → 25% → 50% → 75% → 100% (= 0%)`

Assim a nuvem retorna gradualmente ao ponto de origem durante a própria
animação, sem salto de posição no reinício.

A opacidade também permanece constante durante cada ciclo.


## Movimento alternado da v0.1.4

A fumaça deixou de percorrer uma órbita fechada.

Agora cada camada faz:

`A → B → A → B → A...`

Isso é obtido com:

```css
animation: smoke-drift 36s ease-in-out infinite alternate;
```

Não existe uma etapa separada de retorno nem um reset de posição.

Também são usados delays negativos diferentes, então ao abrir a página as
nuvens já aparecem em pontos distintos de seus trajetos.

### Teste específico desta correção

1. Abra a página.
2. Não mova o mouse.
3. Observe por pelo menos 60 segundos.
4. Nenhuma nuvem deve "teleportar".
5. Nos extremos do percurso ela pode desacelerar e inverter o sentido
   suavemente — isso é esperado.
