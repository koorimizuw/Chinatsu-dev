<template>
  <div v-if="pending">Wait..</div>
  <h2 v-if="islogin">ログインしています。</h2>
  <div v-if="!islogin">
    <div class="container">
      <h1 style="font-size: 2em">ログイン</h1>
      <el-input v-model="email" placeholder="E-Mail" clearable></el-input>
      <el-input
        v-model="password"
        placeholder="Password"
        show-password
      ></el-input>
      <div class="btns">
        <el-button class="btn" @click="submit()">ログイン </el-button>
        <el-divider />
        <el-button class="btn" type="primary" @click="twitter()"
          >Twitterでログイン
        </el-button>
        <el-button class="btn" type="primary" @click="github()"
          >Githubでログイン
        </el-button>
      </div>
      <el-divider />
      <h1>Get's started!</h1>
      <router-link to="/register">
        <el-button class="btn" type="success">新規登録</el-button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import firebase from "firebase";
import router from "@/router";

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

const login = async (provider: firebase.auth.TwitterAuthProvider) => {
  await firebase
    .auth()
    .signInWithPopup(provider)
    .then((_) => {
      ElMessage.success("ログインされました。");
      router.push("/data");
    })
    .catch((e) => {
      console.log(e);
      showError(e.code);
    });
};

const twitter = async () => {
  var provider = new firebase.auth.TwitterAuthProvider();
  await login(provider);
};

const github = async () => {
  var provider = new firebase.auth.GithubAuthProvider();
  await login(provider);
};

const submit = async () => {
  await firebase
    .auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then((_) => {
      ElMessage.success("ログインされました。");
      router.push("/data");
    })
    .catch((e) => {
      showError(e.code);
    });
};
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  max-width: 480px;
  padding: 50px;
  border: 1px solid rgb(196, 196, 196);
  border-radius: 1%;
  .el-input {
    margin-bottom: 10px;
  }
}

.btns {
  margin-top: 30px;
}

.btn {
  width: 100%;
  margin-left: 0;
  margin-bottom: 10px;
}
</style>