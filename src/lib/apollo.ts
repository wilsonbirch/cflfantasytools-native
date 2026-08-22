import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { CombinedGraphQLErrors, ServerError } from '@apollo/client/errors'
import { setContext } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import { Observable } from '@apollo/client/utilities'
import { apiUrl, refreshSession } from './session'
import { accessTokenIsStale, getAccessToken } from './tokenStore'

const httpLink = new HttpLink({ uri: apiUrl })

// Refresh ahead of expiry so a token dying mid-flight does not surface as a 401.
export const authLink = setContext(async (_, { headers }) => {
    if (accessTokenIsStale()) await refreshSession()
    const token = getAccessToken()
    return { headers: token ? { ...headers, authorization: `Bearer ${token}` } : headers }
})

const isUnauthenticated = (error: unknown): boolean =>
    (CombinedGraphQLErrors.is(error) &&
        error.errors.some((e) => e.extensions?.code === 'UNAUTHENTICATED')) ||
    (ServerError.is(error) && error.statusCode === 401)

// Refresh-on-401: one refresh (single-flight, see session.ts) then one replay.
// If the refresh fails, session.ts has already cleared tokens and routed to
// login, so the original error is simply passed through.
export const errorLink = new ErrorLink(({ error, operation, forward }) => {
    if (!isUnauthenticated(error) || operation.getContext().retried) return
    return new Observable((observer) => {
        refreshSession().then((ok) => {
            if (!ok) return observer.error(error)
            operation.setContext({ retried: true })
            forward(operation).subscribe(observer)
        })
    })
})

export const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
})
