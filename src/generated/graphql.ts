/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CoachingRole =
  | 'DC'
  | 'HC'
  | 'OC';

/** OK: positions were read. UNSUPPORTED: this club's layout has no parser yet. FAILED: the parser ran and could not read the file. */
export type DepthChartParseStatus =
  | 'FAILED'
  | 'OK'
  | 'UNSUPPORTED';

export type PassDepth =
  | 'DEEP'
  | 'SHORT';

export type PassDirection =
  | 'LEFT'
  | 'MIDDLE'
  | 'RIGHT';

export type Role =
  | 'ADMIN'
  | 'USER';

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: number, email: string, role: Role } | null };

export type LogoutMutationVariables = Exact<{
  refreshToken: string;
}>;


export type LogoutMutation = { logout: boolean };

export type GamesQueryVariables = Exact<{
  year: number;
  teamSlug?: string | null | undefined;
}>;


export type GamesQuery = { games: Array<{ id: number, date: string | null, homeScore: number | null, awayScore: number | null, homeTeam: { id: number, slug: string, abbreviation: string } | null, awayTeam: { id: number, slug: string, abbreviation: string } | null }> };

export type TeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type TeamsQuery = { teams: Array<{ id: number, slug: string, name: string, city: string | null, abbreviation: string, isActive: boolean }> };

export type PlayerSeasonStatsQueryVariables = Exact<{
  year: number;
  teamSlug?: string | null | undefined;
}>;


export type PlayerSeasonStatsQuery = { playerSeasonStats: Array<{ player: string, games: number, passAttempts: number, completions: number, passingYards: number, passingTouchdowns: number, interceptions: number, rushAttempts: number, rushingYards: number, rushingTouchdowns: number, targets: number, receptions: number, receivingYards: number, receivingTouchdowns: number, primaryAlignment: string | null, epa: number, team: { id: number, slug: string, abbreviation: string } }> };

export type TeamAlignmentQueryVariables = Exact<{
  slug: string;
  year: number;
  week?: number | null | undefined;
}>;


export type TeamAlignmentQuery = { teamAlignment: { week: number, chart: { id: number, title: string, publishedAt: string }, positions: Array<{ position: string, depth: number, jersey: number | null, player: string }> } | null, depthChartLists: Array<{ id: number, charts: Array<{ id: number, week: number, parseStatus: DepthChartParseStatus | null }> }> };

export type GameQueryVariables = Exact<{
  id: number;
}>;


export type GameQuery = { game: { id: number, date: string | null, homeScore: number | null, awayScore: number | null, homeTeam: { id: number, slug: string, abbreviation: string } | null, awayTeam: { id: number, slug: string, abbreviation: string } | null, boxScore: Array<{ points: number, totalYards: number, passingYards: number, rushingYards: number, firstDowns: number, turnovers: number, plays: number, epa: number, team: { id: number, abbreviation: string } }>, playerStats: Array<{ player: string, alignment: string | null, passAttempts: number, completions: number, passingYards: number, passingTouchdowns: number, interceptions: number, rushAttempts: number, rushingYards: number, rushingTouchdowns: number, targets: number, receptions: number, receivingYards: number, receivingTouchdowns: number, epa: number, team: { id: number, abbreviation: string }, targetsByZone: Array<{ depth: PassDepth, direction: PassDirection, targets: number }> }> } | null };

export type LoginMutationVariables = Exact<{
  email: string;
  password: string;
}>;


export type LoginMutation = { login: { accessToken: string, accessTokenExpiresAt: string, refreshToken: string } };

export type RegisterMutationVariables = Exact<{
  email: string;
  password: string;
}>;


export type RegisterMutation = { register: { accessToken: string, accessTokenExpiresAt: string, refreshToken: string } };

export type JobHealthQueryVariables = Exact<{ [key: string]: never; }>;


export type JobHealthQuery = { jobHealth: Array<{ kind: string, isStale: boolean, ageMinutes: number | null, expectedEveryMinutes: number, lastSuccessAt: string | null }> };

export type TeamQueryVariables = Exact<{
  slug: string;
}>;


export type TeamQuery = { depthChartYears: Array<number>, team: { id: number, name: string } | null };

export type DepthChartListsQueryVariables = Exact<{
  slug: string;
  year: number;
}>;


export type DepthChartListsQuery = { team: { id: number, coachingStaff: Array<{ id: number, role: CoachingRole, person: string, effectiveFrom: string, effectiveTo: string | null }> } | null, depthChartLists: Array<{ id: number, year: number, charts: Array<{ id: number, title: string, week: number, season: string, publishedAt: string, url: string, files: Array<{ id: number, fetchedAt: string, size: number, url: string }> }> }> };

export type SeasonsQueryVariables = Exact<{ [key: string]: never; }>;


export type SeasonsQuery = { seasons: Array<number> };

export type MySubscriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type MySubscriptionsQuery = { mySubscriptions: Array<{ id: number, enabled: boolean, team: { id: number, slug: string } }> };

export type SubscribeMutationVariables = Exact<{
  teamSlug: string;
}>;


export type SubscribeMutation = { subscribe: { id: number, enabled: boolean } };

export type UnsubscribeMutationVariables = Exact<{
  teamSlug: string;
}>;


export type UnsubscribeMutation = { unsubscribe: { id: number, enabled: boolean } };

export type LinkProbeQueryVariables = Exact<{ [key: string]: never; }>;


export type LinkProbeQuery = { me: { id: number } | null };

export type RefreshMutationVariables = Exact<{
  refreshToken: string;
}>;


export type RefreshMutation = { refresh: { accessToken: string, accessTokenExpiresAt: string, refreshToken: string } };


export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}]}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const GamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Games"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"200"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"homeScore"}},{"kind":"Field","name":{"kind":"Name","value":"awayScore"}},{"kind":"Field","name":{"kind":"Name","value":"homeTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}}]}}]}}]} as unknown as DocumentNode<GamesQuery, GamesQueryVariables>;
export const TeamsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<TeamsQuery, TeamsQueryVariables>;
export const PlayerSeasonStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlayerSeasonStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playerSeasonStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"player"}},{"kind":"Field","name":{"kind":"Name","value":"games"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"passAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"completions"}},{"kind":"Field","name":{"kind":"Name","value":"passingYards"}},{"kind":"Field","name":{"kind":"Name","value":"passingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"interceptions"}},{"kind":"Field","name":{"kind":"Name","value":"rushAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"rushingYards"}},{"kind":"Field","name":{"kind":"Name","value":"rushingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"receptions"}},{"kind":"Field","name":{"kind":"Name","value":"receivingYards"}},{"kind":"Field","name":{"kind":"Name","value":"receivingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"primaryAlignment"}},{"kind":"Field","name":{"kind":"Name","value":"epa"}}]}}]}}]} as unknown as DocumentNode<PlayerSeasonStatsQuery, PlayerSeasonStatsQueryVariables>;
export const TeamAlignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamAlignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"week"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamAlignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"week"},"value":{"kind":"Variable","name":{"kind":"Name","value":"week"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"chart"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"jersey"}},{"kind":"Field","name":{"kind":"Name","value":"player"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"depthChartLists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"charts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"parseStatus"}}]}}]}}]}}]} as unknown as DocumentNode<TeamAlignmentQuery, TeamAlignmentQueryVariables>;
export const GameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Game"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"homeScore"}},{"kind":"Field","name":{"kind":"Name","value":"awayScore"}},{"kind":"Field","name":{"kind":"Name","value":"homeTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boxScore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"totalYards"}},{"kind":"Field","name":{"kind":"Name","value":"passingYards"}},{"kind":"Field","name":{"kind":"Name","value":"rushingYards"}},{"kind":"Field","name":{"kind":"Name","value":"firstDowns"}},{"kind":"Field","name":{"kind":"Name","value":"turnovers"}},{"kind":"Field","name":{"kind":"Name","value":"plays"}},{"kind":"Field","name":{"kind":"Name","value":"epa"}}]}},{"kind":"Field","name":{"kind":"Name","value":"playerStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"player"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"passAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"completions"}},{"kind":"Field","name":{"kind":"Name","value":"passingYards"}},{"kind":"Field","name":{"kind":"Name","value":"passingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"interceptions"}},{"kind":"Field","name":{"kind":"Name","value":"rushAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"rushingYards"}},{"kind":"Field","name":{"kind":"Name","value":"rushingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"receptions"}},{"kind":"Field","name":{"kind":"Name","value":"receivingYards"}},{"kind":"Field","name":{"kind":"Name","value":"receivingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"epa"}},{"kind":"Field","name":{"kind":"Name","value":"targetsByZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GameQuery, GameQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"accessTokenExpiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"accessTokenExpiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const JobHealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JobHealth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobHealth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"isStale"}},{"kind":"Field","name":{"kind":"Name","value":"ageMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"expectedEveryMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"lastSuccessAt"}}]}}]}}]} as unknown as DocumentNode<JobHealthQuery, JobHealthQueryVariables>;
export const TeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Team"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"depthChartYears"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}]}}]} as unknown as DocumentNode<TeamQuery, TeamQueryVariables>;
export const DepthChartListsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DepthChartLists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"coachingStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"person"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveFrom"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveTo"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"depthChartLists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"charts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fetchedAt"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DepthChartListsQuery, DepthChartListsQueryVariables>;
export const SeasonsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Seasons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seasons"}}]}}]} as unknown as DocumentNode<SeasonsQuery, SeasonsQueryVariables>;
export const MySubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MySubscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mySubscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<MySubscriptionsQuery, MySubscriptionsQueryVariables>;
export const SubscribeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Subscribe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]} as unknown as DocumentNode<SubscribeMutation, SubscribeMutationVariables>;
export const UnsubscribeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Unsubscribe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsubscribe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]} as unknown as DocumentNode<UnsubscribeMutation, UnsubscribeMutationVariables>;
export const LinkProbeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LinkProbe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<LinkProbeQuery, LinkProbeQueryVariables>;
export const RefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Refresh"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"accessTokenExpiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshMutation, RefreshMutationVariables>;