<template>
  <el-tabs class="container" :tab-position="isMobile() ? 'top' : 'left'">
    <el-tab-pane label="アカウント">
      <h2 class="subtitle">ログアウト</h2>
      <p>一度ログアウトすると、再ログインが必要になります。</p>
      <el-button type="primary" @click="logout()">ログアウト</el-button>
    </el-tab-pane>
    <el-tab-pane label="ブックマーク">
      <h2 class="subtitle">ブックマーク生成</h2>
      <p>
        既にブックマークの生成を行った場合は「ブックマークを表示」をクリックしてください
        <br />再生成すると以前のブックマークが使用できなくなります。
      </p>
      <p>
        生成したことがない場合は「新しいブックマークを生成」をクリックしてください。
      </p>
      <el-button type="primary" @click="showKey()"
        >ブックマークを表示
      </el-button>
      <el-button type="danger" @click="createKey()"
        >新しいブックマークを生成</el-button
      >
      <div style="margin: 20px 0"></div>
      <el-input
        v-if="secretKey"
        type="textarea"
        autosize
        v-model="bookmarklet"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import router from "@/router";
import { getFunctions, isMobile } from "@/utils";
import { ref, computed } from "vue";
import firebase from "firebase";

const secretKey = ref("");

const logout = async () => {
  await firebase
    .auth()
    .signOut()
    .then((_) => {
      ElMessage.success("ログアウトされました。");
      router.push("/");
    })
    .catch((_) => {
      ElMessage.success("ログアウトエラー。");
    });
};

const bookmarklet = computed(() => {
  return `javascript: (function (d, s, t) {t = d.createElement("chinatsu-token");t.textContent = "${secretKey.value}";d.getElementsByTagName("head")[0].appendChild(t);s = d.createElement("script");s.src = "https://firebasestorage.googleapis.com/v0/b/chinatsu-dev.appspot.com/o/getOngekiScore.js?alt=media&token=51c3e5e2-691c-4a33-a5de-e745f36cd462";d.getElementsByTagName("head")[0].appendChild(s);})(document);`;
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

.container {
  margin: 0 10px;
}
</style>