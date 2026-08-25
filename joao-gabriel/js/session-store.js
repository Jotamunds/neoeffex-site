/*
 * JOÃO/OS — Persistência da sessão
 *
 * Salva somente dados visuais das janelas. O formato possui
 * versão para que estruturas antigas possam ser ignoradas com segurança.
 */

const STORAGE_KEY = "joaoos.window-session";
const STORAGE_VERSION = 1;
const VALID_WINDOW_STATES = new Set([
    "closed",
    "open",
    "minimized",
]);

function getLocalStorage() {
    try {
        return window.localStorage;
    } catch {
        return null;
    }
}

function normalizePosition(position) {
    if (!position || typeof position !== "object") {
        return null;
    }

    const left = Number(position.left);
    const top = Number(position.top);

    if (
        !Number.isFinite(left) ||
        !Number.isFinite(top) ||
        left < 0 ||
        top < 0
    ) {
        return null;
    }

    return {
        left,
        top,
    };
}

function normalizeZIndex(value) {
    const zIndex = Number(value);

    if (!Number.isFinite(zIndex) || zIndex < 10) {
        return 10;
    }

    return Math.min(Math.round(zIndex), 100000);
}

export function createWindowSessionStore(appIds) {
    const validAppIds = new Set(appIds);
    const storage = getLocalStorage();

    function read() {
        if (!storage) {
            return null;
        }

        try {
            const rawSession = storage.getItem(STORAGE_KEY);

            if (!rawSession) {
                return null;
            }

            const savedSession = JSON.parse(rawSession);

            if (
                savedSession.version !== STORAGE_VERSION ||
                !savedSession.apps ||
                typeof savedSession.apps !== "object"
            ) {
                return null;
            }

            const apps = {};

            validAppIds.forEach(function (appId) {
                const savedApp = savedSession.apps[appId];

                if (!savedApp || typeof savedApp !== "object") {
                    return;
                }

                apps[appId] = {
                    state: VALID_WINDOW_STATES.has(savedApp.state)
                        ? savedApp.state
                        : "closed",
                    isMaximized: savedApp.isMaximized === true,
                    position: normalizePosition(savedApp.position),
                    zIndex: normalizeZIndex(savedApp.zIndex),
                };
            });

            const activeAppId = validAppIds.has(
                savedSession.activeAppId
            )
                ? savedSession.activeAppId
                : null;

            return {
                apps,
                activeAppId,
            };
        } catch {
            return null;
        }
    }

    function write(session) {
        if (!storage) {
            return false;
        }

        try {
            storage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    version: STORAGE_VERSION,
                    activeAppId: session.activeAppId,
                    apps: session.apps,
                })
            );

            return true;
        } catch {
            return false;
        }
    }

    return Object.freeze({
        read,
        write,
    });
}
