import { useApolloClient, useMutation } from '@apollo/client/react'
import { Link, router } from 'expo-router'
import { Text, View } from 'react-native'
import AuthForm from '~/components/AuthForm'
import { graphql } from '~/generated'
import { storeSession } from '~/lib/session'
import { ui } from '~/lib/ui'

const REGISTER = graphql(`
    mutation Register($email: String!, $password: String!) {
        register(email: $email, password: $password) {
            accessToken
            refreshToken
        }
    }
`)

export default function Register() {
    const client = useApolloClient()
    const [register] = useMutation(REGISTER)

    async function onSubmit(email: string, password: string) {
        const { data } = await register({ variables: { email, password } })
        if (!data) throw new Error('Registration failed.')
        await storeSession(data.register)
        await client.resetStore()
        router.replace('/(tabs)/account')
    }

    return (
        <View style={ui.screen}>
            <AuthForm mode="register" onSubmit={onSubmit} />
            <View style={ui.content}>
                <Text style={ui.muted}>
                    Already have an account?{' '}
                    <Link href="/login" replace style={ui.link}>
                        Sign in
                    </Link>
                </Text>
            </View>
        </View>
    )
}
