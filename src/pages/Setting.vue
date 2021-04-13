<template>
  <el-tabs tab-position="left">
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
        >ブックマークを表示</el-button
      >
      <el-button type="danger" @click="createKey()"
        >新しいブックマークを生成</el-button
      >
      <div style="margin: 20px 0"></div>
      <el-input v-if="bookMark" type="textarea" autosize v-model="bookMark">
      </el-input>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import router from "@/router";
import { getFunctions } from '@/utils'
import { ref } from "vue";
import firebase from "firebase";

const bookMark = ref("");

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

const showKey = async () => {};
const createKey = async () => {
  await getFunctions()
    .httpsCallable("createKey")()
    .then((res) => {
      bookMark.value = res.data.key;
    })
    .catch((e) => {
      ElMessage.error("エラーが発生しました。");
    });
};
</script>

<style lang="scss" scoped>
.subtitle {
  margin-top: 0;
}
</style>