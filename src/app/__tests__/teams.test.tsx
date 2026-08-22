import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen } from '@testing-library/react-native'
import Teams from '../(tabs)/index'
import { TeamsDocument } from '~/generated/graphql'

const team = (id: number, slug: string, name: string, isActive = true) => ({
    __typename: 'Team',
    id,
    slug,
    name,
    city: null,
    abbreviation: slug.toUpperCase(),
    isActive,
})

it('lists active clubs as links to their depth charts', async () => {
    const mocks = [
        {
            request: { query: TeamsDocument },
            result: {
                data: {
                    teams: [team(1, 'ott', 'Ottawa Redblacks'), team(2, 'mtl', 'Montreal', false)],
                },
            },
        },
    ]
    await render(
        <MockedProvider mocks={mocks}>
            <Teams />
        </MockedProvider>,
    )
    expect(await screen.findByLabelText('Ottawa Redblacks depth charts')).toBeTruthy()
    expect(screen.queryByText('Montreal')).toBeNull()
})
