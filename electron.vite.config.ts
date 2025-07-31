import { defineConfig, loadEnv } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // Cargar variables del archivo .env basado en el modo actual
  const env = loadEnv(mode, process.cwd())

  return {
    main: {
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, './electron/main/index.ts')
          }
        }
      }
    },
    preload: {
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, './electron/preload/index.ts')
          }
        }
      }
    },
    renderer: {
      root: '.',
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'index.html')
          }
        }
      },
      server: {
        port: Number(env.APP_PORT) || 5173,
        strictPort: true
      }
    }
  }
})
