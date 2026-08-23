import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen } from '@testing-library/react-native'
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
    expect(await screen.findByLabelText('Open Week 3 vs TOR')).toBeTruthy()
    expect(screen.getByText(/replaced at same URL/)).toBeTruthy()
    expect(screen.getByLabelText('Open archived copy from Jul 2, 2026')).toBeTruthy()
    expect(screen.getByText('1 KB')).toBeTruthy()
})
