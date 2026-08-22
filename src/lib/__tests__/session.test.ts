import { router } from 'expo-router'
import { refreshSession, storeSession } from '../session'
import {
    accessTokenIsStale,
    clearTokens,
    getAccessToken,
    getRefreshToken,
    setRefreshToken,
} from '../tokenStore'

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
jest.mock('expo-router', () => ({ router: { replace: jest.fn() } }))

const fetchMock = jest.fn()
global.fetch = fetchMock as unknown as typeof fetch

// Unsigned JWT with only an `exp` claim — all the client ever reads.
const jwt = (expSeconds: number) =>
    `h.${btoa(JSON.stringify({ exp: expSeconds })).replace(/=+$/, '')}.s`

const okResponse = (refresh: unknown) => ({ json: async () => ({ data: { refresh } }) })

beforeEach(async () => {
    mockStore.clear()
    await clearTokens()
    fetchMock.mockReset()
    jest.mocked(router.replace).mockReset()
})

describe('storeSession', () => {
    it('reads the access token expiry off the JWT and keeps it out of storage', async () => {
        const token = jwt(Math.floor(Date.now() / 1000) + 900)
        await storeSession({ accessToken: token, refreshToken: 'r1' })
        expect(getAccessToken()).toBe(token)
        expect(accessTokenIsStale()).toBe(false)
        await expect(getRefreshToken()).resolves.toBe('r1')
        expect([...mockStore.values()]).not.toContain(token)
    })

    it('treats an already-expired JWT as stale', async () => {
        await storeSession({
            accessToken: jwt(Math.floor(Date.now() / 1000) - 10),
            refreshToken: 'r',
        })
        expect(accessTokenIsStale()).toBe(true)
    })
})

describe('refreshSession', () => {
    it('does nothing when signed out', async () => {
        await expect(refreshSession()).resolves.toBe(false)
        expect(fetchMock).not.toHaveBeenCalled()
        expect(router.replace).not.toHaveBeenCalled()
    })

    it('shares one in-flight refresh between concurrent callers and rotates the token', async () => {
        await setRefreshToken('r1')
        const token = jwt(Math.floor(Date.now() / 1000) + 900)
        fetchMock.mockResolvedValue(okResponse({ accessToken: token, refreshToken: 'r2' }))
        const results = await Promise.all([refreshSession(), refreshSession(), refreshSession()])
        expect(results).toEqual([true, true, true])
        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(JSON.parse(fetchMock.mock.calls[0][1].body).variables).toEqual({
            refreshToken: 'r1',
        })
        expect(getAccessToken()).toBe(token)
        await expect(getRefreshToken()).resolves.toBe('r2')
    })

    it('on rejection clears both tokens and routes to login', async () => {
        await setRefreshToken('r1')
        fetchMock.mockResolvedValue({ json: async () => ({ errors: [{ message: 'revoked' }] }) })
        await expect(refreshSession()).resolves.toBe(false)
        expect(getAccessToken()).toBeNull()
        await expect(getRefreshToken()).resolves.toBeNull()
        expect(router.replace).toHaveBeenCalledWith('/login')
    })

    it('treats a network failure like a rejection', async () => {
        await setRefreshToken('r1')
        fetchMock.mockRejectedValue(new Error('offline'))
        await expect(refreshSession()).resolves.toBe(false)
        expect(router.replace).toHaveBeenCalledWith('/login')
    })
})
