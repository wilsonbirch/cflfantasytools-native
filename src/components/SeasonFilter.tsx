import { useQuery } from '@apollo/client/react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { graphql } from '~/generated'
import { TeamsDocument } from '~/generated/graphql'
import { colors, ui } from '~/lib/ui'

const SEASONS = graphql(`
    query Seasons {
        seasons
    }
`)

// Seasons the api has data for, newest first. Screens default to the first.
export function useSeasons(): number[] {
    const { data } = useQuery(SEASONS)
    return data?.seasons ?? []
}

// Season stepper over the api's seasons plus a club filter.
export default function SeasonFilter({
    seasons,
    year,
    onYear,
    teamSlug,
    onTeam,
}: {
    seasons: number[]
    year: number | undefined
    onYear: (y: number) => void
    teamSlug: string | null
    onTeam: (slug: string | null) => void
}) {
    const { data } = useQuery(TeamsDocument)
    const teams = data?.teams.filter((t) => t.isActive) ?? []
    const i = year === undefined ? -1 : seasons.indexOf(year)
    const older = i >= 0 ? seasons[i + 1] : undefined
    const newer = i > 0 ? seasons[i - 1] : undefined
    return (
        <View style={styles.wrap}>
            <View style={styles.years}>
                <Pressable
                    onPress={() => older !== undefined && onYear(older)}
                    disabled={older === undefined}
                    accessibilityRole="button"
                    accessibilityLabel="Previous season"
                    hitSlop={8}
                >
                    <Text style={[ui.link, older === undefined && styles.off]}>‹</Text>
                </Pressable>
                <Text style={ui.title}>{year ?? '—'}</Text>
                <Pressable
                    onPress={() => newer !== undefined && onYear(newer)}
                    disabled={newer === undefined}
                    accessibilityRole="button"
                    accessibilityLabel="Next season"
                    hitSlop={8}
                >
                    <Text style={[ui.link, newer === undefined && styles.off]}>›</Text>
                </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[{ slug: null, abbreviation: 'All' }, ...teams].map((t) => (
                    <Pressable
                        key={t.slug ?? 'all'}
                        onPress={() => onTeam(t.slug)}
                        style={[styles.chip, t.slug === teamSlug && styles.chipOn]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: t.slug === teamSlug }}
                        accessibilityLabel={t.slug ? `Filter to ${t.abbreviation}` : 'All teams'}
                    >
                        <Text style={ui.text}>{t.abbreviation}</Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: { padding: 16, gap: 12 },
    years: { flexDirection: 'row', alignItems: 'center', gap: 24 },
    off: { opacity: 0.3 },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 16,
        backgroundColor: colors.card,
        marginRight: 8,
    },
    chipOn: { backgroundColor: colors.accent },
})
