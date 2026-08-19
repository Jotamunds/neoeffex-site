# Changelog

Todas as alterações relevantes desta landing page serão registradas aqui.

## [0.1.6] - 2026-08-18

### Corrigido
- `landing.js` agora é carregado pelo `index.html` com `defer`.
- Corrigido o bug que impedia o reveal por proximidade de executar.
- Adicionado cache busting por versão aos assets locais usados pelo hero:
  - `tokens.css?v=0.1.6`
  - `landing.css?v=0.1.6`
  - `atmosphere.css?v=0.1.6`
  - `landing.js?v=0.1.6`
  - favicon/logo do `<head>`.
- Adicionado `<meta name="application-version" content="0.1.6">` para facilitar diagnóstico no DevTools.
- Centros das palavras agora são cacheados e recalculados somente após carregamento das fontes ou `resize`, em vez de usar `getBoundingClientRect()` a cada frame.
- Mantido o comportamento da atmosfera aprovado na v0.1.4; nenhuma regra de movimento foi alterada.

### Cache
- O versionamento por query string força o navegador/CDN a solicitar a versão correspondente do CSS e JavaScript quando o número da landing muda.
- Recursos externos do Google Fonts não recebem o número da landing, pois sua própria URL já identifica famílias e pesos.
- `style.css` das páginas legadas não foi invalidado porque não mudou nesta versão.

### Mantido
- Fumaça passiva em CSS com movimento `alternate`.
- Reveal máximo de 60% de opacidade.
- Tipografia oficial.
- Sem Canvas, WebGL ou Rive.

## [0.1.5] - 2026-08-18

### Adicionado
- Reveal das palavras-chave por proximidade do ponteiro.
- Palavras começam com `opacity: 0`, ficando 100% transparentes.
- Cada palavra reage individualmente à distância do cursor.
- Opacidade cresce suavemente até no máximo `0.60`.
- Raio de revelação adaptado para desktop, tablet e celular.
- Suporte a Pointer Events para mouse, caneta e toque.
- Atualizações limitadas a um `requestAnimationFrame` por frame.
- Reset automático quando o ponteiro sai do hero, é cancelado ou a janela perde foco.

### Performance
- Apenas 6 elementos participam do cálculo de proximidade.
- Nenhuma física.
- Nenhum Canvas.
- Nenhum WebGL.
- Nenhuma biblioteca externa.
- A atmosfera da v0.1.4 permanece 100% CSS e não recebe interação.

### Mantido
- Movimento `alternate` da fumaça exatamente como na v0.1.4.
- Tipografia oficial.
- Paleta e composição do hero.
- `prefers-reduced-motion`.

## [0.1.4] - 2026-08-18

### Corrigido
- Removida a lógica de órbita/retorno obrigatório das nuvens.
- As quatro camadas agora usam `animation-direction: alternate`.
- Cada massa deriva entre apenas dois extremos e percorre o caminho inverso suavemente.
- Não existe mais salto de B para A ao terminar uma animação.
- Adicionados `animation-delay` negativos diferentes para que as nuvens já iniciem em pontos distintos do percurso.
- Mantida opacidade fixa durante cada animação.
- Ajustados tempos para 28s, 36s, 44s e 52s, evitando sincronização perceptível.

### Performance
- Continua usando somente CSS.
- Animação limitada a `transform`.
- Sem Canvas, WebGL, Rive ou JavaScript para motion.

### Mantido
- Tipografia oficial.
- Composição do hero.
- Paleta.
- `prefers-reduced-motion`.
- Sem interação por cursor nesta etapa.

## [0.1.3] - 2026-08-18

### Corrigido
- Removido o salto perceptível quando as animações de fumaça reiniciavam.
- Todas as trajetórias agora são loops fechados: `0%` e `100%` usam exatamente o mesmo estado.
- Removida a variação de opacidade durante o ciclo para evitar a sensação de a fumaça desaparecer.
- Nuvens reposicionadas para permanecerem parcialmente visíveis durante toda a trajetória.
- Ciclos desacelerados e mais separados entre si para evitar reinícios sincronizados.

### Mantido
- Atmosfera 100% CSS.
- Sem Canvas, WebGL, Rive ou JavaScript para motion.
- Tipografia e composição da v0.1.1.
- Sem interação com o cursor nesta etapa.

## [0.1.2] - 2026-08-18

### Adicionado
- Primeira camada de motion da nova landing.
- Atmosfera/fumaça passiva com quatro massas independentes.
- Movimento contínuo perceptível mesmo sem interação do usuário.
- Trajetórias, escalas, ritmos e direções diferentes para criar parallax e sobreposição orgânica.
- `atmosphere.css` isolado do layout principal.
- Tokens próprios de duração e intensidade da fumaça.
- Fallback estático para `prefers-reduced-motion`.
- Redução automática de uma camada e do blur em telas menores.

### Performance
- Animações limitadas a `transform` e `opacity`.
- Sem Canvas.
- Sem WebGL.
- Sem Rive nesta etapa.
- Sem JavaScript para a fumaça.
- Sem imagens, vídeos ou novos assets de mídia.

### Mantido
- Tipografia oficial da v0.1.1.
- Composição, palavras-chave e hierarquia visual aprovadas.
- Nenhuma interação por cursor ainda.

## [0.1.1] - 2026-08-18

### Alterado
- Tipografia refeita usando exclusivamente famílias previstas nas instruções do projeto.
- `Michroma` aplicada ao título principal "Neo".
- `Josefin Sans` aplicada à assinatura, microtítulos e palavras-chave.
- `IBM Plex Sans` definida como fonte de texto corrido para a evolução da landing.
- `IBM Plex Mono` aplicada à versão e reservada para estados, números e UI técnica.
- Removida a pilha genérica baseada em Inter / Geist / Manrope.
- Ajustados tamanho e tracking do título para compensar a largura natural da Michroma.

### Mantido
- Composição estática da v0.1.0.
- Paleta oficial.
- Posicionamento dos valores.
- Responsividade.
- Sem fumaça, Rive, Canvas, WebGL ou interação nesta etapa.

## [0.1.0] - 2026-08-18

### Adicionado
- Fundação visual do novo hero da Neoeffex.
- Hero em tela cheia (`100vh` / `100svh`).
- Identidade `Neo by Neoeffex`.
- Tokens centralizados de cor, tipografia, espaçamento, motion e efeitos.
- Palavras-chave de valores posicionadas na composição.
- Profundidade estática discreta em azul.
- Layout responsivo para desktop e celular.
- Suporte básico a `prefers-reduced-motion`.
- Arquivo de versão e changelog.

### Deliberadamente não incluído
- Fumaça animada.
- Rive.
- Canvas.
- WebGL.
- Interação por cursor.
- Reveal das palavras por proximidade.
- Demais seções da landing page.
