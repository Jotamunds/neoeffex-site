# Neoeffex — Contexto do Projeto

Este arquivo descreve a estrutura e os conceitos principais do projeto.

Atualize-o quando houver mudanças arquiteturais relevantes.

## Visão geral

A Neoeffex possui um site principal, um sistema de catálogo/admin e páginas demonstrativas de modelos de sites.

O projeto deve permitir a criação de soluções reutilizáveis para diferentes clientes sem duplicar desnecessariamente regras de negócio.

## Estrutura principal

### `/admin`

Painel administrativo do sistema de catálogo.

Responsabilidades incluem, conforme a implementação atual:

- autenticação;
- gerenciamento de catálogos;
- categorias;
- produtos;
- identidade do catálogo;
- configurações;
- status ativo/pausado;
- informações comerciais;
- gerenciamento relacionado ao catálogo público.

### `/catalogo`

Frontend público do catálogo.

Responsabilidades incluem:

- exibição de identidade do catálogo;
- categorias;
- produtos;
- busca/filtros quando disponíveis;
- carrinho;
- total do pedido;
- envio do pedido pelo WhatsApp;
- experiência mobile-first.

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
