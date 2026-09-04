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
