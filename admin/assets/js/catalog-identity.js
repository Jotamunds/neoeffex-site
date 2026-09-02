(function () {
    "use strict";

    const identityBucket = "catalog-identities";
    let initAttempts = 0;
    const maximumLogoSize = 2 * 1024 * 1024;
    const allowedLogoTypes = ["image/jpeg", "image/png", "image/webp"];
    let client = null;
    let pendingSave = null;
    let currentLogoPath = "";
    let logoObjectUrl = "";
    let identityToastTimeout = null;

    function init() {
        const form = document.getElementById("catalogForm");
        if (!form) return;
        client = window.NEOEFFEX_SUPABASE_CLIENT || null;
        if (!client) {
            initAttempts += 1;
            if (initAttempts <= 100) window.setTimeout(init, 40);
            return;
        }
        initAttempts = 0;

        injectIdentityFields(form);
        updateStageLabels();
        attachEvents(form);
    }

    function injectIdentityFields(form) {
        if (document.getElementById("catalogShortDescription")) return;
        const whatsappDivider = form.querySelector(".form-divider");
        if (!whatsappDivider) return;

        const wrapper = document.createElement("div");
        wrapper.className = "form-field form-field--full form-divider";
        const title = document.createElement("span");
        title.className = "form-section-title";
        title.textContent = "INFORMAÇÕES DO COMÉRCIO";
        wrapper.appendChild(title);

        const logoField = document.createElement("div");
        logoField.className = "form-field form-field--full";
        const logoLabel = document.createElement("label");
        logoLabel.htmlFor = "catalogLogo";
        logoLabel.textContent = "Logo do comércio";
        const logoBox = document.createElement("div");
        logoBox.className = "catalog-identity-logo";
        const preview = document.createElement("div");
        preview.className = "catalog-identity-logo__preview";
        const previewImage = document.createElement("img");
        previewImage.id = "catalogLogoPreviewImage";
        previewImage.alt = "";
        previewImage.hidden = true;
        const previewFallback = document.createElement("span");
        previewFallback.id = "catalogLogoPreviewFallback";
        previewFallback.textContent = "N";
        preview.append(previewImage, previewFallback);
        const logoInputBox = document.createElement("div");
        logoInputBox.className = "catalog-identity-logo__input";
        const logoInput = document.createElement("input");
        logoInput.id = "catalogLogo";
        logoInput.type = "file";
        logoInput.accept = "image/jpeg,image/png,image/webp";
        const logoHelp = document.createElement("span");
        logoHelp.className = "field-help";
        logoHelp.textContent = "Opcional. JPEG, PNG ou WebP, até 2 MB. Logos quadradas, horizontais e verticais são aceitas.";
        const removeLabel = document.createElement("label");
        removeLabel.id = "removeCatalogLogoField";
        removeLabel.className = "checkbox-field checkbox-field--compact";
        removeLabel.hidden = true;
        const removeInput = document.createElement("input");
        removeInput.id = "removeCatalogLogo";
        removeInput.type = "checkbox";
        const removeCopy = document.createElement("span");
        const removeStrong = document.createElement("strong");
        removeStrong.textContent = "Remover logo atual";
        const removeSmall = document.createElement("small");
        removeSmall.textContent = "A logo será removida ao salvar o catálogo.";
        removeCopy.append(removeStrong, removeSmall);
        removeLabel.append(removeInput, removeCopy);
        logoInputBox.append(logoInput, logoHelp, removeLabel);
        logoBox.append(preview, logoInputBox);
        logoField.append(logoLabel, logoBox);

        const descriptionField = createTextField(
            "catalogShortDescription",
            "Descrição curta",
            "Ex.: Marmitas caseiras, leves e preparadas sob encomenda.",
            200,
            true
        );
        const serviceAreaField = createTextField(
            "catalogServiceArea",
            "Região atendida ou endereço",
            "Ex.: Cotia e região / Rua Exemplo, 123",
            200,
            false
        );
        const hoursField = createTextField(
            "catalogBusinessHours",
            "Horário de atendimento",
            "Ex.: Seg. a sex., das 9h às 18h",
            200,
            false
        );

        const fulfillmentField = document.createElement("div");
        fulfillmentField.className = "form-field";
        const fulfillmentLabel = document.createElement("label");
        fulfillmentLabel.htmlFor = "catalogFulfillmentMode";
        fulfillmentLabel.textContent = "Forma de atendimento";
        const fulfillment = document.createElement("select");
        fulfillment.id = "catalogFulfillmentMode";
        [
            ["", "Não informar"],
            ["pickup", "Retirada"],
            ["delivery", "Entrega"],
            ["both", "Retirada e entrega"]
        ].forEach(function (item) {
            fulfillment.appendChild(new Option(item[1], item[0]));
        });
        fulfillmentField.append(fulfillmentLabel, fulfillment);

        const fragment = document.createDocumentFragment();
        fragment.append(wrapper, logoField, descriptionField, serviceAreaField, hoursField, fulfillmentField);
        form.insertBefore(fragment, whatsappDivider);
    }

    function createTextField(id, labelText, placeholder, maxLength, fullWidth) {
        const field = document.createElement("div");
        field.className = "form-field" + (fullWidth ? " form-field--full" : "");
        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = labelText;
        const input = document.createElement(fullWidth ? "textarea" : "input");
        input.id = id;
        input.maxLength = maxLength;
        input.placeholder = placeholder;
        if (!fullWidth) input.type = "text";
        field.append(label, input);
        return field;
    }

    function updateStageLabels() {
        const eyebrow = document.querySelector(".phase-card__eyebrow");
        const phaseTitle = document.querySelector(".phase-card strong");
        const phaseCopy = document.querySelector(".phase-card p");
        const version = document.querySelector(".version");
        const notice = document.querySelector(".stage-notice");
        if (eyebrow) eyebrow.textContent = "ETAPA 10";
        if (phaseTitle) phaseTitle.textContent = "Operação e entrega";
        if (phaseCopy) phaseCopy.textContent = "Operação concluída e primeiro tema visual de catálogo configurado."; 
        if (version) version.textContent = "ADMIN / 0.1.9.4";
        if (notice) {
            notice.setAttribute("aria-label", "Status da décima etapa");
            const paragraph = notice.querySelector("p");
            if (paragraph) {
                paragraph.replaceChildren();
                const strong = document.createElement("strong");
                strong.textContent = "Tema da Lu disponível. ";
                paragraph.append(strong, document.createTextNode("O slug lu-leve-e-saudavel agora aplica a identidade visual do site sem alterar os demais catálogos. A segurança da Etapa 9 permanece inalterada."));
            }
        }
    }

    function attachEvents(form) {
        ["newCatalogButton", "editCatalogButton", "configureOrdersButton"].forEach(function (id) {
            const button = document.getElementById(id);
            if (!button) return;
            button.addEventListener("click", function () {
                window.setTimeout(loadIdentityForOpenModal, 0);
            });
        });

        form.addEventListener("submit", captureIdentityBeforeCoreSave, true);

        const logoInput = document.getElementById("catalogLogo");
        const removeLogo = document.getElementById("removeCatalogLogo");
        const previewImage = document.getElementById("catalogLogoPreviewImage");
        logoInput.addEventListener("change", previewSelectedLogo);
        removeLogo.addEventListener("change", handleRemoveLogoChange);
        previewImage.addEventListener("error", function () {
            showLogoPreview("", "N");
        });

        const modal = document.getElementById("catalogModal");
        const closeButton = document.getElementById("closeCatalogModal");
        if (closeButton) closeButton.addEventListener("click", cancelPendingSave);
        if (modal) {
            modal.addEventListener("click", function (event) {
                if (event.target === modal) cancelPendingSave();
            });
            new MutationObserver(function () {
                if (!modal.hidden) return;
                clearLogoObjectUrl();
                if (!pendingSave) return;
                const snapshot = pendingSave;
                pendingSave = null;
                persistIdentity(snapshot);
            }).observe(modal, { attributes: true, attributeFilter: ["hidden"] });
        }

        window.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && modal && !modal.hidden) cancelPendingSave();
        });

        const saveButton = document.getElementById("saveCatalogButton");
        if (saveButton) {
            new MutationObserver(function () {
                setIdentityFieldsDisabled(saveButton.disabled);
            }).observe(saveButton, { attributes: true, attributeFilter: ["disabled"] });
        }
    }

    function cancelPendingSave() {
        pendingSave = null;
    }

    function setIdentityFieldsDisabled(disabled) {
        [
            "catalogLogo",
            "removeCatalogLogo",
            "catalogShortDescription",
            "catalogServiceArea",
            "catalogBusinessHours",
            "catalogFulfillmentMode"
        ].forEach(function (id) {
            const field = document.getElementById(id);
            if (field) field.disabled = disabled;
        });
    }

    function getPublicLogoUrl(path) {
        if (!path || !client) return "";
        const result = client.storage.from(identityBucket).getPublicUrl(path);
        return result.data && result.data.publicUrl ? result.data.publicUrl : "";
    }

    function clearLogoObjectUrl() {
        if (!logoObjectUrl) return;
        URL.revokeObjectURL(logoObjectUrl);
        logoObjectUrl = "";
    }

    function showLogoPreview(url, fallbackText) {
        const image = document.getElementById("catalogLogoPreviewImage");
        const fallback = document.getElementById("catalogLogoPreviewFallback");
        if (!image || !fallback) return;
        fallback.textContent = (fallbackText || "N").trim().charAt(0).toLocaleUpperCase("pt-BR") || "N";
        image.hidden = !url;
        fallback.hidden = Boolean(url);
        image.src = url || "";
        image.alt = url ? "Prévia da logo do comércio" : "";
    }

    function validateLogo(file) {
        if (!file) return "";
        if (!allowedLogoTypes.includes(file.type)) return "Use uma logo JPEG, PNG ou WebP.";
        if (file.size <= 0 || file.size > maximumLogoSize) return "A logo precisa ter no máximo 2 MB.";
        return "";
    }

    function previewSelectedLogo() {
        const input = document.getElementById("catalogLogo");
        const file = input.files && input.files[0];
        const message = validateLogo(file);
        if (message) {
            input.value = "";
            setCatalogFeedback(message, "error");
            return;
        }
        if (!file) return;
        clearLogoObjectUrl();
        logoObjectUrl = URL.createObjectURL(file);
        document.getElementById("removeCatalogLogo").checked = false;
        showLogoPreview(logoObjectUrl, document.getElementById("catalogName").value || "N");
        setCatalogFeedback("", "");
    }

    function handleRemoveLogoChange() {
        const remove = document.getElementById("removeCatalogLogo");
        const input = document.getElementById("catalogLogo");
        if (remove.checked) {
            input.value = "";
            clearLogoObjectUrl();
            showLogoPreview("", document.getElementById("catalogName").value || "N");
            return;
        }
        showLogoPreview(getPublicLogoUrl(currentLogoPath), document.getElementById("catalogName").value || "N");
    }

    function resetIdentityFields() {
        currentLogoPath = "";
        clearLogoObjectUrl();
        document.getElementById("catalogLogo").value = "";
        document.getElementById("removeCatalogLogo").checked = false;
        document.getElementById("removeCatalogLogoField").hidden = true;
        document.getElementById("catalogShortDescription").value = "";
        document.getElementById("catalogServiceArea").value = "";
        document.getElementById("catalogBusinessHours").value = "";
        document.getElementById("catalogFulfillmentMode").value = "";
        showLogoPreview("", document.getElementById("catalogName").value || "N");
    }

    async function loadIdentityForOpenModal() {
        const modal = document.getElementById("catalogModal");
        if (!modal || modal.hidden) return;
        resetIdentityFields();
        const catalogId = document.getElementById("catalogId").value;
        if (!catalogId) return;

        const result = await client.from("catalogs")
            .select("id, name, logo_path, short_description, service_area, business_hours, fulfillment_mode")
            .eq("id", catalogId)
            .maybeSingle();
        if (result.error || !result.data || modal.hidden || document.getElementById("catalogId").value !== catalogId) {
            if (result.error) console.error("Erro ao carregar identidade do catálogo", result.error);
            return;
        }

        const data = result.data;
        currentLogoPath = data.logo_path || "";
        document.getElementById("catalogShortDescription").value = data.short_description || "";
        document.getElementById("catalogServiceArea").value = data.service_area || "";
        document.getElementById("catalogBusinessHours").value = data.business_hours || "";
        document.getElementById("catalogFulfillmentMode").value = data.fulfillment_mode || "";
        document.getElementById("removeCatalogLogoField").hidden = !currentLogoPath;
        showLogoPreview(getPublicLogoUrl(currentLogoPath), data.name || "N");
    }

    function captureIdentityBeforeCoreSave(event) {
        const fileInput = document.getElementById("catalogLogo");
        const file = fileInput.files && fileInput.files[0];
        const shortDescription = document.getElementById("catalogShortDescription").value.trim();
        const serviceArea = document.getElementById("catalogServiceArea").value.trim();
        const businessHours = document.getElementById("catalogBusinessHours").value.trim();
        const fulfillmentMode = document.getElementById("catalogFulfillmentMode").value;
        const logoMessage = validateLogo(file);

        if (logoMessage || shortDescription.length > 200 || serviceArea.length > 200 || businessHours.length > 200
            || !["", "pickup", "delivery", "both"].includes(fulfillmentMode)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            setCatalogFeedback(logoMessage || "Revise as informações do comércio. Os campos de texto aceitam até 200 caracteres.", "error");
            pendingSave = null;
            return;
        }

        pendingSave = {
            catalogId: document.getElementById("catalogId").value,
            slug: document.getElementById("catalogSlug").value.trim().toLocaleLowerCase("pt-BR"),
            name: document.getElementById("catalogName").value.trim(),
            logoFile: file || null,
            removeLogo: document.getElementById("removeCatalogLogo").checked,
            previousLogoPath: currentLogoPath,
            shortDescription: shortDescription,
            serviceArea: serviceArea,
            businessHours: businessHours,
            fulfillmentMode: fulfillmentMode
        };
    }

    function getLogoExtension(file) {
        return {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/webp": "webp"
        }[file.type] || "";
    }

    async function uploadLogo(file, catalogId, userId) {
        const extension = getLogoExtension(file);
        const path = userId + "/" + catalogId + "/" + Date.now() + "." + extension;
        const result = await client.storage.from(identityBucket).upload(path, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: false
        });
        return { path: result.error ? "" : path, error: result.error };
    }

    async function removeStoredLogo(path) {
        if (!path) return null;
        const result = await client.storage.from(identityBucket).remove([path]);
        return result.error || null;
    }

    async function persistIdentity(snapshot) {
        const userResult = await client.auth.getUser();
        const user = userResult.data && userResult.data.user;
        if (userResult.error || !user) {
            showIdentityToast("Catálogo salvo, mas não foi possível confirmar a sessão para atualizar a identidade.");
            return;
        }

        let catalogId = snapshot.catalogId;
        if (!catalogId) {
            const catalogResult = await client.from("catalogs").select("id").eq("slug", snapshot.slug).maybeSingle();
            if (catalogResult.error || !catalogResult.data) {
                console.error("Erro ao localizar catálogo recém-criado", catalogResult.error);
                showIdentityToast("Catálogo criado, mas a identidade não foi atualizada. Abra Editar catálogo e tente novamente.");
                return;
            }
            catalogId = catalogResult.data.id;
        }

        let uploadedLogoPath = "";
        if (snapshot.logoFile) {
            const upload = await uploadLogo(snapshot.logoFile, catalogId, user.id);
            if (upload.error) {
                console.error("Erro ao enviar logo", upload.error);
                showIdentityToast("Catálogo salvo, mas não foi possível enviar a logo. Confirme se a migração 008 foi aplicada.");
                return;
            }
            uploadedLogoPath = upload.path;
        }

        const payload = {
            short_description: snapshot.shortDescription || null,
            service_area: snapshot.serviceArea || null,
            business_hours: snapshot.businessHours || null,
            fulfillment_mode: snapshot.fulfillmentMode || null
        };
        if (uploadedLogoPath) payload.logo_path = uploadedLogoPath;
        else if (snapshot.removeLogo) payload.logo_path = null;

        const updateResult = await client.from("catalogs").update(payload).eq("id", catalogId).select("id").single();
        if (updateResult.error) {
            console.error("Erro ao atualizar identidade do catálogo", updateResult.error);
            if (uploadedLogoPath) await removeStoredLogo(uploadedLogoPath);
            showIdentityToast("Catálogo salvo, mas a identidade não foi atualizada. Tente novamente em Editar catálogo.");
            return;
        }

        let cleanupError = null;
        if (snapshot.previousLogoPath && (uploadedLogoPath || snapshot.removeLogo)) {
            cleanupError = await removeStoredLogo(snapshot.previousLogoPath);
        }
        showIdentityToast(cleanupError
            ? "Identidade atualizada, mas a logo anterior não pôde ser removida do armazenamento."
            : "Identidade do comércio atualizada com sucesso.");
    }

    function setCatalogFeedback(message, type) {
        const feedback = document.getElementById("catalogFeedback");
        if (!feedback) return;
        feedback.textContent = message;
        feedback.dataset.type = type || "";
    }

    function showIdentityToast(message) {
        const toast = document.getElementById("toast");
        if (!toast) return;
        window.clearTimeout(identityToastTimeout);
        toast.textContent = message;
        toast.hidden = false;
        requestAnimationFrame(function () {
            toast.classList.add("toast--visible");
        });
        identityToastTimeout = window.setTimeout(function () {
            toast.classList.remove("toast--visible");
            window.setTimeout(function () { toast.hidden = true; }, 180);
        }, 4600);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
}());


(function loadImageEditorModule() {
    "use strict";

    const stylesheetPath = "assets/css/image-editor.css";
    const scriptPath = "assets/js/image-editor.js";

    if (!document.querySelector('link[href="' + stylesheetPath + '"]')) {
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = stylesheetPath;
        document.head.appendChild(stylesheet);
    }

    if (!document.querySelector('script[src="' + scriptPath + '"]')) {
        const script = document.createElement("script");
        script.src = scriptPath;
        script.async = false;
        document.head.appendChild(script);
    }
}());
