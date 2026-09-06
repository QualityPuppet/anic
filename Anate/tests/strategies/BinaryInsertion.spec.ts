import { expect, describe, it, beforeEach, vi, test } from "vitest";
import BinaryInsertion from "../../src/types/strategies/BinaryInsertion";
import { BasicMediaList } from "../_helpers/testData/MediaTestData";
import { createPinia } from "pinia";
import { useRankingStore } from "../../src/stores/rankings";
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

describe("tests", () => {
    beforeEach(() => {});

    test("Binary Insertion constructs", () => {
        const strategy = new BinaryInsertion(BasicMediaList);
        expect(strategy.InitialCollection).toBe(BasicMediaList);
    });
});
