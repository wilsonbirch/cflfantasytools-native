import { useApolloClient, useMutation, useQuery } from '@apollo/client/react'
import { Link } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import ScreenHeader from '~/components/ScreenHeader'
import { Loading } from '~/components/State'
import { graphql } from '~/generated'
import { clearTokens, getRefreshToken } from '~/lib/tokenStore'
import { ui } from '~/lib/ui'

const ME = graphql(`
    query Me {
        me {
            id
            email
            role
        }
    }
`)

const LOGOUT = graphql(`
    mutation Logout($refreshToken: String!) {
        logout(refreshToken: $refreshToken)
    }
`)

export default function Account() {
    const client = useApolloClient()
    const { data, loading } = useQuery(ME)
    const [logout, { loading: signingOut }] = useMutation(LOGOUT)

    async function signOut() {
        const refreshToken = await getRefreshToken()
        // Best effort: the server session is revoked if reachable, but local
        // tokens are cleared either way.
        if (refreshToken) await logout({ variables: { refreshToken } }).catch(() => undefined)
        await clearTokens()
        await client.resetStore()
    }

    if (loading) return <Loading fill />

    return (
        <View style={ui.screen}>
            <ScreenHeader title="Account" context={data?.me ? 'Signed in' : 'Signed out'} />
            {data?.me ? (
                <View style={ui.content}>
                    <Text style={ui.title}>{data.me.email}</Text>
                    <Text style={ui.muted}>{data.me.role === 'ADMIN' ? 'Admin' : 'Member'}</Text>
                    <Pressable
                        style={ui.button}
                        onPress={signOut}
                        disabled={signingOut}
                        accessibilityRole="button"
                        accessibilityLabel="Sign out"
                    >
                        <Text style={ui.buttonText}>Sign out</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={ui.content}>
                    <Text style={ui.text}>Sign in to subscribe to depth-chart alerts.</Text>
                    <Link href="/login" style={ui.link} accessibilityRole="link">
                        Sign in
                    </Link>
                    <Link href="/register" style={ui.link} accessibilityRole="link">
                        Create account
                    </Link>
                </View>
            )}
            <View style={ui.content}>
                <Link href="/status" style={ui.link} accessibilityRole="link">
                    Data status
                </Link>
            </View>
        </View>
    )
}
