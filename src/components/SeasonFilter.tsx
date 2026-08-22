import { useQuery } from '@apollo/client/react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { TeamsDocument } from '~/generated/graphql'
import { colors, ui } from '~/lib/ui'

export const CURRENT_YEAR = new Date().getFullYear()

// Season stepper plus a club filter. The contract has no "seasons with games"
// query, so the stepper is open-ended; an empty season just lists nothing.
export default function SeasonFilter({
    year,
    onYear,
    teamSlug,
    onTeam,
}: {
    year: number
    onYear: (y: number) => void
    teamSlug: string | null
    onTeam: (slug: string | null) => void
}) {
    const { data } = useQuery(TeamsDocument)
    const teams = data?.teams.filter((t) => t.isActive) ?? []
    return (
        <View style={styles.wrap}>
            <View style={styles.years}>
                <Pressable
                    onPress={() => onYear(year - 1)}
                    accessibilityRole="button"
                    accessibilityLabel="Previous season"
                    hitSlop={8}
                >
                    <Text style={ui.link}>‹</Text>
                </Pressable>
                <Text style={ui.title}>{year}</Text>
                <Pressable
                    onPress={() => onYear(year + 1)}
                    disabled={year >= CURRENT_YEAR}
                    accessibilityRole="button"
                    accessibilityLabel="Next season"
                    hitSlop={8}
                >
                    <Text style={[ui.link, year >= CURRENT_YEAR && styles.off]}>›</Text>
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
