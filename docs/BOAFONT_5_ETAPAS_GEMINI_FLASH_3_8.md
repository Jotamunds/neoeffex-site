# BOAFONT — 5 ETAPAS DE REFINAMENTO PARA GEMINI FLASH 3.8

## Contexto do projeto

Esta landing page é um modelo demonstrativo da Neoeffex para a Boafont e deve continuar publicada em:

`/modelos/boafont/`

Rota final esperada:

`https://neoeffex.com.br/modelos/boafont/`

Estrutura atual esperada:

```text
modelos/
└── boafont/
    ├── index.html
    ├── VERSION
    ├── CHANGELOG.md
    ├── README.md
    ├── GEMINI.md
    ├── assets/
    │   ├── css/
    │   │   └── boafont.css
    │   ├── js/
    │   │   └── boafont.js
    │   └── img/
    │       ├── hero.png
    │       ├── van.png
    │       ├── stock.png
    │       └── facade.png
    └── reference/
        └── open-design-final.png
```

A base visual veio do Open Design e já recebeu uma primeira camada extra de animações.

---

# REGRAS GERAIS — NÃO IGNORAR

Antes de alterar qualquer arquivo:

1. Leia:
   - `/GEMINI.md`
   - `/modelos/GEMINI.md`
   - `/modelos/boafont/GEMINI.md`
   - `/modelos/boafont/README.md`
   - `/modelos/boafont/CHANGELOG.md`

2. Trabalhe **somente em `/modelos/boafont/`**, exceto se uma etapa pedir explicitamente outra coisa.

3. Não altere outras landings em `/modelos/`.

4. Não remova as animações atuais.

5. Não substitua efeitos atuais por versões mais simples apenas para facilitar implementação.

6. Novas animações devem complementar as atuais.

7. Preserve o funcionamento da página em:
   - desktop;
   - tablet;
   - mobile;
   - mouse;
   - touch.

8. Todas as animações relevantes devem respeitar:

```css
@media (prefers-reduced-motion: reduce)
```

9. Não adicionar framework apenas para efeitos visuais.
   - HTML;
   - CSS;
   - JavaScript puro;

são suficientes para estas etapas.

10. Não duplicar o sistema de catálogo Neoeffex dentro da landing.

11. Qualquer visualização de produtos nesta página será apenas uma **prévia comercial**.

12. O botão de catálogo deve continuar preparado para apontar ao catálogo oficial Neoeffex.

13. Não inventar:
   - anos de mercado;
   - quantidade de clientes;
   - número de entregas;
   - prêmios;
   - área de atendimento;
   - marcas comercializadas;
   - preços;
   - prazos;
   - frete grátis;
   - garantias;
   - qualquer informação empresarial não confirmada.

14. Pode usar informações visualmente comprovadas pelas imagens, como:
   - unidade física;
   - estoque de galões;
   - veículo identificado;
   - atuação com água mineral;
   - presença em Cotia, se já estiver no conteúdo atual.

15. Não apagar conteúdos bons que já existem apenas para recriar a seção do zero.

16. Priorizar refinamento progressivo.

17. Não transformar o site em um template genérico de cards.

18. Evitar excesso de:
   - caixas;
   - bordas;
   - grids repetidos;
   - cards iguais;
   - ícones genéricos.

19. A identidade deve continuar baseada em:
   - azul;
   - azul-marinho;
   - branco;
   - laranja;
   - água;
   - operação real da Boafont.

20. O site precisa parecer um projeto feito especificamente para a Boafont.

---

# FLUXO OBRIGATÓRIO DE EXECUÇÃO

Execute **uma etapa por vez**.

Ao concluir cada etapa:

1. não inicie automaticamente a próxima;
2. faça uma revisão visual;
3. teste responsividade;
4. verifique console;
5. informe os arquivos alterados;
6. resuma o que mudou;
7. informe como testar;
8. sugira um commit;
9. aguarde autorização para continuar.

Não faça as cinco etapas em uma única alteração.

---

# ETAPA 1 — GALERIA REAL DA BOAFONT E COMPOSIÇÃO FOTOGRÁFICA

## Objetivo

Transformar as fotografias reais da empresa em uma das partes mais fortes da landing.

Atualmente existem quatro imagens reais:

```text
assets/img/hero.png
assets/img/van.png
assets/img/stock.png
assets/img/facade.png
```

A página não deve tratar essas imagens apenas como decoração.

Elas devem transmitir:

- empresa real;
- estrutura física;
- operação;
- estoque;
- identidade própria;
- confiança.

---

## Alteração principal

Criar ou refinar uma seção fotográfica editorial.

A composição deve evitar um grid comum de três cards iguais.

Referência conceitual:

```text
────────────────────────────────────────────

ESTRUTURA REAL

Água, estoque e atendimento
em um só lugar.

            [ FACHADA GRANDE ]

[ VEÍCULO ]               [ ESTOQUE ]

────────────────────────────────────────────
```

A composição pode ser assimétrica.

No desktop:

- `facade.png` deve ter protagonismo;
- `van.png` e `stock.png` podem funcionar como imagens auxiliares;
- as imagens podem se sobrepor levemente;
- usar profundidade e espaçamento generoso.

No mobile:

- remover sobreposições complexas;
- manter leitura vertical;
- preservar recortes importantes das fotografias.

---

## Textos possíveis

Não precisa usar exatamente estes textos, mas preserve a ideia:

### Eyebrow

`ESTRUTURA REAL`

### Título

`Água, estoque e atendimento em um só lugar.`

### Apoio

`Uma operação física em Cotia preparada para atender diferentes necessidades de compra.`

### Pequenas legendas

**Fachada**

`Uma operação local, com endereço e estrutura própria.`

**Veículo**

`Atendimento apoiado por veículo identificado da Boafont.`

**Estoque**

`Galões organizados para diferentes volumes de pedido.`

Não criar alegações além do que pode ser visto ou já existe no projeto.

---

## Animações

Adicionar animações específicas para a galeria.

### Desktop

Ao entrar na viewport:

1. título aparece;
2. fachada entra com:
   - opacity;
   - pequeno scale;
   - translateY;
3. veículo entra alguns milissegundos depois;
4. estoque entra por último.

Ao mover o mouse:

- permitir profundidade muito discreta;
- máximo de poucos pixels;
- evitar efeito 3D exagerado.

No hover:

- foto ganha leve escala;
- overlay/legenda fica mais visível;
- demais fotografias podem reduzir muito levemente a presença.

---

## Scroll

Adicionar parallax sutil e independente.

Exemplo:

- fachada: movimento quase imperceptível;
- veículo: movimento ligeiramente diferente;
- estoque: outro deslocamento curto.

Não ultrapassar aproximadamente 15–30 px de deslocamento total.

---

## Requisitos técnicos

- imagens com `object-fit: cover`;
- usar `object-position` específico se necessário;
- não distorcer proporção;
- `loading="lazy"` nas imagens fora do hero;
- manter `decoding="async"`;
- manter alt text adequado;
- evitar layout shift;
- não criar dependência de biblioteca externa.

---

## Critérios de conclusão

A etapa só está concluída se:

- as fotos forem uma parte marcante da landing;
- não parecerem apenas três cards;
- nenhum texto importante estiver ilegível;
- hover não causar pulos de layout;
- parallax não prejudicar mobile;
- `prefers-reduced-motion` funcionar;
- não houver scroll horizontal.

---

## Versão sugerida

`v0.1.2`

## Commit sugerido

```text
boafont - v0.1.2 - transforma fotos reais em composição editorial animada
```

---

# ETAPA 2 — PRÉVIA DE PRODUTOS E CATÁLOGO

## Objetivo

Fazer o visitante entender rapidamente o que pode encontrar na Boafont antes de abrir o catálogo.

Não criar catálogo independente.

Não criar carrinho nessa landing.

Não criar banco de produtos duplicado.

---

## Direção visual

Criar uma seção chamada aproximadamente:

`Água para cada necessidade`

ou manter/refinar a seção existente se ela já cumpre esse papel.

Essa seção deve mostrar exemplos de tipos de compra.

Podem existir três grupos conceituais:

### Galões

`Opções para o abastecimento do dia a dia.`

### Fardos e unidades

`Consulte os formatos disponíveis no catálogo.`

### Pedidos em quantidade

`Para necessidades maiores, consulte condições.`

---

## Importante

Os textos não devem afirmar que um produto específico existe caso isso não esteja confirmado.

Use linguagem segura:

- “consulte”;
- “veja as opções”;
- “formatos disponíveis”;
- “pedidos em quantidade”;
- “conforme disponibilidade”.

---

## Visual

Evitar três cards genéricos idênticos.

Possível composição:

```text
ÁGUA PARA CADA NECESSIDADE

[ tipografia grande ]
GALÕES

        uma linha fluida

                       FARDOS
                       E UNIDADES

PEDIDOS EM
QUANTIDADE

            Ver catálogo oficial →
```

Outra opção válida:

- uma composição horizontal;
- números grandes;
- faixas;
- divisões fluidas;
- elementos que lembram rótulos ou embalagens.

---

## CTA principal

Manter:

`Ver catálogo oficial`

O CTA deve utilizar a configuração já existente em `BOAFONT_CONFIG`.

Não hardcodar URL em vários locais.

---

## Motion

Adicionar:

- entrada escalonada dos grupos;
- linha de água percorrendo a seção;
- hover com ripple discreto;
- seta do CTA se movimentando poucos pixels;
- pequenos elementos líquidos decorativos.

Evitar:

- bolhas infantis;
- bounce exagerado;
- animações rápidas;
- efeitos de neon.

---

## Integração futura

A seção deve ser preparada para futuramente receber dados de catálogo sem exigir reconstrução total.

Separar de maneira clara no HTML:

- título;
- grupos;
- CTA.

Adicionar comentários no código quando isso ajudar.

---

## Critérios de conclusão

- o usuário entende que existe variedade;
- o catálogo oficial continua sendo o destino para detalhes;
- não existe catálogo duplicado;
- não existem produtos/preços inventados;
- a seção parece parte da identidade Boafont;
- funciona bem no mobile.

---

## Versão sugerida

`v0.1.3`

## Commit sugerido

```text
boafont - v0.1.3 - adiciona prévia comercial de produtos integrada ao catálogo
```

---

# ETAPA 3 — SISTEMA DE ANIMAÇÕES DE ÁGUA E TRANSIÇÕES ENTRE SEÇÕES

## Objetivo

Fazer as animações do site parecerem relacionadas ao segmento de água, em vez de simples fades genéricos.

As animações atuais devem ser preservadas e refinadas.

---

## Direção

O movimento deve transmitir:

- fluidez;
- limpeza;
- profundidade;
- calma;
- movimento da água.

Evitar estética:

- aquário;
- jogo;
- desenho infantil;
- chuva;
- gotas enormes;
- ondas rápidas;
- splash exagerado.

---

## Hero

Melhorar os efeitos existentes.

Pode usar:

- camada de caustics;
- reflexo luminoso;
- gradiente animado;
- ripple lento;
- linha ondulada;
- background parallax.

Não prejudicar a leitura.

A fotografia deve continuar reconhecível.

---

## Separações entre blocos

Substituir, quando apropriado, divisões secas por transições mais orgânicas.

Exemplos:

```text
AZUL
~~~~~~
BRANCO
```

ou curvas assimétricas.

Não fazer todas as seções terem exatamente o mesmo formato.

---

## Reveals

Criar 2 ou 3 tipos de reveal reutilizáveis.

Exemplos:

```text
[data-reveal="up"]
[data-reveal="left"]
[data-reveal="water"]
```

O reveal `water` pode simular uma máscara passando pela seção.

Implementar de modo leve.

---

## Botões

Adicionar microinteração relacionada a ripple.

Ao hover:

- pequena expansão de background;
- pseudo-elemento radial;
- deslocamento de seta.

Ao clique:

- feedback visual curto.

Não atrapalhar navegação.

---

## Scroll

Adicionar um sistema leve com `requestAnimationFrame`.

Não executar cálculos pesados em todo evento bruto de `scroll`.

Respeitar:

```js
prefers-reduced-motion
```

---

## Performance

Não adicionar:

- Three.js;
- canvas pesado;
- WebGL;
- partículas em massa;
- vídeos gigantes;

apenas por estética.

Esta landing deve continuar leve.

---

## Mobile

No mobile:

- reduzir parallax;
- eliminar efeitos que dependem de hover;
- evitar elementos decorativos cobrindo textos;
- manter 60 FPS sempre que possível.

---

## Critérios de conclusão

- as animações parecem pertencer a uma marca de água;
- não existe poluição visual;
- o site continua elegante;
- o movimento entre seções parece mais contínuo;
- não existe jank perceptível;
- nenhuma animação antiga importante foi perdida.

---

## Versão sugerida

`v0.1.4`

## Commit sugerido

```text
boafont - v0.1.4 - amplia motion design com efeitos fluidos inspirados em água
```

---

# ETAPA 4 — SEÇÃO DE PEDIDOS EM QUANTIDADE E CONFIANÇA

## Objetivo

Criar uma seção comercial forte para o visitante que precisa de volumes maiores.

A seção atual semelhante a:

`Precisa de mais água?`

pode ser evoluída.

---

## Copy principal sugerida

### Eyebrow

`PEDIDOS EM QUANTIDADE`

### Headline

`Quanto maior o pedido, mais importante é conversar.`

### Apoio

`Para abastecimentos maiores, consulte diretamente as condições e possibilidades de atendimento da Boafont.`

### CTA

`Consultar condições`

---

## Visual

Fazer esta seção ter presença forte.

Sugestão:

- fundo laranja;
- texto azul-marinho ou branco dependendo do contraste;
- fotografia de estoque recortada;
- tipografia grande;
- bastante espaço negativo.

Possível estrutura:

```text
┌─────────────────────────────────────────────┐
│ PEDIDOS EM QUANTIDADE                       │
│                                             │
│ Quanto maior o pedido,                      │
│ mais importante é conversar.     [GALÕES]  │
│                                  [GALÕES]   │
│ Consultar condições →                       │
└─────────────────────────────────────────────┘
```

---

## Elementos de confiança

Adicionar apenas elementos verificáveis.

Possíveis indicadores sem inventar métricas:

```text
UNIDADE FÍSICA
Cotia · SP

ATACADO E VAREJO
consulte opções

ESTOQUE LOCAL
estrutura real

ATENDIMENTO
sob consulta
```

Pode haver uma pequena faixa de confiança.

Não apresentar isso como números falsos.

---

## Animação

- título grande com reveal;
- foto de galões entrando em escala;
- faixa de confiança surgindo sequencialmente;
- CTA com microinteração;
- fundo laranja com textura/gradiente leve.

---

## Conversão

Se `BOAFONT_CONFIG.contactUrl` estiver configurado:

- CTA deve abrir o canal correto.

Se não estiver:

- preservar o fallback existente;
- não inventar número de WhatsApp.

---

## Critérios de conclusão

- esta seção deve funcionar como um ponto de conversão forte;
- não parecer um simples banner;
- mensagem de atacado/volume deve ficar clara;
- nenhuma condição comercial pode ser inventada;
- CTA deve ser funcional ou ter fallback controlado.

---

## Versão sugerida

`v0.1.5`

## Commit sugerido

```text
boafont - v0.1.5 - fortalece seção de pedidos em quantidade e confiança
```

---

# ETAPA 5 — EXPERIÊNCIA DO CATÁLOGO, CTA FINAL E ASSINATURA NEOEFFEX

## Objetivo

Fechar a landing com uma experiência mais comercial e mostrar que o site faz parte de uma solução digital maior da Neoeffex.

Esta etapa deve unir:

- catálogo;
- contato;
- mobile;
- assinatura da Neoeffex.

---

# PARTE A — MOCKUP DO CATÁLOGO

Criar uma pequena apresentação visual do catálogo digital.

Não precisa carregar o catálogo inteiro dentro da landing.

Pode existir um mockup de smartphone construído em HTML/CSS.

Exemplo conceitual:

```text
Seu pedido começa aqui.

Consulte os produtos disponíveis
no catálogo digital da Boafont.

        ┌──────────────┐
        │ BOAFONT      │
        │              │
        │ Galões       │
        │ Água         │
        │ Produtos     │
        │              │
        └──────────────┘

Ver catálogo oficial →
```

---

## Regras do mockup

Não inventar interface extremamente detalhada caso o catálogo real ainda não tenha esse visual.

O mockup pode ser abstrato:

- logo/texto;
- categorias;
- linhas;
- produtos genéricos sem preço;
- indicação de interface.

Não fazer screenshot falsa do catálogo real.

---

## Animação do mockup

Ao entrar na viewport:

- smartphone sobe;
- leve rotação se normaliza;
- conteúdo aparece depois;
- pequenos elementos internos entram em stagger.

No hover desktop:

- inclinação máxima muito pequena.

---

# PARTE B — CTA FIXO DISCRETO

No desktop, depois que o usuário sair do hero, pode surgir:

`Consultar condições →`

em posição fixa discreta.

Não criar botão piscando.

No mobile, considerar barra inferior com dois comandos:

```text
VER PRODUTOS    CONSULTAR
```

Requisitos:

- não cobrir conteúdo;
- respeitar `safe-area-inset-bottom`;
- esconder adequadamente próximo ao footer se necessário;
- acessibilidade de teclado;
- área de toque confortável.

---

# PARTE C — FECHAMENTO E NEOEFFEX

No footer ou imediatamente antes dele, adicionar assinatura discreta:

`Uma experiência digital Neoeffex.`

ou:

`Site demonstrativo desenvolvido pela Neoeffex.`

Pode incluir:

`neoeffex.com.br`

A assinatura deve parecer parte do projeto, e não um banner publicitário.

---

## Visual da assinatura

Possível composição:

```text
Uma experiência digital

NEOEFFEX

Sites e experiências digitais.
```

Utilizar a identidade da Neoeffex disponível no projeto quando houver asset apropriado.

Não importar logo aleatória da internet.

---

## SEO e acabamento

Nesta etapa também revisar:

- `<title>`;
- meta description;
- headings;
- alt text;
- favicon se já existir padrão;
- links;
- aria-labels;
- foco por teclado;
- botões;
- navegação mobile;
- console;
- paths relativos.

Não reestruturar o projeto inteiro.

---

## Teste final

Testar:

### Desktop

- 1920×1080;
- 1440×900;
- 1366×768.

### Tablet

- ~768 px.

### Mobile

- 360×800;
- 390×844;
- 430×932.

Testar:

- carregamento direto da rota;
- reload da rota;
- links;
- CTAs;
- menu;
- animações;
- `prefers-reduced-motion`;
- touch;
- teclado;
- scroll;
- ausência de overflow horizontal;
- console sem erros.

---

## Versão sugerida

`v0.1.6`

## Commit sugerido

```text
boafont - v0.1.6 - adiciona experiência de catálogo, CTAs finais e assinatura Neoeffex
```

---

# RESULTADO FINAL ESPERADO

Ao concluir as cinco etapas, a landing deve evoluir de:

> uma landing institucional bonita

para:

> uma demonstração comercial forte, personalizada e visualmente ligada à operação real da Boafont.

A página deve transmitir:

1. a Boafont existe fisicamente;
2. há estrutura e estoque real;
3. existem diferentes possibilidades de compra;
4. grandes pedidos podem ser consultados;
5. existe um catálogo digital;
6. a experiência foi desenvolvida pela Neoeffex.

---

# O QUE NÃO DEVE ACONTECER AO FINAL

Não aceitar como concluído caso:

- a página pareça um template genérico;
- as imagens reais tenham sido substituídas;
- o catálogo Neoeffex tenha sido duplicado;
- existam métricas falsas;
- tenham sido adicionados preços fictícios;
- animações existentes tenham desaparecido;
- mobile tenha perdido qualidade;
- existam efeitos excessivos;
- o site tenha ficado perceptivelmente pesado;
- o código tenha sido convertido para framework sem necessidade;
- arquivos fora de `/modelos/boafont/` tenham sido alterados sem justificativa.

---

# FORMATO DA RESPOSTA APÓS CADA ETAPA

Ao terminar cada etapa, responder exatamente nesta estrutura aproximada:

```text
Etapa X concluída

Arquivos alterados
- ...

Atualizações
- ...

Como testar
1. ...
2. ...
3. ...

Pendências
- ...

Versão sugerida
v0.1.x

Commit recomendado
boafont - v0.1.x - descrição curta
```

Depois:

**PARAR E AGUARDAR AUTORIZAÇÃO PARA A PRÓXIMA ETAPA.**

---

# PROMPT INICIAL PARA O GEMINI FLASH 3.8

Leia todas as instruções do repositório e o arquivo `BOAFONT_5_ETAPAS_GEMINI_FLASH_3_8.md`.

Vamos refinar exclusivamente a landing `/modelos/boafont/`.

Execute somente a **Etapa 1 — Galeria real da Boafont e composição fotográfica**.

Não avance para as demais etapas.

Preserve o design atual, as animações já existentes e os quatro assets reais da Boafont.

Antes de editar, revise a implementação atual para evitar regressões.

Ao finalizar:
- teste desktop e mobile;
- verifique console;
- informe os arquivos alterados;
- explique as atualizações;
- diga como testar;
- sugira a versão e o commit;
- pare e aguarde minha autorização.
