import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen } from '@testing-library/react-native'
import Games from '../(tabs)/games'
import { GamesDocument, TeamsDocument } from '~/generated/graphql'
import { CURRENT_YEAR } from '~/components/SeasonFilter'

const mocks = [
    { request: { query: TeamsDocument }, result: { data: { teams: [] } } },
    {
        request: { query: GamesDocument, variables: { year: CURRENT_YEAR, teamSlug: null } },
        result: {
            data: {
                games: [
                    {
                        __typename: 'Game',
                        id: 7,
                        date: '2026-07-01T00:00:00Z',
                        homeScore: 24,
                        awayScore: 17,
                        homeTeam: { __typename: 'Team', id: 1, abbreviation: 'OTT' },
                        awayTeam: { __typename: 'Team', id: 2, abbreviation: 'TOR' },
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
