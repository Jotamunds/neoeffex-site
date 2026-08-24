/*
 * JOÃO/OS — versão 0.1.0
 *
 * Ponto de entrada do sistema.
 */

import { startClock } from "./clock.js";
import { initializeUnavailableApps } from "./desktop-apps.js";
import { initializeFilesApp } from "./files.js";
import { createNotificationCenter } from "./notification-center.js";
import { initializeSystemMenu } from "./system-menu.js";
import { initializeTerminal } from "./terminal.js";
import { initializeWindowManager } from "./window-manager.js";

startClock();

const notificationCenter = createNotificationCenter();
const windowManager = initializeWindowManager();

initializeFilesApp();

initializeTerminal({
    showWindow: windowManager.showWindow,
    getWindowState: windowManager.getWindowState,
});

initializeUnavailableApps({
    notify: notificationCenter.show,
});

initializeSystemMenu({
    toggleWindow: windowManager.toggleWindow,
    getWindowState: windowManager.getWindowState,
});

console.info("JOÃO/OS 0.1.0 iniciado.");
