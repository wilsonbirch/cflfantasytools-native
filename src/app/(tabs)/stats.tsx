import { useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native'
import SeasonFilter, { CURRENT_YEAR } from '~/components/SeasonFilter'
import Table from '~/components/Table'
import { graphql } from '~/generated'
import type { PlayerSeasonStatsQuery } from '~/generated/graphql'
import { colors, ui } from '~/lib/ui'

const SEASON = graphql(`
    query PlayerSeasonStats($year: Int!, $teamSlug: String) {
        playerSeasonStats(year: $year, teamSlug: $teamSlug, limit: 100) {
            player
            games
            team {
                id
                abbreviation
            }
            passAttempts
            completions
            passingYards
            passingTouchdowns
            interceptions
            rushAttempts
            rushingYards
            rushingTouchdowns
            targets
            receptions
            receivingYards
            receivingTouchdowns
            epa
        }
    }
`)

type Row = PlayerSeasonStatsQuery['playerSeasonStats'][number]

// One leaderboard per category; rows are sorted client-side by that
// category's yards (EPA for EPA) and filtered to players who took part.
export const CATEGORIES = {
    Passing: {
        head: ['Player', 'G', 'C/A', 'Yds', 'TD', 'INT'],
        key: (r: Row) => r.passingYards,
        has: (r: Row) => r.passAttempts > 0,
        row: (r: Row) => [
            r.games,
            `${r.completions}/${r.passAttempts}`,
            r.passingYards,
            r.passingTouchdowns,
            r.interceptions,
        ],
    },
    Rushing: {
        head: ['Player', 'G', 'Att', 'Yds', 'TD'],
        key: (r: Row) => r.rushingYards,
        has: (r: Row) => r.rushAttempts > 0,
        row: (r: Row) => [r.games, r.rushAttempts, r.rushingYards, r.rushingTouchdowns],
    },
    Receiving: {
        head: ['Player', 'G', 'Tgt', 'Rec', 'Yds', 'TD'],
        key: (r: Row) => r.receivingYards,
        has: (r: Row) => r.targets > 0,
        row: (r: Row) => [
            r.games,
            r.targets,
            r.receptions,
            r.receivingYards,
            r.receivingTouchdowns,
        ],
    },
    EPA: {
        head: ['Player', 'G', 'EPA'],
        key: (r: Row) => r.epa,
        has: () => true,
        row: (r: Row) => [r.games, r.epa],
    },
}
type Category = keyof typeof CATEGORIES

export default function Stats() {
    const [year, setYear] = useState(CURRENT_YEAR)
    const [teamSlug, setTeamSlug] = useState<string | null>(null)
    const [category, setCategory] = useState<Category>('Receiving')
    const { data, loading, error } = useQuery(SEASON, { variables: { year, teamSlug } })
    const cat = CATEGORIES[category]
    const rows = [...(data?.playerSeasonStats ?? [])]
        .filter(cat.has)
        .sort((a, b) => cat.key(b) - cat.key(a))

    return (
        <ScrollView style={ui.screen} stickyHeaderIndices={[0]}>
            <View style={{ backgroundColor: colors.bg }}>
                <SeasonFilter
                    year={year}
                    onYear={setYear}
                    teamSlug={teamSlug}
                    onTeam={setTeamSlug}
                />
                <View style={styles.tabs}>
                    {(Object.keys(CATEGORIES) as Category[]).map((c) => (
                        <Pressable
                            key={c}
                            onPress={() => setCategory(c)}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: c === category }}
                            accessibilityLabel={`${c} leaders`}
                        >
                            <Text style={[ui.text, c === category && styles.on]}>{c}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
            {loading ? (
                <ActivityIndicator />
            ) : error ? (
                <Text style={[ui.error, ui.content]}>Could not load stats.</Text>
            ) : rows.length === 0 ? (
                <Text style={[ui.muted, ui.content]}>No parsed games this season.</Text>
            ) : (
                <Table
                    head={cat.head}
                    rows={rows.map((r) => [
                        teamSlug ? r.player : `${r.player} (${r.team.abbreviation})`,
                        ...cat.row(r),
                    ])}
                />
            )}
        </ScrollView>
    )
}

const styles = {
    tabs: { flexDirection: 'row', gap: 20, paddingHorizontal: 16, paddingBottom: 8 },
    on: { color: colors.accent, fontWeight: '600' },
} as const
