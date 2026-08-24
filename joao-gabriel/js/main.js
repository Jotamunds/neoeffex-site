/*
 * JOÃO/OS — versão 0.1.0
 *
 * Ponto de entrada do sistema.
 */

import { startClock } from "./clock.js";
<<<<<<< HEAD
import { initializeUnavailableApps } from "./desktop-apps.js";
import { createNotificationCenter } from "./notification-center.js";
=======
>>>>>>> df58b2a2ed9df01130aa261f57f393f0c760386a
import { initializeSystemMenu } from "./system-menu.js";
import { initializeWindowManager } from "./window-manager.js";

startClock();

<<<<<<< HEAD
const notificationCenter = createNotificationCenter();
const windowManager = initializeWindowManager();

initializeUnavailableApps({
    notify: notificationCenter.show,
});

initializeSystemMenu({
    toggleWindow: windowManager.toggleWindow,
    getWindowState: windowManager.getWindowState,
});

=======
const windowManager = initializeWindowManager();

initializeSystemMenu({
    toggleWindow: windowManager.toggleWindow,
    getWindowState: windowManager.getWindowState,
});

>>>>>>> df58b2a2ed9df01130aa261f57f393f0c760386a
console.info("JOÃO/OS 0.1.0 iniciado.");
