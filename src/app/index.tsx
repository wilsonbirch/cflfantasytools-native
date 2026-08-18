import { StyleSheet, Text, View } from 'react-native'

// Placeholder shell. The depth-chart drilldown, player browser and settings
// screens land in phase 5, mirroring web over the same GraphQL documents.
export default function Index() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>3 Down Fantasy</Text>
            <Text style={styles.subtitle}>
                CFL depth charts, game-by-game stats and fantasy tools.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 24,
        backgroundColor: '#0b0b0f',
    },
    title: { fontSize: 28, fontWeight: '600', color: '#fff' },
    subtitle: { fontSize: 15, color: '#9a9aa5', textAlign: 'center' },
})
