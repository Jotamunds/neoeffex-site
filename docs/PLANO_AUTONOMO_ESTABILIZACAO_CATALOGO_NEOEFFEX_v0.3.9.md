# PLANO_AUTONOMO_ESTABILIZACAO_CATALOGO_NEOEFFEX_v0.3.9

## Objetivo

Estabilizar o sistema de catálogo da Neoeffex a partir do estado atual da branch `main`, corrigindo regressões do Admin, editor universal de imagens, fluxo de sabores/produtos, Storage, responsividade e versionamento.

A execução deve ser **autônoma e ponta a ponta**: investigar, corrigir, testar, versionar e preparar o commit, sem pedir confirmação entre etapas normais.

Só interromper para pedir autorização se for realmente necessário:

- executar migration destrutiva;
- alterar RLS/Storage policy;
- apagar dados reais;
- mudar regra de negócio;
- fazer operação irreversível em produção.

Para os problemas descritos neste plano, **não deve ser criada migration nem alterado o banco sem evidência técnica concreta de necessidade**.

---

# Estado de referência

Repositório:

```text
Jotamunds/neoeffex-site
```

Branch:

```text
main
```

Commit de referência analisado:

```text
7c90e325986757dd56111d31f05aa91cfcd93c10
catalogo - corrige permissao publica da proporcao de logo
```

Versão atual do catálogo/Admin:

```text
0.3.8
```

Versão alvo sugerida:

```text
0.3.9
```

---

# Escopo principal

Arquivos prioritários:

```text
admin/index.html
admin/config.js
admin/VERSION
admin/CHANGELOG.md
admin/assets/css/admin.css
admin/assets/css/image-editor.css
admin/assets/js/admin.js
admin/assets/js/catalog-identity.js
admin/assets/js/image-editor.js

catalogo/index.html
catalogo/config.js
catalogo/VERSION
catalogo/assets/css/catalogo.css
catalogo/assets/css/catalog-identity.css
catalogo/assets/css/themes/lu-leve-e-saudavel.css
catalogo/assets/js/catalogo.js

tests/
docs/
```

Não alterar arquivos fora do escopo sem necessidade objetiva.

---

# Fase 0 — Baseline obrigatório

Antes de alterar qualquer arquivo:

1. confirmar branch e commit atuais;
2. executar `git status`;
3. registrar arquivos modificados existentes;
4. não sobrescrever alterações locais do usuário;
5. executar os testes atuais;
6. registrar quais testes passam e falham;
7. identificar versão atual em:
   - `admin/VERSION`
   - `catalogo/VERSION`
   - query strings dos assets;
   - textos de versão exibidos na UI.

Se existirem alterações locais não relacionadas, preservá-las.

---

# Fase 1 — Corrigir carregamento duplicado do editor de imagens

## Problema confirmado

O editor está sendo carregado diretamente em `admin/index.html` com query string:

```text
assets/js/image-editor.js?v=0.3.8
assets/css/image-editor.css?v=0.3.8
```

Mas `admin/assets/js/catalog-identity.js` também tenta carregar:

```text
assets/js/image-editor.js
assets/css/image-editor.css
```

A verificação atual compara `src`/`href` exatos e não reconhece o recurso versionado como o mesmo arquivo.

Consequências possíveis/observadas:

- dois botões `Ajustar foto atual`;
- dois textos auxiliares;
- duas instâncias do editor;
- listeners duplicados;
- mais de um overlay;
- `imageEditorBypass` consumido por uma instância e ignorado pela outra;
- editor podendo reabrir após `Aplicar imagem`;
- sensação de precisar confirmar a edição duas vezes.

## Correção exigida

Deixar **uma única fonte de carregamento** para:

```text
image-editor.js
image-editor.css
```

Preferência:

- manter carregamento explícito e versionado em `admin/index.html`;
- remover do `catalog-identity.js` o loader redundante, se não houver dependência real;
- ou tornar o loader robusto comparando pathname sem query string.

Não manter duas estratégias concorrentes sem necessidade.

## Proteção adicional

Adicionar guarda global no próprio editor, por exemplo conceitualmente:

```js
if (window.__NEOEFFEX_IMAGE_EDITOR_INITIALIZED__) return;
window.__NEOEFFEX_IMAGE_EDITOR_INITIALIZED__ = true;
```

ou solução equivalente, desde que:

- não masque arquitetura incorreta;
- garanta idempotência;
- não quebre hot reload/testes.

## Testes

Garantir:

```js
document.querySelectorAll(".image-editor-launch")
```

tenha no máximo um botão por input configurado.

Testar:

```text
#productImage
#flavorImage
#catalogLogo
```

Fluxo:

```text
selecionar/abrir foto
→ ajustar
→ Aplicar imagem uma única vez
→ editor fecha
→ não reabre
→ input.files[0] contém o arquivo processado
```

---

# Fase 2 — Estabilizar `saveFlavor()`

## Problema confirmado

`saveFlavorButton` é desabilitado durante o save, porém o caminho de sucesso não garante reativação.

## Correção exigida

Reestruturar `saveFlavor()` para ter gerenciamento de loading centralizado.

Preferir:

```js
saveFlavorButton.disabled = true;

try {
    ...
} catch (error) {
    ...
} finally {
    saveFlavorButton.disabled = false;
    saveFlavorButton.textContent =
        flavorId.value ? "Salvar alterações" : "Salvar sabor";
}
```

Cuidado: se o formulário for resetado/fechado no sucesso, obter o modo criação/edição antes do reset ou usar variável local.

Remover duplicações desnecessárias de:

```js
saveFlavorButton.disabled = false;
```

nos retornos intermediários, se o `finally` cobrir tudo corretamente.

## Testes obrigatórios

Testar:

- criar sabor sem foto;
- criar sabor com foto;
- editar nome;
- editar descrição;
- editar status;
- editar ordem;
- editar foto existente;
- remover foto;
- erro de upload;
- erro de update;
- nome duplicado;
- salvar duas vezes em sabores diferentes sem reload.

O botão nunca pode ficar permanentemente desabilitado.

---

# Fase 3 — Corrigir ciclo de vida das imagens de sabores

## 3.1 Substituição de imagem existente

Hoje, ao substituir a foto de um sabor, a imagem anterior pode permanecer no Storage.

Corrigir para:

```text
upload nova
→ atualizar banco com novo image_path
→ somente após sucesso, remover imagem antiga
```

Se o update do banco falhar:

```text
remover nova imagem enviada
→ preservar imagem anterior
```

Nunca apagar a imagem anterior antes de o novo vínculo estar confirmado.

## 3.2 Novo sabor com imagem

O fluxo:

```text
insert flavor
→ upload imagem
→ update image_path
```

deve validar também o resultado do último update.

Se o `image_path` não puder ser vinculado:

- remover a imagem recém-enviada do Storage;
- executar compensação segura;
- ou manter o sabor e informar claramente o estado parcial.

Não mostrar sucesso completo se a imagem não foi vinculada.

## 3.3 Exclusão de sabor

Ao excluir sabor com imagem:

- verificar retorno da remoção no Storage;
- se o registro foi apagado mas a imagem não, informar:
  `Sabor excluído, mas a foto não pôde ser removida do armazenamento.`
- não fingir sucesso integral.

## 3.4 Evitar órfãos

Criar teste/regressão para:

- substituir foto;
- remover foto;
- excluir sabor;
- falha simulada de update;
- falha simulada de Storage.

---

# Fase 4 — Tornar sincronização Produto ↔ Sabores segura

## Problema confirmado

O fluxo atual pode fazer:

```text
DELETE associações atuais
→ INSERT novas associações
```

Se o segundo passo falhar, as associações antigas já foram perdidas.

## Objetivo

A atualização de sabores de um produto deve ser atômica ou compensável.

## Soluções aceitáveis

Preferência, em ordem:

1. RPC/transação já existente e segura;
2. diff incremental no frontend:
   - manter existentes;
   - inserir novas;
   - atualizar alteradas;
   - apagar apenas removidas;
3. snapshot + compensação confiável.

### Restrição

Não criar migration automaticamente só para resolver isso se houver uma solução segura no frontend atual.

Se a única solução realmente correta exigir RPC/migration:

- documentar;
- não executar silenciosamente;
- aplicar uma estratégia frontend segura temporária;
- informar a necessidade de migration separadamente.

## Testes

Simular falha no meio da sincronização e confirmar que o produto não perde silenciosamente suas relações anteriores.

---

# Fase 5 — Corrigir layout do Admin no desktop e mobile

## Problema

`settings-form__grid` usa Flexbox, enquanto `.form-field--full` usa regra de Grid:

```css
.form-field--full {
    grid-column: 1 / -1;
}
```

No mesmo bloco, portanto, `--full` não garante largura integral.

Além disso, o comportamento padrão `align-items: stretch` do Flexbox faz os campos acompanharem a altura da coluna de foto.

No mobile:

```css
.settings-form__grid {
    flex-direction: column;
}
```

mas permanece um `flex-basis` originalmente pensado como largura, podendo se transformar em altura excessiva.

## Objetivo visual

Desktop:

- inputs/selects: altura compacta, ~40–46px conforme padrão existente;
- textarea: altura própria e redimensionável;
- coluna de foto pode ser mais alta sem esticar campos vizinhos;
- descrição e foto devem respeitar intenção de largura total;
- ações alinhadas corretamente.

Mobile:

- uma coluna;
- sem alturas artificiais;
- inputs/selects compactos;
- foto adaptável;
- botões acessíveis;
- sem overflow horizontal.

## Estratégia preferida

Avaliar migrar apenas:

```text
.settings-form__grid
```

para CSS Grid responsivo.

Exemplo conceitual, não obrigatório:

```css
.settings-form__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 100px 100px;
    align-items: start;
}

.settings-form__grid .form-field--full {
    grid-column: 1 / -1;
}
```

A solução final deve respeitar todas as abas:

- Categorias;
- Subcategorias;
- Tipos;
- Grupos;
- Sabores.

Não corrigir sabores quebrando os formulários menores.

---

# Fase 6 — Auditoria de responsividade do catálogo público

Não refazer o catálogo do zero.

Já existem breakpoints e boa parte do sistema é responsivo.

Corrigir regressões específicas.

## Resoluções mínimas

Testar:

```text
320x568
360x800
375x812
390x844
412x915
430x932
768x1024
850x900
1024x768
1366x768
1920x1080
```

## Verificar

- header;
- identidade/logo;
- hero;
- título longo;
- descrição;
- detalhes comerciais;
- botão compartilhar;
- busca;
- filtros de categoria;
- filtros tipo/grupo;
- títulos de seções;
- cards;
- fotos 1:1;
- nome de produto longo;
- preço;
- descrições;
- botão adicionar;
- modal de sabores;
- lista de sabores;
- quantidade +/-;
- badges;
- subtotal;
- carrinho;
- drawer;
- total;
- pedido mínimo;
- WhatsApp;
- footer;
- toast;
- estados vazios;
- estados de erro.

## Regras

- nenhum scroll horizontal global;
- nenhum conteúdo cortado;
- `min-width: 0` onde necessário;
- touch targets adequados;
- evitar largura fixa sem `max-width`;
- manter desktop existente quando estiver correto.

---

# Fase 7 — Corrigir tema `lu-leve-e-saudavel`

## Problema de proporção de logo

O CSS geral suporta:

```text
square
portrait_3_4
landscape_4_3
```

Porém o tema da Lu força `.catalog-identity-logo` para dimensões quadradas.

Também usa `object-fit: cover`, podendo cortar logos verticais/horizontais.

## Correção

O tema deve estilizar aparência, mas respeitar os estados estruturais:

```text
[data-ratio="square"]
[data-ratio="portrait_3_4"]
[data-ratio="landscape_4_3"]
```

Não sobrescrever todos como quadrados.

Preservar:

- 1:1;
- 3:4;
- 4:3.

Preferir `object-fit: contain` para logos, salvo se houver razão comprovada para `cover`.

## Mobile

Manter tamanhos responsivos específicos por proporção.

Testar os três formatos em:

```text
desktop
620px
420px
360px
```

---

# Fase 8 — Cache busting e versionamento

## Objetivo

Subir para:

```text
0.3.9
```

somente após os testes.

Atualizar de forma consistente:

```text
admin/VERSION
catalogo/VERSION
admin/CHANGELOG.md
query strings relevantes
```

Se houver changelog do catálogo, atualizar também.

## Tema da Lu

Hoje o arquivo:

```text
assets/css/themes/lu-leve-e-saudavel.css
```

é carregado sem versão.

Adicionar cache busting consistente, por exemplo:

```text
assets/css/themes/lu-leve-e-saudavel.css?v=0.3.9
```

ou mecanismo equivalente centralizado.

## Versão exibida na UI

Remover valores legados como:

```text
ADMIN / 0.1.12
```

quando a versão real for:

```text
0.3.9
```

Não manter hardcode antigo em `catalog-identity.js`.

Preferir uma única fonte de verdade, quando viável.

---

# Fase 9 — Testes automatizados de regressão

Executar todos os testes atuais.

Adicionar testes que cubram comportamento, não apenas presença de strings.

## Casos mínimos

### Editor

```text
- uma única inicialização;
- um único botão por input;
- Apply uma vez;
- input.files atualizado;
- editor não reabre;
- produto;
- sabor;
- logo;
```

### Sabores

```text
- botão reabilitado em sucesso;
- botão reabilitado em erro;
- imagem antiga removida após substituição bem-sucedida;
- imagem nova limpa se update falhar;
- novo sabor não reporta sucesso falso;
```

### Produto ↔ sabores

```text
- falha no salvamento não destrói silenciosamente relações anteriores.
```

### Layout

Quando viável com DOM/browser:

```text
- formulário não estica campos;
- mobile sem overflow;
- tema Lu respeita proporções de logo.
```

## Teste manual/browser

Mesmo com testes unitários passando, realizar smoke test real no navegador.

---

# Fase 10 — Revisão final

Antes do commit:

```bash
git status
git diff --check
git diff
```

Confirmar:

- nenhuma migration nova desnecessária;
- nenhum secret novo;
- nenhum arquivo de cliente alterado sem necessidade;
- versões sincronizadas;
- changelog atualizado;
- nenhuma duplicação de editor;
- nenhum botão preso;
- nenhum erro de console relevante;
- nenhum request de upload/update inesperadamente duplicado.

---

# Critérios de aceite

A tarefa só está concluída quando:

```text
[ ] Apenas 1 image-editor ativo
[ ] Apenas 1 "Ajustar foto atual" por imagem
[ ] Apply funciona em 1 confirmação
[ ] Salvar sabor funciona em 1 clique
[ ] Botão Salvar nunca fica preso
[ ] Troca de foto não deixa imagem antiga órfã
[ ] Novo sabor não gera sucesso falso em falha de image_path
[ ] Exclusão trata falha de Storage
[ ] Produto não perde relações de sabores em falha parcial
[ ] Formulários compactos no desktop
[ ] Formulários corretos no mobile
[ ] Catálogo sem overflow horizontal
[ ] Modal de sabores funcional em celular
[ ] Carrinho funcional em celular
[ ] Tema Lu respeita 1:1, 3:4 e 4:3
[ ] Logos não são cortadas indevidamente
[ ] Cache busting atualizado
[ ] Versão real = 0.3.9
[ ] Testes existentes continuam passando
[ ] Novos testes de regressão passam
[ ] Smoke test manual concluído
```

---

# Saída esperada do agente

Ao terminar, fornecer um relatório objetivo:

```text
1. Diagnóstico das causas
2. Arquivos alterados
3. Correções aplicadas
4. Testes executados
5. Resultado dos testes
6. Riscos restantes
7. Itens que exigiriam migration, se houver
8. git status
9. versão final
10. commit recomendado
```

Não fazer push automaticamente, a menos que isso esteja explicitamente autorizado no ambiente.

---

# Commit recomendado

Se tudo estiver concluído:

```text
catalogo - v0.3.9 - estabiliza editor, sabores e responsividade
```

Alternativa no padrão semântico:

```text
fix(catalogo): estabiliza editor de imagens, sabores e responsividade
```
