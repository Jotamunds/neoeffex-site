# Hamburgueria — Código-fonte Vite

Estas instruções complementam `../GEMINI.md`.

## Fonte de verdade

Esta pasta contém o código-fonte editável da versão Vite da hamburgueria.

Para alterações de comportamento, layout, Three.js, GSAP, catálogo ou configuração do modelo, prefira editar `source/` em vez de modificar manualmente os arquivos de runtime gerados na raiz do projeto.

## Fluxo esperado

Depois de alterar o código-fonte para uso com Live Server:

```powershell
cd modelos/hamburgueria
npm run live:sync
```

Para desenvolvimento com Vite:

```powershell
npm run dev
```

Para build:

```powershell
npm run build
```

Para preparar a pasta publicável conforme o fluxo atual:

```powershell
npm run build:publish
```

Não copie arquivos manualmente entre `source/`, raiz e `dist/` se os scripts existentes já fazem essa sincronização.

## Progressive enhancement

HTML e CSS essenciais devem continuar visíveis mesmo quando o runtime 3D falhar.

Three.js e GSAP enriquecem a experiência; não devem ser requisito para o conteúdo básico existir.

## 3D

O hero utiliza modelo GLB real.

Ao alterar o carregamento:

- preserve materiais embutidos quando essa for a intenção atual;
- normalize escala e centralização com cuidado;
- não recrie materiais procedurais por cima do GLB sem solicitação;
- mantenha fallback para falha de WebGL/modelo;
- verifique cache quando um GLB substituído parece não ter mudado.

## Catálogo

A configuração do slug fica no código-fonte, atualmente em `src/config.js`.

Preserve a resolução correta entre ambiente de desenvolvimento e produção.

Não hardcode uma URL em componentes diferentes se a configuração central já resolve o destino.

## Imports

Preserve compatibilidade entre o modo Vite e o modo sincronizado para Live Server.

Antes de trocar imports de Three.js/addons, verifique a estratégia atual de import map e os scripts de sincronização.

## Performance

Evite:

- múltiplos render loops concorrentes;
- texturas excessivamente grandes;
- carregar o mesmo GLB mais de uma vez;
- animação pesada fora de viewport sem necessidade;
- dependências adicionais para efeitos já cobertos por Three.js/GSAP.

Preserve `prefers-reduced-motion` e fallback estático.
