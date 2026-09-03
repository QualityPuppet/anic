import type {
    Media,
    MediaListCollection
} from "./anilist/MediaListCollections";

export interface RankingState {
    InitialCollection: MediaListCollection | null;
    Username: string;
    Loading: boolean;
}
