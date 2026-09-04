# Validação — v0.1.0

## Verificado

- Os quatro arquivos JavaScript passaram por `node --check`.
- Todos os caminhos locais de imagens, scripts e CSS existem; IDs são únicos
  e as âncoras internas apontam para elementos presentes.
- 71 cenários automatizados passaram: URLs de produção e desenvolvimento,
  localhost/127.x/LAN/IPv6, `file://`, origem alternativa, slug incorreto,
  configurações de origem inválidas, armazenamento bloqueado/corrompido,
  paleta salva e painel desabilitado.
- Foram verificados 640 pares de cores derivados de fundos claros, escuros
  e intermediários: contraste de texto calculado de pelo menos 4,5:1.
  Essa verificação não substitui uma auditoria visual completa de acessibilidade.
- Os 15 links de catálogo usam a mesma configuração e o contrato oficial
  `/catalogo/?catalogo=slug`, conferido no repositório central.
- O ZIP contém somente a pasta do modelo, documentação e recursos necessários.
  Não contém `.git`, `node_modules`, manifestos do construtor, arquivos de testes
  temporários, backend, cliente Supabase, carrinho ou lógica própria de WhatsApp.

## Limite da verificação

A tentativa de verificação com navegador não foi concluída. Não foi possível
confirmar a existência de um catálogo ativo com o slug demonstrativo `verde-viva`.
Não foram realizados pedidos reais nem modificações no admin/banco/repositório.

## Verificação final no seu ambiente

Com um catálogo ativo configurado, abra a raiz do repositório no Live Server:

1. Confira 360, 390, 768, 1024 e 1440 px; verifique rolagem, textos, fotografias,
   menu e foco pelo teclado. O CSS contempla esses tamanhos, mas essa inspeção
   visual permanece pendente.
2. Abra Cores, aplique paletas e cores próprias, recarregue, restaure, copie e feche
   pelo botão ou Escape. Confira também duas abas e movimento reduzido do sistema.
3. Abra Ver produtos e confira a identificação, nome e logo do catálogo correto.
4. Confira produtos/categorias pausados, pesquisa e filtros no catálogo central.
5. Adicione itens, altere quantidades e confira o total. Verifique a mensagem do
   WhatsApp e o comportamento central de limpar/restaurar o último carrinho,
   sem enviar uma mensagem real durante o teste.
6. Teste um slug inexistente e confira a mensagem de indisponibilidade do catálogo.
   Um slug com caracteres inválidos deve mostrar o aviso da própria landing.

As etapas 3–6 verificam o módulo central existente; ele não foi alterado por este pacote.
