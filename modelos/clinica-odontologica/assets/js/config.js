/* Configuração da landing. Catálogo, identidade operacional e pedidos pertencem à Neoeffex. */
window.NEOEFFEX_LANDING = Object.freeze({
    catalog: Object.freeze({
        // Preencha SOMENTE aqui com a identificação de um catálogo ativo no /admin.
        slug: "",
        // true: usa /catalogo/ do mesmo servidor HTTP local (Live Server na raiz do repo).
        // false: abre o catálogo publicado, inclusive ao testar só esta pasta.
        useLocalCatalog: false
    }),
    brand: Object.freeze({
        // Identidade editorial do modelo fictício; não é uma cópia do cadastro do admin.
        name: "AURA",
        subtitle: "Odontologia",
        logo: "", // Opcional: caminho relativo, por exemplo assets/img/logo.webp.
        demo: true
    }),
    content: Object.freeze({
        heroEyebrow: "Odontologia contemporânea",
        heroTitle: "Tecnologia para transformar.\nCuidado para sorrir.",
        heroLead: "Odontologia moderna, planejamento preciso e atendimento próximo em cada etapa.",
        introTitle: "Odontologia moderna sem deixar o cuidado humano de lado.",
        introText: "Cada consulta começa por escuta. Unimos um ambiente calmo, profissionais atentos e recursos digitais para que você entenda cada escolha do seu cuidado.",
        closingTitle: "Vamos cuidar do seu sorriso?"
    }),
    images: Object.freeze({
        hero: "assets/img/hero-clinica.webp",
        heroMobile: "assets/img/clinica-mobile.webp",
        clinic: "assets/img/clinica-interior.webp",
        technology: "assets/img/alinhador.webp"
    }),
    themeEditor: true // false oculta o botão Cores para a versão de um cliente.
});
