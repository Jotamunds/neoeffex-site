# NEOEFFEX — PLANO TÉCNICO ESTRITO PARA O ANTIGRAVITY

## Etapas cobertas

- **Etapa 4.1 — Refinamento avançado da física e suavidade do N**
- **Etapa 5 — Prisma**
- **Etapa 6 — Cursor personalizado + integração e regressão final**

> Este documento substitui qualquer liberdade criativa do agente **somente para as Etapas 4.1, 5 e 6**.  
> O Antigravity deve seguir o escopo abaixo de forma estrita.  
> **Não adicionar funcionalidades, não reorganizar arquitetura global, não refatorar áreas não relacionadas, não alterar design aprovado e não antecipar etapas.**

---

# 0. REGRA-MESTRA

O objetivo destas três etapas é concluir a experiência interativa principal da landing sem provocar regressões nas correções já aprovadas.

O Antigravity deve trabalhar com a seguinte prioridade:

1. **Preservar o que já funciona.**
2. **Alterar somente o necessário para a etapa atual.**
3. **Não melhorar outras áreas por iniciativa própria.**
4. **Não trocar bibliotecas, arquitetura, sistema de build, estrutura de pastas ou dependências sem necessidade técnica comprovada.**
5. **Não fazer refatoração estética ou “cleanup” geral durante estas etapas.**
6. **Não remover código aparentemente redundante sem provar que ele é desnecessário para a etapa.**
7. **Não renomear classes, IDs, seletores, arquivos ou APIs internas apenas por preferência.**
8. **Não modificar textos, copy, tipografia, cores, espaçamentos, seções ou elementos não citados neste documento.**
9. **Não alterar o formato visual aprovado do N.**
10. **Não alterar a posição vertical aprovada do N, exceto se a própria física da Etapa 4.1 exigir compensação matemática interna sem mudança visual.**
11. **Não alterar novamente o comportamento fixo do header.**
12. **Não reescrever a normalização de coordenadas do mouse já corrigida na Etapa 2, exceto para centralizar a leitura em uma única fonte compartilhada na Etapa 6 sem mudar o resultado matemático.**
13. **Não modificar a física do N nas Etapas 5 e 6, salvo correção de regressão introduzida pela própria etapa e somente com a menor alteração possível.**

---

# 1. O QUE JÁ DEVE SER CONSIDERADO APROVADO

As etapas anteriores já estabeleceram decisões que agora devem ser tratadas como restrições.

## 1.1 Header

O header deve permanecer:

- fixo;
- visível durante a navegação;
- sem voltar ao comportamento anterior de desaparecer;
- sem mudança de altura, layout, espaçamento ou identidade visual nesta etapa;
- sem nova animação adicional;
- sem interferir na área útil do N.

## 1.2 Posição do N

O N já foi deslocado levemente para baixo para evitar proximidade excessiva com o header.

Essa posição é aprovada.

Não fazer:

- recentralização automática que ignore o offset aprovado;
- mudança de escala visual sem solicitação;
- alteração do desenho;
- troca da distribuição estrutural das partículas que forme outro N.

## 1.3 Coordenadas do mouse

A normalização do mouse deve permanecer matematicamente coerente com Three.js/NDC.

A regra conceitual correta é:

```js
x = (clientX / width) * 2 - 1;
y = -(clientY / height) * 2 + 1;
```

Se houver compensações da área útil ou do `nOffsetY`, elas devem ser aplicadas de forma coerente e única.

Não reintroduzir eixo Y espelhado.

## 1.4 Interação do N com o mouse

O N deve continuar:

- reagindo levemente ao mouse;
- afastando partículas próximas sem explosão;
- retornando suavemente;
- mantendo legibilidade;
- sem buracos grandes;
- sem deslocar a letra como um bloco inteiro.

## 1.5 Estado visual geral

Não alterar:

- conteúdo das seções;
- hero;
- botões;
- footer;
- tipografia aprovada;
- cores aprovadas;
- textos;
- ordem das seções;
- assets;
- logos;
- componentes não relacionados.

---

# 2. FLUXO DE TRABALHO OBRIGATÓRIO DO ANTIGRAVITY

Antes de editar qualquer arquivo em cada etapa:

1. Ler este documento inteiro.
2. Identificar os arquivos reais envolvidos.
3. Listar internamente quais arquivos pretende alterar.
4. Confirmar que cada arquivo pertence ao escopo da etapa atual.
5. Fazer a menor alteração estrutural possível.
6. Testar antes de seguir para outra mudança.
7. Não juntar correções de etapas futuras.

Ao terminar cada etapa:

- executar testes funcionais;
- revisar console do navegador;
- verificar regressões;
- registrar exatamente o que foi alterado;
- não iniciar a próxima etapa automaticamente.

---

# 3. ETAPA 4.1 — REFINAMENTO AVANÇADO DA FÍSICA DO N

## 3.1 Objetivo da Etapa 4.1

Resolver definitivamente o problema atual:

- scroll devagar: comportamento aceitável;
- scroll normal: formação/desformação ainda bruta;
- scroll rápido: transições excessivamente abruptas.

A causa a ser tratada é estrutural:

> O N não deve responder diretamente ao progresso instantâneo do scroll.

A nova arquitetura deve permitir que:

- o scroll indique **para onde** a animação deve ir;
- um controlador de movimento decida **como** chegar;
- mudanças bruscas do scroll não causem mudanças bruscas do N;
- o usuário possa rolar rapidamente sem “arremessar” as partículas entre estados.

---

# 4. ESCOPO PERMITIDO — ETAPA 4.1

Pode alterar somente o que for necessário para:

- leitura do progresso de scroll relacionado ao N;
- cálculo de velocidade/direção do scroll;
- controlador intermediário de progresso visual;
- física de aproximação das partículas;
- damping;
- spring;
- speed limiting;
- proteção por deltaTime;
- stagger leve;
- breathing leve;
- offsets do mouse sobre as partículas;
- otimizações diretamente necessárias para manter a suavidade dessa física.

Pode criar pequenas funções utilitárias locais para esses objetivos.

Pode criar estruturas auxiliares de dados para as partículas se necessário.

---

# 5. ESCOPO PROIBIDO — ETAPA 4.1

Não alterar:

- header;
- navbar;
- logo;
- hero;
- copy;
- botões;
- footer;
- prisma;
- cursor personalizado;
- rotas;
- HTML estrutural sem necessidade absoluta;
- CSS global sem necessidade absoluta;
- outras animações;
- dimensões das seções por tentativa e erro sem primeiro resolver a física;
- dependências do projeto;
- versão do Three.js;
- versão do GSAP;
- build tooling;
- Vite/configuração equivalente;
- assets existentes;
- formato do N;
- quantidade de partículas, salvo se comprovadamente necessária por performance e sem mudança visual perceptível.

Não instalar biblioteca de smooth scroll por iniciativa própria.

Não adicionar Lenis, locomotive-scroll ou equivalente somente porque poderia facilitar a implementação.

Se o projeto já usa uma biblioteca desse tipo, respeitar a existente.

---

# 6. ARQUITETURA OBRIGATÓRIA DO N

A cadeia conceitual da Etapa 4.1 deve seguir:

```text
SCROLL REAL
    ↓
scrollPosition / scrollProgress
    ↓
scrollVelocity + direction
    ↓
targetProgress
    ↓
MOTION CONTROLLER ÚNICO
    ├── damping adaptativo
    ├── spring criticamente amortecido
    ├── limite de velocidade
    └── controle limitado de dívida/inércia
    ↓
visualProgress
    ↓
BASE TARGET DAS PARTÍCULAS
    ↓
offsets adicionais
    ├── stagger
    ├── breathing
    └── mouse repulsion
    ↓
finalTarget
    ↓
FÍSICA DAS PARTÍCULAS
    ↓
render
```

## Regra crítica

Não criar múltiplos filtros independentes em cascata sem controle.

Evitar arquitetura equivalente a:

```text
scroll
→ smooth scroll
→ lerp
→ outro lerp
→ spring
→ outro damping
→ partícula spring
```

Isso cria atraso excessivo e comportamento “borrachudo”.

Deve existir **um controlador principal de movimento**.

---

# 7. TARGET PROGRESS E VISUAL PROGRESS

Criar separação conceitual entre:

```js
targetProgress
```

e:

```js
visualProgress
```

Os nomes exatos podem seguir o padrão existente do projeto, mas as responsabilidades devem ser separadas.

## targetProgress

Representa o estado solicitado pelo scroll.

Pode mudar rapidamente.

Exemplo:

```text
0.31 → 0.57
```

em um intervalo curto.

## visualProgress

Representa o estado efetivamente usado pela animação.

Não deve saltar para `0.57` instantaneamente.

Deve perseguir o target com física controlada.

---

# 8. SPRING PRINCIPAL

O progresso visual deve utilizar spring amortecido ou solução equivalente baseada em tempo.

Preferência:

- comportamento próximo de **critical damping**;
- sem oscilação perceptível do progresso global;
- resposta suficientemente rápida;
- sem atraso exagerado.

Não usar spring global com efeito de mola visual do N inteiro.

O usuário não deve perceber:

```text
passou do ponto
voltou
passou de novo
```

no `visualProgress`.

Overshoot, se usado, deve ser exclusivamente microscópico e local por partícula.

---

# 9. LIMITE MÁXIMO DE VELOCIDADE

O N deve ter limite próprio de velocidade visual.

Mesmo que o scroll gere grande salto de target, a animação não pode ultrapassar a velocidade máxima estabelecida pelo controlador.

Conceitualmente:

```js
visualVelocity = clamp(
    desiredVelocity,
    -maxVisualSpeed,
    maxVisualSpeed
);
```

O valor deve ser calibrado visualmente.

Critério:

> Um scroll extremamente rápido não pode fazer o N atravessar formação → formado → dispersão em um intervalo visualmente brusco.

---

# 10. DAMPING ADAPTATIVO À VELOCIDADE DO SCROLL

O sistema deve responder de forma diferente dependendo da velocidade de entrada.

## Scroll muito lento

- N acompanha relativamente de perto;
- pouca defasagem;
- usuário sente controle preciso.

## Scroll normal

- amortecimento moderado;
- transição contínua.

## Scroll rápido

- maior amortecimento;
- velocidade visual limitada;
- N ganha sensação de massa;
- N não acompanha instantaneamente os saltos do scroll.

## Scroll extremamente rápido

- target pode avançar muito;
- visualProgress avança em velocidade segura;
- não bloquear o scroll da página;
- não prender o usuário.

---

# 11. SCROLL DEBT / INÉRCIA CONTROLADA

Se for necessário armazenar diferença entre target e estado visual, essa dívida deve ser estritamente limitada.

Não implementar uma fila infinita de delta de wheel.

Não permitir que o N continue se movimentando por vários segundos depois do usuário parar.

Requisitos:

- dívida máxima limitada;
- dissipação automática;
- cancelamento/redução agressiva em inversão de direção;
- nunca sequestrar o scroll real;
- nunca usar `preventDefault()` em `wheel` para obrigar a página a esperar a animação.

---

# 12. INVERSÃO DE SCROLL

Este é um caso crítico.

Cenário obrigatório de teste:

```text
usuário rola rapidamente para baixo
↓
N começa a formar/desformar
↓
usuário imediatamente rola para cima
```

O N pode manter uma quantidade mínima e natural de inércia, mas deve inverter a tendência rapidamente.

Não permitir:

- N continuar avançando por tempo perceptivelmente longo contra a direção do usuário;
- dívida anterior cancelar completamente o comando novo;
- snap no momento da inversão.

Ao detectar mudança forte de direção:

- reduzir a inércia/debt acumulada da direção anterior;
- preservar continuidade de velocidade;
- migrar suavemente para a nova direção.

---

# 13. DELTATIME OBRIGATÓRIO

Toda física temporal deve considerar `deltaTime`.

Não usar valores fixos por frame como fonte principal de velocidade.

Evitar:

```js
position.lerp(target, 0.08);
```

como única base temporal.

Preferir solução equivalente a:

```js
const alpha = 1 - Math.exp(-speed * dt);
```

ou integração física baseada em `dt`.

## Proteção de deltaTime

Obrigatório limitar `dt` para evitar explosões após:

- troca de aba;
- travada do navegador;
- breakpoint de DevTools;
- suspensão temporária.

Exemplo conceitual:

```js
dt = Math.min(dt, 0.033);
```

O valor final pode ser ajustado tecnicamente, mas deve existir proteção equivalente.

Ao retornar de `visibilitychange`, considerar resetar o relógio temporal.

---

# 14. SUBSTEPS

Substeps são permitidos somente se necessários para estabilidade.

Não usar quantidade alta fixa por padrão.

Evitar custo desnecessário.

Preferência:

- 1 substep em condição normal;
- aumentar para 2 ou mais somente quando `dt` exigir;
- limitar o máximo;
- não multiplicar custo das partículas sem necessidade.

Objetivo dos substeps:

- estabilidade;
- não “ultra suavidade” artificial.

---

# 15. FÍSICA INDIVIDUAL DAS PARTÍCULAS

A posição final de cada partícula não deve depender apenas de um `mix()` direto entre posição dispersa e posição do N.

Cada partícula pode ter, conceitualmente:

- posição;
- velocidade;
- target base;
- offset visual;
- fase individual;
- parâmetros mínimos necessários.

Modelo conceitual:

```js
force = (target - position) * stiffness;
velocity += force * dt;
velocity *= damping;
position += velocity * dt;
```

A implementação final pode variar, desde que mantenha o mesmo comportamento físico.

## Regra

Não permitir que a física individual destrua a leitura do N.

---

# 16. REPRESENTAÇÃO DE DADOS E PERFORMANCE

Se houver grande quantidade de partículas:

Preferir reutilização de estruturas existentes e typed arrays quando coerente com a arquitetura atual.

Evitar criação massiva de objetos temporários dentro do loop de animação.

Evitar por frame:

```js
new THREE.Vector3()
```

para cada partícula.

Reutilizar vetores temporários ou trabalhar diretamente com buffers.

Evitar garbage collection perceptível.

Não fazer refatoração total para typed arrays se o código atual já for performático e estável.

Alterar somente se o profiling ou comportamento indicar necessidade real.

---

# 17. FORMAÇÃO DO N

A sensação visual desejada permanece:

```text
partículas dispersas
↓
formação rápida porém controlada
↓
aproximação final progressivamente mais lenta
↓
assentamento
↓
N formado e vivo
```

Não existir um frame visualmente identificável como:

> “agora terminou de formar”.

A chegada deve ser contínua.

---

# 18. STAGGER

Stagger é permitido para evitar que todas as partículas cheguem no mesmo instante.

Requisitos:

- pequeno;
- pseudoaleatório/determinístico;
- não formar faixas visíveis;
- não fazer o N permanecer incompleto por muito tempo;
- não mudar a forma final.

Faixa conceitual recomendada:

```text
80–250 ms equivalentes
```

A calibração pode ser ajustada.

Não usar stagger de segundos.

---

# 19. OVERSHOOT

Overshoot é opcional.

Só aplicar se melhorar visualmente.

Se utilizado:

- individual por partícula;
- microscópico;
- aproximadamente 1–3% do deslocamento final relevante;
- sem efeito de gelatina;
- sem oscilação global.

Se a diferença for imperceptível ou piorar o comportamento, não implementar.

---

# 20. BREATHING DO N FORMADO

Quando formado, o N não deve ficar congelado.

Criar micro movimento orgânico.

Requisitos:

- amplitude muito pequena;
- baixa frequência;
- fases individuais;
- sem deslocar o N inteiro;
- sem deformar a letra;
- sem criar ruído nervoso;
- sem competir com a repulsão do mouse.

O breathing deve ser calculado como **offset de target**, nunca acumulado diretamente na posição.

Correto conceitualmente:

```js
finalTarget = baseTarget + breathingOffset;
```

Evitar:

```js
position += breathingOffset;
```

frame após frame.

---

# 21. INTERAÇÃO COM O MOUSE

O mouse deve contribuir como offset ao target final.

Arquitetura desejada:

```text
baseTarget
+ staggerOffset
+ breathingOffset
+ mouseOffset
= finalTarget
```

A física move a partícula para `finalTarget`.

Não fazer dois sistemas independentes alterando `position` diretamente.

Evitar:

```text
spring puxa
mouse altera position
spring corrige
mouse altera position
```

Isso pode causar jitter.

## Repulsão

- raio limitado;
- força suave;
- decaimento com distância;
- retorno amortecido;
- sem buracos grandes;
- sem “explosão” quando cursor entra rápido.

---

# 22. FLOW FIELD / CURL NOISE

Não implementar inicialmente.

Somente adicionar depois que o núcleo abaixo estiver estável:

- visualProgress independente;
- spring;
- damping;
- speed limit;
- deltaTime;
- física individual;
- stagger;
- breathing;
- mouse.

Se ainda houver necessidade visual, flow field/curl noise pode ser testado.

## Se implementado

A intensidade deve cair conforme a partícula se aproxima do N.

Conceitualmente:

```text
longe do target   → flow maior
médio             → flow reduzido
perto             → flow mínimo
N formado         → praticamente zero
```

Não permitir que o flow deixe as bordas do N imprecisas.

Não instalar biblioteca nova só para isso se puder ser feito com utilitário já existente ou implementação pequena.

---

# 23. MOTION BLUR / TRAILS

Não implementar por padrão nesta etapa.

Só considerar se, depois da física correta, ainda houver artefato visual de velocidade.

Não usar post-processing pesado apenas para esconder uma física ruim.

A física precisa estar correta primeiro.

---

# 24. ZONAS VISUAIS DO CICLO

As zonas abaixo continuam como referência de sensação, não como thresholds rígidos de `if`.

```text
0%–28%   formação principal
28%–42%  aproximação final
42%–62%  N formado / hold
62%–76%  preparação para saída
76%–100% dispersão principal
```

## Regra importante

Não criar transições rígidas como:

```js
if (progress > 0.42) state = 'formed';
```

se isso provocar troca brusca de velocidade.

Usar funções contínuas para peso/influência de cada comportamento.

As faixas podem ter sobreposição suave.

---

# 25. N FORMADO / HOLD

Entre aproximadamente 42%–62% do ciclo visual:

- N deve permanecer claramente reconhecível;
- não iniciar dispersão principal;
- breathing continua;
- mouse continua;
- micro movimento continua;
- partículas não ficam congeladas;
- não aumentar amplitude de movimento para “mostrar” que está vivo.

---

# 26. DISPERSÃO

A saída deve ser o inverso perceptivo da entrada:

```text
N formado
↓
preparação quase imperceptível
↓
soltura gradual
↓
dispersão mais rápida
```

Não existir um ponto perceptível de mudança instantânea de target.

---

# 27. RESIZE

Ao redimensionar a janela:

- atualizar câmera;
- atualizar aspect ratio;
- atualizar renderer;
- atualizar cálculos de viewport;
- preservar posição visual aprovada do N;
- preservar o `visualProgress` atual;
- recalcular targets se necessário;
- atualizar ScrollTrigger/medidas existentes se o projeto usar isso;
- não reiniciar toda a animação do zero.

---

# 28. VISIBILITY CHANGE

Quando a página perde e recupera foco:

- evitar `dt` gigante;
- resetar relógio temporal se necessário;
- preservar estado visual;
- não explodir partículas;
- não teleportar o N;
- não reiniciar progresso.

---

# 29. CARREGAMENTO NO MEIO DA PÁGINA

Ao atualizar a página em uma posição já avançada de scroll:

- ler o scroll atual;
- calcular o target correto;
- inicializar estado visual coerente;
- evitar começar sempre do estado disperso e correr para alcançar.

Isso vale também para:

- browser back;
- browser forward;
- restauração automática de posição;
- âncoras.

---

# 30. INPUTS DE SCROLL

Testar e respeitar diferenças entre:

- mouse wheel;
- touchpad;
- teclado;
- barra de rolagem;
- touch/mobile.

Não construir a física usando somente `wheel.deltaY` como fonte absoluta de verdade.

Preferir derivar velocidade também da mudança real de scroll ao longo do tempo.

---

# 31. MOBILE

No mobile existe momentum nativo do navegador.

Não adicionar amortecimento excessivo por cima.

Requisitos:

- resposta visual suave;
- sem atraso muito maior que desktop;
- sem bloquear touch;
- sem `preventDefault()` desnecessário;
- sem quebrar navegação vertical.

A intensidade do damping pode ser adaptada por tipo de entrada se necessário.

---

# 32. PREFERS-REDUCED-MOTION

Se o projeto já considera `prefers-reduced-motion`, respeitar.

Se não considera, pode adicionar tratamento mínimo exclusivamente para o N, sem alterar o restante do site.

Modo reduzido pode:

- diminuir breathing;
- remover overshoot;
- reduzir efeitos secundários;
- usar aproximação mais simples.

Não precisa remover completamente o N.

---

# 33. CRITÉRIOS DE ACEITE — ETAPA 4.1

A Etapa 4.1 só está concluída quando TODOS os itens abaixo forem atendidos.

## Scroll lento

- formação suave;
- boa precisão;
- sem atraso desconfortável.

## Scroll normal

- nenhuma transição bruta;
- N desacelera antes de assentar;
- N permanece visualmente formado.

## Scroll rápido

- nenhum salto entre estados;
- N não acompanha instantaneamente o target;
- limite de velocidade perceptivelmente funciona;
- página continua rolando normalmente.

## Scroll extremamente rápido

- sem teleport;
- sem partículas explodindo;
- sem travamento;
- sem bloquear scroll.

## Parada abrupta

- N termina movimento de forma natural;
- não continua por tempo excessivo.

## Inversão rápida

- mudança de direção suave;
- sem continuar longamente contra o usuário;
- sem snap.

## Mouse

- repulsão funciona;
- retorno funciona;
- sem jitter;
- N continua legível.

## Performance

- sem garbage collection perceptível;
- sem queda clara de FPS causada pela alteração;
- sem erros no console.

## Layout

- header continua correto;
- N continua na posição aprovada;
- outras seções não mudaram.

---

# 34. ORDEM DE IMPLEMENTAÇÃO OBRIGATÓRIA — ETAPA 4.1

O Antigravity deve implementar nesta ordem:

### 4.1-A — Observação e mapeamento

- identificar fluxo atual do scroll;
- identificar onde progress controla partículas;
- identificar loop de render;
- identificar normalização do mouse;
- identificar estruturas de posições/targets.

Nenhuma refatoração ainda.

### 4.1-B — Separar targetProgress de visualProgress

Somente isso.

Testar.

### 4.1-C — Controlador principal

Adicionar:

- spring;
- damping adaptativo;
- speed limit;
- proteção de inversão.

Testar.

### 4.1-D — DeltaTime e estabilidade

Adicionar:

- dt protegido;
- visibility handling;
- substeps somente se necessário.

Testar.

### 4.1-E — Física individual

Aplicar aproximação física às partículas sem alterar formato do N.

Testar.

### 4.1-F — Stagger + breathing + mouse finalTarget

Integrar offsets em um único target.

Testar.

### 4.1-G — Refinamentos opcionais

Somente se necessário:

- overshoot microscópico;
- flow field leve.

Não implementar por obrigação.

### 4.1-H — Regressão final

Executar checklist completo.

Depois parar.

Não iniciar Etapa 5 automaticamente.

---

# 35. O QUE NÃO FAZER PARA “CORRIGIR” A ETAPA 4.1

Não resolver brutalidade apenas:

- aumentando a altura da seção;
- diminuindo velocidade global;
- aumentando duration arbitrariamente;
- aplicando `ease: power4.out` em tudo;
- adicionando vários `lerp()`;
- bloqueando scroll;
- interceptando wheel;
- usando debounce grande;
- diminuindo partículas sem diagnóstico;
- adicionando motion blur para esconder problema;
- trocando toda a implementação por outra biblioteca.

Esses caminhos não tratam a causa principal.

---

# 36. CONGELAMENTO FUNCIONAL DO N APÓS A ETAPA 4.1

Depois de aprovada a Etapa 4.1:

> **A física interna do N é considerada fechada.**

Nas Etapas 5 e 6:

- não reescrever motion controller;
- não recalibrar spring sem regressão comprovada;
- não alterar zonas de formação;
- não alterar posições-alvo;
- não alterar breathing;
- não alterar stagger;
- não alterar fluxo do scroll do N;
- não alterar shape;
- não alterar densidade;
- não alterar velocidades.

---

# 37. ETAPA 5 — PRISMA

## 37.1 Objetivo

Trabalhar exclusivamente no prisma e na interação associada a ele, preservando o N integralmente.

A etapa pode envolver, conforme o projeto já planeja:

- estrutura visual do prisma;
- perspectiva;
- rotação;
- arraste;
- touch;
- inércia;
- comportamento responsivo;
- estabilidade da animação.

---

# 38. ESCOPO PERMITIDO — ETAPA 5

Alterar somente:

- arquivos do prisma;
- lógica de interação do prisma;
- CSS diretamente relacionado ao prisma;
- handlers de pointer/touch exclusivos do prisma;
- render loop do prisma, se separado;
- pequenas integrações globais estritamente necessárias para evitar conflito de input.

---

# 39. ESCOPO PROIBIDO — ETAPA 5

Não alterar:

- física do N;
- targetProgress do N;
- visualProgress do N;
- spring do N;
- damping do N;
- scroll debt do N;
- breathing do N;
- posições das partículas do N;
- desenho do N;
- header;
- hero;
- footer;
- cursor final da Etapa 6;
- textos;
- identidade visual geral.

Se houver arquivo compartilhado com o N, alterar somente o trecho necessário ao prisma e validar diff cuidadosamente.

---

# 40. INTERAÇÃO DO PRISMA

O prisma deve ter interação previsível.

## Desktop

- pointer down inicia arraste;
- pointer move rotaciona;
- pointer up encerra;
- pointer cancel encerra;
- perder captura não deve deixar drag preso;
- movimento deve considerar delta temporal/posição de forma estável.

## Touch

- evitar conflito desnecessário com scroll vertical;
- não bloquear a página inteira;
- permitir gesto planejado no prisma;
- tratar pointer cancel;
- não gerar rotação infinita após toque rápido.

---

# 41. POINTER CAPTURE — PRISMA

Se a implementação usar Pointer Events, preferir `setPointerCapture()` durante drag quando apropriado.

Objetivo:

- usuário pode começar dentro;
- mover para fora;
- terminar fora;
- interação continua corretamente;
- estado não fica preso.

Sempre liberar captura corretamente.

---

# 42. INÉRCIA — PRISMA

A inércia deve:

- refletir velocidade final do drag;
- desacelerar progressivamente;
- ter limite máximo;
- não rodar por tempo exagerado;
- não oscilar;
- parar naturalmente.

Usar `deltaTime`.

Não depender de FPS.

---

# 43. PERSPECTIVA E GEOMETRIA — PRISMA

Não alterar design aprovado sem necessidade.

Corrigir somente:

- perspectiva incorreta;
- sensação de faces desalinhadas;
- rotação em eixo errado;
- profundidade incoerente;
- origem de transformação inadequada.

Não transformar o prisma em outro elemento visual.

---

# 44. LOOP DE ANIMAÇÃO — PRISMA

Se já houver RAF global compartilhável, avaliar integração sem refatorar todo o projeto.

Se houver RAF separado, ele pode permanecer separado se não causar conflito/performance.

Não unir loops apenas por preferência arquitetural.

Não criar terceiro/quarto loop redundante sem necessidade.

---

# 45. CONFLITO PRISMA × N

Durante Etapa 5 testar:

- scroll enquanto prisma está visível;
- arraste do prisma enquanto N está em outro estado;
- pointer global;
- touch;
- performance conjunta.

O prisma não pode:

- alterar scrollProgress do N;
- alterar pointer normalizado do N de forma incompatível;
- chamar preventDefault global;
- capturar pointer fora de sua região após fim do gesto.

---

# 46. CRITÉRIOS DE ACEITE — ETAPA 5

- prisma visualmente correto;
- arraste suave;
- inércia suave;
- touch funcional;
- pointer cancel tratado;
- drag não fica preso;
- scroll da página continua funcional;
- N continua exatamente como aprovado na Etapa 4.1;
- header continua correto;
- sem erros no console;
- sem regressão visual em outras áreas.

Depois parar.

Não iniciar Etapa 6 automaticamente.

---

# 47. ETAPA 6 — CURSOR PERSONALIZADO + INTEGRAÇÃO FINAL

## 47.1 Objetivo

Finalizar:

- cursor personalizado do site;
- ocultação do cursor nativo onde apropriado;
- integração com N;
- integração com elementos interativos;
- integração com prisma;
- regressão geral desktop/mobile.

A Etapa 6 é uma etapa de **integração**, não uma nova etapa de física do N.

---

# 48. FONTE ÚNICA DE COORDENADAS DO POINTER

Deve existir uma fonte coerente de pointer.

Conceitualmente:

```text
POINTER EVENT
    ↓
rawClientX / rawClientY
    ↓
normalização única
    ├── cursor visual
    ├── N
    └── prisma, se realmente necessário
```

Não criar uma segunda fórmula de NDC só para o cursor.

Não reintroduzir eixo Y invertido incorretamente.

Não duplicar offsets inconsistentes.

---

# 49. CURSOR NATIVO

Objetivo solicitado:

> esconder o cursor nativo do computador e deixar apenas o cursor do site.

Implementar com cuidado.

## Desktop com mouse/pointer fino

Pode ocultar cursor nativo nas áreas em que o cursor customizado estiver ativo.

## Touch/mobile

Não tentar simular cursor.

Não aplicar `cursor: none` indiscriminadamente em dispositivos sem hover/pointer fino.

Usar media queries/capabilities quando necessário.

Exemplo conceitual:

```css
@media (hover: hover) and (pointer: fine) {
    /* cursor customizado */
}
```

---

# 50. FALLBACK DO CURSOR

Se JavaScript falhar ou cursor customizado não inicializar, evitar deixar o usuário sem cursor permanentemente.

Estratégia recomendada:

- classe no `<html>` ou `<body>` só é adicionada após cursor customizado iniciar corretamente;
- `cursor: none` depende dessa classe.

Assim, se JS quebrar, cursor nativo permanece.

---

# 51. MOVIMENTO DO CURSOR CUSTOMIZADO

O cursor visual deve:

- acompanhar mouse com suavidade leve;
- não ter atraso exagerado;
- não interferir no N;
- não alterar coordenadas de interação;
- usar transform em vez de top/left quando possível;
- evitar layout/reflow por frame.

Exemplo conceitual:

```text
pointer raw
↓
visual cursor target
↓
pequeno smoothing visual
↓
transform: translate3d(...)
```

A suavização visual do cursor NÃO deve alterar as coordenadas usadas pelo N.

O N usa coordenada real/normalizada apropriada.

O cursor pode usar coordenada visual suavizada.

---

# 52. ESTADOS DO CURSOR

Se o design atual prevê estados diferentes em elementos interativos, implementar apenas os já planejados.

Não inventar novos estados visuais.

Possíveis estados permitidos somente se já fizerem sentido no design:

- default;
- hover link/button;
- drag/grab no prisma.

Não criar efeitos extras como:

- partículas do cursor;
- trail grande;
- blend mode novo;
- texto seguindo cursor;
- magnetismo em botões;
- ripple global.

---

# 53. POINTER EVENTS DO CURSOR VISUAL

O elemento visual do cursor deve usar:

```css
pointer-events: none;
```

Ele nunca deve bloquear:

- links;
- botões;
- drag;
- hover;
- prisma;
- scroll.

---

# 54. CURSOR × N

A Etapa 6 não altera a física do N.

A única integração permitida é garantir que:

- N continue recebendo coordenadas corretas;
- cursor visual não bloqueie eventos;
- pointer compartilhado seja coerente;
- repulsão mantenha mesma intensidade aprovada.

Se a centralização do pointer exigir reorganização de código, preservar matematicamente o resultado existente.

---

# 55. CURSOR × PRISMA

Durante drag:

- cursor pode mudar visualmente para estado de grab/grabbing se já planejado;
- pointer capture continua funcionando;
- cursor visual não deve impedir pointer events;
- ao terminar drag fora do prisma, estado visual deve voltar ao normal.

Tratar:

- pointerup;
- pointercancel;
- lostpointercapture;
- blur/visibilitychange quando necessário.

---

# 56. ACESSIBILIDADE E INTERAÇÃO

Não remover:

- foco de teclado;
- outline funcional necessário;
- semântica de links/botões;
- navegação por teclado.

Cursor customizado não substitui estados de foco.

Não usar cursor customizado como única indicação de interatividade.

---

# 57. PERFORMANCE — ETAPA 6

Evitar múltiplos listeners redundantes de `pointermove`.

Preferir um estado global simples e consumidores leves.

Evitar atualizar DOM várias vezes no mesmo evento se RAF já pode consolidar.

Não criar objetos desnecessários por frame.

---

# 58. MOBILE — ETAPA 6

Em touch:

- cursor customizado fica desabilitado;
- cursor nativo não é ocultado de forma problemática;
- N continua funcionando sem depender de hover;
- prisma continua utilizável;
- scroll permanece natural.

---

# 59. CRITÉRIOS DE ACEITE — ETAPA 6

## Cursor

- cursor customizado aparece em desktop apropriado;
- cursor nativo fica oculto somente quando seguro;
- fallback funciona;
- sem atraso exagerado;
- sem travamentos.

## N

- física permanece idêntica à aprovada na 4.1;
- mouse continua correto;
- sem Y espelhado;
- sem mudança de força;
- sem jitter.

## Prisma

- drag continua funcional;
- pointer capture continua correto;
- cursor não bloqueia interação.

## Site

- header continua fixo;
- navegação funciona;
- botões funcionam;
- foco por teclado funciona;
- mobile funciona;
- sem erros no console.

---

# 60. CHECKLIST FINAL DE REGRESSÃO — OBRIGATÓRIO

Executar após Etapa 6.

## A. Header

- [ ] permanece fixo;
- [ ] não some;
- [ ] não cobre indevidamente o N;
- [ ] sem mudança visual inesperada.

## B. N — scroll

- [ ] scroll extremamente lento;
- [ ] scroll lento;
- [ ] scroll normal;
- [ ] scroll rápido;
- [ ] scroll extremamente rápido;
- [ ] várias scrolladas rápidas seguidas;
- [ ] parada abrupta;
- [ ] inversão imediata;
- [ ] subir rápido;
- [ ] descer rápido;
- [ ] entrar/sair várias vezes da região.

## C. N — estado formado

- [ ] permanece legível;
- [ ] breathing sutil;
- [ ] não congela;
- [ ] não vibra;
- [ ] não perde estrutura;
- [ ] não começa a dispersar cedo demais.

## D. N — mouse

- [ ] aproximação do cursor;
- [ ] cursor parado;
- [ ] movimento rápido;
- [ ] saída da área;
- [ ] retorno suave;
- [ ] sem buracos grandes;
- [ ] sem jitter.

## E. Scroll input

- [ ] mouse wheel;
- [ ] touchpad;
- [ ] teclado;
- [ ] scrollbar;
- [ ] touch/mobile.

## F. Navegador / ciclo de vida

- [ ] resize;
- [ ] trocar de aba;
- [ ] voltar para aba;
- [ ] refresh no meio da página;
- [ ] back;
- [ ] forward;
- [ ] âncora, se existente.

## G. Prisma

- [ ] drag dentro;
- [ ] drag terminando fora;
- [ ] pointer cancel;
- [ ] touch;
- [ ] inércia;
- [ ] sem drag preso;
- [ ] sem bloquear scroll.

## H. Cursor

- [ ] aparece somente em desktop apropriado;
- [ ] cursor nativo oculto corretamente;
- [ ] fallback se JS não inicializar;
- [ ] links clicáveis;
- [ ] botões clicáveis;
- [ ] prisma clicável/arrastável;
- [ ] pointer-events none;
- [ ] foco por teclado continua visível.

## I. Performance

- [ ] console sem erro;
- [ ] sem warnings novos relevantes;
- [ ] sem queda perceptível de FPS;
- [ ] sem GC/jank perceptível;
- [ ] sem loop infinito;
- [ ] sem listener duplicado óbvio.

---

# 61. REGRAS DE DEBUG

Se surgir problema durante uma etapa:

1. identificar se foi introduzido pela alteração atual;
2. não modificar outro sistema para mascarar o erro;
3. isolar causa;
4. corrigir na menor área possível;
5. repetir teste que revelou o problema;
6. executar regressão do sistema relacionado.

Não usar “tentativa e erro” alterando vários parâmetros simultaneamente.

Mudar uma categoria de comportamento por vez.

---

# 62. LOGS TEMPORÁRIOS

Logs temporários são permitidos para:

- `targetProgress`;
- `visualProgress`;
- velocity;
- direction;
- dt;
- estado de pointer;
- estado de drag.

Antes de concluir a etapa:

- remover logs temporários;
- remover overlays de debug;
- remover helpers visuais;
- não deixar flags de debug ligadas.

---

# 63. NÃO FAZER REFATORAÇÃO GLOBAL AO FINAL

Depois que tudo funcionar, não executar uma “refatoração final” ampla.

Somente:

- remover debug;
- remover código realmente morto criado pela própria etapa;
- consolidar pequenas duplicações introduzidas pela própria etapa;
- manter diffs pequenos e auditáveis.

---

# 64. FORMATO DE RELATÓRIO DO ANTIGRAVITY AO FINAL DE CADA ETAPA

O Antigravity deve responder aproximadamente assim:

```text
ETAPA X CONCLUÍDA

Arquivos alterados:
- caminho/arquivo1
- caminho/arquivo2

Alterações realizadas:
- ...
- ...

Itens deliberadamente NÃO alterados:
- ...
- ...

Testes executados:
- ...
- ...

Resultado:
- aprovado / pendência objetiva

Possíveis pontos para observar manualmente:
- ...
```

Não incluir sugestões de features extras.

Não iniciar automaticamente a etapa seguinte.

---

# 65. CRITÉRIO DE PARADA

Cada etapa termina quando seus critérios de aceite forem atingidos.

O agente deve parar e aguardar o próximo comando.

### Após Etapa 4.1

Parar com o N congelado funcionalmente para as etapas seguintes.

### Após Etapa 5

Parar com prisma concluído e N intacto.

### Após Etapa 6

Parar com integração final concluída.

---

# 66. RESUMO EXECUTIVO PARA O ANTIGRAVITY

## Etapa 4.1

Resolver a brutalidade do N em scroll normal/rápido através de:

```text
scroll real
→ targetProgress
→ motion controller único
→ visualProgress
→ física individual
→ finalTarget com breathing + mouse
→ render
```

Obrigatório:

- spring amortecido;
- damping adaptativo;
- limite de velocidade;
- dt protegido;
- reversão suave;
- sem scroll lock;
- sem vários filtros concorrentes.

Depois disso, **não mexer mais na física do N**.

## Etapa 5

Trabalhar somente no prisma.

Não tocar no N.

## Etapa 6

Implementar cursor personalizado e integração final.

Centralizar leitura do pointer sem alterar a matemática aprovada do N.

Não reescrever física do N.

---

# 67. ORDEM FINAL DAS ETAPAS

```text
ETAPA 4.1
Refinamento avançado da física do N
        ↓
APROVAÇÃO DO N
        ↓
CONGELAMENTO FUNCIONAL DO N
        ↓
ETAPA 5
Prisma
        ↓
APROVAÇÃO DO PRISMA
        ↓
ETAPA 6
Cursor + integração final
        ↓
REGRESSÃO COMPLETA
        ↓
CONCLUSÃO
```

---

# 68. INSTRUÇÃO FINAL AO ANTIGRAVITY

**Não faça nada além do que está explicitamente autorizado neste documento.**

Quando houver duas soluções técnicas possíveis:

1. escolher a que altera menos partes do projeto;
2. escolher a que preserva melhor o comportamento aprovado;
3. evitar nova dependência;
4. evitar refatoração ampla;
5. manter cada subsistema com responsabilidade clara;
6. não antecipar etapas futuras.

Se alguma melhoria não estiver prevista aqui e não for estritamente necessária para cumprir os critérios de aceite, **não implementar**.

