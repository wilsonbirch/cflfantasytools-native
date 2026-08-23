import { render, screen } from '@testing-library/react-native'
import Fantasy from '../(tabs)/fantasy'

it('explains the coming fantasy companion', async () => {
    await render(<Fantasy />)
    expect(screen.getByText('Fantasy')).toBeTruthy()
    expect(screen.getByLabelText('Value: –, points per $')).toBeTruthy()
})
