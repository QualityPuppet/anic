import type { NodeDropType } from "element-plus";
import type { Media } from "../anilist/MediaListCollections";
import { useRankingStore } from "@/stores/rankings";
import type { SortItem, SortingStrategy } from "./StrategyInterface";

export default class BinaryInsertionStrategy implements SortingStrategy {
    RankedStore: Media[];
    InitialCollection: Media[];
    Current: BinaryInsertionItem;
    ComparisonMedia: Media;
    Store = useRankingStore();

    constructor(initialCollection: Media[]) {
        this.RankedStore = [];
        this.InitialCollection = initialCollection;

        // This is why C# is just plain superior to typescript.
        // No. InitialCollection is _never_ undefined, it's literally impossible to FORCIBLY pass undefined,
        // let alone accidentally. うるせよ
        this.RankedStore[0] = initialCollection[0]!;
        this.Current = this.getUnsortedItem();
        this.ComparisonMedia = this.getContestMedia();
    }

    loadRankings(rankedStore: Media[]) {
        if (this.RankedStore.length > 0) {
            this.RankedStore = rankedStore;
        }
        // Avoid borked merges by just restarting the sort.
        this.nextItem();
    }

    nextItem() {
        this.Current = this.getUnsortedItem();
        this.ComparisonMedia = this.getContestMedia();
        this.Store.rankings = this.RankedStore;
    }

    getUnsortedItem(): BinaryInsertionItem {
        const next = this.InitialCollection.find(
            (m) => !this.RankedStore.some((r) => r.id === m.id)
        )!;
        const high = this.RankedStore.length > 1 ? this.RankedStore.length : 1;
        return new BinaryInsertionItem(next, high);
    }

    getContestMedia(): Media {
        return this.RankedStore[this.Current.mid]!;
    }

    shiftItems(
        draggedLabel: string,
        droppedLabel: string,
        dropType: NodeDropType
    ) {
        const dragged = this.RankedStore.find(
            (r) => r.title.english == draggedLabel
        )!;
        this.RankedStore.splice(
            this.RankedStore.findIndex((r) => r.title.english == draggedLabel),
            1
        );

        const dropped = this.RankedStore.findIndex(
            (r) => r.title.english == droppedLabel
        )!;
        const shift = dropType == "before" ? 0 : 1;
        this.RankedStore.splice(dropped + shift, 0, dragged);

        this.nextItem();
    }

    sort(choice: number) {
        if (choice === 1) {
            this.Current.high = this.Current.mid - 1;
            this.Current.insertIndex = this.Current.mid;
        } else {
            this.Current.low = this.Current.mid + 1;
            this.Current.insertIndex = this.Current.mid + 1;
        }

        this.Current.mid = Math.floor(
            (this.Current.low + this.Current.high) / 2
        );

        if (this.Current.low >= this.Current.high) {
            this.RankedStore.splice(
                this.Current.insertIndex,
                0,
                this.Current.media
            );
            this.nextItem();
        } else {
            this.ComparisonMedia = this.getContestMedia();
        }
    }
}

class BinaryInsertionItem implements SortItem {
    media: Media;
    high: number;
    mid: number;
    low: number = 0;
    insertIndex: number = 0;

    constructor(media: Media, high: number) {
        this.media = media;
        this.high = high;
        this.mid = Math.floor((this.low + this.high) / 2);
    }
}
