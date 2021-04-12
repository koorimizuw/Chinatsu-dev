<template>
  <el-card v-if="!noData" class="box-card">
    <template #header>
      <div class="card-header">
        <el-tag>{{ profile.trophy }}</el-tag>
        <div class="name">{{ profile.user_name }}</div>
      </div>
    </template>
    <div class="info-row">
      <div>レベル</div>
      <div>{{ profile.reincarnation_num }}{{ profile.level }}</div>
    </div>
    <div class="info-row">
      <div>バトルポイント</div>
      <div>{{ profile.battle_point }}</div>
    </div>
    <div class="info-row">
      <div>レーティング</div>
      <div>{{ profile.player_rating }} (MAX {{ profile.highest_rating }})</div>
    </div>
    <div class="info-row">
      <div>マニー</div>
      <div>{{ profile.jewel_count }} (MAX {{ profile.total_jewel_count }})</div>
    </div>
    <div class="info-row">
      <div>トータルプレイ</div>
      <div>{{ profile.play_count }}</div>
    </div>
    <el-divider content-position="left">コメント</el-divider>
    <div>{{ profile.comment }}</div>
    <el-divider></el-divider>
    <div class="card-footer">
      <p>
        <router-link to="/data/playlog">
          <el-button class="btn" type="primary">プレイ履歴</el-button>
        </router-link>
      </p>
      <p><el-button class="btn" type="primary">楽曲データー</el-button></p>
      <p><el-button class="btn" type="primary">レーティング</el-button></p>
    </div>
  </el-card>
  <div v-if="noData">
    <h1>データーはありません</h1>
    <p>
      当サイトの
      <router-link to="/setting">
        <el-link type="primary">設定</el-link>
      </router-link>
      ページからブックマークを取得して、データーを登録してください。
    </p>
  </div>
</template>

<script setup lang="ts">
import { ElLoading } from "element-plus";
import firebase from "firebase";
import { onMounted, computed, ref } from "vue";
import { useStore } from "vuex";
import { getUserInfo } from "./util";

const noData = ref(false);

const store = useStore();

const profile = computed(() => store.state.profile);
onMounted(async () => {
  if (Object.keys(profile.value).length === 0) {
    let loadingInstance = ElLoading.service({ fullscreen: true });
    const profileData = await getUserInfo();
    store.dispatch("updateProfile", profileData);
    loadingInstance.close();
  }
  if (Object.keys(profile.value).length === 0) {
    noData.value = true;
  }
});
</script>

<style lang="scss" scoped>
.box-card {
  max-width: 800px;
}

.name {
  margin-top: 10px;
  font-size: 1.6em;
}

.info-row {
  display: flex;
  margin: 10px 0;
  font-size: 0.9em;
  color: #555;
  :first-child {
    width: 200px;
  }
}

.btn {
  width: 100%;
}
</style>