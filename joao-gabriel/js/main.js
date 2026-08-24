/*
 * JOÃO/OS — versão 0.1.0
 *
 * Ponto de entrada do sistema.
 */

import { startClock } from "./clock.js";
<<<<<<< HEAD
import { initializeSystemMenu } from "./system-menu.js";
import { initializeWindowManager } from "./window-manager.js";

startClock();

const windowManager = initializeWindowManager();

initializeSystemMenu({
    toggleWindow: windowManager.toggleWindow,
    getWindowState: windowManager.getWindowState,
});
=======
import { initializeWindowManager } from "./window-manager.js";

startClock();
initializeWindowManager();
>>>>>>> 14427b88b6dd0f55a7f7761fa1a87e1941ed7ee7

console.info("JOÃO/OS 0.1.0 iniciado.");
