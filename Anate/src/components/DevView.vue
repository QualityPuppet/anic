<script setup lang="ts">
import { MediaListCollection } from '@/types/anilist/MediaListCollections';
import { TournamentStrategy } from '@/types/strategies/TournamentStrategy';
import localforage from 'localforage';

const isDebug = import.meta.env.DEV;
console.warn("Running in debug mode");

async function DebugTournament() {
    const lastUsedUsername: string = await localforage.getItem("lastUsedUsername") ?? "";

    if (!lastUsedUsername) {
        console.log("ユザーネムーがない、あほか");
    }

    const mediaCollection = MediaListCollection.flattenLists(await new MediaListCollection(lastUsedUsername).getLocal());
    const rankingStrategy = new TournamentStrategy(mediaCollection.map(m => m.media));
    rankingStrategy.generatePairs();
}

DebugTournament();
</script>


<template>
    <div v-if="isDebug">
        <el-collapse>
            <el-collapse-item title="dev panel">
                <el-button @click="DebugTournament()">Debug Tournament</el-button>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
