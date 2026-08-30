<script setup lang="ts">
import localforage from 'localforage';

const isDebug = import.meta.env.DEV;
const state = defineModel();

async function DebugTournament() {
    const lastUsedUsername: string = await localforage.getItem("lastUsedUsername") ?? "";

    if (!lastUsedUsername) {
        console.error("ユザーネムーがない、あほか");
    }

    // this used to have a MediaListCollection instantiation.
    // it doesn't now, but who cares! this is for me to mess about in :D
}

if (isDebug) {
    console.warn("Running in debug mode");
    DebugTournament();
}

</script>


<template>
    <div v-if="isDebug">
        <el-collapse>
            <el-collapse-item title="dev panel">
                <el-button @click="DebugTournament()">Debug Tournament</el-button>
                <el-row>
                    <h1>Backend Data:</h1>
                </el-row>
                <el-row>
                    <pre>{{ state }}</pre>
                </el-row>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
