import { useMutation, useQuery } from '@apollo/client/react'
import { Link } from 'expo-router'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { graphql } from '~/generated'
import { MeDocument } from '~/generated/graphql'
import { ui } from '~/lib/ui'

export const MY_SUBSCRIPTIONS = graphql(`
    query MySubscriptions {
        mySubscriptions {
            id
            enabled
            team {
                id
                slug
            }
        }
    }
`)

const SUBSCRIBE = graphql(`
    mutation Subscribe($teamSlug: String!) {
        subscribe(teamSlug: $teamSlug) {
            id
            enabled
        }
    }
`)

const UNSUBSCRIBE = graphql(`
    mutation Unsubscribe($teamSlug: String!) {
        unsubscribe(teamSlug: $teamSlug) {
            id
            enabled
        }
    }
`)

// Depth-chart email alerts for one club. Signed-out users get a sign-in link;
// `mySubscriptions` is signed-in only, so it is skipped until `me` resolves.
export default function SubscribeToggle({ teamSlug }: { teamSlug: string }) {
    const { data: meData } = useQuery(MeDocument)
    const signedIn = !!meData?.me
    const { data } = useQuery(MY_SUBSCRIPTIONS, { skip: !signedIn })
    const refetch = { refetchQueries: [MY_SUBSCRIPTIONS] }
    const [subscribe, { loading: subscribing }] = useMutation(SUBSCRIBE, refetch)
    const [unsubscribe, { loading: unsubscribing }] = useMutation(UNSUBSCRIBE, refetch)

    if (!signedIn) {
        return (
            <Link href="/login" style={ui.link} accessibilityRole="link">
                Sign in for depth-chart alerts
            </Link>
        )
    }
    if (!data) return <ActivityIndicator />
    const subscribed = data.mySubscriptions.some((s) => s.enabled && s.team.slug === teamSlug)
    const label = subscribed ? 'Unsubscribe from alerts' : 'Subscribe to alerts'
    return (
        <View>
            <Pressable
                style={ui.button}
                disabled={subscribing || unsubscribing}
                onPress={() =>
                    (subscribed ? unsubscribe : subscribe)({ variables: { teamSlug } }).catch(
                        () => undefined,
                    )
                }
                accessibilityRole="switch"
                accessibilityState={{ checked: subscribed }}
                accessibilityLabel={label}
            >
                <Text style={ui.buttonText}>{label}</Text>
            </Pressable>
        </View>
    )
}
