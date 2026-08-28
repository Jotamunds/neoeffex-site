/* Regressões de entrega/publicação. Não exige telefone real para testar a base. */
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { readRelease, reviewRelease } from "../tools/check-release.mjs";

export function validateRelease({ check, root, html, config, normalizePhone }) {
    const read = (file) => readFileSync(join(root, file), "utf8");
    const clone = (value) => JSON.parse(JSON.stringify(value));
    const status = (items, id) => items.find((item) => item.id === id)?.status;

    check("Metadados descrevem o cardápio e a versão acompanha a entrega", () => {
        const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
        assert.ok(description.length >= 80 && description.length <= 220);
        assert.match(description, /preços e combos/);
        assert.match(description, /Lu Leve e Saudável/);
        assert.match(config.version, /^\d+\.\d+\.\d+(?:\.\d+)?$/);
        assert.ok(read("README.md").includes(`v${config.version}`));
        assert.ok(read("CHANGELOG.md").includes(`## v${config.version}`));
        assert.doesNotMatch(html, /<base\b/i);
    });

    check("Links em nova aba têm proteção e protocolo HTTPS", () => {
        for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
            assert.match(tag, /rel="noopener noreferrer"/);
            assert.match(tag, /href="https:\/\//);
        }

        assert.doesNotMatch(html, /href="(?:javascript:|data:|http:)/i);
    });

    check("Recursos do HTML funcionam na raiz ou em uma subpasta", () => {
        const references = [...html.matchAll(/(?:src|href)="(\.\/[^"]+)"/g)].map((match) => match[1]);
        assert.ok(references.length > 5);

        for (const reference of references) {
            for (const base of ["https://example.invalid/", "https://example.invalid/lu-leve-e-saudavel/"]) {
                const url = new URL(reference, base);
                assert.ok(url.href.startsWith(base));
                assert.equal(url.origin, new URL(base).origin);
            }
        }

        assert.doesNotMatch(html, /(?:src|href)="\//);
    });

    check("Referências CSS respeitam caminhos, caixa dos nomes e arquivos locais", () => {
        function walk(directory) {
            return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
                const path = join(directory, entry.name);
                return entry.isDirectory() ? walk(path) : [path];
            });
        }

        for (const file of walk(join(root, "styles"))) {
            for (const [, reference] of readFileSync(file, "utf8").matchAll(/url\("([^"]+)"\)/g)) {
                assert.doesNotMatch(reference, /^(?:https?:|data:|\/)/i);
                const target = resolve(dirname(file), reference);
                assert.ok(target.startsWith(`${root}${sep}`));
                assert.ok(statSync(target).isFile());
                assert.ok(readdirSync(dirname(target)).includes(basename(target)));
            }
        }
    });

    check("Página não incorpora serviços externos nem carrega ferramentas de desenvolvimento", () => {
        assert.doesNotMatch(html, /<(?:iframe|embed|object|form)\b/i);
        assert.doesNotMatch(html, /<(?:script|img)[^>]+src="(?:https?:)?\/\//i);
        assert.doesNotMatch(html, /<script[^>]+src="[^"]*(?:tools|tests)\//);
        assert.doesNotMatch(read("styles/layout/grid.css"), /\.stage-placeholder/);
    });

    check("Checklist usa os dados reais sem confundir base válida com publicação pronta", () => {
        const checks = readRelease();
        assert.equal(status(checks, "whatsapp"), normalizePhone(config.contact.whatsappNumber) ? "OK" : "PENDENTE");
        const sample = '<meta name="robots" content="noindex"><aside class="project-status">Revisão</aside><p>Imagem ilustrativa</p>';
        const preview = reviewRelease(config, sample, normalizePhone);
        assert.equal(status(preview, "indexacao"), "PENDENTE");
        assert.equal(status(preview, "aviso"), "PENDENTE");
        assert.equal(status(preview, "imagens"), "PENDENTE");
        assert.equal(checks.filter((item) => item.status === "MANUAL").length, 5);
        assert.equal(new Set(checks.map((item) => item.id)).size, checks.length);
    });

    check("Checklist rejeita WhatsApp vazio, incompleto ou com letras", () => {
        for (const number of ["", "  ", null, 123, "11999999999", "texto"]) {
            const sample = clone(config);
            sample.contact.whatsappNumber = number;
            assert.equal(status(reviewRelease(sample, html, normalizePhone), "whatsapp"), "PENDENTE");
        }
    });

    check("Checklist rejeita URLs inseguras ou com credenciais", () => {
        for (const url of ["", null, "javascript:alert(1)", "http://example.invalid", "https://u:p@example.invalid"]) {
            const sample = clone(config);
            sample.contact.instagramUrl = url;
            sample.developer.url = url;
            const checks = reviewRelease(sample, html, normalizePhone);
            assert.equal(status(checks, "instagram"), "PENDENTE");
            assert.equal(status(checks, "neoeffex"), "PENDENTE");
        }
    });

    check("Checklist distingue diretivas de indexação e ignora comentários", () => {
        for (const content of ["noindex, nofollow", "NOINDEX", "none", "index, nofollow"]) {
            const sample = `<meta content='${content}' name='ROBOTS'>`;
            assert.equal(status(reviewRelease(config, sample, normalizePhone), "indexacao"), "PENDENTE");
        }

        const comment = '<!-- <meta name="robots" content="noindex"> -->';
        assert.equal(status(reviewRelease(config, comment, normalizePhone), "indexacao"), "OK");
        assert.equal(status(reviewRelease(config, '<meta data-name="robots" content="noindex">', normalizePhone), "indexacao"), "OK");
    });

    check("Checklist mantém pendências manuais mesmo sem marcadores provisórios", () => {
        const sample = clone(config);
        sample.contact.whatsappNumber = "5511999999999";
        sample.developer.url = "https://example.invalid/credito";
        sample.promotion.enabled = false;
        const checks = reviewRelease(sample, "<main>Conteúdo de teste</main>", normalizePhone);
        assert.equal(checks.filter((item) => item.status === "PENDENTE").length, 0);
        assert.equal(status(checks, "visual"), "MANUAL");
        assert.equal(status(checks, "conteudo"), "MANUAL");
        assert.equal(status(checks, "destino"), "MANUAL");
    });

    check("Checklist não exige promoção e rejeita ativação incompleta", () => {
        const sample = clone(config);
        sample.promotion = { enabled: false, title: "", description: "" };
        assert.equal(status(reviewRelease(sample, html, normalizePhone), "promocao"), "OK");

        for (const enabled of [true, "true", undefined]) {
            sample.promotion.enabled = enabled;
            assert.equal(status(reviewRelease(sample, html, normalizePhone), "promocao"), "PENDENTE");
        }

        sample.promotion = { enabled: true, title: "Oferta de teste", description: "Condições de teste" };
        assert.equal(status(reviewRelease(sample, html, normalizePhone), "promocao"), "OK");
    });

    check("Checklist tolera configuração incompleta sem preencher dados", () => {
        for (const value of [null, {}, { contact: {}, developer: {} }]) {
            const checks = reviewRelease(value, "", normalizePhone);
            assert.equal(status(checks, "whatsapp"), "PENDENTE");
            assert.equal(status(checks, "recebimento"), "PENDENTE");
        }

        const before = JSON.stringify(config);
        reviewRelease(config, html, normalizePhone);
        assert.equal(JSON.stringify(config), before);
    });

    check("Comando de publicação é somente leitura e funciona fora da pasta do projeto", () => {
        const path = join(root, "tools/check-release.mjs");
        const before = read("index.html") + read("scripts/config.js");
        const result = spawnSync(process.execPath, [path], { cwd: dirname(root), encoding: "utf8" });
        assert.equal(result.status, readRelease().some((item) => item.status === "PENDENTE") ? 1 : 0);
        assert.match(result.stdout, /pendência\(s\) automática\(s\)/);
        assert.match(result.stdout, /nada foi publicado/);
        assert.equal(read("index.html") + read("scripts/config.js"), before);
        assert.doesNotMatch(read("tools/check-release.mjs"), /writeFile|fetch\(|https\.request|execSync|spawnSync/);
    });

    check("Comando recusa argumentos que poderiam sugerir publicação automática", () => {
        const result = spawnSync(process.execPath, [join(root, "tools/check-release.mjs"), "--publish"], { encoding: "utf8" });
        assert.equal(result.status, 1);
        assert.match(result.stderr, /sem argumentos/);
    });
}
