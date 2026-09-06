# ETAPA 3.1 — NEOEFFEX / LOGO “N” EM PARTÍCULAS 3D
## Instruções detalhadas para implementação no Antigravity IDE
### Modelo recomendado: Gemini 3.1 Pro (High)

---

# 0. CONTEXTO

A página `/modelos` da Neoeffex já possui uma direção visual escura, tecnológica e experimental.

A copy principal é:

> **Seu site não precisa parecer um site.**

A Etapa 1 estruturou a nova vitrine.
A Etapa 2 adicionou refinamentos interativos.
A Etapa 3 adicionou a base 3D / Three.js.

Nesta Etapa 3.1, o objetivo é substituir a sensação atual de “objeto 3D genérico” por um elemento visual mais autoral: o **símbolo “N” da Neoeffex formado por partículas 3D**.

A referência de sensação visual é uma apresentação premium de produto tecnológico:
- muito espaço negativo;
- fundo escuro;
- movimento suave;
- elementos altamente polidos;
- sofisticação sem excesso;
- efeito visual marcante, mas controlado;
- aparência high-end;
- sem estética de “demo genérica de Three.js”.

Não copiar nenhuma marca, site ou composição específica.
Usar apenas a ideia de uma apresentação tecnológica premium.

---

# 1. OBJETIVO PRINCIPAL

Criar um sistema de partículas 3D que:

1. utilize o “N” da Neoeffex como forma principal;
2. comece com partículas dispersas;
3. forme o N de maneira suave e cinematográfica;
4. permaneça vivo depois de formado;
5. reaja discretamente ao mouse;
6. reaja ao scroll;
7. mantenha alta qualidade visual;
8. continue leve e responsivo;
9. funcione bem em desktop;
10. tenha uma versão simplificada no mobile;
11. possua fallback caso WebGL falhe;
12. preserve toda a estrutura atual da `/modelos`.

---

# 2. ASSETS EXISTENTES

Os arquivos de logo estão em:

```text
/img/logos/
```

Já existe uma versão SVG do N preparada para este uso.

Preferir um arquivo com nome semelhante a:

```text
/img/logos/neoeffex-n-logo-white.svg
```

ou:

```text
/img/logos/neoeffex-n-particles.svg
```

Se o nome real for diferente, localizar o SVG correto em `/img/logos`.

IMPORTANTE:
- usar apenas o símbolo “N”;
- não usar a versão com texto “Neoeffex”;
- não usar versão com fundo;
- não usar versão com moldura;
- não usar logo completa com wordmark;
- o N deve ser o objeto visual principal.

Se houver múltiplos SVGs, escolher o mais limpo e recortado.

---

# 3. NÃO CRIAR GLB

Não criar `.glb`, `.fbx`, `.obj` ou outro modelo 3D.

A sensação tridimensional deve vir de:

- posição Z das partículas;
- perspectiva da câmera;
- variação de tamanho;
- shading;
- rotação suave;
- parallax;
- brilho controlado;
- profundidade aparente.

A solução deve continuar simples de manter.

---

# 4. STACK

Usar:

```text
Three.js
BufferGeometry
THREE.Points
ShaderMaterial
GSAP
ScrollTrigger
Lenis
```

Shaders GLSL simples são permitidos e recomendados.

Não adicionar:
- React
- R3F
- Cannon.js
- Ammo.js
- Rapier
- física
- engines extras
- bibliotecas pesadas de partículas

A implementação deve permanecer em JavaScript puro.

---

# 5. ARQUITETURA

Organizar a implementação em arquivos separados.

Estrutura recomendada:

```text
assets/
└── js/
    └── three/
        ├── particle-logo.js
        ├── particle-source.js
        ├── particle-interaction.js
        ├── particle-scroll.js
        └── shaders/
            ├── particles.vert
            └── particles.frag
```

Se a estrutura existente do projeto já usa outra convenção, adaptar sem reorganizar o projeto inteiro.

Evitar colocar toda a lógica em:

```text
main.js
```

---

# 6. CANVAS

Usar um único canvas WebGL para o hero.

Requisitos:

- canvas responsivo;
- sem scroll próprio;
- sem bloquear cliques;
- `pointer-events` apenas quando necessário;
- ocupar somente a área visual do hero / transição;
- não criar múltiplos renderers;
- não criar múltiplos canvases para o mesmo efeito.

O canvas deve coexistir com:
- copy;
- botões;
- navegação;
- backgrounds;
- vídeos da vitrine.

---

# 7. COMPOSIÇÃO DO HERO

Manter o texto principal à esquerda.

Composição recomendada:

```text
┌─────────────────────────────────────────────┐
│                                             │
│  COPY PRINCIPAL          N EM PARTÍCULAS    │
│  SUBTEXTO                3D / MOTION         │
│  CTA                                         │
│                                             │
└─────────────────────────────────────────────┘
```

O N:
- deve ocupar boa parte do lado direito;
- não deve encostar nas bordas;
- não deve competir com o texto;
- deve parecer leve;
- deve ter profundidade;
- deve funcionar como peça visual principal.

No mobile:
- posicionar abaixo ou atrás da copy;
- reduzir quantidade de partículas;
- reduzir profundidade e interação.

---

# 8. FORMAÇÃO DO N

O comportamento inicial deve ser:

```text
partículas dispersas
↓
movimento orgânico
↓
convergência
↓
formação do N
↓
estabilização
```

A formação deve durar aproximadamente:

```text
1.5s a 2.5s
```

Não usar entrada instantânea.

Não fazer explosão exagerada.

Não criar movimento caótico demais.

A sensação deve ser:
- controlada;
- premium;
- cinematográfica;
- suave.

---

# 9. POSIÇÕES DAS PARTÍCULAS

Criar duas posições por partícula:

```text
startPosition
targetPosition
```

`targetPosition` deve representar o N.

`startPosition` deve ser uma distribuição espacial suave.

Não criar posições aleatórias excessivamente distantes.

Preferir dispersão em torno da forma final.

Exemplo conceitual:

```text
targetPosition + random offset
```

em vez de:

```text
random em toda a tela
```

Isso reduz movimento agressivo.

---

# 10. EXTRAÇÃO DA FORMA DO SVG

A forma do N pode ser obtida por uma destas abordagens:

## Prioridade 1
Amostragem direta do SVG.

## Prioridade 2
Renderizar o SVG em canvas offscreen e ler pixels.

Pipeline sugerido:

```text
SVG
↓
canvas invisível
↓
ImageData
↓
pixels opacos
↓
amostragem
↓
posições XY
↓
normalização
↓
BufferGeometry
```

Não gerar milhares de partículas a partir de todos os pixels.

Fazer sampling.

---

# 11. QUANTIDADE DE PARTÍCULAS

Configuração inicial recomendada:

### Desktop forte
```text
4000–5000
```

### Desktop / notebook comum
```text
2800–3500
```

### Mobile
```text
1500–2000
```

Não usar dezenas de milhares.

Não usar meshes individuais.

Todas as partículas devem estar dentro de:

```text
THREE.Points
```

com:

```text
BufferGeometry
```

---

# 12. PROFUNDIDADE

O N não deve ser completamente plano.

Adicionar uma profundidade Z pequena.

Exemplo conceitual:

```text
z = random(-0.18, 0.18)
```

ou distribuição semelhante.

Partículas centrais podem ter menor variação.

Partículas periféricas podem ter um pouco mais.

O objetivo é perceber profundidade apenas quando:
- o objeto gira;
- o mouse move;
- o scroll atua.

Não transformar o logo em uma nuvem volumétrica irreconhecível.

---

# 13. CORES

O sistema deve usar a identidade Neoeffex.

Base:

```text
azul escuro profundo
```

Destaques:

```text
azul vivo
azul claro
quase branco
```

Sugestão conceitual:

```text
80% azul principal
15% azul mais claro
5% highlight quase branco
```

Não deixar o N inteiro laranja.

A cor laranja atual da página pode continuar em elementos secundários, se já fizer parte da composição, mas o N deve reforçar a identidade azul da Neoeffex.

---

# 14. SHADER DE PARTÍCULAS

Usar shader simples para elevar a qualidade.

O shader deve controlar:

- tamanho;
- opacidade;
- suavidade;
- cor;
- intensidade;
- profundidade;
- formação;
- interação.

Uniforms sugeridos:

```text
uTime
uProgress
uMouse
uResolution
uPixelRatio
uScroll
```

Não criar shader complexo demais.

---

# 15. VERTEX SHADER

O vertex shader pode:

1. interpolar `startPosition` e `targetPosition`;
2. adicionar noise suave;
3. aplicar movimento idle;
4. reagir ao mouse;
5. calcular `gl_PointSize`;
6. considerar profundidade.

Conceito:

```glsl
vec3 pos = mix(aStartPosition, position, uProgress);
```

Depois aplicar deslocamentos mínimos.

Evitar noise agressivo.

---

# 16. FRAGMENT SHADER

O fragment shader deve gerar pontos suaves.

Evitar quadrados pixelados.

Criar partículas circulares ou quase circulares.

Exemplo conceitual:

```text
gl_PointCoord
↓
distância do centro
↓
smoothstep
↓
alpha
```

As partículas podem ter:
- centro mais intenso;
- borda suave;
- glow muito pequeno.

Não criar glow enorme por partícula.

---

# 17. TAMANHO DAS PARTÍCULAS

Não usar todas com tamanho idêntico.

Variar de forma sutil.

Exemplo:

```text
70% tamanho base
20% um pouco maiores
10% highlights
```

A variação deve ajudar na percepção de profundidade.

---

# 18. ANIMAÇÃO DE FORMAÇÃO

Não criar 4000 tweens GSAP.

Criar apenas um valor global:

```text
uProgress
```

Animar:

```text
0 → 1
```

com GSAP.

O shader faz a interpolação de todas as partículas.

Isso é obrigatório para performance.

---

# 19. EASING

Usar easing suave.

Exemplos aceitáveis:

```text
power2.out
power3.out
expo.out
```

Não usar bounce.

Não usar elastic exagerado.

---

# 20. IDLE

Depois de formado, o logo nunca deve parecer completamente congelado.

Aplicar:

- micro movimento vertical;
- micro rotação;
- noise muito lento;
- respiração visual mínima.

Exemplo conceitual:

```text
rotationY ±2°
rotationX ±1°
positionY ±0.03
```

Muito sutil.

---

# 21. INTERAÇÃO COM MOUSE

Desktop apenas.

O N pode inclinar suavemente conforme o mouse.

Usar lerp.

Não mapear o mouse diretamente para rotação.

Pipeline:

```text
mouse
↓
target rotation
↓
lerp
↓
current rotation
```

Intensidade máxima recomendada:

```text
2°–5°
```

---

# 22. REPELIR PARTÍCULAS

Opcional, mas desejável.

Partículas próximas do cursor podem se afastar discretamente.

Requisitos:
- raio pequeno;
- força baixa;
- retorno suave;
- sem explosão;
- sem alterar o logo inteiro.

Essa interação deve ser percebida apenas quando o usuário presta atenção.

---

# 23. SCROLL

Integrar com ScrollTrigger.

Ao sair do hero:

```text
N começa formado
↓
inclina suavemente
↓
ganha leve profundidade
↓
parte das partículas começa a se desprender
↓
logo perde presença
↓
transição para vitrine
```

Não destruir completamente o N logo no primeiro scroll.

Não fazer rotação rápida.

---

# 24. CONEXÃO COM A VITRINE

A animação do N deve funcionar como ponte entre:

```text
Hero
↓
Experiência Neoeffex
↓
Projetos
```

A saída do N pode dissolver de forma sutil e dar lugar aos vídeos dos projetos.

---

# 25. FUNDO

Manter fundo escuro.

Aplicar camadas simples de CSS antes de pensar em WebGL:

```text
radial-gradient
linear-gradient
grid técnico discreto
halo azul
```

Exemplo:

```text
background base
+
halo difuso atrás do N
+
grid muito sutil
```

Não usar texturas 4K.

---

# 26. HALO

Atrás do N, criar um halo azul difuso.

Pode ser CSS.

Não usar PointLight pesado só para simular um background glow.

O halo deve:
- ser grande;
- suave;
- baixa opacidade;
- ajudar a separar o N do fundo.

---

# 27. GRID

O grid atual pode continuar, mas:
- diminuir contraste;
- reduzir opacidade;
- evitar linhas muito visíveis;
- manter como textura visual secundária.

---

# 28. BLOOM

Evitar pós-processamento, se possível.

Se usar bloom:
- aplicar intensidade muito baixa;
- testar impacto de performance;
- não usar bloom em mobile;
- garantir que as partículas não fiquem borradas.

Prioridade:
```text
shader bem feito > bloom
```

---

# 29. PERFORMANCE

Requisitos obrigatórios:

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
```

No mobile considerar:

```text
máximo 1.0–1.25
```

Também:
- pausar render fora da viewport;
- não recalcular geometria por frame;
- reutilizar arrays;
- evitar objetos temporários dentro do loop;
- usar uniforms;
- usar BufferAttributes;
- resize debounced ou eficiente.

---

# 30. INTERSECTION OBSERVER

Usar `IntersectionObserver` ou lógica equivalente.

Quando o hero estiver fora da viewport:

```text
pause / reduzir render
```

Quando voltar:

```text
retomar
```

Não manter GPU ocupada sem necessidade.

---

# 31. MOBILE

No mobile:

- reduzir partículas;
- remover interação de mouse;
- reduzir Z;
- reduzir movimento;
- reduzir DPR;
- evitar bloom;
- manter formação;
- manter rotação idle mínima;
- manter boa leitura da copy.

Se o device for fraco:
- usar SVG estático como fallback.

---

# 32. PREFERS-REDUCED-MOTION

Se:

```css
@media (prefers-reduced-motion: reduce)
```

Então:

- não dispersar partículas de forma intensa;
- reduzir formação;
- remover interação;
- remover rotação;
- remover dissolução por scroll;
- manter N praticamente estático.

Pode mostrar o N como SVG com glow CSS.

---

# 33. FALLBACK

Fallback obrigatório.

Se:
- WebGL não suportado;
- Three.js falhar;
- shader falhar;
- device considerado fraco;

mostrar:

```text
SVG do N
+
halo CSS
+
micro fade-in
```

A página nunca pode ficar vazia.

---

# 34. ACESSIBILIDADE

O canvas é decorativo.

Usar:

```html
aria-hidden="true"
```

quando aplicável.

Não depender do canvas para transmitir informação essencial.

A copy deve continuar em HTML.

---

# 35. RESIZE

Ao redimensionar:

- atualizar câmera;
- atualizar renderer;
- atualizar uniform `uResolution`;
- manter proporção;
- recalcular apenas o necessário;
- não recriar toda a geometria.

---

# 36. CLEANUP

Se houver lifecycle/teardown:

- remover listeners;
- remover observers;
- cancelar RAF;
- `dispose()` em:
  - geometry
  - material
  - renderer
  - textures, se houver

Evitar vazamento de memória.

---

# 37. NÃO FAZER

Não:
- colocar partículas em tela inteira;
- usar 20.000+ partículas;
- usar física;
- fazer explosões;
- usar glitch constante;
- usar chromatic aberration forte;
- usar bloom exagerado;
- fazer mouse interaction agressiva;
- usar cores aleatórias;
- adicionar vários canvases;
- adicionar modelo 3D genérico;
- criar um N metálico pesado;
- esconder a copy atrás do efeito;
- sacrificar performance por detalhe invisível.

---

# 38. RESULTADO VISUAL ESPERADO

O usuário deve perceber:

> “isso é uma marca tecnológica premium”

e não:

> “isso é uma demo de partículas”

O N deve continuar reconhecível durante todo o idle.

A animação deve parecer refinada.

---

# 39. TESTES

Testar em:

### Desktop
```text
1920x1080
1440x900
1366x768
```

### Mobile
```text
390x844
360x800
```

Testar:
- reload;
- entrada;
- mouse;
- scroll;
- voltar ao hero;
- resize;
- aba em background;
- reduced motion;
- WebGL disabled/fallback;
- console.

---

# 40. MÉTRICAS PRÁTICAS

Objetivo aproximado:

```text
Desktop:
45–60 fps

Notebook comum:
40–60 fps

Mobile:
30–60 fps
```

Não é necessário manter 60 fps absoluto se visualmente estável.

Prioridade:
```text
fluidez perceptível
```

---

# 41. LOGS

Não deixar `console.log` de debug em produção.

Erros devem ser tratados.

Se o SVG não carregar:
- ativar fallback;
- não quebrar a página.

---

# 42. ORDEM DE IMPLEMENTAÇÃO

## Passo 1
Revisar `/modelos` atual.

## Passo 2
Localizar SVG em `/img/logos`.

## Passo 3
Criar canvas e scene.

## Passo 4
Criar amostragem do SVG.

## Passo 5
Criar BufferGeometry.

## Passo 6
Criar shader.

## Passo 7
Criar formação 0→1.

## Passo 8
Adicionar idle.

## Passo 9
Adicionar mouse.

## Passo 10
Adicionar scroll.

## Passo 11
Criar mobile simplificado.

## Passo 12
Criar fallback.

## Passo 13
Otimizar.

## Passo 14
Testar.

---

# 43. CRITÉRIOS DE ACEITAÇÃO

Considerar concluído somente quando:

- N reconhecível;
- formação funcionando;
- partículas leves;
- alta qualidade;
- sem serrilhado grosseiro;
- mouse suave;
- scroll suave;
- sem conflito com Lenis;
- sem conflito com ScrollTrigger;
- mobile estável;
- fallback funcional;
- reduced motion funcional;
- sem erros no console;
- sem alteração nas landings individuais;
- sem alteração no catálogo;
- sem alteração no admin.

---

# 44. ARQUIVOS QUE NÃO DEVEM SER ALTERADOS

Não alterar arquivos das landings individuais.

Não alterar conteúdo dentro de:

```text
/modelos/hamburgueria/
/modelos/clinica-odontologica/
/modelos/hortifruti/
/sites/lu-leve-e-saudavel/
```

A barbearia continua fora.

---

# 45. ROTA DA LU

A rota correta é:

```text
/sites/lu-leve-e-saudavel/
```

Não trocar por:

```text
/modelos/lu-leve-e-saudavel/
```

---

# 46. VERSIONAMENTO

Esta implementação é uma evolução da Etapa 3.

Sugestão de versão:

```text
/modelos = v0.3.1
```

Commit sugerido:

```text
modelos - v0.3.1 - adiciona N da Neoeffex em partículas 3D com Three.js
```

Não criar commit automaticamente, salvo se solicitado.

---

# 47. ENTREGA DO ANTIGRAVITY

Ao terminar, responder com:

1. resumo do que foi feito;
2. arquivos criados;
3. arquivos alterados;
4. dependências instaladas;
5. quantidade de partículas desktop/mobile;
6. estratégia de performance;
7. fallback;
8. comportamento com reduced motion;
9. testes realizados;
10. eventuais pendências.

---

# 48. INSTRUÇÃO PARA GEMINI 3.1 PRO HIGH

Antes de escrever código:

1. leia este arquivo inteiro;
2. revise os arquivos atuais;
3. revise a implementação existente de Three.js;
4. identifique o canvas já existente;
5. identifique possíveis conflitos;
6. preserve o que estiver funcionando;
7. implemente incrementalmente.

Não reescreva toda a página sem necessidade.

Não simplifique o efeito visual por conveniência.

Não troque o conceito por um objeto 3D genérico.

O objetivo é implementar **um sistema de partículas visualmente premium, autoral e leve**.

Use raciocínio técnico profundo para:
- performance;
- shaders;
- geometry;
- sampling;
- responsividade;
- sincronização com GSAP;
- compatibilidade mobile.

O resultado precisa ter aparência high-end, mas arquitetura simples de manter.

---

# 49. PRIORIDADE FINAL

A ordem de prioridade é:

```text
1. qualidade visual
2. fluidez
3. identidade Neoeffex
4. clareza da copy
5. responsividade
6. manutenção simples
7. efeitos extras
```

Se um efeito extra prejudicar performance ou leitura:
**remover o efeito extra.**

O N em partículas é o protagonista visual.
