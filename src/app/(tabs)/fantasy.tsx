import { ScrollView, Text, View } from 'react-native'
import ScreenHeader from '~/components/ScreenHeader'
import StatTiles from '~/components/StatTiles'
import { ui } from '~/lib/ui'

// Placeholder until the phase-3 contract (gameweeks / fantasyPlayers /
// projections) lands. A companion, not an integration: lineups are still set
// on the official CFL Game Zone site; this tab says what to set.
export default function Fantasy() {
    return (
        <ScrollView style={ui.screen}>
            <ScreenHeader title="Fantasy" context="CFL Game Zone companion · coming soon" />
            <StatTiles
                tiles={[
                    { label: 'Players', value: '–', hint: 'salary · position' },
                    { label: 'Projections', value: '–', hint: 'ours vs Game Zone' },
                    { label: 'Value', value: '–', hint: 'points per $' },
                ]}
            />
            <View style={ui.content}>
                <Text style={ui.text}>
                    Per-gameweek player table: salary, Game Zone projection, our projection, value,
                    last gameweek and season points — filterable by club and position, sortable by
                    any column.
                </Text>
                <Text style={ui.text}>
                    Player pages with points history and salary trend, and a suggested lineup under
                    the salary cap.
                </Text>
                <Text style={ui.muted}>
                    You keep setting your lineup on the official site; this tab tells you what to
                    set, and when it locks.
                </Text>
            </View>
        </ScrollView>
    )
}
