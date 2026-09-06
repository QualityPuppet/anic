import { expect, describe, beforeEach, vi, test } from "vitest";
import BinaryInsertion from "../../src/types/strategies/BinaryInsertion";
import { BasicMediaList } from "../_helpers/testData/MediaTestData";
import { computed, ref } from "vue";
import { Media } from "../../src/types/anilist/MediaListCollections";

vi.mock("@/stores/rankings", () => {
    return {
        useRankingStore: () => {
            console.log("Mocking Ranking Store");
            return {
                rankings: ref<Media[]>,
                loading: ref<Boolean>,
                getImmutableStore: computed(() => [])
            };
        }
    };
});

// TODO: Genericise
function sortItems(strat: BinaryInsertion, expected: Media[]) {
    while (!strat.Complete) {
        const currentIndex = expected.findIndex(
            (m) => m.id === strat.Current.media.id
        );
        const compareIndex = expected.findIndex(
            (m) => m.id === strat.ComparisonMedia.id
        );

        strat.sort(
            currentIndex > compareIndex
                ? strat.Current.media.id
                : strat.ComparisonMedia.id
        );
    }
}

describe("tests", () => {
    beforeEach(() => {});

    test("ctor", () => {
        const strategy = new BinaryInsertion(BasicMediaList);
        expect(strategy.InitialCollection).toBe(BasicMediaList);
    });

    describe.concurrent("Shift Items", () => {
        test("when the media doesn't exist");

        test("when an item is manually re-ordered, items shift correctly", () => {
            const strategy = new BinaryInsertion(BasicMediaList);
            const englishDragTitle: Media = BasicMediaList[1]; // should be "The Apothecary Diaries"
            const englishDropTitle: Media = BasicMediaList[0]; // should be "Frieren: Beyond Journey's End"
            const dropType: string = "before"; // dropping above Frieren

            BasicMediaList.splice(1, 1);
            BasicMediaList.splice(0, 0, englishDragTitle);

            sortItems(strategy, BasicMediaList);
            // @ts-expect-error dropType is of type string. blame the el-plus devs.
            strategy.shiftItems(
                englishDragTitle.title.english,
                englishDropTitle.title.english,
                dropType
            );

            expect(strategy.CurrentRankings).toStrictEqual(BasicMediaList);
        });
    });
});
