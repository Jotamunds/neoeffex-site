/*
 * ================================================================
 * PERSONALIZAÇÃO RÁPIDA
 * Altere apenas este objeto para adaptar a página a outra barbearia.
 * WhatsApp: use DDI + DDD + número, somente dígitos.
 * Horários: 0 = domingo, 1 = segunda ... 6 = sábado.
 * ================================================================
 */
const BARBERSHOP_CONFIG = {
    brand: {
        name: "Nome da Barbearia",
        shortName: "Nome da Barbearia",
        initial: "N"
    },
    hero: {
        eyebrow: "Corte, barba e atitude",
        line1: "Mais que um corte.",
        line2: "Sua melhor versão.",
        description: "Atendimento personalizado, técnica e atenção aos detalhes para você sair renovado, confiante e pronto para qualquer ocasião."
    },
    services: [
        {
            name: "Corte",
            description: "Corte personalizado com acabamento completo.",
            price: "R$ 40"
        },
        {
            name: "Barba",
            description: "Desenho, alinhamento e finalização cuidadosa.",
            price: "R$ 30"
        },
        {
            name: "Corte + Barba",
            description: "Experiência completa para renovar o visual.",
            price: "R$ 60"
        },
        {
            name: "Acabamento",
            description: "Pezinho e detalhes para manter tudo alinhado.",
            price: "R$ 15"
        }
    ],
    differentials: [
        {
            title: "Atendimento personalizado",
            description: "Cada cliente é único. Aqui, o atendimento é feito no seu ritmo."
        },
        {
            title: "Profissionais experientes",
            description: "Técnica atualizada e atenção aos detalhes em cada serviço."
        },
        {
            title: "Ambiente confortável",
            description: "Um espaço moderno para relaxar enquanto cuidamos do visual."
        }
    ],
    stats: [
        { value: "+1.500", label: "Clientes atendidos" },
        { value: "+4 anos", label: "De história" },
        { value: "5,0 ★", label: "Avaliação no Google" }
    ],
    gallery: [
        "Fade clássico",
        "Social moderno",
        "Texturizado",
        "Degradê",
        "Corte e barba",
        "Cacheado"
    ],
    reviews: [
        {
            name: "Lucas Martins",
            text: "Excelente atendimento, corte impecável e ambiente muito bom.",
            source: "Avaliação no Google"
        },
        {
            name: "Rafael Souza",
            text: "Melhor barbearia da região. Profissionais atenciosos e resultado perfeito.",
            source: "Avaliação no Google"
        },
        {
            name: "Thiago Almeida",
            text: "Ambiente top demais. Me sinto em casa sempre que vou lá.",
            source: "Avaliação no Google"
        }
    ],
    contact: {
        whatsapp: "5511999999999",
        whatsappMessage: "Olá! Vi o site da barbearia e gostaria de agendar um horário.",
        address: "Rua das Palmeiras, 123",
        city: "Centro — São Paulo/SP",
        neighborhood: "Centro • São Paulo",
        hours: [
            "Segunda a sexta: 09h às 20h",
            "Sábado: 09h às 18h",
            "Domingo: fechado"
        ],
        weeklyHours: {
            0: null,
            1: [9, 20],
            2: [9, 20],
            3: [9, 20],
            4: [9, 20],
            5: [9, 20],
            6: [9, 18]
        },
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+das+Palmeiras+123+Sao+Paulo",
        instagram: "@nomedabarbearia",
        instagramUrl: "https://instagram.com/nomedabarbearia"
    },
    footer: {
        description: "Estilo, cuidado e atendimento de verdade. Sua melhor versão começa na cadeira."
    }
};

/*
 * Configuração do modo demonstração.
 * Use enabled: false quando quiser ocultar o botão de personalização.
 */
const DEMO_CONFIG = {
    enabled: true,
    persistSelection: true,
    storageKey: "neoeffex-barbearia1-theme",
    defaultTheme: "classic"
};

/*
 * Temas apresentados no painel flutuante.
 * É possível adicionar outros seguindo a mesma estrutura.
 */
const THEME_PRESETS = [
    {
        id: "classic",
        name: "Dourado",
        accent: "#c49a50",
        background: "#0b0b0b"
    },
    {
        id: "neo",
        name: "Azul Neo",
        accent: "#0b87f4",
        background: "#07111b"
    },
    {
        id: "wine",
        name: "Vinho",
        accent: "#c7667c",
        background: "#15090d"
    },
    {
        id: "emerald",
        name: "Esmeralda",
        accent: "#55bd8e",
        background: "#07120d"
    },
    {
        id: "copper",
        name: "Cobre",
        accent: "#d17a45",
        background: "#130d09"
    },
    {
        id: "ivory",
        name: "Marfim",
        accent: "#765328",
        background: "#eee8dd"
    }
];

/* Compartilhado com os módulos independentes da página. */
window.BARBERSHOP_CONFIG = BARBERSHOP_CONFIG;
window.DEMO_CONFIG = DEMO_CONFIG;
window.THEME_PRESETS = THEME_PRESETS;
