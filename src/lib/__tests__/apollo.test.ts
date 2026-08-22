import { ApolloClient, ApolloLink, InMemoryCache, gql } from '@apollo/client'
import { Observable } from '@apollo/client/utilities'
import { authLink, errorLink } from '../apollo'
import { refreshSession } from '../session'
import { clearTokens, setAccessToken } from '../tokenStore'

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(async () => null),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}))
jest.mock('../session', () => ({ apiUrl: 'http://api.test/graphql', refreshSession: jest.fn() }))

const QUERY = gql`
    query Me {
        me {
            id
        }
    }
`
const UNAUTHENTICATED = { message: 'Not signed in', extensions: { code: 'UNAUTHENTICATED' } }

// A terminating link that records each request's auth header and answers from a script.
function fakeServer(script: ((n: number) => object)[]) {
    const seen: (string | undefined)[] = []
    let n = 0
    const link = new ApolloLink((op) => {
        seen.push(op.getContext().headers?.authorization)
        const reply = script[Math.min(n, script.length - 1)](n++)
        return new Observable((o) => {
            o.next(reply)
            o.complete()
        })
    })
    const client = new ApolloClient({
        link: ApolloLink.from([errorLink, authLink, link]),
        cache: new InMemoryCache(),
    })
    return { client, seen, calls: () => n }
}

const data = { data: { me: { __typename: 'Account', id: 1 } } }
const fresh = () => setAccessToken('fresh', Date.now() + 900_000)

beforeEach(async () => {
    await clearTokens()
    jest.mocked(refreshSession).mockReset()
})

it('attaches the in-memory access token', async () => {
    fresh()
    const { client, seen } = fakeServer([() => data])
    await client.query({ query: QUERY, fetchPolicy: 'network-only' })
    expect(seen).toEqual(['Bearer fresh'])
    expect(refreshSession).not.toHaveBeenCalled()
})

it('refreshes ahead of expiry when the access token is stale', async () => {
    jest.mocked(refreshSession).mockImplementation(async () => {
        fresh()
        return true
    })
    const { client, seen } = fakeServer([() => data])
    await client.query({ query: QUERY, fetchPolicy: 'network-only' })
    expect(refreshSession).toHaveBeenCalledTimes(1)
    expect(seen).toEqual(['Bearer fresh'])
})

it('refreshes once and replays the operation on UNAUTHENTICATED', async () => {
    setAccessToken('revoked', Date.now() + 900_000)
    jest.mocked(refreshSession).mockImplementation(async () => {
        fresh()
        return true
    })
    const { client, seen } = fakeServer([() => ({ errors: [UNAUTHENTICATED] }), () => data])
    const res = await client.query({ query: QUERY, fetchPolicy: 'network-only' })
    expect(res.data).toEqual(data.data)
    expect(refreshSession).toHaveBeenCalledTimes(1)
    expect(seen).toEqual(['Bearer revoked', 'Bearer fresh'])
})

it('surfaces the error, without looping, when the refresh fails', async () => {
    setAccessToken('revoked', Date.now() + 900_000)
    jest.mocked(refreshSession).mockResolvedValue(false)
    const { client, calls } = fakeServer([() => ({ errors: [UNAUTHENTICATED] })])
    await expect(client.query({ query: QUERY, fetchPolicy: 'network-only' })).rejects.toThrow(
        'Not signed in',
    )
    expect(calls()).toBe(1)
})

it('leaves other errors alone', async () => {
    fresh()
    const { client } = fakeServer([
        () => ({ errors: [{ message: 'Nope', extensions: { code: 'FORBIDDEN' } }] }),
    ])
    await expect(client.query({ query: QUERY, fetchPolicy: 'network-only' })).rejects.toThrow(
        'Nope',
    )
    expect(refreshSession).not.toHaveBeenCalled()
})
