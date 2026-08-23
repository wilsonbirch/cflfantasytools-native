import { render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import ScreenHeader from '../ScreenHeader'

it('shows the title, context line and children', async () => {
    await render(
        <ScreenHeader title="Stats" context="2026 season · Receiving leaders" accent="#abc">
            <Text>filters</Text>
        </ScreenHeader>,
    )
    expect(screen.getByText('Stats')).toBeTruthy()
    expect(screen.getByText('2026 season · Receiving leaders')).toBeTruthy()
    expect(screen.getByText('filters')).toBeTruthy()
})
