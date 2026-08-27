import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { targetFor } from '../../../config/supabaseTargets'
import { normalizeRoomCode, parseLiveRoomState } from './liveRoomState'
import type { LiveAnswerPayload, LiveRoomState } from './liveRoomState'

let client: SupabaseClient | null = null

const skarpClient = (): SupabaseClient => {
    if (client) return client
    const target = targetFor('skarp')
    if (!target) throw new Error('Skarp live rooms are not configured.')
    client = createClient(target.url, target.anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    })
    return client
}

const tokenKey = (code: string): string => `skarp-live-room:${code}:token`

const newToken = (): string => {
    const bytes = crypto.getRandomValues(new Uint8Array(32))
    return Array.from(bytes, (value) =>
        value.toString(16).padStart(2, '0')
    ).join('')
}

export const storedRoomToken = (code: string): string | null => {
    try {
        return localStorage.getItem(tokenKey(code))
    } catch {
        return null
    }
}

const saveRoomToken = (code: string, token: string): void => {
    try {
        localStorage.setItem(tokenKey(code), token)
    } catch {
        // Private browsing can deny storage; the active tab still retains it.
    }
}

const rpcState = async (
    functionName: string,
    params: Record<string, unknown>
): Promise<LiveRoomState> => {
    const { data, error } = await skarpClient().rpc(functionName, params)
    if (error) throw error
    return parseLiveRoomState(data)
}

export const joinLiveRoom = async (
    rawCode: string,
    displayName: string
): Promise<{ state: LiveRoomState; token: string }> => {
    const code = normalizeRoomCode(rawCode)
    if (!code) throw new Error('Invalid room code.')
    const token = storedRoomToken(code) ?? newToken()
    const state = await rpcState('join_live_room', {
        p_code: code,
        p_display_name: displayName,
        p_participant_token: token,
    })
    saveRoomToken(code, token)
    return { state, token }
}

export const getLiveRoomState = (
    code: string,
    token: string
): Promise<LiveRoomState> =>
    rpcState('get_live_room_state', {
        p_code: code,
        p_participant_token: token,
    })

export const getLiveRoomDisplayState = (code: string): Promise<LiveRoomState> =>
    rpcState('get_live_room_display', { p_code: code })

export const submitLiveRoomAnswer = (
    code: string,
    token: string,
    answer: LiveAnswerPayload
): Promise<LiveRoomState> =>
    rpcState('submit_live_room_answer', {
        p_code: code,
        p_participant_token: token,
        p_answer: answer,
    })

export const liveQuestionImageUrl = (source?: string): string | undefined => {
    if (!source) return undefined
    if (/^https?:\/\//.test(source)) return source
    const match = /^storage:\/\/([^/]+)\/(.+)$/.exec(source)
    const target = targetFor('skarp')
    if (!match || !target) return undefined
    return `${target.url}/storage/v1/object/public/${match[1]}/${match[2]}`
}
