/*
 * JOÃO/OS — versão 0.1.0
 *
 * Ponto de entrada do sistema.
 */

import { startClock } from "./clock.js";
import { initializeSystemMenu } from "./system-menu.js";
import { initializeWindowManager } from "./window-manager.js";

startClock();

const windowManager = initializeWindowManager();

initializeSystemMenu({
    toggleWindow: windowManager.toggleWindow,
    getWindowState: windowManager.getWindowState,
});

console.info("JOÃO/OS 0.1.0 iniciado.");
