<script setup lang="ts">
    import { useRankingStore } from "@/stores/rankings";
    import localforage from "localforage";

    const isDebug = import.meta.env.DEV;
    // hm. dev panel doesn't actually work how it's intended to at the moment.
    // shanner, but there's bigger fish to fry.
    const state = defineModel();
    //const theme = useColorMode();

    // const isDark = useDark()
    // const toggleDark = useToggle(isDark)

    const rankingStore = useRankingStore();

    async function Debug() {
        const lastUsedUsername: string =
            (await localforage.getItem("lastUsedUsername")) ?? "";

        if (!lastUsedUsername) {
            console.error("ユザーネムーがない、あほか");
        }

        // this used to have a MediaListCollection instantiation.
        // it doesn't now, but who cares! this is for me to mess about in :D
    }

    if (isDebug) {
        console.warn("Running in debug mode");
    }

    const loadTime = "Dev Panel - " + new Date().toISOString();
</script>

<template>
    <div v-if="isDebug">
        <el-collapse class="dev-panel">
            <el-collapse-item :title="loadTime">
                <el-button @click="Debug()">Debug</el-button>
                <el-button>Dark Mode Toggle (does nothing atm lol)</el-button>
                <el-row>
                    <h1>Backend Data:</h1>
                </el-row>
                <el-row>
                    <pre>{{ state }}</pre>
                </el-row>
                <el-row>
                    <pre>{{ rankingStore }}</pre>
                </el-row>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<style lang="scss">
    .dev-panel {
        background-color: darkred;
    }
</style>
