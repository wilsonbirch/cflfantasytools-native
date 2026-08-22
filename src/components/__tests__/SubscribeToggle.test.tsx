import { MockedProvider } from '@apollo/client/testing/react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import SubscribeToggle from '../SubscribeToggle'
import {
    MeDocument,
    MySubscriptionsDocument,
    SubscribeDocument,
    UnsubscribeDocument,
} from '~/generated/graphql'

const me = (account: unknown) => ({
    request: { query: MeDocument },
    result: { data: { me: account } },
})
const subs = (slugs: string[]) => ({
    request: { query: MySubscriptionsDocument },
    result: {
        data: {
            mySubscriptions: slugs.map((slug, i) => ({
                __typename: 'NotificationSubscription',
                id: i + 1,
                enabled: true,
                team: { __typename: 'Team', id: i + 1, slug },
            })),
        },
    },
})
const account = { __typename: 'Account', id: 1, email: 'w@example.com', role: 'USER' }

it('asks signed-out users to sign in', async () => {
    await render(
        <MockedProvider mocks={[me(null)]}>
            <SubscribeToggle teamSlug="ott" />
        </MockedProvider>,
    )
    expect(await screen.findByText('Sign in for depth-chart alerts')).toBeTruthy()
})

it('subscribes a signed-in user and refetches', async () => {
    const subscribed = jest.fn(() => ({
        data: { subscribe: { __typename: 'NotificationSubscription', id: 9, enabled: true } },
    }))
    const mocks = [
        me(account),
        subs([]),
        {
            request: { query: SubscribeDocument, variables: { teamSlug: 'ott' } },
            result: subscribed,
        },
        subs(['ott']),
    ]
    await render(
        <MockedProvider mocks={mocks}>
            <SubscribeToggle teamSlug="ott" />
        </MockedProvider>,
    )
    const button = await screen.findByLabelText('Subscribe to alerts')
    await act(() => fireEvent.press(button))
    await waitFor(() => expect(subscribed).toHaveBeenCalled())
    expect(await screen.findByLabelText('Unsubscribe from alerts')).toBeTruthy()
})

it('unsubscribes when already subscribed', async () => {
    const unsubscribed = jest.fn(() => ({
        data: { unsubscribe: { __typename: 'NotificationSubscription', id: 1, enabled: false } },
    }))
    const mocks = [
        me(account),
        subs(['ott']),
        {
            request: { query: UnsubscribeDocument, variables: { teamSlug: 'ott' } },
            result: unsubscribed,
        },
        subs([]),
    ]
    await render(
        <MockedProvider mocks={mocks}>
            <SubscribeToggle teamSlug="ott" />
        </MockedProvider>,
    )
    const button = await screen.findByLabelText('Unsubscribe from alerts')
    await act(() => fireEvent.press(button))
    await waitFor(() => expect(unsubscribed).toHaveBeenCalled())
})
