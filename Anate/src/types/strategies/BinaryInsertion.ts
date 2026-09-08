import type { NodeDropType } from "element-plus";
import { useRankingStore } from "@/stores/rankings";
import type { Media } from "../anilist/MediaListCollections";
import type { SortItem, SortingStrategy } from "./StrategyInterface";

export default class BinaryInsertionStrategy implements SortingStrategy {
    CurrentRankings: Media[];
    InitialCollection: Media[];
    Current: BinaryInsertionItem;
    ComparisonMedia: Media;
    Store = useRankingStore();
    Complete: boolean = false;

    constructor(initialCollection: Media[]) {
        this.CurrentRankings = [];
        this.InitialCollection = initialCollection;

        // This is why C# is just plain superior to typescript.
        // No. InitialCollection is _never_ undefined, it's literally impossible to FORCIBLY pass undefined,
        // let alone accidentally. うるせよ
        // although, TODO: don't auto-populate
        this.CurrentRankings[0] = initialCollection[0]!;
        this.Current = this.getUnsortedItem()!;
        this.ComparisonMedia = this.getContestMedia();
    }

    loadRankings(rankedStore: Media[]) {
        //TODO: More solid check ehre
        if (this.CurrentRankings.length === 1) {
            this.CurrentRankings = rankedStore;
            // Avoid borked merges by just restarting the sort.
            this.nextItem();
            // TODO: Add an error if we're trying to load over other rankings
        }
    }

    nextItem() {
        const next = this.getUnsortedItem();
        if (!next) {
            this.Store.rankings = this.CurrentRankings;
            return;
        }
        this.Current = next;
        this.ComparisonMedia = this.getContestMedia();
        this.Store.rankings = this.CurrentRankings;
    }

    getUnsortedItem(): BinaryInsertionItem | null {
        if (this.CurrentRankings.length === this.InitialCollection.length) {
            this.Complete = true;
            return null;
        }

        const next = this.InitialCollection.find(
            (m) => !this.CurrentRankings.some((r) => r.id === m.id)
        )!;
        const high =
            this.CurrentRankings.length > 1 ? this.CurrentRankings.length : 1;
        return new BinaryInsertionItem(next, high);
    }

    getContestMedia(): Media {
        return this.CurrentRankings[this.Current.mid]!;
    }

    // TODO: Update to ID
    shiftItems(
        draggedLabel: string,
        droppedLabel: string | null,
        dropType: NodeDropType
    ) {
        const dragged = this.CurrentRankings.find(
            (r) => r.title.english === draggedLabel
        )!;
        this.CurrentRankings.splice(
            this.CurrentRankings.findIndex(
                (r) => r.title.english === draggedLabel
            ),
            1
        );

        if (droppedLabel) {
            // TODO: if it works but it's bad, it's bad.
            // Nothing's more permanent than a temporary fix.
            const dropped = this.CurrentRankings.findIndex(
                (r) => r.title.english === droppedLabel
            )!;
            const shift = dropType === "before" ? 0 : 1;
            this.CurrentRankings.splice(dropped + shift, 0, dragged);
        }

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
            this.CurrentRankings.splice(
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
