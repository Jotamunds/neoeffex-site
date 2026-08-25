/*
 * JOÃO/OS — versão 0.1.0
 *
 * Ponto de entrada do sistema.
 */

import { initializeBootSequence } from "./boot-sequence.js";
import { startClock } from "./clock.js";
import { initializeContactApp } from "./contact.js";
import { initializeDesktopContextMenu } from "./desktop-context-menu.js";
import { initializeUnavailableApps } from "./desktop-apps.js";
import { initializeFilesApp } from "./files.js";
import { initializeLaboratoryApp } from "./laboratory.js";
import { initializeNeoApp } from "./neo.js";
import { createNotificationCenter } from "./notification-center.js";
import { initializeProjectsApp } from "./projects.js";
import { initializeSystemMenu } from "./system-menu.js";
import { initializeSystemPower } from "./system-power.js";
import { initializeSystemSearch } from "./system-search.js";
import { initializeTerminal } from "./terminal.js";
import { initializeWindowManager } from "./window-manager.js";

initializeBootSequence();
startClock();

const notificationCenter = createNotificationCenter();
const windowManager = initializeWindowManager();

initializeDesktopContextMenu({
    showWindow: windowManager.showWindow,
    notify: notificationCenter.show,
});

initializeContactApp({
    notify: notificationCenter.show,
});

initializeFilesApp();
initializeLaboratoryApp();
initializeNeoApp();
initializeProjectsApp();

const systemPower = initializeSystemPower();
const systemSearch = initializeSystemSearch({
    showWindow: windowManager.showWindow,
    restartSystem: systemPower.restart,
    shutdownSystem: systemPower.shutdown,
});

initializeTerminal({
    showWindow: windowManager.showWindow,
    getWindowState: windowManager.getWindowState,
    openSearch: systemSearch.open,
    restartSystem: systemPower.restart,
    shutdownSystem: systemPower.shutdown,
});

initializeUnavailableApps({
    notify: notificationCenter.show,
});

initializeSystemMenu({
    toggleWindow: windowManager.toggleWindow,
    getWindowState: windowManager.getWindowState,
});

console.info("JOÃO/OS 0.1.0 iniciado.");
