# Site Neoeffex - Versão Modernizada

## Sobre o Projeto

Este é o site modernizado da **Neoeffex**, empresa especializada em automação de aplicativos Microsoft. O site foi completamente redesenhado mantendo a identidade visual original (cores ciano e azul), mas com melhorias significativas em design, responsividade e experiência do usuário.

## Melhorias Implementadas

### Design Moderno
- **Gradientes sofisticados**: Hero section com gradiente dinâmico de azul escuro para ciano
- **Sombras e profundidade**: Efeitos de sombra suaves que criam hierarquia visual
- **Bordas arredondadas**: Design mais suave e contemporâneo
- **Tipografia aprimorada**: Melhor hierarquia e legibilidade

### Animações Sutis
- **Animações de entrada**: Efeitos fadeInUp e slideIn para seções
- **Efeitos hover**: Transformações suaves em cards, botões e imagens
- **Micro-interações**: Detalhes como shimmer nos botões e gradientes em títulos ao hover
- **Elementos flutuantes**: Efeitos de float no background do hero

### Responsividade Completa
- **Mobile-first**: Layout otimizado para dispositivos móveis
- **Breakpoints**: 
  - Desktop: > 1200px
  - Tablet: 900px - 1200px
  - Mobile: < 900px
  - Small mobile: < 600px
- **Navegação adaptável**: Menu se reorganiza em telas menores
- **Imagens responsivas**: Ajustam-se automaticamente ao tamanho da tela

### Identidade Visual Preservada
- **Cores**: Tons de ciano (#00b4ff) e azul (#0056d6, #003b95) mantidos
- **Logo**: Todas as variações do logo Neoeffex preservadas
- **Nome da empresa**: Neoeffex mantido em todos os elementos

## Estrutura de Arquivos

```
neoeffex-site/
├── index.html          # Página inicial
├── servicos.html       # Página de serviços
├── contato.html        # Página de contato
├── style.css           # Estilos modernizados
├── img/                # Diretório de imagens
│   ├── LogoNeoeffex*.png
│   ├── feature_*.png
│   ├── service_*.png
│   ├── hero_image_pt.png
│   └── contact_image.png
└── README.md           # Este arquivo
```

## Como Usar

### Visualização Local

1. Abra o arquivo `index.html` diretamente no navegador, ou
2. Use um servidor web local:
   ```bash
   python3 -m http.server 8080
   ```
   Depois acesse: `http://localhost:8080`

### Deploy

O site pode ser hospedado em qualquer serviço de hospedagem estática:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Azure Static Web Apps

Basta fazer upload de todos os arquivos mantendo a estrutura de diretórios.

## Navegação

- **Home**: Apresentação da empresa e principais benefícios
- **Serviços**: Detalhes dos serviços de automação oferecidos
- **Contato**: Formulário de contato e informações de comunicação

## Tecnologias Utilizadas

- HTML5 semântico
- CSS3 com variáveis customizadas
- Gradientes CSS
- Animações CSS
- Flexbox para layout responsivo
- Media queries para responsividade

## Compatibilidade

O site é compatível com todos os navegadores modernos:
- Chrome/Edge (versões recentes)
- Firefox (versões recentes)
- Safari (versões recentes)
- Opera (versões recentes)

## Paleta de Cores

```css
--primary-blue: #0056d6
--secondary-blue: #003b95
--cyan: #00b4ff
--light-cyan: #5dd9ff
--dark-blue: #001f5c
```

## Suporte

Para dúvidas ou suporte, entre em contato através do formulário na página de contato ou pelo email: contato@neoeffex.com.br

---

© 2025 Neoeffex. Todos os direitos reservados.

