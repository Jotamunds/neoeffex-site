# Fontes locais — Etapa 2

| Arquivo | Uso | Eixo de peso |
| --- | --- | --- |
| `sora-variable.woff2` | Títulos e marca em texto | 100 a 800 |
| `manrope-variable.woff2` | Textos, botões, navegação e futuros preços | 200 a 800 |

As famílias são declaradas em `styles/base/fonts.css`, com `font-display: swap`. Não é necessário instalar as fontes no computador e não há consulta a um servidor de fontes quando a página é aberta.

Os arquivos foram obtidos do repositório público [Google Fonts — Sora](https://github.com/google/fonts/tree/main/ofl/sora) e [Google Fonts — Manrope](https://github.com/google/fonts/tree/main/ofl/manrope). As fontes TTF originais foram convertidas para o formato WOFF2, preservando o desenho, as métricas, os glifos e os eixos variáveis.

Os avisos de direitos autorais e a licença de cada família estão em `OFL-Sora.txt` e `OFL-Manrope.txt`. Mantenha esses arquivos junto das fontes ao distribuir o projeto.

Os fallbacks `system-ui` e `sans-serif` continuam disponíveis caso um navegador não consiga carregar a fonte local. As verificações da entrega incluem leitura das tabelas e dos glifos, mas a revisão visual de renderização em navegador permanece para as etapas finais.
