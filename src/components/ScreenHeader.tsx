import type { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '~/lib/ui'

// Dense tool-style header: title, a context line (season · week · source),
// and whatever filters the screen needs underneath. Replaces the native tab
// header so every tab reads the same way.
export default function ScreenHeader({
    title,
    context,
    accent,
    children,
}: {
    title: string
    context?: string
    // Team colour keyed by slug, shown as a bar under the title.
    accent?: string
    children?: ReactNode
}) {
    // Tabs hide the native header, so the screen header owns the top inset.
    const { top } = useSafeAreaInsets()
    return (
        <View style={[styles.wrap, { paddingTop: top + 12 }]} accessibilityRole="header">
            <Text style={styles.title}>{title}</Text>
            {context ? <Text style={styles.context}>{context}</Text> : null}
            {accent ? <View style={[styles.accent, { backgroundColor: accent }]} /> : null}
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: { paddingHorizontal: 16, paddingBottom: 8, gap: 4 },
    title: { color: colors.text, fontSize: 22, fontWeight: '700' },
    context: { color: colors.muted, fontSize: 13, fontVariant: ['tabular-nums'] },
    accent: { height: 3, width: 40, borderRadius: 2, marginTop: 2 },
})
