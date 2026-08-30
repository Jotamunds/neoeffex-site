/* Funções puras: validam os dados e produzem HTML, sem ler ou alterar arquivos.
 * Os valores são centavos inteiros; o total é a fonte do preço por marmita.
 */
const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

function requireValue(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function isPositiveInteger(value) {
    return Number.isSafeInteger(value) && value > 0;
}

function requireText(value, field) {
    requireValue(typeof value === "string" && value.trim().length > 0, `Texto inválido: ${field}.`);
}

export function escapeHtml(value) {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}

export function validateMenu(menu) {
    requireValue(menu && typeof menu === "object", "Cardápio ausente.");
    requireValue(isPositiveInteger(menu.featuredQuantity), "Quantidade destacada inválida.");
    requireText(menu.featuredLabel, "featuredLabel");
    requireValue(Array.isArray(menu.categories) && menu.categories.length === 2, "Informe as duas categorias.");

    const expectedCategories = ["tradicionais", "fitness"];
    const identifiers = new Set();

    menu.categories.forEach((category, index) => {
        requireValue(category.id === expectedCategories[index], "Mantenha tradicionais antes de fitness.");
        requireValue(Array.isArray(category.products) && category.products.length > 0, `Categoria vazia: ${category.id}.`);

        for (const product of category.products) {
            requireValue(typeof product.id === "string" && /^[a-z][a-z0-9-]*$/.test(product.id), "ID de produto inválido.");
            requireValue(!identifiers.has(product.id), `Produto duplicado: ${product.id}.`);
            identifiers.add(product.id);
            requireText(product.name, product.id);
            requireText(product.description, product.id);
            requireValue(isPositiveInteger(product.unitPriceCents), `Preço individual inválido: ${product.id}.`);
            requireValue(Array.isArray(product.combos) && product.combos.length > 0, `Combos ausentes: ${product.id}.`);

            let previousQuantity = 1;

            for (const combo of product.combos) {
                requireValue(isPositiveInteger(combo.quantity) && combo.quantity > previousQuantity, `Quantidades devem ser únicas e crescentes: ${product.id}.`);
                requireValue(isPositiveInteger(combo.totalCents), `Total inválido: ${product.id}.`);
                previousQuantity = combo.quantity;
            }

            requireValue(product.combos.some((combo) => combo.quantity === menu.featuredQuantity), `Combo destacado ausente: ${product.id}.`);
        }
    });

    requireValue(Array.isArray(menu.surcharges) && menu.surcharges.length > 0, "Acréscimos ausentes.");
    const surchargeLabels = new Set();

    for (const surcharge of menu.surcharges) {
        requireText(surcharge.label, "surcharge.label");
        requireValue(!surchargeLabels.has(surcharge.label), "Acréscimo duplicado.");
        surchargeLabels.add(surcharge.label);
        requireValue(isPositiveInteger(surcharge.priceCents), "Valor de acréscimo inválido.");
    }

    return menu;
}

export function formatMoney(cents) {
    requireValue(Number.isSafeInteger(cents) && cents >= 0, "Use centavos inteiros para formatar valores.");
    return currency.format(cents / 100).replace(/\u00a0/g, " ");
}

export function perMeal(combo) {
    requireValue(isPositiveInteger(combo.totalCents) && isPositiveInteger(combo.quantity), "Combo inválido para cálculo.");
    return {
        cents: Math.round(combo.totalCents / combo.quantity),
        approximate: combo.totalCents % combo.quantity !== 0
    };
}

function renderCombo(combo, menu) {
    const featured = combo.quantity === menu.featuredQuantity;
    const unit = perMeal(combo);
    const badge = featured ? '\n    <span class="price-card__badge">' + escapeHtml(menu.featuredLabel) + "</span>" : "";

    return `<li class="price-card__combo${featured ? " price-card__combo--featured" : ""}">${badge}
    <span class="price-card__quantity">${combo.quantity} marmitas</span>
    <strong class="price-card__total numeric">${formatMoney(combo.totalCents)}</strong>
    <p class="price-card__per-meal">${unit.approximate ? "aprox. " : ""}<span class="numeric">${formatMoney(unit.cents)}</span> por marmita</p>
</li>`;
}

function indent(text, spaces) {
    const prefix = " ".repeat(spaces);
    return text.split("\n").map((line) => line ? prefix + line : line).join("\n");
}

function renderCard(product, category, menu) {
    const title = `${product.id}-title`;
    const combos = product.combos.map((combo) => indent(renderCombo(combo, menu), 12)).join("\n");
    const hasForkHighlight = product.id === "tradicional-400";
    const highlightAttribute = hasForkHighlight ? " data-fork-highlight-target" : "";
    const forkHighlight = hasForkHighlight ? `
    <span class="fork-highlight" data-fork-highlight aria-hidden="true">
        <svg class="fork-highlight__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
            <path d="M4 2v5"></path>
            <path d="M8 2v5"></path>
            <path d="M12 2v5"></path>
            <path d="M4 7a4 4 0 0 0 8 0"></path>
            <path d="M8 11v11"></path>
        </svg>
    </span>` : "";

    return `<article class="price-card surface"${highlightAttribute} aria-labelledby="${title}" aria-describedby="acrescimos-${category}">${forkHighlight}
    <header class="price-card__header">
        <h3 class="price-card__title" id="${title}">${escapeHtml(product.name)}</h3>
        <p class="price-card__description">${escapeHtml(product.description)}</p>
    </header>
    <p class="price-card__single"><span>Unidade</span><strong class="numeric">${formatMoney(product.unitPriceCents)}</strong></p>
    <div class="price-card__combos">
        <p class="price-card__combos-label">Combos</p>
        <ul class="price-card__list">
${combos}
        </ul>
    </div>
</article>`;
}

export function renderCategory(menu, categoryId) {
    validateMenu(menu);
    const category = menu.categories.find((entry) => entry.id === categoryId);
    requireValue(category, "Categoria desconhecida.");

    const surcharges = menu.surcharges.map((item) =>
        `        <li><strong>${escapeHtml(item.label)}</strong>: + <span class="numeric">${formatMoney(item.priceCents)}</span> por marmita.</li>`
    ).join("\n");
    const cards = category.products.map((product) => indent(renderCard(product, categoryId, menu), 4)).join("\n");

    return `<aside class="products__surcharges" aria-label="Acréscimos de proteína">
    <ul id="acrescimos-${categoryId}">
${surcharges}
    </ul>
    <p>Válidos para tradicionais e fitness. Valores dos combos não incluem acréscimos nem entrega.</p>
</aside>
<div class="products__grid">
${cards}
</div>`;
}

/* Só substitui regiões explicitamente marcadas; hero, contatos e demais seções ficam intactos. */
export function updateMenuHtml(html, menu) {
    validateMenu(menu);
    let result = html;

    for (const { id } of menu.categories) {
        const start = `<!-- MENU:${id}:START -->`;
        const end = `<!-- MENU:${id}:END -->`;
        requireValue(result.split(start).length === 2 && result.split(end).length === 2, `Marcadores ausentes ou duplicados: ${id}.`);
        const from = result.indexOf(start);
        const to = result.indexOf(end);
        requireValue(from < to, `Marcadores invertidos: ${id}.`);
        const prefix = result.slice(result.lastIndexOf("\n", from) + 1, from);
        requireValue(/^ *$/.test(prefix), "Marcador deve estar sozinho na linha.");
        result = result.slice(0, from + start.length) + "\n" + indent(renderCategory(menu, id), prefix.length) + "\n" + prefix + result.slice(to);
    }

    return result;
}
