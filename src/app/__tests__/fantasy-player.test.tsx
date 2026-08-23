import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen } from '@testing-library/react-native'
import FantasyPlayerScreen from '../fantasy/[id]'
import { FantasyPlayerDocument } from '~/generated/graphql'

jest.mock('expo-router', () => ({
    useLocalSearchParams: () => ({ id: '7', gw: '2' }),
    Stack: { Screen: () => null },
}))

const mocks = [
    {
        request: { query: FantasyPlayerDocument, variables: { id: 7, gameweekId: 2 } },
        result: {
            data: {
                fantasyPlayer: {
                    __typename: 'FantasyPlayer',
                    id: 7,
                    name: 'J. Hardy',
                    position: 'WIDE_RECEIVER',
                    salary: 9000,
                    weekSalaryChange: 500,
                    status: 'active',
                    injuredText: 'Questionable (hamstring)',
                    isLocked: false,
                    gameZoneProjection: 10,
                    avgPoints: 11.2,
                    seasonPoints: 80,
                    lastGameweekPoints: 12.5,
                    value: 1.56,
                    team: {
                        __typename: 'Team',
                        id: 1,
                        slug: 'ottawa-redblacks',
                        abbreviation: 'OTT',
                    },
                    pointsHistory: [
                        {
                            __typename: 'GameweekPoints',
                            gameweek: { __typename: 'Gameweek', id: 1, week: 1 },
                            points: 8,
                        },
                        {
                            __typename: 'GameweekPoints',
                            gameweek: { __typename: 'Gameweek', id: 2, week: 2 },
                            points: 16,
                        },
                    ],
                    salaryHistory: [
                        {
                            __typename: 'SalarySnapshot',
                            capturedAt: '2026-08-01T12:00:00Z',
                            salary: 8500,
                            weekSalaryChange: 0,
                        },
                        {
                            __typename: 'SalarySnapshot',
                            capturedAt: '2026-08-15T12:00:00Z',
                            salary: 9000,
                            weekSalaryChange: 500,
                        },
                    ],
                    projection: {
                        __typename: 'Projection',
                        id: 3,
                        points: 14,
                        epa: 1.2,
                        alignment: '1S',
                        games: 6,
                        fittedAt: '2026-08-19T12:00:00Z',
                        opponent: { __typename: 'Team', id: 2, abbreviation: 'TOR' },
                        passAttempts: 0,
                        passingYards: 0,
                        passingTouchdowns: 0,
                        interceptions: 0,
                        rushAttempts: 0,
                        rushingYards: 0,
                        rushingTouchdowns: 0,
                        targets: 7.5,
                        receptions: 5.2,
                        receivingYards: 68,
                        receivingTouchdowns: 0.4,
                    },
                },
            },
        },
    },
]

it('shows tiles, history bars and the projection breakdown', async () => {
    await render(
        <MockedProvider mocks={mocks}>
            <FantasyPlayerScreen />
        </MockedProvider>,
    )
    expect(await screen.findByLabelText('Salary $k: 9, +0.5 wk')).toBeTruthy()
    expect(screen.getByLabelText('Our proj: 14, +4 vs GZ')).toBeTruthy()
    expect(screen.getByText('Questionable (hamstring)')).toBeTruthy()
    expect(screen.getByLabelText('GW 2: 16')).toBeTruthy()
    expect(screen.getByLabelText('Aug 15, 2026: 9')).toBeTruthy()
    expect(screen.getByText('Targets')).toBeTruthy()
    expect(screen.queryByText('Pass att')).toBeNull()
    expect(
        screen.getByText('Role 1S · vs TOR · 6 games behind the player term · fitted Aug 19, 2026'),
    ).toBeTruthy()
})
