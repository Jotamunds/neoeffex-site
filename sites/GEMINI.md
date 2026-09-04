# Neoeffex — Sites de Clientes

Estas instruções complementam o `GEMINI.md` da raiz.

## Objetivo

A pasta `/sites/` contém sites de clientes reais ou projetos preparados para publicação como sites de cliente.

Diferente de `/modelos/`, estes projetos podem possuir:

- identidade real;
- conteúdo real;
- contatos reais;
- preços e informações comerciais;
- regras específicas do cliente;
- integração concreta com o catálogo Neoeffex.

## Regra principal

Não trate um site de cliente como template descartável.

Antes de alterar um projeto dentro de `/sites/`:

1. leia o `GEMINI.md` específico do site, se existir;
2. leia `README.md`, `VERSION` e `CHANGELOG.md` quando existirem;
3. identifique arquivos de configuração e fontes de dados;
4. preserve conteúdo aprovado e integrações existentes;
5. faça a menor mudança necessária.

## Catálogo

Sites de clientes devem reutilizar o catálogo compartilhado da Neoeffex quando já houver integração.

Não crie carrinho, catálogo ou lógica de pedido paralelos sem necessidade explícita.

Quando existir um slug configurado, preserve o mecanismo atual de resolução entre ambiente local e produção.

## Conteúdo real

Não substitua silenciosamente:

- telefone;
- WhatsApp;
- endereço;
- Instagram;
- preços;
- imagens aprovadas;
- nome da empresa;
- textos comerciais;

por placeholders ou conteúdo inventado.

Se algum dado ainda estiver marcado como provisório, preserve esse estado até confirmação explícita.

## Publicação

Antes de retirar `noindex`, alterar domínio, trocar URLs de produção ou considerar o site publicado:

- confira documentação local;
- valide contatos e conteúdo;
- execute testes existentes;
- preserve a rota esperada.

## Reutilização

Código compartilhável pode ser melhorado, mas alterações não devem descaracterizar o cliente atual apenas para tornar o projeto mais genérico.
