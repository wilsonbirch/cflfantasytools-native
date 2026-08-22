import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import AuthForm from '../AuthForm'

it('validates before calling onSubmit', async () => {
    const onSubmit = jest.fn(async () => {})
    await render(<AuthForm mode="register" onSubmit={onSubmit} />)
    const button = screen.getByLabelText('Create account')

    await fireEvent.press(button)
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address.')

    await fireEvent.changeText(screen.getByLabelText('Email'), ' a@b.co ')
    await fireEvent.changeText(screen.getByLabelText('Password'), 'short')
    await fireEvent.press(button)
    expect(screen.getByRole('alert')).toHaveTextContent('Password must be at least 8 characters.')
    expect(onSubmit).not.toHaveBeenCalled()

    await fireEvent.changeText(screen.getByLabelText('Password'), 'long enough')
    await fireEvent.press(button)
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('a@b.co', 'long enough'))
    expect(screen.queryByRole('alert')).toBeNull()
})

it('shows the submit error', async () => {
    await render(
        <AuthForm
            mode="login"
            onSubmit={async () => {
                throw new Error('Invalid email or password')
            }}
        />,
    )
    await fireEvent.changeText(screen.getByLabelText('Email'), 'a@b.co')
    await fireEvent.changeText(screen.getByLabelText('Password'), 'x')
    await fireEvent.press(screen.getByLabelText('Sign in'))
    await waitFor(() =>
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password'),
    )
})
