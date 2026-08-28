import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputPath = resolve(projectRoot, "dist/server/index.js");
const sourceDirectories = ["css", "js", "assets/images"];
const sourceFiles = ["index.html"];

for (const directory of sourceDirectories) {
    const entries = await readdir(resolve(projectRoot, directory), { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isFile()) {
            sourceFiles.push(join(directory, entry.name));
        }
    }
}

const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".jpg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8"
};

const assets = {};

for (const sourceFile of sourceFiles) {
    const absolutePath = resolve(projectRoot, sourceFile);
    const key = relative(projectRoot, absolutePath).replaceAll("\\", "/");
    const contents = await readFile(absolutePath);

    assets[key] = {
        body: contents.toString("base64"),
        type: mimeTypes[extname(sourceFile)] || "application/octet-stream"
    };
}

const workerSource = `const assets = ${JSON.stringify(assets)};

const decodeBase64 = (value) => {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
};

export default {
    async fetch(request) {
        const url = new URL(request.url);
        let pathname = decodeURIComponent(url.pathname).replace(/^\\/+|\\/+$/g, "");

        if (!pathname || pathname === "barbearia1") {
            pathname = "index.html";
        } else if (pathname.startsWith("barbearia1/")) {
            pathname = pathname.slice("barbearia1/".length);
        }

        const asset = assets[pathname];

        if (!asset) {
            return new Response("Not found", { status: 404 });
        }

        return new Response(decodeBase64(asset.body), {
            headers: {
                "content-type": asset.type,
                "cache-control": pathname === "index.html"
                    ? "no-cache"
                    : "public, max-age=31536000, immutable"
            }
        });
    }
};
`;

await mkdir(resolve(projectRoot, "dist/server"), { recursive: true });
await writeFile(outputPath, workerSource, "utf8");
console.log(`Bundled ${sourceFiles.length} files into ${outputPath}`);
