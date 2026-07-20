import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Build que inlina tudo (JS, CSS) em um unico HTML, para o link de preview.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-single',
    chunkSizeWarningLimit: 5000,
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  },
})
