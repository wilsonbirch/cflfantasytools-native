import { useQuery } from '@apollo/client/react'
import { Link } from 'expo-router'
import { FlatList, Pressable, Text, View } from 'react-native'
import ScreenHeader from '~/components/ScreenHeader'
import { ErrorState, Loading } from '~/components/State'
import { graphql } from '~/generated'
import { accentRow, ui } from '~/lib/ui'

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
    const teams = data?.teams.filter((t) => t.isActive) ?? []
    return (
        <FlatList
            style={ui.screen}
            data={teams}
            keyExtractor={(t) => t.slug}
            ListHeaderComponent={
                <ScreenHeader title="Teams" context="Depth charts · alignment · coaching staff" />
            }
            ListEmptyComponent={
                loading ? (
                    <Loading />
                ) : error ? (
                    <ErrorState message="Could not load teams." onRetry={() => refetch()} />
                ) : null
            }
            renderItem={({ item }) => (
                <Link href={`/team/${item.slug}`} asChild>
                    <Pressable
                        style={accentRow(item.slug)}
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
