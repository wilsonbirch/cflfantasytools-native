import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen } from '@testing-library/react-native'
import AlignmentScreen from '../alignment/[slug]'
import { TeamAlignmentDocument } from '~/generated/graphql'

jest.mock('expo-router', () => ({
    Stack: { Screen: () => null },
    useLocalSearchParams: () => ({ slug: 'ott', year: '2026' }),
}))

const pos = (position: string, depth: number, player: string, jersey: number | null = null) => ({
    __typename: 'DepthChartPosition',
    position,
    depth,
    jersey,
    player,
})

const mocks = [
    {
        request: {
            query: TeamAlignmentDocument,
            variables: { slug: 'ott', year: 2026, week: undefined },
        },
        result: {
            data: {
                teamAlignment: {
                    __typename: 'TeamAlignment',
                    week: 4,
                    weeks: [3, 4],
                    chart: {
                        __typename: 'DepthChart',
                        id: 10,
                        title: 'Week 4',
                        publishedAt: '2026-07-10T12:00:00Z',
                    },
                    positions: [
                        pos('2WK', 2, 'B. Second'),
                        pos('2WK', 1, 'A. Starter', 81),
                        pos('1S', 1, 'C. Wide'),
                        pos('1WK', 1, 'D. Boundary'),
                    ],
                },
            },
        },
    },
]

it('orders positions strong side outside-in, then weak side, depth within', async () => {
    await render(
        <MockedProvider mocks={mocks}>
            <AlignmentScreen />
        </MockedProvider>,
    )
    expect(await screen.findByLabelText('1S depth')).toBeTruthy()
    const rows = screen.getAllByLabelText(/ depth$/)
    expect(rows.map((r) => r.props.accessibilityLabel)).toEqual([
        '1S depth',
        '1WK depth',
        '2WK depth',
    ])
    expect(screen.getByText('#81 A. Starter › B. Second')).toBeTruthy()
    // Only parsed-OK weeks are offered.
    expect(screen.getByLabelText('Week 3')).toBeTruthy()
    expect(screen.queryByLabelText('Week 5')).toBeNull()
})
