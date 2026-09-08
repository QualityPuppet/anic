<script setup lang="ts">
    import type { Media } from "@/types/anilist/MediaListCollections";
    import LineChart from "@/components/charts/LineChart.vue";

    import { useRankingStore } from "@/stores/rankings";
    import { Chart } from "chart.js";

    const rankingStore = useRankingStore();
    Chart.defaults.backgroundColor = "#1d1e1f";

    // TODO: Check if rankings exist and give a splash page if not
    const distribution: Media[] = rankingStore.rankings!; //;.getImmutableStore!;
</script>

<template>
    <div>
        <el-row span="12" style="height: 50%" justify="center">
            <div v-if="!distribution">
                <h1>No anime has been ranked yet :(</h1>
                <p style="font-size: 10em; text-align: center">🥺</p>
                <p style="font-size: 10em; text-align: center">👉👈</p>
            </div>
            <LineChart v-if="distribution" :distribution="distribution" />
        </el-row>
    </div>
</template>
