import * as SecureStore from 'expo-secure-store'

// The refresh token is long-lived and grants new access tokens, so it lives in
// the OS keychain/keystore rather than AsyncStorage. The access token is short
// lived and stays in memory only — never persisted.
const REFRESH_TOKEN_KEY = 'cflft.refreshToken'

let accessToken: string | null = null
let accessTokenExpiresAt = 0

export const getAccessToken = (): string | null => accessToken

export const setAccessToken = (token: string, expiresAt: number): void => {
    accessToken = token
    accessTokenExpiresAt = expiresAt
}

// Refresh slightly early: an expiry landing mid-flight would otherwise surface
// to the user as a spurious logout.
export const accessTokenIsStale = (skewMs = 60_000): boolean =>
    !accessToken || Date.now() >= accessTokenExpiresAt - skewMs

export const getRefreshToken = (): Promise<string | null> =>
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY)

export const setRefreshToken = (token: string): Promise<void> =>
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token)

export async function clearTokens(): Promise<void> {
    accessToken = null
    accessTokenExpiresAt = 0
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
}
