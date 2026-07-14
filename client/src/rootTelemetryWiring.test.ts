import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'

describe('root telemetry wiring', () => {
    test('initializes Sentry before rendering and wraps the root tree', () => {
        const source = readFileSync(resolve('src/index.tsx'), 'utf8')
        const initIndex = source.indexOf('initAcquisitionTelemetry()')
        const rootIndex = source.indexOf('createRoot(')

        expect(initIndex).toBeGreaterThan(-1)
        expect(rootIndex).toBeGreaterThan(initIndex)
        expect(source).toContain('<Sentry.ErrorBoundary')
        expect(source).toContain('beforeCapture={tagAcquisitionErrorScope}')
    })

    test('deployment runs the full test gate before the production build', () => {
        const pipeline = readFileSync(resolve('../azure-pipelines.yml'), 'utf8')
        const testIndex = pipeline.indexOf('npm test -- --run')
        const buildIndex = pipeline.indexOf('npm run build')

        expect(testIndex).toBeGreaterThan(-1)
        expect(buildIndex).toBeGreaterThan(testIndex)
        expect(pipeline).toContain(
            'VITE_SENTRY_RELEASE: jacobhal-se@$(Build.SourceVersion)'
        )
    })
})
