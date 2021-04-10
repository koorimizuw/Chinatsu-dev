<template>
  <h1>Register</h1>
  <el-input v-model="email" placeholder="E-Mail" clearable></el-input>
  <el-input v-model="password" placeholder="Password" show-password></el-input>
  <button @click="submit()">submit</button>
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
</script>