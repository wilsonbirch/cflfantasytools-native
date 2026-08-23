import { useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { Pressable, SectionList, Text, View } from 'react-native'
import ScreenHeader from '~/components/ScreenHeader'
import SeasonFilter, { useSeasons } from '~/components/SeasonFilter'
import { Empty, ErrorState, Loading } from '~/components/State'
import { nextSort, sortRows, TableHead, TableRow, type Cell, type Sort } from '~/components/Table'
import { graphql } from '~/generated'
import type { PlayerSeasonStatsQuery } from '~/generated/graphql'
import { colors, teamColour, ui } from '~/lib/ui'

const SEASON = graphql(`
    query PlayerSeasonStats($year: Int!, $teamSlug: String) {
        playerSeasonStats(year: $year, teamSlug: $teamSlug, limit: 100) {
            player
            games
            team {
                id
                slug
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
            primaryAlignment
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
        // Pos = most common receiver alignment on the season's parsed charts.
        head: ['Player', 'Pos', 'G', 'Tgt', 'Rec', 'Yds', 'TD'],
        key: (r: Row) => r.receivingYards,
        has: (r: Row) => r.targets > 0,
        row: (r: Row) => [
            r.primaryAlignment,
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
    const seasons = useSeasons()
    const [picked, setYear] = useState<number>()
    const year = picked ?? seasons[0]
    const [teamSlug, setTeamSlug] = useState<string | null>(null)
    const [category, setCategory] = useState<Category>('Receiving')
    const [sort, setSort] = useState<Sort>(null)
    const { data, loading, error, refetch } = useQuery(SEASON, {
        variables: { year: year ?? 0, teamSlug },
        skip: year === undefined,
    })
    const cat = CATEGORIES[category]
    // Category order (yards / EPA) unless a column header was tapped.
    const rows = sortRows(
        [...(data?.playerSeasonStats ?? [])]
            .filter(cat.has)
            .sort((a, b) => cat.key(b) - cat.key(a))
            .map((r) => ({
                slug: r.team.slug,
                cells: [
                    teamSlug ? r.player : `${r.player} (${r.team.abbreviation})`,
                    ...cat.row(r),
                ] as Cell[],
            })),
        sort,
        (r) => r.cells,
    )

    return (
        <SectionList
            style={ui.screen}
            sections={[{ data: rows }]}
            keyExtractor={(r, i) => `${r.cells[0]}-${i}`}
            stickySectionHeadersEnabled
            ListHeaderComponent={
                <ScreenHeader title="Stats" context={`${year ?? '—'} season · ${category} leaders`}>
                    <SeasonFilter
                        seasons={seasons}
                        year={year}
                        onYear={setYear}
                        teamSlug={teamSlug}
                        onTeam={setTeamSlug}
                    />
                    <View style={styles.tabs}>
                        {(Object.keys(CATEGORIES) as Category[]).map((c) => (
                            <Pressable
                                key={c}
                                onPress={() => {
                                    setCategory(c)
                                    setSort(null)
                                }}
                                accessibilityRole="tab"
                                accessibilityState={{ selected: c === category }}
                                accessibilityLabel={`${c} leaders`}
                            >
                                <Text style={[ui.text, c === category && styles.on]}>{c}</Text>
                            </Pressable>
                        ))}
                    </View>
                </ScreenHeader>
            }
            renderSectionHeader={() =>
                rows.length ? (
                    <View style={styles.head}>
                        <TableHead
                            cells={cat.head}
                            sort={sort}
                            onSort={(col) => setSort(nextSort(sort, col))}
                        />
                    </View>
                ) : null
            }
            renderItem={({ item }) => (
                <View style={styles.body}>
                    <TableRow cells={item.cells} accent={teamColour(item.slug)} />
                </View>
            )}
            ListEmptyComponent={
                loading || year === undefined ? (
                    <Loading />
                ) : error ? (
                    <ErrorState message="Could not load stats." onRetry={() => refetch()} />
                ) : (
                    <Empty message="No parsed games this season." />
                )
            }
        />
    )
}

const styles = {
    tabs: { flexDirection: 'row', gap: 20, paddingBottom: 8 },
    on: { color: colors.accent, fontWeight: '600' },
    head: { paddingHorizontal: 16, backgroundColor: colors.bg },
    body: { paddingHorizontal: 16 },
} as const
