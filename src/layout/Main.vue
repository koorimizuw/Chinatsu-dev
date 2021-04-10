<template>
  <el-container>
    <el-header class="header">
      <h3>Chinatsu.</h3>
      <h3>
        <router-link to="/login"
          ><el-button
            type="primary"
            icon="el-icon-user-solid"
            circle
          ></el-button
        ></router-link>
      </h3>
    </el-header>
    <el-container>
      <el-aside>
        <el-menu class="menu-vertical">
          <router-link v-for="(v, i) in nav" :key="i" :to="v.link">
            <el-menu-item :index="i">
              <i :class="v.icon"></i>
              <template #title>{{ v.name }}</template>
            </el-menu-item>
          </router-link>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import router from "../router";
import firebase from "firebase";
//@ts-ignore
import HelloWorld from "../components/HelloWorld.vue";
const nav = [
  { name: "メイン", link: "/", icon: "el-icon-menu" },
  { name: "データー", link: "/data", icon: "el-icon-document" },
  { name: "設定", link: "/setting", icon: "el-icon-setting" },
];
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.header {
  display: flex;
  justify-content: space-between;
}

.menu-vertical {
  height: 100%;
}
</style>
