# Neoeffex Modelos — Regras Específicas

Estas instruções valem para todas as landing pages em `/modelos/`.

## Objetivo

Cada pasta representa um modelo demonstrativo que poderá ser adaptado para um cliente real.

O modelo deve parecer um site completo e profissional, não um template genérico.

## Reutilização

Separe, sempre que razoável:

- cores;
- textos;
- imagens;
- dados de contato;
- URLs;
- configurações do catálogo.

Prefira CSS Custom Properties para a paleta principal.

Exemplo conceitual:

```css
:root {
    --color-primary: ...;
    --color-secondary: ...;
    --color-background: ...;
    --color-text: ...;
}
```

## Catálogo

Não implemente um segundo sistema de catálogo dentro de uma landing.

Quando houver botão, seção ou integração de catálogo, reutilize a solução Neoeffex.

Mantenha o ponto de integração simples de trocar para outro cliente.

## Visual

Cada segmento deve possuir identidade própria.

Evite repetir exatamente:

- o mesmo hero;
- os mesmos cards;
- a mesma sequência de seções;
- os mesmos efeitos;

entre todos os modelos.

## Tecnologias

HTML/CSS/JS puro é válido quando suficiente.

Vite, React, Three.js, GSAP ou outra tecnologia é aceitável quando a experiência realmente exigir.

Não introduza framework apenas para trocar texto, cores ou criar seções estáticas.

## Assets

Mantenha assets organizados dentro do próprio modelo quando forem exclusivos.

Não quebre caminhos relativos ao mover arquivos.

Verifique sempre a rota final esperada em produção.

## Responsividade e acessibilidade

- hero deve funcionar em telas menores;
- texto sobre imagem deve manter contraste;
- botões devem ter área de toque adequada;
- navegação deve permanecer utilizável;
- animações importantes devem respeitar `prefers-reduced-motion`.
