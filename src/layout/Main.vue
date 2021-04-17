<template>
  <el-container>
    <el-header class="header">
      <h3>Chinatsu.</h3>
      <h3>
        <el-button
          class="menu-icon"
          @click="drawer = true"
          icon="el-icon-menu"
          circle
        ></el-button>
      </h3>
    </el-header>
    <el-container>
      <el-drawer
        title="Menu"
        v-model="drawer"
        direction="left"
        destroy-on-close
      >
        <Menu />
      </el-drawer>
      <el-aside class="aside">
        <Menu />
      </el-aside>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
//@ts-ignore
import Menu from "./Menu.vue";
import { ref } from "vue";

const drawer = ref(false);
</script>

<style lang="scss">
html {
  font-family: "Noto Sans JP", sans-serif;
}
a {
  text-decoration: none;
}

.el-drawer {
  margin-left: 30px;
  margin-top: 30px;
  min-width: 280px;
  height: 50% !important;
}

.el-drawer__body {
  overflow: scroll;
}
</style>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
}

.menu-vertical {
  height: 100%;
}

.menu-icon {
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
}

.aside {
  @media (max-width: 1024px) {
    width: 200px !important;
  }
  @media (max-width: 768px) {
    display: none;
  }
}

.main {
  @media (max-width: 768px) {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
