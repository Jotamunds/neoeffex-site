# ETAPA 3 — /modelos Neoeffex
## 3D, WebGL e identidade visual experimental

### Objetivo da etapa

Evoluir a página `/modelos` para uma experiência visual mais experimental e tecnológica, adicionando 3D e efeitos WebGL de forma controlada, sem transformar o site em uma demonstração pesada ou prejudicar desempenho, responsividade e clareza.

A Etapa 1 criou a estrutura da nova vitrine.
A Etapa 2 adicionou profundidade, cursor, parallax, microinterações e transições.
A Etapa 3 deve adicionar uma camada visual realmente diferenciada usando 3D e WebGL.

A ideia central continua sendo:

> **Seu site não precisa parecer um site.**

A própria página `/modelos` deve demonstrar isso.

---

# 1. Escopo desta etapa

Implementar:

- Three.js
- um elemento 3D principal da Neoeffex
- interação leve com mouse
- movimento do objeto sincronizado com scroll
- iluminação e materiais coerentes com a identidade Neoeffex
- WebGL restrito a pontos específicos
- transição visual entre determinadas seções
- efeitos de distorção leves, caso não prejudiquem performance
- fallback para dispositivos sem WebGL
- carregamento progressivo/lazy
- otimização para desktop e mobile
- integração com GSAP + ScrollTrigger já existentes
- respeito a `prefers-reduced-motion`

Não transformar todas as seções em canvas.

---

# 2. Não alterar

Não modificar as landings individuais.

Não alterar:

- `/modelos/hamburgueria/`
- `/modelos/clinica-odontologica/`
- `/modelos/hortifruti/`
- `/sites/lu-leve-e-saudavel/`

A barbearia continua fora da vitrine nesta etapa.

Não adicionar:

- `/modelos/barbearia`
- `/modelos/barbearia1`

Não mexer no catálogo público ou no `/admin`.

Não reescrever a Etapa 1 ou Etapa 2 do zero.

Antes de começar, revisar o estado atual da `/modelos` e preservar tudo que já estiver funcionando.

---

# 3. Tecnologia

Usar preferencialmente:

```text
Vite
HTML
CSS
JavaScript
GSAP
ScrollTrigger
Lenis
Three.js
```

Não migrar para React.

Não adicionar frameworks sem necessidade.

Manter o número de dependências baixo.

---

# 4. Elemento 3D principal

Criar um elemento 3D associado à identidade Neoeffex.

Prioridade:

```text
símbolo / N / forma geométrica inspirada na marca
```

Se já existir um modelo `.glb` apropriado no projeto, reutilizá-lo.

Caso não exista modelo 3D, criar inicialmente uma composição geométrica simples com Three.js, sem depender de software externo.

Exemplos aceitáveis:

- losango 3D
- símbolo abstrato
- duas formas cruzadas formando uma marca
- forma metálica escura com iluminação azul
- forma translúcida/vidro sutil

Evitar:

- objetos aleatórios sem relação com a marca
- esferas genéricas apenas para preencher espaço
- excesso de partículas
- estética de “demo de Three.js”

O 3D deve parecer parte da identidade da Neoeffex.

---

# 5. Posição do 3D

O objeto principal deve aparecer preferencialmente entre:

- Hero
- transição Hero → projetos
- região visual antes da vitrine principal

Ele não deve competir com a copy:

```text
Seu site não precisa parecer um site.
```

Composição sugerida:

```text
COPY PRINCIPAL
       ↓

      [ OBJETO 3D ]

       ↓

TRANSIÇÃO PARA PROJETOS
```

Ou:

```text
COPY                3D
COPY              OBJETO
COPY                3D
```

desde que visualmente equilibrado.

---

# 6. Comportamento do objeto

Movimento padrão:

- rotação lenta contínua
- movimento vertical muito sutil
- reação leve ao cursor
- pequenas mudanças de orientação no scroll

Não usar movimento rápido.

Não fazer o objeto perseguir o cursor diretamente.

Usar interpolação suave.

Exemplo conceitual:

```text
mouse move
    ↓
target rotation
    ↓
lerp
    ↓
objeto reage lentamente
```

---

# 7. Scroll + 3D

Integrar com `ScrollTrigger`.

Durante a descida:

```text
Hero
↓
objeto aparece / ganha escala
↓
objeto gira lentamente
↓
desloca para um lado
↓
reduz opacidade ou escala
↓
transição para projetos
```

O efeito deve ajudar a narrativa da página.

Não criar rotação infinita acelerada pelo scroll.

---

# 8. Material e iluminação

Direção visual:

```text
fundo quase preto
metal escuro
azul Neoeffex
reflexos frios
luz branca suave
```

Materiais possíveis:

- `MeshStandardMaterial`
- `MeshPhysicalMaterial`

Se usar vidro/transmissão:

- manter custo de renderização controlado
- não usar configurações excessivamente caras

Iluminação sugerida:

- ambient light suave
- directional light
- 1 ou 2 point lights azuis
- rim light sutil

Evitar dezenas de luzes.

---

# 9. Canvas

O canvas WebGL deve:

- ficar restrito à área necessária
- não bloquear cliques
- não criar scroll próprio
- adaptar resolução ao dispositivo
- ter `pointer-events` configurado corretamente quando necessário

Não manter resolução absurda em telas de alta densidade.

Limitar `devicePixelRatio`.

Sugestão:

```js
renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.5)
);
```

---

# 10. Performance

Performance é requisito obrigatório.

Aplicar:

- lazy initialization
- pause de render quando o canvas estiver fora da viewport
- resize otimizado
- limitar DPR
- evitar geometria complexa
- evitar texturas 4K
- evitar vários canvases simultâneos
- usar somente um canvas principal, se possível

O loop de renderização deve poder ser pausado.

Exemplo:

```text
canvas fora da viewport
→ parar requestAnimationFrame

canvas volta
→ retomar
```

---

# 11. Mobile

Mobile não precisa reproduzir toda a experiência desktop.

No mobile:

- reduzir complexidade
- reduzir DPR
- reduzir partículas, se existirem
- remover interação de mouse
- manter rotação automática simples
- reduzir deslocamentos
- considerar substituir WebGL por imagem poster se necessário

Prioridade:

```text
estabilidade > efeito
```

Se o dispositivo for fraco, a página deve continuar utilizável.

---

# 12. Fallback

Criar fallback caso:

- WebGL não esteja disponível
- erro de carregamento
- dispositivo muito limitado
- `prefers-reduced-motion: reduce`

Fallback possível:

```text
imagem WebP / SVG / composição CSS
```

A página não pode ficar vazia se Three.js falhar.

---

# 13. Prefers Reduced Motion

Para:

```css
@media (prefers-reduced-motion: reduce)
```

reduzir ou desativar:

- reação ao mouse
- grandes movimentos
- rotação sincronizada com scroll
- transições complexas

O objeto pode permanecer estático ou com movimento mínimo.

---

# 14. Transições WebGL

Somente após o elemento 3D principal estar funcionando corretamente.

É permitido implementar no máximo 1 efeito WebGL adicional nesta etapa.

Exemplo:

- distortion leve
- dissolve
- displacement
- noise transition

Aplicação recomendada:

```text
transição entre duas áreas da página
```

Não aplicar shaders em todos os vídeos ou imagens.

---

# 15. Shaders

Shaders são opcionais nesta etapa.

Se forem usados:

- manter GLSL separado
- comentar o propósito
- usar apenas um shader simples
- evitar dependências extras

Estrutura possível:

```text
assets/
└── js/
    └── three/
        ├── scene.js
        ├── object.js
        ├── interaction.js
        └── shaders/
            ├── vertex.glsl
            └── fragment.glsl
```

Se Vite não estiver configurado para importar `.glsl`, manter shaders em strings JS ou configurar de forma simples.

---

# 16. Estrutura sugerida

Não é obrigatório copiar exatamente, mas manter separação lógica.

```text
modelos/
├── index.html
└── assets/
    ├── css/
    │   └── ...
    └── js/
        ├── ...
        └── three/
            ├── scene.js
            ├── neoeffex-object.js
            ├── interaction.js
            └── scroll-3d.js
```

Evitar colocar toda a implementação Three.js dentro de um único `main.js`.

---

# 17. Integração com Etapa 2

Preservar:

- cursor customizado
- parallax
- microinterações
- atmosfera por projeto
- transições
- previews em vídeo
- GSAP
- ScrollTrigger
- Lenis

O Three.js deve trabalhar junto com esses elementos.

Não duplicar listeners de mouse ou scroll sem necessidade.

Preferir compartilhar informações de cursor/scroll quando possível.

---

# 18. Projetos existentes

A vitrine deve continuar usando somente:

### Hamburgueria

```text
/modelos/hamburgueria/
```

### Clínica odontológica

```text
/modelos/clinica-odontologica/
```

### Hortifruti

```text
/modelos/hortifruti/
```

### Lu Leve e Saudável

```text
/sites/lu-leve-e-saudavel/
```

Barbearia continua excluída.

---

# 19. Previews

Não substituir os previews já gerados.

Manter:

```text
WebP
WebM
MP4 fallback
```

O WebGL não deve renderizar as landings dentro de texturas 3D nesta etapa.

Os vídeos continuam sendo a principal forma de demonstrar os projetos.

---

# 20. Hero

Preservar a frase principal:

```text
Seu site não precisa parecer um site.
```

O 3D deve reforçar essa ideia.

Não substituir a copy por frases genéricas como:

- “experiências digitais incríveis”
- “soluções inovadoras”
- “alta conversão”
- “design que transforma”

A personalidade da página deve continuar mais autoral.

---

# 21. Carregamento do Three.js

Não bloquear o primeiro paint.

Prioridade:

```text
HTML/CSS
↓
copy aparece
↓
página utilizável
↓
Three.js inicializa
```

Não:

```text
tela preta
↓
espera Three.js
↓
mostra página
```

Se necessário, usar import dinâmico.

---

# 22. Loader

Se o objeto 3D precisar carregar assets:

- não criar loader fullscreen
- usar placeholder discreto
- fazer fade-in do objeto quando pronto

Exemplo:

```text
forma CSS simples
↓
Three.js carrega
↓
fade entre placeholder e objeto
```

---

# 23. Console e erros

Ao final:

- nenhum erro no console
- nenhum warning crítico do Three.js
- nenhum erro 404
- nenhum GLB/textura faltando
- nenhuma animação duplicada
- nenhum loop de render continuando após sair da página

---

# 24. Testes obrigatórios

Testar em desktop:

```text
1920x1080
1366x768
```

Testar mobile:

```text
390x844
360x800
```

Testar:

- scroll rápido
- scroll lento
- resize
- reload no meio da página
- navegação por âncoras
- vídeos
- cursor
- mobile
- `prefers-reduced-motion`

---

# 25. Métrica visual

O objetivo não é:

```text
“olha, tem um objeto 3D”
```

O objetivo é:

```text
“essa página parece uma experiência criada pela Neoeffex”
```

O visitante não precisa saber que Three.js está sendo usado.

---

# 26. Critérios para considerar a Etapa 3 concluída

A etapa está concluída quando:

- Three.js estiver integrado
- existir um objeto 3D coerente com a marca
- objeto reagir de forma suave ao mouse
- objeto reagir ao scroll
- performance permanecer boa
- mobile tiver versão simplificada
- fallback funcionar
- reduced motion funcionar
- nenhuma landing individual tiver sido alterada
- barbearia continuar excluída
- não houver erros no console
- a página continuar clara e comercialmente utilizável

---

# 27. O que NÃO fazer

Não transformar `/modelos` em:

- jogo
- demo de partículas
- benchmark gráfico
- cena 3D em tela cheia sem conteúdo
- experiência que exige hardware forte

Não usar:

- bloom exagerado
- glitch constante
- chromatic aberration excessiva
- dezenas de partículas
- distorção em todos os elementos
- blur pesado em múltiplas camadas
- shader complexo sem necessidade

---

# 28. Entrega esperada do Antigravity

Ao terminar:

1. listar arquivos alterados
2. listar arquivos criados
3. informar dependências instaladas
4. explicar rapidamente a implementação Three.js
5. informar comportamento mobile
6. informar fallback
7. informar testes realizados
8. informar qualquer pendência

Não criar commit automaticamente, a menos que solicitado.

---

# 29. Instrução final para o agente

Antes de implementar:

1. leia este documento inteiro
2. revise o código atual da `/modelos`
3. revise `git diff`
4. preserve Etapas 1 e 2
5. implemente incrementalmente
6. teste após cada alteração relevante

Não reestruture o projeto inteiro sem necessidade.

A simplicidade continua sendo um requisito da Neoeffex.

A Etapa 3 deve parecer tecnologicamente avançada para o visitante, mas continuar simples o suficiente para manutenção futura.
