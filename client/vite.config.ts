import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'

const uploadToken = process.env.SENTRY_AUTH_TOKEN?.trim() ?? ''
const canUploadSourceMaps =
    uploadToken.length > 0 && !uploadToken.startsWith('$(')

export default defineConfig({
    plugins: [
        react(),
        ...(canUploadSourceMaps
            ? [
                  sentryVitePlugin({
                      url: 'https://de.sentry.io/',
                      authToken: uploadToken,
                      org: 'jacob-hallman',
                      project: 'jacobhal-se',
                      telemetry: false,
                      release: {
                          name:
                              process.env.VITE_SENTRY_RELEASE ??
                              'jacobhal-se@local',
                      },
                      sourcemaps: {
                          assets: './build/**',
                          filesToDeleteAfterUpload: './build/**/*.map',
                      },
                  }),
              ]
            : []),
    ],
    server: {
        port: 3000,
        proxy: {
            '/api': 'http://localhost:5001',
        },
    },
    build: {
        outDir: 'build',
        // Generate private maps only when the authenticated build plugin can
        // upload and delete them. A missing CI token can never publish maps.
        sourcemap: canUploadSourceMaps ? 'hidden' : false,
    },
})
