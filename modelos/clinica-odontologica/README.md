# Clínica odontológica — Neoeffex

Modelo AURA, fictício, em HTML, CSS e JavaScript. Hero de tela inteira, fontes e fotografias locais. Não precisa de npm, Vite, React ou build.

## Instalar

Copie a pasta `modelos/clinica-odontologica/` deste ZIP para a raiz do repositório. O resultado será `https://neoeffex.com.br/modelos/clinica-odontologica/`. Este pacote não publica o site: faça seu commit/push e a publicação habituais.

## Conectar o catálogo

Abra `assets/js/config.js` e preencha **somente `catalog.slug`** com a identificação de um catálogo ativo no `/admin`. O valor inicial está vazio porque não foi informado um catálogo real da clínica.

Os links de tratamentos e de solicitação de atendimento passam a abrir, na mesma aba, a rota oficial:

```text
https://neoeffex.com.br/catalogo/?catalogo=IDENTIFICACAO
```

Essa rota foi confirmada no README e no código público da Neoeffex em 03/09/2026. O formato `/catalogo/identificacao` do ZIP original não é o contrato utilizado pelo módulo atual.

- Slug vazio ou malformado: aviso “Catálogo ainda não disponível”, sem redirecionamento para outro comércio.
- Slug válido, inexistente ou pausado: o catálogo central trata a disponibilidade.
- Parâmetros da URL da landing não substituem a identificação configurada.
- Produtos, categorias, preços, disponibilidade, identidade operacional, carrinho e WhatsApp ficam no catálogo oficial. Não há cópia do banco, API, login, painel ou regras de pedido neste modelo.
- Nome, logo, horários, região e canais cadastrados no admin aparecem no catálogo conforme o módulo central. Esta landing usa a marca editorial configurada para o exemplo; não importa o script do catálogo, que depende do DOM próprio dele.
- “Solicitar avaliação” abre o catálogo/canal oficial e não confirma um agendamento.

## Mudar as cores

Clique no botão **Cores**, no canto inferior direito. Há quatro paletas, quatro seletores de cor e campos hexadecimais. Os textos se ajustam automaticamente para manter contraste com os fundos.

As alterações ficam neste navegador, separadas por modelo e slug. **Restaurar padrão** afeta apenas essa preferência; não apaga carrinhos nem dados de outros sites.

Para publicar as cores para todos:

1. Escolha as cores e clique em **Exportar cores**.
2. Substitua `assets/js/theme-config.js` pelo arquivo baixado, mantendo esse nome.
3. Faça o commit/push e publique normalmente. A nova paleta padrão invalida preferências baseadas no padrão anterior.

Se o navegador não iniciar o download, o painel também mostra a configuração completa para copiar e colar em `assets/js/theme-config.js`.

Também é possível editar diretamente as quatro cores em `assets/js/theme-config.js`. Para ocultar o painel em uma versão de cliente, altere `themeEditor` para `false` em `config.js`: o site passa a aplicar somente a paleta publicada. As cores da landing não alteram o tema do catálogo central.

## Textos, marca e imagens

- `assets/js/config.js`: marca visual, logo opcional, textos principais e caminhos das fotos.
- `index.html`: demais textos institucionais, diferenciais, FAQ e metadados estáticos.
- `assets/css/style.css`: composição, espaçamento e comportamento responsivo.
- `assets/img/`: fotografias WebP e favicon. Use nomes sem espaços/acentos nos caminhos configurados. Troque as versões desktop/mobile do hero em conjunto.
- A logo opcional mantém proporções com `object-fit: contain`. Atualize também o favicon ao trocar a marca.
- Antes de usar com uma clínica real, substitua o conteúdo fictício e defina `brand.demo: false`; isso oculta os depoimentos demonstrativos e a identificação de exemplo. Os metadados estáticos do HTML devem acompanhar a marca real.

## Testar localmente

No VS Code, abra a raiz do repositório e use Live Server no `index.html` da clínica. A landing também abre diretamente como arquivo; o armazenamento de preferências depende do navegador.

Por padrão os CTAs usam o catálogo publicado. Para testar `/catalogo/` no mesmo Live Server, defina `catalog.useLocalCatalog: true` e sirva **a raiz completa do repositório**, com `/admin` e `/catalogo` presentes. O protocolo, host e porta locais são preservados. Uma pasta isolada não contém o catálogo.

Sem JavaScript, o conteúdo institucional, navegação e FAQ continuam disponíveis; o catálogo configurável e o editor de cores pedem JavaScript.

## Dependências e validação

Nenhuma dependência de execução externa na landing. As fontes locais são Manrope e Playfair Display, com licenças em `assets/fonts/`. Créditos das fotos em `assets/img/README.md`.

Veja `TESTES.md` para os testes realizados e o checklist de integração com o catálogo real.
