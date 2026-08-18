const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Apollo Client v4 depends on tslib, whose default Metro resolution lands on an
// ESM build that Metro's CJS interop can't destructure (TypeError: Cannot
// destructure property '__extends' of tslib.default). Aliasing tslib to its
// .es6.mjs entry resolves the helpers correctly. See:
// https://community.apollographql.com/t/cannot-destructure-property-extends-of-tslib-default-as-it-is-undefined/9501
const ALIASES = {
    tslib: 'tslib/tslib.es6.mjs',
}

const defaultResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
    const resolver = defaultResolveRequest ?? context.resolveRequest
    return resolver(context, ALIASES[moduleName] ?? moduleName, platform)
}

module.exports = config
