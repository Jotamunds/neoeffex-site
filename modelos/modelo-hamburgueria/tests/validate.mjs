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
    "assets/css/site.css",
    "assets/js/config.js",
    "assets/js/catalog.js",
    "assets/js/site.js"
];
const runtimeFiles = [
    "index.html",
    "assets/css/site.css",
    "assets/js/config.js",
    "assets/js/catalog.js",
    "assets/js/site.js"
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

const runtimeText = runtimeFiles
    .map((file) => fs.readFileSync(path.join(root, file), "utf8"))
    .join("\n");

check("sem URL de imagens da Hostinger no runtime", !runtimeText.includes("images.hostinger.com"));
check("sem EcommerceApi no runtime", !runtimeText.includes("EcommerceApi"));
check("sem React no runtime", !/from [\"']react[\"']|ReactDOM|React\.createElement/.test(runtimeText));
check("sem react-router no runtime", !runtimeText.includes("react-router"));
check("sem Framer Motion no runtime", !runtimeText.includes("framer-motion"));
check("sem Tailwind no runtime", !runtimeText.includes("@tailwind") && !runtimeText.includes("tailwindcss"));
check("sem alias @/ no runtime", !runtimeText.includes("@/"));
check("sem innerHTML na configuração dinâmica", !fs.readFileSync(path.join(root, "assets/js/site.js"), "utf8").includes("innerHTML"));
check("slug do catálogo presente", runtimeText.includes('slug: "modelo-hamburgueria"'));
check("links de catálogo marcados", runtimeText.includes("data-catalog-link"));
check("suporte a movimento reduzido", runtimeText.includes("prefers-reduced-motion"));

for (const forbidden of ["package.json", "package-lock.json", "node_modules", "src", "app"]) {
    check(`sem ${forbidden} na raiz do módulo`, !fs.existsSync(path.join(root, forbidden)));
}

if (failures) process.exit(1);
console.log("\nValidação concluída sem erros.");
