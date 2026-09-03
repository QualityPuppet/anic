<script setup lang="ts">
    import { ref, onMounted, toRaw, onBeforeUnmount, computed } from "vue";
    import { MediaListCollection } from "@/types/anilist/MediaListCollections";
    import type { RankingState } from "@/types/RankingState";
    import type {
        AllowDropType,
        ElTree,
        NodeDropType,
        TreeInstance,
        TreeNode
    } from "element-plus";
    import localforage from "localforage";
    import BinaryInsertionStrategy from "@/types/strategies/BinaryInsertion";
    import { WarnTriangleFilled } from "@element-plus/icons-vue";
    import { useRankingStore } from "@/stores/rankings";

    const state = ref<RankingState>({
        InitialCollection: null,
        Username: "",
        Loading: false
    });

    // TODO: Clean these up into state
    const rankings = ref<BinaryInsertionStrategy>();

    // this can later be used for updates with an append.
    const initialTree = ref<InstanceType<typeof ElTree>>();
    const initialTreeData = ref();

    const rankingTree = ref<TreeInstance>();
    const rankingTreeData = ref();

    // revert this お願い
    const editMode = ref(true);
    const rankingStore = useRankingStore();

    onMounted(async () => {
        // not sure why I can't call `state.value.Username` here. "" should be falsey, but it doesn't fall in.
        // possibly because it's a ref?
        if (state.value.Username === "") {
            state.value.Username =
                (await localforage.getItem("lastUsedUsername")) ?? "";
        }

        // messy messy.
        // sort that out later.
        if (state.value.Username !== "") {
            const collection = new MediaListCollection(state.value.Username);
            const savedRankings = rankingStore.rankings;
            const list = await collection.getFlatList(Boolean(savedRankings));
            initialTreeData.value = list.map((entry) => ({
                label: entry.media.title.english,
                children: [
                    {
                        id: "status",
                        label: entry.media.status,
                        children: []
                    }
                ]
            }));

            rankings.value = new BinaryInsertionStrategy(
                list.map((m) => m.media)
            );

            if (savedRankings) {
                rankings.value.loadRankings(savedRankings!);
            }

            rankingTreeData.value = rankings.value.RankedStore?.map((r) => ({
                label: r.title.english,
                children: []
            }));
        }

        document.addEventListener("keydown", rankingHotkeys);
    });

    onBeforeUnmount(async () => {
        document.removeEventListener("keydown", rankingHotkeys);
    });

    function rankingHotkeys(evt: KeyboardEvent) {
        //TODO: Review, is it possible to be in a state where this causes an error?
        if (!rankings.value?.Current || !rankings.value.ComparisonMedia) {
            return;
        }

        //TODO: This only works on compatible keyboards.
        //dunno who wouldn't have left and right arrows in the same place, but that's a me problem
        if (evt.code === "ArrowLeft" || evt.key === "ArrowLeft") {
            score(1);
        }
        if (evt.code === "ArrowRight" || evt.key === "ArrowRight") {
            score(2);
        }
    }

    function storeUsername() {
        if (!state.value.Username) {
            //TODO: Error handling
            throw new Error(
                "cannae use a username without a username existing. あほ"
            );
        }

        // could maybe make this a debounce?
        localforage.setItem("lastUsedUsername", state.value.Username);
    }

    async function anilistLoad() {
        state.value.Loading = true;
        storeUsername();

        const collection = new MediaListCollection(state.value.Username);
        const list = await collection.getFlatList();

        initialTreeData.value = list.map((entry) => ({
            label: entry.media.title.english,
            children: [
                {
                    id: "status",
                    label: entry.media.status,
                    children: []
                }
            ]
        }));

        rankings.value = new BinaryInsertionStrategy(list.map((m) => m.media));
        rankingTreeData.value = rankings.value.RankedStore?.map((r) => ({
            label: r.title.english,
            children: []
        }));

        state.value.Loading = false;
    }

    async function score(winner: number) {
        rankings.value?.sort(winner);
        const rankedStore = rankings.value?.RankedStore;
        rankingTreeData.value = rankedStore?.map((r) => ({
            label: r.title.english,
            children: []
        }));
        await localforage.setItem("rankings", toRaw(rankedStore));
    }

    async function remove(data: TreeNode) {
        rankingTree.value?.remove(data);
    }

    // a and b need to be defined for the event.
    // the other option is to pass in <null, null, type>, but that just shifts the bad code elsewhere
    const allowDrop = (_a: never, _b: never, type: AllowDropType) => {
        return type !== "inner";
    };
    const handleDrop = async (
        // TODO: just replace this with your own type, typescript won't know lmao
        // Skill issue on the part of the element-plus developers.
        // Their examples use `Node`, `Node` is an in-built type that doesn't have a `data` field.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        draggingNode: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dropNode: any,
        dropType: Exclude<NodeDropType, "none">
    ) => {
        rankings.value?.shiftItems(
            draggingNode.data.label,
            dropNode.data.label,
            dropType
        );
        await localforage.setItem(
            "rankings",
            toRaw(rankings.value?.RankedStore)
        );
    };

    const progress = computed(() => {
        const ranked = rankings.value?.RankedStore.length ?? 0;
        const total = rankings.value?.InitialCollection.length ?? 0;

        return ranked === 0 || total === 0
            ? 0
            : Math.ceil((ranked / total) * 100);
    });
</script>

<template>
    <div>
        <el-row>
            <el-input
                style="width: 40%"
                v-model="state.Username"
                v-on:keyup.enter="anilistLoad"
                class="input-group-button"
                placeholder="Input Username"
            >
                <template #append>
                    <el-button
                        class=""
                        @click="anilistLoad"
                        ref="anilistLoadButton"
                        :loading="state.Loading"
                        >Load From Anilist</el-button
                    >
                </template>
            </el-input>
        </el-row>
        <el-row v-if="rankings?.Current" justify="space-between">
            <!-- TODO: Add idle state -->
            <el-col>
                <el-progress
                    :text-inside="true"
                    :stroke-width="26"
                    style="padding-bottom: 1rem"
                    :percentage="progress"
                />
            </el-col>
            <el-col :span="12">
                <el-card justify="space-between">
                    <el-button
                        @click="
                            () => {
                                score(1);
                            }
                        "
                    >
                        {{ rankings?.Current.media.title.english }}
                    </el-button>
                    <el-tooltip>
                        <template #content>
                            <span
                                >Tap the left arrow key to pick this
                                option</span
                            >
                        </template>
                        <el-icon>
                            <DArrowLeft />
                        </el-icon>
                    </el-tooltip>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card justify="space-between">
                    <el-tooltip>
                        <template #content>
                            <span
                                >Tap the right arrow key to pick this
                                option</span
                            >
                        </template>
                        <el-icon>
                            <DArrowRight />
                        </el-icon>
                    </el-tooltip>
                    <el-button
                        @click="
                            () => {
                                score(2);
                            }
                        "
                    >
                        {{ rankings?.ComparisonMedia?.title.english }}
                    </el-button>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-splitter>
                <el-splitter-panel>
                    <el-card>
                        <template #header>
                            {{ state.Username }} Anilist
                        </template>
                        <el-tree ref="initialTree" :data="initialTreeData" />
                    </el-card>
                </el-splitter-panel>
                <el-splitter-panel v-if="state.Username.length > 0">
                    <el-card>
                        <template #header>
                            <el-row justify="space-between">
                                <el-col :span="16"> Ranked List </el-col>
                                <el-col :span="4">
                                    <el-row>
                                        <!-- TODO: This looks kinda off, misaligned :()-->
                                        <el-checkbox
                                            v-model="editMode"
                                            label="Edit mode enabled"
                                        >
                                            <WarnTriangleFilled
                                                style="height: 1em"
                                            />
                                            Edit mode
                                        </el-checkbox>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </template>
                        <!-- TODO: Replace empty state-->
                        <div v-if="!rankingTreeData">テヘ :3</div>
                        <el-tree
                            v-if="rankingTreeData"
                            ref="rankingTree"
                            :data="rankingTreeData"
                            :draggable="editMode"
                            :allow-drop="allowDrop"
                            @node-drop="handleDrop"
                        >
                            <template #default="{ node }">
                                <div class="editable-tree-node">
                                    <span>{{ node.label }}</span>
                                    <div v-if="editMode">
                                        <el-button
                                            type="danger"
                                            style="margin-left: 4px !important"
                                            link
                                            @click="remove(node)"
                                            >Remove</el-button
                                        >
                                    </div>
                                </div>
                            </template>
                        </el-tree>
                    </el-card>
                </el-splitter-panel>
            </el-splitter>
        </el-row>
    </div>
</template>

<style lang="scss">
    .el-row {
        margin-bottom: 1%;
    }

    .el-input-group__append {
        background-color: var(--el-fill-color-blank) !important;
        color: var(--el-text-color-regular);

        :hover {
            color: var(--el-button-hover-text-color) !important;
            border-color: var(--el-button-hover-border-color) !important;
            background-color: var(--el-button-hover-bg-color) !important;
            outline: none;
        }

        :active {
            color: var(--el-button-active-text-color) !important;
            border-color: var(--el-button-active-border-color) !important;
            background-color: var(--el-button-active-bg-color) !important;
            outline: none;
        }
    }

    .editable-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
