# ETAPA 3.2 — REFINAMENTO DO N EM PARTÍCULAS 3D
## Neoeffex / `/modelos`
### Instruções detalhadas para Antigravity IDE
### Modelo recomendado: Gemini 3.1 Pro (High)

---

# 0. CONTEXTO

A Etapa 3.1 implementou o símbolo “N” da Neoeffex com partículas 3D usando Three.js.

O conceito está correto, mas o primeiro resultado visual ficou excessivamente brilhante e volumoso, parecendo uma nuvem de energia / bolhas luminosas em vez de uma escultura digital premium formada por partículas.

A Etapa 3.2 deve **refinar a implementação existente**, sem reconstruir a página do zero.

A direção desejada é:

- símbolo N perfeitamente reconhecível;
- partículas menores e mais numerosas;
- muito menos branco;
- brilho controlado;
- silhueta precisa;
- profundidade 3D sutil;
- movimento premium;
- muito espaço visual para o N;
- N grande, inteiro e nunca cortado;
- visual high-end;
- performance preservada.

---

# 1. OBJETIVO PRINCIPAL

Corrigir e elevar a implementação atual do N em partículas.

O resultado final deve parecer:

> uma escultura digital formada por milhares de pontos luminosos microscópicos.

Não deve parecer:

> uma nuvem de plasma, energia, fumaça, bolhas ou explosão luminosa.

---

# 2. NÃO REFAZER A ETAPA 3.1 DO ZERO

Antes de alterar código:

1. revisar a implementação existente;
2. localizar o canvas atual;
3. localizar o BufferGeometry;
4. localizar os shaders;
5. localizar uniforms;
6. localizar lógica de formação;
7. localizar mouse interaction;
8. localizar scroll interaction;
9. localizar fallback;
10. revisar `git diff`.

Preservar o que estiver funcionando.

Corrigir incrementalmente.

---

# 3. PROBLEMAS VISUAIS ATUAIS

O resultado atual apresenta alguns problemas claros:

- partículas grandes demais;
- glow excessivo;
- branco estourado;
- centro da forma muito claro;
- perda da silhueta do N;
- sobreposição excessiva;
- sensação de “bolhas”;
- profundidade visual pouco refinada;
- forma excessivamente volumosa;
- pouco respiro ao redor do símbolo.

Todos esses pontos devem ser tratados nesta etapa.

---

# 4. PRIORIDADE VISUAL

A ordem de prioridade deve ser:

```text
1. silhueta do N
2. precisão das partículas
3. densidade
4. profundidade
5. cor
6. highlight
7. glow
8. efeitos extras
```

O glow nunca deve ser usado para “criar” o N.

O N precisa estar bonito mesmo com bloom desligado.

---

# 5. TAMANHO DAS PARTÍCULAS

Reduzir significativamente o tamanho das partículas.

Se o ponto atual estiver muito grande, reduzir aproximadamente:

```text
50% a 70%
```

como ponto inicial de teste.

Faixa visual recomendada:

```text
base point size:
3.5 a 5.5
```

Highlights:

```text
5.5 a 7.0
```

Ajustar conforme projeção/câmera.

Não usar partículas gigantes.

---

# 6. QUANTIDADE DE PARTÍCULAS

Aumentar a densidade em vez do tamanho.

Configuração recomendada:

## Desktop forte

```text
5000–7000
```

## Notebook / desktop intermediário

```text
3500–5000
```

## Mobile

```text
2000–3000
```

Se necessário, adaptar dinamicamente por largura / capacidade.

Não usar dezenas de milhares.

Continuar usando:

```text
THREE.Points
BufferGeometry
```

---

# 7. SILHUETA DO N

O N deve permanecer perfeitamente reconhecível.

Regra obrigatória:

> olhando de frente, o símbolo deve preservar a forma original do SVG.

Evitar jitter alto em X/Y.

Recomendação:

```text
X jitter: mínimo
Y jitter: mínimo
Z jitter: moderado
```

Exemplo conceitual:

```js
x += random(-0.01, 0.01);
y += random(-0.01, 0.01);
z += random(-0.10, 0.14);
```

Os valores exatos devem ser adaptados à escala da cena.

---

# 8. PROFUNDIDADE 2.5D

A sensação 3D deve existir principalmente no eixo Z.

Objetivo:

- frontalmente: N preciso;
- em inclinação: profundidade visível;
- em idle: volume sutil;
- no scroll: profundidade perceptível.

Não transformar o N em uma nuvem espessa.

Profundidade recomendada:

```text
aprox. ±0.10 a ±0.18
```

dependendo da escala.

---

# 9. REDUZIR O BRANCO

O branco atual está excessivo.

Nova distribuição visual sugerida:

```text
70% azul escuro
20% azul principal/vivo
8% azul claro
2% quase branco
```

O branco deve ser reservado para highlights.

Não deixar grandes áreas totalmente brancas.

---

# 10. PALETA

Usar a identidade azul da Neoeffex.

Sugestão conceitual:

```text
azul escuro profundo
azul Neoeffex
azul elétrico controlado
azul claro
quase branco
```

O sistema deve parecer tecnológico e elegante.

Evitar:
- ciano exagerado;
- branco puro dominante;
- arco-íris;
- variações aleatórias demais.

---

# 11. GLOW

Reduzir radicalmente o glow.

O objetivo é:

```text
partícula nítida
+
halo mínimo
```

Não:

```text
partícula invisível dentro de um halo enorme
```

Primeiro testar com bloom desligado.

Depois, se necessário, adicionar brilho mínimo.

---

# 12. BLOOM

A Etapa 3.2 deve começar com bloom desligado ou quase zerado.

Se o resultado ficar bom sem bloom, manter assim.

Se usar bloom:

- intensidade baixa;
- threshold controlado;
- radius pequeno;
- desativar no mobile;
- não estourar branco;
- não borrar a silhueta.

Regra:

```text
shader bem feito > bloom
```

---

# 13. FRAGMENT SHADER

As partículas devem ser círculos suaves e precisos.

Usar `gl_PointCoord`.

Exemplo conceitual:

```glsl
float d = distance(gl_PointCoord, vec2(0.5));
float alpha = 1.0 - smoothstep(0.25, 0.5, d);
```

Pode haver um centro discretamente mais forte.

Evitar:
- círculos fofos enormes;
- halos opacos;
- borda grossa;
- glow ocupando todo o sprite.

---

# 14. VERTEX SHADER

O vertex shader deve continuar controlando:

- `uProgress`;
- profundidade;
- idle;
- mouse;
- scroll;
- point size.

A variação de tamanho deve considerar profundidade.

Partículas mais próximas:

```text
ligeiramente maiores
```

Partículas mais distantes:

```text
ligeiramente menores
```

Diferença sutil.

---

# 15. VARIAÇÃO DE TAMANHO

Sugestão:

```text
70% base
20% +10% a +20%
8% highlights
2% especiais
```

Não usar random extremo.

---

# 16. HIGHLIGHT DINÂMICO

Adicionar um highlight móvel em vez de deixar o N todo branco.

Conceito:

```text
faixa de luz atravessa lentamente o N
```

Pode ser baseado em:

- posição X;
- posição Y;
- combinação X/Y;
- tempo.

Exemplo conceitual:

```glsl
float sweep = smoothstep(...);
```

O highlight deve atravessar o símbolo a cada alguns segundos.

Movimento lento.

Sem piscar.

---

# 17. HIGHLIGHT — INTENSIDADE

O highlight deve afetar apenas uma faixa pequena da forma.

Exemplo visual:

```text
N escuro
↓
faixa azul clara
↓
volta ao azul
```

Não transformar toda a forma em branco.

---

# 18. IDLE

Depois da formação:

- micro rotação;
- micro deslocamento vertical;
- noise muito suave;
- profundidade sutil.

Sugestão:

```text
rotationX: ±1°
rotationY: ±2°
positionY: mínimo
```

O N deve parecer vivo sem ficar “boiando”.

---

# 19. MOUSE

Mouse no desktop:

```text
inclinação suave
```

Máximo sugerido:

```text
X: ±2°
Y: ±3°
```

Usar `lerp`.

Não alterar drasticamente tamanho dos pontos.

Não aumentar glow quando mouse se move.

---

# 20. REPELIR PARTÍCULAS

Se já existir repel:

- reduzir força;
- reduzir raio;
- reduzir deslocamento;
- retorno suave.

O efeito deve ser discreto.

Não permitir que a forma do N se desfaça.

---

# 21. SCROLL

No scroll, preservar legibilidade do N durante boa parte da transição.

Sequência sugerida:

```text
N formado
↓
inclinação leve
↓
deslocamento controlado
↓
algumas partículas se desprendem
↓
fade/dissolve leve
↓
entra vitrine
```

Não explodir o N.

---

# 22. ÁREA VISUAL DO N

O N deve ter muito mais espaço na página.

Ele deve ser tratado como protagonista visual.

No desktop, reservar:

```text
54% a 60% da largura útil do hero
```

para o bloco visual.

A copy pode ocupar:

```text
40% a 46%
```

Ajustar conforme breakpoint.

---

# 23. ALTURA DO BLOCO DO N

O bloco visual deve aproveitar a altura disponível.

Sugestão:

```text
70vh a 88vh
```

no desktop.

Não precisa usar exatamente esses valores se a composição ficar melhor, mas o N não deve ficar em uma caixa pequena.

---

# 24. NUNCA CORTAR O N

Regra obrigatória:

> o N precisa caber inteiro na área visível do hero.

Não pode haver crop em:

- topo;
- baixo;
- esquerda;
- direita.

Mesmo durante resize.

Mesmo em notebook.

Mesmo em telas 16:9.

---

# 25. MARGEM DE SEGURANÇA

Manter margem interna.

Sugestão:

## Desktop

```text
6%–10%
```

## Tablet

```text
8%–12%
```

## Mobile

```text
10%–14%
```

O símbolo deve parecer grande, mas respirar.

---

# 26. ESCALA DO N

O N deve ocupar aproximadamente:

```text
80%–90%
```

da área útil do canvas.

A escala deve ser calculada para:

```text
contain
```

e não:

```text
cover
```

Prioridade:

```text
N inteiro > preencher 100% do bloco
```

---

# 27. CÂMERA

Ajustar câmera para garantir contain do símbolo.

Se necessário:

- recalcular distância;
- ajustar FOV;
- ajustar escala do Points;
- usar bounding box.

Evitar escala fixa que funcione apenas em uma resolução.

---

# 28. FIT DINÂMICO

Criar lógica responsiva baseada em:

- viewport;
- proporção do container;
- bounding box do N.

Objetivo:

```text
fit automático
```

O N deve usar o máximo de área possível sem cortar.

---

# 29. BOUNDING BOX

Após gerar target positions:

- calcular min X;
- max X;
- min Y;
- max Y;
- width;
- height;
- center.

Centralizar a geometria.

Depois calcular escala.

Isso evita posicionamento manual frágil.

---

# 30. COMPOSIÇÃO DESKTOP

Estrutura recomendada:

```text
hero
├── copy
└── visual
    └── canvas
        └── N
```

Visual deve poder ser maior que copy.

O canvas não deve ficar restrito à largura do texto.

---

# 31. COMPOSIÇÃO MOBILE

No mobile:

- copy primeiro;
- N abaixo ou como segundo bloco;
- N inteiro visível;
- altura suficiente;
- sem crop;
- menos partículas;
- menos profundidade;
- menos interação.

Sugestão de altura visual:

```text
42vh–55vh
```

ajustável.

---

# 32. FUNDO DO HERO

Manter fundo escuro.

Elementos recomendados:

- grid discreto;
- halo azul;
- gradiente escuro;
- partículas soltas mínimas.

O halo deve ajudar a destacar o N.

---

# 33. HALO DE FUNDO

Usar CSS sempre que possível.

Exemplo conceitual:

```css
radial-gradient(
    circle,
    rgba(..., 0.12),
    transparent 65%
)
```

Não usar glow branco.

---

# 34. GRID

Reduzir se estiver muito visível.

O grid deve ser quase percebido subconscientemente.

Ele não deve competir com o N.

---

# 35. PERFORMANCE

Continuar com:

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
```

Mobile:

```text
1.0–1.25
```

Pausar canvas fora da viewport.

Evitar recomputação por frame.

---

# 36. PARTICLE COUNT RESPONSIVO

Criar regra simples.

Exemplo:

```text
width >= 1600 → 6000
width >= 1100 → 4500
width >= 768 → 3500
mobile → 2200
```

Pode adaptar.

Não fazer detecção complexa de hardware sem necessidade.

---

# 37. PREFERS REDUCED MOTION

Quando ativo:

- reduzir formação;
- remover repel;
- remover sweep intenso;
- remover rotação significativa;
- manter N estável;
- fallback SVG permitido.

---

# 38. FALLBACK

Continuar usando:

```text
SVG do N
+
halo CSS
```

Se WebGL falhar.

O fallback deve ocupar a mesma área grande.

Não mostrar SVG minúsculo.

---

# 39. ACESSIBILIDADE

Canvas decorativo:

```html
aria-hidden="true"
```

Copy permanece HTML.

---

# 40. NÃO ALTERAR COPY

Manter:

> Seu site não precisa parecer um site.

Não reescrever a headline nesta etapa.

---

# 41. NÃO ALTERAR LANDINGS

Não alterar:

```text
/modelos/hamburgueria/
/modelos/clinica-odontologica/
/modelos/hortifruti/
/sites/lu-leve-e-saudavel/
```

Barbearia continua fora.

---

# 42. NÃO ALTERAR OUTROS SISTEMAS

Não alterar:

```text
/admin
/catalogo
Supabase
autenticação
sistema de pedidos
```

---

# 43. ORDEM DE CORREÇÃO

Implementar nesta ordem:

## 1
Reduzir tamanho das partículas.

## 2
Aumentar densidade.

## 3
Corrigir silhueta.

## 4
Reduzir jitter XY.

## 5
Ajustar profundidade Z.

## 6
Reduzir branco.

## 7
Desligar / reduzir glow.

## 8
Revisar fragment shader.

## 9
Adicionar highlight móvel.

## 10
Aumentar área visual.

## 11
Criar fit automático.

## 12
Testar breakpoints.

## 13
Revisar performance.

---

# 44. CHECKPOINT VISUAL 1

Antes de adicionar highlight, testar:

```text
N azul
partículas pequenas
sem bloom
sem sweep
```

Se não estiver bonito assim, NÃO avançar.

Corrigir forma primeiro.

---

# 45. CHECKPOINT VISUAL 2

Depois:

```text
profundidade
idle
mouse
```

Se o N deixar de ser reconhecível, reduzir efeitos.

---

# 46. CHECKPOINT VISUAL 3

Depois adicionar:

```text
highlight sweep
```

Se ficar exagerado, reduzir.

---

# 47. CHECKPOINT VISUAL 4

Somente no fim testar bloom.

Bloom é opcional.

Se piorar, remover.

---

# 48. TESTES OBRIGATÓRIOS

Desktop:

```text
1920x1080
1600x900
1440x900
1366x768
```

Mobile:

```text
430x932
390x844
360x800
```

Testar:

- reload;
- resize;
- zoom 100%;
- scroll;
- mouse;
- retorno ao topo;
- aba background;
- reduced motion;
- fallback;
- console.

---

# 49. CRITÉRIOS DE ACEITAÇÃO

A Etapa 3.2 estará concluída quando:

- N estiver perfeitamente reconhecível;
- partículas estiverem pequenas;
- densidade estiver alta;
- branco não dominar;
- glow estiver controlado;
- sem efeito de “bolha”;
- profundidade 3D estiver visível, mas sutil;
- highlight móvel estiver elegante;
- N ocupar uma área grande;
- N não for cortado;
- desktop estiver equilibrado;
- mobile estiver estável;
- performance continuar boa;
- fallback funcionar;
- console estiver limpo.

---

# 50. RESULTADO FINAL ESPERADO

Visualmente:

```text
fundo escuro
+
grid quase invisível
+
halo azul suave
+
N grande
+
milhares de partículas finas
+
profundidade mínima
+
highlight elegante
+
movimento quase imperceptível
```

A percepção deve ser:

> “produto digital premium”

e não:

> “efeito especial chamativo”.

---

# 51. VERSÃO

Sugestão:

```text
/modelos = v0.3.2
```

Commit recomendado:

```text
modelos - v0.3.2 - refina N em partículas, glow, densidade e escala do hero
```

Não criar commit automaticamente, salvo solicitação.

---

# 52. ENTREGA DO ANTIGRAVITY

Ao terminar, informar:

1. arquivos alterados;
2. arquivos criados;
3. particle count final desktop;
4. particle count final mobile;
5. point size final;
6. profundidade Z usada;
7. se bloom foi mantido ou removido;
8. estratégia de fit;
9. comportamento mobile;
10. testes realizados;
11. pendências.

---

# 53. INSTRUÇÃO FINAL PARA GEMINI 3.1 PRO HIGH

Use esta etapa como **refinamento de alta qualidade**, não como nova implementação.

Preserve a arquitetura atual.

Priorize:

```text
silhueta
↓
precisão
↓
densidade
↓
profundidade
↓
luz
↓
efeitos
```

Não aceite um resultado apenas “funcional”.

O N deve se tornar o principal elemento visual da página e precisa ter qualidade suficiente para representar a identidade da Neoeffex.
