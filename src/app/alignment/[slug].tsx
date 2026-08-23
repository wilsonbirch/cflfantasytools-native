import { useQuery } from '@apollo/client/react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Empty, Loading } from '~/components/State'
import { graphql } from '~/generated'
import { colors, fmtDate, ui } from '~/lib/ui'

const ALIGNMENT = graphql(`
    query TeamAlignment($slug: String!, $year: Int!, $week: Int) {
        teamAlignment(teamSlug: $slug, year: $year, week: $week) {
            week
            weeks
            chart {
                id
                title
                publishedAt
            }
            positions {
                position
                depth
                jersey
                player
            }
        }
    }
`)

// Strong/field side first, then weak/boundary; numbers count OUTSIDE-IN, so
// 1S is the widest receiver on the strong side and 2WK the second from the
// outside on the weak side.
const side = (pos: string) => (pos.endsWith('WK') ? 1 : 0)
const byPosition = (a: string, b: string) =>
    side(a) - side(b) || parseInt(a, 10) - parseInt(b, 10) || a.localeCompare(b)

export default function AlignmentScreen() {
    const params = useLocalSearchParams<{ slug: string; year: string }>()
    const year = Number(params.year)
    const [week, setWeek] = useState<number>()
    const { data, loading } = useQuery(ALIGNMENT, {
        variables: { slug: params.slug, year, week },
    })
    const ta = data?.teamAlignment
    const weeks = ta?.weeks ?? []
    const positions = [...new Set(ta?.positions.map((p) => p.position))].sort(byPosition)

    return (
        <ScrollView style={ui.screen}>
            <Stack.Screen options={{ title: `Receiver alignment ${year}` }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ui.content}>
                {weeks.map((w) => (
                    <Pressable
                        key={w}
                        onPress={() => setWeek(w)}
                        style={[styles.chip, w === (week ?? ta?.week) && styles.chipOn]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: w === (week ?? ta?.week) }}
                        accessibilityLabel={`Week ${w}`}
                    >
                        <Text style={ui.text}>Wk {w}</Text>
                    </Pressable>
                ))}
            </ScrollView>
            {loading ? (
                <Loading />
            ) : !ta ? (
                <Empty message="No parsed chart for this season yet." />
            ) : (
                <View>
                    <Text style={[ui.muted, ui.content]}>
                        Week {ta.week} · {ta.chart.title} · {fmtDate(ta.chart.publishedAt)}
                    </Text>
                    {positions.map((pos) => (
                        <View key={pos} style={ui.row} accessibilityLabel={`${pos} depth`}>
                            <Text style={[ui.text, styles.pos]}>{pos}</Text>
                            <Text style={[ui.text, styles.players]}>
                                {ta.positions
                                    .filter((p) => p.position === pos)
                                    .sort((a, b) => a.depth - b.depth)
                                    .map((p) => (p.jersey ? `#${p.jersey} ${p.player}` : p.player))
                                    .join(' › ')}
                            </Text>
                        </View>
                    ))}
                    <Text style={[ui.muted, ui.content]}>
                        Positions count outside-in; S = strong/field side, WK = weak/boundary side.
                        Starter first, then second and third string.
                    </Text>
                </View>
            )}
        </ScrollView>
    )
}

const styles = {
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 16,
        backgroundColor: colors.card,
        marginRight: 8,
    },
    chipOn: { backgroundColor: colors.accent },
    pos: { width: 56, fontWeight: '600' },
    players: { flex: 1 },
} as const
