import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { ui } from '~/lib/ui'

// The three non-data states every screen has, so they all look the same.
// `fill` centres in the whole screen (nothing else rendered yet); without it
// the state sits under whatever header/filters are already on screen.

export function Loading({ fill = false }: { fill?: boolean }) {
    return <ActivityIndicator style={fill ? ui.center : ui.content} accessibilityLabel="Loading" />
}

export function Empty({ message, fill = false }: { message: string; fill?: boolean }) {
    return (
        <View style={fill ? ui.center : ui.content}>
            <Text style={ui.muted}>{message}</Text>
        </View>
    )
}

export function ErrorState({
    message,
    onRetry,
    fill = false,
}: {
    message: string
    onRetry?: () => void
    fill?: boolean
}) {
    return (
        <View style={fill ? ui.center : ui.content} accessibilityRole="alert">
            <Text style={ui.error}>{message}</Text>
            {onRetry ? (
                <Pressable onPress={onRetry} accessibilityRole="button" accessibilityLabel="Retry">
                    <Text style={ui.link}>Retry</Text>
                </Pressable>
            ) : null}
        </View>
    )
}
