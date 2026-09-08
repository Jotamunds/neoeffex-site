# Changelog — Boafont

## 0.1.2 — 2026-09-07

- Etapa 1: transforma as fotos reais da Boafont em composição editorial fotográfica de alto impacto;
- reformula a seção da estrutura com destaque para a fachada física oficial (`facade.png`) e apoio do veículo (`van.png`) e estoque (`stock.png`);
- adiciona legendas contextuais para cada imagem destacando operação local em Cotia, frota identificada e estoque;
- implementa animação de entrada sequencial escalonada (título -> fachada -> veículo -> estoque);
- adiciona profundidade discreta no movimento do mouse e parallax suave de scroll independente por foto (dentro dos limites técnicos recomendados);
- implementa microinteração de foco no hover com atenuação sutil dos itens adjacentes;
- garante responsividade total com pilha vertical limpa e sem sobreposições no mobile;
- preserva suporte estrito a `prefers-reduced-motion`.

## 0.1.1 — 2026-09-07

- adiciona os quatro assets fotográficos reais enviados para a Boafont;
- preenche `assets/img/hero.png`, `assets/img/van.png`, `assets/img/stock.png` e `assets/img/facade.png`;
- elimina a pendência visual do export Open Design;
- deixa a landing pronta para teste em `/modelos/boafont/` com as animações já ampliadas na etapa anterior.

## 0.1.0 — 2026-09-07

- adapta o export do Open Design para `/modelos/boafont/`;
- renomeia a entrada para `index.html`;
- separa CSS e JavaScript em assets próprios;
- normaliza os caminhos das imagens;
- preserva os efeitos originais de água e reveal;
- adiciona motion layer com entrada do hero, header, parallax leve, ondas e microinterações;
- mantém suporte a `prefers-reduced-motion`;
- mantém os CTAs desacoplados do catálogo e contato por `BOAFONT_CONFIG`;
- documenta os quatro assets fotográficos ausentes no export do Open Design.
