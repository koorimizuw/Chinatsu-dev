<template>
  <h1>Register</h1>
  <el-input v-model="email" placeholder="E-Mail" clearable></el-input>
  <el-input v-model="password" placeholder="Password" show-password></el-input>
  <button @click="submit()">submit</button>
  <button @click="twitter()">reigister with twitter</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import firebase from "firebase";
import router from "../router";

const email = ref("");
const password = ref("");

const submit = async () => {
  await firebase
    .auth()
    .createUserWithEmailAndPassword(email.value, password.value)
    .then((res) => {
      if (res.user) {
        router.push("/data");
      }
    })
    .catch((e) => {
      console.log(e.code);
      console.log(e.message);
    });
};

const twitter = async () => {
  var provider = new firebase.auth.TwitterAuthProvider();
  await firebase
    .auth()
    .signInWithPopup(provider)
    .then((res) => {
      const credential: firebase.auth.OAuthCredential = res.credential;
      const token = credential.accessToken;
      const secret = credential.secret;
      console.log(res.user);
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });
};
</script>