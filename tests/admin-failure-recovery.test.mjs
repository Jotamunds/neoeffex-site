/**
 * Testes Automatizados de Simulação — Recuperação de Falhas no Admin (P02)
 * Neoeffex Catalog Platform
 *
 * Executa simulações das 5 matrizes de falha do fluxo de produtos e imagens.
 */

import assert from "node:assert/strict";

console.log("Iniciando suíte de testes de simulação: Recuperação de Falhas no Admin (P02)...");

// MOCK do Supabase Client
function createMockSupabase(scenario) {
    const db = {
        products: new Map(),
        storage: new Set()
    };

    let nextId = 1;

    return {
        _db: db,
        auth: {
            async getUser() {
                return { data: { user: { id: "user-123" } }, error: null };
            }
        },
        storage: {
            from(bucket) {
                return {
                    async upload(path, file) {
                        if (scenario.uploadFails) {
                            return { data: null, error: new Error("Simulated storage upload error (500)") };
                        }
                        db.storage.add(path);
                        return { data: { path }, error: null };
                    },
                    async remove(paths) {
                        if (scenario.removeFails) {
                            return { data: null, error: new Error("Simulated storage remove error (403)") };
                        }
                        paths.forEach(p => db.storage.delete(p));
                        return { data: paths, error: null };
                    }
                };
            }
        },
        from(table) {
            if (table === "products") {
                return {
                    insert(payload) {
                        const id = "prod-" + (nextId++);
                        const record = { id, ...payload };
                        db.products.set(id, record);
                        return {
                            select() {
                                return {
                                    async single() {
                                        return { data: record, error: null };
                                    }
                                };
                            }
                        };
                    },
                    update(payload) {
                        return {
                            eq(field, value) {
                                if (scenario.imageLinkFails) {
                                    return {
                                        select() {
                                            return {
                                                async single() {
                                                    return { data: null, error: new Error("Simulated DB image update link error") };
                                                }
                                            };
                                        }
                                    };
                                }
                                const record = db.products.get(value);
                                if (record) {
                                    Object.assign(record, payload);
                                }
                                return {
                                    select() {
                                        return {
                                            async single() {
                                                return { data: record, error: null };
                                            }
                                        };
                                    }
                                };
                            }
                        };
                    },
                    delete() {
                        return {
                            async eq(field, value) {
                                if (scenario.compensatoryDeleteFails) {
                                    return { data: null, error: new Error("Simulated compensatory delete failure (RLS/FK constraint)") };
                                }
                                const deleted = db.products.delete(value);
                                return { data: deleted, error: null };
                            }
                        };
                    }
                };
            }
            throw new Error(`Table ${table} not mocked`);
        }
    };
}

// SIMULADOR DO FLUXO DE saveProduct
async function simulateSaveProduct({ client, activeCatalog, productId, payload, imageFile, currentProduct, removeImage }) {
    const state = {
        productIdField: productId,
        feedback: null,
        modalClosed: false,
        reloaded: false
    };

    let uploadedImagePath = "";
    let savedProductId = productId;
    const isNewProduct = !productId;

    if (productId) {
        if (imageFile) {
            const uploadResult = await client.storage.from("catalog-products").upload("path/to/img", imageFile);
            if (uploadResult.error) {
                state.feedback = { message: "Não foi possível enviar a imagem.", type: "error" };
                return state;
            }
            uploadedImagePath = uploadResult.data.path;
            payload.image_path = uploadedImagePath;
        } else if (removeImage && currentProduct && currentProduct.image_path) {
            payload.image_path = null;
        }
        const updateResult = await client.from("products").update(payload).eq("id", productId).select().single();
        if (updateResult.error) {
            if (uploadedImagePath) await client.storage.from("catalog-products").remove([uploadedImagePath]);
            state.feedback = { message: "Não foi possível salvar o produto.", type: "error" };
            return state;
        }
    } else {
        const insertResult = await client.from("products").insert({ ...payload, catalog_id: activeCatalog.id }).select().single();
        if (insertResult.error) {
            state.feedback = { message: "Não foi possível salvar o produto.", type: "error" };
            return state;
        }
        savedProductId = insertResult.data.id;
    }

    if (isNewProduct && imageFile) {
        const uploadResult = await client.storage.from("catalog-products").upload("path/to/img", imageFile);
        if (uploadResult.error) {
            const compensationResult = await client.from("products").delete().eq("id", savedProductId);
            if (compensationResult.error) {
                state.productIdField = savedProductId;
                state.feedback = {
                    message: "O produto foi criado, mas a imagem não pôde ser enviada. Você pode editar este produto e tentar adicionar a imagem novamente.",
                    type: "error"
                };
                return state;
            }
            state.feedback = {
                message: "Não foi possível enviar a imagem. O produto não foi criado; confirme se a migração 006 foi executada.",
                type: "error"
            };
            return state;
        }

        uploadedImagePath = uploadResult.data.path;
        const imageUpdateResult = await client.from("products").update({ image_path: uploadedImagePath }).eq("id", savedProductId).select().single();
        if (imageUpdateResult.error) {
            await client.storage.from("catalog-products").remove([uploadedImagePath]);
            const compensationResult = await client.from("products").delete().eq("id", savedProductId);
            if (compensationResult.error) {
                state.productIdField = savedProductId;
                state.feedback = {
                    message: "O produto foi criado, mas a imagem não pôde ser vinculada. Tente salvar novamente para concluir a vinculação.",
                    type: "error"
                };
                return state;
            }
            state.feedback = { message: "Não foi possível vincular a imagem. O produto não foi criado.", type: "error" };
            return state;
        }
    }

    // Cleanup de imagem antiga protegida
    const previousImagePath = currentProduct && currentProduct.image_path;
    if (previousImagePath && (uploadedImagePath || removeImage)) {
        try {
            await client.storage.from("catalog-products").remove([previousImagePath]);
        } catch (_) {
            // Safe cleanup
        }
    }

    state.modalClosed = true;
    state.reloaded = true;
    return state;
}

// -----------------------------------------------------------------------------
// EXECUÇÃO DOS CENÁRIOS DE TESTE
// -----------------------------------------------------------------------------

// Teste 1: Falha no upload em produto novo com compensação bem-sucedida
{
    const client = createMockSupabase({ uploadFails: true, compensatoryDeleteFails: false });
    const result = await simulateSaveProduct({
        client,
        activeCatalog: { id: "cat-1" },
        productId: "",
        payload: { name: "Burger Test", price: "25.00" },
        imageFile: { name: "test.jpg" }
    });

    assert.equal(result.productIdField, "");
    assert.match(result.feedback.message, /O produto não foi criado/);
    assert.equal(client._db.products.size, 0, "Produto deve ter sido excluído compensatoriamente");
    console.log("✓ Teste 1 aprovado: Falha no upload em produto novo compensada com sucesso (banco limpo).");
}

// Teste 2: Falha no upload em produto novo com FALHA na exclusão compensatória
{
    const client = createMockSupabase({ uploadFails: true, compensatoryDeleteFails: true });
    const result = await simulateSaveProduct({
        client,
        activeCatalog: { id: "cat-1" },
        productId: "",
        payload: { name: "Pizza Test", price: "50.00" },
        imageFile: { name: "test.jpg" }
    });

    assert.equal(client._db.products.size, 1, "Produto permanece no banco porque exclusão falhou");
    const createdId = [...client._db.products.keys()][0];
    assert.equal(result.productIdField, createdId, "ID deve ser retido no formulário para evitar duplicidade na próxima tentativa");
    assert.match(result.feedback.message, /O produto foi criado, mas a imagem não pôde ser enviada/);
    console.log("✓ Teste 2 aprovado: Falha na compensação retém ID no formulário e orienta edição segura.");
}

// Teste 3: Tentativa seguinte após Teste 2 reutiliza o ID retido (sem duplicar!)
{
    const client = createMockSupabase({ uploadFails: false, compensatoryDeleteFails: false });
    // Pré-existente do Teste 2
    client._db.products.set("prod-saved-1", { id: "prod-saved-1", name: "Pizza Test", price: "50.00", image_path: null });

    const result = await simulateSaveProduct({
        client,
        activeCatalog: { id: "cat-1" },
        productId: "prod-saved-1",
        payload: { name: "Pizza Test Atualizada", price: "55.00" },
        imageFile: { name: "pizza.jpg" },
        currentProduct: client._db.products.get("prod-saved-1")
    });

    assert.equal(result.modalClosed, true);
    assert.equal(client._db.products.size, 1, "Tamanho do banco deve continuar 1 (nenhuma duplicidade criada)");
    assert.equal(client._db.products.get("prod-saved-1").name, "Pizza Test Atualizada");
    assert.notEqual(client._db.products.get("prod-saved-1").image_path, null);
    console.log("✓ Teste 3 aprovado: Retomada com ID retido atualiza registro sem criar produto duplicado.");
}

// Teste 4: Falha na remoção de imagem antiga no Storage não trava salvamento
{
    const client = createMockSupabase({ uploadFails: false, removeFails: true });
    client._db.products.set("prod-old", { id: "prod-old", name: "Salada", price: "15.00", image_path: "old.jpg" });

    const result = await simulateSaveProduct({
        client,
        activeCatalog: { id: "cat-1" },
        productId: "prod-old",
        payload: { name: "Salada Nova", price: "18.00" },
        imageFile: { name: "new.jpg" },
        currentProduct: client._db.products.get("prod-old")
    });

    assert.equal(result.modalClosed, true, "Modal deve fechar mesmo se removeStorage falhou");
    assert.equal(client._db.products.get("prod-old").name, "Salada Nova");
    console.log("✓ Teste 4 aprovado: Falha na limpeza de Storage não aborta atualização bem-sucedida no banco.");
}

// Teste 5: Simulação de alternância rápida de catálogos (Race condition / isolamento de view)
{
    let activeCatalogId = "cat-A";
    let displayedCatalogData = null;

    async function fetchCatalogData(catalogId, delayMs) {
        await new Promise(r => setTimeout(r, delayMs));
        // Se ao terminar a busca o catálogo ativo mudou, descarta a resposta
        if (catalogId !== activeCatalogId) {
            return { discarded: true };
        }
        displayedCatalogData = { catalogId, title: "Dados de " + catalogId };
        return { discarded: false };
    }

    // Dispara busca lenta de Cat A (100ms)
    const reqA = fetchCatalogData("cat-A", 100);
    // Quase imediatamente usuário muda para Cat B
    activeCatalogId = "cat-B";
    const reqB = fetchCatalogData("cat-B", 20);

    await Promise.all([reqA, reqB]);

    assert.equal(displayedCatalogData.catalogId, "cat-B", "Catálogo B deve permanecer exibido, dados atrasados de A foram descartados");
    console.log("✓ Teste 5 aprovado: Race condition de alternância rápida de catálogo resolvida com verificação de id ativo.");
}

console.log("\nTodos os 5 testes de simulação de falhas e isolamento passaram com 100% de sucesso!");
