import { defineConfig } from "vite";

export default defineConfig({
    root: "source",
    base: "./",
    publicDir: "public",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        target: "es2020",
        assetsInlineLimit: 4096,
        sourcemap: false
    }
});
