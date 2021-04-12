<template>
  <div class="container">
    <h1 style="font-size: 2em">新規登録</h1>
    <el-input v-model="email" placeholder="E-Mail" clearable></el-input>
    <el-input
      v-model="password"
      placeholder="Password"
      show-password
    ></el-input>
    <el-input
      v-model="repassword"
      placeholder="Type password again"
      show-password
    ></el-input>
    <div class="btns">
      <el-button class="btn" @click="submit()">ログイン </el-button>
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
const repassword = ref("");

const showError = (msg) => {
  switch (msg) {
    case "auth/invalid-email":
      ElMessage.error("無効なメールアドレスです。");
      break;
    case "auth/weak-password":
      ElMessage.error("パスワードが弱いです。");
      break;
    case "auth/wrong-password":
      ElMessage.error("パスワードが間違います。");
      break;
    default:
      ElMessage.error("新規登録に失敗しました。");
  }
};

const submit = async () => {
  if (password.value !== repassword.value) {
    ElMessage.error("パスワードが一致していません。");
    return;
  }

  await firebase
    .auth()
    .createUserWithEmailAndPassword(email.value, password.value)
    .then((res) => {
      if (res.user) {
        ElMessage.success("ログインされました。");
        router.push("/data");
      }
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