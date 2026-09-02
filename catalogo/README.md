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
