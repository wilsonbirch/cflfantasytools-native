import { StyleSheet, Text, View } from 'react-native'
import { fmt, type Cell } from '~/components/Table'
import { colors } from '~/lib/ui'

export type Tile = { label: string; value: Cell; hint?: string; tone?: 'good' | 'bad' }

// A row of compact number tiles — the headline figures above a table.
export default function StatTiles({ tiles }: { tiles: Tile[] }) {
    return (
        <View style={styles.row}>
            {tiles.map((t) => (
                <View
                    key={t.label}
                    style={styles.tile}
                    accessibilityLabel={`${t.label}: ${fmt(t.value)}${t.hint ? `, ${t.hint}` : ''}`}
                >
                    <Text style={styles.label} numberOfLines={1}>
                        {t.label}
                    </Text>
                    <Text
                        style={[
                            styles.value,
                            t.tone === 'good' && { color: colors.good },
                            t.tone === 'bad' && { color: colors.danger },
                        ]}
                        numberOfLines={1}
                    >
                        {fmt(t.value)}
                    </Text>
                    {t.hint ? (
                        <Text style={styles.hint} numberOfLines={1}>
                            {t.hint}
                        </Text>
                    ) : null}
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
    tile: {
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
        gap: 2,
    },
    label: { color: colors.muted, fontSize: 11, textTransform: 'uppercase' },
    value: { color: colors.text, fontSize: 20, fontWeight: '700', fontVariant: ['tabular-nums'] },
    hint: { color: colors.muted, fontSize: 11, fontVariant: ['tabular-nums'] },
})
