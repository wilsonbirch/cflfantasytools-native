import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import Constants from 'expo-constants'
import { getAccessToken } from './tokenStore'

// Simulators and devices cannot reach "localhost", so the api URL is
// configuration rather than a constant.
const uri =
    (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
    process.env.EXPO_PUBLIC_API_URL ??
    'http://localhost:4000/graphql'

const httpLink = new HttpLink({ uri })

const authLink = setContext((_, { headers }) => {
    const token = getAccessToken()
    return { headers: token ? { ...headers, authorization: `Bearer ${token}` } : headers }
})

// TODO(phase 2): add an error link that performs a single-flight refresh on
// UNAUTHENTICATED and replays the operation once. It is deliberately absent
// until the api exposes the `refresh` mutation — codegen would reject a
// document referencing an operation the schema does not have.
export const apolloClient = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
})
