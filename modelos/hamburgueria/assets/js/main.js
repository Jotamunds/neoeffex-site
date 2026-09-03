import { connectCatalogLinks } from "./catalog.js";
import { initSite } from "./site.js";
import { initBurger3D } from "./burger3d.js";

connectCatalogLinks();
initSite();
initBurger3D();

window.NEOEFFEX_HAMBURGUERIA_RUNTIME_READY = true;
