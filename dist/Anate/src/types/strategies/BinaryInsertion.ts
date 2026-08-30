import type { Media } from "../anilist/MediaListCollections";

export class BinaryInsertionStrategy {
    RankedStore: Media[] 
    InitialCollection: Media[]
    Current: MediaMerge;
    ComparisonMedia: Media;


    constructor(initialCollection: Media[]) {
        this.RankedStore = [];
        this.InitialCollection = initialCollection;

        // This is why C# is just plain superior to typescript.
        // No. InitialCollection is _never_ undefined, it's literally impossible to FORCIBLY pass undefined,
        // let alone accidentally. うるせよ
        this.RankedStore[0] = initialCollection[0]!;
        this.Current = this.nextItem();
        this.ComparisonMedia = this.getContestMedia();
    }

    populateFromSaved(rankedStore: Media[]) {
        this.RankedStore = rankedStore;
        // Avoid borked merges by just restarting the sort.
        this.Current = this.nextItem();
        this.ComparisonMedia = this.getContestMedia();
    }

    nextItem(): MediaMerge {
        const next = this.InitialCollection.find(m => !this.RankedStore.some(r => r.id === m.id))!
        const high = this.RankedStore.length > 1 ? this.RankedStore.length : 1;
        return new MediaMerge(next, high)
    }

    getContestMedia(): Media {
        return this.RankedStore[this.Current.mid]!;
    }

    sort(choice: number) {
        if (choice === 1) {
            console.warn("high")
            this.Current.high = this.Current.mid - 1;
            this.Current.insertIndex = this.Current.mid;
        }
        else {
            console.warn("low")
            this.Current.low = this.Current.mid + 1;
            this.Current.insertIndex = this.Current.mid + 1;
        }

        this.Current.mid = Math.floor((this.Current.low + this.Current.high) / 2)

        if (this.Current.low >= this.Current.high) {

            this.RankedStore.splice(this.Current.insertIndex, 0, this.Current.media)
            this.Current = this.nextItem()
            this.ComparisonMedia = this.getContestMedia();

        } 
        else {
            this.ComparisonMedia = this.getContestMedia();
        }
    }
}

class MediaMerge {
    media: Media
    high: number
    mid: number;
    low: number = 0;
    insertIndex: number = 0;

    constructor(media: Media, high: number) {
        this.media = media;
        this.high = high;
        this.mid = Math.floor((this.low + this.high) / 2);
    }

}