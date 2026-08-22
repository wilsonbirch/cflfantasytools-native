import { ApolloProvider } from '@apollo/client/react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { apolloClient } from '~/lib/apollo'
import { colors } from '~/lib/ui'

export default function RootLayout() {
    return (
        <ApolloProvider client={apolloClient}>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: colors.bg },
                    headerTintColor: colors.text,
                    contentStyle: { backgroundColor: colors.bg },
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="team/[slug]" options={{ title: 'Team' }} />
                <Stack.Screen name="game/[id]" options={{ title: 'Game' }} />
                <Stack.Screen name="login" options={{ title: 'Sign in', presentation: 'modal' }} />
                <Stack.Screen
                    name="register"
                    options={{ title: 'Create account', presentation: 'modal' }}
                />
            </Stack>
        </ApolloProvider>
    )
}
