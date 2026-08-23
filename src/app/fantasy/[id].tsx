import { useQuery } from '@apollo/client/react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Empty, Loading } from '~/components/State'
import StatTiles from '~/components/StatTiles'
import Table, { fmt } from '~/components/Table'
import { graphql } from '~/generated'
import { colors, fmtDate, teamColour, ui } from '~/lib/ui'
import { POS } from './../(tabs)/fantasy'

const PLAYER = graphql(`
    query FantasyPlayer($id: Int!, $gameweekId: Int) {
        fantasyPlayer(id: $id, gameweekId: $gameweekId) {
            id
            name
            position
            salary
            weekSalaryChange
            status
            injuredText
            isLocked
            gameZoneProjection
            avgPoints
            seasonPoints
            lastGameweekPoints
            value
            team {
                id
                slug
                abbreviation
            }
            pointsHistory {
                gameweek {
                    id
                    week
                }
                points
            }
            salaryHistory {
                capturedAt
                salary
                weekSalaryChange
            }
            projection {
                id
                points
                epa
                alignment
                games
                fittedAt
                opponent {
                    id
                    abbreviation
                }
                passAttempts
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
            }
        }
    }
`)

export default function FantasyPlayerScreen() {
    const params = useLocalSearchParams<{ id: string; gw?: string }>()
    const gameweekId = params.gw ? Number(params.gw) : undefined
    const { data, loading } = useQuery(PLAYER, {
        variables: { id: Number(params.id), gameweekId },
    })
    if (loading) return <Loading fill />
    const p = data?.fantasyPlayer
    if (!p) return <Empty message="Player not found." fill />
    const proj = p.projection
    const salaryK = p.salary == null ? null : p.salary / 1000
    const gzVsOurs =
        proj && p.gameZoneProjection != null ? proj.points - p.gameZoneProjection : null

    return (
        <ScrollView style={ui.screen}>
            <Stack.Screen options={{ title: p.name }} />
            <View style={{ height: 3, backgroundColor: teamColour(p.team?.slug) }} />
            <View style={ui.content}>
                <Text style={ui.muted}>
                    {POS[p.position]} · {p.team?.abbreviation ?? 'FA'}
                    {p.status ? ` · ${p.status}` : ''}
                    {p.isLocked ? ' · locked' : ''}
                </Text>
                {p.injuredText ? <Text style={ui.error}>{p.injuredText}</Text> : null}
            </View>
            <StatTiles
                tiles={[
                    {
                        label: 'Salary $k',
                        value: salaryK,
                        hint: p.weekSalaryChange
                            ? `${signed(p.weekSalaryChange / 1000)} wk`
                            : undefined,
                    },
                    { label: 'GZ proj', value: p.gameZoneProjection },
                    {
                        label: 'Our proj',
                        value: proj?.points,
                        hint: gzVsOurs == null ? undefined : `${signed(gzVsOurs)} vs GZ`,
                        tone: gzVsOurs == null ? undefined : gzVsOurs >= 0 ? 'good' : 'bad',
                    },
                    { label: 'Val /$k', value: p.value },
                ]}
            />
            <StatTiles
                tiles={[
                    { label: 'Last GW', value: p.lastGameweekPoints },
                    { label: 'Avg', value: p.avgPoints },
                    { label: 'Season', value: p.seasonPoints },
                ]}
            />
            <Bars
                title="Points by gameweek"
                items={p.pointsHistory.map((h) => ({
                    label: `GW ${h.gameweek.week}`,
                    value: h.points,
                }))}
                empty="No gameweek points yet."
            />
            <Bars
                title="Salary trend ($k)"
                items={p.salaryHistory.map((s) => ({
                    label: fmtDate(s.capturedAt),
                    value: s.salary / 1000,
                }))}
                empty="No salary history yet."
            />
            {proj ? (
                <Table
                    title="Projection breakdown"
                    head={['Per game', 'Proj']}
                    rows={[
                        ['Pass att', proj.passAttempts],
                        ['Pass yds', proj.passingYards],
                        ['Pass TD', proj.passingTouchdowns],
                        ['INT', proj.interceptions],
                        ['Rush att', proj.rushAttempts],
                        ['Rush yds', proj.rushingYards],
                        ['Rush TD', proj.rushingTouchdowns],
                        ['Targets', proj.targets],
                        ['Rec', proj.receptions],
                        ['Rec yds', proj.receivingYards],
                        ['Rec TD', proj.receivingTouchdowns],
                        ['EPA', proj.epa],
                    ].filter(([, v]) => typeof v !== 'number' || v !== 0)}
                    caption={[
                        proj.alignment ? `Role ${proj.alignment}` : null,
                        proj.opponent ? `vs ${proj.opponent.abbreviation}` : null,
                        `${proj.games} games behind the player term`,
                        `fitted ${fmtDate(proj.fittedAt)}`,
                    ]
                        .filter(Boolean)
                        .join(' · ')}
                />
            ) : (
                <Empty message="No projection fitted for this gameweek." />
            )}
        </ScrollView>
    )
}

const signed = (n: number) => `${n >= 0 ? '+' : ''}${fmt(n)}`

// Horizontal bars from plain Views — no chart library. Width is relative to
// the largest value in the series.
export function Bars({
    title,
    items,
    empty,
}: {
    title: string
    items: { label: string; value: number }[]
    empty: string
}) {
    const max = Math.max(0, ...items.map((i) => i.value))
    return (
        <View style={styles.bars} accessibilityRole="list" accessibilityLabel={title}>
            <Text style={styles.title}>{title}</Text>
            {items.length === 0 ? <Text style={ui.muted}>{empty}</Text> : null}
            {items.map((it, i) => (
                <View
                    key={i}
                    style={styles.barRow}
                    accessibilityLabel={`${it.label}: ${fmt(it.value)}`}
                >
                    <Text style={styles.barLabel} numberOfLines={1}>
                        {it.label}
                    </Text>
                    <View style={styles.track}>
                        <View
                            style={[
                                styles.fill,
                                { width: `${max > 0 ? Math.max(2, (100 * it.value) / max) : 0}%` },
                            ]}
                        />
                    </View>
                    <Text style={styles.barValue}>{fmt(it.value)}</Text>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    bars: { paddingHorizontal: 16, paddingBottom: 16, gap: 4 },
    title: { color: colors.text, fontSize: 16, fontWeight: '600', paddingVertical: 8 },
    barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    barLabel: { width: 88, color: colors.muted, fontSize: 12 },
    track: { flex: 1, height: 10, backgroundColor: colors.card, borderRadius: 2 },
    fill: { height: 10, backgroundColor: colors.accent, borderRadius: 2 },
    barValue: {
        width: 44,
        textAlign: 'right',
        color: colors.text,
        fontSize: 12,
        fontVariant: ['tabular-nums'],
    },
})
