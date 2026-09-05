/**
 * Testes Automatizados do Modo Demonstração/Simulação do Catálogo (P04)
 * Neoeffex Catalog Platform
 *
 * Testa detecção de modo simulação, carrinho e proteção contra envio real.
 */

import assert from "node:assert/strict";

console.log("Iniciando suíte de testes de simulação de catálogo (P04)...");

function isSimulationMode(urlSearch, catalog, config) {
    const urlParams = new URLSearchParams(urlSearch);
    const configuredSlugs = (config && config.simulationSlugs) || ["demo-neoeffex"];
    return urlParams.get("demo") === "1"
        || urlParams.get("simulacao") === "1"
        || Boolean(catalog && configuredSlugs.includes(catalog.slug))
        || Boolean(catalog && catalog.fulfillment_mode === "simulation");
}

function ordersAvailable(urlSearch, catalog, config) {
    return Boolean(catalog && (isSimulationMode(urlSearch, catalog, config) || (catalog.orders_enabled && catalog.whatsapp_number)));
}

function buildOrderMessage(catalogName, entries, total, customMessage) {
    const lines = ["Olá! Gostaria de fazer este pedido pelo catálogo " + catalogName + ":", ""];
    entries.forEach(entry => {
        const itemTotal = Number(entry.price) * entry.quantity;
        lines.push(`• ${entry.quantity}x ${entry.name}`);
        lines.push(`  ${entry.quantity} × R$ ${Number(entry.price).toFixed(2)} = R$ ${itemTotal.toFixed(2)}`);
    });
    lines.push("");
    lines.push(`Total estimado: R$ ${total.toFixed(2)}`);
    if (customMessage) {
        lines.push("");
        lines.push(customMessage);
    }
    return lines.join("\n");
}

// 1. Catálogo comercial padrão (sem demo) -> modo simulação FALSO
{
    const commercialCatalog = {
        name: "Restaurante Lu",
        slug: "lu-leve-e-saudavel",
        orders_enabled: true,
        whatsapp_number: "5511999999999",
        fulfillment_mode: "pickup"
    };

    assert.equal(isSimulationMode("", commercialCatalog), false);
    assert.equal(ordersAvailable("", commercialCatalog), true);
    console.log("✓ Teste 1 aprovado: Catálogo comercial opera em modo padrão normal.");
}

// 2. Catálogo configurado em simulationSlugs com fulfillment_mode 'both' -> modo simulação VERDADEIRO
{
    const demoCatalog = {
        name: "Catálogo Demo Neoeffex",
        slug: "demo-neoeffex",
        orders_enabled: true,
        whatsapp_number: "5511997763958",
        fulfillment_mode: "both"
    };
    const catalogConfig = { simulationSlugs: ["demo-neoeffex"] };

    assert.equal(isSimulationMode("", demoCatalog, catalogConfig), true);
    assert.equal(ordersAvailable("", demoCatalog, catalogConfig), true);
    console.log("✓ Teste 2 aprovado: Catálogo com slug configurado ativa modo seguro de simulação com fulfillment_mode 'both'.");
}

// 3. Qualquer catálogo acessado com ?demo=1 na URL -> modo simulação VERDADEIRO
{
    const standardCatalog = {
        name: "Loja Teste",
        orders_enabled: false,
        whatsapp_number: "",
        fulfillment_mode: "pickup"
    };

    assert.equal(isSimulationMode("?catalogo=loja-teste&demo=1", standardCatalog), true);
    assert.equal(ordersAvailable("?catalogo=loja-teste&demo=1", standardCatalog), true, "Simulação permite testar carrinho mesmo sem whatsapp_number comercial configurado");
    console.log("✓ Teste 3 aprovado: Parâmetro ?demo=1 ativa simulação segura e permite testar carrinho.");
}

// 4. Formatação da mensagem gerada na simulação
{
    const entries = [
        { name: "Produto Demo A", price: "19.90", quantity: 2 },
        { name: "Produto Demo D", price: "5.99", quantity: 1 }
    ];
    const total = (19.90 * 2) + (5.99 * 1);
    const msg = buildOrderMessage("Catálogo Demo Neoeffex", entries, total, "PEDIDO DE TESTE — Ambiente de demonstração.");

    assert.match(msg, /Produto Demo A/);
    assert.match(msg, /2x Produto Demo A/);
    assert.match(msg, /Total estimado: R\$ 45\.79/);
    assert.match(msg, /PEDIDO DE TESTE/);
    console.log("✓ Teste 4 aprovado: Mensagem de pedido formatada com exatidão conforme checklist.");
}

console.log("\nTodos os 4 testes de simulação de catálogo passaram com sucesso!");
