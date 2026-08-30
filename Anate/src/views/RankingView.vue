<script setup lang="ts">
import { ref, onMounted, toRaw } from 'vue'
import { MediaListCollection } from '@/types/anilist/MediaListCollections';
import type { IRankingState } from '@/types/RankingState';
import type { ElTree } from 'element-plus';
import DevView from '@/components/DevView.vue';
import localforage from 'localforage';
import { BinaryInsertionStrategy } from '@/types/strategies/BinaryInsertion';


const state = ref<IRankingState>({
    InitialCollection: null,
    Rankings: null,
    TreeData: [],
    Username: "",
})

const rankings = ref<BinaryInsertionStrategy>();

// this can later be used for updates with an append.
const initialTree = ref<InstanceType<typeof ElTree>>();
const initialTreeData = ref();

const rankingTree = ref()
const rankingTreeData = ref()

onMounted(async () => {
    // not sure why I can't call `state.value.Username` here. "" should be falsey, but it doesn't fall in.
    // possibly because it's a ref?
    if (state.value.Username === "") {
        state.value.Username = await localforage.getItem("lastUsedUsername") ?? "";
    }

    // messy messy.
    // sort that out later.
    state.value.InitialCollection = new MediaListCollection(state.value.Username);
    const flatList = await state.value.InitialCollection.getFlatList(true);

    initialTreeData.value =
        flatList.map(entry => ({
            label: entry.media.title.english,
            children:
                Object.entries(entry.media).map(m => {
                    return { id: m[0], label: m[1] }
                })
        }));
})

function storeUsername() {
    if (!state.value.Username) {
        //TODO: Error handling
        throw new Error("cannae use a username without a username existing. あほ")
    }

    // could maybe make this a debounce?
    localforage.setItem("lastUsedUsername", state.value.Username)
}

async function graphql() {
    storeUsername();

    const collection = new MediaListCollection(state.value.Username);
    const flatList = MediaListCollection.flattenLists(await collection.getLists());

    initialTreeData.value =
        flatList.map(entry => ({
            label: entry.media.title.english,
            children: [
                {
                    id: 'status',
                    label: entry.media.status,
                    children: []
                }
            ]
        }))
}

async function localStore() {
    storeUsername();

    const collection = new MediaListCollection(state.value.Username);
    const flatList = MediaListCollection.flattenLists(await collection.getLocal())

    initialTreeData.value =
        flatList.map(entry => ({
            label: entry.media.title.english,
            children: [
                {
                    id: 'status',
                    label: entry.media.status,
                    children: []
                }
            ]
        }))
}

async function start() {
    if (!state.value.InitialCollection || state.value.InitialCollection.lists.length === 0) {
        if (state.value.Username) {
            //TODO: Error Handling
            throw new Error("It brings me joy to see someone trying to rank thin air. by which I mean annoyance.")
        }
        state.value.InitialCollection = new MediaListCollection(state.value.Username);
    }

    const list = await state.value.InitialCollection?.getFlatList();

    rankings.value = new BinaryInsertionStrategy(list.map(m => m.media));

}

async function continueSort() {
    if (!state.value.InitialCollection || state.value.InitialCollection.lists.length === 0) {
        if (state.value.Username) {
            //TODO: Error Handling
            throw new Error("It brings me joy to see someone trying to rank thin air. by which I mean annoyance.")
        }
        state.value.InitialCollection = new MediaListCollection(state.value.Username);
    }

    const list = await state.value.InitialCollection?.getFlatList();
    rankings.value = new BinaryInsertionStrategy(list.map(m => m.media));
    rankings.value.populateFromSaved(await localforage.getItem("rankings") ?? [])
    rankingTreeData.value = rankings.value.RankedStore?.map(r => ({ label: r.title.english, children: [] }));
}

async function score(winner: number) {
    rankings.value?.sort(winner)
    const rankedStore = rankings.value?.RankedStore;
    rankingTreeData.value = rankedStore?.map(r => ({ label: r.title.english, children: [] }));


    await localforage.setItem("rankings", toRaw(rankedStore))
}
</script>

<template>
    <div>
        <dev-view />
        <el-row>
            {{ new Date().toISOString() }}
        </el-row>
        <el-row>
            <el-input style="width: 40%" v-model="state.Username" />
            <el-button @click="graphql">Load From Anilist</el-button>
            <el-button @click="localStore">Load From Local Storage</el-button>
            <el-button @click="start">始まる</el-button>
            <el-button @click="continueSort">続く</el-button>
        </el-row>
        <el-row>
            <!-- TODO: Add idle state -->
            <el-col :span="12" v-if="state.Rankings?.CurrentPair !== null">
                <el-card>
                    <el-button @click="() => { score(1) }">
                        {{ rankings?.Current.media.title.english }}
                    </el-button>
                </el-card>
            </el-col>
            <el-col :span="12" v-if="state.Rankings?.CurrentPair !== null">
                <el-card>
                    <el-button @click="() => { score(2) }">
                        {{ rankings?.ComparisonMedia?.title.english }}
                    </el-button>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-splitter>
                <el-splitter-panel>
                    <el-card>
                        <template #header> {{ state.Username }} Anilist </template>
                        <el-tree ref="initialTree" :data="initialTreeData" />
                    </el-card>
                </el-splitter-panel>
                <el-splitter-panel v-if="state.Username.length > 0">
                    <template #header> Ranked List</template>
                    <el-card>
                        <!-- TODO: Replace empty state-->
                        <div v-if="!rankingTreeData">テヘ :3</div>
                        <el-tree v-if="rankingTreeData != null" ref="rankingTree" :data="rankingTreeData" />
                    </el-card>
                </el-splitter-panel>
            </el-splitter>
        </el-row>

        <!-- debug, remove later or smth-->
        <el-row>
            <h1>Backend Data:</h1>
        </el-row>
        <el-row>
            <pre>{{ state }}</pre>
        </el-row>
    </div>
</template>

<style>
.el-row {
    margin-bottom: 1%
}
</style>