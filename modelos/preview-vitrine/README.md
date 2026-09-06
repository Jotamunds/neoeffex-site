# Preview Vitrine · Neoeffex

Pacote pronto para exibir previews dos modelos da Neoeffex em uma vitrine própria.

## O que já está incluído
- `index.html` com estrutura pronta
- `assets/css/modelos-preview.css`
- `assets/js/modelos-preview.js`
- posters em `.webp`
- vídeos curtos em `.webm`
- fallback em `.mp4`

## Estrutura
```text
modelos/
└── preview-vitrine/
    ├── index.html
    ├── VERSION
    ├── CHANGELOG.md
    ├── README.md
    └── assets/
        ├── css/
        │   └── modelos-preview.css
        ├── js/
        │   └── modelos-preview.js
        ├── images/
        │   ├── barbearia-preview.webp
        │   ├── clinica-odontologica-preview.webp
        │   ├── hamburgueria-preview.webp
        │   ├── hortifruti-preview.webp
        │   └── lu-leve-e-saudavel-preview.webp
        └── videos/
            ├── *.webm
            └── *.mp4
```

## Como testar
1. Extraia a pasta `modelos/` dentro do seu projeto.
2. Abra `modelos/preview-vitrine/index.html` com Live Server ou servidor local.
3. Verifique se os vídeos carregam em loop e se pausam fora da área visível.
4. Ajuste os links `../hamburgueria/`, `../clinica-odontologica/`, etc., caso sua estrutura final tenha nomes diferentes.

## Observações
- Os vídeos foram reduzidos para previews curtos com foco em vitrine.
- O HTML está em JS puro, sem dependência de framework.
- O CSS foi pensado para servir tanto como página separada quanto como base para integração na página `/modelos`.
