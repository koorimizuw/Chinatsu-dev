<template>
  <h2>
    フィルター<el-button
      class="title-icon"
      :icon="filterOpen ? `el-icon-arrow-up` : `el-icon-arrow-down`"
      circle
      @click="openFilter"
    ></el-button>
  </h2>
  <div v-if="filterOpen">
    <div class="subtitle">難易度</div>
    <p>
      <el-checkbox-group v-model="opts.diff">
        <el-checkbox-button
          v-for="opts in diffOptions"
          :label="opts"
          :key="opts"
          >{{ opts }}
        </el-checkbox-button>
      </el-checkbox-group>
    </p>
  </div>
  <el-table
    :data="playlog"
    border
    style="width: 100%"
    :row-class-name="tableRowClassName"
  >
    <el-table-column prop="play_date" label="プレイ日時" width="160">
    </el-table-column>
    <el-table-column prop="music_name" label="楽曲名"> </el-table-column>
    <el-table-column prop="diff" label="難易度" width="100"> </el-table-column>
    <el-table-column prop="technical_score" label="テクニカルスコア">
    </el-table-column>
    <el-table-column prop="battle_score" label="バトルスコア">
    </el-table-column>
    <el-table-column prop="judge_critical_break" label="CBk" width="60">
    </el-table-column>
    <el-table-column prop="judge_break" label="Bk" width="60">
    </el-table-column>
    <el-table-column prop="judge_hit" label="Hit" width="60"> </el-table-column>
    <el-table-column prop="judge_miss" label="Miss" width="60">
    </el-table-column>
    <el-table-column prop="place_name" label="店舗"> </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ElLoading } from "element-plus";
import firebase from "firebase";
import { onMounted, computed, ref, reactive } from "vue";
import { useStore } from "vuex";

const filterOpen = ref(false);
const opts = reactive({
  diff: [],
});
const diffOptions = ["Basic", "Advanced", "Expert", "Master", "Lunatic"];

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

const openFilter = () => {
  filterOpen.value = !filterOpen.value;
};

const tableRowClassName = ({ row }) => {
  switch (row.diff) {
    case 0:
      return "basic";
    case 1:
      return "advanced";
    case 2:
      return "expert";
    case 3:
      return "master";
    case 10:
      return "lunatic";
  }
};
</script>

<style lang="scss">
.el-table {
  .basic {
    background: #f1f8e9 !important;
  }
  .advanced {
    background: #fffde7 !important;
  }
  .expert {
    background: #fce4ec !important;
  }
  .master {
    background: #f3e5f5 !important;
  }
  .lunatic {
    background: #fafafa !important;
  }
}
</style>

<style lang="scss" scoped>
.title {
  &-icon {
    margin-left: 20px;
  }
}
.subtitle {
  font-size: 1.35em;
}
</style>