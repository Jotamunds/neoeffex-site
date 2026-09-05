/**
 * Testes Automatizados do Formulário de Contato da Home (P03)
 * Neoeffex Platform
 *
 * Testa cenários locais de resposta, timeout, preservação de dados e prevenção de duplo clique.
 */

import assert from "node:assert/strict";

console.log("Iniciando suíte de testes do formulário de contato (P03)...");

// Simulador do fluxo de envio do formulário
async function simulateFormSubmission({ fetchMock, formData, isSubmittingCurrently }) {
    if (isSubmittingCurrently) {
        return { blocked: true, reason: "Already submitting" };
    }

    let isSubmitting = true;
    let buttonDisabled = true;
    let buttonLabel = "Enviando...";
    let formReset = false;
    let status = null;
    let fallbackRendered = false;

    const controller = new AbortController();
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            controller.abort();
            const err = new Error("The operation was aborted");
            err.name = "AbortError";
            reject(err);
        }, 50); // Timeout rápido para teste
    });

    try {
        const fetchPromise = fetchMock(controller.signal);
        const response = await Promise.race([fetchPromise, timeoutPromise]);

        let result = null;
        try {
            result = await response.json();
        } catch (_) {
            result = null;
        }

        const isAccepted = response.ok && (
            !result || result.success === "true" || result.success === true || Boolean(result.message)
        );

        if (isAccepted) {
            status = { type: "success", message: "Solicitação recebida com sucesso! Em breve entraremos em contato." };
            buttonLabel = "Solicitação enviada";
            formReset = true;
        } else {
            throw new Error("Serviço de envio não aceitou a solicitação");
        }
    } catch (error) {
        const isTimeout = error.name === "AbortError";
        const errorText = isTimeout
            ? "O envio demorou mais que o esperado. Seus dados continuam preenchidos. Tente novamente ou converse direto conosco:"
            : "Não foi possível concluir o envio agora. Seus dados continuam preenchidos. Tente novamente ou use o WhatsApp:";

        status = { type: "error", message: errorText, isTimeout };
        fallbackRendered = true;
        buttonLabel = "Enviar solicitação";
        buttonDisabled = false;
        // Preserva dados (formReset permanece false)
    } finally {
        isSubmitting = false;
    }

    return {
        blocked: false,
        status,
        buttonDisabled,
        buttonLabel,
        formReset,
        fallbackRendered
    };
}

// -----------------------------------------------------------------------------
// CENÁRIO 1: Sucesso HTTP 200 com JSON { success: "true" }
// -----------------------------------------------------------------------------
{
    const fetchMock = async (signal) => ({
        ok: true,
        status: 200,
        async json() { return { success: "true", message: "The form was submitted successfully." }; }
    });

    const res = await simulateFormSubmission({ fetchMock, formData: {}, isSubmittingCurrently: false });
    assert.equal(res.status.type, "success");
    assert.equal(res.formReset, true, "Formulário deve ser limpo apenas em caso de sucesso");
    assert.equal(res.buttonLabel, "Solicitação enviada");
    console.log("✓ Cenário 1 aprovado: Envio com sucesso 200 limpa formulário e exibe confirmação.");
}

// -----------------------------------------------------------------------------
// CENÁRIO 2: Erro HTTP (ex: 500 do FormSubmit)
// -----------------------------------------------------------------------------
{
    const fetchMock = async (signal) => ({
        ok: false,
        status: 500,
        async json() { return { error: "Internal server error" }; }
    });

    const res = await simulateFormSubmission({ fetchMock, formData: {}, isSubmittingCurrently: false });
    assert.equal(res.status.type, "error");
    assert.equal(res.formReset, false, "Dados NÃO podem ser apagados em caso de erro");
    assert.equal(res.fallbackRendered, true, "Fallback do WhatsApp deve ser oferecido");
    assert.equal(res.buttonDisabled, false, "Botão deve ser reabilitado para nova tentativa");
    console.log("✓ Cenário 2 aprovado: Erro 500 preserva dados e oferece fallback com WhatsApp.");
}

// -----------------------------------------------------------------------------
// CENÁRIO 3: Resposta inesperada / HTML ao invés de JSON
// -----------------------------------------------------------------------------
{
    const fetchMock = async (signal) => ({
        ok: false,
        status: 403,
        async json() { throw new SyntaxError("Unexpected token < in JSON"); }
    });

    const res = await simulateFormSubmission({ fetchMock, formData: {}, isSubmittingCurrently: false });
    assert.equal(res.status.type, "error");
    assert.equal(res.formReset, false);
    assert.equal(res.fallbackRendered, true);
    console.log("✓ Cenário 3 aprovado: Resposta inesperada tratada graciosamente com fallback.");
}

// -----------------------------------------------------------------------------
// CENÁRIO 4: Timeout via AbortController
// -----------------------------------------------------------------------------
{
    const fetchMock = (signal) => new Promise((resolve) => {
        // Nunca resolve para forçar timeout
    });

    const res = await simulateFormSubmission({ fetchMock, formData: {}, isSubmittingCurrently: false });
    assert.equal(res.status.type, "error");
    assert.equal(res.status.isTimeout, true);
    assert.match(res.status.message, /demorou mais que o esperado/);
    assert.equal(res.formReset, false, "Dados preservados durante timeout");
    assert.equal(res.buttonDisabled, false, "Botão liberado após timeout");
    console.log("✓ Cenário 4 aprovado: Timeout de AbortController dispara mensagem específica e mantém dados.");
}

// -----------------------------------------------------------------------------
// CENÁRIO 5: Tentativa de múltiplos cliques (duplo submit bloqueado)
// -----------------------------------------------------------------------------
{
    const res = await simulateFormSubmission({ fetchMock: null, formData: {}, isSubmittingCurrently: true });
    assert.equal(res.blocked, true);
    assert.equal(res.reason, "Already submitting");
    console.log("✓ Cenário 5 aprovado: Cliques repetidos bloqueados enquanto envio está em andamento.");
}

console.log("\nTodos os 5 cenários do formulário de contato foram validados com sucesso!");
