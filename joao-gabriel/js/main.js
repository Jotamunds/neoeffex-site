/*
 * JOÃO/OS — versão 0.1.0
 *
 * Ponto de entrada do sistema.
 */

import { initializeBootSequence } from "./boot-sequence.js";
import { startClock } from "./clock.js";
import { initializeContactApp } from "./contact.js";
import { initializeUnavailableApps } from "./desktop-apps.js";
import { initializeFilesApp } from "./files.js";
import { initializeLaboratoryApp } from "./laboratory.js";
import { initializeNeoApp } from "./neo.js";
import { createNotificationCenter } from "./notification-center.js";
import { initializeProjectsApp } from "./projects.js";
import { initializeSystemMenu } from "./system-menu.js";
import { initializeTerminal } from "./terminal.js";
import { initializeWindowManager } from "./window-manager.js";

initializeBootSequence();
startClock();

const notificationCenter = createNotificationCenter();
const windowManager = initializeWindowManager();

initializeContactApp({
    notify: notificationCenter.show,
});

initializeFilesApp();
initializeLaboratoryApp();
initializeNeoApp();
initializeProjectsApp();

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
