/// <reference types='vitest' />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin"
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin"

export default defineConfig({
    root: __dirname,
    cacheDir: "../../node_modules/.vite/apps/frontend",
    server: {
        port: 4001,
        host: "0.0.0.0",  // Ovo omogućava pristup s bilo koje IP adrese
        allowedHosts: ["localhost", ".ngrok-free.app", 'web-object-renderer.onrender.com'] // Dozvoljava localhost i sve ngrok domene
    },
    preview: {
        port: 4300,
        host: "0.0.0.0",  // Ovo omogućava pristup s bilo koje IP adrese
        allowedHosts: ["localhost", ".ngrok-free.app", '.onrender.com'] // Dozvoljava localhost i sve ngrok domene
    },
    plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(["*.md", "static.json"])],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
        outDir: "../../dist/apps/frontend",
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: {
            transformMixedEsModules: true
        }
    },
    optimizeDeps: {
        include: ["@emotion/react", "@mui/material"]
    }
})
