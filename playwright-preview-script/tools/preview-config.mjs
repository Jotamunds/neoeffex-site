export default {
    baseUrl: 'http://127.0.0.1:5500',
    viewport: {
        width: 1920,
        height: 1080
    },
    outputWidth: 1920,
    frameRate: 30,
    gotoTimeoutMs: 60000,
    waitBeforeStartMs: 2000,
    waitAfterScrollMs: 800,
    scrollStep: 180,
    scrollIntervalMs: 180,
    durationMs: 9000,
    outputDir: 'generated-previews',
    pages: [
        {
            name: 'hamburgueria',
            route: '/modelos/hamburgueria/'
        },
        {
            name: 'clinica-odontologica',
            route: '/modelos/clinica-odontologica/'
        },
        {
            name: 'hortifruti',
            route: '/modelos/hortifruti/'
        },
        {
            name: 'barbearia',
            route: '/modelos/barbearia1/'
        },
        {
            name: 'lu-leve-e-saudavel',
            route: '/sites/lu-leve-e-saudavel/'
        }
    ]
};
