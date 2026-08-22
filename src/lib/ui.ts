import { StyleSheet } from 'react-native'

// One dark palette for every screen; app.json pins userInterfaceStyle to dark.
export const colors = {
    bg: '#0b0b0f',
    card: '#16161d',
    border: '#26262f',
    text: '#fff',
    muted: '#9a9aa5',
    accent: '#e03a3e',
    danger: '#ff6b6b',
}

export const ui = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    content: { padding: 16, gap: 12 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
    title: { fontSize: 22, fontWeight: '600', color: colors.text },
    text: { fontSize: 15, color: colors.text },
    muted: { fontSize: 13, color: colors.muted },
    error: { fontSize: 13, color: colors.danger },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        color: colors.text,
        backgroundColor: colors.card,
    },
    button: {
        backgroundColor: colors.accent,
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
    },
    buttonText: { color: colors.text, fontWeight: '600', fontSize: 16 },
    link: { color: colors.accent, fontSize: 15 },
})

export const fmtDate = (iso: string): string =>
    new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
