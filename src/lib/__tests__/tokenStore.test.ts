import {
    accessTokenIsStale,
    clearTokens,
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
} from '../tokenStore'

// jest.mock is hoisted above this file's top-level code, so the factory may only
// reference variables whose names begin with `mock`.
const mockStore = new Map<string, string>()

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(async (k: string) => mockStore.get(k) ?? null),
    setItemAsync: jest.fn(async (k: string, v: string) => {
        mockStore.set(k, v)
    }),
    deleteItemAsync: jest.fn(async (k: string) => {
        mockStore.delete(k)
    }),
}))

beforeEach(async () => {
    mockStore.clear()
    await clearTokens()
})

describe('access token', () => {
    it('is held in memory only, never persisted', async () => {
        setAccessToken('access-abc', Date.now() + 900_000)
        expect(getAccessToken()).toBe('access-abc')
        // Nothing about the access token should reach the keychain.
        expect([...mockStore.values()]).not.toContain('access-abc')
    })

    it('is stale when absent', () => {
        expect(accessTokenIsStale()).toBe(true)
    })

    it('is fresh well before expiry', () => {
        setAccessToken('t', Date.now() + 900_000)
        expect(accessTokenIsStale()).toBe(false)
    })

    it('is stale inside the refresh skew, so it refreshes before expiring mid-flight', () => {
        setAccessToken('t', Date.now() + 30_000)
        expect(accessTokenIsStale(60_000)).toBe(true)
    })
})

describe('refresh token', () => {
    it('round-trips through secure storage', async () => {
        await setRefreshToken('refresh-xyz')
        await expect(getRefreshToken()).resolves.toBe('refresh-xyz')
    })
})

describe('sign out', () => {
    it('clears both tokens', async () => {
        setAccessToken('a', Date.now() + 900_000)
        await setRefreshToken('r')
        await clearTokens()
        expect(getAccessToken()).toBeNull()
        await expect(getRefreshToken()).resolves.toBeNull()
    })
})
