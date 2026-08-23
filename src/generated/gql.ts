/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query Me {\n        me {\n            id\n            email\n            role\n        }\n    }\n": typeof types.MeDocument,
    "\n    mutation Logout($refreshToken: String!) {\n        logout(refreshToken: $refreshToken)\n    }\n": typeof types.LogoutDocument,
    "\n    query Games($year: Int!, $teamSlug: String) {\n        games(year: $year, teamSlug: $teamSlug, limit: 200) {\n            id\n            date\n            homeScore\n            awayScore\n            homeTeam {\n                id\n                abbreviation\n            }\n            awayTeam {\n                id\n                abbreviation\n            }\n        }\n    }\n": typeof types.GamesDocument,
    "\n    query Teams {\n        teams {\n            id\n            slug\n            name\n            city\n            abbreviation\n            isActive\n        }\n    }\n": typeof types.TeamsDocument,
    "\n    query PlayerSeasonStats($year: Int!, $teamSlug: String) {\n        playerSeasonStats(year: $year, teamSlug: $teamSlug, limit: 100) {\n            player\n            games\n            team {\n                id\n                abbreviation\n            }\n            passAttempts\n            completions\n            passingYards\n            passingTouchdowns\n            interceptions\n            rushAttempts\n            rushingYards\n            rushingTouchdowns\n            targets\n            receptions\n            receivingYards\n            receivingTouchdowns\n            epa\n        }\n    }\n": typeof types.PlayerSeasonStatsDocument,
    "\n    query Game($id: Int!) {\n        game(id: $id) {\n            id\n            date\n            homeScore\n            awayScore\n            homeTeam {\n                id\n                abbreviation\n            }\n            awayTeam {\n                id\n                abbreviation\n            }\n            boxScore {\n                team {\n                    id\n                    abbreviation\n                }\n                points\n                totalYards\n                passingYards\n                rushingYards\n                firstDowns\n                turnovers\n                plays\n                epa\n            }\n            playerStats {\n                player\n                team {\n                    id\n                    abbreviation\n                }\n                passAttempts\n                completions\n                passingYards\n                passingTouchdowns\n                interceptions\n                rushAttempts\n                rushingYards\n                rushingTouchdowns\n                targets\n                receptions\n                receivingYards\n                receivingTouchdowns\n                epa\n                targetsByZone {\n                    depth\n                    direction\n                    targets\n                }\n            }\n        }\n    }\n": typeof types.GameDocument,
    "\n    mutation Login($email: String!, $password: String!) {\n        login(email: $email, password: $password) {\n            accessToken\n            accessTokenExpiresAt\n            refreshToken\n        }\n    }\n": typeof types.LoginDocument,
    "\n    mutation Register($email: String!, $password: String!) {\n        register(email: $email, password: $password) {\n            accessToken\n            accessTokenExpiresAt\n            refreshToken\n        }\n    }\n": typeof types.RegisterDocument,
    "\n    query JobHealth {\n        jobHealth {\n            kind\n            isStale\n            ageMinutes\n            expectedEveryMinutes\n            lastSuccessAt\n        }\n    }\n": typeof types.JobHealthDocument,
    "\n    query Team($slug: String!) {\n        team(slug: $slug) {\n            id\n            name\n        }\n        depthChartYears(teamSlug: $slug)\n    }\n": typeof types.TeamDocument,
    "\n    query DepthChartLists($slug: String!, $year: Int!) {\n        depthChartLists(teamSlug: $slug, year: $year) {\n            id\n            year\n            charts {\n                id\n                title\n                week\n                season\n                publishedAt\n                url\n            }\n        }\n    }\n": typeof types.DepthChartListsDocument,
    "\n    query Seasons {\n        seasons\n    }\n": typeof types.SeasonsDocument,
    "\n    query MySubscriptions {\n        mySubscriptions {\n            id\n            enabled\n            team {\n                id\n                slug\n            }\n        }\n    }\n": typeof types.MySubscriptionsDocument,
    "\n    mutation Subscribe($teamSlug: String!) {\n        subscribe(teamSlug: $teamSlug) {\n            id\n            enabled\n        }\n    }\n": typeof types.SubscribeDocument,
    "\n    mutation Unsubscribe($teamSlug: String!) {\n        unsubscribe(teamSlug: $teamSlug) {\n            id\n            enabled\n        }\n    }\n": typeof types.UnsubscribeDocument,
    "\n    query LinkProbe {\n        me {\n            id\n        }\n    }\n": typeof types.LinkProbeDocument,
    "\n    mutation Refresh($refreshToken: String!) {\n        refresh(refreshToken: $refreshToken) {\n            accessToken\n            accessTokenExpiresAt\n            refreshToken\n        }\n    }\n": typeof types.RefreshDocument,
};
const documents: Documents = {
    "\n    query Me {\n        me {\n            id\n            email\n            role\n        }\n    }\n": types.MeDocument,
    "\n    mutation Logout($refreshToken: String!) {\n        logout(refreshToken: $refreshToken)\n    }\n": types.LogoutDocument,
    "\n    query Games($year: Int!, $teamSlug: String) {\n        games(year: $year, teamSlug: $teamSlug, limit: 200) {\n            id\n            date\n            homeScore\n            awayScore\n            homeTeam {\n                id\n                abbreviation\n            }\n            awayTeam {\n                id\n                abbreviation\n            }\n        }\n    }\n": types.GamesDocument,
    "\n    query Teams {\n        teams {\n            id\n            slug\n            name\n            city\n            abbreviation\n            isActive\n        }\n    }\n": types.TeamsDocument,
    "\n    query PlayerSeasonStats($year: Int!, $teamSlug: String) {\n        playerSeasonStats(year: $year, teamSlug: $teamSlug, limit: 100) {\n            player\n            games\n            team {\n                id\n                abbreviation\n            }\n            passAttempts\n            completions\n            passingYards\n            passingTouchdowns\n            interceptions\n            rushAttempts\n            rushingYards\n            rushingTouchdowns\n            targets\n            receptions\n            receivingYards\n            receivingTouchdowns\n            epa\n        }\n    }\n": types.PlayerSeasonStatsDocument,
    "\n    query Game($id: Int!) {\n        game(id: $id) {\n            id\n            date\n            homeScore\n            awayScore\n            homeTeam {\n                id\n                abbreviation\n            }\n            awayTeam {\n                id\n                abbreviation\n            }\n            boxScore {\n                team {\n                    id\n                    abbreviation\n                }\n                points\n                totalYards\n                passingYards\n                rushingYards\n                firstDowns\n                turnovers\n                plays\n                epa\n            }\n            playerStats {\n                player\n                team {\n                    id\n                    abbreviation\n                }\n                passAttempts\n                completions\n                passingYards\n                passingTouchdowns\n                interceptions\n                rushAttempts\n                rushingYards\n                rushingTouchdowns\n                targets\n                receptions\n                receivingYards\n                receivingTouchdowns\n                epa\n                targetsByZone {\n                    depth\n                    direction\n                    targets\n                }\n            }\n        }\n    }\n": types.GameDocument,
    "\n    mutation Login($email: String!, $password: String!) {\n        login(email: $email, password: $password) {\n            accessToken\n            accessTokenExpiresAt\n            refreshToken\n        }\n    }\n": types.LoginDocument,
    "\n    mutation Register($email: String!, $password: String!) {\n        register(email: $email, password: $password) {\n            accessToken\n            accessTokenExpiresAt\n            refreshToken\n        }\n    }\n": types.RegisterDocument,
    "\n    query JobHealth {\n        jobHealth {\n            kind\n            isStale\n            ageMinutes\n            expectedEveryMinutes\n            lastSuccessAt\n        }\n    }\n": types.JobHealthDocument,
    "\n    query Team($slug: String!) {\n        team(slug: $slug) {\n            id\n            name\n        }\n        depthChartYears(teamSlug: $slug)\n    }\n": types.TeamDocument,
    "\n    query DepthChartLists($slug: String!, $year: Int!) {\n        depthChartLists(teamSlug: $slug, year: $year) {\n            id\n            year\n            charts {\n                id\n                title\n                week\n                season\n                publishedAt\n                url\n            }\n        }\n    }\n": types.DepthChartListsDocument,
    "\n    query Seasons {\n        seasons\n    }\n": types.SeasonsDocument,
    "\n    query MySubscriptions {\n        mySubscriptions {\n            id\n            enabled\n            team {\n                id\n                slug\n            }\n        }\n    }\n": types.MySubscriptionsDocument,
    "\n    mutation Subscribe($teamSlug: String!) {\n        subscribe(teamSlug: $teamSlug) {\n            id\n            enabled\n        }\n    }\n": types.SubscribeDocument,
    "\n    mutation Unsubscribe($teamSlug: String!) {\n        unsubscribe(teamSlug: $teamSlug) {\n            id\n            enabled\n        }\n    }\n": types.UnsubscribeDocument,
    "\n    query LinkProbe {\n        me {\n            id\n        }\n    }\n": types.LinkProbeDocument,
    "\n    mutation Refresh($refreshToken: String!) {\n        refresh(refreshToken: $refreshToken) {\n            accessToken\n            accessTokenExpiresAt\n            refreshToken\n        }\n    }\n": types.RefreshDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Me {\n        me {\n            id\n            email\n            role\n        }\n    }\n"): (typeof documents)["\n    query Me {\n        me {\n            id\n            email\n            role\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Logout($refreshToken: String!) {\n        logout(refreshToken: $refreshToken)\n    }\n"): (typeof documents)["\n    mutation Logout($refreshToken: String!) {\n        logout(refreshToken: $refreshToken)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Games($year: Int!, $teamSlug: String) {\n        games(year: $year, teamSlug: $teamSlug, limit: 200) {\n            id\n            date\n            homeScore\n            awayScore\n            homeTeam {\n                id\n                abbreviation\n            }\n            awayTeam {\n                id\n                abbreviation\n            }\n        }\n    }\n"): (typeof documents)["\n    query Games($year: Int!, $teamSlug: String) {\n        games(year: $year, teamSlug: $teamSlug, limit: 200) {\n            id\n            date\n            homeScore\n            awayScore\n            homeTeam {\n                id\n                abbreviation\n            }\n            awayTeam {\n                id\n                abbreviation\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Teams {\n        teams {\n            id\n            slug\n            name\n            city\n            abbreviation\n            isActive\n        }\n    }\n"): (typeof documents)["\n    query Teams {\n        teams {\n            id\n            slug\n            name\n            city\n            abbreviation\n            isActive\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query PlayerSeasonStats($year: Int!, $teamSlug: String) {\n        playerSeasonStats(year: $year, teamSlug: $teamSlug, limit: 100) {\n            player\n            games\n            team {\n                id\n                abbreviation\n            }\n            passAttempts\n            completions\n            passingYards\n            passingTouchdowns\n            interceptions\n            rushAttempts\n            rushingYards\n            rushingTouchdowns\n            targets\n            receptions\n            receivingYards\n            receivingTouchdowns\n            epa\n        }\n    }\n"): (typeof documents)["\n    query PlayerSeasonStats($year: Int!, $teamSlug: String) {\n        playerSeasonStats(year: $year, teamSlug: $teamSlug, limit: 100) {\n            player\n            games\n            team {\n                id\n                abbreviation\n            }\n            passAttempts\n            completions\n            passingYards\n            passingTouchdowns\n            interceptions\n            rushAttempts\n            rushingYards\n            rushingTouchdowns\n            targets\n            receptions\n            receivingYards\n            receivingTouchdowns\n            epa\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Game($id: Int!) {\n        game(id: $id) {\n            id\n            date\n            homeScore\n            awayScore\n            homeTeam {\n                id\n                abbreviation\n            }\n            awayTeam {\n                id\n                abbreviation\n            }\n            boxScore {\n                team {\n                    id\n                    abbreviation\n                }\n                points\n                totalYards\n                passingYards\n                rushingYards\n                firstDowns\n                turnovers\n                plays\n                epa\n            }\n            playerStats {\n                player\n                team {\n                    id\n                    abbreviation\n                }\n                passAttempts\n                completions\n                passingYards\n                passingTouchdowns\n                interceptions\n                rushAttempts\n                rushingYards\n                rushingTouchdowns\n                targets\n                receptions\n                receivingYards\n                receivingTouchdowns\n                epa\n                targetsByZone {\n                    depth\n                    direction\n                    targets\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query Game($id: Int!) {\n        game(id: $id) {\n            id\n            date\n            homeScore\n            awayScore\n            homeTeam {\n                id\n                abbreviation\n            }\n            awayTeam {\n                id\n                abbreviation\n            }\n            boxScore {\n                team {\n                    id\n                    abbreviation\n                }\n                points\n                totalYards\n                passingYards\n                rushingYards\n                firstDowns\n                turnovers\n                plays\n                epa\n            }\n            playerStats {\n                player\n                team {\n                    id\n                    abbreviation\n                }\n                passAttempts\n                completions\n                passingYards\n                passingTouchdowns\n                interceptions\n                rushAttempts\n                rushingYards\n                rushingTouchdowns\n                targets\n                receptions\n                receivingYards\n                receivingTouchdowns\n                epa\n                targetsByZone {\n                    depth\n                    direction\n                    targets\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Login($email: String!, $password: String!) {\n        login(email: $email, password: $password) {\n            accessToken\n            accessTokenExpiresAt\n            refreshToken\n        }\n    }\n"): (typeof documents)["\n    mutation Login($email: String!, $password: String!) {\n        login(email: $email, password: $password) {\n            accessToken\n            accessTokenExpiresAt\n            refreshToken\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Register($email: String!, $password: String!) {\n        register(email: $email, password: $password) {\n            accessToken\n            accessTokenExpiresAt\n            refreshToken\n        }\n    }\n"): (typeof documents)["\n    mutation Register($email: String!, $password: String!) {\n        register(email: $email, password: $password) {\n            accessToken\n            accessTokenExpiresAt\n            refreshToken\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query JobHealth {\n        jobHealth {\n            kind\n            isStale\n            ageMinutes\n            expectedEveryMinutes\n            lastSuccessAt\n        }\n    }\n"): (typeof documents)["\n    query JobHealth {\n        jobHealth {\n            kind\n            isStale\n            ageMinutes\n            expectedEveryMinutes\n            lastSuccessAt\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Team($slug: String!) {\n        team(slug: $slug) {\n            id\n            name\n        }\n        depthChartYears(teamSlug: $slug)\n    }\n"): (typeof documents)["\n    query Team($slug: String!) {\n        team(slug: $slug) {\n            id\n            name\n        }\n        depthChartYears(teamSlug: $slug)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query DepthChartLists($slug: String!, $year: Int!) {\n        depthChartLists(teamSlug: $slug, year: $year) {\n            id\n            year\n            charts {\n                id\n                title\n                week\n                season\n                publishedAt\n                url\n            }\n        }\n    }\n"): (typeof documents)["\n    query DepthChartLists($slug: String!, $year: Int!) {\n        depthChartLists(teamSlug: $slug, year: $year) {\n            id\n            year\n            charts {\n                id\n                title\n                week\n                season\n                publishedAt\n                url\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Seasons {\n        seasons\n    }\n"): (typeof documents)["\n    query Seasons {\n        seasons\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query MySubscriptions {\n        mySubscriptions {\n            id\n            enabled\n            team {\n                id\n                slug\n            }\n        }\n    }\n"): (typeof documents)["\n    query MySubscriptions {\n        mySubscriptions {\n            id\n            enabled\n            team {\n                id\n                slug\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Subscribe($teamSlug: String!) {\n        subscribe(teamSlug: $teamSlug) {\n            id\n            enabled\n        }\n    }\n"): (typeof documents)["\n    mutation Subscribe($teamSlug: String!) {\n        subscribe(teamSlug: $teamSlug) {\n            id\n            enabled\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Unsubscribe($teamSlug: String!) {\n        unsubscribe(teamSlug: $teamSlug) {\n            id\n            enabled\n        }\n    }\n"): (typeof documents)["\n    mutation Unsubscribe($teamSlug: String!) {\n        unsubscribe(teamSlug: $teamSlug) {\n            id\n            enabled\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query LinkProbe {\n        me {\n            id\n        }\n    }\n"): (typeof documents)["\n    query LinkProbe {\n        me {\n            id\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Refresh($refreshToken: String!) {\n        refresh(refreshToken: $refreshToken) {\n            accessToken\n            accessTokenExpiresAt\n            refreshToken\n        }\n    }\n"): (typeof documents)["\n    mutation Refresh($refreshToken: String!) {\n        refresh(refreshToken: $refreshToken) {\n            accessToken\n            accessTokenExpiresAt\n            refreshToken\n        }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;