/*
 * JOÃO/OS — Centro de notificações
 *
 * Exibe avisos temporários, evita duplicações e preserva o foco
 * quando uma notificação é dispensada pelo teclado.
 */

const DEFAULT_DURATION = 5000;
const MAX_VISIBLE_NOTIFICATIONS = 3;

export function createNotificationCenter() {
    const container = document.querySelector(
        "[data-notification-center]"
    );

    const notifications = new Map();
    let generatedId = 0;

    function clearDismissTimer(notification) {
        window.clearTimeout(notification.timeoutId);
        notification.timeoutId = null;
    }

    function dismiss(id, { restoreFocus = false } = {}) {
        const notification = notifications.get(id);

        if (!notification) {
            return;
        }

        clearDismissTimer(notification);
        notification.element.remove();
        notifications.delete(id);

        if (
            restoreFocus &&
            notification.sourceElement?.isConnected
        ) {
            notification.sourceElement.focus();
        }
    }

    function scheduleDismiss(notification) {
        if (!notifications.has(notification.id)) {
            return;
        }

        clearDismissTimer(notification);

        notification.timeoutId = window.setTimeout(
            function () {
                dismiss(notification.id);
            },
            notification.duration
        );
    }

    function createNotificationElement(notification) {
        const element = document.createElement("article");
        element.className = "system-notification";
        element.setAttribute("role", "status");
        element.setAttribute("aria-atomic", "true");

        const symbol = document.createElement("span");
        symbol.className = "system-notification__symbol";
        symbol.setAttribute("aria-hidden", "true");
        symbol.textContent = notification.symbol;

        const content = document.createElement("div");
        content.className = "system-notification__content";

        const title = document.createElement("h2");
        title.className = "system-notification__title";
        title.textContent = notification.title;

        const message = document.createElement("p");
        message.className = "system-notification__message";
        message.textContent = notification.message;

        const closeButton = document.createElement("button");
        closeButton.className = "system-notification__close";
        closeButton.type = "button";
        closeButton.setAttribute(
            "aria-label",
            `Dispensar notificação: ${notification.title}`
        );
        closeButton.textContent = "×";

        content.append(title, message);
        element.append(symbol, content, closeButton);

        closeButton.addEventListener("click", function () {
            dismiss(notification.id, {
                restoreFocus: true,
            });
        });

        element.addEventListener("keydown", function (event) {
            if (event.key !== "Escape") {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            dismiss(notification.id, {
                restoreFocus: true,
            });
        });

        element.addEventListener("pointerenter", function () {
            clearDismissTimer(notification);
        });

        element.addEventListener("pointerleave", function () {
            scheduleDismiss(notification);
        });

        element.addEventListener("focusin", function () {
            clearDismissTimer(notification);
        });

        element.addEventListener("focusout", function (event) {
            if (!element.contains(event.relatedTarget)) {
                scheduleDismiss(notification);
            }
        });

        return element;
    }

    function refreshExistingNotification(notification, options) {
        clearDismissTimer(notification);

        notification.sourceElement = options.sourceElement;
        notification.duration = options.duration;

        notification.element.classList.remove("is-refreshed");

        requestAnimationFrame(function () {
            notification.element.classList.add("is-refreshed");
        });

        scheduleDismiss(notification);
    }

    function show({
        id = null,
        symbol = "i",
        title,
        message,
        duration = DEFAULT_DURATION,
        sourceElement = null,
    }) {
        const notificationId = id || `notification-${++generatedId}`;
        const safeDuration = Math.max(Number(duration) || 0, 2000);
        const existingNotification = notifications.get(notificationId);

        if (existingNotification) {
            refreshExistingNotification(existingNotification, {
                duration: safeDuration,
                sourceElement,
            });

            return notificationId;
        }

        while (
            notifications.size >= MAX_VISIBLE_NOTIFICATIONS
        ) {
            const oldestId = notifications.keys().next().value;
            dismiss(oldestId);
        }

        const notification = {
            id: notificationId,
            symbol,
            title,
            message,
            duration: safeDuration,
            sourceElement,
            timeoutId: null,
            element: null,
        };

        notification.element = createNotificationElement(
            notification
        );

        notifications.set(notificationId, notification);
        container.append(notification.element);
        scheduleDismiss(notification);

        return notificationId;
    }

    return Object.freeze({
        show,
        dismiss,
    });
}
