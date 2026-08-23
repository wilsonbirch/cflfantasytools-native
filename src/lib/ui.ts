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
    good: '#4cc38a',
}

// One primary colour per club, keyed by the api's team slug. Used as an accent
// (left border, chip) next to the club, never as a text colour.
const TEAM_COLOURS: Record<string, string> = {
    'bc-lions': '#f47920',
    'calgary-stampeders': '#c8102e',
    'edmonton-elks': '#2c5234',
    'saskatchewan-roughriders': '#006341',
    'winnipeg-blue-bombers': '#1d3a7a',
    'hamilton-tiger-cats': '#ffb81c',
    'toronto-argonauts': '#5f8fb4',
    'ottawa-redblacks': '#a6192e',
    'montreal-alouettes': '#8b2332',
}
export const teamColour = (slug: string | null | undefined): string =>
    (slug && TEAM_COLOURS[slug]) || colors.border

export const ui = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    content: { padding: 16, gap: 12 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
    title: { fontSize: 22, fontWeight: '600', color: colors.text },
    text: { fontSize: 15, color: colors.text },
    muted: { fontSize: 13, color: colors.muted },
    num: { fontSize: 15, color: colors.text, fontVariant: ['tabular-nums'] },
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

// A list row with the club's colour down its left edge. Flattened because
// expo-router's <Link asChild> rejects style arrays on its child.
export const accentRow = (slug: string | null | undefined) =>
    StyleSheet.flatten([ui.row, { borderLeftWidth: 3, borderLeftColor: teamColour(slug) }])

export const fmtDate = (iso: string): string =>
    new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
