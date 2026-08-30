<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>
    <el-container>
      <el-header class="el-header-override">
        <el-menu mode="horizontal">
          <el-menu-item index="1">
            <RouterLink to="/">Home</RouterLink>
          </el-menu-item>
          <el-menu-item index="2">
            <RouterLink to="/about">About</RouterLink>
          </el-menu-item>
          <el-menu-item index="3">
            <RouterLink to="/ranking">Ranking</RouterLink>
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
</style>