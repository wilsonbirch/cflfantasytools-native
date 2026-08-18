import type { CodegenConfig } from '@graphql-codegen/cli'

// Generates typed operations from the COMMITTED SDL snapshot plus the documents
// in src/. Reading the local snapshot keeps codegen offline and deterministic,
// so CI needs neither a live api nor a database. Refresh the snapshot with
// `npm run schema:pull` against a running api — a stacked-PR moment, since the
// api owns the schema and merges first.
const config: CodegenConfig = {
    schema: './schema.graphql',
    documents: ['src/**/*.{ts,tsx}', '!src/generated/**'],
    ignoreNoDocuments: true,
    generates: {
        './src/generated/': {
            preset: 'client',
            presetConfig: {
                // No fragment masking — simpler ergonomics for an app this size.
                fragmentMasking: false,
            },
            config: {
                // The api serializes DateTime as ISO strings over the wire.
                scalars: { DateTime: 'string', JSON: 'unknown' },
                useTypeImports: true,
            },
        },
    },
}

export default config
