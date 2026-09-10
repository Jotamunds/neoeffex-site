# Neoeffex — Decisões do Projeto

Este arquivo guarda decisões duradouras que futuras alterações devem respeitar.

Não use este arquivo como changelog.

---

## Geral

- O projeto deve evoluir incrementalmente.
- Funcionalidades existentes devem ser preservadas durante alterações não relacionadas.
- Soluções genéricas têm prioridade sobre exceções específicas de cliente.
- Antes de adicionar frameworks ou bibliotecas, verificar se são realmente necessários.

## Catálogo

- Uma conta pode possuir mais de um catálogo.
- Nunca presumir um único catálogo ativo ou existente por conta.
- Correções de identidade, logo, layout ou dados não devem ser específicas para um slug.
- O catálogo deve continuar reutilizável por diferentes clientes e landings.
- O nome do catálogo pode alimentar automaticamente sua identificação/slug.
- O slug deve ser adequado para URL: minúsculo, sem espaços e sem caracteres especiais inadequados.
- Se o usuário editar manualmente a identificação, a implementação deve respeitar o comportamento definido no sistema, sem impedir personalização legítima.
- O envio do pedido por WhatsApp faz parte do fluxo oficial do catálogo.

## Admin

- Alterações no Admin devem funcionar com múltiplos catálogos.
- O painel do lojista administra lojas já provisionadas. O fluxo de criação de loja não deve ser restaurado no frontend sem nova decisão de produto.
- A exclusão definitiva de loja/catálogo foi retirada da interface do lojista para evitar perda acidental de acesso ou deixar contas sem loja provisionada.
- A organização estrutural do catálogo fica centralizada na seção "Configurações" (em substituição ao antigo modal simples de categorias), gerenciando em abas: Categorias, Subcategorias, Tipos e Grupos.
- Na Etapa 4, o formulário de produto integra-se diretamente às Configurações da loja ativa: Tipo e Grupos são selecionados exclusivamente a partir de `product_types` e `product_groups` (sem digitação livre nem criação em tela). Categoria e Subcategoria possuem dropdowns dedicados e coordenados que persistem em `products.category_id`.
- Os campos `products.product_type` (texto) e `products.product_groups` (array de texto) permanecem no PostgreSQL como camada de persistência e total compatibilidade com o catálogo público, sem FK nova nem migrações.
- Proteção de consistência: exclusão e renomeação de Tipos e Grupos em uso por produtos do catálogo ativo são bloqueadas na área de Configurações, orientando o lojista a alterar os produtos primeiro. A alteração de ordem (`sort_order`) permanece sempre permitida.
- Preservação legada: produtos com classificações antigas inexistentes em Configurações exibem avisos claros na edição e mantêm seus valores intactos sem exclusão silenciosa.
- Na Etapa 5, a arquitetura de catálogo único por loja e gestão em Configurações foi estabilizada. O isolamento multiloja fecha preventivamente todos os formulários e modais (produto, edição de catálogo e exclusão) ao alternar de loja. Estados de erro na leitura do banco diferenciam-se expressamente de estados vazios. Regras explícitas de não restauração de criação de lojas e de não utilização de texto livre no produto foram consolidadas.
- O estado de autenticação deve ser consistente entre abas quando o mecanismo atual permitir sincronização.
- Modais/painéis não devem fechar por interações iniciadas dentro do conteúdo e finalizadas fora de maneira acidental.
- Exclusão de dados deve exigir confirmação quando houver risco de perda.
- Mudanças de layout compartilhado devem ser genéricas, não específicas para Lu Leve e Saudável ou outro cliente.

## Landing pages

- `/modelos/` contém demonstrações reutilizáveis.
- Modelos não devem depender de conteúdo fixo de um único cliente.
- Cores principais devem preferencialmente ser centralizadas em CSS Custom Properties.
- Cada modelo deve ser simples de personalizar.
- As landing pages devem permanecer responsivas.
- Integrações de catálogo devem reutilizar o sistema Neoeffex em vez de criar um catálogo paralelo.

## Home Principal (/) — v0.2.0

- A raiz `/` é a representação oficial de `https://neoeffex.com.br/` (sem subpasta `/home/` e sem redirects).
- Arquitetura de isolamento (Opção 2): assets específicos da home residem em `/assets/home/` (`css/`, `js/`, `images/`, `videos/`, `js/three/`).
- Não carregar conjuntamente arquivos legados como `/assets/css/style.css` na home nova para evitar colisões.
- Header institucional limpo com marca, navegação (Diferenciais, Modelos, Planos, Como funciona) e CTA "Pedir orçamento" direcionando a `/planos/`.
- Snapshot da home anterior preservado em `/archive/home-v0.1.15/` com VERSION 0.1.15.
- A `modelos/preview-vitrine` continua preservada na versão `v0.6.1` como referência técnica e vitrine de demonstrações.

## Vitrine de Modelos (/modelos)

- Rota: `/modelos/preview-vitrine` (vitrine principal de demonstração tecnológica e projetos).
- O header (topbar) deve ocupar 100% da largura visualmente com blur e fundo translúcido, com conteúdo interno limitado por max-width e centralizado.
- O hero mantém centralização horizontal e camada de partículas atrás dos textos editoriais.
- O logo N em partículas possui ritmo em 5 fases contínuas com interpolação C1 (w_form e w_disp) e partição da unidade.
- A calibração da escala do N é isolada via shader (uNScale) para não encolher o campo ambiente circundante.
- Distância efetiva de transformação calibrada em 180–220vh via ScrollTrigger sem duplicação de pinSpacing.
- Elementos visuais possuem restrição de arraste/seleção (user-select: none), preservando seleção em textos editáveis, inputs, links, botões e iframes.
- A palavra "Neoeffex" no footer recebe destaque exclusivo em negrito e sublinhado (.footer-brand).

## Hamburgueria

- Rota: `/modelos/hamburgueria`.
- A proposta visual pode utilizar experiência 3D.
- Para a experiência 3D, Vite + Three.js + GSAP são aceitáveis quando já fizerem parte da implementação escolhida.
- O ativo principal 3D pode usar GLB otimizado, materiais PBR e iluminação adequada.
- Não substituir silenciosamente uma experiência 3D solicitada por imagem estática.
- Dependências 3D devem ficar concentradas na parte que realmente precisa delas.
- O restante da landing deve permanecer relativamente simples e performático.

## Clínica odontológica

- Rota: `/modelos/clinica-odontologica`.
- Paleta principal: branco e azul-claro.
- O hero preferido utiliza imagem grande como plano de fundo, com texto sobreposto.
- Evitar o padrão genérico de texto à esquerda e imagem isolada à direita quando o hero estiver sendo redesenhado.
- Deve transmitir aparência moderna, limpa e tecnológica sem perder credibilidade clínica.
- Deve poder receber integração com o catálogo Neoeffex.

## Hortifruti

- Rota: `/modelos/hortifruti`.
- A identidade visual deve lembrar claramente hortifruti.
- Verde é uma cor importante da identidade.
- Azul pode ser usado como cor complementar quando combinar com a composição.
- Imagens e elementos podem remeter a verduras, frutas, tomates, cenouras, saladas e produtos frescos.
- O resultado não deve parecer uma landing genérica com apenas a cor alterada.
- Deve poder receber integração com o catálogo Neoeffex.

## Git

- Branches existentes servem como proteção e histórico de desenvolvimento.
- Não apagar branches por padrão.
- Não usar force push como solução comum.
- Em merges, preservar conscientemente funcionalidades válidas de ambos os lados.
- Antes de resolver conflito escolhendo um arquivo inteiro de um lado, verificar se o outro lado possui mudanças que precisam ser mantidas.

## Perfis de Catálogo, Modos de Compra e Sabores (v0.3.7)

- **Perfis de Catálogo (`catalog_profile`)**: Representam presets e capabilities centrais (`standard`, `food`, `marmitas`, `services`). Não devem ser usados como amarrações ou travas rígidas condicionadas por slug (proibido `if (slug === '...')`). A definição de capacidades é centralizada no módulo `assets/catalog/profiles.js`.
- **Modos de Compra (`purchase_mode`)**: O comportamento transacional do produto é definido a nível de produto (`simple`, `flavor_bundle`). Mesmo dentro de um catálogo com perfil `marmitas`, produtos avulsos (como tortas ou lasanhas) usam `purchase_mode = 'simple'`.
- **Sabores (`flavors`) e Relações (`product_flavors`)**:
  - `flavors` é gerenciado dentro de Configurações, isolado por `catalog_id`.
  - `product_flavors` possui chave estrangeira composta e índice único composto `(catalog_id, product_id, flavor_id)`, impedindo terminantemente no banco de dados que um produto de um catálogo seja associado a sabores de outro catálogo.
  - Exclusão de sabores em uso por produtos é bloqueada preventivamente na interface.
- **Distribuição de Sabores em Bundles**: No catálogo público, produtos `flavor_bundle` exigem validação estrita de soma: `soma das unidades dos sabores = quantidade total do bundle`. Confirmação é desabilitada para seleções incompletas ou com excesso.
- **Acréscimos de Preço (`additional_price`)**: Calculados estritamente multiplicando o preço adicional pela quantidade daquele sabor no bundle (`sum(additional_price * quantity)`), somado uma única vez ao preço base do produto.
- **Pedido Mínimo (`minimum_order_quantity`)**: Bloqueia apenas a finalização do pedido (desabilitando o botão de envio pelo WhatsApp com aviso amigável de itens faltantes), nunca a navegação ou a adição de produtos ao carrinho.
- **Compatibilidade do Carrinho e WhatsApp**:
  - Carrinho mantém total retrocompatibilidade com o formato legado em `localStorage` (`{ [productId]: quantity }`) e produtos simples.
  - Mensagem do WhatsApp preserva a mensagem personalizada da loja e detalha os sabores, quantidades, acréscimos e subtotais.

