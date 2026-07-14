import * as Sentry from '@sentry/react'
import type { Breadcrumb, BrowserOptions, Event } from '@sentry/react'

export type AcquisitionApp = 'skarp' | 'krydda'
export type AcquisitionStage =
    | 'landing'
    | 'clipboard'
    | 'store_navigation'
    | 'render'
export type AcquisitionOutcome =
    | 'started'
    | 'succeeded'
    | 'failed'
    | 'valid'
    | 'invalid'
export type AcquisitionStore = 'app_store' | 'google_play'

export interface AcquisitionBreadcrumb {
    app: AcquisitionApp
    stage: AcquisitionStage
    outcome: AcquisitionOutcome
    store?: AcquisitionStore
}

export interface AcquisitionFailureContext {
    app: AcquisitionApp
    stage: AcquisitionStage
    store?: AcquisitionStore
}

export const FALLBACK_SENTRY_DSN =
    'https://fb160a79324135fe366f0225ecf4986b@o4511274459791360.ingest.de.sentry.io/4511734203023440'

const FEATURE_TAG = 'acquisition-web'
const INVITE_URL =
    /https?:\/\/[^\s"'<>]+\/(skarp|krydda)\/invite\/[^\s"'<>]+/gi
const INVITE_PATH =
    /\/(skarp|krydda)\/invite\/[^?\s#"'<>]+(?:\?[^#\s"'<>]*)?(?:#[^\s"'<>]*)?/gi
const HTTP_URL = /https?:\/\/[^\s"'<>]+/gi
const REFERRAL_CODE = /\b[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{12}\b/gi
const EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
const UUID =
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi

export const acquisitionAppFromPath = (
    pathname: string
): AcquisitionApp | null => {
    if (pathname === '/skarp' || pathname.startsWith('/skarp/')) return 'skarp'
    if (pathname === '/krydda' || pathname.startsWith('/krydda/')) {
        return 'krydda'
    }
    return null
}

/** Removes acquisition secrets while retaining enough shape to debug a fault. */
export const redactTelemetryString = (input: string): string =>
    input
        .replace(INVITE_URL, '[invite-url-redacted]')
        .replace(INVITE_PATH, (_match, app: string) =>
            `/${app.toLowerCase()}/invite/[redacted]`
        )
        .replace(HTTP_URL, (rawUrl) => {
            try {
                const parsed = new URL(rawUrl)
                parsed.search = ''
                parsed.hash = ''
                return parsed.toString()
            } catch {
                return '[url-redacted]'
            }
        })
        .replace(REFERRAL_CODE, '[code-redacted]')
        .replace(EMAIL, '[email-redacted]')
        .replace(UUID, '[id-redacted]')

const sanitizeTelemetryValue = (
    value: unknown,
    seen = new WeakSet<object>()
): unknown => {
    if (typeof value === 'string') return redactTelemetryString(value)
    if (
        value === null ||
        value === undefined ||
        typeof value === 'number' ||
        typeof value === 'boolean'
    ) {
        return value
    }
    if (Array.isArray(value)) {
        return value.map((item) => sanitizeTelemetryValue(item, seen))
    }
    if (typeof value !== 'object') return String(value)
    if (seen.has(value)) return '[circular-redacted]'
    seen.add(value)
    return Object.fromEntries(
        Object.entries(value).map(([key, nested]) => [
            key,
            sanitizeTelemetryValue(nested, seen),
        ])
    )
}

export const sanitizeSentryEvent = <T extends Event>(
    event: T,
    app: AcquisitionApp | null = currentAcquisitionApp()
): T => {
    const sanitized = sanitizeTelemetryValue(event) as T
    sanitized.tags = {
        ...sanitized.tags,
        feature: FEATURE_TAG,
        acquisition_app: app ?? 'none',
    }
    return sanitized
}

export const sanitizeSentryBreadcrumb = (
    breadcrumb: Breadcrumb
): Breadcrumb => sanitizeTelemetryValue(breadcrumb) as Breadcrumb

const currentAcquisitionApp = (): AcquisitionApp | null =>
    typeof window === 'undefined'
        ? null
        : acquisitionAppFromPath(window.location.pathname)

interface SentryOptionsInput {
    dsn: string
    isProduction: boolean
    release: string
}

export const buildSentryOptions = ({
    dsn,
    isProduction,
    release,
}: SentryOptionsInput): BrowserOptions => ({
    dsn: dsn.trim() || FALLBACK_SENTRY_DSN,
    enabled: isProduction,
    environment: isProduction ? 'prod' : 'development',
    release: release.trim() || 'jacobhal-se@local',
    sendDefaultPii: false,
    tracesSampleRate: isProduction ? 0.02 : 0,
    integrations: [Sentry.browserTracingIntegration()],
    initialScope: {
        tags: {
            feature: FEATURE_TAG,
            acquisition_app: currentAcquisitionApp() ?? 'none',
        },
    },
    beforeSend: (event) => sanitizeSentryEvent(event),
    beforeSendTransaction: (event) => sanitizeSentryEvent(event),
    beforeBreadcrumb: (breadcrumb) => sanitizeSentryBreadcrumb(breadcrumb),
})

export const initAcquisitionTelemetry = (): void => {
    Sentry.init(
        buildSentryOptions({
            dsn: import.meta.env.VITE_SENTRY_DSN ?? '',
            isProduction: import.meta.env.PROD,
            release:
                import.meta.env.VITE_SENTRY_RELEASE ?? 'jacobhal-se@local',
        })
    )
}

export const setAcquisitionApp = (app: AcquisitionApp): void => {
    Sentry.setTag('feature', FEATURE_TAG)
    Sentry.setTag('acquisition_app', app)
}

interface AcquisitionTagScope {
    setTag(key: string, value: string): unknown
}

export const tagAcquisitionErrorScope = (
    scope: AcquisitionTagScope,
    pathname = typeof window === 'undefined' ? '' : window.location.pathname
): void => {
    scope.setTag('feature', FEATURE_TAG)
    scope.setTag(
        'acquisition_app',
        acquisitionAppFromPath(pathname) ?? 'none'
    )
}

export const recordAcquisitionBreadcrumb = ({
    app,
    stage,
    outcome,
    store,
}: AcquisitionBreadcrumb): void => {
    setAcquisitionApp(app)
    Sentry.addBreadcrumb({
        category: FEATURE_TAG,
        level: 'info',
        message: `acquisition.${stage}`,
        data: {
            acquisition_app: app,
            outcome,
            ...(store === undefined ? {} : { store }),
        },
    })
}

const errorType = (error: unknown): string => {
    if (error instanceof TypeError) return 'TypeError'
    if (error instanceof RangeError) return 'RangeError'
    if (error instanceof ReferenceError) return 'ReferenceError'
    if (error instanceof SyntaxError) return 'SyntaxError'
    if (error instanceof URIError) return 'URIError'
    if (error instanceof EvalError) return 'EvalError'
    if (typeof DOMException !== 'undefined' && error instanceof DOMException) {
        return 'DOMException'
    }
    if (error instanceof Error) return 'Error'
    return typeof error === 'object' ? 'Object' : typeof error
}

class AcquisitionTelemetryError extends Error {
    constructor(type: string) {
        super(`Acquisition operation failed (${type})`)
        this.name = 'AcquisitionTelemetryError'
    }
}

export const captureAcquisitionFailure = (
    error: unknown,
    { app, stage, store }: AcquisitionFailureContext
): void => {
    const type = errorType(error)
    setAcquisitionApp(app)
    Sentry.captureException(new AcquisitionTelemetryError(type), {
        tags: {
            feature: FEATURE_TAG,
            acquisition_app: app,
            acquisition_stage: stage,
        },
        contexts: {
            acquisition: {
                outcome: 'failed',
                error_type: type,
                ...(store === undefined ? {} : { store }),
            },
        },
    })
}
