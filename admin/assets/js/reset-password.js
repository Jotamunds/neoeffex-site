(function () {
    "use strict";

    const config = window.NEOEFFEX_SUPABASE_CONFIG || {};
    const feedback = document.getElementById("resetFeedback");
    const form = document.getElementById("resetForm");
    const button = document.getElementById("resetSubmit");

    function setFeedback(message, type) {
        feedback.textContent = message;
        feedback.dataset.type = type || "";
    }

    function getClient() {
        if (!config.url || !config.publishableKey || !window.supabase) {
            setFeedback("A conexão do painel ainda não foi configurada.", "error");
            button.disabled = true;
            return null;
        }

        return window.supabase.createClient(config.url, config.publishableKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });
    }

    const client = getClient();

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (!client) return;

        const password = document.getElementById("newPassword").value;
        const confirmation = document.getElementById("newPasswordConfirmation").value;

        if (password.length < 12) {
            setFeedback("Use pelo menos 12 caracteres na nova senha.", "error");
            return;
        }

        if (password !== confirmation) {
            setFeedback("As duas senhas precisam ser iguais.", "error");
            return;
        }

        button.disabled = true;
        button.textContent = "Atualizando…";
        setFeedback("", "");

        const { error } = await client.auth.updateUser({ password: password });

        if (error) {
            setFeedback("Não foi possível atualizar a senha. Abra novamente o link enviado por e-mail.", "error");
            button.disabled = false;
            button.textContent = "Atualizar senha";
            return;
        }

        setFeedback("Senha atualizada. Você já pode entrar no painel.", "success");
        form.reset();
        button.textContent = "Senha atualizada";
    });
}());
