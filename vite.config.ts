import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { setDefaultResultOrder } from 'node:dns'

setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,vue}'],
      },
      manifest: {
        name: "WisdomTreasures",
        short_name: "WisdomTreasures",
        start_url: "https://wisdomtreasures.web.app/",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#3D6E7C",
        description: "Everyday wisdom words",
        icons: [
          {
            src: "https://wisdomtreasures.web.app/img/logo48.png",
            sizes: "48x48",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "https://wisdomtreasures.web.app/img/logo72.png",
            sizes: "72x72",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "https://wisdomtreasures.web.app/img/logo96.png",
            sizes: "96x96",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "https://wisdomtreasures.web.app/img/logo144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "https://wisdomtreasures.web.app/img/logo168.png",
            sizes: "168x168",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "https://wisdomtreasures.web.app/img/logo192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "https://wisdomtreasures.web.app/img/logo512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
    server: {
      port: 8080,
  },
  preview: {
      port: 8080,
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  },
})
