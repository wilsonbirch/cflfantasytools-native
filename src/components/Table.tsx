import { StyleSheet, Text, View } from 'react-native'
import { colors } from '~/lib/ui'

type Cell = string | number | null | undefined

// Plain stat table: first column is the label and flexes, the rest are
// fixed-width numeric columns. No chart library, by design.
export default function Table({
    title,
    head,
    rows,
    caption,
}: {
    title?: string
    head: string[]
    rows: Cell[][]
    caption?: string
}) {
    if (rows.length === 0) return null
    return (
        <View style={styles.table} accessibilityRole="list" accessibilityLabel={title}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            <Row cells={head} header />
            {rows.map((r, i) => (
                <Row key={i} cells={r} />
            ))}
            {caption ? <Text style={styles.caption}>{caption}</Text> : null}
        </View>
    )
}

function Row({ cells, header = false }: { cells: Cell[]; header?: boolean }) {
    return (
        <View style={styles.row}>
            {cells.map((c, i) => (
                <Text
                    key={i}
                    numberOfLines={1}
                    style={[
                        i === 0 ? styles.label : styles.num,
                        header && styles.head,
                        cells.length > 5 && i > 0 && styles.narrow,
                    ]}
                >
                    {fmt(c)}
                </Text>
            ))}
        </View>
    )
}

export const fmt = (c: Cell): string =>
    typeof c === 'number' ? (Number.isInteger(c) ? String(c) : c.toFixed(1)) : (c ?? '–')

const styles = StyleSheet.create({
    table: { paddingHorizontal: 16, paddingBottom: 16 },
    title: { color: colors.text, fontSize: 16, fontWeight: '600', paddingVertical: 8 },
    caption: { color: colors.muted, fontSize: 12, paddingTop: 6 },
    row: {
        flexDirection: 'row',
        paddingVertical: 6,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    label: { flex: 1, color: colors.text, fontSize: 14 },
    num: {
        width: 52,
        textAlign: 'right',
        color: colors.text,
        fontSize: 14,
        fontVariant: ['tabular-nums'],
    },
    narrow: { width: 40 },
    head: { color: colors.muted, fontSize: 12 },
})
