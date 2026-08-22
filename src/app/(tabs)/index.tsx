import { useQuery } from '@apollo/client/react'
import { Link } from 'expo-router'
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native'
import { graphql } from '~/generated'
import { ui } from '~/lib/ui'

const TEAMS = graphql(`
    query Teams {
        teams {
            id
            slug
            name
            city
            abbreviation
            isActive
        }
    }
`)

export default function Teams() {
    const { data, loading, error, refetch } = useQuery(TEAMS)
    if (loading) return <ActivityIndicator style={ui.center} />
    if (error)
        return (
            <View style={ui.center}>
                <Text style={ui.error}>Could not load teams.</Text>
                <Pressable onPress={() => refetch()} accessibilityRole="button">
                    <Text style={ui.link}>Retry</Text>
                </Pressable>
            </View>
        )
    return (
        <FlatList
            style={ui.screen}
            data={data?.teams.filter((t) => t.isActive)}
            keyExtractor={(t) => t.slug}
            renderItem={({ item }) => (
                <Link href={`/team/${item.slug}`} asChild>
                    <Pressable
                        style={ui.row}
                        accessibilityRole="button"
                        accessibilityLabel={`${item.name} depth charts`}
                    >
                        <View>
                            <Text style={ui.text}>{item.name}</Text>
                            {item.city ? <Text style={ui.muted}>{item.city}</Text> : null}
                        </View>
                        <Text style={ui.muted}>{item.abbreviation}</Text>
                    </Pressable>
                </Link>
            )}
        />
    )
}
