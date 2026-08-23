import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { Empty, ErrorState, Loading } from '../State'

it('renders loading, empty and error with retry', async () => {
    const onRetry = jest.fn()
    await render(
        <>
            <Loading />
            <Empty message="Nothing yet." />
            <ErrorState message="Broke." onRetry={onRetry} />
        </>,
    )
    expect(screen.getByLabelText('Loading')).toBeTruthy()
    expect(screen.getByText('Nothing yet.')).toBeTruthy()
    await act(() => fireEvent.press(screen.getByLabelText('Retry')))
    expect(onRetry).toHaveBeenCalled()
})
