# Changelog

Todas as alterações relevantes desta landing page serão registradas aqui.

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
