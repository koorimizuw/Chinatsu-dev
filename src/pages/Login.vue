<template>
  <div v-if="pending">Wait..</div>
  <h2 v-if="islogin">ログインしています。</h2>
  <div v-if="!islogin">
    <h1>Login</h1>
    <el-input v-model="email" placeholder="E-Mail" clearable></el-input>
    <el-input
      v-model="password"
      placeholder="Password"
      show-password
    ></el-input>
    <el-button type="primary" @click="submit()">ログイン</el-button>
    <el-button type="primary" @click="twitter()">ツイーターログイン</el-button>
    <el-button type="primary" @click="github()">Githubログイン</el-button>
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
    islogin.value = true;
  }
});

const showError = (msg) => {
  switch (msg) {
    case "auth/invalid-email":
      ElMessage.error("アカウントが存在しません。");
      break;
    case "auth/wrong-password":
      ElMessage.error("パスワードが間違います。");
      break;
    default:
      ElMessage.error("ログインに失敗しました。");
  }
};

const twitter = async () => {
  var provider = new firebase.auth.TwitterAuthProvider();
  await firebase
    .auth()
    .signInWithPopup(provider)
    .then((_) => {
      ElMessage.success("ログインされました。");
    })
    .catch((e) => {
      showError(e.code);
    });
};

const github = async () => {
  var provider = new firebase.auth.GithubAuthProvider();
  await firebase
    .auth()
    .signInWithPopup(provider)
    .then((_) => {
      ElMessage.success("ログインされました。");
    })
    .catch((e) => {
      showError(e.code);
    });
};

const submit = async () => {
  await firebase
    .auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then((_) => {
      ElMessage.success("ログインされました。");
    })
    .catch((e) => {
      showError(e.code);
    });
};
</script>