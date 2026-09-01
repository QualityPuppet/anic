<script setup lang="ts">
import type { Media } from '@/types/anilist/MediaListCollections';
import { StatusTypes } from '@/types/anilist/StatusTypes';
import { onMounted } from 'vue';
// TODO: Fix :(
// @ts-expect-error "I'm not writing a d.ts file for that"
import Statistics from 'statistics.js';
import LineChart from '@/components/charts/LineChart.vue';


//import { useRankingStore } from '@/stores/rankings';

//const rankingStore = useRankingStore()

const mediaList: Media[] = [
    { id: 1, title: { english: "The Apothecary Diaries", romaji: "Kusuriya no Hitorigoto" }, status: StatusTypes.Completed },
    { id: 2, title: { english: "Jujutsu Kaisen", romaji: "JJK" }, status: StatusTypes.Completed },
    { id: 3, title: { english: "Frieren", romaji: "Sousou no Frieren" }, status: StatusTypes.Completed },
    { id: 4, title: { english: "Tensura", romaji: "Tensei Shitara Suraimu Datta Ken" }, status: StatusTypes.Completed },
    { id: 5, title: { english: "The Saga of Tanya the Evil", romaji: "Youjo Senki" }, status: StatusTypes.Completed }
];
const columns = {
    id: 'ordinal',
    position: 'interval'
}

const settings = {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let distribution: any[] = [];

onMounted(() => {
    const data = [];

    for (const media in mediaList) {
        data.push({ position: media, id: mediaList[media]?.id })
    }
    const stats = new Statistics(data, columns, settings);
    distribution = Object.entries(stats.normalDistribution(0, 0.3)).map(d => [Number(d[0]), d[1]]).sort((a, b) => Number(a[0]) - Number(b[0]));
    console.log(distribution);
})

</script>

<template>
    <div>
        Base page for automating statistics bell curve
        <LineChart :distribution="distribution" />
    </div>
</template>