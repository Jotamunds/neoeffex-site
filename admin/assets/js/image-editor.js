(function () {
    "use strict";

    const INPUT_CONFIG = Object.freeze({
        productImage: Object.freeze({
            kind: "product",
            title: "Ajustar imagem do produto",
            width: 1200,
            height: 1200,
            aspectRatio: "1:1",
            defaultMode: "fill",
            maximumBytes: 5 * 1024 * 1024,
            maximumSourceBytes: 5 * 1024 * 1024,
            prefix: "produto"
        }),
        flavorImage: Object.freeze({
            kind: "flavor",
            title: "Ajustar foto do sabor",
            width: 1200,
            height: 1200,
            aspectRatio: "1:1",
            defaultMode: "fill",
            maximumBytes: 5 * 1024 * 1024,
            maximumSourceBytes: 5 * 1024 * 1024,
            prefix: "sabor"
        }),
        catalogLogo: Object.freeze({
            kind: "logo",
            title: "Ajustar logo do comércio",
            width: 1000,
            height: 1000,
            defaultRatio: "square",
            defaultMode: "fit",
            maximumBytes: 2 * 1024 * 1024,
            maximumSourceBytes: 2 * 1024 * 1024,
            prefix: "logo",
            ratios: Object.freeze({
                square: Object.freeze({ width: 1000, height: 1000, label: "1:1 Quadrada (padrão)" }),
                portrait_3_4: Object.freeze({ width: 900, height: 1200, label: "3:4 Vertical" }),
                landscape_4_3: Object.freeze({ width: 1200, height: 900, label: "4:3 Horizontal" })
            })
        })
    });

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    const sourceFiles = new WeakMap();
    const savedStates = new WeakMap();
    const launchButtons = new WeakMap();
    const previewObservers = new WeakMap();

    let editor = null;
    let activeSession = null;
    let previousFocusedElement = null;
    let dragging = false;
    let dragPointerId = null;
    let lastPointerX = 0;
    let lastPointerY = 0;

    function init() {
        buildEditor();
        setupAvailableInputs();

        document.addEventListener("change", interceptImageSelection, true);
        document.addEventListener("change", handleRemoveImageToggle);
        document.addEventListener("reset", handleFormReset, true);
        document.addEventListener("keydown", handleGlobalKeydown);
        document.addEventListener("click", scheduleDynamicInputSetup, true);
    }

    function setupAvailableInputs() {
        Object.keys(INPUT_CONFIG).forEach(function (id) {
            const input = document.getElementById(id);

            if (input) ensureLaunchControl(input);
        });
    }

    function ensureLaunchControl(input) {
        if (launchButtons.has(input)) {
            syncLaunchControl(input);
            return;
        }

        const button = document.createElement("button");
        const help = document.createElement("span");

        button.type = "button";
        button.className = "image-editor-launch";
        button.textContent = "Ajustar imagem";
        button.hidden = true;

        help.className = "image-editor-inline-help";
        if (input.id === "productImage") {
            help.textContent = "O editor padroniza a foto do produto em 1:1 antes do upload.";
        } else if (input.id === "flavorImage") {
            help.textContent = "O editor padroniza a foto do sabor em 1:1 antes do upload.";
        } else {
            help.textContent = "O editor permite enquadrar a logo em 1:1, 3:4 ou 4:3 sem deformá-la.";
        }

        button.addEventListener("click", function () {
            openFromLaunchButton(input);
        });

        const container = input.parentElement || input;
        container.append(button, help);
        launchButtons.set(input, button);

        const preview = getPreviewImage(input);

        if (preview) {
            const observer = new MutationObserver(function () {
                syncLaunchControl(input);
            });

            observer.observe(preview, {
                attributes: true,
                attributeFilter: ["hidden", "src"]
            });

            previewObservers.set(input, observer);
        }

        syncLaunchControl(input);
    }

    function syncLaunchControl(input) {
        const button = launchButtons.get(input);

        if (!button) return;

        const preview = getPreviewImage(input);
        const hasPreview = Boolean(
            preview
            && !preview.hidden
            && preview.getAttribute("src")
            && !isBlankPreview(preview.getAttribute("src"))
        );

        const shouldHide = !(sourceFiles.has(input) || hasPreview);
        const nextText = sourceFiles.has(input) ? "Ajustar novamente" : "Ajustar foto atual";

        if (button.hidden !== shouldHide) button.hidden = shouldHide;
        if (button.textContent !== nextText) button.textContent = nextText;
    }

    function scheduleDynamicInputSetup(event) {
        const target = event.target && event.target.closest ? event.target.closest("button") : null;

        if (!target) return;
        if (![
            "editCatalogButton",
            "configureOrdersButton",
            "newProductButton",
            "newFlavorButton"
        ].includes(target.id)
            && !target.classList.contains("product-action-btn")
            && !target.classList.contains("flavor-action-btn")
            && !target.dataset.flavorAction
            && !target.dataset.productAction
        ) {
            return;
        }

        window.setTimeout(setupAvailableInputs, 0);
        window.setTimeout(setupAvailableInputs, 80);
        window.setTimeout(setupAvailableInputs, 300);
    }

    function getPreviewImage(input) {
        if (input.id === "productImage") {
            return document.getElementById("productImagePreviewImage");
        }

        if (input.id === "flavorImage") {
            return document.getElementById("flavorImagePreviewImage");
        }

        if (input.id === "catalogLogo") {
            return document.getElementById("catalogLogoPreviewImage");
        }

        return null;
    }

    function isBlankPreview(src) {
        return !src || src.startsWith("data:image/gif;base64,R0lGODlhAQAB");
    }

    function getFeedbackElement(input) {
        if (input.id === "productImage") {
            return document.getElementById("productFeedback");
        }
        if (input.id === "flavorImage") {
            return document.getElementById("flavorFeedback");
        }
        return document.getElementById("catalogFeedback");
    }

    function setInputFeedback(input, message, type) {
        const feedback = getFeedbackElement(input);

        if (!feedback) return;

        feedback.textContent = message || "";
        feedback.dataset.type = type || "";
    }

    function validateSourceFile(file, config) {
        if (!file) return "Selecione uma imagem.";
        if (!allowedTypes.has(file.type)) return "Use uma imagem JPEG, PNG ou WebP.";
        if (file.size <= 0 || file.size > config.maximumSourceBytes) {
            return config.kind === "logo"
                ? "A logo original precisa ter no máximo 2 MB."
                : "A imagem original precisa ter no máximo 5 MB.";
        }

        return "";
    }

    function interceptImageSelection(event) {
        const input = event.target;
        const config = input && INPUT_CONFIG[input.id];

        if (!config) return;

        if (input.dataset.imageEditorBypass === "true") {
            delete input.dataset.imageEditorBypass;
            window.setTimeout(function () {
                syncLaunchControl(input);
            }, 0);
            return;
        }

        const file = input.files && input.files[0];

        if (!file) {
            sourceFiles.delete(input);
            savedStates.delete(input);
            syncLaunchControl(input);
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        const validationMessage = validateSourceFile(file, config);

        if (validationMessage) {
            input.value = "";
            sourceFiles.delete(input);
            savedStates.delete(input);
            setInputFeedback(input, validationMessage, "error");
            syncLaunchControl(input);
            return;
        }

        sourceFiles.set(input, file);
        savedStates.delete(input);
        setInputFeedback(input, "", "");

        openEditor(input, file, null, "selection");
    }

    function loadImageToBlobViaCanvas(url) {
        return new Promise(function (resolve) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function () {
                try {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.naturalWidth || img.width;
                    canvas.height = img.naturalHeight || img.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob(function (blob) {
                        resolve(blob);
                    }, "image/webp", 0.95);
                } catch (e) {
                    resolve(null);
                }
            };
            img.onerror = function () {
                resolve(null);
            };
            img.src = url;
        });
    }

    async function openFromLaunchButton(input) {
        const config = INPUT_CONFIG[input.id];

        if (!config) return;

        const sourceFile = sourceFiles.get(input);

        if (sourceFile) {
            await openEditor(input, sourceFile, savedStates.get(input) || null, "adjust");
            return;
        }

        const preview = getPreviewImage(input);
        const url = preview && !preview.hidden ? (preview.currentSrc || preview.src) : "";

        if (!url || isBlankPreview(url)) return;

        const button = launchButtons.get(input);

        if (button) {
            button.disabled = true;
            button.textContent = "Carregando…";
        }

        try {
            let blob = null;
            try {
                const response = await fetch(url, { mode: "cors", credentials: "omit" });
                if (response.ok) {
                    blob = await response.blob();
                }
            } catch (fetchErr) {
                // Fallback para conversão via Image/Canvas quando fetch direto for restringido
            }

            if (!blob) {
                blob = await loadImageToBlobViaCanvas(url);
            }

            if (!blob) throw new Error("Não foi possível carregar a imagem atual.");

            const type = allowedTypes.has(blob.type) ? blob.type : "image/webp";
            const extension = getExtensionForType(type);
            const file = new File(
                [blob],
                "imagem-atual." + extension,
                { type: type, lastModified: Date.now() }
            );

            sourceFiles.set(input, file);
            savedStates.delete(input);
            await openEditor(input, file, null, "current");
        } catch (error) {
            console.error("Erro ao carregar imagem atual para edição", error);
            setInputFeedback(
                input,
                "Não foi possível abrir a imagem atual no editor. Selecione o arquivo novamente.",
                "error"
            );
        } finally {
            if (button) {
                button.disabled = false;
                syncLaunchControl(input);
            }
        }
    }

    function handleRemoveImageToggle(event) {
        const field = event.target;

        if (!field || !["removeProductImage", "removeFlavorImage", "removeCatalogLogo"].includes(field.id)) {
            return;
        }

        if (!field.checked) return;

        let inputId = "catalogLogo";
        if (field.id === "removeProductImage") inputId = "productImage";
        if (field.id === "removeFlavorImage") inputId = "flavorImage";

        const input = document.getElementById(inputId);

        if (!input) return;

        sourceFiles.delete(input);
        savedStates.delete(input);

        window.setTimeout(function () {
            syncLaunchControl(input);
        }, 0);
    }

    function handleFormReset(event) {
        const form = event.target;

        if (!form || !["productForm", "flavorForm", "catalogForm"].includes(form.id)) return;

        window.setTimeout(function () {
            Object.keys(INPUT_CONFIG).forEach(function (id) {
                const input = document.getElementById(id);

                if (!input || !form.contains(input)) return;

                sourceFiles.delete(input);
                savedStates.delete(input);
                syncLaunchControl(input);
            });
        }, 0);
    }

    function buildEditor() {
        const overlay = document.createElement("div");
        const dialog = document.createElement("div");
        const header = document.createElement("div");
        const headerCopy = document.createElement("div");
        const eyebrow = document.createElement("span");
        const title = document.createElement("h2");
        const description = document.createElement("p");
        const closeButton = document.createElement("button");
        const content = document.createElement("div");
        const previewColumn = document.createElement("div");
        const stage = document.createElement("div");
        const canvas = document.createElement("canvas");
        const dragHint = document.createElement("span");
        const controls = document.createElement("div");

        // Seletor de proporção (ativo para contexto de logo)
        const ratioGroup = document.createElement("div");
        const ratioTitle = document.createElement("span");
        const ratioOptions = document.createElement("div");
        const ratioSquareBtn = createRatioButton("1:1 Quadrada", "square");
        const ratioPortraitBtn = createRatioButton("3:4 Vertical", "portrait_3_4");
        const ratioLandscapeBtn = createRatioButton("4:3 Horizontal", "landscape_4_3");

        const quickActions = document.createElement("div");
        const autoButton = createEditorButton("Auto ajustar", "auto");
        const fillButton = createEditorButton("Preencher", "fill");
        const fitButton = createEditorButton("Encaixar", "fit");
        const centerButton = createEditorButton("Centralizar", "center");
        const rotateButton = createEditorButton("Girar 90°", "rotate");
        const trimButton = createEditorButton("Remover margens", "trim");
        const zoomLabel = document.createElement("label");
        const zoomHead = document.createElement("span");
        const zoomValue = document.createElement("strong");
        const zoomInput = document.createElement("input");
        const gridLabel = document.createElement("label");
        const gridInput = document.createElement("input");
        const gridCopy = document.createElement("span");
        const info = document.createElement("p");
        const status = document.createElement("p");
        const actions = document.createElement("div");
        const cancelButton = document.createElement("button");
        const applyButton = document.createElement("button");

        overlay.className = "image-editor-overlay";
        overlay.hidden = true;

        dialog.className = "image-editor";
        dialog.setAttribute("role", "dialog");
        dialog.setAttribute("aria-modal", "true");
        dialog.setAttribute("aria-labelledby", "imageEditorTitle");

        header.className = "image-editor__header";
        eyebrow.className = "image-editor__eyebrow";
        eyebrow.textContent = "EDITOR DE IMAGEM";
        title.id = "imageEditorTitle";
        title.textContent = "Ajustar imagem";
        description.className = "image-editor__description";
        description.textContent = "Arraste a imagem e use os controles para ajustar o enquadramento.";

        closeButton.type = "button";
        closeButton.className = "image-editor__close";
        closeButton.setAttribute("aria-label", "Fechar editor");
        closeButton.textContent = "×";

        headerCopy.append(eyebrow, title, description);
        header.append(headerCopy, closeButton);

        content.className = "image-editor__content";
        previewColumn.className = "image-editor__preview-column";
        stage.className = "image-editor__stage";

        canvas.id = "imageEditorCanvas";
        canvas.className = "image-editor__canvas";
        canvas.setAttribute("aria-label", "Prévia da imagem ajustada");
        canvas.setAttribute("tabindex", "0");

        dragHint.className = "image-editor__drag-hint";
        dragHint.textContent = "Arraste para reposicionar";

        stage.append(canvas, dragHint);
        previewColumn.append(stage);

        controls.className = "image-editor__controls";

        // Monta seletor de proporção
        ratioGroup.className = "image-editor__ratio-group";
        ratioGroup.hidden = true;
        ratioTitle.className = "image-editor__control-title";
        ratioTitle.textContent = "Formato da logo";
        ratioOptions.className = "image-editor__ratio-options";
        ratioOptions.append(ratioSquareBtn, ratioPortraitBtn, ratioLandscapeBtn);
        ratioGroup.append(ratioTitle, ratioOptions);

        quickActions.className = "image-editor__quick-actions";
        quickActions.append(autoButton, fillButton, fitButton, centerButton, rotateButton, trimButton);

        zoomLabel.className = "image-editor__zoom";
        zoomHead.className = "image-editor__control-head";
        zoomHead.append(document.createTextNode("Zoom"), zoomValue);

        zoomInput.type = "range";
        zoomInput.min = "1";
        zoomInput.max = "3";
        zoomInput.step = "0.01";
        zoomInput.value = "1";

        zoomLabel.append(zoomHead, zoomInput);

        gridLabel.className = "image-editor__grid-toggle";
        gridInput.type = "checkbox";
        gridInput.checked = true;
        gridCopy.textContent = "Mostrar grade 3 × 3";
        gridLabel.append(gridInput, gridCopy);

        info.className = "image-editor__info";
        info.textContent = "A grade aparece somente na prévia e não será salva na imagem.";

        status.className = "image-editor__status";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");

        actions.className = "image-editor__actions";
        cancelButton.type = "button";
        cancelButton.className = "image-editor__button image-editor__button--secondary";
        cancelButton.textContent = "Cancelar";

        applyButton.type = "button";
        applyButton.className = "image-editor__button image-editor__button--primary";
        applyButton.textContent = "Aplicar imagem";

        actions.append(cancelButton, applyButton);
        controls.append(ratioGroup, quickActions, zoomLabel, gridLabel, info, status, actions);
        content.append(previewColumn, controls);

        dialog.append(header, content);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        editor = {
            overlay: overlay,
            dialog: dialog,
            title: title,
            description: description,
            canvas: canvas,
            ratioGroup: ratioGroup,
            ratioSquareBtn: ratioSquareBtn,
            ratioPortraitBtn: ratioPortraitBtn,
            ratioLandscapeBtn: ratioLandscapeBtn,
            autoButton: autoButton,
            fillButton: fillButton,
            fitButton: fitButton,
            centerButton: centerButton,
            rotateButton: rotateButton,
            trimButton: trimButton,
            zoomInput: zoomInput,
            zoomValue: zoomValue,
            gridInput: gridInput,
            status: status,
            cancelButton: cancelButton,
            applyButton: applyButton,
            closeButton: closeButton
        };

        closeButton.addEventListener("click", cancelEditor);
        cancelButton.addEventListener("click", cancelEditor);
        applyButton.addEventListener("click", applyEditor);

        let pointerStartedOnOverlay = false;
        overlay.addEventListener("pointerdown", function (event) {
            pointerStartedOnOverlay = event.button === 0 && event.target === overlay;
        });
        overlay.addEventListener("pointerup", function (event) {
            const shouldCancel = pointerStartedOnOverlay && event.button === 0 && event.target === overlay;
            pointerStartedOnOverlay = false;
            if (shouldCancel) cancelEditor();
        });
        overlay.addEventListener("pointercancel", function () {
            pointerStartedOnOverlay = false;
        });

        autoButton.addEventListener("click", autoAdjust);
        fillButton.addEventListener("click", function () { setMode("fill"); });
        fitButton.addEventListener("click", function () { setMode("fit"); });
        centerButton.addEventListener("click", centerImage);
        rotateButton.addEventListener("click", rotateImage);
        trimButton.addEventListener("click", trimMargins);

        zoomInput.addEventListener("input", function () {
            if (!activeSession) return;
            activeSession.state.zoom = Number(zoomInput.value);
            updateZoomText();
            renderPreview();
        });

        gridInput.addEventListener("change", renderPreview);

        canvas.addEventListener("pointerdown", startDrag);
        canvas.addEventListener("pointermove", moveDrag);
        canvas.addEventListener("pointerup", endDrag);
        canvas.addEventListener("pointercancel", endDrag);
    }

    function createRatioButton(label, ratioKey) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "image-editor__ratio-button";
        button.dataset.ratio = ratioKey;
        button.textContent = label;
        button.addEventListener("click", function () {
            setLogoAspectRatio(ratioKey);
        });
        return button;
    }

    function createEditorButton(label, action) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "image-editor__tool";
        button.dataset.action = action;
        button.textContent = label;

        return button;
    }

    function setLogoAspectRatio(ratioKey) {
        if (!activeSession || activeSession.config.kind !== "logo") return;
        const ratioConfig = activeSession.config.ratios && activeSession.config.ratios[ratioKey];
        if (!ratioConfig) return;

        activeSession.currentRatioKey = ratioKey;
        activeSession.sessionWidth = ratioConfig.width;
        activeSession.sessionHeight = ratioConfig.height;

        editor.canvas.width = ratioConfig.width;
        editor.canvas.height = ratioConfig.height;

        updateRatioButtons();

        // Sincroniza com formulário de catálogo se houver radio button presente
        const radio = document.querySelector('input[name="logoAspectRatio"][value="' + ratioKey + '"]');
        if (radio && !radio.checked) {
            radio.checked = true;
            radio.dispatchEvent(new Event("change", { bubbles: true }));
        }

        renderPreview();
    }

    function updateRatioButtons() {
        if (!editor || !activeSession) return;
        const currentRatio = activeSession.currentRatioKey || "square";
        editor.ratioSquareBtn.setAttribute("aria-pressed", String(currentRatio === "square"));
        editor.ratioPortraitBtn.setAttribute("aria-pressed", String(currentRatio === "portrait_3_4"));
        editor.ratioLandscapeBtn.setAttribute("aria-pressed", String(currentRatio === "landscape_4_3"));
    }

    async function openEditor(input, file, storedState, reason) {
        const config = INPUT_CONFIG[input.id];

        if (!editor || !config) return;

        previousFocusedElement = document.activeElement;
        editor.status.textContent = "Preparando imagem…";
        editor.applyButton.disabled = true;
        editor.overlay.hidden = false;
        document.body.classList.add("image-editor-open");

        try {
            const loaded = await loadWorkingImage(file);

            if (!loaded || !loaded.source) throw new Error("Falha ao carregar a imagem.");

            // Determina a proporção inicial (para logo)
            let initialRatio = "square";
            if (config.kind === "logo") {
                const selectedRadio = document.querySelector('input[name="logoAspectRatio"]:checked');
                if (selectedRadio && ["square", "portrait_3_4", "landscape_4_3"].includes(selectedRadio.value)) {
                    initialRatio = selectedRadio.value;
                }
                if (storedState && storedState.ratioKey) {
                    initialRatio = storedState.ratioKey;
                }
            }

            const targetRatioConfig = (config.ratios && config.ratios[initialRatio]) || {
                width: config.width,
                height: config.height
            };

            const state = normalizeState(storedState, loaded.width, loaded.height, config);

            activeSession = {
                input: input,
                config: config,
                file: file,
                reason: reason,
                source: loaded.source,
                sourceWidth: loaded.width,
                sourceHeight: loaded.height,
                currentRatioKey: initialRatio,
                sessionWidth: targetRatioConfig.width,
                sessionHeight: targetRatioConfig.height,
                state: state
            };

            editor.title.textContent = config.title;
            if (config.kind === "product") {
                editor.description.textContent = "O resultado será salvo em 1:1. Arraste para escolher o enquadramento do produto.";
                editor.ratioGroup.hidden = true;
            } else if (config.kind === "flavor") {
                editor.description.textContent = "O resultado será salvo em 1:1. Arraste para escolher o enquadramento do sabor.";
                editor.ratioGroup.hidden = true;
            } else {
                editor.description.textContent = "A logo será encaixada sem deformar. Escolha a proporção e ajuste o enquadramento.";
                editor.ratioGroup.hidden = false;
                updateRatioButtons();
            }

            editor.trimButton.hidden = config.kind !== "logo";
            editor.canvas.width = activeSession.sessionWidth;
            editor.canvas.height = activeSession.sessionHeight;
            editor.zoomInput.value = String(state.zoom);
            editor.gridInput.checked = true;
            editor.status.textContent = "";
            editor.applyButton.disabled = false;

            updateZoomText();
            updateModeButtons();
            if (config.kind === "logo" && !storedState) {
                autoAdjust();
            } else {
                renderPreview();
            }

            window.setTimeout(function () {
                editor.canvas.focus({ preventScroll: true });
            }, 0);
        } catch (error) {
            console.error("Erro ao preparar editor de imagem", error);
            editor.status.textContent = "Não foi possível abrir esta imagem.";
            editor.applyButton.disabled = true;
            setInputFeedback(
                input,
                "Não foi possível abrir a imagem para edição. Tente outro arquivo.",
                "error"
            );
        }
    }

    async function loadWorkingImage(file) {
        if ("createImageBitmap" in window) {
            try {
                const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
                return downscaleSourceIfNeeded(bitmap, bitmap.width, bitmap.height, true);
            } catch (error) {
                // Fallback para Image element
            }
        }

        const url = URL.createObjectURL(file);

        try {
            const image = new Image();
            image.decoding = "async";
            image.src = url;

            await new Promise(function (resolve, reject) {
                image.onload = resolve;
                image.onerror = reject;
            });

            return downscaleSourceIfNeeded(image, image.naturalWidth, image.naturalHeight, false);
        } finally {
            URL.revokeObjectURL(url);
        }
    }

    function downscaleSourceIfNeeded(source, width, height, closeSource) {
        const maximumWorkingDimension = 2400;
        const longestSide = Math.max(width, height);

        if (!width || !height) {
            if (closeSource && typeof source.close === "function") source.close();
            throw new Error("Imagem sem dimensões válidas.");
        }

        if (width * height > 40_000_000) {
            if (closeSource && typeof source.close === "function") source.close();
            throw new Error("Imagem grande demais para edição segura.");
        }

        if (longestSide <= maximumWorkingDimension) {
            return { source: source, width: width, height: height };
        }

        const scale = maximumWorkingDimension / longestSide;
        const targetWidth = Math.max(1, Math.round(width * scale));
        const targetHeight = Math.max(1, Math.round(height * scale));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { alpha: true });

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(source, 0, 0, targetWidth, targetHeight);

        if (closeSource && typeof source.close === "function") source.close();

        return { source: canvas, width: targetWidth, height: targetHeight };
    }

    function normalizeState(storedState, width, height, config) {
        if (storedState) {
            return {
                mode: storedState.mode,
                zoom: storedState.zoom,
                offsetX: storedState.offsetX,
                offsetY: storedState.offsetY,
                rotation: storedState.rotation,
                crop: {
                    x: storedState.crop.x,
                    y: storedState.crop.y,
                    width: storedState.crop.width,
                    height: storedState.crop.height
                }
            };
        }

        return {
            mode: config.defaultMode,
            zoom: 1,
            offsetX: 0,
            offsetY: 0,
            rotation: 0,
            crop: { x: 0, y: 0, width: width, height: height }
        };
    }

    function getRotatedSourceSize(state) {
        const quarterTurn = Math.abs(state.rotation % 180) === 90;

        return {
            width: quarterTurn ? state.crop.height : state.crop.width,
            height: quarterTurn ? state.crop.width : state.crop.height
        };
    }

    function getBaseScale(session) {
        const size = getRotatedSourceSize(session.state);
        const curWidth = session.sessionWidth || session.config.width;
        const curHeight = session.sessionHeight || session.config.height;
        const widthScale = curWidth / size.width;
        const heightScale = curHeight / size.height;

        return session.state.mode === "fill"
            ? Math.max(widthScale, heightScale)
            : Math.min(widthScale, heightScale);
    }

    function drawComposedImage(context, includeGrid) {
        if (!activeSession) return;

        const session = activeSession;
        const state = session.state;
        const crop = state.crop;
        const scale = getBaseScale(session) * state.zoom;
        const curWidth = session.sessionWidth || session.config.width;
        const curHeight = session.sessionHeight || session.config.height;
        const centerX = curWidth / 2 + state.offsetX;
        const centerY = curHeight / 2 + state.offsetY;

        context.clearRect(0, 0, curWidth, curHeight);
        context.save();
        context.translate(centerX, centerY);
        context.rotate(state.rotation * Math.PI / 180);
        context.scale(scale, scale);
        context.drawImage(
            session.source,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            -crop.width / 2,
            -crop.height / 2,
            crop.width,
            crop.height
        );
        context.restore();

        if (includeGrid) drawGrid(context, curWidth, curHeight);
    }

    function drawGrid(context, width, height) {
        context.save();
        context.strokeStyle = "rgba(255, 255, 255, 0.72)";
        context.lineWidth = Math.max(1, Math.round(width / 800));
        context.shadowColor = "rgba(0, 0, 0, 0.42)";
        context.shadowBlur = 2;

        [1 / 3, 2 / 3].forEach(function (ratio) {
            context.beginPath();
            context.moveTo(width * ratio, 0);
            context.lineTo(width * ratio, height);
            context.stroke();

            context.beginPath();
            context.moveTo(0, height * ratio);
            context.lineTo(width, height * ratio);
            context.stroke();
        });

        context.restore();
    }

    function renderPreview() {
        if (!activeSession) return;

        const context = editor.canvas.getContext("2d", { alpha: true });

        drawComposedImage(context, editor.gridInput.checked);
        updateModeButtons();
    }

    function updateModeButtons() {
        if (!activeSession) return;

        editor.fillButton.setAttribute(
            "aria-pressed",
            activeSession.state.mode === "fill" ? "true" : "false"
        );
        editor.fitButton.setAttribute(
            "aria-pressed",
            activeSession.state.mode === "fit" ? "true" : "false"
        );
    }

    function updateZoomText() {
        if (!activeSession) return;

        editor.zoomValue.textContent = Math.round(activeSession.state.zoom * 100) + "%";
    }

    function setMode(mode) {
        if (!activeSession || !["fit", "fill"].includes(mode)) return;

        activeSession.state.mode = mode;
        activeSession.state.zoom = 1;
        activeSession.state.offsetX = 0;
        activeSession.state.offsetY = 0;
        editor.zoomInput.value = "1";

        updateZoomText();
        renderPreview();
    }

    function centerImage() {
        if (!activeSession) return;

        activeSession.state.offsetX = 0;
        activeSession.state.offsetY = 0;
        renderPreview();
    }

    function rotateImage() {
        if (!activeSession) return;

        activeSession.state.rotation = (activeSession.state.rotation + 90) % 360;
        activeSession.state.offsetX = 0;
        activeSession.state.offsetY = 0;
        renderPreview();
    }

    async function autoAdjust() {
        if (!activeSession) return;

        const session = activeSession;

        session.state.rotation = 0;
        session.state.zoom = 1;
        session.state.offsetX = 0;
        session.state.offsetY = 0;
        session.state.crop = {
            x: 0,
            y: 0,
            width: session.sourceWidth,
            height: session.sourceHeight
        };

        if (session.config.kind === "logo") {
            session.state.mode = "fit";
            const trimmed = findContentBounds(session);

            if (trimmed) {
                session.state.crop = trimmed;
                editor.status.textContent = "Autoajuste removeu margens vazias detectadas.";
            } else {
                editor.status.textContent = "Logo centralizada e encaixada automaticamente.";
            }
        } else {
            session.state.mode = "fill";
            editor.status.textContent = "Imagem centralizada e preenchendo o quadro 1:1.";
        }

        editor.zoomInput.value = "1";
        updateZoomText();
        renderPreview();
    }

    function trimMargins() {
        if (!activeSession || activeSession.config.kind !== "logo") return;

        const bounds = findContentBounds(activeSession);

        if (!bounds) {
            editor.status.textContent = "Nenhuma margem vazia relevante foi detectada.";
            return;
        }

        activeSession.state.crop = bounds;
        activeSession.state.mode = "fit";
        activeSession.state.zoom = 1;
        activeSession.state.offsetX = 0;
        activeSession.state.offsetY = 0;
        editor.zoomInput.value = "1";

        editor.status.textContent = "Margens detectadas foram removidas da área de enquadramento.";
        updateZoomText();
        renderPreview();
    }

    function findContentBounds(session) {
        const maximumAnalysisSize = 520;
        const sourceRatio = Math.min(
            1,
            maximumAnalysisSize / Math.max(session.sourceWidth, session.sourceHeight)
        );
        const width = Math.max(1, Math.round(session.sourceWidth * sourceRatio));
        const height = Math.max(1, Math.round(session.sourceHeight * sourceRatio));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { willReadFrequently: true });

        canvas.width = width;
        canvas.height = height;
        context.drawImage(session.source, 0, 0, width, height);

        const data = context.getImageData(0, 0, width, height).data;
        const cornerSamples = [
            getPixel(data, width, 0, 0),
            getPixel(data, width, width - 1, 0),
            getPixel(data, width, 0, height - 1),
            getPixel(data, width, width - 1, height - 1)
        ];

        const transparentBackground = cornerSamples.filter(function (pixel) {
            return pixel.a < 32;
        }).length >= 3;

        const whiteBackground = !transparentBackground && cornerSamples.filter(function (pixel) {
            return pixel.a > 220 && pixel.r > 242 && pixel.g > 242 && pixel.b > 242;
        }).length >= 3;

        let minX = width;
        let minY = height;
        let maxX = -1;
        let maxY = -1;

        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                const pixel = getPixel(data, width, x, y);
                let content = pixel.a > 24;

                if (whiteBackground) {
                    content = content && !(pixel.r > 238 && pixel.g > 238 && pixel.b > 238);
                } else if (transparentBackground) {
                    content = pixel.a > 24;
                }

                if (!content) continue;

                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }

        if (maxX < minX || maxY < minY) return null;

        const padding = Math.max(2, Math.round(Math.max(width, height) * 0.025));
        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX = Math.min(width - 1, maxX + padding);
        maxY = Math.min(height - 1, maxY + padding);

        const analyzedWidth = maxX - minX + 1;
        const analyzedHeight = maxY - minY + 1;
        const areaRatio = (analyzedWidth * analyzedHeight) / (width * height);

        if (areaRatio > 0.94) return null;

        return {
            x: Math.round(minX / sourceRatio),
            y: Math.round(minY / sourceRatio),
            width: Math.min(
                session.sourceWidth,
                Math.max(1, Math.round(analyzedWidth / sourceRatio))
            ),
            height: Math.min(
                session.sourceHeight,
                Math.max(1, Math.round(analyzedHeight / sourceRatio))
            )
        };
    }

    function getPixel(data, width, x, y) {
        const index = (y * width + x) * 4;

        return {
            r: data[index],
            g: data[index + 1],
            b: data[index + 2],
            a: data[index + 3]
        };
    }

    function startDrag(event) {
        if (!activeSession || event.button !== 0) return;

        dragging = true;
        dragPointerId = event.pointerId;
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;

        editor.canvas.setPointerCapture(event.pointerId);
        editor.canvas.classList.add("is-dragging");
        event.preventDefault();
    }

    function moveDrag(event) {
        if (!dragging || !activeSession || event.pointerId !== dragPointerId) return;

        const rect = editor.canvas.getBoundingClientRect();
        const curWidth = activeSession.sessionWidth || activeSession.config.width;
        const curHeight = activeSession.sessionHeight || activeSession.config.height;
        const scaleX = curWidth / rect.width;
        const scaleY = curHeight / rect.height;

        activeSession.state.offsetX += (event.clientX - lastPointerX) * scaleX;
        activeSession.state.offsetY += (event.clientY - lastPointerY) * scaleY;

        lastPointerX = event.clientX;
        lastPointerY = event.clientY;

        renderPreview();
        event.preventDefault();
    }

    function endDrag(event) {
        if (!dragging || event.pointerId !== dragPointerId) return;

        dragging = false;
        dragPointerId = null;
        editor.canvas.classList.remove("is-dragging");

        if (editor.canvas.hasPointerCapture(event.pointerId)) {
            editor.canvas.releasePointerCapture(event.pointerId);
        }
    }

    async function applyEditor() {
        if (!activeSession || editor.applyButton.disabled) return;

        const session = activeSession;
        const input = session.input;
        const curWidth = session.sessionWidth || session.config.width;
        const curHeight = session.sessionHeight || session.config.height;

        editor.applyButton.disabled = true;
        editor.applyButton.textContent = "Processando…";
        editor.status.textContent = "Gerando imagem otimizada…";

        try {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d", { alpha: true });

            canvas.width = curWidth;
            canvas.height = curHeight;

            const originalCanvas = editor.canvas;
            editor.canvas = canvas;
            drawComposedImage(context, false);
            editor.canvas = originalCanvas;

            const blob = await createOptimizedBlob(canvas, session.config.maximumBytes);

            if (!blob) throw new Error("Falha ao gerar arquivo final.");
            if (blob.size > session.config.maximumBytes) {
                throw new Error("A imagem final excedeu o limite de upload.");
            }

            const extension = getExtensionForType(blob.type);
            const file = new File(
                [blob],
                "neoeffex-" + session.config.prefix + "-" + Date.now() + "." + extension,
                { type: blob.type, lastModified: Date.now() }
            );

            if (typeof DataTransfer !== "function") {
                throw new Error("Este navegador não permite substituir o arquivo editado.");
            }

            const transfer = new DataTransfer();
            transfer.items.add(file);
            input.files = transfer.files;

            savedStates.set(input, cloneState(session.state, session.currentRatioKey));
            sourceFiles.set(input, session.file);

            // Se for logo, sincroniza proporção com o radio do formulário
            if (session.config.kind === "logo" && session.currentRatioKey) {
                const radio = document.querySelector('input[name="logoAspectRatio"][value="' + session.currentRatioKey + '"]');
                if (radio && !radio.checked) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event("change", { bubbles: true }));
                }
            }

            input.dataset.imageEditorBypass = "true";
            input.dispatchEvent(new Event("change", { bubbles: true }));

            setInputFeedback(
                input,
                "Imagem ajustada: " + curWidth + " × " + curHeight
                    + " • " + formatBytes(file.size) + ".",
                "success"
            );

            closeEditor(false);
            syncLaunchControl(input);
        } catch (error) {
            console.error("Erro ao aplicar edição de imagem", error);
            editor.status.textContent = error.message || "Não foi possível gerar a imagem final.";
            editor.applyButton.disabled = false;
        } finally {
            editor.applyButton.textContent = "Aplicar imagem";
        }
    }

    function createOptimizedBlob(canvas, maximumBytes) {
        const qualities = [0.9, 0.84, 0.78, 0.7];

        return new Promise(function (resolve) {
            function attempt(index) {
                if (index >= qualities.length) {
                    canvas.toBlob(function (fallbackBlob) {
                        resolve(fallbackBlob);
                    }, "image/webp", 0.66);
                    return;
                }

                canvas.toBlob(function (blob) {
                    if (!blob) {
                        resolve(null);
                        return;
                    }

                    if (blob.size <= maximumBytes || index === qualities.length - 1) {
                        resolve(blob);
                        return;
                    }

                    attempt(index + 1);
                }, "image/webp", qualities[index]);
            }

            attempt(0);
        });
    }

    function cloneState(state, ratioKey) {
        return {
            mode: state.mode,
            zoom: state.zoom,
            offsetX: state.offsetX,
            offsetY: state.offsetY,
            rotation: state.rotation,
            ratioKey: ratioKey || "square",
            crop: {
                x: state.crop.x,
                y: state.crop.y,
                width: state.crop.width,
                height: state.crop.height
            }
        };
    }

    function cancelEditor() {
        if (!activeSession) {
            closeEditor(false);
            return;
        }

        const session = activeSession;

        if (session.reason === "selection") {
            session.input.value = "";
            sourceFiles.delete(session.input);
            savedStates.delete(session.input);
            syncLaunchControl(session.input);
        }

        closeEditor(false);
    }

    function closeEditor(clearFeedback) {
        if (!editor) return;

        if (activeSession && clearFeedback) {
            setInputFeedback(activeSession.input, "", "");
        }

        activeSession = null;
        dragging = false;
        dragPointerId = null;
        editor.overlay.hidden = true;
        editor.status.textContent = "";
        editor.applyButton.disabled = false;
        editor.applyButton.textContent = "Aplicar imagem";
        document.body.classList.remove("image-editor-open");

        if (previousFocusedElement && typeof previousFocusedElement.focus === "function") {
            previousFocusedElement.focus({ preventScroll: true });
        }
        previousFocusedElement = null;
    }

    function handleGlobalKeydown(event) {
        if (!editor || editor.overlay.hidden) return;

        if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            cancelEditor();
            return;
        }

        if (event.key === "Tab") {
            const focusables = editor.dialog.querySelectorAll(
                'button:not([disabled]):not([hidden]), [href], input:not([disabled]):not([hidden]), select:not([disabled]):not([hidden]), textarea:not([disabled]):not([hidden]), [tabindex]:not([tabindex="-1"])'
            );
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (event.shiftKey) {
                if (document.activeElement === first || !editor.dialog.contains(document.activeElement)) {
                    last.focus();
                    event.preventDefault();
                }
            } else {
                if (document.activeElement === last || !editor.dialog.contains(document.activeElement)) {
                    first.focus();
                    event.preventDefault();
                }
            }
        }
    }

    function getExtensionForType(type) {
        return {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/webp": "webp"
        }[type] || "webp";
    }

    function formatBytes(bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";

        return (bytes / (1024 * 1024)).toFixed(1).replace(".", ",") + " MB";
    }

    // Expõe API para testes e integração com outros módulos
    window.NEOEFFEX_IMAGE_EDITOR = Object.freeze({
        INPUT_CONFIG: INPUT_CONFIG,
        open: function (inputId, file, state, reason) {
            const input = typeof inputId === "string" ? document.getElementById(inputId) : inputId;
            if (!input) return Promise.reject(new Error("Input não encontrado"));
            return openEditor(input, file, state, reason || "api");
        },
        openFromLaunchButton: openFromLaunchButton,
        setupInputs: setupAvailableInputs,
        close: cancelEditor,
        setLogoAspectRatio: setLogoAspectRatio
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
}());
