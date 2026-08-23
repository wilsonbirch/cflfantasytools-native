// Jest config for the Expo app. `jest-expo` wires up the Babel transform
// (babel-preset-expo handles TS/JSX) and a sensible transformIgnorePatterns
// for the RN/Expo runtime. We extend that list with the ESM-shipped packages
// our app pulls in (@apollo/client, graphql) so they get transpiled too.
module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    // The first render in a file pays react-native's lazy module loading, which
    // on CI runners can eat most of jest's 5s default.
    testTimeout: 20000,
    moduleNameMapper: {
        // Metro understands CSS; Jest does not. Stub it (side-effect-only imports).
        '\\.css$': '<rootDir>/jest/style-mock.js',
    },
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|standard-navigation|@apollo/.*|graphql))',
    ],
}
