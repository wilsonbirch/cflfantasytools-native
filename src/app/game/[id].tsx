import { useQuery } from '@apollo/client/react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import Table from '~/components/Table'
import { graphql } from '~/generated'
import type { GameQuery } from '~/generated/graphql'
import { fmtDate, ui } from '~/lib/ui'

const GAME = graphql(`
    query Game($id: Int!) {
        game(id: $id) {
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
            boxScore {
                team {
                    id
                    abbreviation
                }
                points
                totalYards
                passingYards
                rushingYards
                firstDowns
                turnovers
                plays
                epa
            }
            playerStats {
                player
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
                targetsByZone {
                    depth
                    direction
                    targets
                }
            }
        }
    }
`)

type Stats = NonNullable<GameQuery['game']>['playerStats'][number]

// Deep/short × left/middle/right, the api's target zones. These are field
// zones, not receiver alignments: the contract carries no alignment per
// target, so the 1S/2WK vocabulary has nowhere to attach yet.
const ZONES = ['DEEP', 'SHORT'].flatMap((d) =>
    ['LEFT', 'MIDDLE', 'RIGHT'].map((dir) => ({ d, dir, label: `${d[0]}${dir[0]}` })),
)

export function TeamTables({ abbr, stats }: { abbr: string; stats: Stats[] }) {
    const by = (n: number) => (a: { epa: number }, b: { epa: number }) => n * (b.epa - a.epa)
    const passers = stats.filter((s) => s.passAttempts > 0)
    const rushers = stats.filter((s) => s.rushAttempts > 0)
    const receivers = stats.filter((s) => s.targets > 0)
    return (
        <View>
            <Text style={[ui.title, ui.content]}>{abbr}</Text>
            <Table
                title="Passing"
                head={['Player', 'C/A', 'Yds', 'TD', 'INT']}
                rows={passers.map((s) => [
                    s.player,
                    `${s.completions}/${s.passAttempts}`,
                    s.passingYards,
                    s.passingTouchdowns,
                    s.interceptions,
                ])}
            />
            <Table
                title="Rushing"
                head={['Player', 'Att', 'Yds', 'TD']}
                rows={rushers.map((s) => [
                    s.player,
                    s.rushAttempts,
                    s.rushingYards,
                    s.rushingTouchdowns,
                ])}
            />
            <Table
                title="Receiving"
                head={['Player', 'Tgt', 'Rec', 'Yds', 'TD']}
                rows={receivers.map((s) => [
                    s.player,
                    s.targets,
                    s.receptions,
                    s.receivingYards,
                    s.receivingTouchdowns,
                ])}
            />
            <Table
                title="Targets by zone"
                head={['Player', ...ZONES.map((z) => z.label)]}
                rows={receivers.map((s) => [
                    s.player,
                    ...ZONES.map(
                        (z) =>
                            s.targetsByZone.find((t) => t.depth === z.d && t.direction === z.dir)
                                ?.targets ?? 0,
                    ),
                ])}
                caption="D/S = deep/short, L/M/R = left/middle/right"
            />
            <Table
                title="EPA"
                head={['Player', 'EPA']}
                rows={[...stats].sort(by(1)).map((s) => [s.player, s.epa])}
            />
        </View>
    )
}

export default function GameScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { data, loading } = useQuery(GAME, { variables: { id: Number(id) } })
    if (loading) return <ActivityIndicator style={ui.center} />
    const game = data?.game
    if (!game)
        return (
            <View style={ui.center}>
                <Text style={ui.error}>Game not found.</Text>
            </View>
        )
    const away = game.awayTeam?.abbreviation ?? '?'
    const home = game.homeTeam?.abbreviation ?? '?'
    // Box score columns follow the header: away first, then home.
    const box = [game.awayTeam?.id, game.homeTeam?.id].map((tid) =>
        game.boxScore.find((b) => b.team.id === tid),
    )
    const teams = [game.awayTeam, game.homeTeam].filter((t) => t != null)

    return (
        <ScrollView style={ui.screen}>
            <Stack.Screen options={{ title: `${away} @ ${home}` }} />
            <View style={ui.content}>
                <Text style={ui.title}>
                    {away} {game.awayScore ?? '–'} @ {home} {game.homeScore ?? '–'}
                </Text>
                <Text style={ui.muted}>{game.date ? fmtDate(game.date) : ''}</Text>
            </View>
            <Table
                title="Box score"
                head={['', away, home]}
                rows={(
                    [
                        ['Points', 'points'],
                        ['Total yards', 'totalYards'],
                        ['Passing yards', 'passingYards'],
                        ['Rushing yards', 'rushingYards'],
                        ['First downs', 'firstDowns'],
                        ['Turnovers', 'turnovers'],
                        ['Plays', 'plays'],
                        ['EPA', 'epa'],
                    ] as const
                ).map(([label, key]) => [label, ...box.map((b) => b?.[key])])}
            />
            {teams.map((t) => (
                <TeamTables
                    key={t.id}
                    abbr={t.abbreviation}
                    stats={game.playerStats.filter((s) => s.team.id === t.id)}
                />
            ))}
        </ScrollView>
    )
}
