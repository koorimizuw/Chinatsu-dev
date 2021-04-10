<template>
  <div v-if="pending">Wait..</div>
  <div v-if="islogin">
    <button>Logout</button>
  </div>
  <div v-if="!islogin">
    <h1>Login</h1>
    <el-input v-model="email" placeholder="E-Mail" clearable></el-input>
    <el-input
      v-model="password"
      placeholder="Password"
      show-password
    ></el-input>
    <button @click="submit()">submit</button>
    <router-link to="/register">register</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import firebase from "firebase";
//import router from "../router";

const email = ref("");
const password = ref("");

const pending = ref(true);
const islogin = ref(false);

firebase.auth().onAuthStateChanged((user) => {
  pending.value = false;
  if (user) {
    ElMessage.success("ログインされました。");
    islogin.value = true;
  }
});

const submit = async () => {
  await firebase
    .auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .catch((e) => {
      switch (e.code) {
        case "auth/invalid-email":
          ElMessage.error("アカウントが存在しません。");
          break;
        case "auth/wrong-password":
          ElMessage.error("パスワードが間違います。");
          break;
        default:
          ElMessage.error("ログインに失敗しました。");
      }
    });
};
</script>