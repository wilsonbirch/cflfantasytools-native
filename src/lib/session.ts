import Constants from 'expo-constants'
import { router } from 'expo-router'
import { print } from 'graphql'
import { graphql } from '~/generated'
import type { RefreshMutation } from '~/generated/graphql'
import { clearTokens, getRefreshToken, setAccessToken, setRefreshToken } from './tokenStore'

// Simulators and devices cannot reach "localhost", so the api URL is
// configuration rather than a constant.
export const apiUrl =
    (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
    process.env.EXPO_PUBLIC_API_URL ??
    'http://localhost:4000/graphql'

const REFRESH = graphql(`
    mutation Refresh($refreshToken: String!) {
        refresh(refreshToken: $refreshToken) {
            accessToken
            accessTokenExpiresAt
            refreshToken
        }
    }
`)

export async function storeSession(auth: {
    accessToken: string
    accessTokenExpiresAt: string
    refreshToken: string
}): Promise<void> {
    setAccessToken(auth.accessToken, Date.parse(auth.accessTokenExpiresAt))
    await setRefreshToken(auth.refreshToken)
}

// Refresh tokens are one-time use: a second concurrent refresh would present an
// already-rotated token and revoke the whole session. Share one in-flight
// refresh between every caller.
let inflight: Promise<boolean> | null = null

export function refreshSession(): Promise<boolean> {
    inflight ??= doRefresh().finally(() => {
        inflight = null
    })
    return inflight
}

async function doRefresh(): Promise<boolean> {
    const refreshToken = await getRefreshToken()
    if (!refreshToken) return false
    let auth: RefreshMutation['refresh'] | undefined
    try {
        // Plain fetch, deliberately outside the Apollo link chain: the chain
        // would otherwise refresh-on-401 the refresh itself.
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ query: print(REFRESH), variables: { refreshToken } }),
        })
        const json = (await res.json()) as { data?: RefreshMutation }
        auth = json.data?.refresh
    } catch {
        // Network failure: fall through to the sign-out below.
    }
    if (!auth) {
        await clearTokens()
        router.replace('/login')
        return false
    }
    await storeSession(auth)
    return true
}
