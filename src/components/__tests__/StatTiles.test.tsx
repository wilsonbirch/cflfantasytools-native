import { render, screen } from '@testing-library/react-native'
import StatTiles from '../StatTiles'

it('labels each tile with its value and hint', async () => {
    await render(
        <StatTiles
            tiles={[
                { label: 'Salary', value: 8500 },
                { label: 'Proj', value: 12.34, hint: 'GZ 11.0', tone: 'good' },
                { label: 'Last', value: null },
            ]}
        />,
    )
    expect(screen.getByLabelText('Salary: 8500')).toBeTruthy()
    expect(screen.getByLabelText('Proj: 12.3, GZ 11.0')).toBeTruthy()
    expect(screen.getByLabelText('Last: –')).toBeTruthy()
})
