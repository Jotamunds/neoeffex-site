# Cancelamento e offboarding de cliente — Neoeffex

## Versão

```text
Procedimento: v0.1.9.1
Etapa: 10 — Operação e entrega ao cliente
```

## Objetivo

Definir um processo controlado para encerrar um catálogo ou uma relação completa com um cliente sem transformar uma solicitação de cancelamento em exclusão imediata e irreversível.

Offboarding é diferente de suspensão.

---

# 1. Regra principal

O primeiro passo do cancelamento é **desativar**, não excluir.

Não executar exclusão irreversível no mesmo momento em que o cliente pede cancelamento.

Fluxo:

```text
Solicitação
    ↓
Classificação
    ↓
Pausa do catálogo
    ↓
Registro
    ↓
Retenção
    ↓
Exportação, se aplicável
    ↓
Autorização final
    ↓
Exclusão definitiva, quando aprovada
```

---

# 2. Diferenciar os casos

Antes de qualquer ação, classificar:

## Caso A — cancelamento de apenas um catálogo

A conta pode continuar existindo e possuir outros catálogos.

Nesse caso:

- não excluir o usuário;
- não suspender outros catálogos;
- não remover imagens de outros catálogos;
- tratar apenas o catálogo solicitado.

## Caso B — encerramento integral do cliente

Todos os catálogos da conta fazem parte do encerramento.

Mesmo nesse caso, a conta não deve ser excluída imediatamente.

Primeiro concluir:

- pausa;
- retenção;
- eventual exportação;
- autorização final.

---

# 3. Confirmar a solicitação

Registrar:

```text
Data:
Cliente:
Responsável:
E-mail:
Catálogo(s):
Slug(s):
Cancelamento parcial ou integral:
Solicitado por:
Responsável Neoeffex:
Motivo informado, se necessário:
```

A confirmação deve permitir identificar claramente o escopo.

Não usar uma mensagem ambígua como autorização para exclusão definitiva.

---

# 4. Verificar propriedade

Antes de alterar qualquer dado:

```text
[ ] E-mail correto
[ ] owner correto
[ ] Catálogo correto
[ ] Slug correto
[ ] Outros catálogos da mesma conta identificados
[ ] Produtos do catálogo identificados
[ ] Imagens vinculadas identificadas
[ ] Logo vinculada identificada
```

A operação deve sempre distinguir:

```text
owner
    ├── catálogo A
    ├── catálogo B
    └── catálogo C
```

Cancelar `catálogo A` não autoriza apagar B ou C.

---

# 5. Desativação inicial

A primeira ação é pausar o catálogo.

Usar o mesmo procedimento de:

```text
docs/operations/CLIENT_SUSPENSION.md
```

Resultado:

```text
is_active = false
```

Depois testar em aba anônima.

Não excluir produtos para tornar o catálogo invisível.

---

# 6. Acesso administrativo durante o offboarding

A decisão depende do escopo.

## Cancelamento de um catálogo

Se a conta possui outros catálogos ativos:

```text
manter o acesso administrativo
```

Não bloquear o usuário por causa do cancelamento de apenas um catálogo.

## Encerramento integral

Pode ser necessário impedir novo acesso durante o período de encerramento.

Como o produto atual não possui superadmin para isso:

- registrar a decisão;
- usar o mecanismo administrativo do Supabase Authentication adotado pela operação;
- não excluir o usuário antes do momento de exclusão definitiva;
- documentar a ação realizada.

---

# 7. Preservação inicial

Durante o período de retenção:

não excluir:

```text
catálogo
categorias
produtos
logo
imagens
usuário
```

Manter o catálogo inativo.

Isso permite:

- reverter um cancelamento feito por engano;
- preparar exportação;
- investigar divergências;
- concluir o processo com mais segurança.

---

# 8. Política de retenção

Os seguintes valores ainda dependem de decisão comercial.

```text
Prazo padrão de retenção após cancelamento:
PENDENTE DE DEFINIÇÃO COMERCIAL

Prazo máximo para solicitar exportação:
PENDENTE DE DEFINIÇÃO COMERCIAL

Responsável por autorizar exclusão definitiva:
PENDENTE DE DEFINIÇÃO COMERCIAL

Prazo de resposta para solicitação de exportação:
PENDENTE DE DEFINIÇÃO COMERCIAL

Forma oficial de registrar a conclusão:
PENDENTE DE DEFINIÇÃO COMERCIAL
```

Não substituir esses campos por prazos inventados durante a implementação técnica.

---

# 9. Exportação

Para os primeiros clientes, a exportação pode ser manual.

Antes de exportar, definir o que foi solicitado.

Possíveis dados operacionais:

```text
nome do catálogo
slug
identidade do comércio
categorias
produtos
preços
descrições
status
referências de imagens
```

Quando acordado, também podem ser preservadas cópias dos arquivos de imagem pertencentes ao cliente.

Não exportar:

```text
senha
hash de senha
token
secret
service_role
chave privada
dados de outro cliente
```

Registrar:

```text
Exportação solicitada: sim / não
Escopo:
Data:
Responsável:
Forma de entrega:
Confirmação de entrega:
```

---

# 10. Backup antes da exclusão definitiva

Antes de apagar qualquer dado de forma irreversível:

```text
[ ] seguir docs/operations/BACKUP_AND_ROLLBACK.md
[ ] proteger os dados que precisam ser preservados
[ ] copiar os objetos do Storage incluídos no escopo
[ ] registrar versão/commit quando a operação também envolver release
```

O dump do banco não substitui a cópia dos arquivos do Storage.

---

# 12. Preparação para exclusão definitiva

A exclusão só pode entrar em preparação quando:

```text
[ ] Retenção encerrada ou regra aprovada para o caso
[ ] Exportação concluída ou formalmente dispensada
[ ] Cliente/escopo confirmado novamente
[ ] Autorização final registrada
[ ] Outros catálogos da conta revisados
[ ] Dados a remover inventariados
[ ] Imagens a remover inventariadas
```

Não usar comandos destrutivos genéricos.

Não executar `DROP TABLE` ou `DROP COLUMN`.

Offboarding remove dados de um cliente, não estrutura do sistema.

---

# 12. Inventário antes da exclusão

Registrar pelo menos:

```text
Owner:
E-mail:
Catálogo ID:
Slug:
Quantidade de categorias:
Quantidade de produtos:
Logo path:
Quantidade aproximada de imagens:
Outros catálogos do mesmo owner:
```

Em encerramento integral, repetir para cada catálogo.

---

# 13. Imagens e Storage

Banco de dados e arquivos do Storage precisam ser tratados como partes diferentes do offboarding.

Não assumir que remover um registro do banco apagará automaticamente todos os arquivos relacionados.

Antes da exclusão definitiva:

```text
[ ] Identificar imagens de produtos do catálogo
[ ] Identificar logo do catálogo
[ ] Confirmar prefixos pertencentes ao owner/catálogo
[ ] Garantir que os caminhos não pertencem a outro catálogo
```

Não remover uma pasta inteira do owner quando apenas um catálogo foi cancelado.

---

# 14. Exclusão de um único catálogo

Quando houver autorização definitiva para apenas um catálogo:

1. confirmar novamente o catálogo;
2. confirmar os outros catálogos do mesmo usuário;
3. remover somente arquivos daquele catálogo;
4. remover dados daquele catálogo conforme o mecanismo administrativo adotado;
5. preservar o usuário;
6. preservar outros catálogos;
7. validar que os outros catálogos continuam funcionando.

A versão atual não adiciona uma automação de exclusão em massa.

Essa ação deve ser manual e deliberada.

---

# 15. Encerramento integral da conta

Quando **todos** os catálogos da conta forem encerrados:

1. concluir o processo de cada catálogo;
2. confirmar que não resta catálogo ativo;
3. confirmar exportação/retenção;
4. confirmar autorização final;
5. remover os arquivos pertencentes à conta conforme o escopo aprovado;
6. remover os dados operacionais aprovados;
7. somente depois considerar a remoção do usuário do Authentication;
8. registrar conclusão.

Não remover o usuário enquanto ainda existir catálogo que precisa ser preservado ou operado.

---

# 16. Validação após exclusão definitiva

## Cancelamento parcial

```text
[ ] Catálogo cancelado não está acessível
[ ] Outro catálogo da mesma conta continua funcionando
[ ] Usuário continua existente
[ ] Imagens do outro catálogo permanecem
```

## Encerramento integral

```text
[ ] Todos os catálogos incluídos foram tratados
[ ] Nenhum catálogo de outro cliente foi afetado
[ ] Storage do cliente foi tratado conforme autorização
[ ] Situação do usuário foi concluída
[ ] Registro de encerramento foi preenchido
```

---

# 17. Cancelamento revertido durante retenção

Se o cliente desistir do cancelamento antes da exclusão definitiva:

1. confirmar a reversão;
2. usar `CLIENT_SUSPENSION.md`;
3. reativar o acesso, se necessário;
4. reativar o catálogo;
5. testar a URL;
6. testar WhatsApp quando aplicável;
7. registrar a reversão.

Não recriar o catálogo se os dados ainda existem.

---

# 18. Registro final

```text
Cliente:
Tipo: parcial / integral
Catálogo(s):
Data da solicitação:
Data da pausa:
Retenção aplicada:
Exportação:
Autorização final:
Data da exclusão, se realizada:
Usuário removido: sim / não / não aplicável
Executado por:
Validado por:
Observações:
```

---

# 19. Checklist de offboarding

```text
[ ] Escopo confirmado
[ ] Cancelamento parcial/integral identificado
[ ] Cliente correto validado
[ ] Owner correto validado
[ ] Catálogo pausado
[ ] URL pública validada
[ ] Outros catálogos identificados
[ ] Nenhum dado excluído na etapa inicial
[ ] Retenção registrada
[ ] Exportação tratada
[ ] Autorização final registrada
[ ] Inventário preenchido
[ ] Imagens tratadas por catálogo
[ ] Dados tratados pelo escopo correto
[ ] Usuário preservado se ainda necessário
[ ] Outros clientes não foram afetados
[ ] Registro final preenchido
```

---

# 20. Critério de aprovação

O offboarding está correto quando:

- o catálogo saiu do público sem exclusão prematura;
- o escopo parcial ou integral ficou claro;
- a retenção foi respeitada;
- a exportação foi tratada;
- nenhuma credencial foi exportada;
- dados de outros catálogos/clientes foram preservados;
- a exclusão definitiva, quando realizada, teve autorização registrada.

---

# 21. Próximo nível de automação

Não criar automação de exclusão em massa nesta versão.

Somente considerar automação depois que este processo manual tiver sido repetido com segurança e os requisitos comerciais de retenção estiverem definidos.
