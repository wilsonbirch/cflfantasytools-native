import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen, within } from '@testing-library/react-native'
import TeamScreen from '../team/[slug]'
import { DepthChartListsDocument, MeDocument, TeamDocument } from '~/generated/graphql'

jest.mock('expo-router', () => ({
    Link: ({ children }: { children: React.ReactNode }) => {
        const { Text } = jest.requireActual('react-native')
        return <Text>{children}</Text>
    },
    Stack: { Screen: () => null },
    useLocalSearchParams: () => ({ slug: 'ott' }),
}))

const file = (id: number, fetchedAt: string, size: number) => ({
    __typename: 'DepthChartFile',
    id,
    fetchedAt,
    size,
    url: `https://api.example/depth-charts/files/${id}.pdf`,
})

const mocks = [
    { request: { query: MeDocument }, result: { data: { me: null } } },
    {
        request: { query: TeamDocument, variables: { slug: 'ott' } },
        result: {
            data: {
                team: { __typename: 'Team', id: 1, name: 'Ottawa Redblacks' },
                depthChartYears: [2026],
            },
        },
    },
    {
        request: { query: DepthChartListsDocument, variables: { slug: 'ott', year: 2026 } },
        result: {
            data: {
                team: {
                    __typename: 'Team',
                    id: 1,
                    coachingStaff: [
                        {
                            __typename: 'CoachingStaff',
                            id: 5,
                            role: 'OC',
                            person: 'T. Dinwiddie',
                            effectiveFrom: '2026-01-15T12:00:00Z',
                            effectiveTo: null,
                        },
                        {
                            __typename: 'CoachingStaff',
                            id: 4,
                            role: 'HC',
                            person: 'B. Dickenson',
                            effectiveFrom: '2025-01-10T12:00:00Z',
                            effectiveTo: null,
                        },
                    ],
                },
                depthChartLists: [
                    {
                        __typename: 'DepthChartList',
                        id: 1,
                        year: 2026,
                        charts: [
                            {
                                __typename: 'DepthChart',
                                id: 10,
                                title: 'Week 3 vs TOR',
                                week: 3,
                                season: 'Regular',
                                publishedAt: '2026-07-01T12:00:00Z',
                                url: 'https://club.example/w3.pdf',
                                files: [
                                    file(2, '2026-07-02T12:00:00Z', 2048),
                                    file(1, '2026-07-01T12:00:00Z', 1024),
                                ],
                            },
                        ],
                    },
                ],
            },
        },
    },
]

it('lists archived copies per chart and flags a replaced PDF', async () => {
    await render(
        <MockedProvider mocks={mocks}>
            <TeamScreen />
        </MockedProvider>,
    )
    // Two queries in sequence (team, then charts); CI runners need more than the 1s default.
    expect(await screen.findByLabelText('Open Week 3 vs TOR', {}, { timeout: 5000 })).toBeTruthy()
    expect(screen.getByText(/replaced at same URL/)).toBeTruthy()
    expect(screen.getByLabelText('Open archived copy from Jul 2, 2026')).toBeTruthy()
    expect(screen.getByText('1 KB')).toBeTruthy()
})

it('lists the season coaching staff HC first', async () => {
    await render(
        <MockedProvider mocks={mocks}>
            <TeamScreen />
        </MockedProvider>,
    )
    const list = await screen.findByLabelText('Coaching staff', {}, { timeout: 5000 })
    const names = within(list).getAllByText(/^(HC|OC|DC) /)
    expect(names.map((n) => n.props.children.join(''))).toEqual([
        'HC B. Dickenson',
        'OC T. Dinwiddie',
    ])
})
