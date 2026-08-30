<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
const version = __APP_VERSION__;
</script>

<template>
  <div>
    <el-container>
      <el-header class="el-header-override">
        <el-menu mode="horizontal" :ellipsis="false">
          <el-menu-item index="0">
            <RouterLink to="/">Ranking</RouterLink>
          </el-menu-item>
          <el-menu-item index="1">
            <RouterLink to="/about">About</RouterLink>
          </el-menu-item>
          <el-menu-item index="2">
            Version - {{ version }}
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
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