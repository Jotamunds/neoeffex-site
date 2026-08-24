/*
 * JOÃO/OS — Movimento das janelas
 *
 * Controla arraste, limites da área útil e correções
 * de posição após o redimensionamento da tela.
 */

function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
}

export function createWindowDragManager({
    windowLayer,
    taskbar,
    activateWindow,
}) {
    function getWindowBounds(app) {
        const safeGap = 12;

        const layerRect = windowLayer.getBoundingClientRect();
        const taskbarRect = taskbar.getBoundingClientRect();
        const windowRect = app.windowElement.getBoundingClientRect();

        const taskbarTopInsideLayer =
            taskbarRect.top - layerRect.top;

        return {
            minimumLeft: safeGap,
            minimumTop: safeGap,

            maximumLeft: Math.max(
                layerRect.width - windowRect.width - safeGap,
                safeGap
            ),

            maximumTop: Math.max(
                taskbarTopInsideLayer - windowRect.height - safeGap,
                safeGap
            ),
        };
    }

    function startDraggingWindow(app, event) {
        const clickedControl = event.target.closest(
            ".system-window__controls"
        );

        if (clickedControl) {
            return;
        }

        if (window.matchMedia("(max-width: 600px)").matches) {
            return;
        }

        if (app.isMaximized || app.state !== "open") {
            return;
        }

        activateWindow(app);

        const windowRect = app.windowElement.getBoundingClientRect();
        const layerRect = windowLayer.getBoundingClientRect();

        app.drag.isDragging = true;
        app.drag.pointerId = event.pointerId;
        app.drag.offsetX = event.clientX - windowRect.left;
        app.drag.offsetY = event.clientY - windowRect.top;

        app.windowElement.style.setProperty(
            "--window-left",
            `${windowRect.left - layerRect.left}px`
        );

        app.windowElement.style.setProperty(
            "--window-top",
            `${windowRect.top - layerRect.top}px`
        );

        app.windowElement.classList.add(
            "is-positioned",
            "is-dragging"
        );

        app.titlebar.setPointerCapture(event.pointerId);
    }

    function dragWindow(app, event) {
        if (
            !app.drag.isDragging ||
            event.pointerId !== app.drag.pointerId
        ) {
            return;
        }

        const layerRect = windowLayer.getBoundingClientRect();
        const bounds = getWindowBounds(app);

        const nextLeft = clamp(
            event.clientX - layerRect.left - app.drag.offsetX,
            bounds.minimumLeft,
            bounds.maximumLeft
        );

        const nextTop = clamp(
            event.clientY - layerRect.top - app.drag.offsetY,
            bounds.minimumTop,
            bounds.maximumTop
        );

        app.windowElement.style.setProperty(
            "--window-left",
            `${nextLeft}px`
        );

        app.windowElement.style.setProperty(
            "--window-top",
            `${nextTop}px`
        );
    }

    function stopDraggingWindow(app, event) {
        if (
            !app.drag.isDragging ||
            event.pointerId !== app.drag.pointerId
        ) {
            return;
        }

        app.drag.isDragging = false;
        app.drag.pointerId = null;

        app.windowElement.classList.remove("is-dragging");

        if (app.titlebar.hasPointerCapture(event.pointerId)) {
            app.titlebar.releasePointerCapture(event.pointerId);
        }
    }

    function keepWindowInsideBounds(app) {
        if (
            app.state === "closed" ||
            app.isMaximized ||
            !app.windowElement.classList.contains("is-positioned")
        ) {
            return;
        }

        const windowRect = app.windowElement.getBoundingClientRect();
        const layerRect = windowLayer.getBoundingClientRect();
        const bounds = getWindowBounds(app);

        const currentLeft = windowRect.left - layerRect.left;
        const currentTop = windowRect.top - layerRect.top;

        const correctedLeft = clamp(
            currentLeft,
            bounds.minimumLeft,
            bounds.maximumLeft
        );

        const correctedTop = clamp(
            currentTop,
            bounds.minimumTop,
            bounds.maximumTop
        );

        app.windowElement.style.setProperty(
            "--window-left",
            `${correctedLeft}px`
        );

        app.windowElement.style.setProperty(
            "--window-top",
            `${correctedTop}px`
        );
    }

    function connect(app) {
        app.titlebar.addEventListener("pointerdown", function (event) {
            startDraggingWindow(app, event);
        });

        app.titlebar.addEventListener("pointermove", function (event) {
            dragWindow(app, event);
        });

        app.titlebar.addEventListener("pointerup", function (event) {
            stopDraggingWindow(app, event);
        });

        app.titlebar.addEventListener("pointercancel", function (event) {
            stopDraggingWindow(app, event);
        });
    }

    return {
        connect,
        keepWindowInsideBounds,
    };
}
