<template>
  <el-table :data="playlog" border style="width: 100%">
    <el-table-column prop="playDate" label="プレイ日時" width="160">
    </el-table-column>
    <el-table-column prop="musicName" label="楽曲名"> </el-table-column>
    <el-table-column prop="diff" label="難易度" width="100"> </el-table-column>
    <el-table-column prop="technicalScore" label="テクニカルスコア">
    </el-table-column>
    <el-table-column prop="battleScore" label="バトルスコア"> </el-table-column>
    <el-table-column prop="judgeCriticalBreak" label="CBk" width="60">
    </el-table-column>
    <el-table-column prop="judgeBreak" label="Bk" width="60"> </el-table-column>
    <el-table-column prop="judgeHit" label="Hit" width="60"> </el-table-column>
    <el-table-column prop="judgeMiss" label="Miss" width="60">
    </el-table-column>
    <el-table-column prop="placeName" label="店舗"> </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ElLoading } from "element-plus";
import firebase from "firebase";
import router from "../../router";
import { onMounted, computed } from "vue";
import { useStore } from "vuex";

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    router.push("/login");
  }
});

const store = useStore();

const playlog = computed(() => store.state.playlog);
onMounted(async () => {
  if (playlog.value.length === 0) {
    let loadingInstance = ElLoading.service({ fullscreen: true });
    const playlogData = await firebase
      .app()
      .functions("asia-northeast1")
      .httpsCallable("getPlaylog")();
    store.dispatch("updatePlaylog", playlogData.data);
    loadingInstance.close();
  }
});
</script>