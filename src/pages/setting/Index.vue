<template>
  <el-tabs class="container" :tab-position="isMobile() ? 'top' : 'left'">
    <el-tab-pane label="アカウント">
      <Account />
    </el-tab-pane>
    <el-tab-pane label="ブックマーク">
      <Bookmarklet />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { isMobile } from "@/utils";

//@ts-ignore
import Bookmarklet from "./Bookmarklet.vue";
//@ts-ignore
import Account from "./Account.vue";
</script>

<style lang="scss" scoped>
.container {
  margin: 0 10px;
}
</style>