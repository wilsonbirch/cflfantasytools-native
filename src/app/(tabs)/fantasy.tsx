import { useQuery } from '@apollo/client/react'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, SectionList, Text, View } from 'react-native'
import ScreenHeader from '~/components/ScreenHeader'
import SeasonFilter, { useSeasons } from '~/components/SeasonFilter'
import { Empty, ErrorState, Loading } from '~/components/State'
import { nextSort, sortRows, TableHead, TableRow, type Cell, type Sort } from '~/components/Table'
import { graphql } from '~/generated'
import type { PlayerPosition } from '~/generated/graphql'
import { colors, fmtDate, teamColour, ui } from '~/lib/ui'

const GAMEWEEKS = graphql(`
    query Gameweeks($year: Int!) {
        gameweeks(year: $year) {
            id
            week
            name
            status
            startDate
        }
    }
`)

const PLAYERS = graphql(`
    query FantasyPlayers($gameweekId: Int, $teamSlug: String, $position: PlayerPosition) {
        fantasyPlayers(
            gameweekId: $gameweekId
            teamSlug: $teamSlug
            position: $position
            limit: 300
        ) {
            id
            name
            position
            salary
            isLocked
            gameZoneProjection
            seasonPoints
            lastGameweekPoints
            value
            team {
                id
                slug
                abbreviation
            }
            projection {
                id
                points
            }
        }
    }
`)

// Short labels in the Game Zone's own position groups.
export const POS: Record<PlayerPosition, string> = {
    QUARTERBACK: 'QB',
    RUNNING_BACK: 'RB',
    WIDE_RECEIVER: 'WR',
    OTHER: 'Oth',
}
const POSITIONS: PlayerPosition[] = ['QUARTERBACK', 'RUNNING_BACK', 'WIDE_RECEIVER']

// Salary in $k, projections/points to one decimal, value = our points per $1k.
const HEAD = ['Player', '$k', 'GZ', 'Proj', 'Val', 'Last', 'Szn']

// The companion's player browser: one gameweek, every active player, the
// feed's salary and projection next to ours. Lineups are still set on the
// official site; this tells you what to set.
export default function Fantasy() {
    const router = useRouter()
    const seasons = useSeasons()
    const [picked, setYear] = useState<number>()
    const year = picked ?? seasons[0]
    const [teamSlug, setTeamSlug] = useState<string | null>(null)
    const [position, setPosition] = useState<PlayerPosition | null>(null)
    const [pickedGw, setGw] = useState<number>()
    const [sort, setSort] = useState<Sort>(null)

    const gws = useQuery(GAMEWEEKS, { variables: { year: year ?? 0 }, skip: year === undefined })
    const gameweeks = gws.data?.gameweeks ?? []
    // The api's own default: the first gameweek not yet complete, else the last.
    const gw =
        gameweeks.find((g) => g.id === pickedGw) ??
        gameweeks.find((g) => g.status !== 'complete') ??
        gameweeks.at(-1)
    const { data, loading, error, refetch } = useQuery(PLAYERS, {
        variables: { gameweekId: gw?.id, teamSlug, position },
        skip: gw === undefined,
    })
    const rows = sortRows(
        (data?.fantasyPlayers ?? []).map((p) => ({
            id: p.id,
            slug: p.team?.slug,
            cells: [
                `${p.name}${p.isLocked ? ' 🔒' : ''} · ${POS[p.position]}${teamSlug ? '' : ` ${p.team?.abbreviation ?? ''}`}`,
                p.salary == null ? null : p.salary / 1000,
                p.gameZoneProjection,
                p.projection?.points,
                p.value,
                p.lastGameweekPoints,
                p.seasonPoints,
            ] as Cell[],
        })),
        sort,
        (r) => r.cells,
    )
    const context = gw
        ? `${year} · ${gw.name}${gw.startDate ? ` · locks ${fmtDate(gw.startDate)}` : ''}`
        : `${year ?? '—'} · no gameweeks yet`

    return (
        <SectionList
            style={ui.screen}
            sections={[{ data: rows }]}
            keyExtractor={(r) => String(r.id)}
            stickySectionHeadersEnabled
            ListHeaderComponent={
                <ScreenHeader title="Fantasy" context={context}>
                    <SeasonFilter
                        seasons={seasons}
                        year={year}
                        onYear={(y) => {
                            setYear(y)
                            setGw(undefined)
                        }}
                        teamSlug={teamSlug}
                        onTeam={setTeamSlug}
                    />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {gameweeks.map((g) => (
                            <Chip
                                key={g.id}
                                label={`GW ${g.week}`}
                                on={g.id === gw?.id}
                                onPress={() => setGw(g.id)}
                                a11y={`Gameweek ${g.week}`}
                            />
                        ))}
                    </ScrollView>
                    <View style={styles.chips}>
                        <Chip
                            label="All"
                            on={position === null}
                            onPress={() => setPosition(null)}
                            a11y="All positions"
                        />
                        {POSITIONS.map((p) => (
                            <Chip
                                key={p}
                                label={POS[p]}
                                on={position === p}
                                onPress={() => setPosition(p)}
                                a11y={`Filter to ${POS[p]}`}
                            />
                        ))}
                    </View>
                </ScreenHeader>
            }
            renderSectionHeader={() =>
                rows.length ? (
                    <View style={styles.head}>
                        <TableHead
                            cells={HEAD}
                            sort={sort}
                            onSort={(col) => setSort(nextSort(sort, col))}
                        />
                    </View>
                ) : null
            }
            renderItem={({ item }) => (
                <View style={styles.body}>
                    <TableRow
                        cells={item.cells}
                        accent={teamColour(item.slug)}
                        onPress={() =>
                            router.push({
                                pathname: '/fantasy/[id]',
                                params: { id: String(item.id), gw: String(gw?.id ?? '') },
                            })
                        }
                    />
                </View>
            )}
            ListFooterComponent={
                rows.length ? (
                    <Text style={[ui.muted, ui.content]}>
                        $k = Game Zone salary in thousands · GZ = Game Zone projection · Proj = our
                        projection · Val = our points per $1k · 🔒 = locked
                    </Text>
                ) : null
            }
            ListEmptyComponent={
                loading || gws.loading || year === undefined ? (
                    <Loading />
                ) : error || gws.error ? (
                    <ErrorState message="Could not load players." onRetry={() => refetch()} />
                ) : (
                    <Empty message="No players for this gameweek." />
                )
            }
        />
    )
}

function Chip({
    label,
    on,
    onPress,
    a11y,
}: {
    label: string
    on: boolean
    onPress: () => void
    a11y: string
}) {
    return (
        <Pressable
            onPress={onPress}
            style={[styles.chip, on && styles.chipOn]}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={a11y}
        >
            <Text style={ui.text}>{label}</Text>
        </Pressable>
    )
}

const styles = {
    chips: { flexDirection: 'row' },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 16,
        backgroundColor: colors.card,
        marginRight: 8,
    },
    chipOn: { backgroundColor: colors.accent },
    head: { paddingHorizontal: 16, backgroundColor: colors.bg },
    body: { paddingHorizontal: 16 },
} as const
