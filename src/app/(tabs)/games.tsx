import { useQuery } from '@apollo/client/react'
import { Link } from 'expo-router'
import { useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import ScreenHeader from '~/components/ScreenHeader'
import SeasonFilter, { useSeasons } from '~/components/SeasonFilter'
import { Empty, ErrorState, Loading } from '~/components/State'
import { graphql } from '~/generated'
import { accentRow, fmtDate, ui } from '~/lib/ui'

const GAMES = graphql(`
    query Games($year: Int!, $teamSlug: String) {
        games(year: $year, teamSlug: $teamSlug, limit: 200) {
            id
            date
            homeScore
            awayScore
            homeTeam {
                id
                slug
                abbreviation
            }
            awayTeam {
                id
                slug
                abbreviation
            }
        }
    }
`)

export default function Games() {
    const seasons = useSeasons()
    const [picked, setYear] = useState<number>()
    const year = picked ?? seasons[0]
    const [teamSlug, setTeamSlug] = useState<string | null>(null)
    const { data, loading, error, refetch } = useQuery(GAMES, {
        variables: { year: year ?? 0, teamSlug },
        skip: year === undefined,
    })

    const games = data?.games ?? []
    return (
        <FlatList
            style={ui.screen}
            data={loading ? [] : games}
            keyExtractor={(g) => String(g.id)}
            ListHeaderComponent={
                <ScreenHeader
                    title="Games"
                    context={`${year ?? '—'} season · ${games.length} parsed`}
                >
                    <SeasonFilter
                        seasons={seasons}
                        year={year}
                        onYear={setYear}
                        teamSlug={teamSlug}
                        onTeam={setTeamSlug}
                    />
                </ScreenHeader>
            }
            ListEmptyComponent={
                loading || year === undefined ? (
                    <Loading />
                ) : error ? (
                    <ErrorState message="Could not load games." onRetry={() => refetch()} />
                ) : (
                    <Empty message="No parsed games this season." />
                )
            }
            renderItem={({ item }) => {
                const away = item.awayTeam?.abbreviation ?? '?'
                const home = item.homeTeam?.abbreviation ?? '?'
                return (
                    <Link href={`/game/${item.id}`} asChild>
                        <Pressable
                            style={accentRow(item.homeTeam?.slug)}
                            accessibilityRole="button"
                            accessibilityLabel={`${away} at ${home}, ${item.awayScore ?? '-'} to ${item.homeScore ?? '-'}`}
                        >
                            <View>
                                <Text style={ui.text}>
                                    {away} @ {home}
                                </Text>
                                <Text style={ui.muted}>
                                    {item.date ? fmtDate(item.date) : 'Date unknown'}
                                </Text>
                            </View>
                            <Text style={ui.num}>
                                {item.awayScore ?? '–'} – {item.homeScore ?? '–'}
                            </Text>
                        </Pressable>
                    </Link>
                )
            }}
        />
    )
}
