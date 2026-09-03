import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const source = path.join(root, "source");

function resetDirectory(directory) {
    fs.rmSync(directory, { recursive: true, force: true });
    fs.mkdirSync(directory, { recursive: true });
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

const assetsRoot = path.join(root, "assets");
resetDirectory(assetsRoot);
fs.mkdirSync(path.join(assetsRoot, "css"), { recursive: true });
fs.mkdirSync(path.join(assetsRoot, "js"), { recursive: true });

fs.copyFileSync(
    path.join(source, "src", "site.css"),
    path.join(assetsRoot, "css", "site.css")
);

for (const name of ["config.js", "catalog.js", "site.js", "burger3d.js"]) {
    fs.copyFileSync(
        path.join(source, "src", name),
        path.join(assetsRoot, "js", name)
    );
}

const mainSource = fs.readFileSync(path.join(source, "src", "main.js"), "utf8")
    .replace(/^import\s+["']\.\/site\.css["'];?\s*/m, "");
fs.writeFileSync(path.join(assetsRoot, "js", "main.js"), mainSource, "utf8");

for (const directory of ["models", "hdr"]) {
    const from = path.join(source, "public", directory);
    const to = path.join(root, directory);
    resetDirectory(to);
    copyDirectory(from, to);
}

let html = fs.readFileSync(path.join(source, "index.html"), "utf8");
html = html.replace(
    "</head>",
    '    <link rel="stylesheet" href="./assets/css/site.css">\n</head>'
);

const runtimeScripts = `    <script type="importmap">
        {
            "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js",
                "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/",
                "three/examples/jsm/": "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/",
                "gsap": "https://cdn.jsdelivr.net/npm/gsap@3.13.0/index.js",
                "gsap/ScrollTrigger": "https://cdn.jsdelivr.net/npm/gsap@3.13.0/ScrollTrigger.js"
            }
        }
    </script>
    <script type="module" src="./assets/js/main.js"></script>`;

html = html.replace(
    /    <script type="module" src="\.\/src\/main\.js"><\/script>/,
    runtimeScripts
);

fs.writeFileSync(path.join(root, "index.html"), html, "utf8");
console.log("Live Server sincronizado em modelos/hamburgueria/.");
