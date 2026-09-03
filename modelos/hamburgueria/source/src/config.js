/*
 * Configuração pública do modelo.
 * Não coloque service_role keys, tokens privados ou senhas neste arquivo.
 */
export const siteConfig = Object.freeze({
    business: Object.freeze({
        name: "Brasa Burger",
        brandPrimary: "BRASA",
        brandAccent: "BURGER",
        phoneDisplay: "(11) 99999-0000",
        phoneHref: "+5511999990000",
        address: "Rua Augusta, 1240\nConsolação — São Paulo/SP",
        hoursCompact: "Ter a dom · 18h às 23h\nSex e sáb até 0h",
        hoursFooter: "Terça a quinta · 18h às 23h\nSexta e sábado · 18h à 0h\nDomingo · 12h às 22h",
        delivery: "Atendimento por catálogo digital.\nConfirmação do pedido pelo WhatsApp."
    }),
    catalog: Object.freeze({
        slug: "modelo-hamburgueria",
        developmentOrigin: "http://127.0.0.1:5500",
        productionOrigin: "https://neoeffex.com.br",
        path: "/catalogo/"
    }),
    hero3d: Object.freeze({
        model: "models/burger.glb",
        environment: "hdr/burger-studio.hdr",
        maxPixelRatio: 1.8,
        mobilePixelRatio: 1.25
    })
});
