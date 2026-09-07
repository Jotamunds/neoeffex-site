# ETAPA 5 — Refinamento de layout, ritmo do N e interações
## Neoeffex `/modelos`
### Versão sugerida: v0.4.4

---

# Objetivo

Refinar a versão atual da rota `/modelos` sem reconstruir o que já está funcionando.

Esta etapa deve melhorar principalmente:

- largura e estrutura visual do header;
- centralização do hero;
- escala do N;
- ritmo da formação e dispersão do N;
- comportamento do N quando completamente formado;
- reação suave ao mouse;
- área de scroll dedicada à animação;
- bloqueio de seleção/arraste em elementos visuais;
- acabamento do footer.

A direção visual atual deve ser preservada.

Não alterar as landings individuais, `/admin`, `/catalogo`, autenticação, Supabase ou sistema de pedidos.

---

# 1. Header ocupando a largura inteira

Atualmente o header aparenta terminar junto com o container central.

O header deve ocupar visualmente toda a largura da viewport.

Estrutura desejada:

```text
|──────────────────── viewport inteira ─────────────────────|

        neoeffex       navegação       solicitar projeto

|────────────────────────────────────────────────────────────|
```

O fundo, linha inferior, partículas ou qualquer tratamento visual do header devem se estender de uma ponta à outra.

O conteúdo interno continua centralizado em um `max-width`.

Sugestão estrutural:

```html
<header class="site-header">
    <div class="site-header__inner">
        ...
    </div>
</header>
```

Conceito:

```css
.site-header {
    width: 100%;
}

.site-header__inner {
    width: min(100% - 32px, 1280px);
    margin-inline: auto;
}
```

Não espalhar os links pela viewport inteira.

O objetivo é apenas separar:

```text
largura visual do header
≠
largura do conteúdo do header
```

---

# 2. Centralizar o hero

O conteúdo principal do hero deve ficar centralizado horizontalmente.

Headline:

```text
SEU SITE
PODE IR ALÉM
```

Apoio:

```text
Design, tecnologia e movimento para transformar
presença em experiência.
```

Os CTAs também devem ficar centralizados.

Representação:

```text
                     SEU SITE
                   PODE IR ALÉM

          Design, tecnologia e movimento
          para transformar presença em experiência.

             [ Explorar projetos ]
             [ Falar com especialista ]
```

Os dois botões podem continuar lado a lado no desktop.

No mobile, podem empilhar se necessário.

Não criar container, card ou box atrás do hero.

As partículas continuam livres no fundo.

---

# 3. Diminuir levemente o N

O N está visualmente grande demais.

Reduzir apenas um pouco.

Referência inicial:

```text
escala atual = 100%
nova escala ≈ 88% a 92%
```

Começar testando aproximadamente:

```text
92%
```

Se ainda estiver grande:

```text
90%
```

Evitar reduzir demais.

O N continua sendo protagonista.

O principal objetivo é criar mais espaço vazio ao redor da forma e impedir sensação de aperto.

O N nunca deve:

- encostar nas bordas;
- ser cortado;
- ficar preso em retângulo;
- usar `cover` para preencher o espaço.

Preferir comportamento equivalente a:

```text
contain
```

---

# 4. Aumentar a área de scroll da experiência do N

A animação atual do N acontece rápido demais.

Não resolver apenas aumentando `duration`.

Como a animação depende do scroll, aumentar a distância física de scroll dedicada à transformação.

Faixa inicial para teste:

```text
180vh a 220vh
```

O valor exato deve ser ajustado visualmente.

O canvas ou área principal pode permanecer sticky/pinned enquanto o usuário atravessa essa seção.

Objetivo:

```text
hero
↓
partículas dispersas
↓
formação do N
↓
aproximação lenta
↓
N formado
↓
N vivo
↓
saída lenta
↓
dispersão
↓
continuação da página
```

Não deixar o N montar e desmontar imediatamente.

Dar tempo para o usuário observar a forma completa.

---

# 5. Curva de velocidade da formação do N

A formação e dispersão NÃO devem usar velocidade uniforme.

O comportamento deve ser dividido em cinco fases.

## Fase A — Formando o N

Velocidade visual aproximada:

```text
8/10
```

As partículas convergem de forma perceptível e relativamente rápida.

Aqui o objetivo é comunicar claramente:

```text
as partículas estão formando algo
```

Faixa inicial de scroll:

```text
0% → 30%
```

## Fase B — Quase chegando ao N

Velocidade visual aproximada:

```text
4/10
```

Quando a silhueta já estiver reconhecível, a aproximação deve desacelerar.

As partículas fazem os últimos ajustes de maneira mais precisa.

Isso deve evitar a sensação de que as partículas “batem” imediatamente na posição final.

Faixa inicial:

```text
30% → 45%
```

Conceito:

```text
rápido
    ↓
    ↓
   desacelera
       ↓
       ↓
      N
```

## Fase C — N completamente formado

O N deve permanecer montado por uma área perceptível da rolagem.

Faixa inicial:

```text
45% → 65%
```

A geometria principal fica estável, mas o N NÃO deve ficar congelado.

Adicionar vida interna:

- micro rotação;
- micro oscilação;
- pequenas variações em Z;
- partículas se movendo discretamente dentro da forma;
- highlight lento;
- leves variações de brilho;
- movimento orgânico controlado.

A silhueta precisa continuar claramente reconhecível.

---

# 6. Reação do N ao mouse quando formado

Quando o N estiver completo ou quase completo, ele deve reagir suavemente ao cursor.

As partículas próximas ao mouse podem se afastar levemente.

Representação:

```text
          cursor →
                    ○

              ·   ↙
            · N ·
              ↘
```

O efeito deve ser local.

Faixa sugerida de deslocamento:

```text
5px a 15px
```

Não permitir:

- explosão;
- deformação global;
- repelência forte;
- partículas fugindo permanentemente;
- N perdendo reconhecimento.

Após o cursor sair, as partículas devem voltar suavemente às suas posições-base.

Usar interpolação/força de retorno.

O mouse também pode causar micro inclinação global no N.

Limite sugerido:

```text
2° a 3°
```

Evitar rotação exagerada.

---

# 7. Fase D — Quase saindo do N

Velocidade visual aproximada:

```text
4/10
```

Faixa inicial:

```text
65% → 80%
```

O N começa a perder precisão lentamente.

As partículas externas podem ser as primeiras a escapar.

A forma ainda deve continuar reconhecível durante boa parte desta fase.

Objetivo:

```text
N não desaparece
N começa a se dissolver
```

---

# 8. Fase E — Desformando o N

Velocidade visual aproximada:

```text
8/10
```

Faixa inicial:

```text
80% → 100%
```

Depois que já estiver claro que o N está se desfazendo, a dispersão pode acelerar.

Essas partículas alimentam o campo ambiental que continua pela página.

Não fazer fade-out simples.

As partículas devem realmente mudar de posição.

---

# 9. Curva geral de scroll

Referência inicial:

```text
0%                                                100%

|──── formando ────|
0              30

                 |── aproximação lenta ──|
                30                     45

                                      |──── N vivo ────|
                                     45               65

                                                       |── saída lenta ──|
                                                      65               80

                                                                         |── dispersão ──|
                                                                        80             100
```

Velocidades conceituais:

```text
0–30%    = 8/10
30–45%   = 4/10
45–65%   = N formado + movimento interno
65–80%   = 4/10
80–100%  = 8/10
```

Esses números são referência visual, não precisam representar valores literais no código.

---

# 10. Implementação recomendada da curva

Evitar aplicar apenas um `ease` único na animação inteira.

Preferir mapear o progresso do scroll por zonas.

Exemplo conceitual:

```js
const p = scrollProgress;

if (p < 0.30) {
    // formação mais rápida
} else if (p < 0.45) {
    // aproximação mais lenta
} else if (p < 0.65) {
    // N formado
} else if (p < 0.80) {
    // saída lenta
} else {
    // dispersão mais rápida
}
```

Melhor ainda: criar uma função contínua para transformar o progresso antes de enviar ao shader.

Pode existir algo como:

```text
uFormationProgress
uDisperseProgress
uMouse
uTime
uScroll
```

Evitar milhares de tweens individuais.

Continuar usando:

```text
THREE.Points
BufferGeometry
ShaderMaterial
GSAP
ScrollTrigger
Lenis
```

---

# 11. Scroll reversível

Tudo deve funcionar ao contrário ao subir.

Fluxo reverso:

```text
campo disperso
↑
dispersão desacelera
↑
N começa a reaparecer
↑
N formado
↑
partículas começam a soltar
↑
volta ao estado disperso do hero
```

Não reiniciar a animação.

Não gerar novas posições random a cada mudança de direção.

O estado deve depender diretamente do progresso do scroll.

---

# 12. Cards e elementos não selecionáveis

Os componentes visuais não devem permitir seleção acidental de texto nem arraste de imagens.

Aplicar quando apropriado:

```css
user-select: none;
-webkit-user-select: none;
```

Em imagens/mídia decorativa:

```css
-webkit-user-drag: none;
```

E, quando aplicável:

```html
draggable="false"
```

Aplicar principalmente em:

- cards;
- badges;
- chips;
- elementos decorativos;
- previews;
- imagens;
- labels visuais;
- elementos do sistema 3D.

IMPORTANTE:

Não usar:

```css
pointer-events: none;
```

em elementos interativos.

Cards, links, botões e previews devem continuar:

- clicáveis;
- focáveis;
- com hover;
- acessíveis por teclado quando aplicável.

Conceito:

```text
não selecionável
≠
não interativo
```

---

# 13. Footer

No footer atual:

```text
© 2026 Neoeffex. Todos os direitos reservados.
```

A palavra:

```text
Neoeffex
```

deve ficar:

```text
bold
+
underline
```

Exemplo:

```html
© 2026 <span class="footer-brand">Neoeffex</span>. Todos os direitos reservados.
```

Sugestão:

```css
.footer-brand {
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
}
```

Preservar a cor atual ou o azul já usado pela identidade.

Não transformar o footer em um novo bloco pesado.

---

# 14. Ordem de implementação

Executar nessa ordem:

```text
1. Header full-width
2. Centralizar hero
3. Ajustar escala do N
4. Aumentar área de scroll
5. Implementar curva de velocidade
6. Refinar estado do N formado
7. Adicionar reação suave ao mouse
8. Testar scroll reverso
9. Bloquear seleção/drag
10. Refinar footer
```

Essa ordem é importante porque alterações no header, hero e altura da seção podem mudar as medidas usadas pelo ScrollTrigger.

---

# 15. Performance

Não adicionar outro canvas apenas para esses refinamentos.

Reutilizar o sistema existente.

Continuar limitando DPR.

Referência:

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
```

Mobile:

```text
1.0 a 1.25
```

Não recalcular posições aleatórias por frame.

Evitar recriar geometria durante scroll.

Não adicionar pós-processamento pesado apenas para melhorar o efeito.

---

# 16. Mobile

No mobile:

- hero continua centralizado;
- N menor;
- N sempre inteiro;
- menos partículas;
- menos profundidade;
- reação ao touch não precisa reproduzir exatamente o mouse;
- formação continua reversível;
- área de scroll pode ser menor se 180–220vh ficar excessiva;
- priorizar fluidez.

Não permitir que o N ocupe toda a largura a ponto de ser cortado.

---

# 17. Reduced motion

Respeitar:

```text
prefers-reduced-motion
```

Nesse modo:

- reduzir movimentos internos;
- remover repelência significativa;
- reduzir micro rotação;
- simplificar formação;
- manter o conteúdo completamente utilizável.

---

# 18. Testes obrigatórios

Testar:

```text
1920x1080
1366x768
tablet
mobile
```

Verificar:

- header ocupa visualmente a tela inteira;
- conteúdo interno continua alinhado;
- hero centralizado;
- botões centralizados;
- N menor sem perder destaque;
- formação inicial perceptivelmente rápida;
- chegada ao N perceptivelmente mais lenta;
- N permanece formado por tempo suficiente;
- N possui movimento interno;
- partículas fogem levemente do mouse;
- partículas retornam à posição original;
- início da dispersão é lento;
- dispersão final acelera;
- scroll reverso funciona;
- não há salto de geometria;
- cards não permitem seleção acidental;
- imagens não arrastam;
- links continuam funcionando;
- `Neoeffex` no footer está bold + underline;
- console sem erros;
- FPS visualmente estável.

---

# 19. Critérios finais de aceitação

A etapa está pronta quando:

```text
HEADER
full-width visual
+
conteúdo centralizado

HERO
centralizado
+
headline e CTAs alinhados

N
ligeiramente menor
+
mais espaço ao redor

SCROLL
mais longo
+
ritmo variável

FORMAÇÃO
8/10
↓
4/10
↓
N vivo
↓
4/10
↓
8/10

MOUSE
repelência suave e local

INTERFACE
sem seleção acidental

FOOTER
Neoeffex bold + underline
```

O resultado deve parecer mais contemplativo e controlado.

O N deve ganhar impacto principalmente pela precisão do movimento, não pela velocidade ou pelo excesso de efeitos.

---

# Não alterar

Não modificar:

```text
/modelos/hamburgueria/
/modelos/clinica-odontologica/
/modelos/hortifruti/
/sites/lu-leve-e-saudavel/
```

Não incluir barbearia.

Não alterar:

```text
/admin
/catalogo
Supabase
autenticação
pedidos
```

---

# Versão sugerida

```text
/modelos v0.4.4
```

# Commit recomendado

```text
modelos - v0.4.4 - refina hero, header e ritmo interativo do N
```

---

# Instrução para o Antigravity

Antes de editar:

1. revisar o estado atual da `/modelos`;
2. revisar o `git diff`;
3. identificar os arquivos responsáveis pelo header, hero, partículas, ScrollTrigger, cards e footer;
4. preservar o que já funciona;
5. aplicar os ajustes de forma incremental;
6. testar após alterações de layout antes de recalibrar o scroll;
7. não fazer commit automaticamente.

Ao concluir, informar:

- arquivos alterados;
- valores finais usados para escala do N;
- altura/faixa de scroll usada;
- curva de progresso aplicada;
- comportamento de mouse implementado;
- comportamento mobile;
- testes realizados;
- pendências encontradas.

---

# COMPLEMENTO — Revisão preventiva e instruções adicionais

## 20. Como aplicar esta revisão

**O conteúdo original foi preservado integralmente acima.** As instruções a seguir complementam a Etapa 5 e esclarecem ambiguidades que podem causar erros durante sua implementação.

Esta revisão foi feita a partir do plano anexado. Os problemas descritos são **riscos de implementação**, não falhas confirmadas no código atual. As recomendações específicas para a Neoeffex são inferências de engenharia; as referências técnicas aparecem junto dos pontos correspondentes.

Antes de executar qualquer alteração, ler o documento inteiro, incluindo este complemento. Manter a ordem da seção 14 e aplicar a prevenção correspondente em cada passo. Se a implementação existente já atender a uma orientação, preservá-la; não criar uma segunda solução equivalente.

As referências de escala, distância, velocidade e intensidade continuam sendo pontos de partida para ajuste visual. Este complemento não autoriza reconstruir a página, trocar a stack, ampliar o escopo ou modificar os sites incorporados.

## 21. Principais riscos identificados

| Referência original | Possível erro | Prevenção acrescentada |
| --- | --- | --- |
| 1 — Header | `width: 100%` continuar limitado pelo container pai | Separar a camada externa do header do limite de largura interno |
| 2 — Hero | Canvas cobrir CTAs ou conteúdo ficar cortado em telas baixas | Conferir camadas, área útil e crescimento natural do conteúdo |
| 3 — Escala do N | Reduzir o canvas ou o campo inteiro, mantendo o enquadramento errado | Ajustar a forma do N e o enquadramento em conjunto |
| 4 — Área de scroll | Confundir altura da seção com distância efetiva da animação | Medir `end - start` e contabilizar a área sticky ou o espaçamento do pin |
| 5–10 — Curva | Saltos de posição ou de velocidade nas divisões de fase | Manter continuidade e controlar quanto da transformação ocorre em cada trecho |
| 10 — Integração | Lenis avançar duas vezes por frame ou uniforms disputarem controle | Identificar um único responsável por cada atualização |
| 11 — Reversibilidade | A forma depender do histórico de rolagem | Derivar a transformação de posições-base estáveis e do progresso atual |
| 6 — Mouse | Repelência exagerada, deslocada ou permanente | Separar pixels CSS de unidades 3D e aplicar retorno limitado |
| 12 — Seleção | Bloquear campos, teclado, links ou interação dos previews | Restringir seleção e drag aos elementos visuais da página hospedeira |
| 15–16 — Performance | Canvas enorme, DPR aplicado duas vezes ou geometria recriada | Manter resolução ligada à área visível e reutilizar recursos |
| 17 — Reduced motion | Reduzir o efeito, mas manter scroll preso e espaço vazio | Adaptar também pin, altura e inicialização do modo simplificado |
| 18 — Testes | Validar somente a primeira descida em um navegador | Testar limites de fase, retorno, recarga, resize e os previews existentes |

## 22. Diagnóstico inicial, escopo e versionamento

Antes de implementar:

1. Ler as instruções aplicáveis do repositório, incluindo arquivos `GEMINI.md` e `AGENTS.md`, se existirem. Identificar a branch e a versão atual de `/modelos`.
2. Consultar `git status`, `git diff` e `git diff --cached`. Preservar alterações já feitas pelo usuário, inclusive arquivos ainda não rastreados. Não usar comandos de restauração ou limpeza para obter uma árvore limpa.
3. Identificar os arquivos efetivamente usados pela rota: entrada, estilos, shader, inicialização de Three.js, integração de scroll, cards e footer. Não presumir nomes ou caminhos de arquivos internos.
4. Registrar o comportamento inicial nas resoluções da seção 18, incluindo posição do header, escala percebida do N, percurso de scroll e interação dos previews.
5. Verificar versões e forma de carregamento de Three.js, GSAP, ScrollTrigger e Lenis. Usar APIs compatíveis com as dependências existentes; não atualizar bibliotecas ou adicionar imports duplicados por conveniência.

As alterações devem se limitar à página de apresentação de `/modelos` e aos recursos necessários para ela. Um arquivo compartilhado exige verificar seus consumidores e restringir o novo comportamento à rota. Evitar seletores e listeners globais com efeito nas demais páginas.

Preservar todos os caminhos e sistemas da seção **Não alterar**. Não substituir os sites incorporados por imagens, mudar a política de carregamento dos iframes, incluir barbearia ou modificar as landings para resolver um problema da página hospedeira.

`v0.4.4` continua sendo a sugestão original. Antes de atualizar `VERSION` ou changelog, confirmar se ela ainda é a próxima versão apropriada; não reduzir uma versão já mais recente nem sobrescrever seu histórico. Registrar eventual adequação de versão. Não fazer commit automaticamente.

## 23. Header, hero, camadas e footer

### 23.1 Header realmente ocupando a largura disponível

`width: 100%` sozinho não resolve se o header estiver dentro de um ancestral limitado por `max-width`. Inspecionar a hierarquia e aplicar o limite somente ao conteúdo interno, conforme a seção 1.

- Preferir um header externo no fluxo da página, fora do container limitado. Se ele já for fixo, conferir seus limites laterais e o bloco que determina seu posicionamento.
- Não mudar um header normal para `fixed` apenas para obter largura total.
- Evitar usar `100vw` como correção automática: conferir se a combinação com a barra de rolagem cria overflow horizontal.
- Conferir margens do `body`, padding, bordas, `box-sizing` e pseudoelementos. Corrigir a origem de um vazamento de largura antes de esconder overflow na página inteira.
- Se o header for fixo, considerar sua altura real no espaço superior do conteúdo e no destino das âncoras. Não descontar essa altura duas vezes.

Ancestrais com overflow podem mudar a referência do `sticky`; transformações também precisam ser examinadas quando houver elementos fixos. Inspecionar os estilos computados antes de alterar a estrutura. [Referência: posicionamento CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position).

### 23.2 Centralização sem impedir leitura ou cliques

A centralização pedida é horizontal. Não impor centralização vertical ou altura fixa que corte headline, apoio ou CTAs em telas baixas ou com zoom.

- Centralizar o conjunto de texto e o grupo de botões, mantendo quebra de linha e largura de leitura adequadas.
- Permitir crescimento natural do hero. Se houver altura mínima baseada na viewport, manter espaço para o conteúdo exceder essa medida.
- Elementos estruturais sem fundo podem ser usados para alinhamento. A proibição da seção 2 se refere a criar um bloco visual atrás do hero.
- Preservar as partículas atrás dos textos e controles. Conferir contraste tanto no estado disperso quanto no N formado.
- O canvas exclusivamente decorativo pode usar `pointer-events: none` e `aria-hidden="true"`. Nesse caso, captar o cursor em um ancestral adequado ou na página, sem bloquear eventos dos controles.
- Não aplicar `pointer-events: none` ao hero inteiro nem ao wrapper dos cards. Preservar foco visível, ordem de tabulação e navegação mobile existente.

### 23.3 Footer

Aplicar bold e underline somente à marca. Se `Neoeffex` já for um link, preservar seu elemento, destino e foco em vez de substituí-lo pelo `span` ilustrativo. Se o ano já for dinâmico, preservar esse comportamento. Conferir se o peso solicitado está disponível na fonte existente antes de adicionar outro arquivo de fonte.

## 24. Escala do N, enquadramento e geometria

Diminuir o tamanho CSS do canvas ou aplicar `object-fit: contain` nele não garante que o N caiba na cena. O ajuste precisa considerar as dimensões reais da forma, a câmera e a proporção da área de desenho.

1. Registrar a escala original e aplicar a redução em relação a essa base. Não multiplicar a escala atual por `0.92` a cada resize ou atualização.
2. Escolher um único ponto para controlar o tamanho do N. Evitar combinar redução da geometria, do grupo e da câmera sem contabilizar o resultado.
3. Se o mesmo `THREE.Points` também representa o campo ambiental, reduzir a forma-alvo do N sem encolher involuntariamente todo o campo.
4. Manter proporções uniformes. Ajustar o enquadramento para largura e altura disponíveis, reservando margem para tamanho dos pontos, brilho, oscilação, inclinação e repelência.
5. Conferir o N completo em retrato, paisagem, telas baixas e zoom. Verificar também os planos de corte da câmera. A margem deve existir durante o movimento, não apenas numa captura estática.

Ao redimensionar, sincronizar tamanho do renderer e projeção da câmera com o tamanho CSS real da área visível. Alterar apenas a resolução interna ou apenas o CSS pode produzir distorção. [Referência: Three.js — responsive design](https://threejs.org/manual/en/responsive.html).

**Risco específico de shader:** posições deslocadas na GPU podem ficar fora dos limites calculados a partir do atributo `position` na CPU. Se o N sumir inesperadamente, investigar o frustum culling. Como prevenção inferida para esta cena, usar limites conservadores que incluam os estados animados; se necessário, avaliar desativar o culling somente desse `Points`, medindo o custo. Recalcular uma esfera apenas sobre posições-base não incorpora automaticamente os deslocamentos do shader. [Referências: BufferGeometry](https://threejs.org/docs/pages/BufferGeometry.html) e [Object3D](https://threejs.org/docs/pages/Object3D.html).

Os atributos de posição inicial, forma do N, destino ambiental e sementes devem ter contagens compatíveis e valores finitos. Usar a mesma correspondência de partículas entre estados. No mobile, reduzir a contagem com distribuição que preserve as duas hastes e a diagonal; não selecionar um trecho ordenado do buffer que elimine parte da letra.

## 25. Distância útil de scroll e fixação

### 25.1 Eliminar a ambiguidade de `180vh–220vh`

Para implementar a intenção da seção 4, usar essa faixa como **referência de distância efetiva da transformação**, medida entre início e fim do progresso. A altura total do wrapper deve ser calculada conforme a estratégia existente.

Exemplo de cálculo, sem offsets, padding ou margens adicionais:

| Estratégia | Exemplo com área visível de `100vh` e percurso desejado de `200vh` |
| --- | --- |
| CSS sticky | Wrapper de aproximadamente `300vh`, pois `300vh - 100vh = 200vh` de percurso |
| ScrollTrigger pin | Distância entre `start` e `end` de `200vh`, com o espaçamento do pin contabilizado uma única vez |

Um wrapper sticky de `200vh` contendo um palco de `100vh` oferece aproximadamente `100vh` de percurso nessa configuração. Esse é o erro que esta instrução procura evitar.

Medir o resultado real. Registrar altura do wrapper, altura visível do palco, `start`, `end` e diferença em pixels. Ajustar a faixa se o resultado ficar excessivo, especialmente no mobile, como permitido no plano original.

### 25.2 Evitar dupla fixação e espaço duplicado

- Reutilizar a estratégia existente que já funciona. Não aplicar CSS sticky e `pin` ao mesmo elemento para a mesma experiência.
- Não somar um wrapper alto e um spacer automático que reservem o mesmo percurso duas vezes.
- Manter estável o elemento usado para medir/fixar o palco; animar seus elementos internos.
- Não fixar um ancestral que também englobe a vitrine de iframes sem necessidade. Preservar a continuidade do canvas ambiental depois da experiência do N.
- Usar markers apenas durante a calibração e removê-los ao concluir.

O ScrollTrigger calcula posições de início/fim, oferece espaçamento para pin e recomenda não animar diretamente o elemento fixado. Conferir essas opções no setup atual. [Referência: ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

### 25.3 Permanência por scroll não é tempo mínimo

A faixa de 45% a 65% reserva 20% do percurso para o N formado. Com percurso de `200vh`, isso corresponde a `40vh` de rolagem. O tempo percebido depende da velocidade com que a pessoa rola.

Não prender a rolagem, adicionar espera obrigatória, snap ou autoplay para garantir segundos de permanência. Aumentar o percurso ou recalibrar as faixas se necessário, preservando a navegação livre e registrando os valores finais.

## 26. Lenis, ScrollTrigger e loop de renderização

Inventariar instâncias, tickers e callbacks antes de adicionar código. Cada frame deve ter uma atualização coerente de scroll, estado visual e renderização.

- Manter uma instância de Lenis por contexto de rolagem já existente. Não iniciar outra apenas para o N.
- Alimentar `lenis.raf()` por um único mecanismo. Não combinar `autoRaf` ativo, um RAF manual e o ticker GSAP atualizando a mesma instância.
- Na integração pelo ticker GSAP, conferir unidades: ele fornece tempo em segundos, enquanto `lenis.raf()` recebe milissegundos.
- Sincronizar Lenis e `ScrollTrigger.update` pela integração existente. Avaliar o scroller real antes de adicionar `scrollerProxy`.
- Não copiar configurações globais de ticker ou suavização sem verificar as outras animações que dependem delas.

Essas verificações se apoiam no setup oficial do Lenis. Usar a documentação correspondente à versão do projeto. [Referência: integração Lenis com GSAP](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger).

**Atenção ao `scrub`:** um valor numérico suaviza a animação vinculada ao ScrollTrigger; ele não transforma automaticamente o valor bruto lido de `self.progress` em um progresso suavizado. Se os uniforms seguirem um tween com scrub, atualizá-los a partir do estado desse tween, inclusive enquanto ele termina de acompanhar o scroll. [Referência: ScrollTrigger — scrub e onUpdate](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

Para esta etapa:

- Definir um único responsável por escrever cada uniform. Não deixar tween, RAF e shader disputarem o mesmo progresso com fórmulas diferentes.
- Evitar criar novos `gsap.to()` em cada evento de scroll ou movimento do mouse.
- Se uma função já remapeia o progresso por fases, manter linear o valor que alimenta essa função, evitando aplicar um segundo easing não planejado.
- Começar com a suavização existente. Somar inércia de Lenis, scrub longo e interpolação extra pode fazer o N continuar se transformando muito depois de parar a rolagem.
- Não chamar `ScrollTrigger.refresh()` a cada frame. Refresh é para mudanças de medidas; update acompanha a rolagem.

Verificar conflitos entre tweens e valores recalculados antes de adicionar outro controlador. [Referência: erros comuns de ScrollTrigger](https://gsap.com/resources/st-mistakes/).

## 27. Curva contínua, posições estáveis e N vivo

### 27.1 Velocidade exige controlar o deslocamento

Dividir a timeline em cinco trechos não basta: também é preciso definir quanto da transformação acontece em cada trecho. Não interpretar `8/10` e `4/10` como número de partículas, multiplicação de tempo global ou velocidade obrigatoriamente constante.

Referência adicional para os pesos da transformação:

| Progresso da experiência | Campo inicial | Forma do N | Campo final |
| --- | ---: | ---: | ---: |
| 0% | 1.00 | 0.00 | 0.00 |
| 30% | 0.15 | 0.85 | 0.00 |
| 45% | 0.00 | 1.00 | 0.00 |
| 65% | 0.00 | 1.00 | 0.00 |
| 80% | 0.00 | 0.85 | 0.15 |
| 100% | 0.00 | 0.00 | 1.00 |

Esses pesos são uma proposta de calibração, não uma exigência de criar três novos buffers. Se o sistema atual já representar os estados corretamente, reutilizá-lo. O valor `0.85` pode ser ajustado conforme a legibilidade do N.

- Restringir o progresso válido ao intervalo de 0 a 1 e tratar dimensões ou intervalos inválidos antes de dividir valores.
- Manter continuidade de posição nos limites 30%, 45%, 65% e 80%; buscar também continuidade de velocidade.
- Na chegada a 45%, a velocidade da formação deve tender a zero. Após 65%, a dispersão deve partir suavemente da forma montada.
- Não aplicar um `smoothstep` independente em cada trecho sem verificar as junções: ele pode introduzir uma parada artificial em 30% e 80%.
- Uma interpolação cúbica por trechos com tangentes compatíveis é uma possibilidade. Manter os pesos dentro dos limites e sem ultrapassar o alvo; não usar uma curva com overshoot por padrão.

### 27.2 Composição reversível

Para cada partícula, o estado-base deve ser calculado a partir dos estados estáveis e do progresso atual. Conceito:

```text
P_base = peso_inicial * P_inicial
       + peso_N * P_N
       + peso_final * P_final

Os pesos são não negativos e somam 1.
```

Não recalcular o início de uma transição a partir da posição já deformada pela transição anterior. Não depender de callbacks de entrada/saída para determinar a forma: uma rolagem rápida pode atravessar várias fases entre dois frames.

Gerar sementes e posições uma vez por inicialização válida. Preservar a correspondência ao mudar de direção. Se o campo ambiental tiver movimento por tempo, usar o mesmo movimento na transição e no estado ambiental de destino para evitar um salto no fim.

### 27.3 Separar transformação e movimento interno

```text
P_visual = P_base(scroll)
         + movimento_interno_limitado(scroll, tempo)
         + resposta_local_limitada(scroll, cursor)
```

O scroll determina a montagem. O tempo mantém os micromovimentos. O cursor acrescenta um deslocamento temporário.

- Não fazer `uTime` depender do avanço do scroll: o N deve continuar vivo quando a pessoa para de rolar no trecho formado.
- Aumentar e reduzir suavemente a influência do movimento interno e do mouse nas proximidades do N formado, sem ligar ou desligar tudo abruptamente em 45% ou 65%.
- Limitar a soma dos efeitos. Pequenos deslocamentos individuais podem, quando combinados, ultrapassar a margem do N ou descaracterizar a silhueta.
- Para testar reversibilidade exata, congelar temporariamente tempo e mouse em desenvolvimento. Para o mesmo progresso, a forma-base deve coincidir nos dois sentidos. Depois reativar o movimento interno.

## 28. Mouse: unidades, força local e retorno

Os `5px–15px` da seção 6 são uma referência de **deslocamento visual em pixels CSS**, não unidades do mundo 3D e não o raio de influência do cursor. Definir e registrar o raio separadamente.

As coordenadas precisam considerar a área CSS real do canvas. `getBoundingClientRect()` fornece medidas e posição relativas à viewport, compatíveis com `clientX` e `clientY`. [Referência: getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).

Exemplo conceitual de normalização, para área sem bordas/padding relevantes:

```js
const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
```

Antes do cálculo, garantir `rect.width > 0` e `rect.height > 0`. Atualizar as medidas quando layout ou posicionamento mudarem; não fazer leituras de layout por partícula.

Regras de implementação:

- Não multiplicar coordenadas CSS pelo DPR ao normalizar pelo retângulo CSS.
- Escolher um espaço coerente para cursor e partículas: projeção em tela ou conversão para um plano 3D compatível com a câmera. Considerar proporção da tela e transformações do N; não comparar coordenadas NDC diretamente com posições locais 3D.
- Aplicar intensidade que diminua suavemente com a distância. Evitar uma borda dura no raio de influência.
- Proteger normalização e divisão quando a distância ao cursor for zero. Nenhum caminho pode produzir `NaN` ou infinito.
- Calcular o afastamento como offset limitado sobre a posição-base. Não acumular deslocamento permanentemente no buffer do N.
- Suavizar o retorno com tempo decorrido, evitando dependência da taxa de frames. Se usar amortecimento exponencial, um fator conceitual é `1 - exp(-k * deltaTime)`, com `k > 0` e unidades coerentes.
- Começar com influência de mouse zerada até existir uma posição válida. Suavizar a ativação para evitar um impacto no centro da tela ao carregar.
- Reduzir a influência ao sair da área, perder foco, cancelar o ponteiro ou entrar na interação de um preview. A ausência de eventos de mouse dentro de um iframe não deve deixar o N preso à última força.
- Em dispositivos com toque, manter a rolagem e o zoom nativos. Não exigir toque para completar a animação nem adicionar `preventDefault()` global.

Conferir conversão de graus para radianos quando a inclinação for escrita em propriedades de rotação do Three.js. O limite visual de `2°–3°` deve considerar a combinação de inclinação pelo mouse e oscilação já existente. [Referência: Object3D — rotation](https://threejs.org/docs/pages/Object3D.html).

## 29. Inicialização, recarga, resize e navegação

O primeiro frame precisa corresponder à posição atual da página, inclusive após recarregar no meio, abrir uma âncora ou voltar pelo histórico. Não forçar o usuário ao topo para esconder um problema de inicialização.

Depois de mudanças reais de medidas, recalcular o layout e sincronizar a cena. O `ScrollTrigger.refresh()` refaz medições; não equivale a simplesmente atualizar o progresso de rolagem. Usar o método quando o DOM já refletir as alterações. [Referência: ScrollTrigger.refresh](https://gsap.com/docs/v3/Plugins/ScrollTrigger/refresh()/).

- Considerar o carregamento de fontes e recursos que efetivamente mudem o tamanho do layout. Não bloquear a apresentação da página esperando indefinidamente por recursos opcionais.
- Reaproveitar a reserva de tamanho dos previews. Se ela estiver ausente e causar deslocamento, corrigir o wrapper hospedeiro preservando o comportamento do iframe.
- Agrupar eventos de resize e observar mudanças reais; não criar um ciclo em que alterar medidas dispara outro refresh continuamente.
- Após resize, atualizar câmera, renderer e progresso coerentemente. Não gerar outra nuvem aleatória nem reiniciar `uTime` a cada atualização.
- Conferir destinos de âncora após alterar o percurso. Os CTAs precisam chegar à seção correta, sem ficar escondidos pelo header.

No mobile, `svh` oferece uma referência estável da viewport pequena; `dvh` acompanha a área dinâmica e pode mudar durante a rolagem. Escolher a estratégia adequada para o palco e para o percurso, sem trocar mecanicamente todos os `vh` por `dvh`. [Referência: unidades de viewport](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length).

Para esta cena, evitar que o simples recolhimento da barra do navegador recalcule continuamente a distância de formação. Diferenciar essa variação de uma mudança real de orientação ou largura. Testar abertura e fechamento do menu mobile sem perder a posição da experiência.

## 30. Seleção, arraste e proteção dos previews

Aplicar `user-select: none` aos componentes visuais indicados, com seletores restritos à página de `/modelos`. Evitar `*`, `body` ou regras globais que atinjam controles e conteúdos úteis para copiar.

Campos de busca, `input`, `textarea`, conteúdo editável e qualquer texto que precise ser copiado devem continuar com seleção normal. Quando estiverem dentro de uma área não selecionável, aplicar uma exceção explícita como `user-select: text`, incluindo o prefixo necessário para o navegador atendido. [Referência: user-select](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/user-select).

- Usar `draggable="false"` nas imagens decorativas; se o arraste vier de um link visual pai, tratar esse elemento de forma localizada.
- Não cancelar globalmente `mousedown`, `pointerdown`, `touchstart`, `keydown`, menu de contexto ou seleção. Isso pode impedir foco, edição, navegação e gestos legítimos.
- Não confundir bloqueio de seleção com bloqueio de clique. Preservar abertura normal, Ctrl/Cmd + clique, foco visível e ativação de botões pelo teclado.
- Manter semântica de links e botões. Evitar transformar um card inteiro em um botão que contenha outros botões ou links conflitantes.

**Limite dos iframes:** cada iframe possui seu próprio documento. Regras de seleção do wrapper da página hospedeira não passam automaticamente para o conteúdo incorporado; o acesso por script também depende da origem. [Referência: iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe).

Nesta etapa, aplicar o bloqueio somente à moldura, aos controles e aos elementos visuais de `/modelos`. Não injetar CSS ou listeners nas landings e não colocar uma camada que impeça sua interação. Preservar o comportamento existente de entrar e sair do modo de interação do preview.

A rolagem suavizada da página pode se comportar de forma diferente quando o ponteiro está dentro de um iframe, pois seus eventos de roda não são encaminhados à página pai. Validar essa fronteira sem modificar o site incorporado. [Referência: limitações do Lenis](https://github.com/darkroomengineering/lenis#limitations).

## 31. Performance, movimento reduzido e falhas da cena

### 31.1 Resolução e recursos

- Aumentar a distância de scroll não significa aumentar o canvas para a altura de toda a seção. Manter o buffer de desenho dimensionado para a área visível.
- Usar o teto de DPR já previsto no plano. Se o renderer aplica `setPixelRatio`, não multiplicar novamente largura e altura por DPR ao chamar `setSize`.
- Conferir `uResolution`, tamanho dos pontos e conversões usadas pelo shader: cada variável deve ter unidade definida, em pixels CSS ou pixels do buffer.

O renderer distingue tamanho lógico e tamanho do drawing buffer. Manter essa distinção evita uma resolução interna multiplicada duas vezes. [Referência: WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html).

- Reutilizar buffers, vetores e materiais. Manter o processamento por partícula na solução GPU existente; eventos de scroll devem atualizar estado e uniforms, sem reamostrar a forma.
- Reduzir partículas por perfil ou breakpoint estável, evitando recriações a cada evento de resize. Conferir a distribuição do N depois da redução.
- Não desativar o canvas apenas porque o trecho do N saiu da tela se ele continua produzindo o campo ambiental visível.
- Ao pausar e retomar a aba, tratar o intervalo de tempo para que o retorno não provoque um salto grande ou duplique o loop.
- Na desmontagem real da cena, remover somente seus próprios listeners, callbacks e triggers; liberar recursos que deixaram de ser usados. Evitar `killAll()` ou limpeza global que afete outros componentes.

### 31.2 Reduced motion completo

Consultar a preferência antes de iniciar os efeitos e tratar mudanças enquanto a página estiver aberta. A preferência indica solicitação de redução de movimento; a adaptação precisa alcançar também animações iniciadas por JavaScript. [Referência: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).

Para esta etapa, o modo pode mostrar o N estático ou uma transição muito simples, com micromovimento mínimo ou desligado e sem repelência relevante. Se a experiência longa for removida, reduzir também sua altura reservada e desfazer o pin correspondente, preservando o acesso ao conteúdo seguinte. Evitar alternar de modo deixando spacers, listeners ou uma segunda cena ativos.

### 31.3 Falha de WebGL, shader ou carregamento

Verificar se existe fallback e preservá-lo. Se a criação da cena falhar, o hero, a navegação e os CTAs devem continuar visíveis e funcionais, sem um grande trecho vazio de scroll.

Usar uma apresentação estática já disponível no projeto ou manter a interface utilizável sem a decoração. Tratar falhas da cena de forma localizada; não ocultar erros de outras partes da página. Se houver recuperação de contexto WebGL, ela deve reconstruir apenas o necessário, sem criar canvas ou loops duplicados.

## 32. Validação complementar objetiva

Executar junto dos testes da seção 18, conforme os ambientes disponíveis. Distinguir teste realizado, inspeção de código e teste pendente. Não declarar compatibilidade com um dispositivo real quando foi usada apenas emulação.

| Cenário | Como verificar | Resultado esperado |
| --- | --- | --- |
| Layout desktop | Usar 1920×1080 e 1366×768, verificando também a barra vertical | Header completo, conteúdo alinhado e ausência de rolagem horizontal |
| Telas menores | Conferir tablet, larguras de 320, 360 e 390 pixels e orientação paisagem | N inteiro; headline, CTAs e menu sem corte ou sobreposição |
| Zoom e teclado | Testar zoom de 200%, Tab, Shift + Tab, Enter e Space nos controles apropriados | Conteúdo acessível, foco visível e ausência de armadilha de foco |
| Marcos da curva | Inspecionar 0%, 30%, 45%, 65%, 80% e 100%, além de valores imediatamente antes/depois | Pesos coerentes e transições sem salto |
| Ida e volta | Repetir descida/subida e comparar o mesmo progresso com tempo/mouse congelados temporariamente | Mesma forma-base, sem nova distribuição aleatória |
| Scroll rápido | Usar roda rápida, trackpad ou gesto, Page Down, Home e End | Estado correto mesmo ao atravessar várias fases entre frames |
| Parada no N | Parar entre 45% e 65% | Transformação estabilizada; micromovimento presente no modo normal |
| Cursor | Passar pelo centro e pelas bordas, sair da área e retornar | Força local, limites respeitados, retorno suave e nenhum valor inválido |
| Recarga e histórico | Recarregar no meio e retornar de outra página; testar âncora existente | Cena sincronizada à posição atual, sem reinício obrigatório no topo |
| Resize e fontes | Redimensionar, girar tela e conferir carregamento inicial | Enquadramento atualizado, sem pin ou reserva de espaço duplicados |
| Seleção e previews | Arrastar imagem/card, editar campos existentes e interagir com os sites incorporados | Decoração sem seleção/drag acidental; controles e sites preservados |
| Reduced motion | Ativar a preferência antes da carga e depois alterná-la | Modo simplificado utilizável e sem seção longa vazia |
| Falha da cena | Simular falha de inicialização/indisponibilidade de WebGL em ambiente de teste | Conteúdo e links utilizáveis, sem bloqueio de rolagem |
| Performance | Comparar antes/depois no mesmo ambiente, incluindo a vitrine visível | Nenhuma duplicação de loop, crescimento contínuo de recursos ou regressão relevante |

Priorizar Firefox e Chromium; conferir Safari/iOS se houver acesso. Registrar limitações quando um ambiente não puder ser testado. Avaliar fluidez no equipamento usado, sem prometer um FPS universal.

Se houver scripts de build ou validação no projeto, executar os pertinentes à alteração. Não instalar uma infraestrutura de testes nova para este refinamento. Uma verificação pequena da função de progresso é útil se resolver dúvida concreta sobre continuidade, limites ou reversibilidade.

Ao terminar, revisar o diff e confirmar que nenhuma alteração própria atingiu as rotas protegidas ou os documentos internos dos iframes. Comparar com o estado inicial para não atribuir alterações prévias do usuário a esta etapa.

## 33. Instrução adicional de entrega para o Antigravity

Executar a Etapa 5 original aplicando este complemento durante os mesmos passos, sem transformar cada risco em uma refatoração obrigatória. Corrigir o que estiver ausente ou incorreto e manter as soluções existentes que já atendem aos critérios.

Além do relatório pedido no documento original, informar:

- quais riscos foram encontrados no código e quais já estavam cobertos;
- escala original e final do N, estratégia de enquadramento e margens usadas;
- altura do palco, altura da seção e distância efetiva de scroll por perfil;
- estratégia de fixação, controlador do progresso e suavizações mantidas;
- pontos da curva, limites dos offsets e unidades do mouse;
- tratamento de resize, recarga, reduced motion e falhas da cena;
- testes efetivamente realizados, resultados e pendências;
- confirmação de preservação das landings, previews e sistemas fora do escopo.

Entregar somente os arquivos alterados em `.zip`, preservando seus caminhos relativos a partir da raiz do repositório, conforme o padrão do projeto. Não acrescentar pastas de build, dependências ou configurações locais que não façam parte da entrega prevista pelo repositório.

Apresentar o resultado no formato habitual: Etapa 5, arquivo baixável, atualizações, como testar e commit recomendado em bloco copiável. Usar o commit original se `v0.4.4` continuar apropriada; caso a versão tenha precisado de adequação, explicar o motivo. Não executar o commit.

**Este complemento prepara a implementação. Ele não registra a Etapa 5 como implementada nem os testes do site como concluídos.**
