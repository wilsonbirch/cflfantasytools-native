import { useQuery } from '@apollo/client/react'
import { Link } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native'
import SeasonFilter, { useSeasons } from '~/components/SeasonFilter'
import { graphql } from '~/generated'
import { fmtDate, ui } from '~/lib/ui'

const GAMES = graphql(`
    query Games($year: Int!, $teamSlug: String) {
        games(year: $year, teamSlug: $teamSlug, limit: 200) {
            id
            date
            homeScore
            awayScore
            homeTeam {
                id
                abbreviation
            }
            awayTeam {
                id
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
    const { data, loading, error } = useQuery(GAMES, {
        variables: { year: year ?? 0, teamSlug },
        skip: year === undefined,
    })

    return (
        <View style={ui.screen}>
            <SeasonFilter
                seasons={seasons}
                year={year}
                onYear={setYear}
                teamSlug={teamSlug}
                onTeam={setTeamSlug}
            />
            {loading || year === undefined ? (
                <ActivityIndicator />
            ) : error ? (
                <Text style={[ui.error, ui.content]}>Could not load games.</Text>
            ) : (
                <FlatList
                    data={data?.games}
                    keyExtractor={(g) => String(g.id)}
                    ListEmptyComponent={
                        <Text style={[ui.muted, ui.content]}>No parsed games this season.</Text>
                    }
                    renderItem={({ item }) => {
                        const away = item.awayTeam?.abbreviation ?? '?'
                        const home = item.homeTeam?.abbreviation ?? '?'
                        return (
                            <Link href={`/game/${item.id}`} asChild>
                                <Pressable
                                    style={ui.row}
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
                                    <Text style={ui.text}>
                                        {item.awayScore ?? '–'} – {item.homeScore ?? '–'}
                                    </Text>
                                </Pressable>
                            </Link>
                        )
                    }}
                />
            )}
        </View>
    )
}
