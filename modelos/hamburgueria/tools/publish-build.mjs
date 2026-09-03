import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const dist = path.join(root, "dist");

if (!fs.existsSync(path.join(dist, "index.html"))) {
    throw new Error("Build não encontrado. Execute npm run build antes.");
}

function copyDirectory(from, to) {
    fs.mkdirSync(to, { recursive: true });
    for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
        const sourcePath = path.join(from, entry.name);
        const targetPath = path.join(to, entry.name);
        if (entry.isDirectory()) copyDirectory(sourcePath, targetPath);
        else fs.copyFileSync(sourcePath, targetPath);
    }
}

for (const target of ["index.html", "assets", "models", "hdr"]) {
    fs.rmSync(path.join(root, target), { recursive: true, force: true });
}

for (const entry of fs.readdirSync(dist, { withFileTypes: true })) {
    const sourcePath = path.join(dist, entry.name);
    const targetPath = path.join(root, entry.name);
    if (entry.isDirectory()) copyDirectory(sourcePath, targetPath);
    else fs.copyFileSync(sourcePath, targetPath);
}

console.log("Build de produção publicado em modelos/hamburgueria/.");
