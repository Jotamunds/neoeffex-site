# Catálogo público — Neoeffex

Página pública:

```text
/catalogo/?catalogo=identificador
```

## Estrutura compartilhada

O núcleo em `/catalogo/` continua único para todos os clientes.

Ele controla:

- leitura pública;
- categorias;
- produtos;
- busca;
- filtros;
- carrinho;
- WhatsApp;
- identidade básica.

Temas visuais específicos são carregados somente quando o slug possui um tema registrado em `config.js`.

## Tema Lu Leve e Saudável

Na `v0.1.9.4`:

```text
/catalogo/?catalogo=lu-leve-e-saudavel
```

carrega:

```text
assets/css/themes/lu-leve-e-saudavel.css
```

O tema usa como referência visual:

```text
/sites/lu-leve-e-saudavel/styles/base/variables.css
```

e as fontes locais já existentes em:

```text
/sites/lu-leve-e-saudavel/assets/fonts/
```

Outros slugs continuam usando o tema padrão do catálogo.

## Segurança

O tema é escolhido por uma lista fixa no código.

O visitante não pode passar CSS, HTML ou JavaScript pela URL.

A query string informa somente o slug do catálogo.

Nenhuma migration ou alteração de RLS é necessária para a `v0.1.9.4`.

## Publicação

Publique `/admin/` e `/catalogo/` com a mesma versão.

Para a Lu, mantenha também:

```text
/sites/lu-leve-e-saudavel/
```

disponível no domínio enquanto o tema referenciar as fontes locais desse caminho.

O botão do site pode apontar para:

```text
/catalogo/?catalogo=lu-leve-e-saudavel
```

---

## v0.1.10 — ajustes do catálogo da Lu

- o slug `lu-leve-e-saudavel` usa uma logo quadrada derivada do pack oficial da marca;
- a imagem é exibida sem moldura externa, com apenas os cantos levemente arredondados;
- se o ativo local falhar, a logo cadastrada no Storage continua como fallback;
- as notificações do catálogo ficam acima do botão flutuante do carrinho;
- o toast usa `pointer-events: none` para nunca bloquear o botão em resoluções estreitas.

Nenhuma migration, RLS ou regra de Storage foi alterada.

---

## v0.1.10.1 — logos oficiais da Lu

O catálogo `lu-leve-e-saudavel` passa a usar dois ativos do pack atualizado:

```text
Cabeçalho:
assets/images/brands/lu-leve-e-saudavel/logo-header.webp

Hero:
assets/images/brands/lu-leve-e-saudavel/logo-catalogo.webp
```

Escolhas:

- cabeçalho: composição horizontal com símbolo à esquerda e nome à direita;
- hero: símbolo quadrado sem texto, pois o nome do catálogo já aparece como título;
- o marcador genérico do cabeçalho deixa de ser exibido no tema da Lu;
- demais catálogos continuam com o cabeçalho padrão.

---

## v0.1.11 — um catálogo por cliente

A alteração é administrativa: cada conta do MVP passa a possuir somente um catálogo.

A página pública continua sendo resolvida pelo slug:

```text
/catalogo/?catalogo=identificador
```

O slug permanece globalmente único. Nenhuma URL pública existente é alterada.

---

## v0.1.12 — logos e último carrinho

- A área de logo compartilhada centraliza imagens quadradas, horizontais e verticais em todos os catálogos; a correção não depende do tema da Lu.
- O tema `lu-leve-e-saudavel` preserva os ativos oficiais, agora com posicionamento central explícito.
- Ao clicar em `Enviar pedido pelo WhatsApp`, o carrinho atual é guardado como último carrinho e então limpo.
- Quando o carrinho está vazio e existe um pedido anterior válido, aparece o botão `Restaurar último carrinho`.
- O último carrinho continua armazenado somente no navegador e separado pelo identificador interno do catálogo.
