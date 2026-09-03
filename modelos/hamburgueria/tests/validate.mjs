import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const required = [
    "index.html",
    "VERSION",
    "CHANGELOG.md",
    "README.md",
    "package.json",
    "vite.config.js",
    "src/main.js",
    "src/config.js",
    "src/catalog.js",
    "src/site.js",
    "src/burger3d.js",
    "src/site.css",
    "public/models/burger.glb",
    "public/hdr/burger-studio.hdr"
];

let failures = 0;
function check(label, condition) {
    if (condition) console.log(`OK  ${label}`);
    else {
        failures += 1;
        console.error(`ERRO ${label}`);
    }
}

required.forEach((file) => check(`existe ${file}`, fs.existsSync(path.join(root, file))));

const runtimeFiles = [
    "index.html",
    "src/main.js",
    "src/config.js",
    "src/catalog.js",
    "src/site.js",
    "src/burger3d.js",
    "src/site.css"
];
const runtimeText = runtimeFiles.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const model = fs.statSync(path.join(root, "public/models/burger.glb"));
const hdri = fs.statSync(path.join(root, "public/hdr/burger-studio.hdr"));

check("versão 0.2.0", fs.readFileSync(path.join(root, "VERSION"), "utf8").trim() === "0.2.0");
check("sem EcommerceApi da Hostinger", !runtimeText.includes("EcommerceApi"));
check("sem imagens remotas da Hostinger", !runtimeText.includes("images.hostinger.com"));
check("sem APIs específicas da Hostinger", !/hostinger/i.test(runtimeText));
check("Three.js declarado", Boolean(packageJson.dependencies?.three));
check("GSAP declarado", Boolean(packageJson.dependencies?.gsap));
check("Vite declarado", Boolean(packageJson.devDependencies?.vite));
check("sem React desnecessário", !packageJson.dependencies?.react && !packageJson.dependencies?.["react-dom"]);
check("GLB local e compacto", model.size > 10_000 && model.size < 2_000_000);
check("HDRI local e compacto", hdri.size > 10_000 && hdri.size < 2_000_000);
check("GLTFLoader presente", runtimeText.includes("GLTFLoader"));
check("RGBELoader presente", runtimeText.includes("RGBELoader"));
check("materiais PBR presentes", runtimeText.includes("MeshPhysicalMaterial") && runtimeText.includes("MeshStandardMaterial"));
check("GSAP ScrollTrigger presente", runtimeText.includes("ScrollTrigger"));
check("fallback visual presente", runtimeText.includes("burger-art--fallback"));
check("movimento reduzido presente", runtimeText.includes("prefers-reduced-motion"));
check("links do catálogo presentes", runtimeText.includes("data-catalog-link"));
check("slug configurável preservado", runtimeText.includes('slug: "modelo-hamburgueria"'));
check("cards sem hover de elevação", runtimeText.includes(".features article:hover") && runtimeText.includes("transform: none"));
check("caminho antigo removido da documentação principal", !fs.readFileSync(path.join(root, "README.md"), "utf8").includes("modelos/modelo-hamburgueria/"));

if (failures) process.exit(1);
console.log("\nValidação concluída sem erros.");
