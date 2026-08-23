import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen } from '@testing-library/react-native'
import GameScreen from '../game/[id]'
import { GameDocument } from '~/generated/graphql'

jest.mock('expo-router', () => ({
    useLocalSearchParams: () => ({ id: '7' }),
    Stack: { Screen: () => null },
}))

const team = (id: number, abbreviation: string) => ({ __typename: 'Team', id, abbreviation })
const box = (id: number, abbreviation: string, points: number) => ({
    __typename: 'TeamBoxScore',
    team: team(id, abbreviation),
    points,
    totalYards: 300,
    passingYards: 200,
    rushingYards: 100,
    firstDowns: 20,
    turnovers: 1,
    plays: 60,
    epa: 2.5,
})
const zero = {
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
}
const game = {
    __typename: 'Game',
    id: 7,
    date: '2026-07-01T00:00:00Z',
    homeScore: 24,
    awayScore: 17,
    homeTeam: team(1, 'OTT'),
    awayTeam: team(2, 'TOR'),
    boxScore: [box(1, 'OTT', 24), box(2, 'TOR', 17)],
    playerStats: [
        {
            __typename: 'PlayerGameStats',
            ...zero,
            player: '#12 D.Adams',
            alignment: null,
            team: team(1, 'OTT'),
            passAttempts: 30,
            completions: 20,
            passingYards: 250,
            passingTouchdowns: 2,
            epa: 6.3,
            targetsByZone: [],
        },
        {
            __typename: 'PlayerGameStats',
            ...zero,
            player: '#81 J.Hardy',
            alignment: '2WK',
            team: team(1, 'OTT'),
            targets: 8,
            receptions: 6,
            receivingYards: 90,
            receivingTouchdowns: 1,
            epa: 3.1,
            targetsByZone: [
                { __typename: 'ZoneTargets', depth: 'DEEP', direction: 'LEFT', targets: 3 },
                { __typename: 'ZoneTargets', depth: 'SHORT', direction: 'MIDDLE', targets: 5 },
            ],
        },
    ],
}

it('renders the box score and per-player tables', async () => {
    const mocks = [
        { request: { query: GameDocument, variables: { id: 7 } }, result: { data: { game } } },
    ]
    await render(
        <MockedProvider mocks={mocks}>
            <GameScreen />
        </MockedProvider>,
    )
    expect(await screen.findByText('TOR 17 @ OTT 24')).toBeTruthy()
    expect(screen.getByText('20/30')).toBeTruthy() // passing C/A
    expect(screen.getByText('90')).toBeTruthy() // receiving yards
    expect(screen.getByText('2WK')).toBeTruthy() // receiver alignment
    // Zone split for the receiver: DL=3, SM=5; receptions = isComplete, no separate subtype
    expect(screen.getByLabelText('Targets by zone')).toHaveTextContent(
        /#81 J.Hardy\s*3\s*0\s*0\s*0\s*5\s*0/,
    )
    // EPA table sorted descending
    expect(screen.getByLabelText('EPA')).toHaveTextContent(
        /#12 D.Adams\s*6\.3\s*#81 J.Hardy\s*3\.1/,
    )
})

it('says so when the game is missing', async () => {
    const mocks = [
        {
            request: { query: GameDocument, variables: { id: 7 } },
            result: { data: { game: null } },
        },
    ]
    await render(
        <MockedProvider mocks={mocks}>
            <GameScreen />
        </MockedProvider>,
    )
    expect(await screen.findByText('Game not found.')).toBeTruthy()
})
