import { useQuery } from '@apollo/client/react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import { graphql } from '~/generated'
import { colors, ui } from '~/lib/ui'

const JOB_HEALTH = graphql(`
    query JobHealth {
        jobHealth {
            kind
            isStale
            ageMinutes
            expectedEveryMinutes
            lastSuccessAt
        }
    }
`)

const age = (m: number | null | undefined) =>
    m == null ? 'never' : m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`

// Freshness of the scheduled jobs — the same jobHealth web shows.
export default function Status() {
    const { data, loading, error } = useQuery(JOB_HEALTH, { fetchPolicy: 'network-only' })
    if (loading) return <ActivityIndicator style={ui.center} />
    if (error)
        return (
            <View style={ui.center}>
                <Text style={ui.error}>Could not reach the api.</Text>
            </View>
        )
    return (
        <FlatList
            style={ui.screen}
            data={data?.jobHealth}
            keyExtractor={(j) => j.kind}
            renderItem={({ item }) => (
                <View
                    style={ui.row}
                    accessibilityLabel={`${item.kind}: ${item.isStale ? 'stale' : 'fresh'}, last success ${age(item.ageMinutes)}`}
                >
                    <View>
                        <Text style={ui.text}>{item.kind}</Text>
                        <Text style={ui.muted}>
                            last success {age(item.ageMinutes)} · expected every{' '}
                            {item.expectedEveryMinutes} min
                        </Text>
                    </View>
                    <Text style={{ color: item.isStale ? colors.danger : colors.muted }}>
                        {item.isStale ? 'Stale' : 'OK'}
                    </Text>
                </View>
            )}
        />
    )
}
