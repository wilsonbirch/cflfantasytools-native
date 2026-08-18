# cflfantasytools-native

Expo (SDK 57) client for cflfantasytools — expo-router, Apollo Client, and the
same GraphQL API that `cflfantasytools-web` uses.

The goal is genuine parity with web: the same data, reached the same ways, with
a presentation layer suited to a phone. Every screen is a query web already
issues; the one web-only surface is `/admin`.

## Getting started

```bash
cp .env.example .env     # EXPO_PUBLIC_API_URL
npm install
npm start
```

A simulator or device cannot reach `localhost` — point `EXPO_PUBLIC_API_URL` at
your machine's LAN address or a deployed api.

## Checks

```bash
npm run lint && npm run format:check
npm run typecheck
npm run test
```

## Tokens

The refresh token lives in the OS keychain/keystore via `expo-secure-store`.
The access token is short-lived and stays **in memory only** — it is never
persisted. `src/lib/tokenStore.ts` owns both, and its tests assert that the
access token never reaches storage.

Refresh-on-401 lands in phase 2, alongside the api's `refresh` mutation.

## Schema contract

`schema.graphql` is a committed snapshot of the api's SDL. Refresh it with
`npm run schema:pull` against a running api, then re-run `npm run codegen`.
The api owns the schema, so changes ship as a stacked PR set with api first.
