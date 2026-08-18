// Flat ESLint config — extends Expo's recommended flat config (which bundles
// the TypeScript + React Native rules) and ignores generated/build output.
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')

module.exports = defineConfig([
    expoConfig,
    {
        // Generated GraphQL types and build output are not ours to lint.
        ignores: ['dist/**', 'src/generated/**', '.expo/**'],
    },
])
