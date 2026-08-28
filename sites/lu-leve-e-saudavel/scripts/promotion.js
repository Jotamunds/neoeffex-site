/* Promoção opcional. Não altera data/menu.json nem os cards permanentes.
 * Sem configuração completa ou sem JavaScript, a faixa permanece oculta.
 */
(() => {
    "use strict";

    window.LuLeve = window.LuLeve || {};

    function getContent(promotion) {
        // Exige o booleano true: a string "false" nunca deve ativar uma oferta.
        if (!promotion || promotion.enabled !== true) {
            return null;
        }

        const title = typeof promotion.title === "string" ? promotion.title.trim() : "";
        const description = typeof promotion.description === "string" ? promotion.description.trim() : "";

        if (!title || !description) {
            return null;
        }

        return { title, description };
    }

    function initPromotion(promotion) {
        const content = getContent(promotion);

        document.querySelectorAll("[data-promotion]").forEach((section) => {
            const title = section.querySelector("[data-promotion-title]");
            const description = section.querySelector("[data-promotion-description]");

            // Também funciona se o componente for removido ou estiver incompleto.
            section.hidden = true;

            if (title) {
                title.textContent = "";
            }

            if (description) {
                description.textContent = "";
            }

            if (!content || !title || !description) {
                return;
            }

            // Conteúdo editável entra como texto, nunca como HTML executável.
            title.textContent = content.title;
            description.textContent = content.description;
            section.hidden = false;
        });
    }

    window.LuLeve.promotion = {
        getContent,
        init: initPromotion
    };
})();
