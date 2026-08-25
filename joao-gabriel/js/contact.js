/*
 * JOÃO/OS — Aplicativo de contato
 *
 * Copia canais profissionais para a área de transferência
 * e usa o centro de notificações para confirmar a ação.
 */

const CONTACT_VALUES = {
    email: {
        label: "E-mail",
        value: "atendimento@neoeffex.com.br",
    },
    github: {
        label: "GitHub",
        value: "https://github.com/jotamunds",
    },
    linkedin: {
        label: "LinkedIn",
        value: "https://www.linkedin.com/in/joao-gabriel-vieira-da-silva",
    },
};

async function copyWithFallback(value) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(value);
            return;
        } catch (error) {
            /* Tenta o método compatível com navegadores mais antigos. */
        }
    }

    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = value;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    temporaryInput.style.pointerEvents = "none";

    document.body.append(temporaryInput);
    temporaryInput.select();

    const didCopy = document.execCommand("copy");
    temporaryInput.remove();

    if (!didCopy) {
        throw new Error("O navegador recusou a cópia.");
    }
}

export function initializeContactApp({ notify }) {
    const copyButtons = document.querySelectorAll(
        "[data-contact-copy]"
    );

    const resetTimers = new WeakMap();

    function showTemporarySuccess(button) {
        const existingTimer = resetTimers.get(button);

        if (existingTimer) {
            window.clearTimeout(existingTimer);
        }

        button.textContent = "Copiado ✓";
        button.classList.add("is-copied");

        const timer = window.setTimeout(function () {
            button.textContent = "Copiar";
            button.classList.remove("is-copied");
            resetTimers.delete(button);
        }, 1800);

        resetTimers.set(button, timer);
    }

    copyButtons.forEach(function (button) {
        const contact = CONTACT_VALUES[button.dataset.contactCopy];

        if (!contact) {
            return;
        }

        button.setAttribute(
            "aria-label",
            `Copiar ${contact.label}`
        );

        button.addEventListener("click", async function () {
            try {
                await copyWithFallback(contact.value);
                showTemporarySuccess(button);

                notify({
                    id: `contact-copy-${button.dataset.contactCopy}`,
                    symbol: "✓",
                    title: `${contact.label} copiado`,
                    message: "A informação foi enviada para a área de transferência.",
                    sourceElement: button,
                });
            } catch (error) {
                notify({
                    id: `contact-copy-error-${button.dataset.contactCopy}`,
                    symbol: "!",
                    title: "Não foi possível copiar",
                    message:
                        "Selecione a informação manualmente ou abra o canal desejado.",
                    sourceElement: button,
                });
            }
        });
    });
}
