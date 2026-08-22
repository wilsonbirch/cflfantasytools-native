import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen } from '@testing-library/react-native'
import Account from '../(tabs)/account'
import { MeDocument } from '~/generated/graphql'

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(async () => null),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}))

const me = (account: unknown) => [
    { request: { query: MeDocument }, result: { data: { me: account } } },
]

it('offers sign in and registration when signed out', async () => {
    await render(
        <MockedProvider mocks={me(null)}>
            <Account />
        </MockedProvider>,
    )
    expect(await screen.findByText('Sign in')).toBeTruthy()
    expect(screen.getByText('Create account')).toBeTruthy()
})

it('shows the account and a sign-out button when signed in', async () => {
    await render(
        <MockedProvider
            mocks={me({ __typename: 'Account', id: 1, email: 'w@example.com', role: 'USER' })}
        >
            <Account />
        </MockedProvider>,
    )
    expect(await screen.findByText('w@example.com')).toBeTruthy()
    expect(screen.getByLabelText('Sign out')).toBeTruthy()
})
