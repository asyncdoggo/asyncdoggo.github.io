import { copyFile, mkdir } from 'fs/promises';
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite'

export default defineConfig({
    base: './',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            },
        },
    },
    optimizeDeps: { exclude: ["pyodide"] },
    plugins: [
        {
            name: 'worker headers to enable SharedArrayBuffer',
            configureServer: (server) => {
                server.middlewares.use((req, res, next) => {
                    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
                    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
                    res.setHeader('Cross-Origin-Report-Only', 'same-origin');
                    next();
                })
            }
        },
        {
            name: "vite-plugin-pyodide",
            generateBundle: async () => {
              const assetsDir = "dist/assets";
              await mkdir(assetsDir, { recursive: true });
              const files = [
                "pyodide-lock.json",
                "pyodide.asm.js",
                "pyodide.asm.wasm",
                "python_stdlib.zip",
              ];
              const modulePath = fileURLToPath(import.meta.resolve("pyodide"));
              for (const file of files) {
                await copyFile(
                  join(dirname(modulePath), file),
                  join(assetsDir, file),
                );
              }
            },
          },
    ],
    worker: {
        format: 'es',
    }
})