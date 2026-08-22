import { Tabs } from 'expo-router/js-tabs'
import { colors } from '~/lib/ui'

// Text-only tabs: the app ships no icon font, and four short labels read fine.
export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: colors.bg },
                headerTintColor: colors.text,
                sceneStyle: { backgroundColor: colors.bg },
                tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.border },
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.muted,
                tabBarIconStyle: { display: 'none' },
                tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
            }}
        >
            <Tabs.Screen name="index" options={{ title: 'Teams' }} />
            <Tabs.Screen name="games" options={{ title: 'Games' }} />
            <Tabs.Screen name="stats" options={{ title: 'Stats' }} />
            <Tabs.Screen name="account" options={{ title: 'Account' }} />
        </Tabs>
    )
}
