import { useQuery } from '@apollo/client/react'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useState } from 'react'
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native'
import { Empty, Loading } from '~/components/State'
import SubscribeToggle from '~/components/SubscribeToggle'
import { graphql } from '~/generated'
import type { DepthChartListsQuery } from '~/generated/graphql'
import { colors, fmtDate, teamColour, ui } from '~/lib/ui'

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
        team(slug: $slug) {
            id
            coachingStaff(year: $year) {
                id
                role
                person
                effectiveFrom
                effectiveTo
            }
        }
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
                files {
                    id
                    fetchedAt
                    size
                    url
                }
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

    if (loading) return <Loading fill />
    if (!data?.team) return <Empty message="Team not found." fill />

    return (
        <View style={ui.screen}>
            <Stack.Screen options={{ title: data.team.name }} />
            <View style={{ height: 3, backgroundColor: teamColour(slug) }} />
            <View style={ui.content}>
                <SubscribeToggle teamSlug={slug} />
                {year ? (
                    <Link
                        href={`/alignment/${slug}?year=${year}`}
                        style={ui.link}
                        accessibilityRole="link"
                        accessibilityLabel={`Receiver alignment ${year}`}
                    >
                        Receiver alignment {year} ›
                    </Link>
                ) : null}
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
                <Loading />
            ) : (
                <FlatList
                    data={charts.data?.depthChartLists.flatMap((l) => l.charts)}
                    keyExtractor={(c) => String(c.id)}
                    ListHeaderComponent={<Staff staff={charts.data?.team?.coachingStaff ?? []} />}
                    ListEmptyComponent={<Empty message="No charts yet." />}
                    renderItem={({ item }) => (
                        <View>
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
                                        {/* >1 archived copy means the club replaced the PDF
                                            at the same URL — the change href-diffing misses. */}
                                        {item.files.length > 1 ? ' · replaced at same URL' : ''}
                                    </Text>
                                </View>
                                <Text style={ui.muted}>{fmtDate(item.publishedAt)}</Text>
                            </Pressable>
                            {item.files.map((f) => (
                                <Pressable
                                    key={f.id}
                                    style={[ui.row, styles.file]}
                                    onPress={() => WebBrowser.openBrowserAsync(f.url)}
                                    accessibilityRole="link"
                                    accessibilityLabel={`Open archived copy from ${fmtDate(f.fetchedAt)}`}
                                >
                                    <Text style={ui.muted}>Archived {fmtDate(f.fetchedAt)}</Text>
                                    <Text style={ui.muted}>{Math.round(f.size / 1024)} KB</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                />
            )}
        </View>
    )
}

const ROLES = ['HC', 'OC', 'DC'] as const

// HC/OC/DC in post at any point in the selected season; a mid-season change
// shows both people with their dates.
function Staff({ staff }: { staff: NonNullable<DepthChartListsQuery['team']>['coachingStaff'] }) {
    if (staff.length === 0) return null
    const rows = ROLES.flatMap((role) => staff.filter((c) => c.role === role))
    return (
        <View accessibilityRole="list" accessibilityLabel="Coaching staff">
            <Text style={[ui.title, ui.content]}>Coaching staff</Text>
            {rows.map((c) => (
                <View key={c.id} style={ui.row}>
                    <Text style={ui.text}>
                        {c.role} {c.person}
                    </Text>
                    <Text style={ui.muted}>
                        {fmtDate(c.effectiveFrom)} –{' '}
                        {c.effectiveTo ? fmtDate(c.effectiveTo) : 'now'}
                    </Text>
                </View>
            ))}
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
    file: { paddingLeft: 32, paddingVertical: 8 },
} as const
