import { useQuery } from '@apollo/client/react'
import { Stack, useLocalSearchParams } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from 'react-native'
import SubscribeToggle from '~/components/SubscribeToggle'
import { graphql } from '~/generated'
import { colors, fmtDate, ui } from '~/lib/ui'

const TEAM = graphql(`
    query Team($slug: String!) {
        team(slug: $slug) {
            id
            name
        }
        depthChartYears(teamSlug: $slug)
    }
`)

const CHARTS = graphql(`
    query DepthChartLists($slug: String!, $year: Int!) {
        depthChartLists(teamSlug: $slug, year: $year) {
            id
            year
            charts {
                id
                title
                week
                season
                publishedAt
                url
            }
        }
    }
`)

export default function TeamScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>()
    const { data, loading } = useQuery(TEAM, { variables: { slug } })
    // Years arrive newest first; the newest is the one people want.
    const [picked, setPicked] = useState<number>()
    const years = data?.depthChartYears ?? []
    const year = picked ?? years[0]
    const charts = useQuery(CHARTS, { variables: { slug, year: year! }, skip: year == null })

    if (loading) return <ActivityIndicator style={ui.center} />
    if (!data?.team)
        return (
            <View style={ui.center}>
                <Text style={ui.error}>Team not found.</Text>
            </View>
        )

    return (
        <View style={ui.screen}>
            <Stack.Screen options={{ title: data.team.name }} />
            <View style={ui.content}>
                <SubscribeToggle teamSlug={slug} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {years.map((y) => (
                        <Pressable
                            key={y}
                            onPress={() => setPicked(y)}
                            style={[styles.chip, y === year && styles.chipOn]}
                            accessibilityRole="button"
                            accessibilityState={{ selected: y === year }}
                            accessibilityLabel={`${y} depth charts`}
                        >
                            <Text style={ui.text}>{y}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
            {charts.loading ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                    data={charts.data?.depthChartLists.flatMap((l) => l.charts)}
                    keyExtractor={(c) => String(c.id)}
                    ListEmptyComponent={<Text style={[ui.muted, ui.content]}>No charts yet.</Text>}
                    renderItem={({ item }) => (
                        <Pressable
                            style={ui.row}
                            onPress={() => WebBrowser.openBrowserAsync(item.url)}
                            accessibilityRole="link"
                            accessibilityLabel={`Open ${item.title}`}
                        >
                            <View>
                                <Text style={ui.text}>{item.title}</Text>
                                <Text style={ui.muted}>
                                    {item.season} week {item.week}
                                </Text>
                            </View>
                            <Text style={ui.muted}>{fmtDate(item.publishedAt)}</Text>
                        </Pressable>
                    )}
                />
            )}
        </View>
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
} as const
