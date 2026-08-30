import type { Media } from "../anilist/MediaListCollections";
import type { Contest } from "./TournamentStrategy";

export interface IRanking {
    Media: Media
}
export interface IContest {
    Defender: Media,
    Challenger: Media,
    Victor: number | null
}

export interface ContestRecord {
    ChallengerId: number,
    Result: Result
}

export enum Result {
    win = 1,
    tie = 0,
    loss = -1
}

export interface Rankings {
    Store: Ranking[];
    CurrentPair: Contest| null;
    Round: Contest[];
    RoundNumber: number;

    generatePairs(): void;
    storeResult(winner: number): void;
    nextPair(): Contest;
}

export class Ranking implements IRanking {
    Media: Media;

    constructor(media: Media) {
        media.contestRecords = [];
        this.Media = media;
    }

    getScore() {
        if (this.Media.contestRecords.length === 0) {
            return 0;
        }
        return this.Media?.contestRecords
                    .filter(c => c.Result !== null)
                    .map(c => c.Result!.valueOf())
                    .reduce((accu, nextResult) => accu + nextResult);
    }
}