<template>
  <h2 class="subtitle">ブックマーク生成</h2>
  <p>
    既にブックマークの生成を行った場合は「ブックマークを表示」をクリックしてください
    <br />再生成すると以前のブックマークが<b>使用できなく</b>なります。
  </p>
  <p>
    生成したことがない場合は「新しいブックマークを生成」をクリックしてください。
  </p>
  <el-button type="primary" @click="showKey()">ブックマークを表示 </el-button>
  <el-button type="danger" @click="createKey()"
    >新しいブックマークを生成</el-button
  >
  <div style="margin: 20px 0"></div>
  <el-input v-if="secretKey" type="textarea" autosize v-model="bookmarklet" />
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { getFunctions, isMobile } from "@/utils";
import { ref, computed } from "vue";

const secretKey = ref("");

const bookmarklet = computed(() => {
  return `javascript: (function (d, s, t) {t = d.createElement("chinatsu-token");t.textContent = "${secretKey.value}";d.getElementsByTagName("head")[0].appendChild(t);s = d.createElement("script");s.src = "https://chinatsu-dev.github.io/chinatsu-pub/getOngekiScore.js";d.getElementsByTagName("head")[0].appendChild(s);})(document);`;
});

const showKey = async () => {
  await getFunctions()
    .httpsCallable("getKey")()
    .then((res) => {
      secretKey.value = res.data;
    })
    .catch((_) => {
      ElMessage.error("エラーが発生しました。");
    });
};
const createKey = async () => {
  await getFunctions()
    .httpsCallable("createKey")()
    .then((res) => {
      secretKey.value = res.data.key;
    })
    .catch((_) => {
      ElMessage.error("エラーが発生しました。");
    });
};
</script>

<style lang="scss" scoped>
.subtitle {
  margin-top: 0;
}
.el-button {
  margin-left: 10px;
}
.el-button + .el-button {
  @media (max-width: 768px) {
    margin-top: 10px;
  }
}
</style>