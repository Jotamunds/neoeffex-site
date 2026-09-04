# Neoeffex — Instruções de Desenvolvimento

Você está trabalhando no projeto Neoeffex.

O objetivo é continuar o desenvolvimento incremental do projeto existente, preservando arquitetura, funcionalidades, identidade visual e decisões anteriores.

Leia também:

@./PROJECT_CONTEXT.md
@./DECISIONS.md

## Regra principal

NUNCA recrie o projeto do zero sem necessidade.

Antes de alterar qualquer coisa:

1. analise os arquivos existentes;
2. entenda como a funcionalidade atual foi implementada;
3. identifique dependências e impactos;
4. faça a menor alteração necessária;
5. preserve tudo que já estiver funcionando;
6. verifique se a alteração afeta outras páginas, clientes ou componentes;
7. teste ou valide o resultado antes de considerar a tarefa concluída.

Não substitua arquivos inteiros quando uma alteração localizada for suficiente.

## Projeto real, não protótipo descartável

Trate a Neoeffex como um projeto real em evolução.

Antes de implementar:

- investigue o problema;
- procure a causa;
- considere riscos;
- escolha uma solução simples e sustentável;
- somente depois altere o código.

Evite hacks específicos para um cliente quando a funcionalidade deveria ser genérica.

## Preservação

Não remova ou altere funcionalidades que não fazem parte da solicitação.

Ao editar HTML, CSS, JavaScript, APIs, Supabase, catálogo, autenticação, carrinho, admin ou modelos:

- preserve o comportamento existente, salvo solicitação explícita;
- não altere rotas, IDs, nomes de arquivos ou contratos sem verificar onde são usados;
- procure referências antes de renomear ou remover;
- mantenha compatibilidade com múltiplos catálogos e múltiplos clientes.

## Landing pages

As landing pages da Neoeffex devem:

- ter aparência profissional;
- funcionar bem em desktop e mobile;
- ter identidade coerente com o segmento;
- evitar aparência genérica de template de IA;
- usar animações com propósito;
- ter CTAs claros;
- ter boa performance;
- manter acessibilidade básica;
- respeitar `prefers-reduced-motion` quando houver animações significativas.

Use HTML, CSS e JavaScript simples quando forem suficientes.

Use React, Vite, Three.js, GSAP ou outras dependências somente quando houver benefício real.

## Modelos

As páginas dentro de `/modelos/` são demonstrações reutilizáveis.

Portanto:

- não devem depender de dados específicos de um único cliente;
- devem ser fáceis de personalizar;
- cores principais devem preferencialmente usar CSS Custom Properties;
- textos, imagens, telefones e informações comerciais devem ser fáceis de substituir;
- integrações com o catálogo Neoeffex devem seguir uma estrutura reutilizável;
- cada modelo deve continuar funcionando mesmo quando adaptado a outro cliente.

## Catálogo e Admin

Ao trabalhar com catálogo, admin, produtos, categorias, carrinho ou pedidos:

- uma conta pode possuir mais de um catálogo;
- nunca presuma um único catálogo por conta;
- nunca corrija problemas usando exceção específica para um slug;
- prefira soluções genéricas;
- valide mentalmente o impacto em outros catálogos;
- não coloque credenciais privadas diretamente no frontend;
- preserve isolamento de dados por cliente;
- mantenha compatibilidade entre admin, catálogo público e landing pages.

## Design

Evite:

- excesso de gradientes;
- animações sem propósito;
- textos gigantes sem hierarquia;
- repetição de muitos cards visualmente iguais;
- aparência genérica de site gerado automaticamente;
- efeitos excessivos de hover;
- bibliotecas pesadas para efeitos simples.

Prefira:

- bom espaçamento;
- tipografia consistente;
- hierarquia clara;
- imagens de qualidade;
- seções visualmente distintas;
- microinterações;
- responsividade;
- componentes reaproveitáveis.

## Responsividade

Toda alteração visual deve considerar:

- desktop grande;
- notebook;
- tablet;
- smartphone.

Não resolva desktop quebrando mobile, nem o contrário.

Evite medidas rígidas quando uma solução fluida for melhor.

## Código

Siga primeiro o padrão já existente.

Ao criar código novo:

- mantenha organização;
- use nomes claros;
- evite duplicação;
- prefira funções pequenas;
- evite complexidade desnecessária;
- procure implementação equivalente antes de criar outra;
- preserve compatibilidade com o deploy atual.

## Correção de bugs

Ao receber um bug, determine:

1. comportamento esperado;
2. comportamento atual;
3. causa provável;
4. arquivo e trecho responsáveis;
5. impacto da correção em outros componentes.

Depois implemente.

Não altere CSS ou JavaScript aleatoriamente até "parecer funcionar".

## Capturas de tela

Quando houver screenshot de um problema:

- compare o comportamento visual com o código atual;
- procure a causa estrutural;
- não faça uma correção válida apenas para a resolução da captura;
- mantenha a solução responsiva.

## Git e versões

Considere Git como proteção contra regressões.

Não:

- apague branches;
- force push;
- sobrescreva `main`;
- descarte alterações existentes;

sem solicitação explícita.

Se houver `VERSION`, `CHANGELOG.md` ou equivalente na área modificada, verifique se a alteração exige atualização.

## Continuidade

Use `PROJECT_CONTEXT.md` para entender a arquitetura atual.

Use `DECISIONS.md` para respeitar decisões já tomadas.

Quando uma decisão importante e duradoura for tomada, atualize `DECISIONS.md`.

Quando a arquitetura, estrutura de pastas, integração ou fluxo principal mudar, atualize `PROJECT_CONTEXT.md`.

Não transforme esses arquivos em logs de cada pequena alteração.

## Objetivo final

O objetivo não é apenas fazer a solicitação funcionar.

O objetivo é continuar construindo a Neoeffex de forma incremental, estável, reutilizável e compatível com o que já existe.
