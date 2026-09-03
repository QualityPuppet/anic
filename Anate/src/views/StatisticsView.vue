<script setup lang="ts">
    import type { Media } from "@/types/anilist/MediaListCollections";
    import LineChart from "@/components/charts/LineChart.vue";

    import { useRankingStore } from "@/stores/rankings";
    import { Chart } from "chart.js";

    const rankingStore = useRankingStore();
    Chart.defaults.backgroundColor = "#1d1e1f";

    // const mediaList: Media[] = [
    //     { id: 1, title: { english: "The Apothecary Diaries", romaji: "Kusuriya no Hitorigoto" }, status: StatusTypes.Completed },
    //     { id: 2, title: { english: "Jujutsu Kaisen", romaji: "JJK" }, status: StatusTypes.Completed },
    //     { id: 3, title: { english: "Frieren", romaji: "Sousou no Frieren" }, status: StatusTypes.Completed },
    //     { id: 4, title: { english: "Tensura", romaji: "Tensei Shitara Suraimu Datta Ken" }, status: StatusTypes.Completed },
    //     { id: 5, title: { english: "The Saga of Tanya the Evil", romaji: "Youjo Senki" }, status: StatusTypes.Completed }
    // ];

    // TODO: Check if rankings exist and give a splash page if not
    const distribution: Media[] = rankingStore.getImmutableStore!;
</script>

<template>
    <div>
        <el-row span="12" style="height: 50%" justify="center">
            <div v-if="!distribution">
                <h1>No anime has been ranked yet :(</h1>
                <p style="font-size: 10em; text-align: center">🥺</p>
            </div>
            <LineChart v-if="distribution" :distribution="distribution" />
        </el-row>
    </div>
</template>
