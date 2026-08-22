import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen } from '@testing-library/react-native'
import Status from '../status'
import { JobHealthDocument } from '~/generated/graphql'

it('lists each job with its freshness', async () => {
    const mocks = [
        {
            request: { query: JobHealthDocument },
            result: {
                data: {
                    jobHealth: [
                        {
                            __typename: 'JobHealth',
                            kind: 'depth-chart-scrape',
                            isStale: false,
                            ageMinutes: 12,
                            expectedEveryMinutes: 60,
                            lastSuccessAt: '2026-08-22T10:00:00Z',
                        },
                        {
                            __typename: 'JobHealth',
                            kind: 'fantasy-sync',
                            isStale: true,
                            ageMinutes: null,
                            expectedEveryMinutes: 60,
                            lastSuccessAt: null,
                        },
                    ],
                },
            },
        },
    ]
    await render(
        <MockedProvider mocks={mocks}>
            <Status />
        </MockedProvider>,
    )
    expect(
        await screen.findByLabelText('depth-chart-scrape: fresh, last success 12 min ago'),
    ).toBeTruthy()
    expect(screen.getByLabelText('fantasy-sync: stale, last success never')).toBeTruthy()
})
