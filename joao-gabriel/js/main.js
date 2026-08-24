/*
 * JOÃO/OS — versão 0.1.0
 *
 * Ponto de entrada do sistema.
 */

import { startClock } from "./clock.js";
import { initializeWindowManager } from "./window-manager.js";

startClock();
initializeWindowManager();

console.info("JOÃO/OS 0.1.0 iniciado.");
