<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import DevView from '@/components/DevView.vue';
import { useRankingStore } from './stores/rankings';
import getVersion from './types/versioning'

const version = __APP_VERSION__;
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
          <el-menu-item index="3">
            Version - {{ getVersion(version) }}
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

<style lang="css">
.el-header-override {
  padding: 0px !important;
}

.el-menu--horizontal>.el-menu-item:nth-child(2) {
  margin-right: auto;
  padding-right: 1rem
}
</style>