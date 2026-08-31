import { MediaListCollection, type Media } from "./anilist/MediaListCollections";

export interface RankingState {
    InitialCollection: MediaListCollection | null,
    Username: string,
    Loading: boolean
}