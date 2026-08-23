import { useApolloClient, useMutation } from '@apollo/client/react'
import { Link, router } from 'expo-router'
import { Text, View } from 'react-native'
import AuthForm from '~/components/AuthForm'
import { graphql } from '~/generated'
import { storeSession } from '~/lib/session'
import { ui } from '~/lib/ui'

const LOGIN = graphql(`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            accessToken
            accessTokenExpiresAt
            refreshToken
        }
    }
`)

export default function Login() {
    const client = useApolloClient()
    const [login] = useMutation(LOGIN)

    async function onSubmit(email: string, password: string) {
        const { data } = await login({ variables: { email, password } })
        if (!data) throw new Error('Sign in failed.')
        await storeSession(data.login)
        await client.resetStore()
        router.replace('/(tabs)/account')
    }

    return (
        <View style={ui.screen}>
            <AuthForm mode="login" onSubmit={onSubmit} />
            <View style={ui.content}>
                <Text style={ui.muted}>
                    New here?{' '}
                    <Link href="/register" replace style={ui.link}>
                        Create an account
                    </Link>
                </Text>
            </View>
        </View>
    )
}
