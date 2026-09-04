# Modelo Hamburgueria — Contexto Específico

Rota esperada:

`/modelos/hamburgueria`

Leia também os arquivos `GEMINI.md` superiores.

## Direção visual

A landing pode ser mais cinematográfica e interativa do que os demais modelos.

A experiência principal pode utilizar hambúrguer 3D animado.

## Stack 3D

Quando já presente na implementação, preservar:

- Vite;
- Three.js;
- GSAP;
- arquivo GLB otimizado;
- materiais PBR;
- iluminação/HDRI quando utilizado.

Não remover a experiência 3D apenas para simplificar uma correção.

Ao mesmo tempo, não transformar toda a landing em uma aplicação 3D sem necessidade.

## Modelo GLB

Ao substituir o arquivo do hambúrguer:

- verifique caminho;
- escala;
- rotação;
- posição;
- materiais;
- carregamento assíncrono;
- tratamento de erro;
- câmera e luzes.

Se o novo GLB aparecer igual ao anterior, investigar primeiro se:

- o caminho carregado realmente mudou;
- há cache;
- o asset importado é o correto;
- o build está usando a pasta certa;
- o objeto antigo continua na cena.

## Desenvolvimento local

Este modelo pode possuir build próprio.

Não presuma que Live Server na raiz executará corretamente recursos que dependem do Vite.

Antes de alterar configuração, identifique a forma atual de desenvolvimento e deploy.

## Performance

- comprimir/otimizar GLB;
- evitar texturas excessivamente grandes;
- limitar efeitos pesados;
- pausar ou reduzir animação quando fora de viewport quando apropriado;
- manter fallback razoável.
