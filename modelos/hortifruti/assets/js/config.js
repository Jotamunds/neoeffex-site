/* Configuração pública do modelo. Não adicione senhas ou chaves privadas. */
window.NEOEFFEX_SITE_CONFIG = Object.freeze({
    catalog: {
        // Use a identificação exata do catálogo cadastrado no /admin.
        slug: "verde-viva",
        productionOrigin: "https://neoeffex.com.br",
        // Deixe vazio para testar /catalogo/ no mesmo servidor do repositório.
        // Ao servir somente esta pasta, use "https://neoeffex.com.br".
        developmentOrigin: ""
    },
    theme: {
        enabled: true,
        storageKey: "neoeffex:verde-viva:cores:v1",
        colors: {
            primary: "#39794E",
            accent: "#B74432",
            background: "#F6F9F2",
            support: "#E0EEF3"
        }
    },
    content: {
        brand: { name: "Verde Viva", segment: "Hortifruti" },
        hero: {
            eyebrow: "HORTIFRUTI · FRESCOR · QUALIDADE",
            title: "Frescor que você vê.\nQualidade que você leva.",
            description: "Frutas, verduras e alimentos selecionados para fazer parte da sua rotina todos os dias."
        },
        about: {
            title: "Frescor e qualidade\npara todos os dias.",
            description: "Cada escolha começa com um cuidado simples: alimentos bonitos, bem conservados e prontos para a sua mesa. Seleção atenta, variedade e uma organização que torna a compra mais leve."
        },
        final: {
            title: "Tudo mais fresco começa\ncom uma boa escolha.",
            description: "Conheça as opções disponíveis e encontre mais sabor para o seu dia a dia."
        },
        footer: { description: "Frescor, cuidado e boas escolhas para a sua rotina." }
    },
    images: {
        hero: "assets/img/hero.webp",
        heroMobile: "assets/img/hero-mobile.webp",
        about: "assets/img/banca.webp",
        salad: "assets/img/salada.webp",
        vegetables: "assets/img/vegetais.webp"
    },
    // Deixe vazio para ocultar links que ainda não existem.
    socials: { instagram: "", facebook: "" }
});
