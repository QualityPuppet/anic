import type { RankingStore } from "@/stores/rankings";
import type { Media } from "../anilist/MediaListCollections";

export interface SortingStrategy {
    CurrentRankings: Media[];
    InitialCollection: Media[];
    Current: SortItem;
    ComparisonMedia: Media;
    Store: RankingStore;
}

export interface SortItem {
    media: Media;
}
