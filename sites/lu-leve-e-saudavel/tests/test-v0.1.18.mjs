import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const js = fs.readFileSync(path.join(root, 'price-countup.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'price-countup.css'), 'utf8');
const apply = fs.readFileSync(path.join(root, 'apply-v0.1.18.ps1'), 'utf8');
const rollback = fs.readFileSync(path.join(root, 'rollback-v0.1.18.ps1'), 'utf8');

const checks = [
    ['regex exige R$', /PRICE_RE\s*=.*R\\\$/.test(js)],
    ['formato pt-BR', js.includes("toLocaleString('pt-BR'")],
    ['duas casas decimais', js.includes('minimumFractionDigits: 2') && js.includes('maximumFractionDigits: 2')],
    ['converte vírgula decimal', js.includes("replace(',', '.')")],
    ['remove separador de milhar', js.includes("replace(/\\./g, '')")],
    ['usa IntersectionObserver', js.includes('IntersectionObserver')],
    ['desconecta alvo após entrada', js.includes('observer.unobserve(entry.target)')],
    ['estado de execução única', js.includes('priceCountupPlayed')],
    ['inicia em zero', js.includes('renderFrame(target, 0)')],
    ['restaura texto original', js.includes('target.node.nodeValue = target.original')],
    ['reduced motion', js.includes('prefers-reduced-motion: reduce')],
    ['fallback sem observer', js.includes("!('IntersectionObserver' in window)")],
    ['não toca scripts', js.includes("'script'")],
    ['não toca inputs', js.includes("'input'")],
    ['opt-out por atributo', js.includes('[data-no-price-countup]')],
    ['somente text nodes', js.includes('NodeFilter.SHOW_TEXT')],
    ['stagger limitado', js.includes('Math.min(sequence * STAGGER_MS, 280)')],
    ['easing', js.includes('easeOutCubic')],
    ['requestAnimationFrame', js.includes('requestAnimationFrame')],
    ['classe numérica tabular', css.includes('font-variant-numeric: tabular-nums')],
    ['css reduced motion', css.includes('@media (prefers-reduced-motion: reduce)')],
    ['backup v0.1.17', apply.includes('index.html.v0.1.17.bak')],
    ['injeção css idempotente', apply.includes("$html -notmatch 'price-countup\\.css'")],
    ['injeção js idempotente', apply.includes("$html -notmatch 'price-countup\\.js'")],
    ['version v0.1.18', apply.includes('v0.1.18')],
    ['rollback v0.1.17', rollback.includes('v0.1.17')],
    ['remove arquivos no rollback', rollback.includes('price-countup.css') && rollback.includes('price-countup.js')]
];

let passed = 0;
for (const [name, ok] of checks) {
    assert.equal(ok, true, `Falhou: ${name}`);
    passed += 1;
}

console.log(`${passed}/${checks.length} testes passaram.`);
