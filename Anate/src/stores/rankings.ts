import localforage from "localforage";
import { defineStore } from "pinia";
import { computed, ref, toRaw } from "vue";
import type { Media } from "@/types/anilist/MediaListCollections";

export const useRankingStore = defineStore("rankings", () => {
    const rankings = ref<Media[]>();
    const loading = ref(true);

    localforage
        .getItem("rankings")
        .then((r) => {
            const storedRankings = r as Media[] | null | undefined;
            if (storedRankings) {
                rankings.value = storedRankings;
            }
        })
        .finally(() => {
            loading.value = false;
        });

    const getImmutableStore = computed(() => {
        const rawRankings = rankings.value?.map((m) => toRaw(m));
        return rawRankings;
    });

    return { rankings, loading, getImmutableStore };
});

export type RankingStore = ReturnType<typeof useRankingStore>;
