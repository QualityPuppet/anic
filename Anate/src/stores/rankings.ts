import localforage from "localforage";
import { defineStore } from "pinia";
import { computed, ref, toRaw } from "vue";
import type { Media } from "@/types/anilist/MediaListCollections";

export const useRankingStore = defineStore("rankings", {
    state: () => ({
        rankings: ref<Media[]>()
    }),
    getters: {
        loading(state) {
            return false;
            //return state.rankings?.length;
        },
        getImmutableStore(state) {
            return state.rankings?.map((r) => toRaw(r));
        }
    },
    actions: {
        async initialise() {
            const storedRankings = (await localforage.getItem(
                "rankings"
            )) as Media[];
            console.log(
                "initialising existing store: " +
                    (storedRankings && storedRankings.length > 0)
            );

            if (storedRankings) {
                this.rankings = storedRankings;
            }
        }
    }
});

export type RankingStore = ReturnType<typeof useRankingStore>;
