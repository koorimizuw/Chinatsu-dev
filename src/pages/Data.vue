<template></template>

<script setup lang="ts">
import firebase from "firebase";
import router from "../router";
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    router.push("/login");
  }
});
</script>