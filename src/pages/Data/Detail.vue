<template></template>

<script setup lang="ts">
import { ElLoading } from "element-plus";
import firebase from "firebase";
import router from "@/router";
import { onMounted, computed, ref, reactive } from "vue";
import { useStore } from "vuex";

const store = useStore();

const detail = computed(() => store.state.detail);
onMounted(async () => {
  if (detail.value.length === 0) {
    let loadingInstance = ElLoading.service({ fullscreen: true });
    const musicData = await firebase
      .app()
      .functions("asia-northeast1")
      .httpsCallable("getMusicData")();
    store.dispatch("updateMusicData", musicData.data);
    loadingInstance.close();
  }
  if (detail.value.length === 0) {
    router.push("/data");
  }
});
</script>