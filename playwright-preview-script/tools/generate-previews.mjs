import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { chromium } from 'playwright';
import config from './preview-config.mjs';

const execFileAsync = promisify(execFile);

function joinUrl(baseUrl, route) {
    return new URL(route, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).toString();
}

async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

async function removeIfExists(filePath) {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
}

async function moveFile(from, to) {
    await removeIfExists(to);
    await fs.rename(from, to);
}

async function runCommand(command, args) {
    try {
        await execFileAsync(command, args, {
            maxBuffer: 1024 * 1024 * 20
        });
    } catch (error) {
        const stderr = error.stderr ? `\n${error.stderr}` : '';
        throw new Error(`Falha ao executar ${command} ${args.join(' ')}${stderr}`);
    }
}

async function convertPngToWebp(inputPath, outputPath) {
    await runCommand('ffmpeg', [
        '-y',
        '-i', inputPath,
        '-c:v', 'libwebp',
        '-quality', '82',
        '-compression_level', '6',
        outputPath
    ]);
}

async function convertVideo(inputPath, outputWebmPath, outputMp4Path, outputWidth, frameRate) {
    const baseFilter = `scale=${outputWidth}:-2,fps=${frameRate}`;

    await runCommand('ffmpeg', [
        '-y',
        '-i', inputPath,
        '-an',
        '-vf', baseFilter,
        '-c:v', 'libvpx-vp9',
        '-row-mt', '1',
        '-tile-columns', '2',
        '-frame-parallel', '1',
        '-crf', '30',
        '-b:v', '0',
        '-deadline', 'realtime',
        '-cpu-used', '6',
        outputWebmPath
    ]);

    await runCommand('ffmpeg', [
        '-y',
        '-i', inputPath,
        '-an',
        '-vf', baseFilter,
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '19',
        '-movflags', '+faststart',
        '-pix_fmt', 'yuv420p',
        outputMp4Path
    ]);
}

async function autoScroll(page, pageConfig, globalConfig) {
    const scrollStep = pageConfig.scrollStep ?? globalConfig.scrollStep;
    const scrollIntervalMs = pageConfig.scrollIntervalMs ?? globalConfig.scrollIntervalMs;
    const durationMs = pageConfig.durationMs ?? globalConfig.durationMs;

    const startedAt = Date.now();
    let previousY = -1;
    let stopCounter = 0;

    while (Date.now() - startedAt < durationMs) {
        try {
            await page.waitForLoadState('domcontentloaded', {
                timeout: 5000
            }).catch(() => {});

            const state = await page.evaluate((step) => {
                const root = document.scrollingElement || document.documentElement;

                const maxScrollY = Math.max(
                    0,
                    root.scrollHeight - window.innerHeight
                );

                const before = window.scrollY;

                window.scrollBy({
                    top: step,
                    left: 0,
                    behavior: 'smooth'
                });

                return {
                    before,
                    after: window.scrollY,
                    maxScrollY,
                    reachedBottom: window.scrollY >= maxScrollY
                };
            }, scrollStep);

            await page.waitForTimeout(scrollIntervalMs);

            if (state.reachedBottom) {
                break;
            }

            if (state.after === previousY) {
                stopCounter += 1;
            } else {
                stopCounter = 0;
            }

            previousY = state.after;

            if (stopCounter >= 5) {
                break;
            }
        } catch (error) {
            if (
                error.message.includes('Execution context was destroyed') ||
                error.message.includes('Cannot find context') ||
                error.message.includes('Target page, context or browser has been closed')
            ) {
                await page.waitForTimeout(1000);
                continue;
            }

            throw error;
        }
    }
}

async function generatePreview(browser, pageConfig, globalConfig, dirs) {
    const url = joinUrl(globalConfig.baseUrl, pageConfig.route);
    const context = await browser.newContext({
        viewport: globalConfig.viewport,
        recordVideo: {
            dir: dirs.raw,
            size: globalConfig.viewport
        }
    });

    const page = await context.newPage();
    const videoHandle = page.video();

    console.log(`\n[preview] ${pageConfig.name}`);
    console.log(`- abrindo: ${url}`);

    await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: globalConfig.gotoTimeoutMs
    });

    await page.waitForTimeout(3500);

    await page.waitForTimeout(pageConfig.waitBeforeStartMs ?? globalConfig.waitBeforeStartMs);

    const pngPath = path.join(dirs.images, `${pageConfig.name}.png`);
    const webpPath = path.join(dirs.images, `${pageConfig.name}-preview.webp`);
    const rawVideoPath = path.join(dirs.raw, `${pageConfig.name}-raw.webm`);
    const finalWebmPath = path.join(dirs.videos, `${pageConfig.name}-preview.webm`);
    const finalMp4Path = path.join(dirs.videos, `${pageConfig.name}-preview.mp4`);

    await page.screenshot({
        path: pngPath,
        fullPage: false
    });

    await autoScroll(page, pageConfig, globalConfig);
    await page.waitForTimeout(pageConfig.waitAfterScrollMs ?? globalConfig.waitAfterScrollMs);

    await page.close();
    await context.close();

    const recordedVideoPath = await videoHandle.path();
    await moveFile(recordedVideoPath, rawVideoPath);

    await convertPngToWebp(pngPath, webpPath);
    await convertVideo(
        rawVideoPath,
        finalWebmPath,
        finalMp4Path,
        globalConfig.outputWidth,
        globalConfig.frameRate
    );

    console.log(`- poster: ${webpPath}`);
    console.log(`- webm:   ${finalWebmPath}`);
    console.log(`- mp4:    ${finalMp4Path}`);
}

async function main() {
    const rootDir = path.resolve(process.cwd(), config.outputDir);
    const dirs = {
        root: rootDir,
        raw: path.join(rootDir, 'raw'),
        images: path.join(rootDir, 'images'),
        videos: path.join(rootDir, 'videos')
    };

    await ensureDir(dirs.raw);
    await ensureDir(dirs.images);
    await ensureDir(dirs.videos);

    await runCommand('ffmpeg', ['-version']);

    const browser = await chromium.launch({
        headless: true
    });

    try {
        for (const pageConfig of config.pages) {
            await generatePreview(browser, pageConfig, config, dirs);
        }
    } finally {
        await browser.close();
    }

    console.log('\nConcluído. Arquivos gerados em:');
    console.log(`- ${dirs.images}`);
    console.log(`- ${dirs.videos}`);
}

main().catch((error) => {
    console.error('\nErro ao gerar previews:');
    console.error(error.message);
    process.exit(1);
});
