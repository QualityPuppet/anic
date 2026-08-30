import type { Media } from "../anilist/MediaListCollections";
import { type IContest, Result, type Rankings, Ranking } from "./StrategyInterfaces";

export class Contest implements IContest {
    Challenger: Media;
    Defender: Media;
    Victor: number | null;

    constructor(challenger: Media, defender: Media) {
        this.Challenger = challenger;
        this.Defender = defender;
        this.Victor = null;
    }

    getLoserId(): number | null {
        if (!this.Victor) {
            return null;
        };

        return this.Challenger.id == this.Victor ? this.Defender.id : this.Challenger.id;
    }
}



export class TournamentStrategy implements Rankings {
    Store: Ranking[];
    CurrentPair: Contest | null;
    //TODO: Round object?
    Round: Contest[];
    RoundNumber: number;

    constructor(mediaList: Media[]) {
        // TODO: error handling
        if (mediaList.length < 2) {
            throw new Error("More than two pieces of media are required for ranking");
        }
        this.Store = mediaList.map(m => new Ranking(m));
        this.CurrentPair = null;
        this.Round = [];
        this.RoundNumber = 1;
    }

    generatePairs() {
        const buckets = new Map<number, Media[]>();
        for (const ranking of this.Store) {
            const score = ranking.getScore();

            if (!buckets.has(score)) {
                buckets.set(score, []);
            }

            buckets.get(score)!.push(ranking.Media);
        }

        const pairs: Contest[] = [];

        for (const bucket of buckets.values()) {
            for (let i = 0; i + 1 < bucket.length; i += 2) [
                // no typescript, that is not undefined.
                pairs.push(new Contest(bucket[i]!, bucket[i + 1]!))
            ]
        }

        this.Round = pairs;
        // again, this is not undefined. shh.
        this.CurrentPair = this.Round[0]!;

        console.log(buckets);
    }

    /**
     * @param winner The anilist ID of the winning Media
     */
    storeResult(winner: number) {
        // I don't really like how I'm having to do all this `.find`ing here, there has to be a better way but I think
        // for now I've architecturally boxed myself into a corner.
        // Cleanup for a v1.0 I guess.
        const roundResult = this.Round.find(c => c.Challenger == this.CurrentPair?.Challenger && c.Defender == this.CurrentPair?.Defender)!;
        roundResult.Victor = winner;
        const loserId = roundResult.getLoserId();

        if (!loserId) {
            //TODO: Error handling
            throw new Error("what.");
        }

        // the fact that these lines are exactly one off in length is... sad.
        this.Store.find(m => m.Media.id == winner)?.Media.contestRecords.push({ChallengerId: loserId, Result: Result.win })
        this.Store.find(m => m.Media.id == loserId)?.Media.contestRecords.push({ChallengerId: winner, Result: Result.loss})

        this.CurrentPair = this.nextPair();
    }

    nextPair(): Contest {
        if (this.Round.every(c => c.Victor !== null)) {
            this.RoundNumber++;
            this.generatePairs();
        }
        return this.Round.find(c => c.Victor == null)!;
    }
}

