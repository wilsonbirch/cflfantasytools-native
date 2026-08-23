import { MockedProvider } from '@apollo/client/testing/react'
import { act, fireEvent, render, screen } from '@testing-library/react-native'
import Fantasy from '../(tabs)/fantasy'
import {
    FantasyPlayersDocument,
    GameweeksDocument,
    SeasonsDocument,
    TeamsDocument,
} from '~/generated/graphql'

const mockPush = jest.fn()
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }))

const gw = (id: number, week: number, status: string) => ({
    __typename: 'Gameweek',
    id,
    week,
    name: `Gameweek ${week}`,
    status,
    startDate: '2026-08-20T12:00:00Z',
})
const player = (id: number, name: string, salary: number, points: number) => ({
    __typename: 'FantasyPlayer',
    id,
    name,
    position: 'WIDE_RECEIVER',
    salary,
    isLocked: false,
    gameZoneProjection: 10,
    seasonPoints: 80,
    lastGameweekPoints: 12.5,
    value: points / (salary / 1000),
    team: { __typename: 'Team', id: 1, slug: 'ottawa-redblacks', abbreviation: 'OTT' },
    projection: { __typename: 'Projection', id, points },
})

const mocks = [
    { request: { query: TeamsDocument }, result: { data: { teams: [] } } },
    { request: { query: SeasonsDocument }, result: { data: { seasons: [2026] } } },
    {
        request: { query: GameweeksDocument, variables: { year: 2026 } },
        result: { data: { gameweeks: [gw(1, 1, 'complete'), gw(2, 2, 'scheduled')] } },
    },
    {
        request: {
            query: FantasyPlayersDocument,
            variables: { gameweekId: 2, teamSlug: null, position: null },
        },
        result: {
            data: {
                fantasyPlayers: [player(7, 'J. Hardy', 9000, 14), player(8, 'K. Lee', 6000, 9)],
            },
        },
    },
]

it('defaults to the first incomplete gameweek, sorts by header and opens a player', async () => {
    await render(
        <MockedProvider mocks={mocks}>
            <Fantasy />
        </MockedProvider>,
    )
    expect(await screen.findByText('J. Hardy · WR OTT')).toBeTruthy()
    expect(screen.getByText('2026 · Gameweek 2 · locks Aug 20, 2026')).toBeTruthy()
    expect(screen.getByLabelText('Gameweek 2').props.accessibilityState.selected).toBe(true)

    // Value column: K. Lee (1.5/$k) beats J. Hardy (1.56/$k)? No — Hardy 1.56 > Lee 1.5.
    await act(() => fireEvent.press(screen.getByLabelText('Sort by Val')))
    await act(() => fireEvent.press(screen.getByLabelText('Sort by Val'))) // ascending
    const rows = screen.getAllByRole('button').map((b) => b.props.accessibilityLabel)
    expect(rows.indexOf('K. Lee · WR OTT')).toBeLessThan(rows.indexOf('J. Hardy · WR OTT'))

    await act(() => fireEvent.press(screen.getByLabelText('J. Hardy · WR OTT')))
    expect(mockPush).toHaveBeenCalledWith({
        pathname: '/fantasy/[id]',
        params: { id: '7', gw: '2' },
    })
})
