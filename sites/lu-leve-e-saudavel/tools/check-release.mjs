/* Checklist somente de leitura. Não publica, não libera indexação e não altera dados.
 * Uso: node tools/check-release.mjs
 * Saída: 0 = sem pendências automáticas; 1 = pendência ou erro.
 * Mesmo com saída 0, as conferências humanas continuam obrigatórias.
 */
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function text(value) {
    return typeof value === "string" ? value.trim() : "";
}

function safeHttps(value) {
    try {
        const url = new URL(text(value));
        return url.protocol === "https:" && !url.username && !url.password;
    } catch {
        return false;
    }
}

function attribute(tag, name) {
    return tag.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2] || "";
}

export function reviewRelease(config, html, normalizePhone) {
    const contact = config?.contact || {};
    const promotion = config?.promotion || {};
    const document = text(html).replace(/<!--[\s\S]*?-->/g, "");
    const metaTags = document.match(/<meta\b[^>]*>/gi) || [];
    const restricted = metaTags.some((tag) => {
        return ["robots", "googlebot", "bingbot"].includes(attribute(tag, "name").toLowerCase())
            && /\b(?:noindex|nofollow|none)\b/i.test(attribute(tag, "content"));
    });
    const result = [];

    function item(id, ok, label) {
        result.push({ id, status: ok ? "OK" : "PENDENTE", label });
    }

    item("whatsapp", Boolean(normalizePhone(contact.whatsappNumber)),
        "WhatsApp em formato válido; confirme manualmente se pertence à Lu.");
    item("instagram", safeHttps(contact.instagramUrl) && Boolean(text(contact.instagramHandle)),
        "Instagram com URL HTTPS e identificação; confirme o perfil no navegador.");
    item("recebimento", [contact.regions, contact.pickup, contact.delivery].every((value) => text(value)),
        "Regiões, retirada e entrega preenchidas; confira as informações com a responsável.");
    item("neoeffex", safeHttps(config?.developer?.url) && Boolean(text(config?.developer?.name)),
        "URL oficial HTTPS do crédito da Neoeffex configurada.");
    item("imagens", !/ilustrativ[ao]s?/i.test(document),
        "Substituir fotos provisórias e atualizar legendas/alt; o código não comprova a origem das fotos.");
    item("indexacao", !restricted,
        "Retirar noindex/nofollow somente quando a publicação estiver aprovada; não é controle de acesso.");
    item("aviso", !/\bproject-status\b/.test(document),
        "Remover a faixa de pré-publicação somente após concluir a revisão.");
    item("promocao", promotion.enabled === false || (promotion.enabled === true
        && Boolean(text(promotion.title)) && Boolean(text(promotion.description))),
    "Promoção desativada ou preenchida; se ativa, conferir condições, validade e desativação manual.");

    for (const [id, label] of [
        ["atendimento", "Confirmar endereço/horários ou aprovar conscientemente sua omissão; não inventar."],
        ["marca", "Confirmar com a responsável se a variação de logo aplicada ao cabeçalho é a oficial."],
        ["conteudo", "Confirmar preços, porções, extras, fotos reais e disponibilidade com a responsável."],
        ["visual", "Testar navegador, celular, teclado, zoom, sem JavaScript e movimento reduzido."],
        ["destino", "Confirmar domínio/pasta, HTTPS, arquivos carregados e destinatários dos links."]
    ]) {
        result.push({ id, status: "MANUAL", label });
    }

    return result;
}

export function readRelease() {
    // Executa somente os dois arquivos locais conhecidos, sem APIs de rede ou escrita.
    const context = vm.createContext({ window: {} });

    for (const name of ["config.js", "whatsapp.js"]) {
        vm.runInContext(readFileSync(join(root, "scripts", name), "utf8"), context, {
            filename: name,
            timeout: 1000
        });
    }

    const app = context.window.LuLeve;
    return reviewRelease(app.config, readFileSync(join(root, "index.html"), "utf8"), app.whatsapp.normalizePhone);
}

// Importar nos testes não executa o comando nem altera process.exitCode.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        if (process.argv.length > 2) {
            throw new Error("Uso: node tools/check-release.mjs (sem argumentos).");
        }

        const checks = readRelease();
        checks.forEach(({ status, label }) => console.log(`[${status}] ${label}`));
        const pending = checks.filter(({ status }) => status === "PENDENTE").length;
        console.log(`\n${pending} pendência(s) automática(s). Confira também os itens MANUAL em docs/PUBLICACAO.md.`);
        console.log("Este comando não executa os testes técnicos. Rode também node tests/validate.mjs.");
        console.log("Nenhum arquivo foi alterado e nada foi publicado.");
        process.exitCode = pending ? 1 : 0;
    } catch (error) {
        console.error(`Conferência interrompida: ${error.message}`);
        process.exitCode = 1;
    }
}
