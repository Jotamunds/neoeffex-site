/* Uso: node tools/build-menu.mjs [--check]
 * Sem dependências. Executado no desenvolvimento, nunca no navegador.
 * Valida tudo antes de escrever apenas as regiões MENU do index.html.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { updateMenuHtml } from "./menu-template.mjs";

try {
    const args = process.argv.slice(2);

    if (args.length > 1 || (args.length === 1 && args[0] !== "--check")) {
        throw new Error("Uso: node tools/build-menu.mjs [--check]");
    }

    const htmlPath = fileURLToPath(new URL("../index.html", import.meta.url));
    const dataPath = fileURLToPath(new URL("../data/menu.json", import.meta.url));
    const before = readFileSync(htmlPath, "utf8");
    const menu = JSON.parse(readFileSync(dataPath, "utf8"));
    const after = updateMenuHtml(before, menu);

    if (args.includes("--check")) {
        if (before !== after) {
            throw new Error("Cardápio desatualizado. Execute node tools/build-menu.mjs e revise o git diff.");
        }

        console.log("Cardápio no HTML corresponde a data/menu.json.");
    } else if (before !== after) {
        writeFileSync(htmlPath, after, "utf8");
        console.log("Cards e acréscimos atualizados no index.html. Revise o git diff antes do commit.");
    } else {
        console.log("Cardápio já atualizado; nenhum arquivo alterado.");
    }
} catch (error) {
    console.error(`Cardápio não atualizado: ${error.message}`);
    process.exitCode = 1;
}
