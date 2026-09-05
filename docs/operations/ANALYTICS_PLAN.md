# Plano de Mensuração e Analytics (Neoeffex)

Este documento estabelece a arquitetura recomendada de web analytics, a taxonomia padronizada de eventos para conversão e as diretrizes de privacidade para a Neoeffex.

---

## 1. Arquitetura de Mensuração Recomendada

Para manter a página leve, rápida e em conformidade com as diretrizes de privacidade e LGPD, recomenda-se uma das seguintes abordagens:

### Opção A — Google Tag Manager (Recomendada para escalabilidade)
- **Container GTM**: Um único script no `<head>` e `<noscript>` no `<body>`.
- **Vantagem**: Centraliza o disparo do Google Analytics 4 (GA4), Meta Conversions API / Pixel e tags de verificação sem necessidade de novos deploys de código.
- **Integração com consentimento**: Permite ativar o Google Consent Mode v2 com facilidade quando uma barra de consentimento de cookies for necessária.

### Opção B — Tags Diretas (GA4 gtag.js)
- Carregamento assíncrono direto do GA4 (`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`).
- Menor overhead de ferramentas intermediárias se apenas o Google Analytics for utilizado inicialmente.

---

## 2. Taxonomia de Eventos Recomendados

Todos os nomes de eventos seguem a convenção `snake_case` e utilizam os parâmetros recomendados pelo GA4.

### 2.1 Interação com Demonstrações e Vitrine
| Nome do Evento | Parâmetros | Descrição / Gatilho |
| :--- | :--- | :--- |
| `view_project_demo` | `project_name` (ex: `lu-leve`, `hamburgueria`, `barbearia`, `clinica`, `hortifruti`)<br>`action_type` (`interact_inline`, `open_external`) | Disparado quando o usuário clica no botão "Navegar no site aqui" (ativação do iframe) ou "Abrir tela cheia" / "Abrir site completo". |

### 2.2 WhatsApp e Contato Rápido
| Nome do Evento | Parâmetros | Descrição / Gatilho |
| :--- | :--- | :--- |
| `click_whatsapp_fab` | `link_url`<br>`page_location` | Clique no botão flutuante de WhatsApp no canto inferior da tela. |
| `click_whatsapp_link` | `source_section` (ex: `hero`, `faq`, `footer`, `404`) | Clique em qualquer link secundário com destino ao WhatsApp. |

### 2.3 Catálogo Digital
| Nome do Evento | Parâmetros | Descrição / Gatilho |
| :--- | :--- | :--- |
| `click_catalog_cta` | `target_url`<br>`section` (`catalogo_section`) | Clique no botão "Testar catálogo em ação". |

### 2.4 Funil do Formulário de Contato
| Nome do Evento | Parâmetros | Descrição / Gatilho |
| :--- | :--- | :--- |
| `contact_form_open` | `trigger_button` (`navbar`, `hero`, `final_cta`) | Abertura do modal de contato pelo visitante. |
| `contact_form_submit_attempt` | `has_business` (`true`/`false`)<br>`has_brief` (`true`/`false`) | Tentativa de envio com dados validados no cliente. **Nunca incluir PII como nome ou e-mail nos parâmetros.** |
| `contact_form_submit_success` | `response_status` (200) | Retorno de sucesso da requisição de envio (`FormSubmit`). Considerado conversão principal (Macro Conversão). |
| `contact_form_submit_error` | `error_type` (`timeout`, `network_error`, `http_error`) | Falha no envio que exibe a mensagem de fallback com link direto para o WhatsApp. |

---

## 3. Diretrizes de Privacidade e LGPD

1. **Vedação a Dados Pessoais Identificáveis (PII)**:
   - Em nenhuma circunstância parâmetros de eventos de analytics devem receber nomes de pessoas, endereços de e-mail, telefones ou mensagens completas do formulário.
2. **Consentimento e Cookies**:
   - Caso ferramentas que utilizem cookies de rastreamento entre sites (como o Meta Pixel ou redes de remarketing do Google Ads) venham a ser implementadas, uma ferramenta de consentimento (CMP / banner de cookies) deverá ser ativada antes do disparo dessas tags.
   - O tráfego estritamente técnico e anônimo de desempenho ou visualização de páginas pode operar sob a base legal de legítimo interesse ou medição técnica agregada.
3. **Anonimização de IP**:
   - No GA4, o endereço IP dos visitantes é automaticamente mascarado por padrão.
