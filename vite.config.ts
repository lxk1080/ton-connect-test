import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// import fs from 'fs'
// import path from 'path'
// import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // @ts-ignore
      crypto: true,
      stream: true,
      buffer: true,
      process: true
    }),
    // basicSsl({
    //   /** name of certification */
    //   name: 'test',
    //   /** custom trust domains */
    //   domains: ['*.custom.com'],
    //   /** custom certification directory */
    //   certDir: './cert'
    // })
  ],
  server: {
    port: 8089,
    host: '0.0.0.0',
    proxy: {
      '/cosmosRpc': {
        target: 'https://cosmos-rpc.quickapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cosmosRpc/, ''),
      },
    },
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
    // },
  },
})
