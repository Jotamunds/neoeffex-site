import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

let failures = 0;
function check(label, condition) {
    if (condition) console.log(`OK  ${label}`);
    else {
        failures += 1;
        console.error(`ERRO ${label}`);
    }
}

const required = [
    "index.html",
    "assets/css/site.css",
    "assets/js/main.js",
    "assets/js/config.js",
    "assets/js/catalog.js",
    "assets/js/site.js",
    "assets/js/burger3d.js",
    "models/burger.glb",
    "hdr/burger-studio.hdr",
    "source/index.html",
    "source/src/main.js",
    "source/src/config.js",
    "source/src/catalog.js",
    "source/src/site.js",
    "source/src/burger3d.js",
    "source/src/site.css",
    "source/public/models/burger.glb",
    "source/public/hdr/burger-studio.hdr",
    "tools/sync-live.mjs",
    "tools/publish-build.mjs",
    "package.json",
    "vite.config.js",
    "VERSION",
    "CHANGELOG.md",
    "README.md"
];
required.forEach((file) => check(`existe ${file}`, fs.existsSync(path.join(root, file))));

const version = fs.readFileSync(path.join(root, "VERSION"), "utf8").trim();
const liveHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const liveMain = fs.readFileSync(path.join(root, "assets/js/main.js"), "utf8");
const liveCss = fs.readFileSync(path.join(root, "assets/css/site.css"), "utf8");
const liveCatalog = fs.readFileSync(path.join(root, "assets/js/catalog.js"), "utf8");
const sourceText = [
    "source/index.html",
    "source/src/main.js",
    "source/src/config.js",
    "source/src/catalog.js",
    "source/src/site.js",
    "source/src/burger3d.js",
    "source/src/site.css"
].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const viteConfig = fs.readFileSync(path.join(root, "vite.config.js"), "utf8");

function hash(file) {
    return crypto.createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex");
}

check("versão 0.2.0.1", version === "0.2.0.1");
check("Live Server carrega CSS diretamente", liveHtml.includes('./assets/css/site.css'));
check("Live Server usa módulo runtime", liveHtml.includes('./assets/js/main.js'));
check("Live Server não aponta para source/src", !liveHtml.includes('./src/main.js') && !liveHtml.includes('/source/'));
check("import map contém Three.js", liveHtml.includes('"three"') && liveHtml.includes("three@0.180.0"));
check("import map contém addons do Three.js", liveHtml.includes('"three/addons/"'));
check("import map contém GSAP", liveHtml.includes('"gsap"') && liveHtml.includes("gsap@3.13.0"));
check("import map contém ScrollTrigger", liveHtml.includes('"gsap/ScrollTrigger"'));
check("main do Live Server não tenta importar CSS como JS", !/import\s+["']\.\/site\.css/.test(liveMain));
check("CSS principal não está vazio", liveCss.length > 20_000);
check("catálogo local usa mesma origem no caminho do modelo", liveCatalog.includes('pathname.includes("/modelos/hamburgueria/")'));
check("sem EcommerceApi da Hostinger", !/EcommerceApi/.test(liveHtml + sourceText));
check("sem imagens da Hostinger", !/images\.hostinger\.com/i.test(liveHtml + sourceText));
check("sem React", !packageJson.dependencies?.react && !packageJson.dependencies?.["react-dom"]);
check("Three.js declarado no projeto Vite", Boolean(packageJson.dependencies?.three));
check("GSAP declarado no projeto Vite", Boolean(packageJson.dependencies?.gsap));
check("Vite declarado", Boolean(packageJson.devDependencies?.vite));
check("script live:sync presente", packageJson.scripts?.["live:sync"] === "node tools/sync-live.mjs");
check("script build:publish presente", Boolean(packageJson.scripts?.["build:publish"]));
check("Vite usa source como root", /root:\s*["']source["']/.test(viteConfig));
check("Vite usa base relativa", /base:\s*["']\.\/["']/.test(viteConfig));
check("Vite gera dist fora de source", /outDir:\s*["']\.\.\/dist["']/.test(viteConfig));
check("GLB runtime igual ao GLB fonte", hash("models/burger.glb") === hash("source/public/models/burger.glb"));
check("HDRI runtime igual ao HDRI fonte", hash("hdr/burger-studio.hdr") === hash("source/public/hdr/burger-studio.hdr"));
check("fallback visual preservado", (liveHtml + sourceText).includes("burger-art--fallback"));
check("movimento reduzido preservado", (liveCss + sourceText).includes("prefers-reduced-motion"));
check("slug configurável preservado", sourceText.includes('slug: "modelo-hamburgueria"'));

check("GLTFLoader usa alias Three addons compatível com Live Server", sourceText.includes('three/addons/loaders/GLTFLoader.js'));
check("RGBELoader usa alias Three addons compatível com Live Server", sourceText.includes('three/addons/loaders/RGBELoader.js'));
check("nenhum loader usa bare path three/examples/jsm", !sourceText.includes('three/examples/jsm/loaders/'));
check("conteúdo reveal é visível por padrão", /\.reveal\s*\{\s*opacity:\s*1;\s*transform:\s*none;\s*\}/m.test(liveCss));


if (failures) process.exit(1);
console.log("\nValidação v0.2.0.1 concluída sem erros.");
