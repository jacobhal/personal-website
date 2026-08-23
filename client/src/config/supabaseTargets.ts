import type { AcquisitionApp } from '../services/acquisitionTelemetry'

/**
 * One Supabase project per app.
 *
 * Skarp's marketing events live in the Skarp project and Krydda's in the Krydda
 * project, beside each app's own `auth.users`. That is what lets /stats report
 * real user counts next to the ad numbers without any cross-project query — the
 * page asks each project for its own figures and labels them.
 *
 * The anon keys are public by design. The events table is insert-only for them,
 * and every read goes through a passphrase-gated SECURITY DEFINER function.
 */
export interface SupabaseTarget {
    url: string
    anonKey: string
}

const target = (url: string, anonKey: string): SupabaseTarget => ({
    url: url.trim().replace(/\/+$/, ''),
    anonKey: anonKey.trim(),
})

const TARGETS: Record<AcquisitionApp, SupabaseTarget> = {
    skarp: target(
        import.meta.env.VITE_SUPABASE_SKARP_URL ?? '',
        import.meta.env.VITE_SUPABASE_SKARP_ANON_KEY ?? ''
    ),
    krydda: target(
        import.meta.env.VITE_SUPABASE_KRYDDA_URL ?? '',
        import.meta.env.VITE_SUPABASE_KRYDDA_ANON_KEY ?? ''
    ),
}

export const isTargetConfigured = (app: AcquisitionApp): boolean =>
    TARGETS[app].url.length > 0 && TARGETS[app].anonKey.length > 0

/** Null rather than a throw: an unconfigured app records nothing and the
 *  download buttons keep working. */
export const targetFor = (app: AcquisitionApp): SupabaseTarget | null =>
    isTargetConfigured(app) ? TARGETS[app] : null

export const configuredApps = (): AcquisitionApp[] =>
    (Object.keys(TARGETS) as AcquisitionApp[]).filter(isTargetConfigured)
