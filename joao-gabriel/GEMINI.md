# João/OS — Portfólio João Gabriel

Estas instruções complementam o `GEMINI.md` da raiz.

## Conceito

Este projeto é um portfólio apresentado como um sistema operacional/desktop interativo, publicado na rota `/joao-gabriel`.

Não transforme o projeto em uma landing page tradicional.

A experiência de sistema operacional é parte central do produto.

## Estrutura

O `index.html` reúne a estrutura principal e os módulos em `js/` controlam comportamentos independentes do sistema.

Antes de adicionar lógica nova, procure primeiro o módulo responsável.

Módulos existentes incluem comportamentos como:

- sequência de boot;
- relógio;
- contato;
- aplicativos do desktop;
- menu de contexto;
- sistema de arquivos;
- laboratório;
- Neo;
- notificações;
- projetos;
- armazenamento de sessão;
- menu do sistema;
- ações de energia;
- gerenciamento de janelas.

Não concentre novas funcionalidades em `main.js` se já houver um módulo apropriado.

## Experiência visual

Preserve:

- conceito de desktop;
- janelas;
- barra/sistema;
- abertura de aplicativos;
- maximização e minimização;
- sensação de interface de sistema operacional;
- responsividade dentro das limitações do conceito.

Não adicione rolagem global do desktop apenas para acomodar conteúdo novo.

Conteúdo interno de aplicativos pode possuir sua própria rolagem quando necessário.

## Janelas

Mudanças em janelas devem considerar:

- abrir;
- fechar;
- minimizar;
- maximizar/restaurar;
- foco;
- ordem visual/z-index;
- estado de sessão;
- teclado e foco acessível.

Não corrija uma única janela com exceção hardcoded se o problema estiver no gerenciador compartilhado.

## Sessão

O projeto possui armazenamento de estado de sessão.

Antes de criar outro mecanismo de `localStorage` ou `sessionStorage`, verifique `session-store.js` e os módulos atuais.

Evite chaves duplicadas ou estados concorrentes.

## Boot e energia

Preserve a sequência inicial e os comportamentos de energia existentes.

Ações como reiniciar/desligar fazem parte da metáfora do sistema e não devem ser convertidas em botões genéricos sem necessidade.

## Conteúdo do portfólio

Ao alterar projetos, contatos ou informações profissionais:

- preserve o formato de dados existente;
- não invente experiência, métricas ou links;
- mantenha links externos seguros com `noopener noreferrer` quando aplicável.

## CSS

Siga a divisão atual da pasta `css/`.

Evite uma regra global para corrigir um componente isolado se existir stylesheet específico.

## Objetivo

Toda alteração deve reforçar a sensação de um sistema operacional funcional, sem sacrificar legibilidade, estabilidade ou acesso ao conteúdo do portfólio.
