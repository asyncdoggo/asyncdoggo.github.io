import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    // Write a middleware to serve blogs/* to blogs
    plugins: [
        {
            name: 'serve-blogs',
            configureServer(server) {
                server.middlewares.use('/blogs/1', (req, res, next) => {
                    req.url = '/blogs/'
                    next()
                })
            }
        }
    ],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            }
        }
    }
})