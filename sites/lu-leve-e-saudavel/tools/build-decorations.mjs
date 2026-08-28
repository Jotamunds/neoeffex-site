/* Uso: node tools/build-decorations.mjs [--check]
 * Apenas desenvolvimento; o HTML entregue já contém os SVGs locais.
 * Gramática restrita aos ícones deste pacote, não é um sanitizador SVG geral.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const decorationAssets = Object.freeze({
    hero: "sprout.svg",
    fitness: "dumbbell.svg",
    final: "leaf.svg",
    traditional: "wheat.svg",
    steps: "salad.svg",
    contact: "sun.svg"
});
const svgHeader = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';

export function renderDecoration(id, source) {
    if (!Object.hasOwn(decorationAssets, id) || typeof source !== "string") {
        throw new Error("Decoração desconhecida ou SVG ausente.");
    }

    const svg = source.trim();

    if (!svg.startsWith(svgHeader) || !svg.endsWith("</svg>")) {
        throw new Error("SVG inválido: preserve o cabeçalho documentado.");
    }

    const body = svg.slice(svgHeader.length, -6).trim();
    const shapePattern = /<path d="[MmLlHhVvCcSsQqTtAaZzEe0-9.,+\s-]+"><\/path>|<circle cx="\d+(?:\.\d+)?" cy="\d+(?:\.\d+)?" r="\d+(?:\.\d+)?"><\/circle>/g;
    const shapes = body.match(shapePattern) || [];

    if (shapes.length === 0 || body.replace(shapePattern, "").trim() !== "") {
        throw new Error("SVG inválido: apenas paths e círculos locais, sem eventos, estilos ou referências.");
    }

    for (const shape of shapes.filter((item) => item.startsWith("<circle"))) {
        const [cx, cy, radius] = [...shape.matchAll(/="([\d.]+)"/g)].map((match) => Number(match[1]));

        if (![cx, cy, radius].every(Number.isFinite) || radius <= 0 || cx - radius < 0 || cy - radius < 0 || cx + radius > 24 || cy + radius > 24) {
            throw new Error("SVG inválido: círculo fora do viewBox ou com raio inválido.");
        }
    }

    const accessibleHeader = svgHeader.replace("<svg ", '<svg class="section-decoration__art" aria-hidden="true" focusable="false" ');
    return [
        `            <div class="section-decoration section-decoration--${id}" aria-hidden="true">`,
        `                ${accessibleHeader}`,
        ...shapes.map((shape) => `                    ${shape}`),
        "                </svg>",
        "            </div>"
    ].join("\n");
}

export function updateDecorationsHtml(html, assets) {
    const updates = Object.keys(decorationAssets).map((id) => {
        const start = `            <!-- DECORATION:${id}:START -->`;
        const end = `            <!-- DECORATION:${id}:END -->`;

        if (html.split(start).length !== 2 || html.split(end).length !== 2) {
            throw new Error(`Marcador ausente ou duplicado: ${id}`);
        }

        const from = html.indexOf(start) + start.length;
        const to = html.indexOf(end);

        if (to < from || html.slice(from, to).includes("<!-- DECORATION:")) {
            throw new Error(`Marcadores fora de ordem ou aninhados: ${id}`);
        }

        return { from, to, content: `\n${renderDecoration(id, assets[id])}\n` };
    });

    return updates.sort((a, b) => b.from - a.from).reduce((result, update) =>
        result.slice(0, update.from) + update.content + result.slice(update.to), html);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        const args = process.argv.slice(2);

        if (args.length > 1 || (args.length === 1 && args[0] !== "--check")) {
            throw new Error("Uso: node tools/build-decorations.mjs [--check]");
        }

        const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
        const file = join(root, "index.html");
        const assets = Object.fromEntries(Object.entries(decorationAssets).map(([id, name]) => [id, readFileSync(join(root, "assets/decorations", name), "utf8")]));
        const before = readFileSync(file, "utf8");
        const after = updateDecorationsHtml(before, assets);

        if (args.includes("--check") && before !== after) {
            throw new Error("Ícones desatualizados. Execute node tools/build-decorations.mjs e revise as alterações.");
        }

        if (!args.includes("--check") && before !== after) {
            writeFileSync(file, after, "utf8");
            console.log("Ícones atualizados no HTML. Revise as alterações antes do commit.");
        } else {
            console.log("Ícones no HTML correspondem a assets/decorations; nenhum arquivo alterado.");
        }
    } catch (error) {
        console.error(`Decorações não atualizadas: ${error.message}`);
        process.exitCode = 1;
    }
}
