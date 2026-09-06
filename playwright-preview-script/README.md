# Script de previews com Playwright

Este pacote gera previews automáticos das landings da Neoeffex.

## O que ele faz
Para cada página configurada:
1. abre a URL no Chromium do Playwright;
2. espera a landing carregar;
3. tira uma screenshot do topo da página;
4. faz scroll automático sem clicar em nada;
5. grava o preview em vídeo;
6. gera:
   - `poster.webp`
   - `preview.webm`
   - `preview.mp4`

## Estrutura gerada
```text
generated-previews/
├── raw/
├── images/
│   └── *-preview.webp
└── videos/
    ├── *-preview.webm
    └── *-preview.mp4
```

## Requisitos
- Node.js 18+
- FFmpeg instalado e disponível no PATH
- servidor local rodando as páginas (ex.: Live Server)

## Instalação
```bash
npm install
npx playwright install chromium
```

## Como usar
1. Inicie o seu servidor local.
2. Ajuste `tools/preview-config.mjs` se necessário.
3. Execute:

```bash
npm run previews
```

## Configuração principal
Arquivo: `tools/preview-config.mjs`

Exemplo:
```js
export default {
    baseUrl: 'http://127.0.0.1:5500',
    pages: [
        { name: 'hamburgueria', route: '/modelos/hamburgueria/' },
        { name: 'clinica-odontologica', route: '/modelos/clinica-odontologica/' }
    ]
};
```

## Ajustes úteis
- `waitBeforeStartMs`: espera inicial antes do scroll
- `scrollStep`: quantos pixels desce por vez
- `scrollIntervalMs`: intervalo entre cada scroll
- `durationMs`: tempo máximo do preview
- `outputWidth`: largura de saída dos vídeos finais

## Observações
- O script não clica, não passa o mouse e não interage com a página.
- Ele apenas abre a landing e faz scroll automático.
- Se alguma rota estiver diferente no seu projeto, troque no arquivo de configuração.
