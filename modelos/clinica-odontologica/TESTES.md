# Validação — 03/09/2026

## Verificado nesta entrega

- Rota oficial conferida no README do repositório e no JavaScript publicado do catálogo: `/catalogo/?catalogo=identificacao`.
- Landing renderizada em navegador Chrome na pasta `/modelos/clinica-odontologica/`.
- Viewports 360×800, 390×844, 768×800, 1024×800 e 1920×1080: hero com altura mínima da tela e nenhuma rolagem horizontal do documento. A verificação de larguras usou uma moldura de teste; também houve inspeção visual da página aberta diretamente no desktop.
- Menu móvel: abrir, navegar até a seção e fechar; links e foco funcionais.
- Seletor de cores: abrir, paleta pronta, hexadecimal válido/inválido, persistência após recarregar, restauração e fechamento por Escape.
- Exportação: conteúdo da paleta gerado corretamente e exposto no campo para copiar. O ambiente de teste não confirmou a conclusão do download; a alternativa de copiar a configuração foi verificada.
- Aviso de catálogo não configurado recebe foco ao acionar os CTAs.
- FAQ expande pelo teclado.
- Sem erros de JavaScript atribuídos à página no console consultado.
- Sintaxe dos scripts, referências de imagens/fontes, IDs únicos e âncoras internas verificados.
- 13 casos isolados de resolução de catálogo: slug válido, vazio, inválido, valores com tentativa de troca de destino, domínio público, endereço local e abertura por arquivo.
- Tratamento de armazenamento indisponível, JSON corrompido, paleta inválida e mudança da paleta publicada.
- 88 combinações de texto/fundo testadas em oito cores, inclusive extremos: contraste mínimo calculado de 4,54:1 para os tokens de texto gerados. Isso não equivale a uma auditoria completa de acessibilidade.
- Fotografias e fontes incluídas localmente; sem construtor, backend, dependências npm, autenticação ou carrinho na landing.
- Conteúdo visível por padrão; revelação progressiva somente com suporte a IntersectionObserver. CSS respeita redução de movimento.

## Integração a validar com a clínica real

Não foi fornecido um slug ativo da clínica. Por isso, o pacote deixa `catalog.slug` vazio e não afirma ter validado um pedido real.

Após configurar o slug e publicar:

1. Confirmar nome/logo/descrição e informações do catálogo correto.
2. Conferir produtos e categorias ativos e a indisponibilidade dos pausados.
3. Verificar busca, filtros, carrinho, quantidades e total no catálogo oficial.
4. Conferir a mensagem montada pelo WhatsApp e a limpeza/restauração de carrinho conforme o comportamento central, sem enviar um pedido de teste a terceiros.
5. Testar catálogo pausado e um identificador inexistente: a tela central deve informar a indisponibilidade.
6. Confirmar a mesma navegação no celular e na URL final da Neoeffex.

Nenhum arquivo de `/admin` ou `/catalogo` foi alterado; não há SQL ou migration a aplicar.
