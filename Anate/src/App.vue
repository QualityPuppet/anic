<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import DevView from "@/components/DevView.vue";
import { useRankingStore } from "./stores/rankings";
import getVersion from "./types/versioning";

const version = __APP_VERSION__
const rankingStore = useRankingStore();
</script>

<template>
  <div>
    <el-container v-loading="!rankingStore || rankingStore.loading">
      <el-header class="el-header-override">
        <el-menu mode="horizontal" :ellipsis="false">
          <el-menu-item index="0">
            <RouterLink to="/">Ranking</RouterLink>
          </el-menu-item>
          <el-menu-item index="1">
            <RouterLink to="/statistics">Statistics</RouterLink>
          </el-menu-item>
          <el-menu-item index="2">
            <RouterLink to="/about">About</RouterLink>
          </el-menu-item>
          <el-menu-item disabled class="prevent-hover" index="3">
            {{ getVersion(version) }}
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <DevView />
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss">
.el-header-override {
  padding: 0px !important;
}

/* 
  why two? who knows.
  also this is all pretty jank code, I should probably do this properly,
  but it's a one off so we can avoid a clickable version on hover.
  professional software development taught me pragmatism, which is my excuse to be lazy.
*/
.el-menu--horizontal>.el-menu-item:nth-last-child(2) {
  margin-right: auto;
  padding-right: 1rem;
}

.prevent-hover {
  background-color: var(--el-menu-bg-color) !important;
  color: var(--el-menu-text-color) !important;
  cursor: url(./assets/Rimuru.png), default !important;
  opacity: 1 !important;
}
</style>
