import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { ui } from '~/lib/ui'

type Props = {
    mode: 'login' | 'register'
    onSubmit: (email: string, password: string) => Promise<void>
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validate(mode: Props['mode'], email: string, password: string): string | null {
    if (!EMAIL.test(email.trim())) return 'Enter a valid email address.'
    if (!password) return 'Enter your password.'
    if (mode === 'register' && password.length < 8) return 'Password must be at least 8 characters.'
    return null
}

export default function AuthForm({ mode, onSubmit }: Props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)
    const cta = mode === 'login' ? 'Sign in' : 'Create account'

    async function submit() {
        const problem = validate(mode, email, password)
        if (problem) return setError(problem)
        setError(null)
        setBusy(true)
        try {
            await onSubmit(email.trim(), password)
        } catch (e) {
            // Apollo's message is the api's ("Invalid email or password"); it is
            // safe to show and never contains a token.
            setError(e instanceof Error ? e.message : 'Something went wrong.')
        } finally {
            setBusy(false)
        }
    }

    return (
        <View style={ui.content}>
            <TextInput
                style={ui.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#777"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                accessibilityLabel="Email"
            />
            <TextInput
                style={ui.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#777"
                secureTextEntry
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                textContentType={mode === 'login' ? 'password' : 'newPassword'}
                accessibilityLabel="Password"
                onSubmitEditing={submit}
            />
            {error ? (
                <Text style={ui.error} accessibilityRole="alert">
                    {error}
                </Text>
            ) : null}
            <Pressable
                style={ui.button}
                onPress={submit}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel={cta}
            >
                <Text style={ui.buttonText}>{busy ? 'Please wait…' : cta}</Text>
            </Pressable>
        </View>
    )
}
