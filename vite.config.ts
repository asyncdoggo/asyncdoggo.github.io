import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    base: './',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            }
        }
    },
    plugins: [
        {
            name: 'worker headers to enable SharedArrayBuffer',
            configureServer: (server) => {
                server.middlewares.use((req, res, next) => {
                    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
                    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
                    next();
                })
            }
        }
    ],
})