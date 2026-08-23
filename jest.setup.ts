// Global test setup.
// Screen tests mock Apollo at the boundary with MockedProvider.
// Tabs hide the native header, so ScreenHeader reads the safe-area inset; the
// library's jest mock supplies one without a provider.
jest.mock(
    'react-native-safe-area-context',
    () =>
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('react-native-safe-area-context/jest/mock').default,
)
export {}
