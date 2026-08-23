import { MockedProvider } from '@apollo/client/testing/react'
import { act, fireEvent, render, screen } from '@testing-library/react-native'
import Stats from '../(tabs)/stats'
import { PlayerSeasonStatsDocument, SeasonsDocument, TeamsDocument } from '~/generated/graphql'

const row = (player: string, over: Partial<Record<string, number | string>>) => ({
    __typename: 'PlayerSeasonStats',
    player,
    games: 3,
    team: { __typename: 'Team', id: 1, abbreviation: 'OTT' },
    passAttempts: 0,
    completions: 0,
    passingYards: 0,
    passingTouchdowns: 0,
    interceptions: 0,
    rushAttempts: 0,
    rushingYards: 0,
    rushingTouchdowns: 0,
    targets: 0,
    receptions: 0,
    receivingYards: 0,
    receivingTouchdowns: 0,
    primaryAlignment: null,
    epa: 0,
    ...over,
})

const mocks = [
    { request: { query: TeamsDocument }, result: { data: { teams: [] } } },
    { request: { query: SeasonsDocument }, result: { data: { seasons: [2026, 2025] } } },
    {
        request: {
            query: PlayerSeasonStatsDocument,
            variables: { year: 2026, teamSlug: null },
        },
        result: {
            data: {
                playerSeasonStats: [
                    row('#12 D.Adams', {
                        passAttempts: 60,
                        completions: 40,
                        passingYards: 500,
                        epa: 9,
                    }),
                    row('#81 J.Hardy', {
                        targets: 10,
                        receptions: 7,
                        receivingYards: 120,
                        primaryAlignment: '1S',
                        epa: 4,
                    }),
                    row('#7 W.Powell', { rushAttempts: 20, rushingYards: 110, epa: 1 }),
                ],
            },
        },
    },
]

it('shows receiving leaders by default and switches category', async () => {
    await render(
        <MockedProvider mocks={mocks}>
            <Stats />
        </MockedProvider>,
    )
    expect(await screen.findByText('#81 J.Hardy (OTT)')).toBeTruthy()
    expect(screen.getByText('1S')).toBeTruthy()
    expect(screen.queryByText('#12 D.Adams (OTT)')).toBeNull()

    const tab = screen.getByLabelText('Passing leaders')
    await act(() => fireEvent.press(tab))
    expect(screen.getByText('#12 D.Adams (OTT)')).toBeTruthy()
    expect(screen.getByText('40/60')).toBeTruthy()
    expect(screen.queryByText('#81 J.Hardy (OTT)')).toBeNull()
})
