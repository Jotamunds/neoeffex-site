# NEOEFFEX — PLANO DE DESENVOLVIMENTO DA PÁGINA `/planos/`

## Objetivo

Criar a página pública:

```text
https://neoeffex.com.br/planos/
```

A página deve apresentar de forma clara:

- os planos de implantação de sites da Neoeffex;
- os planos mensais de infraestrutura e manutenção;
- o que está e não está incluído;
- como funcionam revisões, horas técnicas e solicitações;
- um fluxo de **solicitação de orçamento**, sem compra direta.

A pasta `/planos/` será criada vazia antes do início do desenvolvimento.

---

# 1. PRINCÍPIOS GERAIS

## 1.1. Identidade Neoeffex

A página `/planos/` deve parecer parte natural do site principal da Neoeffex.

Antes de criar qualquer layout, analisar o projeto existente para identificar e reutilizar, sempre que fizer sentido:

- header;
- footer;
- tipografia;
- cores;
- espaçamentos;
- grid;
- botões;
- tratamento de títulos;
- bordas;
- cards;
- elementos decorativos;
- comportamento responsivo;
- padrões de animação;
- acessibilidade;
- convenções de CSS e JavaScript.

Não criar uma segunda identidade visual.

---

## 1.2. Nível de animação

Esta página pode e deve ser **mais estática e comercial** que a home principal.

O foco é:

1. leitura;
2. comparação;
3. clareza de preço;
4. entendimento do serviço;
5. conversão em solicitação de orçamento.

Ainda assim, a página deve manter vida visual.

São desejáveis:

- entrada suave de seções ao entrar no viewport;
- fade + deslocamento curto;
- stagger discreto entre cards;
- microinterações em hover/focus;
- transições suaves de botões;
- abertura e fechamento suaves do modal;
- pequenos detalhes animados coerentes com a Neoeffex.

Evitar:

- animações contínuas excessivas;
- elementos disputando atenção com preços;
- efeitos pesados apenas decorativos;
- Three.js/3D sem necessidade;
- movimentos que prejudiquem comparação dos planos.

A animação deve apoiar a hierarquia, não dominar a página.

Respeitar `prefers-reduced-motion`.

---

## 1.3. Regra comercial principal

**Não deve existir botão de comprar, assinar, finalizar compra ou checkout.**

Nenhuma ação da página representa contratação automática.

CTAs permitidos:

- `Solicitar orçamento`
- `Quero este plano`
- `Solicitar proposta`
- `Falar sobre este plano`
- `Conversar sobre meu projeto`

CTA principal recomendado:

```text
Solicitar orçamento
```

O fluxo é:

```text
VISITANTE
    ↓
CONSULTA OS PLANOS
    ↓
SOLICITA ORÇAMENTO
    ↓
NEOEFFEX ANALISA
    ↓
ENTRA EM CONTATO
    ↓
ENVIA PROPOSTA
    ↓
CLIENTE ACEITA
    ↓
CONTRATAÇÃO
```

---

# 2. PLANOS DEFINIDOS

## 2.1. Implantação

### Landing Page

**R$ 590**

Parcelamento:
- até 2x;
- sujeito a juros e condições do meio de pagamento.

Diretrizes:

- 1 página;
- aproximadamente 6–8 seções, conforme projeto;
- responsiva;
- integração com WhatsApp quando aplicável;
- formulário básico quando previsto;
- SEO técnico inicial;
- animações leves;
- configuração e publicação;
- 2 ciclos de revisão;
- 30 dias de garantia técnica.

---

### Site Institucional

**R$ 890**

Parcelamento:
- até 3x;
- sujeito a juros e condições do meio de pagamento.

Diretrizes:

- até 5 páginas principais;
- design alinhado à identidade do negócio;
- responsividade;
- WhatsApp;
- formulário quando previsto;
- SEO técnico inicial;
- animações leves/intermediárias;
- configuração e publicação;
- 2 ciclos de revisão;
- 30 dias de garantia técnica.

Páginas adicionais não estão automaticamente incluídas.

---

### Site + Catálogo Neoeffex

**R$ 1.090**

Parcelamento:
- até 4x;
- sujeito a juros e condições do meio de pagamento.

Diretrizes:

- site profissional;
- catálogo digital;
- painel administrativo;
- categorias;
- produtos;
- carrinho;
- pedido por WhatsApp;
- identidade do estabelecimento;
- animações leves/intermediárias;
- configuração inicial limitada de produtos;
- publicação;
- treinamento básico;
- garantia técnica.

O sistema de catálogo não deve ser apresentado como desenvolvimento exclusivo do zero para cada cliente. Trata-se de uma solução Neoeffex configurada para o negócio.

---

### Totalmente Personalizado

**A partir de R$ 1.690**

Parcelamento:
- até 6x;
- sujeito a juros e condições do meio de pagamento.

Pode envolver:

- experiências visuais avançadas;
- animações avançadas;
- Three.js;
- WebGL;
- 3D;
- integrações;
- APIs;
- funcionalidades próprias;
- sistemas;
- dashboards;
- fluxos personalizados.

O valor exibido é somente ponto de partida.

Nunca comunicar que qualquer projeto personalizado custa obrigatoriamente R$ 1.690.

---

# 3. PLANOS MENSAIS

## Infraestrutura + Segurança

**R$ 79,90/mês**

Inclui:

- hospedagem gerenciada;
- SSL;
- DNS;
- backups;
- monitoramento básico;
- atualizações técnicas;
- atualizações de segurança aplicáveis;
- suporte para problemas relacionados à infraestrutura gerenciada.

Não inclui franquia mensal de alterações de conteúdo.

---

## Cuidado

**R$ 169,90/mês**

Inclui tudo do plano Infraestrutura + Segurança.

Franquia:

```text
até 2 horas técnicas por mês
```

Pode ser utilizada em pequenas solicitações, por exemplo:

- troca de textos;
- troca de imagens;
- links;
- telefone;
- endereço;
- informações;
- pequenos ajustes visuais;
- pequenas modificações em conteúdo existente.

Sugestão de destaque visual:

```text
Mais escolhido
```

---

## Evolução

**R$ 289,90/mês**

Inclui tudo do plano Cuidado.

Franquia:

```text
até 5 horas técnicas por mês
```

Pode envolver:

- novas pequenas seções;
- melhorias de layout;
- aprimoramentos de experiência;
- otimizações;
- ajustes mais amplos;
- evolução recorrente;
- atendimento prioritário.

Atendimento prioritário não significa atendimento instantâneo.

---

# 4. REGRAS DAS HORAS TÉCNICAS

As horas:

- são válidas no ciclo mensal vigente;
- não acumulam para o mês seguinte;
- devem ser registradas internamente;
- podem ser contabilizadas em blocos mínimos de 15 minutos;
- abrangem trabalho técnico necessário para executar a solicitação.

Podem contar:

- análise técnica;
- implementação;
- alteração de código;
- configuração;
- testes;
- ajustes responsivos;
- publicação;
- validação.

Uma conversa simples não deve ser tratada como cronômetro automaticamente.

Solicitações grandes devem ser avaliadas antes da execução.

Se uma solicitação superar o saldo disponível, a Neoeffex poderá:

- utilizar o saldo e cobrar horas adicionais;
- preparar orçamento específico;
- combinar execução parcial;
- propor execução em outro ciclo.

Mesmo que existam horas disponíveis, funcionalidades substancialmente novas podem exigir orçamento separado.

---

# 5. FORMULÁRIO DE SOLICITAÇÃO DE ORÇAMENTO

Não implementar como compra.

O formulário deve ser exibido em modal/pop-up.

## Campos obrigatórios

### Nome

```text
Seu nome
```

### Empresa ou marca

```text
Nome da empresa ou marca
```

### E-mail

```text
seuemail@empresa.com.br
```

### Telefone / WhatsApp

```text
(11) 99999-9999
```

### Plano desejado

Campo de seleção suspensa.

Opções:

```text
Selecione uma opção
Landing Page
Site Institucional
Site + Catálogo Neoeffex
Totalmente Personalizado
Ainda não sei qual plano escolher
```

### Plano mensal de interesse

Campo de seleção suspensa.

Opções:

```text
Quero conversar primeiro
Infraestrutura + Segurança
Cuidado
Evolução
Ainda não sei
```

### Descrição do pedido/projeto

Textarea.

Ajudar o cliente com uma orientação curta, por exemplo:

```text
Conte um pouco sobre sua empresa, o que você precisa e como imagina seu site.
```

Botão:

```text
Enviar solicitação
```

Mensagem de sucesso:

```text
Solicitação recebida.
A Neoeffex entrará em contato pelos dados informados para entender melhor o projeto e preparar a proposta.
```

---

## 5.1. Pré-seleção inteligente

Se o usuário clicar no botão de um card específico:

```text
Quero este plano
```

o modal deve abrir com o respectivo plano já selecionado.

Exemplo:

```text
Site + Catálogo Neoeffex
```

Se o modal for aberto por um CTA genérico:

```text
Solicitar orçamento
```

o campo começa em:

```text
Selecione uma opção
```

---

## 5.2. Reutilização do sistema existente

Antes de criar um novo sistema de envio:

1. investigar se a home da Neoeffex já possui modal/formulário de solicitação;
2. identificar como o formulário atual envia os leads;
3. reutilizar o mesmo fluxo quando tecnicamente adequado;
4. evitar duplicar lógica;
5. não expor segredos, chaves ou credenciais no frontend;
6. não alterar o formulário existente da home sem necessidade.

A página `/planos/` pode acrescentar dados como:

```text
origem
plano desejado
plano mensal
```

ao sistema de leads existente.

---

# 6. ESTRUTURA VISUAL PREVISTA

Estrutura conceitual:

```text
HEADER NEOEFFEX

HERO
├── título
├── texto
├── CTA implantação
└── CTA manutenção

COMO FUNCIONA
├── escolher projeto
├── solicitar orçamento
├── alinhamento
├── desenvolvimento
├── publicação
└── acompanhamento

PLANOS DE IMPLANTAÇÃO
├── Landing Page
├── Site Institucional
├── Site + Catálogo
└── Totalmente Personalizado

COMPARAÇÃO / EXPLICAÇÕES

TRANSIÇÃO
"Depois que seu site estiver no ar"

PLANOS MENSAIS
├── Infraestrutura + Segurança
├── Cuidado
└── Evolução

COMO FUNCIONAM AS HORAS

O QUE ESTÁ INCLUSO / O QUE NÃO ESTÁ

DOMÍNIO / HOSPEDAGEM / SERVIÇOS EXTERNOS

GARANTIA / REVISÕES

FAQ

CTA FINAL
"Solicitar orçamento"

FOOTER NEOEFFEX
```

---

# 7. ETAPAS DE DESENVOLVIMENTO

---

# ETAPA 1 — Base, rota e identidade visual

## Objetivo

Criar a estrutura inicial funcional da rota `/planos/`, sem antecipar as funcionalidades das etapas seguintes.

A pasta `/planos/` começará vazia.

## Antes de editar

Auditar o projeto atual.

Identificar:

- header usado pela Neoeffex;
- footer;
- CSS global;
- fontes;
- variáveis;
- componentes;
- breakpoints;
- scripts globais;
- caminhos relativos;
- convenções de organização;
- comportamento em subpastas.

## Implementar

Criar a base necessária para:

```text
/planos/
```

Preferencialmente seguindo a arquitetura já existente.

Exemplo, somente se compatível com o projeto:

```text
planos/
├── index.html
└── assets/
    ├── css/
    │   └── planos.css
    └── js/
        └── planos.js
```

Não criar arquivos desnecessários apenas para seguir este exemplo.

## Nesta etapa deve existir

- rota `/planos/`;
- HTML semântico inicial;
- header coerente com a Neoeffex;
- footer coerente com a Neoeffex;
- container principal;
- estrutura/base das futuras seções;
- responsividade estrutural;
- meta tags básicas;
- título da página;
- favicon e assets corretos;
- ausência de erros no console;
- caminhos relativos funcionando na subpasta.

## Não implementar ainda

- cards finais de preços;
- formulário funcional;
- modal;
- envio de leads;
- FAQ final;
- regras completas;
- animações elaboradas;
- lógica de pré-seleção;
- integração externa.

## Critério de conclusão

Ao acessar:

```text
/planos/
```

a página deve:

- carregar corretamente;
- parecer parte da Neoeffex;
- usar header/footer corretos;
- não quebrar assets;
- funcionar em desktop e mobile;
- estar pronta para receber a Etapa 2.

---

# ETAPA 2 — Hero e explicação do fluxo

## Objetivo

Construir a primeira experiência visual e explicar como a contratação funciona sem sugerir compra imediata.

## Criar

Hero com:

- título;
- apoio;
- CTA para planos de implantação;
- CTA para manutenção.

Possível direção de texto:

```text
Um site para começar.
Uma estrutura para continuar.
```

Texto de apoio:

```text
Escolha o tipo de projeto que sua empresa precisa. Depois da publicação, a Neoeffex pode continuar cuidando da infraestrutura, segurança e evolução do site.
```

## Criar seção "Como funciona"

Fluxo aproximado:

```text
01 Escolha o projeto
02 Solicite um orçamento
03 Alinhamos os detalhes
04 Construímos seu site
05 Publicamos
06 Continuamos cuidando
```

## Animações

Nesta etapa já podem entrar animações simples de entrada:

- hero;
- texto;
- CTAs;
- passos do fluxo.

Movimentos discretos.

## Não implementar ainda

- modal funcional;
- envio;
- planos mensais completos;
- FAQ.

---

# ETAPA 3 — Planos de implantação

## Objetivo

Construir os quatro planos de implantação com alta legibilidade e comparação simples.

## Planos

1. Landing Page — R$ 590 — até 2x
2. Site Institucional — R$ 890 — até 3x
3. Site + Catálogo Neoeffex — R$ 1.090 — até 4x
4. Totalmente Personalizado — a partir de R$ 1.690 — até 6x

Adicionar aviso geral:

```text
Parcelamentos sujeitos aos juros e condições do meio de pagamento.
```

## Cards

Os cards devem:

- ter hierarquia clara;
- destacar preço;
- destacar tipo de projeto;
- resumir principais inclusões;
- possuir CTA de orçamento;
- não possuir botão de compra;
- funcionar corretamente no mobile.

## CTA

Exemplos:

```text
Quero uma Landing Page
Quero um Site Institucional
Quero Site + Catálogo
Conversar sobre meu projeto
```

Nesta etapa o CTA pode ficar preparado para a integração da Etapa 5.

## Animações

- entrada leve ao viewport;
- stagger curto;
- hover/focus discreto;
- sem transformar cards em elementos instáveis.

---

# ETAPA 4 — Planos mensais e explicação das horas

## Objetivo

Explicar o que acontece depois da publicação.

## Criar transição

Direção:

```text
Depois que seu site estiver no ar
```

Explicar que a Neoeffex pode continuar cuidando do projeto.

## Criar três cards

### Infraestrutura + Segurança
R$ 79,90/mês

### Cuidado
R$ 169,90/mês
até 2 horas técnicas/mês

### Evolução
R$ 289,90/mês
até 5 horas técnicas/mês

## Criar explicação das horas

Informar de forma simples:

- horas não acumulam;
- são válidas no ciclo mensal;
- pequenas solicitações consomem a franquia;
- demandas maiores podem exigir orçamento;
- funcionalidades novas podem ficar fora da manutenção;
- saldo insuficiente deve ser alinhado antes da execução.

Não transformar a seção em contrato jurídico.

---

# ETAPA 5 — Modal e fluxo de solicitação de orçamento

## Objetivo

Criar o principal mecanismo de conversão da página.

## Antes de implementar

Auditar o formulário/modal existente da home da Neoeffex.

Determinar:

- se pode ser reutilizado;
- como envia informações;
- como valida campos;
- como apresenta sucesso/erro;
- como evitar duplicação de código.

## Implementar modal

Campos:

- nome;
- empresa/marca;
- e-mail;
- telefone/WhatsApp;
- plano desejado;
- plano mensal de interesse;
- descrição do projeto.

## Implementar

- validação;
- estados de erro;
- estado de envio;
- estado de sucesso;
- prevenção básica de envio duplicado;
- foco correto;
- `ESC` para fechar;
- fechamento seguro;
- bloqueio de scroll;
- retorno de foco ao elemento que abriu o modal.

## Pré-seleção

CTA de um plano específico deve abrir o modal com aquele plano selecionado.

CTA genérico deve abrir sem plano definido.

## Importante

Não criar compra ou checkout.

O resultado é somente uma solicitação de orçamento.

---

# ETAPA 6 — Explicações comerciais, garantia e FAQ

## Objetivo

Reduzir dúvidas e prevenir conflitos futuros sem deixar a página excessivamente jurídica.

## Explicar

### Implantação x manutenção

Nova funcionalidade não é automaticamente manutenção.

### Revisões

Os projetos padrão possuem 2 ciclos de revisão.

### Garantia técnica

30 dias para correção de falhas relacionadas ao que foi entregue.

Não inclui mudanças de opinião, novo conteúdo ou novo escopo.

### Conteúdo do cliente

Prazos dependem também do envio de:

- textos;
- imagens;
- logos;
- acessos;
- informações;
- aprovações.

### Serviços externos

Podem possuir custos separados:

- domínio;
- e-mail;
- APIs;
- plataformas;
- serviços externos.

### Hospedagem

Explicar infraestrutura gerenciada sem depender comercialmente do nome de um fornecedor específico.

### Migração/cancelamento

Explicar de forma simples que o cliente pode solicitar migração para infraestrutura própria, sujeito às condições aplicáveis e ao trabalho técnico necessário.

### SEO

Não prometer posição específica em mecanismos de busca.

## FAQ sugerido

- Qual plano é melhor para mim?
- Posso solicitar um orçamento sem saber qual plano escolher?
- O domínio fica em meu nome?
- O que acontece depois que o site é publicado?
- Preciso contratar manutenção?
- As horas do plano acumulam?
- Posso pedir novas páginas durante a manutenção?
- O que os 30 dias de garantia cobrem?
- Posso migrar o site futuramente?
- Serviços como domínio e e-mail estão incluídos?
- Quanto tempo leva para desenvolver um site?

---

# ETAPA 7 — Refinamento, responsividade, animações e testes finais

## Objetivo

Transformar a implementação funcional em uma página pronta para produção.

## Refinamento visual

Revisar:

- ritmo vertical;
- alinhamentos;
- hierarquia;
- tamanho dos preços;
- leitura;
- contraste;
- espaçamentos;
- consistência de cards;
- CTAs;
- footer;
- header.

## Animações

Adicionar/refinar somente movimentos úteis:

- entrada de seções;
- entrada escalonada de cards;
- microinterações;
- transições;
- modal.

Não aumentar artificialmente a quantidade de animações.

## Responsividade

Testar aproximadamente:

```text
1920px
1440px
1366px
1024px
768px
430px
390px
360px
```

## Acessibilidade

Verificar:

- teclado;
- `Tab`;
- foco;
- contraste;
- labels;
- modal;
- `ESC`;
- `aria`;
- `prefers-reduced-motion`;
- leitura por tecnologia assistiva.

## Testes funcionais

Testar:

- todos os CTAs;
- links internos;
- seleção de plano;
- modal;
- formulário vazio;
- e-mail inválido;
- telefone;
- textarea;
- envio duplicado;
- sucesso;
- erro de conexão;
- mobile;
- desktop;
- console;
- caminhos relativos;
- carregamento direto de `/planos/`.

## Performance

Evitar:

- dependências pesadas desnecessárias;
- imagens maiores que o necessário;
- JavaScript para efeitos que CSS resolve;
- carregamento de recursos da home sem utilização.

## Critério final

O usuário deve conseguir:

```text
entrar em /planos/
↓
entender as opções
↓
comparar preços
↓
entender implantação e mensalidade
↓
selecionar um plano
↓
abrir o formulário
↓
explicar o projeto
↓
enviar a solicitação
↓
receber confirmação
```

Sem qualquer compra automática.

---

# 8. REGRAS DE DESENVOLVIMENTO PARA TODAS AS ETAPAS

1. Não alterar páginas existentes sem necessidade.
2. Não quebrar a home.
3. Não refatorar componentes globais sem justificativa.
4. Não alterar identidade visual global apenas para atender `/planos/`.
5. Trabalhar somente no escopo da etapa solicitada.
6. Não antecipar etapas futuras.
7. Antes de alterar código compartilhado, verificar impacto em outras rotas.
8. Preservar acessibilidade.
9. Preservar responsividade.
10. Não adicionar dependências externas sem necessidade real.
11. Evitar código duplicado.
12. Não expor credenciais.
13. Não criar checkout.
14. Não utilizar linguagem que faça parecer que enviar o formulário representa contratação.
15. Registrar no final de cada etapa:
    - arquivos criados;
    - arquivos alterados;
    - decisões tomadas;
    - pontos que merecem atenção na próxima etapa;
    - como testar.

---

# 9. FORMATO DE CONCLUSÃO ESPERADO DO ANTIGRAVITY

Ao concluir cada etapa, responder aproximadamente:

```text
-----------
Etapa X

Arquivos criados/alterados

Atualizações

Como testar as atualizações

Riscos ou observações para a próxima etapa

Commit recomendado
-----------
```

Exemplo de commit:

```text
planos - v0.1.0 - cria base estrutural da pagina de planos
```

Não realizar commit automaticamente, salvo se for solicitado explicitamente.
