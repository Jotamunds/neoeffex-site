# Hamburgueria — modelo premium Neoeffex

## v0.2.1 — modelo GLB real do usuário

Esta versão troca o hambúrguer procedural/anterior pelo arquivo `hamburger.glb` enviado pelo usuário.

Principais diferenças:

- o modelo exibido no hero passa a ser o GLB real;
- os materiais embutidos no arquivo são preservados;
- o código 3D deixa de substituir visualmente cada ingrediente por materiais gerados em JavaScript;
- o hambúrguer é centralizado e escalado automaticamente para o palco do hero;
- o fluxo de Live Server continua igual ao da `v0.2.0.1` corrigida.

Se o navegador estiver mostrando o hambúrguer anterior, faça um hard refresh (`Ctrl + Shift + R`) para invalidar o cache do `burger.glb`.

## Importante — pacote corrigido

A primeira geração da `v0.2.0.1` possuía uma incompatibilidade entre o import usado pelo Three.js (`three/examples/jsm/...`) e o alias disponível no import map (`three/addons/...`). Este pacote corrige a incompatibilidade.

Além disso, a landing agora segue **progressive enhancement**: todo o conteúdo HTML/CSS permanece visível mesmo se o runtime 3D não carregar. O 3D e as animações enriquecem a página, mas não são mais necessários para ela existir visualmente.


Landing premium para hamburgueria integrada ao catálogo compartilhado da Neoeffex.

## v0.2.0.1 — Live Server + Vite sem conflito

A landing continua usando:

- Vite;
- Three.js;
- GSAP;
- GLB local;
- materiais PBR;
- HDRI local;
- animação 3D em tempo real.

A diferença desta correção é a separação entre **código-fonte** e **arquivos que o navegador abre diretamente**.

```text
modelos/hamburgueria/
├── index.html                  # abre diretamente pelo Live Server
├── assets/                     # runtime do Live Server
│   ├── css/
│   └── js/
├── models/
│   └── burger.glb
├── hdr/
│   └── burger-studio.hdr
├── source/                     # código-fonte Vite
│   ├── index.html
│   ├── src/
│   └── public/
├── tools/
│   ├── sync-live.mjs
│   └── publish-build.mjs
├── tests/
├── package.json
├── vite.config.js
├── VERSION
└── CHANGELOG.md
```

## Testar pelo Live Server da raiz da Neoeffex

Abra o **Live Server na pasta principal do repositório** e acesse:

```text
http://127.0.0.1:5500/modelos/hamburgueria/
```

A página raiz já está pronta para esse modo.

O catálogo local será resolvido na mesma origem:

```text
http://127.0.0.1:5500/catalogo/?catalogo=modelo-hamburgueria
```

Assim `/admin/`, `/catalogo/` e `/modelos/hamburgueria/` podem ser testados no mesmo servidor.

### Depois de alterar o código-fonte

Edite os arquivos em:

```text
modelos/hamburgueria/source/
```

e sincronize a versão do Live Server:

```powershell
cd modelos/hamburgueria
npm run live:sync
```

O Live Server detectará as alterações nos arquivos da raiz normalmente.

> O modo `live:sync` usa import map e CDN público apenas para resolver Three.js e GSAP durante o teste direto pelo Live Server. GLB e HDRI continuam locais.

## Desenvolvimento com Vite

Se quiser usar HMR:

```powershell
cd modelos/hamburgueria
npm install
npm run dev
```

O Vite usa `source/` como raiz do projeto.

Quando a landing estiver no servidor Vite, os CTAs locais usam:

```text
http://127.0.0.1:5500/catalogo/?catalogo=modelo-hamburgueria
```

## Build de produção

```powershell
npm run build
```

gera:

```text
modelos/hamburgueria/dist/
```

O Vite usa:

```js
base: "./"
```

por isso os assets do build funcionam quando a landing é publicada em:

```text
/modelos/hamburgueria/
```

### Preparar a própria pasta para publicação

Depois de instalar as dependências uma vez:

```powershell
npm run build:publish
```

Esse comando:

1. gera `dist/`;
2. remove somente os arquivos de runtime antigos da raiz;
3. copia o build compilado para `modelos/hamburgueria/`;
4. preserva `source/`, `tools/`, testes e documentação.

Depois disso, a pasta continua funcionando no Live Server e também pode ser publicada no GitHub/hospedagem como site estático.

No build de produção, Three.js e GSAP são empacotados pelo Vite; o servidor não precisa de Node, Vite ou `npm install`.

## Catálogo Neoeffex

O slug continua configurado em:

```text
source/src/config.js
```

Padrão atual:

```text
modelo-hamburgueria
```

Produção:

```text
https://neoeffex.com.br/catalogo/?catalogo=modelo-hamburgueria
```

## Segurança e fallback

- nenhuma dependência da Hostinger;
- nenhuma chave privada no frontend;
- GLB e HDRI locais;
- fallback visual se WebGL/modelo falhar;
- `prefers-reduced-motion` preservado;
- `noindex, nofollow` continua ativo enquanto o modelo não for publicado para um cliente real.
