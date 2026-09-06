# NEOEFFEX — ETAPA 2 DA NOVA VITRINE /MODELOS

## Objetivo da etapa

A Etapa 2 deve evoluir a nova `/modelos` criada na Etapa 1, adicionando interações e transições mais experimentais sem introduzir ainda Three.js, shaders ou WebGL.

A página deve continuar rápida, clara, responsiva e coerente com a identidade Neoeffex.

O foco agora é fazer a navegação parecer mais viva e autoral.

---

# 1. Contexto obrigatório

A copy principal definida para a nova página é:

> **Seu site não precisa parecer um site.**

A direção visual já definida é:

- fundo escuro;
- azul Neoeffex como cor principal de destaque;
- tipografia grande;
- projetos ocupando boa parte da tela;
- previews em vídeo;
- GSAP;
- ScrollTrigger;
- Lenis;
- responsividade;
- `prefers-reduced-motion`.

Nesta etapa, manter exatamente essa direção.

---

# 2. Projetos que entram nesta etapa

Usar somente:

- `/modelos/hamburgueria/`
- `/modelos/clinica-odontologica/`
- `/modelos/hortifruti/`
- `/sites/lu-leve-e-saudavel/`

## NÃO incluir ainda

Não criar, exibir nem linkar:

- `/modelos/barbearia`
- `/modelos/barbearia1`

O preview da barbearia será corrigido posteriormente.

---

# 3. Objetivos visuais da Etapa 2

Adicionar:

1. cursor customizado no desktop;
2. parallax leve com mouse;
3. hover mais expressivo nos projetos;
4. mudança sutil de identidade por projeto;
5. transições mais cinematográficas entre blocos;
6. microinterações em botões e links;
7. movimento tipográfico adicional;
8. melhoria da sensação de profundidade;
9. entrada e saída mais marcante dos previews;
10. navegação visualmente mais responsiva ao usuário.

Tudo deve ser implementado sem prejudicar a leitura.

---

# 4. Cursor customizado

Criar um cursor customizado somente para dispositivos com mouse preciso.

Não usar em touch/mobile.

O cursor deve ser discreto e tecnológico.

Estado padrão:

```text
○
```

Ao passar sobre projeto:

```text
ABRIR
```

Ao passar sobre botão/link externo:

```text
↗
```

Ao passar sobre elementos arrastáveis, caso exista algum:

```text
ARRASTE
```

Não criar interação de arrastar apenas para justificar esse estado.

## Requisitos técnicos

- usar `pointer-events: none`;
- usar `requestAnimationFrame` ou GSAP para suavização;
- nunca bloquear o cursor nativo em dispositivos touch;
- respeitar `prefers-reduced-motion`;
- remover ou simplificar em telas menores que desktop;
- não criar atraso perceptível no ponteiro.

---

# 5. Parallax leve com mouse

Adicionar profundidade em alguns pontos estratégicos.

Usar valores muito pequenos.

Exemplo conceitual:

```text
texto:      2px
imagem:     4px
preview:    6px
detalhe:    10px
```

Não fazer a página inteira acompanhar o mouse.

Aplicar somente em:

- hero;
- algum elemento decorativo;
- preview principal da seção ativa;
- detalhes gráficos selecionados.

Evitar movimento em excesso.

---

# 6. Mudança de identidade por projeto

Cada projeto deve ter uma pequena mudança de atmosfera quando estiver em foco.

Não transformar completamente a página.

O objetivo é dar personalidade para cada projeto sem perder a identidade Neoeffex.

## Hamburgueria

Pode usar:

- tons quentes discretos no glow;
- contraste mais agressivo;
- sensação energética.

Nunca substituir o azul Neoeffex por completo.

## Clínica odontológica

Pode usar:

- azul mais claro;
- branco suave;
- atmosfera mais limpa;
- glow frio.

## Hortifruti

Pode usar:

- verde suave;
- detalhes orgânicos;
- gradiente levemente mais natural.

## Lu Leve e Saudável

Pode usar:

- verde claro;
- azul suave;
- contraste mais leve;
- atmosfera saudável/prática.

As mudanças podem ocorrer através de CSS variables controladas pelo projeto ativo.

Exemplo:

```css
--section-accent
--section-glow
--section-bg
```

Não duplicar grandes blocos de CSS.

---

# 7. Transições entre projetos

Os projetos não devem apenas aparecer um abaixo do outro.

Adicionar transições leves entre eles.

Exemplos permitidos:

- fade + scale;
- máscara simples com CSS;
- entrada lateral curta;
- clip-path animado;
- blur muito leve;
- passagem de linha/divisor;
- alteração de background conforme projeto ativo.

Evitar:

- transições demoradas;
- excesso de blur;
- animações que dificultem leitura;
- movimentos violentos.

---

# 8. Preview em vídeo

Manter:

- `.webm` como principal;
- `.mp4` como fallback;
- `.webp` como poster.

Adicionar comportamento mais sofisticado:

- preview pode entrar com scale muito leve;
- autoplay somente quando estiver suficientemente visível;
- pausar fora da viewport;
- usar poster antes do carregamento;
- evitar carregar todos os vídeos pesados imediatamente.

Se já houver IntersectionObserver, reaproveitar.

Melhorar para lazy behavior quando possível.

Não usar iframe dos sites nesta seção.

---

# 9. Hero — evolução da Etapa 1

Manter a copy:

> **Seu site não precisa parecer um site.**

Adicionar mais presença visual.

Possibilidades:

- palavras entrando em tempos diferentes;
- uma palavra com movimento horizontal lento;
- subtexto surgindo depois do título;
- pequeno elemento gráfico reagindo ao mouse;
- linha técnica sendo desenhada ao carregar;
- número/índice experimental no canto.

Não transformar o hero em uma animação de 10 segundos.

Ideal:

```text
0–0.8s  título
0.8–1.4s  complemento
1.2–1.8s  CTA / detalhes
```

---

# 10. Movimento tipográfico

Adicionar movimento em textos grandes de apoio.

Exemplo de seção:

```text
NÃO UM TEMPLATE.
NÃO UMA CÓPIA.
NÃO MAIS DO MESMO.
```

ou outra mensagem coerente com a copy principal.

Pode usar:

- scroll horizontal;
- reveal por linha;
- palavras alternadas;
- leve deslocamento vertical;
- máscara.

Não criar texto que pareça genérico de agência.

---

# 11. Microinterações dos botões

Melhorar botões da Etapa 1.

Adicionar:

- leve atração magnética no desktop;
- seta com deslocamento curto;
- texto podendo trocar de posição no hover;
- fundo deslizando internamente;
- borda/glow muito discreto.

O botão nunca deve “fugir” do mouse.

O magnetismo precisa ser fraco.

---

# 12. Links dos projetos

Cada projeto deve ter CTA claro.

Exemplo:

```text
Abrir projeto ↗
```

O usuário deve entender facilmente que o clique abre o projeto completo.

Nunca obrigar o usuário a descobrir que o card é clicável apenas pelo cursor.

---

# 13. Seção de encerramento

Adicionar ou evoluir uma seção final forte.

Sugestão de copy:

```text
QUAL VAI SER O SEU?
```

Subtexto possível:

```text
Seu negócio não precisa entrar em um molde.
```

CTA principal:

```text
Criar um projeto →
```

A seção pode ocupar quase uma viewport inteira.

Manter simples.

---

# 14. Background e profundidade

Adicionar profundidade ao site sem usar WebGL.

Pode usar:

- radial-gradient;
- linear-gradient;
- noise/grain sutil;
- grid técnico discreto;
- glow posicionado;
- pseudo-elements;
- máscaras CSS.

Evitar:

- background excessivamente carregado;
- muitos elementos decorativos;
- neon exagerado;
- estética “cyberpunk genérica”.

---

# 15. Performance

Obrigatório manter a página leve.

Não introduzir nesta etapa:

- Three.js;
- shaders;
- canvas pesado;
- partículas em massa;
- vídeos 4K;
- bibliotecas desnecessárias.

Manter:

- GSAP;
- ScrollTrigger;
- Lenis.

Se alguma funcionalidade puder ser feita com CSS, preferir CSS.

---

# 16. Mobile

No mobile, simplificar.

Desativar ou reduzir:

- cursor customizado;
- mouse parallax;
- magnetismo;
- hover avançado;
- efeitos dependentes de ponteiro.

Manter:

- scroll suave;
- transições de entrada;
- vídeos;
- tipografia;
- CTA;
- mudança sutil de atmosfera por projeto.

Nunca sacrificar legibilidade para preservar uma animação de desktop.

---

# 17. prefers-reduced-motion

Obrigatório.

Quando:

```css
@media (prefers-reduced-motion: reduce)
```

reduzir ou remover:

- parallax;
- cursor animado;
- magnetismo;
- movimentos longos;
- transições exageradas;
- scroll animado.

O conteúdo deve continuar totalmente acessível.

---

# 18. Estrutura de arquivos recomendada

Manter organização simples.

Exemplo:

```text
modelos/
├── index.html
├── VERSION
├── CHANGELOG.md
└── assets/
    ├── css/
    │   └── modelos.css
    ├── js/
    │   ├── modelos.js
    │   ├── cursor.js
    │   └── interactions.js
    ├── images/
    │   └── previews/
    └── videos/
        └── previews/
```

Não criar dezenas de arquivos pequenos sem necessidade.

Se o projeto atual já tiver estrutura equivalente, reaproveitar.

---

# 19. Bibliotecas

Usar somente se já estiverem instaladas ou se forem realmente necessárias:

```text
GSAP
ScrollTrigger
Lenis
```

Não instalar React.

Não migrar o projeto para outro framework.

Não adicionar Three.js nesta etapa.

---

# 20. O que NÃO fazer nesta etapa

Não:

- implementar Three.js;
- implementar GLSL;
- implementar shaders;
- criar objetos 3D;
- incluir barbearia;
- alterar os projetos internos;
- alterar o catálogo;
- alterar `/admin`;
- alterar as landings existentes;
- mudar rotas sem necessidade;
- refatorar áreas não relacionadas;
- criar sistema complexo de componentes;
- transformar tudo em React/Vue/Svelte.

---

# 21. Critérios de conclusão

A Etapa 2 só está concluída se:

- cursor customizado funcionar no desktop;
- cursor desaparecer em mobile/touch;
- mouse parallax estiver leve e controlado;
- projetos tiverem atmosfera própria;
- transições entre projetos estiverem mais fluidas;
- previews continuarem funcionando;
- WebM + MP4 + WebP continuarem corretos;
- nenhuma rota tiver sido quebrada;
- barbearia continuar fora da vitrine;
- página estiver responsiva;
- `prefers-reduced-motion` funcionar;
- não houver erro no console;
- performance continuar aceitável;
- não houver regressões na Etapa 1.

---

# 22. Como testar

Testar no mínimo:

## Desktop

```text
1920x1080
1366x768
```

Verificar:

- cursor customizado;
- hover;
- magnetismo;
- parallax;
- vídeos;
- scroll;
- troca de atmosfera;
- CTAs.

## Mobile

Testar aproximadamente:

```text
390x844
```

Verificar:

- ausência de cursor customizado;
- ausência de problemas de hover;
- texto sem corte;
- vídeo dimensionado corretamente;
- CTAs acessíveis;
- scroll sem travamento.

## Reduced motion

Ativar preferência de movimento reduzido no navegador/SO e verificar se os efeitos são removidos ou simplificados.

---

# 23. Atualização de versão

Atualizar:

```text
VERSION
CHANGELOG.md
```

Versão sugerida:

```text
v0.2.0
```

---

# 24. Commit recomendado

```text
modelos - v0.2.0 - adiciona cursor, parallax, transicoes e interacoes avancadas na vitrine
```

---

# 25. Regra final para o Antigravity

Antes de alterar qualquer arquivo:

1. analisar a implementação atual da Etapa 1;
2. reaproveitar o que já funciona;
3. evitar reescrever arquivos inteiros sem necessidade;
4. fazer alterações incrementais;
5. preservar todas as rotas e integrações existentes;
6. não modificar as landings dos projetos;
7. não incluir barbearia nesta etapa;
8. priorizar simplicidade e manutenção futura.

O objetivo da Etapa 2 é **aumentar a personalidade e a sensação de experiência**, não aumentar a complexidade técnica sem necessidade.
