<template>
  <el-menu class="menu-vertical">
    <router-link
      v-for="(v, i) in nav"
      :key="v.name"
      :to="v.children.length > 0 ? '' : v.link"
    >
      <el-menu-item v-if="v.children.length === 0" :index="i">
        <i :class="v.icon"></i>
        <template #title>{{ v.name }}</template>
      </el-menu-item>
      <el-submenu v-if="v.children.length > 0">
        <template #title>
          <i :class="v.icon"></i>
          <span>{{ v.name }}</span>
        </template>
        <router-link
          v-for="(opt, j) in v.children"
          :key="opt.name"
          :to="opt.link"
        >
          <el-menu-item :index="`${i}-${j}`">{{ opt.name }}</el-menu-item>
        </router-link>
      </el-submenu>
    </router-link>
  </el-menu>
</template>

<script setup lang="ts">
import {} from "vue";
const nav = [
  { name: "メイン", link: "/", icon: "el-icon-menu", children: [] },
  {
    name: "データー",
    link: "",
    icon: "el-icon-document",
    children: [
      { name: "ユーザー", link: "/data", icon: "", children: [] },
      { name: "プレイ履歴", link: "/data/playlog", icon: "", children: [] },
      { name: "楽曲データー", link: "/data/detail", icon: "", children: [] },
      { name: "レーティング", link: "/data/rating", icon: "", children: [] },
    ],
  },
  { name: "設定", link: "/setting", icon: "el-icon-setting", children: [] },
];
</script>