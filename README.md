# Neoeffex Landing — v0.1.6

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

## Critério para avançar para v0.1.6

Sem animação alguma, o hero precisa parecer:
- premium;
- equilibrado;
- legível;
- reconhecível como Neo by Neoeffex;
- coerente em desktop e mobile.

Depois da aprovação visual, a v0.1.6 adicionará somente o **motion passivo da atmosfera/fumaça**.


## Tipografia da v0.1.6

| Papel | Fonte |
|---|---|
| Título principal | Michroma |
| Assinatura / microtítulos / palavras-chave | Josefin Sans |
| Texto corrido | IBM Plex Sans |
| Números / estados / UI técnica | IBM Plex Mono |

As fontes são carregadas pelo Google Fonts e possuem fallbacks locais. Nenhum arquivo de fonte é incluído no projeto.


## Motion da v0.1.6

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

A v0.1.6 deverá adicionar apenas a revelação das palavras-chave por proximidade do cursor, sem transformar toda a fumaça em uma simulação interativa.


## Correção de continuidade da v0.1.6

Na v0.1.2 algumas nuvens saíam parcialmente da cena e o fim do `@keyframes`
não coincidia com o começo. Quando o ciclo reiniciava, a camada voltava
instantaneamente à posição inicial.

A v0.1.6 usa trajetórias fechadas:

`0% → 25% → 50% → 75% → 100% (= 0%)`

Assim a nuvem retorna gradualmente ao ponto de origem durante a própria
animação, sem salto de posição no reinício.

A opacidade também permanece constante durante cada ciclo.


## Movimento alternado da v0.1.6

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


## Reveal por proximidade da v0.1.6

As palavras-chave agora começam completamente invisíveis.

O JavaScript mede apenas a distância do ponteiro ao centro de cada uma das
seis palavras.

Comportamento:

- longe: `opacity: 0`;
- aproximando: opacidade cresce progressivamente;
- muito perto: opacidade máxima de `0.60`;
- afastando: volta gradualmente para `0`.

A fumaça não participa desse cálculo e continua exatamente como na v0.1.4.

### Performance

O evento de ponteiro apenas atualiza as coordenadas.
Os cálculos visuais são agrupados com `requestAnimationFrame`, evitando
executar várias atualizações no mesmo frame.

### Teste desta versão

1. Abra a página e não mova o cursor.
2. As palavras devem permanecer invisíveis.
3. Passe o cursor lentamente perto de cada região onde existe uma palavra.
4. A palavra mais próxima deve aparecer gradualmente.
5. Muito perto, a palavra deve chegar a aproximadamente 60% de opacidade.
6. Afaste o cursor e confirme que ela desaparece novamente.
7. Confirme que a fumaça continua se movimentando exatamente como na v0.1.4.
8. No celular, toque ou arraste o dedo sobre o hero para testar a mesma lógica.


## Cache busting — v0.1.6

Os recursos locais do hero agora são chamados com a versão da landing:

```html
<link rel="stylesheet" href="tokens.css?v=0.1.6">
<link rel="stylesheet" href="landing.css?v=0.1.6">
<link rel="stylesheet" href="atmosphere.css?v=0.1.6">
<script src="landing.js?v=0.1.6" defer></script>
```

Ao criar uma nova versão que altere esses arquivos, atualize a query string para
o mesmo número registrado em `VERSION`.

Isso evita misturar HTML novo com CSS ou JavaScript antigos armazenados em cache.

### Importante

Não renomeie os arquivos a cada versão. O nome continua estável e apenas o
parâmetro `?v=` muda. Isso mantém o repositório simples e evita acumular cópias
como `landing-0.1.5.css`, `landing-0.1.6.css`, etc.

### Teste da correção

1. Abra o site.
2. No DevTools > Network, confirme requests para:
   - `tokens.css?v=0.1.6`
   - `landing.css?v=0.1.6`
   - `atmosphere.css?v=0.1.6`
   - `landing.js?v=0.1.6`
3. Sem mover o mouse, as palavras devem ficar invisíveis.
4. A fumaça deve continuar se movendo.
5. Ao aproximar o ponteiro das regiões das palavras, elas devem aparecer gradualmente.
