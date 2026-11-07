import { InMemoryCache } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing/react'
import { act, render, screen } from '@testing-library/react-native'
import Games from '../(tabs)/games'
import { GamesDocument, SeasonsDocument, TeamsDocument } from '~/generated/graphql'

const mocks = [
    { request: { query: TeamsDocument }, result: { data: { teams: [] } } },
    { request: { query: SeasonsDocument }, result: { data: { seasons: [2026, 2025] } } },
    {
        request: { query: GamesDocument, variables: { year: 2026, teamSlug: null } },
        result: {
            data: {
                games: [
                    {
                        __typename: 'Game',
                        id: 7,
                        date: '2026-07-01T00:00:00Z',
                        homeScore: 24,
                        awayScore: 17,
                        homeTeam: {
                            __typename: 'Team',
                            id: 1,
                            slug: 'ottawa-redblacks',
                            abbreviation: 'OTT',
                        },
                        awayTeam: {
                            __typename: 'Team',
                            id: 2,
                            slug: 'toronto-argonauts',
                            abbreviation: 'TOR',
                        },
                    },
                ],
            },
        },
    },
]

it('lists the season games with scores', async () => {
    await render(
        <MockedProvider mocks={mocks}>
            <Games />
        </MockedProvider>,
    )
    expect(await screen.findByLabelText('TOR at OTT, 17 to 24')).toBeTruthy()
})

// GAMES goes from running to skipped when the seasons list empties (as it can
// while the store resets on login/logout). skipToken keeps a query's last
// result, so the screen must not keep listing the old season's games.
it('drops the previous season games when the season becomes unknown', async () => {
    const cache = new InMemoryCache()
    await render(
        <MockedProvider mocks={mocks} cache={cache}>
            <Games />
        </MockedProvider>,
    )
    expect(await screen.findByLabelText('TOR at OTT, 17 to 24')).toBeTruthy()

    await act(() => cache.writeQuery({ query: SeasonsDocument, data: { seasons: [] } }))
    expect(await screen.findByText('— season · 0 parsed')).toBeTruthy()
    expect(screen.queryByLabelText('TOR at OTT, 17 to 24')).toBeNull()
})
