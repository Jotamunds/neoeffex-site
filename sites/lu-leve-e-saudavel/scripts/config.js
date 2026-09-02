/* Contatos, promoção e créditos do site. Preços ficam em data/menu.json.
 * Não coloque senhas, tokens ou outras informações secretas aqui.
 */
(() => {
    "use strict";

    window.LuLeve = window.LuLeve || {};

    window.LuLeve.config = {
        version: "0.1.19",
        // Cada efeito pode ser desligado sem alterar conteúdo ou links.
        // Use true/false, sem aspas.
        motion: {
            enabled: true,
            intro: true,
            cards: true,
            contact: true,
            fork: true,
            prices: true,
            reveal: true,
            smoothScroll: true
        },
        catalog: {
            // O catálogo continua hospedado pela Neoeffex mesmo se o site mudar de domínio.
            slug: "lu-leve-e-saudavel",
            productionUrl: "https://neoeffex.com.br/catalogo/?catalogo=lu-leve-e-saudavel",
            // Usado somente em localhost, IP privado ou abertura direta do arquivo.
            localPath: "../../catalogo/?catalogo=lu-leve-e-saudavel"
        },
        contact: {
            // Número brasileiro completo: 55 + DDD + número, somente dígitos.
            // WhatsApp da Lu informado pelo responsável pelo projeto.
            whatsappNumber: "5511978766842",
            whatsappMessage: "Olá! Vim pelo site da Lu Leve e Saudável e gostaria de fazer um pedido.",
            instagramUrl: "https://www.instagram.com/lu.leveesaudavel/",
            instagramHandle: "@lu.leveesaudavel",
            regions: "Cotia, Vargem Grande Paulista, Itapevi e região.",
            pickup: "Retirada no local. Consulte o endereço antes de se deslocar.",
            delivery: "Entrega por aplicativo, com taxa adicional.",

            // Campos vazios permanecem ocultos. Não inventar informações.
            address: "",
            openingHours: ""
        },
        promotion: {
            // Ative somente uma oferta real: título e descrição são obrigatórios.
            // Na descrição, informe condições e validade; desative quando encerrar.
            enabled: false,
            title: "",
            description: ""
        },
        developer: {
            name: "Neoeffex",
            // Preencha a URL oficial HTTPS para ativar o link no rodapé.
            // Vazio: o crédito permanece como texto, sem endereço inventado.
            url: ""
        }
    };
})();
