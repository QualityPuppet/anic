import { MediaListCollection, type Media } from "./anilist/MediaListCollections";
import type { RankNode } from "./RankNode";
import type { Contest } from "./strategies/TournamentStrategy";
import type { Rankings } from "./strategies/StrategyInterfaces";

export interface IRankingState {
    InitialCollection: MediaListCollection | null,
    Rankings: Rankings | null,
    TreeData: RankNode[],
    Username: string
}