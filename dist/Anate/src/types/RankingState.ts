import { MediaListCollection, type Media } from "./anilist/MediaListCollections";
import type { RankNode } from "./RankNode";

export interface IRankingState {
    InitialCollection: MediaListCollection | null,
    TreeData: RankNode[],
    Username: string
}