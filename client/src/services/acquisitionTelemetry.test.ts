import { beforeEach, describe, expect, test, vi } from 'vitest'

const sentry = vi.hoisted(() => ({
    addBreadcrumb: vi.fn(),
    browserTracingIntegration: vi.fn(() => ({ name: 'BrowserTracing' })),
    captureException: vi.fn(),
    init: vi.fn(),
    setTag: vi.fn(),
}))

vi.mock('@sentry/react', () => sentry)

import {
    FALLBACK_SENTRY_DSN,
    buildSentryOptions,
    captureAcquisitionFailure,
    initAcquisitionTelemetry,
    recordAcquisitionBreadcrumb,
    redactTelemetryString,
    sanitizeSentryEvent,
    tagAcquisitionErrorScope,
} from './acquisitionTelemetry'

beforeEach(() => {
    vi.clearAllMocks()
})

describe('acquisition telemetry privacy', () => {
    test('redacts invite URLs, codes, query strings, fragments, emails, and ids', () => {
        const code = 'ABC234XYZ789'
        const email = 'person@example.test'
        const uid = 'f1000000-0000-4000-8000-000000000001'
        const inviteUrl =
            `https://jacobhal.se/skarp/invite/${code}` +
            `?email=${encodeURIComponent(email)}#${uid}`

        const sanitized = sanitizeSentryEvent(
            {
                message: `Could not open ${inviteUrl}`,
                transaction: `/skarp/invite/${code}?source=${email}#${uid}`,
                request: { url: inviteUrl },
                extra: { code, email, uid, nested: [inviteUrl] },
                breadcrumbs: [
                    {
                        message: inviteUrl,
                        data: { destination: inviteUrl, code },
                    },
                ],
                tags: { acquisition_app: 'untrusted-value' },
            },
            'skarp'
        )

        const serialized = JSON.stringify(sanitized)
        for (const secret of [code, email, uid, inviteUrl, 'source=']) {
            expect(serialized).not.toContain(secret)
        }
        expect(sanitized.tags).toMatchObject({
            feature: 'acquisition-web',
            acquisition_app: 'skarp',
        })
    })

    test('keeps ordinary URLs useful while removing query and fragment data', () => {
        expect(
            redactTelemetryString(
                'GET https://example.test/path?token=secret#private failed'
            )
        ).toBe('GET https://example.test/path failed')
        expect(
            redactTelemetryString('/krydda/invite/A2B3C4D5E6F7?x=1#frag')
        ).toBe('/krydda/invite/[redacted]')
    })

    test('builds production options with mandatory safe defaults and no replay', () => {
        const options = buildSentryOptions({
            dsn: '',
            isProduction: true,
            release: 'jacobhal-se@abc123',
        })

        expect(options).toMatchObject({
            dsn: FALLBACK_SENTRY_DSN,
            enabled: true,
            environment: 'prod',
            release: 'jacobhal-se@abc123',
            sendDefaultPii: false,
            tracesSampleRate: 0.02,
        })
        expect(options.replaysSessionSampleRate).toBeUndefined()
        expect(options.replaysOnErrorSampleRate).toBeUndefined()
        expect(options.integrations).toEqual([{ name: 'BrowserTracing' }])
        expect(options.beforeSend).toBeTypeOf('function')
        expect(options.beforeSendTransaction).toBeTypeOf('function')
        expect(options.beforeBreadcrumb).toBeTypeOf('function')
    })

    test('initialization cannot be silently disabled by a missing Azure DSN', () => {
        initAcquisitionTelemetry()

        expect(sentry.init).toHaveBeenCalledOnce()
        expect(sentry.init.mock.calls[0][0].dsn).toBe(FALLBACK_SENTRY_DSN)
        expect(sentry.init.mock.calls[0][0].sendDefaultPii).toBe(false)
    })

    test('failure capture passes only low-cardinality sanitized context', () => {
        captureAcquisitionFailure(
            new Error(
                'ABC234XYZ789 person@example.test https://jacobhal.se/skarp/invite/ABC234XYZ789?token=secret'
            ),
            {
                app: 'skarp',
                stage: 'clipboard',
            }
        )

        expect(sentry.captureException).toHaveBeenCalledOnce()
        expect(sentry.captureException.mock.calls[0][0].message).toBe(
            'Acquisition operation failed (Error)'
        )
        const serialized = JSON.stringify(sentry.captureException.mock.calls[0])
        expect(serialized).toContain('clipboard')
        for (const secret of [
            'ABC234XYZ789',
            'person@example.test',
            'token=secret',
        ]) {
            expect(serialized).not.toContain(secret)
        }
    })

    test('funnel breadcrumbs contain only typed dimensions', () => {
        recordAcquisitionBreadcrumb({
            app: 'krydda',
            stage: 'store_navigation',
            outcome: 'started',
            store: 'google_play',
        })

        expect(sentry.addBreadcrumb).toHaveBeenCalledWith({
            category: 'acquisition-web',
            level: 'info',
            message: 'acquisition.store_navigation',
            data: {
                acquisition_app: 'krydda',
                outcome: 'started',
                store: 'google_play',
            },
        })
    })

    test('root error boundary applies stable acquisition tags', () => {
        const scope = { setTag: vi.fn() }

        tagAcquisitionErrorScope(scope, '/krydda/invite/A2B3C4D5E6F7')

        expect(scope.setTag).toHaveBeenCalledWith('feature', 'acquisition-web')
        expect(scope.setTag).toHaveBeenCalledWith(
            'acquisition_app',
            'krydda'
        )
        expect(JSON.stringify(scope.setTag.mock.calls)).not.toContain(
            'A2B3C4D5E6F7'
        )
    })
})
