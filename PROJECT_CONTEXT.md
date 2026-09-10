# Neoeffex — Contexto do Projeto

Este arquivo descreve a estrutura e os conceitos principais do projeto.

Atualize-o quando houver mudanças arquiteturais relevantes.

## Visão geral

A Neoeffex possui um site principal, um sistema de catálogo/admin e páginas demonstrativas de modelos de sites.

O projeto deve permitir a criação de soluções reutilizáveis para diferentes clientes sem duplicar desnecessariamente regras de negócio.

## Estrutura principal

### `/` (Home Principal — v0.2.0)

A home principal da Neoeffex (`https://neoeffex.com.br/`) apresenta a experiência imersiva promovida a partir da `modelos/preview-vitrine`:

- `index.html` na raiz;
- Assets dedicados e isolados em `/assets/home/` (`css/`, `js/`, `js/three/`, `images/`, `videos/`);
- Three.js nativo para o N de partículas interativo e para o Prisma Espacial 3D;
- Header institucional com links para Diferenciais, Modelos, Planos, Como funciona e CTA "Pedir orçamento" apontando para `/planos/`;
- A home anterior (0.1.15) está preservada em `/archive/home-v0.1.15/`;
- A `modelos/preview-vitrine` (v0.6.1) permanece preservada e funcional como referência técnica.

### `/admin`

Painel administrativo do sistema de catálogo.

Responsabilidades incluem, conforme a implementação atual:

- autenticação;
- gerenciamento de catálogos, perfis (`catalog_profile`, `minimum_order_quantity`) e proporção de logo (`logo_aspect_ratio`: `square`, `portrait_3_4`, `landscape_4_3`);
- configurações estruturais em abas: Categorias, Subcategorias, Tipos, Grupos e Sabores;
- gerenciamento de sabores com CRUD, ordenação, foto padronizada 1:1 e status;
- cadastro e edição de produtos com fotos padronizadas 1:1, seleção estruturada de tipos, grupos e modos de compra (`purchase_mode: simple | flavor_bundle`);
- editor universal de imagens (`image-editor.js`) para recorte/ajuste de produtos, sabores e logotipo, com suporte à edição de fotos existentes;
- associação de sabores disponíveis ao produto com ordenação, adicionais (`additional_price`) e disponibilidade individual;
- identidade do catálogo com pré-visualização responsiva do logotipo da loja;
- status ativo/pausado;
- informações comerciais;
- gerenciamento relacionado ao catálogo público.

### `/catalogo`

Frontend público do catálogo.

Responsabilidades incluem:

- exibição de identidade do catálogo com suporte a logo quadrada (1:1), vertical (3:4) e horizontal (4:3);
- fotos de produtos e sabores no catálogo público e modal padronizadas em 1:1 sem distorção;
- branding discreto e padronizado da plataforma ("Tecnologia Neoeffex") no rodapé, mantendo a identidade da loja como principal;
- categorias e facetas organizacionais;
- produtos simples e bundles com seleção de sabores (`flavor_bundle`);
- modal de distribuição exata de sabores e cálculo em tempo real de acréscimos;
- busca/filtros quando disponíveis;
- carrinho com suporte a múltiplos itens bundle e produtos simples, mantendo retrocompatibilidade;
- validação de pedido mínimo (`minimum_order_quantity`) bloqueando apenas a finalização pelo WhatsApp;
- total do pedido e envio discriminado de mensagem pelo WhatsApp com detalhamento de sabores, acréscimos e subtotais;
- experiência mobile-first e responsividade completa (320px a 1920px+).


### `/modelos`

Landing pages demonstrativas que podem ser adaptadas para clientes.

Os modelos devem ser independentes o máximo possível dos dados de um cliente específico.

Modelos conhecidos no projeto:

- `/modelos/hamburgueria`
- `/modelos/clinica-odontologica`
- `/modelos/hortifruti`

Cada um pode possuir um `GEMINI.md` específico.

## Backend

O sistema de catálogo utiliza Supabase.

Áreas relacionadas podem incluir:

- usuários/autenticação;
- catálogos;
- categorias;
- produtos;
- identidade e configurações;
- relacionamentos entre cliente/conta e catálogos.

Qualquer mudança no banco deve considerar dados existentes e múltiplos clientes.

Não presumir que uma conta possui apenas um catálogo.

## Catálogo

O catálogo é um recurso reutilizável da Neoeffex.

Uma landing page deve conseguir direcionar ou integrar-se ao catálogo correspondente sem reimplementar o sistema de pedidos.

O catálogo público e o admin devem permanecer desacoplados da identidade visual específica de uma única landing.

## Identificação de catálogo

Catálogos usam uma identificação/slug adequada para URL ou referência.

Regras esperadas:

- sem espaços;
- preferencialmente minúsculas;
- sem caracteres especiais inadequados para URL;
- gerada automaticamente a partir do nome quando aplicável;
- edição manual pode continuar disponível quando o fluxo existente permitir.

A implementação deve ser genérica.

## Carrinho e WhatsApp

O catálogo possui fluxo de carrinho e envio de pedido pelo WhatsApp.

Mudanças nesse fluxo devem considerar:

- itens;
- quantidades;
- adicionais, quando existirem;
- total;
- formatação da mensagem;
- comportamento após o envio;
- possibilidade de restaurar estado quando essa função existir.

## Identidade visual do catálogo

Logo, textos, descrição e outros elementos de identidade devem funcionar para diferentes contas e catálogos.

Nunca crie correções específicas para um único slug se o problema for de layout ou componente compartilhado.

## Deploy e rotas

Preserve as rotas públicas já existentes.

Antes de alterar ferramentas de build ou estrutura de pastas, verifique como o site é publicado e se a rota final continuará funcionando.

Modelos conhecidos:

- `/modelos/hamburgueria`
- `/modelos/clinica-odontologica`
- `/modelos/hortifruti`

## Filosofia técnica

Prioridades:

1. estabilidade;
2. compatibilidade;
3. simplicidade;
4. reutilização;
5. qualidade visual;
6. performance;
7. facilidade de manutenção.

Tecnologia deve servir ao projeto, não o contrário.
