<template>
  <h2 class="subtitle">ログアウト</h2>
  <p>一度ログアウトすると、再ログインが必要になります。</p>
  <el-button type="primary" @click="logout()">ログアウト</el-button>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import router from "@/router";
import firebase from "firebase";

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
</script>

<style lang="scss" scoped>
.subtitle {
  margin-top: 0;
}
</style>